import React from "react";
import PropTypes from "prop-types";
import SnakePart from "./SnakePart.js";

export default class Snake extends React.Component {
    constructor(props) {
        super(props);
        const {x, y} = this.props;
        this.initialState = {
            partsList: [
                {x, y},
                {x: x+1, y},
                {x: x+2, y}
            ],
            length: 3,
        }
        this.state = this.initialState;
        this.update = this.update.bind(this);
        this.move = this.move.bind(this);
        this.die = this.die.bind(this);
        this.eat = this.eat.bind(this);
    }

    update(now) {
        if (now - this.before > 1000 / this.state.length + 100) {
            this.move();
            this.before = now;
        }
        this.animationID = window.requestAnimationFrame(this.update);  
    }

    componentDidMount() { 
        this.before = 0;
        this.animationID = window.requestAnimationFrame(this.update);
    }
    
    componentWillUnmount() {
        window.cancelAnimationFrame(this.animationID);
    }

    getDirectionFromCoordinates(fromCoordinates, toCoordinates) {
        if (!fromCoordinates || !toCoordinates) return
        const { x: fromX, y: fromY } = fromCoordinates;
        const { x: toX, y: toY } = toCoordinates;
        const [xDiff, yDiff] = [fromX-toX, fromY-toY];
        if (yDiff === 0) {
            if (xDiff === 1) return 'left';
            if (xDiff === -1) return 'right';
        }
        if (xDiff === 0) {
            if (yDiff === 1) return 'up';
            if (yDiff === -1) return 'down';
        }
    }

    getPartElementByIndex(index) {
        const { partsList } = this.state;
        const coordinates = partsList[index];
        const type = index === 0 ? 'head' : (index === partsList.length - 1 ? 'tail' : 'middle');
        const prevCoordinates = type === 'tail' ? undefined : partsList[index + 1];
        const nextCoordinates = type === 'head' ? undefined : partsList[index - 1];
        return <SnakePart  
            x={coordinates.x}
            y={coordinates.y}
            type={type}
            from={this.getDirectionFromCoordinates(coordinates, prevCoordinates)}
            to={this.getDirectionFromCoordinates(coordinates, nextCoordinates)}
            key={`${coordinates.x}-${coordinates.y}`}
        />
    }

    move() {
        const { partsList, length } = this.state;
        const { foodList, newSnakePartPositions, boardWidth, boardHeight, directionVector } = this.props;
        if (directionVector.x === 0 && directionVector.y === 0) return;

        const oldHeadPos = partsList[0];
        const newHeadPos = {
            x: oldHeadPos.x + directionVector.x,
            y: oldHeadPos.y + directionVector.y,
        }

        const ateOwnPart = partsList.some(
            part => part.x === newHeadPos.x && part.y === newHeadPos.y
        );
        const outsideBoard = newHeadPos.x <= 0 || newHeadPos.x > boardWidth ||
            newHeadPos.y <= 0 || newHeadPos.y > boardHeight;

        if (ateOwnPart || outsideBoard) {
            this.die();
            return;
        }

        const shouldGrow = length > partsList.length;
        const newSnakeBody = shouldGrow ? partsList : partsList.slice(0, -1);
        this.setState({ partsList: [newHeadPos, ...newSnakeBody] });
        newSnakePartPositions(partsList);

        const foodIndex = foodList
            .findIndex(food => (food.x === newHeadPos.x) && (food.y === newHeadPos.y));
        if (foodIndex !== -1) this.eat(foodIndex);
    }

    eat(foodIndex) {
        // To avoid extra variables we define the first element as the correct element
        if (foodIndex !== 0) this.die();
        this.setState({length: this.state.length + 2});
        this.props.eat(foodIndex);
    }

    die() {
        this.setState(this.initialState);
        this.props.die();
    }

    render() {
        const {x, y} = this.props;
        const {partsList} = this.state;
        return partsList.map((part, index) => this.getPartElementByIndex(index));
    }
}
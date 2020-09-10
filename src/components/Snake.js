import React from "react";
import PropTypes from "prop-types";
import SnakePart from "./SnakePart.js";
import { snakeInitialSize, snakeLengthIncrease, initialSpeed, speedIncrement } from "../gameSettings";

class Snake extends React.Component {
    constructor(props) {
        super(props);
        const {x, y} = this.props;
        this.state = {
            partsList: [
                {x, y},
                {x: x+1, y},
                {x: x+2, y}
            ],
            length: snakeInitialSize,
            dead: false,
            speed: initialSpeed,
        }
        this.update = this.update.bind(this);
        this.move = this.move.bind(this);
        this.die = this.die.bind(this);
        this.eat = this.eat.bind(this);
    }

    update(now) {
        const { speed, dead } = this.state;

        if (now - this.before > 1000 / speed) {
            this.move();
            this.before = now;
        }

        const animationID = window.requestAnimationFrame(this.update); 
        if (dead) window.cancelAnimationFrame(animationID);
    }

    componentDidMount() { 
        this.before = 0;
        window.requestAnimationFrame(this.update);
    }

    getDirectionFromCoordinates(fromCoordinates, toCoordinates) {
        if (!fromCoordinates || !toCoordinates) return;
        const { x: fromX, y: fromY } = fromCoordinates;
        const { x: toX, y: toY } = toCoordinates;
        const [xDiff, yDiff] = [fromX-toX, fromY-toY];
        if (yDiff === 0) {
            if (xDiff === 1) return 'left';
            else if (xDiff === -1) return 'right';
        } else if (xDiff === 0) {
            if (yDiff === 1) return 'up';
            else if (yDiff === -1) return 'down';
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
        const newPartsList = [newHeadPos, ...newSnakeBody];
        this.setState({ partsList: newPartsList });
        newSnakePartPositions(newPartsList);

        const foodIndex = foodList
            .findIndex(food => (food.x === newHeadPos.x) && (food.y === newHeadPos.y));
        if (foodIndex !== -1) this.eat(foodIndex);
    }

    eat(foodIndex) {
        const { length: previousLength, speed: previousSpeed } = this.state;
        const { eat } = this.props;
        // To avoid extra variables we define the first element as the correct element
        if (foodIndex !== 0) this.die();
        this.setState({length: previousLength + snakeLengthIncrease, speed: previousSpeed + speedIncrement});
        eat(foodIndex);
    }

    die() {
        const { die } = this.props;
        this.setState({dead: true});
        die();
    }

    render() {
        const {partsList} = this.state;
        return partsList.map((part, index) => this.getPartElementByIndex(index));
    }
}

Snake.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    boardWidth: PropTypes.number,
    boardHeight: PropTypes.number,
    directionVector: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    die: PropTypes.func,
    eat: PropTypes.func,
    newSnakePartPositions: PropTypes.func,
    foodList: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    })),
}

export default Snake;
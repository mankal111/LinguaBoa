import React from "react";
import "./Board.css";
import Snake from "./Snake.js"
import Food from "./Food";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const [x, y] = [15, 15];
        this.state = {
            foodPositions: [{x, y}],
            snakePositions: [{x, y}, {x: x+1, y}, {x: x+2, y}],
        }
        this.eatFood = this.eatFood.bind(this);
        this.reset = this.reset.bind(this);
        this.newSnakePartPositions =
            snakePositions => this.setState({ snakePositions });
    }

    eatFood(index) {
        const foodPositions = [ ...this.state.foodPositions ];
        foodPositions.splice(index, 1);

        let newFoodPosition, positionIsOccupied;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * 20 + 1),
                y: Math.floor(Math.random() * 20 + 1),
            }
            positionIsOccupied = this.state.snakePositions.some(
                part => part.x === newFoodPosition.x && part.y === newFoodPosition.y
            );
        } while(positionIsOccupied);
            
        this.setState({ foodPositions: [newFoodPosition, ...foodPositions] });
    }

    reset() {
        this.setState({
            foodPositions: [{x: 15, y: 15}]
        });
    }

    render() {
        const { foodPositions } = this.state;
        return <div className="board">
            <Snake
                x={10} y={10}
                newSnakePartPositions={this.newSnakePartPositions}
                foodPositions={foodPositions}
                eat={this.eatFood}
                die={this.reset}
                boardWidth={21}
                boardHeight={21}
            />
            {this.state.foodPositions.map(pos => (<Food x={pos.x} y={pos.y} key={`${pos.x}-${pos.y}`}/>))}
        </div>;
    }
}
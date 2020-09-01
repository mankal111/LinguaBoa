import React from "react";
import "./Board.css";
import Snake from "./Snake.js"
import Food from "./Food";
import { words, symbols } from "../words";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const [x, y] = [10, 10];
        this.state = {
            practiceLanguage: 'german',
            practiceSubject: 'numbers',
            foodList: [],
            snakePositions: [{x, y}, {x: x+1, y}, {x: x+2, y}],
        }
        this.eatFood = this.eatFood.bind(this);
        this.generateFood = this.generateFood.bind(this);
        this.reset = this.reset.bind(this);
        this.newSnakePartPositions =
            snakePositions => this.setState({ snakePositions });
    }

    componentDidMount() {
        this.generateFood();
    }

    generateFood() {
        const { foodList, snakePositions, practiceSubject, practiceLanguage } = this.state;
        const occupiedPositions = [ ...foodList, ...snakePositions ];
        let newFood, positionIsOccupied, wordAlreadyChosen, newFoodList = [];
        for(let i = 0; i < 3; i++) {
            do {
                newFood = {
                    x: Math.floor(Math.random() * 20 + 1),
                    y: Math.floor(Math.random() * 20 + 1),
                }
                positionIsOccupied = occupiedPositions.some(
                    part => part.x === newFood.x && part.y === newFood.y
                );
            } while(positionIsOccupied);

            do {
                newFood.wordIndex = Math.floor(Math.random() * symbols[practiceSubject].length);
                wordAlreadyChosen = newFoodList.some(word => word.wordIndex === newFood.wordIndex);
            } while(wordAlreadyChosen);
            newFoodList.push(newFood);
        }
        this.setState({ foodList: newFoodList });
        var msg = new SpeechSynthesisUtterance();
        msg.lang = words[practiceLanguage].code;
        msg.text = words[practiceLanguage][practiceSubject][newFoodList[0].wordIndex];
        console.log(words[practiceLanguage][practiceSubject][newFoodList[0].wordIndex])
        window.speechSynthesis.speak(msg);
    }

    eatFood() {
        this.setState({ foodList: [] });
        this.generateFood();
    }

    reset() {
        const [x, y] = [10, 10];
        this.setState({
            foodList: [],
            snakePositions: [{x, y}, {x: x+1, y}, {x: x+2, y}],
        });
        this.generateFood();
    }

    render() {
        const { foodList, practiceLanguage, practiceSubject } = this.state;
        const practiceWord = foodList[0] && words[practiceLanguage][practiceSubject][foodList[0].wordIndex];
        
        return <div className="board">
            <Snake
                x={10} y={10}
                newSnakePartPositions={this.newSnakePartPositions}
                foodList={foodList}
                eat={this.eatFood}
                die={this.reset}
                boardWidth={21}
                boardHeight={21}
            />
            {foodList.map(
                food => (
                    <Food
                        x={food.x} y={food.y}
                        key={`${food.x}-${food.y}`}
                        language={practiceLanguage}
                        subject={practiceSubject}
                        wordIndex={food.wordIndex}
                    />
                )
            )}
            <div>{practiceWord}</div>
        </div>;
    }
}
import React from "react";
import "./Game.css";
import Snake from "./Snake.js"
import Food from "./Food";
import { words, symbols } from "../words";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const [x, y] = [10, 10];
        this.state = {
            practiceLanguage: 'german',
            practiceSubject: 'animals',
            foodList: [],
            snakePositions: [{x, y}, {x: x+1, y}, {x: x+2, y}],
            directionVector: {x: 0, y: 0}
        }
        this.eatFood = this.eatFood.bind(this);
        this.generateFood = this.generateFood.bind(this);
        this.reset = this.reset.bind(this);
        this.clickControl = this.clickControl.bind(this);
        this.newSnakePartPositions =
            snakePositions => this.setState({ snakePositions });
    }

    componentDidMount() {
        this.generateFood();

        window.addEventListener('keydown', e => {
            const { snakePositions } = this.state;
            switch (e.key) {
                case 'ArrowUp':
                    if (snakePositions[0].y - snakePositions[1].y === 1) break;
                    this.setState({directionVector: { x: 0, y: -1}});
                    break;
                case 'ArrowDown':
                    if (snakePositions[0].y - snakePositions[1].y === -1) break;
                    this.setState({directionVector: { x: 0, y: 1}});
                    break;
                case 'ArrowLeft':
                    if (snakePositions[0].x - snakePositions[1].x === 1) break;
                    this.setState({directionVector: { x: -1, y: 0}});
                    break;
                case 'ArrowRight':
                    if (snakePositions[0].x - snakePositions[1].x === -1) break;
                    this.setState({directionVector: { x: 1, y: 0}});
                    break;
            }
        });
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
            directionVector: {x: 0, y: 0},
        });
        this.generateFood();
    }

    clickControl(event) {
        let { directionVector } = this.state;
        const rect = event.target.children[0].getBoundingClientRect();
        const direction = {
            up: rect.top > event.clientY,
            down: rect.bottom < event.clientY,
            left: rect.left > event.clientX,
            right: rect.right < event.clientX,
        }
        let newDirectionVector = {x: 0, y: 0};
        if (directionVector.y === 0 && rect.top > event.clientY) newDirectionVector.y = -1;
        else if (directionVector.y === 0 && rect.bottom < event.clientY) newDirectionVector.y = 1;
        else if (directionVector.x === 0 && rect.left > event.clientX) newDirectionVector.x = -1;
        else if (directionVector.x === 0 && rect.right < event.clientX) newDirectionVector.x = 1;
        console.log(directionVector, newDirectionVector);
        this.setState({directionVector: newDirectionVector});
    }

    render() {
        const { foodList, practiceLanguage, practiceSubject, directionVector } = this.state;
        const practiceWord = foodList[0] && words[practiceLanguage][practiceSubject][foodList[0].wordIndex];
        
        return <div className="board" onClick={this.clickControl}>
            <Snake
                x={10} y={10}
                newSnakePartPositions={this.newSnakePartPositions}
                foodList={foodList}
                eat={this.eatFood}
                die={this.reset}
                boardWidth={21}
                boardHeight={21}
                directionVector={directionVector}
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
import React from "react";
import "./Game.css";
import Snake from "./Snake.js"
import Food from "./Food";
import { words, symbols } from "../words";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const [x, y] = [4, 4];
        this.state = {
            foodList: [],
            snakePositions: [{x, y}, {x: x+1, y}, {x: x+2, y}],
            directionVector: {x: 0, y: 0},
            score: 0,
        }
        this.eatFood = this.eatFood.bind(this);
        this.generateFood = this.generateFood.bind(this);
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
        const { foodList, snakePositions } = this.state;
        const { subject, language } = this.props;
        const occupiedPositions = [ ...foodList, ...snakePositions ];
        let newFood, positionIsOccupied, wordAlreadyChosen, newFoodList = [];
        for(let i = 0; i < 3; i++) {
            do {
                newFood = {
                    x: Math.floor(Math.random() * 18 + 1),
                    y: Math.floor(Math.random() * 18 + 1),
                }
                positionIsOccupied = occupiedPositions.some(
                    part => part.x === newFood.x && part.y === newFood.y
                );
            } while(positionIsOccupied);

            do {
                newFood.wordIndex = Math.floor(Math.random() * symbols[subject].length);
                wordAlreadyChosen = newFoodList.some(word => word.wordIndex === newFood.wordIndex);
            } while(wordAlreadyChosen);
            newFoodList.push(newFood);
            occupiedPositions.push(newFood);
        }
        this.setState({ foodList: newFoodList });
        var msg = new SpeechSynthesisUtterance();
        msg.lang = words[language].code;
        msg.text = words[language][subject][newFoodList[0].wordIndex];
        window.speechSynthesis.speak(msg);
    }

    eatFood() {
        const { score } = this.state;
        this.setState({ foodList: [], score: score + 10 });
        this.generateFood();
    }

    clickControl(event) {
        const { snakePositions, directionVector } = this.state;
        const rect = event.target.children[0].getBoundingClientRect();
        const headDirection = {
            horizontal: snakePositions[0].y - snakePositions[1].y === 0,
            vertical: snakePositions[0].x - snakePositions[1].x === 0,
        }
        const clickDirection = {
            up: rect.top > event.clientY,
            down: rect.bottom < event.clientY,
            left: rect.left > event.clientX,
            right: rect.right < event.clientX,
        }
        let newDirectionVector = {x: 0, y: 0};
        if (headDirection.horizontal)
            if (directionVector.x === 0 && directionVector.y === 0) 
                newDirectionVector.x = -1;
            else if (clickDirection.up)
                newDirectionVector.y = -1;
            else newDirectionVector.y = 1;
        else if (headDirection.vertical)
            if (clickDirection.left)
                newDirectionVector.x = -1;
            else newDirectionVector.x = 1;
        //TODO: triple click bug. triple click kills snake
        //console.log(snakePositions, headDirection, clickDirection, directionVector, newDirectionVector);
        this.setState({directionVector: newDirectionVector});
    }

    render() {
        const { foodList, directionVector, score} = this.state;
        const { language, subject, exit } = this.props;
        const practiceWord = foodList[0] && words[language][subject][foodList[0].wordIndex];
        
        return <div className="game-container">
            <div className="header">
                <div className="title">Linguaboa</div>
                <div className="practice-word">{practiceWord}</div>
                <div className="score">{`Score: ${score}`}</div>
            </div>
            <div className="board" onClick={this.clickControl}>
                <Snake
                    x={10} y={10}
                    newSnakePartPositions={this.newSnakePartPositions}
                    foodList={foodList}
                    eat={this.eatFood}
                    die={exit}
                    boardWidth={18}
                    boardHeight={18}
                    directionVector={directionVector}
                />
                {foodList.map(
                    food => (
                        <Food
                            x={food.x} y={food.y}
                            key={`${food.x}-${food.y}`}
                            language={language}
                            subject={subject}
                            wordIndex={food.wordIndex}
                        />
                    )
                )}
            </div>
        </div>;
    }
}
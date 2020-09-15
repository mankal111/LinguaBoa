import React from 'react';
import PropTypes from 'prop-types';
import './Game.css';
import Snake from './Snake';
import Food from './Food';
import Dialog from './Dialog';
import { words, symbols } from '../words';
import { boardSize, scorePerFood } from '../gameSettings';

class Game extends React.Component {
  constructor(props) {
    super(props);
    // TODO remove x y, position should be defined in one place
    const x = Math.floor(boardSize / 2);
    const y = Math.floor(boardSize / 2);
    this.initialState = {
      foodList: [],
      snakePositions: [{ x, y }, { x: x + 1, y }, { x: x + 2, y }],
      directionVector: { x: 0, y: 0 },
      score: 0,
      dialog: false,
      snakeKey: 0,
    };
    this.state = this.initialState;
    this.eatFood = this.eatFood.bind(this);
    this.generateFood = this.generateFood.bind(this);
    this.setDirectionVectorFromKeyEvent = this.setDirectionVectorFromKeyEvent.bind(this);
    this.newSnakePartPositions = (snakePositions) => this.setState({ snakePositions });
    this.lose = () => this.setState({ dialog: true });
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    this.generateFood();

    window.addEventListener('keydown', this.setDirectionVectorFromKeyEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.setDirectionVectorFromKeyEvent);
  }

  setDirectionVectorFromKeyEvent(event) {
    const { snakePositions } = this.state;
    switch (event.key) {
      case 'ArrowUp':
        if (snakePositions[0].y - snakePositions[1].y === 1) break;
        this.setState({ directionVector: { x: 0, y: -1 } });
        break;
      case 'ArrowDown':
        if (snakePositions[0].y - snakePositions[1].y === -1) break;
        this.setState({ directionVector: { x: 0, y: 1 } });
        break;
      case 'ArrowLeft':
        if (snakePositions[0].x - snakePositions[1].x === 1) break;
        this.setState({ directionVector: { x: -1, y: 0 } });
        break;
      case 'ArrowRight':
        if (snakePositions[0].x - snakePositions[1].x === -1) break;
        this.setState({ directionVector: { x: 1, y: 0 } });
        break;
      default:
    }
  }

  generateFood() {
    const { foodList, snakePositions } = this.state;
    const { subject, language } = this.props;
    const occupiedPositions = [...foodList, ...snakePositions];
    let positionIsOccupied; let wordAlreadyChosen;
    const newFoodList = [];
    for (let i = 0; i < 3; i += 1) {
      let newFood;
      do {
        const x = Math.floor(Math.random() * boardSize + 1);
        const y = Math.floor(Math.random() * boardSize + 1);
        positionIsOccupied = occupiedPositions.some(
          (part) => part.x === x && part.y === y,
        );
        newFood = { x, y };
      } while (positionIsOccupied);

      do {
        newFood.wordIndex = Math.floor(Math.random() * symbols[subject].length);
        wordAlreadyChosen = newFoodList.some((word) => word.wordIndex === newFood.wordIndex);
      } while (wordAlreadyChosen);
      newFoodList.push(newFood);
      occupiedPositions.push(newFood);
    }

    this.setState({ foodList: newFoodList });

    const msg = new SpeechSynthesisUtterance();
    msg.lang = words[language].code;
    msg.text = words[language][subject][newFoodList[0].wordIndex];
    window.speechSynthesis.speak(msg);
  }

  eatFood() {
    const { score } = this.state;
    this.setState({ foodList: [], score: score + scorePerFood });
    this.generateFood();
  }

  restart() {
    const { snakeKey } = this.state;
    // By changing the key the snakeKey, we force the snake to reset
    this.setState({ ...this.initialState, snakeKey: snakeKey + 1 });
    this.generateFood();
  }

  render() {
    const {
      foodList, directionVector, score, dialog, snakeKey,
    } = this.state;
    const { language, subject, exit } = this.props;
    const practiceWord = foodList[0] && words[language][subject][foodList[0].wordIndex];

    return (
      <div className="game-container">
        {dialog && <Dialog exit={exit} restart={this.restart} />}
        <div className="left-side">
          <button type="button" className="up-button" onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowUp' })}>
            up
          </button>
          <button type="button" className="down-button" onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowDown' })}>
            down
          </button>
        </div>
        <div className="middle">
          <div className="header">
            <div className="title">Linguaboa</div>
            <div className="practice-word">{practiceWord}</div>
            <div className="score">{`Score: ${score}`}</div>
          </div>
          <div
            className="board"
            style={{
              gridTemplateRows: `repeat(${boardSize}, 1fr)`,
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              fontSize: `${55 / boardSize}vmin`,
            }}
          >
            <Snake
              x={Math.floor(boardSize / 2)}
              y={Math.floor(boardSize / 2)}
              newSnakePartPositions={this.newSnakePartPositions}
              foodList={foodList}
              eat={this.eatFood}
              die={this.lose}
              boardWidth={boardSize}
              boardHeight={boardSize}
              directionVector={directionVector}
              key={snakeKey}
            />
            {
              foodList.map((food) => (
                <Food
                  x={food.x}
                  y={food.y}
                  key={`${food.x}-${food.y}`}
                  subject={subject}
                  wordIndex={food.wordIndex}
                />
              ))
            }
          </div>
        </div>
        <div className="right-side">
          <button type="button" className="left-button" onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowLeft' })}>
            left
          </button>
          <button type="button" className="right-button" onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowRight' })}>
            right
          </button>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  subject: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  exit: PropTypes.func.isRequired,
};

export default Game;

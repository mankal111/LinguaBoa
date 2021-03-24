import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Snake from './Snake';
import Food from './Food';
import Dialog from './Dialog';
import { words, symbols } from '../words';
import { boardSize, scorePerFood } from '../gameSettings';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
  user-select: none;
  @media (orientation: portrait) {
    flex-wrap: wrap;
  }
`

const Board = styled.div`
  grid-template-rows: repeat(${props => props.size}, 1fr);
  grid-template-columns: repeat(${props => props.size}, 1fr);
  font-size: ${props => 55 / props.size}vmin;
  background-color: #FFD489;
  border: 20px solid #A46A23;
  border-radius: 20px;
  width:  calc(90vmin - 30px);
  height: calc(90vmin - 30px);
  display: grid;
  box-shadow: 5px 5px 5px 1px black, inset 1px 1px 10px black;
`

const Header = styled.div`
  display: flex;
  height: 5vmin;
  justify-content: space-between;
`

const Button = styled.button`
  background-color: #63EC2E;
  color: #004200;
  font-family: "Reggae One";
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 2px 5px #004200, inset 1px 1px 3px white;
  height: 10vmin;
  width: 10vmin;
  margin: 10px;
  text-align: center;
  border-radius: 20px;
`

const LeftControls = styled.div`
  @media (orientation: portrait) {
    order: 2;
  }
`

const RightControls = styled.div`
  @media (orientation: portrait) {
    order: 3;
  }
`

const GameContainer = styled.div`
  @media (orientation: portrait) {
    order: 1;
  }
`

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
      <Container>
        {dialog && <Dialog exit={exit} restart={this.restart} />}
        <LeftControls>
          <Button onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowUp' })}>
            up
          </Button>
          <Button onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowDown' })}>
            down
          </Button>
        </LeftControls>
        <GameContainer>
          <Header>
            <div>Linguaboa</div>
            <div>{practiceWord}</div>
            <div>{`Score: ${score}`}</div>
          </Header>
          <Board
            size={boardSize}
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
          </Board>
        </GameContainer>
        <RightControls>
          <Button onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowLeft' })}>
            left
          </Button>
          <Button onClick={() => this.setDirectionVectorFromKeyEvent({ key: 'ArrowRight' })}>
            right
          </Button>
        </RightControls>
      </Container>
    );
  }
}

Game.propTypes = {
  subject: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  exit: PropTypes.func.isRequired,
};

export default Game;

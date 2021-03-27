import React, {useState, useEffect, useRef} from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Snake from './Snake';
import Food from './Food';
import Dialog from './Dialog';
import { words, symbols } from '../words';
import { boardSize, scorePerFood, initialSnakePositions } from '../gameSettings';

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
  width:  80vmin;
  height: 80vmin;
  display: grid;
  box-shadow: 5px 5px 5px 1px black, inset 1px 1px 10px black;
`

const Header = styled.div`
  top: 0;
  display: flex;
  height: 5vmin;
  justify-content: space-between;
  margin: 1vw;
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

const Game = observer(({ store, restart, exit }) => {
  const { score, foodList, practiceWord, rightSymbol, subject, language } = store;
  const [snakePositions, _setSnakePositions] = useState(initialSnakePositions);
  const snakePositionsRef = useRef(snakePositions);
  const setSnakePositions = data => {
    snakePositionsRef.current = data;
    _setSnakePositions(data);
  }

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const lose = () => setDialogIsOpen(true);

  useEffect(() => {
    generateFood();

    window.addEventListener('keydown', setDirectionVectorFromKeyEvent);
    
    return () => {
      window.removeEventListener('keydown', setDirectionVectorFromKeyEvent);
    }
  }, []);

  const setDirectionVectorFromKeyEvent = event => {
    const snakePositions = snakePositionsRef.current;
    switch (event.key) {
      case 'ArrowUp':
        if (snakePositions[0].y - snakePositions[1].y === 1) break;
        store.directionVector = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (snakePositions[0].y - snakePositions[1].y === -1) break;
        store.directionVector = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (snakePositions[0].x - snakePositions[1].x === 1) break;
        store.directionVector = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (snakePositions[0].x - snakePositions[1].x === -1) break;
        store.directionVector = { x: 1, y: 0 };
        break;
      default:
    }
  }

  const generateFood = () => {
    const occupiedPositions = [...snakePositions];
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
    store.foodList = newFoodList;
    const msg = new SpeechSynthesisUtterance();
    msg.lang = words[language].code;
    msg.text = words[language][subject][newFoodList[0].wordIndex];
    window.speechSynthesis.speak(msg);
  }

  const eatFood = () => {
    store.incrementScoreBy(scorePerFood);
    generateFood();
  }

  const playAgain = () => {
    restart();
    setDialogIsOpen(false);
  }

  return (
    <Container>
      {dialogIsOpen && <Dialog exit={exit} playAgain={playAgain} practiceWord={practiceWord} symbol={rightSymbol} language={language}/>}
      <LeftControls>
        <Button onClick={() => setDirectionVectorFromKeyEvent({ key: 'ArrowUp' })}>
          ↑
        </Button>
        <Button onClick={() => setDirectionVectorFromKeyEvent({ key: 'ArrowDown' })}>
          ↓
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
            newSnakePartPositions={setSnakePositions}
            foodList={foodList}
            eat={eatFood}
            die={lose}
            boardWidth={boardSize}
            boardHeight={boardSize}
            store={store}
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
        <Button onClick={() => setDirectionVectorFromKeyEvent({ key: 'ArrowLeft' })}>
          ←
        </Button>
        <Button onClick={() => setDirectionVectorFromKeyEvent({ key: 'ArrowRight' })}>
          →
        </Button>
      </RightControls>
    </Container>
  );
})

Game.propTypes = {
  exit: PropTypes.func.isRequired,
};

export default Game;

import React, {useState, useEffect, useRef} from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Snake from './Snake';
import Food from './Food';
import Dialog from './Dialog';
import { boardSize } from '../gameSettings';

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
  const { alive, score, foodList, practiceWord, rightSymbol, subject, language } = store;

  useEffect(() => {
    window.addEventListener('keydown', store.turn);
    
    return () => {
      window.removeEventListener('keydown', store.turn);
    }
  }, [store]);

  return (
    <Container>
      {!alive && <Dialog exit={exit} playAgain={restart} practiceWord={practiceWord} symbol={rightSymbol} language={language}/>}
      <LeftControls>
        <Button onClick={() => store.turn({ key: 'ArrowUp' })}>
          ↑
        </Button>
        <Button onClick={() => store.turn({ key: 'ArrowDown' })}>
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
        <Button onClick={() => store.turn({ key: 'ArrowLeft' })}>
          ←
        </Button>
        <Button onClick={() => store.turn({ key: 'ArrowRight' })}>
          →
        </Button>
      </RightControls>
    </Container>
  );
})

Game.propTypes = {
  store: PropTypes.object.isRequired,
  restart: PropTypes.func,
  exit: PropTypes.func.isRequired,
};

export default Game;

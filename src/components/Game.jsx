import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Controls from './Controls';
import Snake from './Snake';
import Food from './Food';
import Dialog from './Dialog';
import { boardSize } from '../gameSettings';
import { words } from '../words';
import { saySomething } from '../utils';

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

const Game = observer(({ store, restart, exit }) => {
  const { alive, score, foodList, practiceWord, rightSymbol, subject, language, wrongWord } = store;

  useEffect(() => {
    const languageCode = words[language].code;
    saySomething(practiceWord, languageCode);
  }, [foodList]);

  const showDialog = () => {
    if (!alive) return (
      <Dialog
        exit={exit}
        playAgain={restart}
        wrongWord={wrongWord}
        practiceWord={practiceWord}
        symbol={rightSymbol}
        language={language}
      />
    )
  }

  const foodComponents = foodList.map((food) => (
    <Food
      x={food.x}
      y={food.y}
      key={`${food.x}-${food.y}`}
      subject={subject}
      wordIndex={food.wordIndex}
    />
  ));

  return (
    <>
      {showDialog()}
      <Controls store={store}>
        <Header>
          <div>Linguaboa</div>
          <div>{practiceWord}</div>
          <div>{`Score: ${score}`}</div>
        </Header>
        <Board
          size={boardSize}
        >
          <Snake
            store={store}
          />
          {foodComponents}
        </Board>
      </Controls>
    </>
  );
})

Game.propTypes = {
  store: PropTypes.object.isRequired,
  restart: PropTypes.func,
  exit: PropTypes.func.isRequired,
};

export default Game;

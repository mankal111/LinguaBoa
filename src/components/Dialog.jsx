import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  position: absolute;
  max-width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #0082B4;
  color: #004200;
  border-radius: 10px;
  box-shadow: 5px 5px 15px black, inset 1px 1px 3px white, inset -1px -1px 3px black;
  padding: 20px;
  z-index: 1;
`
const Message = styled.div``

const ButtonsContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const Button = styled.button`
  height: 50px;
  width: 250px;
  margin: auto;
  background-color: #63EC2E;
  color: #004200;
  font-family: "Reggae One";
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 2px 5px #004200, inset 1px 1px 3px white;
  border-radius: 10px;
`

const Dialog = ({ exit, playAgain, wrongWord, practiceWord, symbol, language }) => {
  const message = wrongWord ?
    `Wrong... "${practiceWord}" means ${symbol} in ${language}.` :
    'Oh no... You lose.';
  return (
    <Container>
      <Message>
        {message}
      </Message>
      <ButtonsContainer>
        <Button onClick={playAgain}>Play again</Button>
        <Button onClick={exit}>Back to main Menu</Button>
      </ButtonsContainer>
    </Container>
  );
}

Dialog.propTypes = {
  exit: PropTypes.func.isRequired,
  playAgain: PropTypes.func.isRequired,
};

export default Dialog;

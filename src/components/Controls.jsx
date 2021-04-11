import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

const Contents = styled.div`
  @media (orientation: portrait) {
    order: 1;
  }
`

const Controls = observer(({ store, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', store.turn);
    
    return () => {
      window.removeEventListener('keydown', store.turn);
    }
  }, [store]);

  return (
    <Container>
      <LeftControls>
        <Button onClick={() => store.turn({ key: 'ArrowUp' })}>
          ↑
        </Button>
        <Button onClick={() => store.turn({ key: 'ArrowDown' })}>
          ↓
        </Button>
      </LeftControls>
      <Contents>
        { children }
      </Contents>
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

Controls.propTypes = {
  store: PropTypes.object.isRequired,
  restart: PropTypes.func,
  exit: PropTypes.func.isRequired,
};

export default Controls;

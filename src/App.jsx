import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import Menu from './components/Menu';
import { words, symbols } from './words';
import '@fontsource/reggae-one';

const Application = styled.div`
  background-color: #161E11;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #63EC2E;
  font-family: "Reggae One";
`

const App = () => {
  const [language, setLanguage] = useState(Object.keys(words)[0]);
  const [subject, setSubject] = useState(Object.keys(symbols)[0]);
  const [screen, setScreen] = useState('menu');

  const getScreen = () => {
    switch (screen) {
      case 'game':
        return (
          <Game
            language={language}
            subject={subject}
            exit={() => setScreen('menu')}
          />
        );
      case 'menu':
      default:
        return (
          <Menu
            language={language}
            setLanguage={setLanguage}
            subject={subject}
            setSubject={setSubject}
            play={() => setScreen('game')}
          />
        );
    }
  };

  return (
    <Application>
      {getScreen()}
    </Application>
  );
}

export default App;

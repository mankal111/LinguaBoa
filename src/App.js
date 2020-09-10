import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import { words, symbols } from './words';
import './App.css';

function App() {
  const [language, setLanguage] = useState(Object.keys(words)[0]);
  const [subject, setSubject] = useState(Object.keys(symbols)[0]);
  const [screen, setScreen] = useState('menu');

  const getScreen = () => {
    switch(screen) {
      case 'game':
        return <Game
        language={language}
        subject={subject}
        exit={() => setScreen('menu')}
        />;
      case 'menu':
      default:
        return <Menu
          language={language}
          setLanguage={setLanguage}
          subject={subject}
          setSubject={setSubject}
          play={() => setScreen('game')}
        />;
      };
  }
  
  return (
    <div className="App">
      {getScreen()}
    </div>
  );
}

export default App;

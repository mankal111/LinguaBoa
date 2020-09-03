import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import './App.css';

function App() {
  const [language, setLanguage] = useState(undefined);
  const [subject, setSubject] = useState(undefined);

  return (
    <div className="App">
      {
        language && subject ?
        <Game /> :
        <Menu returnLanguage={setLanguage} returnSubject={setSubject} />
      }
    </div>
  );
}

export default App;

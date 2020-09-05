import React, { useState } from 'react';
import { words, symbols } from '../words';

function Menu(props) {
    const languages = Object.keys(words);
    const subjects = Object.keys(symbols);

    const { setLanguage, setSubject, play, language, subject} = props;

    return (
        <div className="Menu">
            <form onSubmit={play}>
                <label>
                    Language:
                    <select value={language} onChange={event => setLanguage(event.target.value)}>
                        {languages.map(language => <option value={language} key={language}>{language}</option>)}
                    </select>
                </label>
                <label>
                    Subject:
                    <select value={subject} onChange={event => setSubject(event.target.value)}>
                        {subjects.map(subject => <option value={subject} key={subject}>{subject}</option>)}
                    </select>
                </label>
                <input type="submit" value="Play" />
            </form>
        </div>
    );
  }
  
  export default Menu;
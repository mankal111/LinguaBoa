import React from 'react';
import { words, symbols } from '../words';

function Menu(props) {
  const languages = Object.keys(words);
  const subjects = Object.keys(symbols);

  const { setLanguage, setSubject, play, language, subject} = props;

  return (
    <div className="Menu">
      <form>
        <label htmlFor="language-select">
          Language:
          <select
            id="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {
              languages.map((languageItem) => (
                <option
                  value={languageItem}
                  key={languageItem}
                >
                  {languageItem}
                </option>
              ))
            }
          </select>
        </label>
        <label htmlFor="subject-select">
          Subject:
          <select
            id="subject-select"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            {subjects.map((subjectItem) => (
              <option
                value={subjectItem}
                key={subjectItem}
              >
                {subjectItem}
              </option>
            ))}
          </select>
        </label>
        <input type="button" value="Play" onClick={play} />
      </form>
    </div>
  );
}

export default Menu;

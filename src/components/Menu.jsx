import React from 'react';
import styled from 'styled-components';
import { words, symbols } from '../words';

const Container = styled.div`
  background-color: #0082B4;
  border-radius: 5px;
  box-shadow: 5px 5px 5px 1px black, inset 1px 1px 5px white;
`

const Title = styled.h1`
  text-shadow: 5px 5px #004200;
  width: 100%;
  text-align: center;
`

const Options = styled.form`
  display: flex;
  flex-direction: column;
  padding: 50px;
  padding-top: 0;
`

const Dropdown = styled.label`
  padding: 20px;
`

const PlayBtn = styled.input`
  height: 100px;
  width: 300px;
  background-color: #63EC2E;
  color: #004200;
  font-family: "Reggae One";
  font-size: 60px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 2px 5px #004200, inset 1px 1px 3px white;
  border-radius: 10px;
`

function Menu(props) {
  const languages = Object.keys(words);
  const subjects = Object.keys(symbols);

  const { setLanguage, setSubject, play, language, subject } = props;

  return (
    <Container>
      <Title>LinguaBoa</Title>
      <Options>
        <Dropdown htmlFor="language-select">
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
        </Dropdown>
        <Dropdown htmlFor="subject-select">
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
        </Dropdown>
        <PlayBtn type="button" value="PLAY" onClick={play} />
      </Options>
    </Container>
  );
}

export default Menu;

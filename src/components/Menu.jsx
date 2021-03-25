import React from 'react';
import styled from 'styled-components';
import { words, symbols } from '../words';

const Container = styled.div`
  width: 500px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background-color: #0082B4;
  border-radius: 5px;
  box-shadow: 5px 5px 5px 1px black,
    inset -1px -1px 5px black,
    inset 1px 1px 5px white;

  @media (max-width: 600px), (max-height: 600px) {
    width: 100%;
    height: 100%;
    box-shadow: none;
    border-radius: 0;
  }
`

const Title = styled.h1`
  text-shadow: 5px 5px #004200;
  font-size: 70px;
  width: 100%;
  text-align: center;

  @media (max-width: 600px) {
    margin: 5vh 5vw 5vh 5vw;
    width: 90vw;
    font-size: 12vw;
  }

  @media (max-height: 330px) {
    margin: 5vh 5vw 5vh 5vw;
    width: 90vw;
    font-size: 12vw;
  }
`

const Options = styled.form`
  height: 100%;
  max-width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  @media screen and (max-height: 480px) {
    flex-direction: row;
  }
`

const Dropdowns = styled.div`
  display: flex;
  flex-direction: column;
  label {
    padding: 15px;
  }
  select {
    background-color: #63EC2E;
    color: #004200;
    margin-left: 10px;
    font-size: 20px;
    font-family: "Reggae One";
  }
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
  @media (max-width: 500px) {
    width: 50vw;
    font-size: 12vw;
  }

  @media (max-height: 480px){
    width: 20vw;
    font-size: 5vw;
  }
`

const Menu = ({ setLanguage, setSubject, play, language, subject }) => {
  const languages = Object.keys(words);
  const subjects = Object.keys(symbols);

  return (
    <Container>
      <Title>LinguaBoa</Title>
      <Options>
        <Dropdowns>
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
        </Dropdowns>
        <PlayBtn type="button" value="PLAY" onClick={play} />
      </Options>
    </Container>
  );
}

export default Menu;

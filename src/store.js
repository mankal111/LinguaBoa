import { action, computed, makeObservable, observable } from 'mobx';
import { boardSize, foodAmount, initialSnakePositions, initialSpeed, scorePerFood, snakeInitialSize, snakeLengthIncrease, speedIncrement } from './gameSettings';
import { words, symbols } from './words';

export default class Store {
  foodList = [];
  foodEatenAmount = 0;
  subject = '';
  language = '';
  directionVector = { x: 0, y: 0 };
  snakePositions = initialSnakePositions;
  snakeLength = snakeInitialSize;
  alive = true;
  lastUpdate = 0;

  constructor({ subject, language }) {
    makeObservable(this, {
      foodList: observable,
      foodEatenAmount: observable,
      snakePositions: observable,
      alive: observable,
      practiceWordIndex: computed,
      practiceWord: computed,
      rightSymbol: computed,
      score: computed,
      occupiedPositions: computed,
      generateFood: action,
      turn: action,
      eat: action,
      move: action,
      update: action,
    });

    this.subject = subject;
    this.language = language;
    this.generateFood();

    this.update = this.update.bind(this);
    window.requestAnimationFrame(this.update);
  }

  get practiceWordIndex() {
    return this.foodList[0].wordIndex;
  }
  get practiceWord() {
    const currentPracticeWordList = words[this.language][this.subject];
    return this.foodList[0] && currentPracticeWordList[this.practiceWordIndex];
  }

  get rightSymbol() {
    const currentPracticeSymbolList = symbols[this.subject];
    return this.foodList[0] && currentPracticeSymbolList[this.practiceWordIndex];
  }

  get score() {
    return this.foodEatenAmount * scorePerFood;
  }

  get occupiedPositions() {
    return [...this.snakePositions, ...this.foodList];
  }

  getRandomBoardPosition = () => {
    return {
      x: Math.floor(Math.random() * boardSize + 1),
      y: Math.floor(Math.random() * boardSize + 1)
    }
  }

  positionIsOccupied = coordinates => {
    const hasSameCoordinates = ({x, y}) => x === coordinates.x && y === coordinates.y;
    return  this.occupiedPositions.some(hasSameCoordinates);
  }

  getRandomFreeBoardPosition = () => {
    const randomPosition = this.getRandomBoardPosition();
    if (this.positionIsOccupied(randomPosition))
      return this.getRandomFreeBoardPosition();
    return randomPosition;
  }

  isWordIndexAlreadyInGame(wordIndex) {
    const hasSameWordIndexWithFood = (item) => item.wordIndex === wordIndex;
    return this.foodList.some(hasSameWordIndexWithFood);
  }

  getRandomNonActiveWordIndex() {
    const randomWordIndex = Math.floor(Math.random() * symbols[this.subject].length);
    if (this.isWordIndexAlreadyInGame(randomWordIndex))
      return this.getRandomNonActiveWordIndex();
    return randomWordIndex;
  }

  generateFood = () => {
    this.foodList = [];
    while (this.foodList.length < foodAmount) {
      let food = this.getRandomFreeBoardPosition();
      food.wordIndex = this.getRandomNonActiveWordIndex();
      this.foodList.push(food);
    }
  }

  turn = event => {
    switch (event.key) {
      case 'ArrowUp':
        if (this.snakePositions[0].y - this.snakePositions[1].y === 1) break;
        this.directionVector = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.snakePositions[0].y - this.snakePositions[1].y === -1) break;
        this.directionVector = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.snakePositions[0].x - this.snakePositions[1].x === 1) break;
        this.directionVector = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.snakePositions[0].x - this.snakePositions[1].x === -1) break;
        this.directionVector = { x: 1, y: 0 };
        break;
      default:
    }
  }

  eat(food) {
    // To avoid extra variables we define the first element as the correct element
    if (food.wordIndex !== this.practiceWordIndex) this.alive = false;
    this.foodEatenAmount++;
    this.generateFood();
  }

  move() {
    const { directionVector, snakePositions, foodList, foodEatenAmount } = this;
    if (directionVector.x === 0 && directionVector.y === 0) return;
    const oldHeadPos = snakePositions[0];
    const newHeadPos = {
      x: oldHeadPos.x + directionVector.x,
      y: oldHeadPos.y + directionVector.y,
    };

    const ateOwnPart = snakePositions.some(
      part => part.x === newHeadPos.x && part.y === newHeadPos.y,
    );
    const outsideBoard = newHeadPos.x <= 0 || newHeadPos.x > boardSize ||
      newHeadPos.y <= 0 || newHeadPos.y > boardSize;

    if (ateOwnPart || outsideBoard) {
      this.alive = false;
      return;
    }

    const targetLength = foodEatenAmount * snakeLengthIncrease;
    const currentLength = snakePositions.length;
    const shouldGrow = targetLength > currentLength;
    const newSnakeBody = shouldGrow ? snakePositions : snakePositions.slice(0, -1);
    const newPartsList = [newHeadPos, ...newSnakeBody];
    this.snakePositions = newPartsList;

    const food = foodList
      .find(food => (food.x === newHeadPos.x) && (food.y === newHeadPos.y));
    if (food) this.eat(food);
  }

  update(now) {
    const speed = initialSpeed + this.foodEatenAmount * speedIncrement;
    if (now - this.lastUpdate > 1000 / speed) {
      this.move();
      this.lastUpdate = now;
    }

    const animationID = window.requestAnimationFrame(this.update);
    if (!this.alive) window.cancelAnimationFrame(animationID);
  }
}
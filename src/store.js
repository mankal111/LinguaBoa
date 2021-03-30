import { action, computed, makeObservable, observable } from 'mobx';
import { boardSize, initialSnakePositions, initialSpeed, scorePerFood, snakeInitialSize, snakeLengthIncrease, speedIncrement } from './gameSettings';
import { words, symbols } from './words';

export default class Store {
  foodList = [];
  foodEatenAmount = 0;
  subject = '';
  language = '';
  directionVector = { x: 0, y: 0 };
  snakePositions = initialSnakePositions;
  snakeLength = snakeInitialSize;
  speed = initialSpeed;
  alive = true;
  lastUpdate = 0;

  constructor({ subject, language }) {
    makeObservable(this, {
      foodList: observable,
      foodEatenAmount: observable,
      snakePositions: observable,
      directionVector: observable,
      subject: observable,
      language: observable,
      snakeLength: observable,
      speed: observable,
      alive: observable,
      lastUpdate: observable,
      practiceWord: computed,
      rightSymbol: computed,
      score: computed,
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

  get practiceWord() {
    const currentPracticeWordList = words[this.language][this.subject];
    return this.foodList[0] && currentPracticeWordList[this.foodList[0].wordIndex];
  }

  get rightSymbol() {
    const currentPracticeSymbolList = symbols[this.subject];
    return this.foodList[0] && currentPracticeSymbolList[this.foodList[0].wordIndex];
  }

  get score() {
    return this.foodEatenAmount * scorePerFood;
  }

  getRandomBoardPosition() {
    return [
      Math.floor(Math.random() * boardSize + 1),
      Math.floor(Math.random() * boardSize + 1)
    ]
  }

  generateFood = () => {
    const occupiedPositions = [...this.snakePositions];
    let positionIsOccupied; let wordAlreadyChosen;
    const newFoodList = [];
    for (let i = 0; i < 3; i += 1) {
      let newFood;
      do {
        const [x, y] = this.getRandomBoardPosition();
        positionIsOccupied = occupiedPositions.some(
          (part) => part.x === x && part.y === y,
        );
        newFood = { x, y };
      } while (positionIsOccupied);

      do {
        newFood.wordIndex = Math.floor(Math.random() * symbols[this.subject].length);
        wordAlreadyChosen = newFoodList.some((word) => word.wordIndex === newFood.wordIndex);
      } while (wordAlreadyChosen);
      newFoodList.push(newFood);
      occupiedPositions.push(newFood);
    }
    this.foodList = newFoodList;
    const msg = new SpeechSynthesisUtterance();
    msg.lang = words[this.language].code;
    msg.text = words[this.language][this.subject][newFoodList[0].wordIndex];
    window.speechSynthesis.speak(msg);
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

  eat(foodIndex) {
    // To avoid extra variables we define the first element as the correct element
    if (foodIndex !== 0) this.alive = false;
    this.snakeLength += snakeLengthIncrease;
    this.speed += speedIncrement;
    this.foodEatenAmount++;
    this.generateFood();
  }

  move() {
    const { directionVector, snakePositions, snakeLength, foodList } = this;
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

    const shouldGrow = snakeLength > snakePositions.length;
    const newSnakeBody = shouldGrow ? snakePositions : snakePositions.slice(0, -1);
    const newPartsList = [newHeadPos, ...newSnakeBody];
    this.snakePositions = newPartsList;

    const foodIndex = foodList
      .findIndex(food => (food.x === newHeadPos.x) && (food.y === newHeadPos.y));
    if (foodIndex !== -1) this.eat(foodIndex);
  }

  update(now) {
    if (now - this.lastUpdate > 1000 / this.speed) {
      this.move();
      this.lastUpdate = now;
    }

    const animationID = window.requestAnimationFrame(this.update);
    if (!this.alive) window.cancelAnimationFrame(animationID);
  }
}
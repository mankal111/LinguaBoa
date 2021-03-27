import { action, computed, makeObservable, observable } from 'mobx';
import { words, symbols } from './words';

export default class Store {
    foodList = [];
    score = 0;
    subject = '';
    language = '';
    directionVector = {x: 0, y: 0};

    constructor({subject, language}) {
        makeObservable(this, {
            foodList: observable,
            score: observable,
            subject: observable,
            language: observable,
            practiceWord: computed,
            rightSymbol: computed,
            incrementScoreBy: action,           
        });

        this.subject = subject;
        this.language = language;
    }

    get practiceWord() {
        return this.foodList[0] && words[this.language][this.subject][this.foodList[0].wordIndex];
    }

    get rightSymbol() {
        return this.foodList[0] && symbols[this.subject][this.foodList[0].wordIndex];
    }

    incrementScoreBy(amount) {
        this.score += amount;
    }
}
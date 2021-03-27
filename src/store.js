import { makeObservable, observable } from 'mobx';

export default class Store {
    score = 0;

    constructor() {
        makeObservable(this, {
            score: observable,
        });
    }
}
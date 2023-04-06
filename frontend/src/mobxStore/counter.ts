import { action, makeAutoObservable } from 'mobx';

export default class Counter {
  counterValue = 0;
  constructor() {
    makeAutoObservable(this);
  }

  @action add(value = 1) {
    this.counterValue += value;
  }

  @action minus(value = 1) {
    this.counterValue -= value;
  }
}

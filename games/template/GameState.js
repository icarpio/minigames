// src/GameState.js
const GameState = {
  lives: 3,
  score: 0,
  inventory: [],

  reset() {
    this.lives = 3;
    this.score = 0;
    this.inventory = [];
  },

  addScore(points) {
    this.score += points;
  },

  loseLife() {
    this.lives--;
  },

  addItem(item) {
    this.inventory.push(item);
  }
};

export default GameState;
import { saveGameSession } from '../js/api.js';

const token = (localStorage.getItem('token') || '').trim();
if (!token) {
  alert('No has iniciado sesión. Serás redirigido al login.');
  window.location.href = 'login.html';
}

class Arkanoid extends Phaser.Scene {
  constructor() {
    super({ key: 'Arkanoid' });
    this.score = 0;
    this.scoreText = null;
    this.isGameOver = false;
  }

  preload() {
    this.load.image('ball', '../assets/img/bullet.png');
    this.load.image('paddle', '../assets/img/paddle.png');
    this.load.image('brick', '../assets/img/brick_color.png');
  }

  create() {
    this.isGameOver = false;
    this.score = 0;
    this.scoreText = document.getElementById('scoreDisplay');
    this.scoreText.textContent = `Puntuación: ${this.score}`;

    const { width, height } = this.game.config;

    this.paddle = this.physics.add.sprite(width / 2, height - 30, 'paddle').setImmovable();
    this.paddle.body.allowGravity = false;
    this.paddle.setCollideWorldBounds(true);

    this.ball = this.physics.add.sprite(width / 2, height - 60, 'ball');
    this.ball.setScale(0.5);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocity(150, -150);

    this.bricks = this.physics.add.staticGroup();
    const rows = 5;
    const cols = 10;
    const brickWidth = 64;
    const brickHeight = 32;
    const spacing = 10;
    const totalWidth = cols * brickWidth + (cols - 1) * spacing;
    const startX = (width - totalWidth) / 2;
    const startY = 100;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (brickWidth + spacing);
        const y = startY + row * (brickHeight + spacing);
        const brick = this.bricks.create(x, y, 'brick').setOrigin(0, 0);
        brick.setScale(2);
        brick.refreshBody();
      }
    }

    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);

    this.input.on('pointermove', pointer => {
      this.paddle.x = Phaser.Math.Clamp(pointer.x, this.paddle.width / 2, width - this.paddle.width / 2);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.isGameOver) return;

    const speed = 7;
    const leftBound = this.paddle.width / 2;
    const rightBound = this.game.config.width - this.paddle.width / 2;

    if (this.cursors.left.isDown) {
      this.paddle.x = Phaser.Math.Clamp(this.paddle.x - speed, leftBound, rightBound);
    } else if (this.cursors.right.isDown) {
      this.paddle.x = Phaser.Math.Clamp(this.paddle.x + speed, leftBound, rightBound);
    }

    if (this.ball.y > this.game.config.height) {
      this.gameOver();
    }
  }

  hitPaddle(ball, paddle) {
    const diff = ball.x - paddle.x;
    ball.setVelocityX(diff * 10);
  }

  hitBrick(ball, brick) {
    brick.disableBody(true, true);
    this.score += 10;
    this.scoreText.textContent = `Puntuación: ${this.score}`;

    if (this.bricks.countActive() === 0) {
      this.winGame();
    }
  }

  async gameOver() {
    this.isGameOver = true;
    alert(`¡Juego terminado! Tu puntuación: ${this.score}`);
    try {
      await saveGameSession(token, 'Arkanoid', this.score);
      console.log('Puntuación guardada correctamente');
    } catch (e) {
      alert('Error guardando puntuación: ' + e.message);
      if (e.message.toLowerCase().includes('unauthorized')) {
        localStorage.clear();
        window.location.href = 'login.html';
      }
    }
    this.scene.restart();
  }

  async winGame() {
    this.isGameOver = true;
    alert(`¡Felicidades! ¡Ganaste con ${this.score} puntos!`);
    try {
      await saveGameSession(token, 'Arkanoid', this.score);
      console.log('Puntuación guardada correctamente');
    } catch (e) {
      alert('Error guardando puntuación: ' + e.message);
      if (e.message.toLowerCase().includes('unauthorized')) {
        localStorage.clear();
        window.location.href = 'login.html';
      }
    }
    this.scene.restart();
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: Arkanoid,
  backgroundColor: '#222'
};

const game = new Phaser.Game(config);

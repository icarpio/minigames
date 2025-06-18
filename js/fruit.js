import { saveGameSession } from '../js/api.js'; 
const token = (localStorage.getItem('token') || '').trim();
    if (!token) {
      alert('No has iniciado sesión. Serás redirigido al login.');
      window.location.href = '../index.html';
    }

class FruitNinja extends Phaser.Scene {
  constructor() {
    super({ key: 'FruitNinja' });
    this.fruits = null;
    this.score = 0;
    this.swipePath = [];
    this.clicks = 0;
    this.maxClicks = 50;
    this.gameOver = false;
  }

  preload() {
    this.load.image('apple', '../assets/img/fruit/red_apple.png');
    this.load.image('banana', '../assets/img/fruit/banana.png');
    this.load.image('grapes', '../assets/img/fruit/grapes.png');
    this.load.image('green', '../assets/img/fruit/green_apple.png');
  }

  create() {
    this.fruits = this.physics.add.group();
    this.scoreText = document.getElementById('scoreDisplay');
    this.scoreText.textContent = `Puntuación: 0`;

    this.input.on('pointerdown', pointer => {
      this.clicks++;
      if (this.clicks >= this.maxClicks) {
        this.endGame();
        return;
      }
      this.swipePath = [{ x: pointer.x, y: pointer.y }];
    });

    this.input.on('pointermove', pointer => {
      if (this.swipePath.length) {
        this.swipePath.push({ x: pointer.x, y: pointer.y });
        this.checkSlice(pointer);
      }
    });

    this.input.on('pointerup', () => {
      this.swipePath = [];
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.launchFruit,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    this.fruits.getChildren().forEach(fruit => {
      if (fruit.y > this.scale.height + 100) {
        fruit.destroy();
      }
    });
  }

 launchFruit() {
  const fruitsArray = ['apple', 'banana','grapes','green'];
  const x = Phaser.Math.Between(100, this.scale.width - 100);
  const fruitType = Phaser.Utils.Array.GetRandom(fruitsArray);

  const fruit = this.physics.add.sprite(x, -10, fruitType);
  fruit.setScale(0.4);
  fruit.setData('cut', false);

  // Collider circular más grande
  const baseRadius = (fruit.displayWidth + fruit.displayHeight) / 4;
  const largerRadius = baseRadius * 1.3;

  fruit.body.setCircle(largerRadius);
  fruit.body.setOffset(
    fruit.width / 2 - largerRadius,
    fruit.height / 2 - largerRadius
  );

  fruit.setVelocity(
    Phaser.Math.Between(-30, 30),
    Phaser.Math.Between(150, 250)
  );

  // Guardamos la velocidad angular manualmente en una propiedad personalizada
  fruit.angularVelocity = Phaser.Math.Between(-200, 200);

  fruit.setBounce(0);
  fruit.setCollideWorldBounds(false);

  this.fruits.add(fruit);
}

update(time, delta) {
  this.fruits.getChildren().forEach(fruit => {
    // Actualizar rotación visual sumando angularVelocity * delta (delta está en ms)
    fruit.angle += fruit.angularVelocity * (delta / 1000);

    if (fruit.y > this.scale.height + 100) {
      fruit.destroy();
    }
  });
}


  checkSlice(pointer) {
    this.fruits.getChildren().forEach(fruit => {
      if (fruit.getData('cut')) return;

      const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, fruit.x, fruit.y);
      if (dist < fruit.displayWidth / 2) {
        this.cutFruit(fruit);
      }
    });
  }

  cutFruit(fruit) {
    fruit.setData('cut', true);
    this.score += 10;
    this.scoreText.textContent = `Puntuación: ${this.score}`;

    this.tweens.add({
      targets: fruit,
      scale: 0,
      alpha: 0,
      duration: 300,
      ease: 'Power1',
      onComplete: () => {
        fruit.destroy();
      }
    });
  }

 async endGame() {
  try {
    this.gameOver = true;
    await saveGameSession(token, 'Fruits', this.score);
    console.log(`Puntos guardados: ${this.score}`);
  } catch (e) {
    alert('Error guardando puntuación: ' + e.message);
    if (e.message.toLowerCase().includes('unauthorized')) {
      localStorage.clear();
      window.location.href = '../index.html';
      return; // para evitar reiniciar la escena si redirigimos
    }
  }

  // Reiniciar estado sólo si no hubo redirección
  this.resetGame();
}



resetGame() {
  this.gameOver = false;
  this.scene.restart();
  this.score = 0;
  this.clicks = 0;
  this.scoreText.textContent = `Puntuación: 0`;
}
}

// Obtener ancho y alto dinámicamente
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight * 0.8; // ligeramente más pequeño para dejar espacio al marcador

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: canvasWidth,
  height: canvasHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: FruitNinja,
  backgroundColor: '#0a2e51',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight * 0.8);
});

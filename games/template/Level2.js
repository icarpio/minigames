import GameState from './GameState.js';

export default class Level2 extends Phaser.Scene {
  constructor() {
    super('Level2');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy1', 'assets/enemy1.png');
    this.load.image('enemy2', 'assets/enemy2.png');
    this.load.image('enemy3', 'assets/enemy3.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('portal', 'assets/portal.png'); // Carga el portal
  }

  create() {
    // HUD
    this.scoreText = this.add.text(10, 10, `Score: ${GameState.score}`, { fontSize: '16px', fill: '#fff' });
    this.livesText = this.add.text(10, 30, `Lives: ${GameState.lives}`, { fontSize: '16px', fill: '#fff' });

    // Plataformas estáticas y móviles
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group();

    this.platforms.create(400, 580, 'platform').setScale(2).refreshBody(); // Suelo
    this.platforms.create(200, 450, 'platform');
    this.platforms.create(600, 350, 'platform');
    this.platforms.create(400, 250, 'platform');

    // Plataforma móvil
    const moving = this.movingPlatforms.create(300, 150, 'platform');
    moving.body.allowGravity = false;
    moving.setVelocityX(50);

    // Jugador
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Enemigos
    this.enemies = this.physics.add.group();
    this.createEnemies();

    // Colisiones jugador-enemigos
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);

    // ** PORTAL para pasar a Level3 **
    this.portal = this.physics.add.sprite(750, 520, 'portal');
    this.portal.setImmovable(true);
    this.portal.body.allowGravity = false;

    this.physics.add.collider(this.portal, this.platforms); // Portal sobre plataforma
    this.physics.add.overlap(this.player, this.portal, () => {
      this.scene.start('Level3');
      GameState.addItem({ name: 'LLave', texture: 'key' });
    }, null, this);
  }

  update() {
    // Movimiento jugador
    const speed = 160;
    const jumpSpeed = -330;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(jumpSpeed);
    }

    // Plataforma móvil
    this.movingPlatforms.children.iterate(platform => {
      if (platform.x > 500) platform.setVelocityX(-50);
      else if (platform.x < 100) platform.setVelocityX(50);
    });

    // Enemigos
    this.updateEnemies();

    // Actualizar HUD
    this.scoreText.setText(`Score: ${GameState.score}`);
    this.livesText.setText(`Lives: ${GameState.lives}`);
  }

  createEnemies() {
    const enemy1 = this.enemies.create(500, 500, 'enemy1');
    enemy1.setVelocityX(50);

    const enemy2 = this.enemies.create(300, 400, 'enemy2');
    enemy2.jumpTimer = this.time.addEvent({
      delay: 2000,
      callback: () => enemy2.setVelocityY(-200),
      loop: true
    });

    const enemy3 = this.enemies.create(600, 100, 'enemy3');
  }

  updateEnemies() {
    this.enemies.children.iterate(enemy => {
      if (enemy.texture.key === 'enemy1') {
        if (enemy.x > 700) enemy.setVelocityX(-50);
        if (enemy.x < 100) enemy.setVelocityX(50);
      }

      if (enemy.texture.key === 'enemy3') {
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        if (distance < 300) {
          this.physics.moveToObject(enemy, this.player, 60);
        } else {
          enemy.setVelocity(0);
        }
      }
    });
  }

  handlePlayerHit(player, enemy) {
    player.setVelocityY(-150);
    GameState.loseLife();
    this.livesText.setText(`Lives: ${GameState.lives}`);

    if (GameState.lives <= 0) {
      this.scene.restart();
    }
  }
}

import GameState from './GameState.js';

export default class BossFinal extends Phaser.Scene {
  constructor() {
    super('BossFinal');
  }

  preload() {
    // Carga imágenes y spritesheets para animaciones
    this.load.spritesheet('player', 'assets/player_spritesheet.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('boss', 'assets/boss.png');
    this.load.image('tentacleSegment', 'assets/tentacle_segment.png');
  }

  create() {
    // --- Crear suelo ---
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 584, 'ground').setScale(2).refreshBody();

    // --- Crear jugador ---
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    // Animaciones jugador
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 10
    });
    this.anims.create({
      key: 'shoot',
      frames: [{ key: 'player', frame: 5 }],
      frameRate: 10
    });

    //PLAYERHUB
    this.livesText = this.add.text(10, 10, `Vidas: ${GameState.lives}`, { fontSize: '16px', fill: '#fff' });
    this.scoreText = this.add.text(10, 30, `Score: ${GameState.score}`, { fontSize: '16px', fill: '#fff' });


    // --- Controles ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // --- Crear Boss ---
    this.boss = this.physics.add.sprite(600, 450, 'boss');
    this.boss.setImmovable(true);
    this.boss.health = 100;

    // --- Crear grupo de balas jugador ---
    this.playerBullets = this.physics.add.group();

    // --- Crear grupo de balas boss ---
    this.bossBullets = this.physics.add.group();

    // --- Colliders ---
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.boss, this.ground);
    this.physics.add.collider(this.playerBullets, this.boss, this.hitBoss, null, this);
    this.physics.add.collider(this.bossBullets, this.player, this.hitPlayer, null, this);

    // --- Barra de vida ---
    this.healthBarBg = this.add.rectangle(400, 30, 200, 20, 0x555555);
    this.healthBar = this.add.rectangle(400, 30, 200, 20, 0xff0000);
    this.healthBar.setOrigin(0.5, 0.5);

    // --- Tentáculos ---
    this.createTentacles();

    // --- Temporizadores ---
    this.time.addEvent({
      delay: 2000,
      callback: this.bossShoot,
      callbackScope: this,
      loop: true
    });

    this.lastShotTime = 0;
    this.shootCooldown = 500; // ms cooldown disparo jugador
  }

  update(time, delta) {
    this.livesText.setText(`Vidas: ${GameState.lives}`);
    this.scoreText.setText(`Score: ${GameState.score}`);

    // --- Movimiento jugador ---
    const speed = 160;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk', true);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    // --- Salto ---
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
      this.player.anims.play('jump');
    }

    // --- Disparo jugador ---
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.playerShoot();
    }

    // --- Actualizar tentáculos ---
    this.updateTentacles(time);

    // --- Actualizar barra vida ---
    this.updateHealthBar();

    // --- Verificar muerte boss ---
    if (this.boss.health <= 0) {
      GameState.addScore(1000); // premio por matar boss
      this.scene.start('WinScreen');
    }
  }

  // --- Función para disparar balas jugador ---
  playerShoot() {
    const now = this.time.now;
    if (now - this.lastShotTime < this.shootCooldown) return; // cooldown disparo

    this.lastShotTime = now;

    this.player.anims.play('shoot');

    const bullet = this.playerBullets.create(this.player.x, this.player.y, 'bullet');
    bullet.setVelocityX(this.player.flipX ? -400 : 400);
    bullet.body.allowGravity = false;

    // Destruir bala si sale de pantalla
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.body.world.on('worldbounds', body => {
      if (body.gameObject === bullet) bullet.destroy();
    });
  }

  // --- Función cuando bala jugador golpea boss ---
  hitBoss(bullet, boss) {
    bullet.destroy();
    boss.health -= 10;
  }

  // --- Función cuando bala boss golpea jugador ---
  hitPlayer(player, bullet) {
    bullet.destroy();
    GameState.loseLife();
    if (GameState.lives <= 0) {
      this.scene.start('GameOverScreen');
    }
  }

  // --- Boss dispara ---
  bossShoot() {
    const bullet = this.bossBullets.create(this.boss.x - 50, this.boss.y + 20, 'bullet');
    bullet.setVelocityX(-300);
    bullet.body.allowGravity = false;

    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.body.world.on('worldbounds', body => {
      if (body.gameObject === bullet) bullet.destroy();
    });
  }

  // --- Crear tentáculos ---
  createTentacles() {
    this.tentacles = [];

    // Número de tentáculos y longitud de cadenas
    const tentacleCount = 3;
    const segmentCount = 6;

    for (let i = 0; i < tentacleCount; i++) {
      const segments = [];

      for (let j = 0; j < segmentCount; j++) {
        const x = this.boss.x + 50 + i * 30;
        const y = this.boss.y + 20 + j * 20;

        let segment = this.physics.add.sprite(x, y, 'tentacleSegment');
        segment.setImmovable(true);
        segments.push(segment);
      }

      this.tentacles.push(segments);
    }
  }

  // --- Actualizar movimiento tentáculos ---
  updateTentacles(time) {
    // Oscilar cada segmento con un movimiento tipo tentáculo
    this.tentacles.forEach((segments, i) => {
      segments.forEach((segment, j) => {
        const offset = Math.sin(time / 500 + j) * 10;
        segment.y = this.boss.y + 20 + j * 20 + offset;
        segment.x = this.boss.x + 50 + i * 30 + Math.cos(time / 700 + j) * 5;
      });
    });
  }

  // --- Actualizar barra de vida ---
  updateHealthBar() {
    this.healthBar.width = 200 * (this.boss.health / 100);
  }
}


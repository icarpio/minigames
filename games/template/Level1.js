import GameState from './GameState.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    this.load.image('platform', 'assets/platform.png');
    this.load.image('stairs', 'assets/stairs.png');
    this.load.image('playerTexture', 'assets/player.png');
    this.load.image('gem', 'assets/gem.png');  // Carga la gema
  }

  create() {
    // Plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 580, 'platform').setScale(2).refreshBody();
    this.platforms.create(600, 450, 'platform');
    this.platforms.create(50, 350, 'platform');
    this.platforms.create(750, 300, 'platform');

    // Escaleras
    this.stairs = this.physics.add.staticGroup();
    this.stairs.create(600, 500, 'stairs');
    this.stairs.create(50, 300, 'stairs');

    // Jugador
    this.player = this.physics.add.sprite(100, 450, 'playerTexture');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Gema para recoger
    this.gem = this.physics.add.sprite(600, 400, 'gem'); // posición sobre plataforma
    this.physics.add.overlap(this.player, this.gem, this.collectGem, null, this);

    // CONTROLES MOVIL
    const mobileControls = this.scene.get('MobileControls');
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;

    mobileControls.events.on('moveLeft', isDown => this.moveLeft = isDown);
    mobileControls.events.on('moveRight', isDown => this.moveRight = isDown);
    mobileControls.events.on('moveUp', isDown => this.moveUp = isDown);
    mobileControls.events.on('moveDown', isDown => this.moveDown = isDown);

    mobileControls.events.on('jump', () => {
      this.playerJump();
    });

    // HUD
    this.scoreText = this.add.text(10, 10, `Score: ${GameState.score}`, { fontSize: '16px', fill: '#fff' });
    this.livesText = this.add.text(10, 30, `Lives: ${GameState.lives}`, { fontSize: '16px', fill: '#fff' });

    // Botón inventario
    this.openButton = this.add.text(700, 20, 'Inventario', { fontSize: '20px', backgroundColor: '#000', padding: 10 })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const hud = this.scene.get('InventoryHUD');
        if (!hud.inventoryPanel.isOpen) {
          hud.inventoryPanel.togglePanel();
        }
      });
  }

  update() {
    if (this.moveLeft) {
      this.player.setVelocityX(-160);
    } else if (this.moveRight) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    const onStairs = this.physics.overlap(this.player, this.stairs);

    if (onStairs) {
      this.player.body.allowGravity = false;

      if (this.moveUp) {
        this.player.setVelocityY(-100);
      } else if (this.moveDown) {
        this.player.setVelocityY(100);
      } else {
        this.player.setVelocityY(0);
      }
    } else {
      this.player.body.allowGravity = true;
    }

    this.scoreText.setText(`Score: ${GameState.score}`);
    this.livesText.setText(`Lives: ${GameState.lives}`);
  }

  playerJump() {
    if (this.player.body.onFloor()) {
      this.player.setVelocityY(-330);
    }
  }

  collectGem(player, gem) {
    gem.disableBody(true, true); // Oculta y desactiva la gema
    GameState.addItem({ name: 'Gema', texture: 'gem' });
    // Opcional: Sumar puntos o actualizar HUD
    GameState.addScore(500);
    this.scoreText.setText(`Score: ${GameState.score}`);
  }
}

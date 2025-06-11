import GameState from './GameState.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    // CONTROLES MOVIL
    // Obtener escena MobileControls (debe estar activa y añadida en config)
    const mobileControls = this.scene.get('MobileControls');

    // Variables para movimiento
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

    //------------------------------------------------------------------------------


    // Mostrar HUD
    this.scoreText = this.add.text(10, 10, `Score: ${GameState.score}`, { fontSize: '16px', fill: '#fff' });
    this.livesText = this.add.text(10, 30, `Lives: ${GameState.lives}`, { fontSize: '16px', fill: '#fff' });

    // Simular ganar puntos o perder vidas
    this.time.delayedCall(2000, () => {
      GameState.addScore(100);
      GameState.loseLife();
      GameState.addItem({ name: 'Gema', texture: 'gem' });

      // Ir al siguiente nivel
      this.scene.start('Level2');
      // Botón para abrir inventario
    const openButton = this.add.text(700, 20, 'Inventario', { fontSize: '20px', backgroundColor: '#000', padding: 10 })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const hud = this.scene.get('InventoryHUD');
        if (!hud.inventoryPanel.isOpen) {
          hud.inventoryPanel.togglePanel();
        }
      });
    });
  }


  update() {
    //------------CONTROLES MOVILES Movimiento horizontal--------------------------
    if (this.moveLeft) {
      this.player.setVelocityX(-160);
    } else if (this.moveRight) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
    // Actualizar texto si lo necesitas dinámicamente
    this.scoreText.setText(`Score: ${GameState.score}`);
    this.livesText.setText(`Lives: ${GameState.lives}`);
    // Si quieres manejar arriba/abajo (por ejemplo en un juego tipo plataforma 2D):
    if (this.moveUp) {
      // código para subir (por ejemplo escaleras)
    }
    if (this.moveDown) {
      // código para bajar
    }
    //------------------------------------------------------------------
  }

  playerJump() {
    if (this.player.body.onFloor()) { // o touching.down
      this.player.setVelocityY(-330);
    }
  }
}
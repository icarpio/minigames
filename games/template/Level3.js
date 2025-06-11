import GameState from './GameState.js';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  create() {
    // Mostrar HUD
    this.scoreText = this.add.text(10, 10, `Score: ${GameState.score}`, { fontSize: '16px', fill: '#fff' });
    this.livesText = this.add.text(10, 30, `Lives: ${GameState.lives}`, { fontSize: '16px', fill: '#fff' });

    // Simular ganar puntos o perder vidas
    this.time.delayedCall(2000, () => {
      GameState.addScore(100);
      GameState.loseLife();
      GameState.addItem({ name: 'Poción', texture: 'potion' });

      // Ir al siguiente nivel
      this.scene.start('WinScreen');
    });
    // Botón para abrir inventario
    const openButton = this.add.text(700, 20, 'Inventario', { fontSize: '20px', backgroundColor: '#000', padding: 10 })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const hud = this.scene.get('InventoryHUD');
        if (!hud.inventoryPanel.isOpen) {
          hud.inventoryPanel.togglePanel();
        }
      });
  }


  update() {
    // Actualizar texto si lo necesitas dinámicamente
    this.scoreText.setText(`Score: ${GameState.score}`);
    this.livesText.setText(`Lives: ${GameState.lives}`);
  }
  
}
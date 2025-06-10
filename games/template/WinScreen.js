export default class WinScreen extends Phaser.Scene {
  constructor() {
    super('WinScreen');
  }

  create() {
    this.add.text(400, 200, '¡Has ganado!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    const restartButton = this.add.text(400, 300, 'Reiniciar', { fontSize: '28px', fill: '#0f0' })
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('Menu');
    });
  }
}

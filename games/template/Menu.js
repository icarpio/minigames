export default class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.text(400, 200, 'MENÚ PRINCIPAL', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const playButton = this.add.text(400, 300, 'Jugar', { fontSize: '28px', fill: '#0f0' })
      .setOrigin(0.5)
      .setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('Level1');
    });
  }
}

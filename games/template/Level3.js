export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  create() {
    this.score = 0;
    this.scoreText = document.getElementById('scoreDisplay');
    this.scoreText.textContent = 'Puntuación: 0';

    // Ejemplo de contenido: simplemente pasa al siguiente nivel
    this.add.text(400, 250, 'Nivel 3', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('Level2'); // Cambia a siguiente nivel
    });
  }
}
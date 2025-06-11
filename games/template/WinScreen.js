import GameState from './GameState.js';

import { saveGameSession } from './js/api.js';

const token = (localStorage.getItem('token') || '').trim();
if (!token) {
  alert('No has iniciado sesión. Serás redirigido al login.');
  window.location.href = '../index.html';
}

export default class WinScreen extends Phaser.Scene {
  constructor() {
    super('WinScreen');
  }

  create() {
    this.add.text(300, 100, '¡Ganaste!', { fontSize: '32px', fill: '#0f0' });
    this.add.text(300, 150, `Score final: ${GameState.score}`, { fontSize: '24px', fill: '#fff' });
    this.add.text(300, 190, `Vidas restantes: ${GameState.lives}`, { fontSize: '24px', fill: '#fff' });
    this.add.text(300, 230, `Inventario: ${GameState.inventory.join(', ')}`, { fontSize: '24px', fill: '#fff' });

    // Opción de reiniciar
    this.input.once('pointerdown', () => {
      this.winGame();
    });
  }

    async winGame() {
      alert(`¡Felicidades! ¡Ganaste con ${this.score} puntos!`);
      try {
        await saveGameSession(token, 'Game002', this.score);
        GameState.reset();
        this.scene.start('Menu');
        console.log('Puntuación guardada correctamente');
      } catch (e) {
        alert('Error guardando puntuación: ' + e.message);
        if (e.message.toLowerCase().includes('unauthorized')) {
          localStorage.clear();
          window.location.href = '../index.html';
        }
      }
      this.scene.restart();
    }
  }

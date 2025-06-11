// InventoryPanel.js
import GameState from './GameState.js';

export default class InventoryPanel {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    this.createPanel();
    this.setupToggleKey();
  }

  createPanel() {
  const width = 300;
  const height = 300;

  this.panelContainer = this.scene.add.container(400, 300).setVisible(false);
  this.panelContainer.setDepth(1000); // encima de todo

  // Fondo negro semi-transparente
  const background = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.8);
  background.setOrigin(0.5);
  this.panelContainer.add(background);

  this.gridSlots = [];
  this.createGrid();

  // Botón Cerrar
  const closeButton = this.scene.add.text(0, -height/2 + 20, 'Cerrar', { fontSize: '18px', backgroundColor: '#ff0000', padding: 6 })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.togglePanel();
    });

  this.panelContainer.add(closeButton);

  // Aparece con un pequeño zoom-in
  this.openTween = this.scene.tweens.add({
    targets: this.panelContainer,
    scale: 1,
    duration: 200,
    ease: 'Back.Out',
    paused: true
  });

  this.panelContainer.setScale(0.8); // zoom inicial
}


  createGrid() {
    const cols = 4;
    const spacing = 60;
    const startX = -120;
    const startY = -100;

    for (let i = 0; i < 12; i++) {
      const x = startX + (i % cols) * spacing;
      const y = startY + Math.floor(i / cols) * spacing;

      const slotBg = this.scene.add.rectangle(x, y, 50, 50, 0xffffff, 0.1)
        .setStrokeStyle(1, 0xffffff);
      this.panelContainer.add(slotBg);
      this.gridSlots.push({ x, y, slotBg });
    }
  }

  setupToggleKey() {
    this.scene.input.keyboard.on('keydown-I', () => {
      this.togglePanel();
    });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    this.panelContainer.setVisible(this.isOpen);

    if (this.isOpen) {
      this.renderItems();
      this.openTween.play();
    }
  }

  renderItems() {
    // Limpia íconos anteriores
    this.gridSlots.forEach(slot => {
      if (slot.icon) {
        slot.icon.destroy();
        slot.icon = null;
      }
    });

    GameState.inventory.forEach((item, index) => {
      if (index >= this.gridSlots.length) return;
      const slot = this.gridSlots[index];
      const icon = this.scene.add.image(slot.x, slot.y, item.texture).setScale(0.5);
      this.panelContainer.add(icon);

      // Efecto de aparición
      icon.setAlpha(0);
      this.scene.tweens.add({
        targets: icon,
        alpha: 1,
        duration: 300,
        delay: index * 50
      });

      slot.icon = icon;
    });
  }
}

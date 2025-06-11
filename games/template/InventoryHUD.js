// InventoryHUD.js
import InventoryPanel from './InventoryPanel.js';

export default class InventoryHUD extends Phaser.Scene {
  constructor() {
    super({ key: 'InventoryHUD', active: true }); // Siempre activa
  }

  preload() {
    this.load.image('key', '../../assets/img/img.png');
    this.load.image('potion', '../../assets/img/img.png');
    this.load.image('gem', '../../assets/img/img.png');
  }

  create() {
    this.inventoryPanel = new InventoryPanel(this); // Solo una vez
  }
}
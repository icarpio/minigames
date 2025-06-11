import Menu from '../Menu.js';
import Level1 from '../Level1.js';
import Level2 from '../Level2.js';
import Level3 from '../Level3.js';
import WinScreen from '../WinScreen.js';
import InventoryHUD from '../InventoryHUD.js';
import MobileControls from '../MobileControls.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Menu, InventoryHUD,MobileControls,Level1, Level2, Level3,WinScreen],
  backgroundColor: '#222'
};

new Phaser.Game(config);

export default class MobileControls extends Phaser.Scene {
  constructor() {
    super({ key: 'MobileControls', active: true });
  }

  create() {
    const buttonStyle = {
      fontSize: '48px',
      backgroundColor: '#000',
      padding: 10,
      color: '#fff',
      align: 'center',
      fixedWidth: 70,
      fixedHeight: 70,
      // para centrar texto vertical y horizontal:
      valign: 'middle',
      origin: 0.5
    };

    // Posiciones básicas (ajusta según necesites)
    const yPos = this.sys.game.config.height - 80;

    // Flechas de control
    this.leftButton = this.add.text(60, yPos, '⬅️', buttonStyle).setInteractive();
    this.rightButton = this.add.text(150, yPos, '➡️', buttonStyle).setInteractive();
    this.upButton = this.add.text(105, yPos - 70, '⬆️', buttonStyle).setInteractive();
    this.downButton = this.add.text(105, yPos + 70, '⬇️', buttonStyle).setInteractive();

    // Botón de salto
    this.jumpButton = this.add.text(this.sys.game.config.width - 80, yPos, '🦘', buttonStyle).setInteractive();

    // Estado para emitir eventos
    this.isLeftDown = false;
    this.isRightDown = false;
    this.isUpDown = false;
    this.isDownDown = false;

    // Eventos de pointerdown / pointerup para cada botón

    this.leftButton
      .on('pointerdown', () => {
        this.isLeftDown = true;
        this.events.emit('moveLeft', true);
      })
      .on('pointerup', () => {
        this.isLeftDown = false;
        this.events.emit('moveLeft', false);
      })
      .on('pointerout', () => { // por si se va fuera del botón
        if (this.isLeftDown) {
          this.isLeftDown = false;
          this.events.emit('moveLeft', false);
        }
      });

    this.rightButton
      .on('pointerdown', () => {
        this.isRightDown = true;
        this.events.emit('moveRight', true);
      })
      .on('pointerup', () => {
        this.isRightDown = false;
        this.events.emit('moveRight', false);
      })
      .on('pointerout', () => {
        if (this.isRightDown) {
          this.isRightDown = false;
          this.events.emit('moveRight', false);
        }
      });

    this.upButton
      .on('pointerdown', () => {
        this.isUpDown = true;
        this.events.emit('moveUp', true);
      })
      .on('pointerup', () => {
        this.isUpDown = false;
        this.events.emit('moveUp', false);
      })
      .on('pointerout', () => {
        if (this.isUpDown) {
          this.isUpDown = false;
          this.events.emit('moveUp', false);
        }
      });

    this.downButton
      .on('pointerdown', () => {
        this.isDownDown = true;
        this.events.emit('moveDown', true);
      })
      .on('pointerup', () => {
        this.isDownDown = false;
        this.events.emit('moveDown', false);
      })
      .on('pointerout', () => {
        if (this.isDownDown) {
          this.isDownDown = false;
          this.events.emit('moveDown', false);
        }
      });

    // Salto: solo pointerdown (no necesita mantenerse presionado)
    this.jumpButton.on('pointerdown', () => {
      this.events.emit('jump');
    });

    // Opcional: ocultar controles si no es dispositivo táctil
    if (!this.sys.game.device.input.touch) {
      this.scene.setVisible(false);
    }
  }
}

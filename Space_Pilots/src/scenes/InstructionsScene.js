// inicializace promennych
var backsbutton;
var background;
var back = false;
var buttonClick;
var volume = 1;

export class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: "InstructionsScene"
        })
    }

    init(data) {
        volume = data.volume;
    }

    preload() {
    }

    create() {
        // pozadi
        // souradnice x, y, sirka a vyska a nazev obrazku, co se do toho da
        background = this.add.tileSprite(640, 448, 1280, 896, 'instructionBackground');
        // tlačitko
        backsbutton = this.add.image(160, 850, 'back');

        buttonClick = this.sound.add('buttonClick');
        backsbutton.setInteractive();
        buttonClick.volume = volume;

        backsbutton.on('pointerup', function (pointer) {
            back = true;
            buttonClick.play();

        });
    }

    update() {
        if (back) {
            this.scene.start("MenuScene", { volume: volume });
            back = false;
        }
    }
}
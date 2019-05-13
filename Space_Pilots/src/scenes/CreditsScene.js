// inicializace promennych
var backsbutton;
var background;
var background2;
var background3;
var title;
var back = false;
var buttonClick;
var volume = 1;
var background1y;
var background2y;

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({
            key: "CreditsScene"
        })
    }

    init(data) {

        background1y = data.y1;
        background2y = data.y2;
        volume = data.volume;

    }

    preload() {
    }

    create() {
        // pozadi

        // pozadi
        if (background1y === background2y) {
            background = this.add.tileSprite(640, 1792, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, 5376, 1280, 3584, 'menuBackground');
        } else {
            background = this.add.tileSprite(640, background1y, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, background2y, 1280, 3584, 'menuBackground');
        }
        background3 = this.add.tileSprite(640, 448, 1280, 896, 'creditsScreen');

        backsbutton = this.add.image(160, 850, 'back');
        backsbutton.setInteractive();

        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;

        backsbutton.on('pointerup', function (pointer) {
            back = true;
            buttonClick.play();
        });
    }

    update() {
        // pohyb pozadi
        background.y -= 0.5;
        if (background.y === -1792) {
            background.y = 5376;
        }
        background2.y -= 0.5;

        if (background2.y === -1792) {
            background2.y = 5376;
        }

        if (back) {
            this.scene.start("MenuScene", { volume: volume, y1: background.y, y2: background2.y, });
            back = false;
        }

    }
}
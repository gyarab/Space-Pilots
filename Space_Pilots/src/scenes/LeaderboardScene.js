// inicializace promennych
var backsbutton;
var background;
var background2;
var title;
var back = false;
var background1y;
var background2y;
var buttonClick;
var scoreText = [];
var nameText = [];
var scoreField = [];
var x;
var volume = 1;

export class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({
            key: "LeaderboardScene"
        })
    }
    init(data) {
        volume = data.volume;
        background1y = data.y1;
        background2y = data.y2;
    }
    preload() {
    }

    create() {
        // pozadi
        if (background1y === background2y) {
            // souradnice x, y, sirka a vyska a nazev obrazku, co se do toho da
            background = this.add.tileSprite(640, 1792, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, 5376, 1280, 3584, 'menuBackground');
        } else {

            background = this.add.tileSprite(640, background1y, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, background2y, 1280, 3584, 'menuBackground');
        }

        title = this.add.image(640, 100, 'title');
        backsbutton = this.add.image(160, 850, 'back');
        backsbutton.setInteractive();

        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;
        backsbutton.on('pointerup', function (pointer) {
            back = true;
            buttonClick.play();

        });

        // nacteni skore a pridani nove serazeneho skore do pameti browseru
        scoreField = JSON.parse(localStorage.getItem("score"));
        for (var i = 0; i < 10; i++) {
            scoreText.push(this.add.text(800, 198 + i * 65));
            nameText.push(this.add.text(400, 198 + i * 65));

        }
        if (scoreField !== null && scoreField !== undefined) {
            x = scoreField.length;
            if (x > 10) {
                x = 10;
            }
            for (var i = 0; i < 10; i++) {
                if (i < x) {
                    scoreText[i].setText(" " + scoreField[i].score);
                    nameText[i].setText(i + 1 + ": " + scoreField[i].playerName);
                }
                else {
                    nameText[i].setText(i + 1 + ": ");
                }
            }
        }
        else {
            for (var i = 0; i < 10; i++) {

                scoreText[i].setText(i + 1 + ": ");
            }
        }

    }
    update() {
        // pozadi
        background.y -= 0.5;
        if (background.y === -1792) {
            background.y = 5376;
        }
        background2.y -= 0.5;

        if (background2.y === -1792) {
            background2.y = 5376;
        }
        // navrat do menu
        if (back) {
            this.scene.start("MenuScene", { y1: background.y, y2: background2.y, volume: volume });
            back = false;
            scoreText = [];
            nameText = [];
            scoreField = [];
        }

    }
}
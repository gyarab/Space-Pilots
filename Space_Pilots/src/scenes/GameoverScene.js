// inicializace promennych
var backToMenu;
var music;
var buttonClick;
var background;
var scoreText;
var score = 0;
var scoreField = [];
var volume = 1.0;
var playerName;

export class GameoverScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameoverScene"
        })
    }

    init(data) {
        playerName = data.playerName;
        score = data.score;
        volume = data.volume;
    }

    preload() {
        this.load.image("backgroundGameOver", "./assets/GameOverBackground.jpg");
    }

    create() {
        background = this.add.tileSprite(640, 1792, 1280, 3584, 'backgroundGameOver');

        scoreText = this.add.text(542, 140, '', { fontSize: '28px', fill: '#87CEEB' });
        backToMenu = this.add.image(640, 850, 'menu1');

        music = this.sound.add('gameOver');
        buttonClick = this.sound.add('buttonClick');
        music.volume = volume;
        buttonClick.volume = volume;
        music.play();


        // nacteni skore a pridani nove serazeneho skore do pameti browseru
        var testObject = JSON.parse(localStorage.getItem("score"));
        if (testObject !== null) {
            scoreField = JSON.parse(localStorage.getItem("score"));
        }
        var scoreObject = {
            playerName: playerName,
            score: score,


        };
        if (scoreField === null || scoreField === undefined) {
            scoreField[0] = scoreObject;
        }
        else {
            scoreField.push(scoreObject);


            var length = scoreField.length;
            for (var i = (length - 1); i >= 0; i--) {
                for (var j = (length - i); j > 0; j--) {
                    if (scoreField[j] === undefined) {
                        break;
                    }
                    if (scoreField[j].score > scoreField[j - 1].score) {

                        var tmp = scoreField[j];
                        scoreField[j] = scoreField[j - 1];
                        scoreField[j - 1] = tmp;

                    }
                }
            }
        }

        localStorage.setItem("score", JSON.stringify(scoreField));

        //akce tlacitka, navrat do menu
        backToMenu.setInteractive();
        backToMenu.on('pointerup', function (pointer) {
            console.log(volume);
            this.scene.start("MenuScene", { volume: volume });
            music.stop();
            buttonClick.play();
        }, this);
    }

    update() {
        scoreText.setText("Score: " + score);
    }
}
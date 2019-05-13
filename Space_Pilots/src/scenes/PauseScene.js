// inicializace promennych
var resumebutton;
var resume = false;
var level;
var menubutton;
var buttonClick;
var volume = 1.0;

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PauseScene"
        })
    }
    init(data) {
        volume = data.volume;
        level = data.level;
    }

    preload() {
    }

    create() {
        // tlacitka
        resumebutton = this.add.image(640, 488, 'resume');
        menubutton = this.add.image(635, 438, 'menu1');

        // zvuky tlacitek
        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;

        // akce tlacitek
        resumebutton.setInteractive();
        menubutton.setInteractive();

        resumebutton.on('pointerup', function (pointer) {
            resume = true;
            buttonClick.play();
        });
        menubutton.on('pointerup', function (pointer) {
            buttonClick.play();

            this.scene.start("MenuScene", { volume: volume });

            if (level === 1) {
                this.scene.stop("Level1Scene");
            }
            if (level === 2) {
                this.scene.stop("Level2Scene");
            }
            if (level === 3) {
                this.scene.stop("Level3Scene");
            }
            if (level === 4) {
                this.scene.stop("Level4Scene");
            }

            level = 1;
            this.scene.stop();

        }, this);
    }

    update() {

        // navrat do levelu
        if (resume) {
            if (level === 1) {
                this.scene.resume("Level1Scene");
            }
            if (level === 2) {
                this.scene.resume("Level2Scene");
            }
            if (level === 3) {
                this.scene.resume("Level3Scene");
            }
            if (level === 4) {
                this.scene.resume("Level4Scene");
            }
            resume = false;
            this.scene.stop();
        }
    }
}
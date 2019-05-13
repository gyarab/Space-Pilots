// inicializace promennych
var title;
var volume = 1;
var level = 5;
var resumebutton;
var menubutton;
var buttonClick;
var resume;

export class InfiniteLevelPauseScene extends Phaser.Scene {
    constructor() {
        super({
            key: "InfiniteLevelPauseScene"
        })
    }

    init(data) {
        volume = data.volume;
        level = data.level;
    }

    preload() {
    }

    create() {
        title = this.add.image(640, 100, 'title');
        resumebutton = this.add.image(640, 488, 'resume');
        menubutton = this.add.image(640, 438, 'menu1');
        resumebutton.setInteractive();
        menubutton.setInteractive();

        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;

        resumebutton.on('pointerup', function (pointer) {
            resume = true;
            buttonClick.play();

        });
        menubutton.on('pointerup', function (pointer) {
            buttonClick.play();
            this.scene.stop("InfiniteLevelScene");
            this.scene.start("MenuScene", { volume: volume });
            this.scene.stop();
        }, this);
    }

    update() {
        // navrat do hry
        if (resume) {
            this.scene.resume("InfiniteLevelScene");
            resume = false;
            this.scene.stop();

        }
    }
}
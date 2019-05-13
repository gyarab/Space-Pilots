// inicializace promennych
var backsbutton;
var leftarrow;
var rightarrow;
var background;
var background2;
var easybutton;
var mediumbutton;
var hardbutton;
var title;
var back = false;
var next = false;
var background1y;
var background2y;
var difficulty = 1;
var buttonClick;
var storybutton;
var infinitebutton;
var confirmbutton;
var story = true;
var infinite = false;
var volume = 1;
var playerName;
var shipCounter = 1;
var ship;
var hsv;
var graphics;
var damageStat = 3;
var shieldStat = 3;
var energyRegenStat = 3;
var bombStat = 3;
var statusText = [];
var timer = 0;
var graphicsUpdate = true;
var chooseText = [];

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PlayScene"
        })
    }
    init(data) {
        playerName = data.playerName;
        volume = data.volume;
        background1y = data.y1;
        background2y = data.y2;
    }
    preload() {
    }

    create() {
        difficulty = 1;
        statusText = [];
        chooseText = [];
        graphicsUpdate = true;
        story = true;
        infinite = false;
        if (background1y === background2y) {
            // souradnice x, y, sirka a vyska a nazev obrazku, co se do toho da
            background = this.add.tileSprite(640, 1792, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, 5376, 1280, 3584, 'menuBackground');
        } else {
            background = this.add.tileSprite(640, background1y, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, background2y, 1280, 3584, 'menuBackground');
        }
        title = this.add.image(640, 100, 'title');
        ship = this.add.image(620, 420, 'PlayerShip1');

        // tlacitka
        easybutton = this.add.image(320, 200, 'easy');
        mediumbutton = this.add.image(320, 250, 'medium');
        hardbutton = this.add.image(320, 300, 'hard');
        storybutton = this.add.image(960, 200, 'storyMode');
        infinitebutton = this.add.image(960, 250, 'infinityMode');
        backsbutton = this.add.image(100, 850, 'back');
        leftarrow = this.add.image(400, 500, 'leftArrow');
        rightarrow = this.add.image(880, 500, 'rightArrow');
        confirmbutton = this.add.image(1180, 850, 'confirm');

        hsv = Phaser.Display.Color.HSVColorWheel();
        graphics = this.add.graphics({ x: 700, y: 552 });
        for (var i = 0; i < 4; i++) {
            statusText.push(this.add.text(510, 550 + i * 30));
            chooseText.push(this.add.text(510, 250 + i * 30));

        }
        // text a grafika
        if (shipCounter === 1) {
            ship.setTexture('PlayerShip1');
            chooseText[1].setText("Ship: " + "Cyclone");
        }
        if (shipCounter === 2) {
            ship.setTexture('PlayerShip2');
            chooseText[1].setText("Ship: " + "Warlock");
        }
        if (shipCounter === 3) {
            ship.setTexture('PlayerShip3');
            chooseText[1].setText("Ship: " + "Vanguard");
        }

        chooseText[0].setText("Pilot: " + playerName);
        chooseText[2].setText("Difficulty: " + "Medium");
        chooseText[3].setText("Gamemode: " + "Story");

        statusText[0].setText("DAMAGE:");
        statusText[1].setText("SHIELD:");
        statusText[2].setText("ENERGY REGEN:");
        statusText[3].setText("BOMBS:");

        // zvuk tlacitek
        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;

        // akce tlacitek
        backsbutton.setInteractive();
        easybutton.setInteractive();
        mediumbutton.setInteractive();
        hardbutton.setInteractive();

        storybutton.setInteractive();
        infinitebutton.setInteractive();
        leftarrow.setInteractive();
        rightarrow.setInteractive();
        confirmbutton.setInteractive();

        backsbutton.on('pointerup', function (pointer) {
            back = true;
            buttonClick.play();

        });
        easybutton.on('pointerdown', function (pointer) {
            difficulty = 0.5;
            buttonClick.play();
            chooseText[2].setText("Difficulty: " + "Easy");
        });
        mediumbutton.on('pointerdown', function (pointer) {
            difficulty = 1;
            buttonClick.play();
            chooseText[2].setText("Difficulty: " + "Medium");
        });
        hardbutton.on('pointerdown', function (pointer) {
            difficulty = 1.5;
            buttonClick.play();
            chooseText[2].setText("Difficulty: " + "Hard");
        });
        storybutton.on('pointerdown', function (pointer) {
            story = true;
            infinite = false;
            buttonClick.play();
            chooseText[3].setText("Gamemode: " + "Story");
        });
        infinitebutton.on('pointerdown', function (pointer) {
            infinite = true;
            story = false;
            buttonClick.play();
            chooseText[3].setText("Gamemode: " + "Infinite");
        });
        confirmbutton.on('pointerdown', function (pointer) {
            next = true;
            buttonClick.play();
        });
        rightarrow.on('pointerdown', function (pointer) {
            graphicsUpdate = true;
            if (shipCounter === 3) {
                shipCounter = 1;
            } else {
                shipCounter += 1;
            }

            if (shipCounter === 1) {
                chooseText[1].setText("Ship: " + "Cyclone");
                ship.setTexture('PlayerShip1');
                damageStat = 3;
                shieldStat = 3;
                energyRegenStat = 4;
                bombStat = 3;
            }
            if (shipCounter === 2) {
                chooseText[1].setText("Ship: " + "Warlock");
                damageStat = 4;
                shieldStat = 1;
                energyRegenStat = 5;
                bombStat = 1;
                ship.setTexture('PlayerShip2');
            }
            if (shipCounter === 3) {
                chooseText[1].setText("Ship: " + "Vanguard");
                damageStat = 3;
                shieldStat = 5;
                energyRegenStat = 3;
                bombStat = 2;
                ship.setTexture('PlayerShip3');
            }
            buttonClick.play();

        });
        leftarrow.on('pointerdown', function (pointer) {
            graphicsUpdate = true;
            if (shipCounter === 1) {
                shipCounter = 3;
            } else {
                shipCounter -= 1;
            }
            if (shipCounter === 1) {
                chooseText[1].setText("Ship: " + "Cyclone");
                damageStat = 3;
                shieldStat = 3;
                energyRegenStat = 4;
                bombStat = 3;
                ship.setTexture('PlayerShip1');
            }
            if (shipCounter === 2) {
                chooseText[1].setText("Ship: " + "Warlock");
                damageStat = 4;
                shieldStat = 1;
                energyRegenStat = 5;
                bombStat = 1;
                ship.setTexture('PlayerShip2');
            }
            if (shipCounter === 3) {
                chooseText[1].setText("Ship: " + "Vanguard");
                damageStat = 3;
                shieldStat = 5;
                energyRegenStat = 3;
                bombStat = 2;
                ship.setTexture('PlayerShip3');

            }

            buttonClick.play();
        });




    }

    update() {
        // posun pozadi
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
        }

        // spusteni urovne
        if (next && story) {
            var shipObject = {
                damageStat: damageStat,
                shieldStat: shieldStat,
                energyRegenStat: energyRegenStat,
                bombStat: bombStat,

            }
            this.scene.start("Level1Scene", { diff: difficulty, volume: volume, playerName: playerName, shipObject: shipObject });
            difficulty = 1;
            next = false;
            infinite = false;
            story = false;
        }
        if (next && infinite) {
            var shipObject = {
                damageStat: damageStat,
                shieldStat: shieldStat,
                energyRegenStat: energyRegenStat,
                bombStat: bombStat,
            }
            this.scene.start("InfiniteLevelScene", { diff: difficulty, volume: volume, playerName: playerName, shipObject: shipObject });
            difficulty = 1;
            next = false;
            infinite = false;
            story = false;

        }

        // grafika k vyberu lodi
        if (graphicsUpdate) {
            graphicsUpdate = false;
            for (var i = 1; i < 6; i++) {
                if (i <= damageStat) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(i * 12, 0, 5, 10);
                } else {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(i * 12, 0, 5, 10);
                }
                if (i <= shieldStat) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(i * 12, 30, 5, 10);
                } else {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(i * 12, 30, 5, 10);
                }

                if (i <= energyRegenStat) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(i * 12, 60, 5, 10);
                } else {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(i * 12, 60, 5, 10);
                }
                if (i <= bombStat) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(i * 12, 90, 5, 10);
                } else {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(i * 12, 90, 5, 10);
                }

            }

        }
    }
}
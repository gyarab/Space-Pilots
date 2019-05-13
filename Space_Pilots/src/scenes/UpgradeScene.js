// inicializace promennych
var money;
var moneyText;
var scoreText;
var saveText;
var difficulty;
var menuButton;
var saveButton;
var nextLevelButton;
var damageUpgradeButton;
var shieldProtectionUpgradeButton;
var energyConsumptionUpgradeButton;
var energyConsumption2UpgradeButton;
var energyRegenerationUpgradeButton;
var numberOfBombsUpgradeButton;
var levelCost = 500;
var damageUpgrade = 0;
var shieldProtectionUpgrade = 0;
var energyConsumptionUpgrade = 0;
var energyConsumption2Upgrade = 0;
var energyRegenerationUpgrade = 0;
var numberOfBombsUpgrade = 0;
var numberOfBombs;
var playerDamage;
var fireCost = 60;
var menu = false;
var nextLevel = false;
var save = false;
var level;
var statusText = [];
var costText = [];
var graphics;
var hsv;
var buttonClick;
var background;
var music;
var score = 0;
var volume = 1.0;
var playerName;
var shipObject;
var graphicsUpdate = true;
var saveTimer = 0;


export class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({
            key: "UpgradeScene"
        })
    }
    init(data) {

        volume = data.volume;
        playerName = data.playerName;
        score = data.score;
        difficulty = data.diff;
        money = data.money;
        level = data.level + 1;
        damageUpgrade = data.damageUpgrade;
        shieldProtectionUpgrade = data.shieldProtectionUpgrade;
        energyConsumptionUpgrade = data.energyConsumptionUpgrade;
        energyConsumption2Upgrade = data.energyConsumption2Upgrade;
        energyRegenerationUpgrade = data.energyRegenerationUpgrade;
        numberOfBombsUpgrade = data.numberOfBombsUpgrade;
        playerDamage = data.playerDamage;
        shipObject = data.shipObject;
        numberOfBombs = data.shipObject.bombStat;
        playerDamage = 60 + (20 * (data.shipObject.damageStat - 1));

    }
    preload() {
    }

    create() {

        save = false;
        saveTimer = 0;

        statusText = [];
        costText = [];
        //tlacitka
        background = this.add.tileSprite(640, 1792, 1280, 3584, 'upgradeBackground');
        menuButton = this.add.image(104, 850, 'menu2');
        saveButton = this.add.image(640, 850, 'save');
        nextLevelButton = this.add.image(1130, 850, 'nextLevel')
        damageUpgradeButton = this.add.image(140, 202, 'damage');
        shieldProtectionUpgradeButton = this.add.image(140, 292, 'shieldProtection');
        energyConsumptionUpgradeButton = this.add.image(140, 382, 'projectileEnergyConsumption');
        energyConsumption2UpgradeButton = this.add.image(140, 472, 'laserEnergyConsumption');
        energyRegenerationUpgradeButton = this.add.image(140, 562, 'energyRegeneration');
        numberOfBombsUpgradeButton = this.add.image(140, 652, 'specialAttack');

        // grafika a textová pole
        scoreText = this.add.text(82, 140, '', { fontSize: '28px', fill: '#87CEEB' });
        moneyText = this.add.text(82, 105, '', { fontSize: '28px', fill: '#87CEEB' });
        saveText = this.add.text(530, 50, '', { fontSize: '28px', fill: '#00ff00' })
        hsv = Phaser.Display.Color.HSVColorWheel();
        graphics = this.add.graphics({ x: 0, y: 0 });
        for (var i = 0; i < 6; i++) {

            statusText.push(this.add.text(400, 198 + i * 90));
            costText.push(this.add.text(127, 197 + i * 90));
        }
        this.add.text(820, 120, 'Mission:', { color: '#00ff00', align: 'left', fontSize: '28px' });
        if (level === 2) {
            this.add.text(820, 150, 'You have survived the first attack\nand destroyed enemy reconnaissance\nfleet with its commander. However\nthe main enemy fleet arrived and it\nwill atempt to get to your planet.\nYou have to destroy them.', { color: '#00ff00', align: 'left', fontSize: '20px' });
        } else if (level === 3) {
            this.add.text(820, 150, 'Although you have managed to destroy\nthe enemy main fleet and its commander your\nradar detects new objects. It looks\nlike more enemy ships arrived.\nThe first fleet is in orbit of your\nplanet and is preparing for ground\ninvasion, while the other one is\nholding back and surounds some large\nship which looks like mobile ship\nfactory.', { color: '#00ff00', align: 'left', fontSize: '20px' });
        } else if (level === 4) {
            this.add.text(820, 150, 'Now, when you have destroyed the\nstrike fleet of the enemy, only one\nthing has to be done to be victorious.\nYou must destroy the enemy mothership,\nwhich serves as mobile ship factory\nand command center. Destroy it and\nvictory is yours.', { color: '#00ff00', align: 'left', fontSize: '20px' });
        }

        // zvuky
        buttonClick = this.sound.add('buttonClick');
        buttonClick.volume = volume;
        music = this.sound.add('upgradeSoundtrack');
        music.loop = true;
        music.play();
        music.volume = volume;

        // akce tlacitek
        menuButton.setInteractive();
        saveButton.setInteractive();
        nextLevelButton.setInteractive();
        damageUpgradeButton.setInteractive();
        shieldProtectionUpgradeButton.setInteractive();
        energyConsumptionUpgradeButton.setInteractive();
        energyConsumption2UpgradeButton.setInteractive();
        energyRegenerationUpgradeButton.setInteractive();
        numberOfBombsUpgradeButton.setInteractive();

        menuButton.on('pointerup', function (pointer) {
            menu = true;
            buttonClick.play();
            music.stop();
        });
        saveButton.on('pointerup', function (pointer) {
            buttonClick.play();
            saveText.setText("Game was saved");
            save = true;
            var saveObject = {
                playerName: playerName,
                score: score,
                difficulty: difficulty,
                level: level,
                money: money,
                damageUpgrade: damageUpgrade,
                playerDamage: playerDamage,
                shieldProtectionUpgrade: shieldProtectionUpgrade,
                energyConsumptionUpgrade: energyConsumptionUpgrade,
                energyConsumption2Upgrade: energyConsumption2Upgrade,
                energyRegenerationUpgrade: energyRegenerationUpgrade,
                numberOfBombsUpgrade: numberOfBombsUpgrade,
                shipObject: shipObject,

            };
            localStorage.setItem("save", JSON.stringify(saveObject));
        });
        nextLevelButton.on('pointerup', function (pointer) {
            nextLevel = true;
            buttonClick.play();
            music.stop();
        });

        damageUpgradeButton.on('pointerup', function (pointer) {
            if (money >= 900 + (damageUpgrade) * levelCost && damageUpgrade < 10) {
                money -= 900 + (damageUpgrade) * levelCost;
                damageUpgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
        shieldProtectionUpgradeButton.on('pointerup', function (pointer) {
            if (money >= 1600 + (shieldProtectionUpgrade) * levelCost * 1.25 && shieldProtectionUpgrade < 6) {
                money -= 1600 + (shieldProtectionUpgrade) * levelCost * 1.25;
                shieldProtectionUpgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
        energyConsumptionUpgradeButton.on('pointerup', function (pointer) {
            if (money >= 800 + (energyConsumptionUpgrade) * levelCost && energyConsumptionUpgrade < 12 && fireCost + damageUpgrade * 20 - energyConsumptionUpgrade * 15 > 44) {
                money -= 800 + (energyConsumptionUpgrade) * levelCost;
                energyConsumptionUpgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
        energyConsumption2UpgradeButton.on('pointerup', function (pointer) {
            if (money >= 1200 + (energyConsumption2Upgrade) * levelCost && energyConsumption2Upgrade < 8) {
                money -= 1200 + (energyConsumption2Upgrade) * levelCost;
                energyConsumption2Upgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
        energyRegenerationUpgradeButton.on('pointerup', function (pointer) {
            if (money >= 1100 + (energyRegenerationUpgrade) * levelCost * 1.5 && energyRegenerationUpgrade < 6) {
                money -= 1100 + (energyRegenerationUpgrade) * levelCost * 1.5;
                energyRegenerationUpgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
        numberOfBombsUpgradeButton.on('pointerup', function (pointer) {
            if (money >= 500 + (numberOfBombsUpgrade) * levelCost * 2 & numberOfBombsUpgrade < 4) {
                money -= 500 + (numberOfBombsUpgrade) * levelCost * 2;
                numberOfBombsUpgrade += 1;
                buttonClick.play();
                graphicsUpdate = true;
            }
        });
    }

    update() {
        // opet spusti zastavenou scenu
        if (menu) {
            this.scene.start("MenuScene", { volume: volume, playerName: playerName });
            menu = false;
            damageUpgrade = 0;
            shieldProtectionUpgrade = 0;
            energyConsumptionUpgrade = 0;
            energyRegenerationUpgrade = 0;
            numberOfBombsUpgrade = 0;
        }
        // spusti dalsi level a odesle do nej data
        if (nextLevel) {
            if (level === 2) {
                this.scene.start("Level2Scene", { diff: difficulty, money: money, damageUpgrade: damageUpgrade, shieldProtectionUpgrade: shieldProtectionUpgrade, energyConsumptionUpgrade: energyConsumptionUpgrade, energyConsumption2Upgrade: energyConsumption2Upgrade, energyRegenerationUpgrade: energyRegenerationUpgrade, numberOfBombsUpgrade: numberOfBombsUpgrade, playerDamage: playerDamage, score: score, volume: volume, playerName: playerName, shipObject: shipObject });
            } else if (level === 3) {
                this.scene.start("Level3Scene", { diff: difficulty, money: money, damageUpgrade: damageUpgrade, shieldProtectionUpgrade: shieldProtectionUpgrade, energyConsumptionUpgrade: energyConsumptionUpgrade, energyConsumption2Upgrade: energyConsumption2Upgrade, energyRegenerationUpgrade: energyRegenerationUpgrade, numberOfBombsUpgrade: numberOfBombsUpgrade, playerDamage: playerDamage, score: score, volume: volume, playerName: playerName, shipObject: shipObject });
            } else if (level === 4) {
                this.scene.start("Level4Scene", { diff: difficulty, money: money, damageUpgrade: damageUpgrade, shieldProtectionUpgrade: shieldProtectionUpgrade, energyConsumptionUpgrade: energyConsumptionUpgrade, energyConsumption2Upgrade: energyConsumption2Upgrade, energyRegenerationUpgrade: energyRegenerationUpgrade, numberOfBombsUpgrade: numberOfBombsUpgrade, playerDamage: playerDamage, score: score, volume: volume, playerName: playerName, shipObject: shipObject });
            }
            nextLevel = false;
        }

        // nastavi textova pole
        if (save) {
            saveTimer += 1;
        }
        if (saveTimer > 180) {
            save = false;
            saveTimer = 0;
            saveText.setText("");
        }
        if (graphicsUpdate) {
            moneyText.setText("Money: " + money);
            scoreText.setText("Score: " + score);
            statusText[0].setText("DAMAGE:" + (playerDamage + damageUpgrade * 20) + "(+20)");
            statusText[1].setText("SHIELD:" + (shieldProtectionUpgrade * 10) + "%" + "(+10%)");
            statusText[2].setText("ENERGY PROJECTILE COST:" + (fireCost - energyConsumptionUpgrade * 15 + damageUpgrade * 20) + "(-15)");
            statusText[3].setText("ENERGY LASER COST:" + (12 - energyConsumption2Upgrade * 1) + "(-1)");
            statusText[4].setText("ENERGY REGENERATION:" + Math.floor((1.1 + energyRegenerationUpgrade * 0.15 + ((shipObject.energyRegenStat - 3) * 0.2)) * 60) + "(+9)");
            statusText[5].setText("BOMBS:" + ((numberOfBombs + numberOfBombsUpgrade) + "(+1)"));

            if (damageUpgrade < 10) {
                costText[0].setText(900 + (damageUpgrade) * levelCost);
            } else {
                costText[0].setText("MAXED");
            }
            if (shieldProtectionUpgrade < 6) {
                costText[1].setText(1600 + (shieldProtectionUpgrade) * levelCost * 1.25);
            } else {
                costText[1].setText("MAXED");
            }
            if (energyConsumptionUpgrade < 12) {
                costText[2].setText(800 + (energyConsumptionUpgrade) * levelCost);
            } else {
                costText[2].setText("MAXED");
            }
            if (energyConsumption2Upgrade < 8) {
                costText[3].setText(1200 + (energyConsumption2Upgrade) * levelCost);
            } else {
                costText[3].setText("MAXED");
            }
            if (energyRegenerationUpgrade < 6) {
                costText[4].setText(1100 + (energyRegenerationUpgrade) * levelCost * 1.5);
            } else {
                costText[4].setText("MAXED");
            }
            if (numberOfBombsUpgrade < 4) {
                costText[5].setText(500 + (numberOfBombsUpgrade) * levelCost * 2);
            } else {
                costText[5].setText("MAXED");
            }

            // vykresli graficke znazorneni urovne vylepseni
            for (var i = 1; i < 13; i++) {

                if (i <= damageUpgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 200, 5, 10);
                } else if (i <= 10) {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 200, 5, 10);
                }
                if (i <= shieldProtectionUpgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 290, 5, 10);
                } else if (i <= 6) {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 290, 5, 10);
                }
                if (i <= energyConsumptionUpgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 380, 5, 10);
                } else {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 380, 5, 10);
                }
                if (i <= energyConsumption2Upgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 470, 5, 10);
                } else if (i <= 8) {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 470, 5, 10);
                }

                if (i <= energyRegenerationUpgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 560, 5, 10);
                } else if (i <= 6) {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 560, 5, 10);
                }
                if (i <= numberOfBombsUpgrade) {
                    graphics.fillStyle(hsv[110].color, 1);
                    graphics.fillRect(200 + i * 12, 650, 5, 10);
                } else if (i <= 4) {
                    graphics.fillStyle(hsv[10].color, 1);
                    graphics.fillRect(200 + i * 12, 650, 5, 10);
                }
            }
        }
    }
}
// inicializace promennych (kdyz se inicializuji v create, tak to nefunguje)
var background;
var background2;
var playbutton;
var title;
var settingsbutton;
var instructionsbutton;
var creditsbutton;
var Menu;
var background1y;
var background2y;
var music1;
var music2;
var music3;
var music4;
var buttonClick;
var loadbutton;
var saveObject;
var timer = 0;
var statusText;
var musicEnd = 0;
var leaderboardbutton;
var volumeMutebutton;
var volumeDownbutton;
var volumeUpbutton;
var musicChangebutton;
var volume = 1.0;
var soundtrack = 0;
var playerName;
var nameCounter = 0;

// trida scena, rozsiruje PhaserScene a musi se exportovat
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MenuScene", active: true, background1y, background2y // vstupni data
        })
    }
    init(data) { // naskladani vstupnich dat, ktera jsme dostali pri spusteni sceny


        background1y = data.y1;
        background2y = data.y2;
        volume = data.volume;

    }

    preload() { // funkce ve ktere se nactou obrazky a zvuky ze souboru assets pro vsechny sceny

        this.load.image("title", "./assets/title.png");
        this.load.image("menuBackground", "./assets/MenuBackground.jpg");
        this.load.image("upgradeBackground", "./assets/UpgradeBackground.jpg");
        this.load.image("instructionBackground", "./assets/InstructionScreen.jpg");
        this.load.image("creditsScreen", "./assets/CreditsScreen.png");

        this.load.image("play", "./assets/Play.png");
        this.load.image("load", "./assets/Load.png");
        this.load.image("leaderboard", "./assets/Leaderboard.png");
        this.load.image("instructions", "./assets/Instructions.png");
        this.load.image("credits", "./assets/Credits.png");
        this.load.image("nextLevel", "./assets/nextlevel.png");
        this.load.image("confirm", "./assets/Confirm.png");
        this.load.image("storyMode", "./assets/StoryMode.png");
        this.load.image("infinityMode", "./assets/InfinityMode.png");
        this.load.image("rightArrow", "./assets/RightArrow.png");
        this.load.image("leftArrow", "./assets/LeftArrow.png");

        this.load.image("easy", "./assets/easy.png");
        this.load.image("medium", "./assets/medium.png");
        this.load.image("hard", "./assets/hard.png");

        this.load.image("menu1", "./assets/Menu1.png");
        this.load.image("menu2", "./assets/Menu2.png");
        this.load.image("back", "./assets/Back.png");
        this.load.image("quit", "./assets/Quit.png");
        this.load.image("resume", "./assets/resume.png");

        this.load.image("sound", "./assets/Sound.png");
        this.load.image("save", "./assets/Save.png");

        this.load.image("damage", "./assets/damage.png");
        this.load.image("laserEnergyConsumption", "./assets/EnergyLaserCost.png");
        this.load.image("projectileEnergyConsumption", "./assets/EnergyProjectileCost.png");
        this.load.image("energyRegeneration", "./assets/EnergyRegeneration.png");
        this.load.image("shieldProtection", "./assets/ShieldArmor.png");
        this.load.image("specialAttack", "./assets/SpecialAttack.png");

        this.load.image("PlayerShip1", "./assets/PlayerShip1.png");
        this.load.image("PlayerShip2", "./assets/PlayerShip2.png");
        this.load.image("PlayerShip3", "./assets/PlayerShip3.png");
        this.load.image("PlayerBullet", "./assets/PlayerShot.png");
        this.load.image("bomb", "./assets/Bomb.png");
        this.load.image("PlayerLaser1", "./assets/LaserBeam1.png");
        this.load.image("PlayerLaser2", "./assets/LaserBeam2.png");
        this.load.image("PlayerLaser3", "./assets/LaserBeam3.png");
        this.load.image("Thruster", "./assets/Pohon.png");
        this.load.image("AlienExplosion", "./assets/AlienExplosion.png");
        this.load.image("BossExplosion", "./assets/BossExplosion.png");

        this.load.image("Alien1", "./assets/Alien1.png");
        this.load.image("Alien2", "./assets/Alien2.png");
        this.load.image("Alien3", "./assets/Alien3.png");
        this.load.image("Alien4", "./assets/Alien4.png");
        this.load.image("Alien5", "./assets/Alien5.png");

        this.load.image("Alien1Bullet", "./assets/LaserShot.png");
        this.load.image("Alien2Bullet", "./assets/DoubleShot.png");
        this.load.image("Alien3Bullet", "./assets/GuidedRocket.png");
        this.load.image("Alien4Bullet", "./assets/Mine.png");
        this.load.image("Alien5Bullet", "./assets/Alien3Bullet.png");

        this.load.image("Boss1", "./assets/Boss1.png");
        this.load.image("Boss2", "./assets/Boss2.png");
        this.load.image("Boss3", "./assets/Boss3.png");
        this.load.image("Boss4", "./assets/Boss4.png");

        this.load.image("Boss1Shot1", "./assets/DoubleShot.png");
        this.load.image("Boss1Shot2", "./assets/MultiShot.png");

        this.load.image("BossThruster1", "./assets/BossPohon1.png");
        this.load.image("BossThruster2", "./assets/BossPohon2.png");

        this.load.image("Damage-powerUp", "./assets/Damage-powerUp.png");
        this.load.image("Energy-powerUp", "./assets/Energy-powerUp.png");
        this.load.image("Shield-powerUp", "./assets/Shield-powerUp.png");

        this.load.image("Damage-powerUp", "./assets/Damage-powerUp.png");
        this.load.image("Energy-powerUp", "./assets/Energy-powerUp.png");
        this.load.image("Shield-powerUp", "./assets/Shield-powerUp.png");

        this.load.image("ChangeSoundtrack", "./assets/ChangeSoundtrack.png");
        this.load.image("SoundOff", "./assets/SoundOff.png");
        this.load.image("SoundOn", "./assets/SoundOn.png");
        this.load.image("Sound+", "./assets/Sound+.png");
        this.load.image("Sound-", "./assets/Sound-.png");

        this.load.audio('laser', [

            './assets/music/Laser.wav'
        ]);
        this.load.audio('laser2', [

            './assets/music/Laser2.wav'
        ]);
        this.load.audio('gameOver', [

            './assets/music/GameOver.wav'
        ]);
        this.load.audio('buttonClick', [

            './assets/music/ButtonClick.MP3'
        ]);
        this.load.audio('explosion', [

            './assets/music/Explosion.wav'
        ]);
        this.load.audio('bossExplosion', [

            './assets/music/BossExplosion.MP3'
        ]);
        this.load.audio('menuSoundtrack', [

            './assets/music/menuSoundtrack4.MP3'
        ]);
        this.load.audio('menuSoundtrack2', [

            './assets/music/menuSoundtrack2.MP3'
        ]);
        this.load.audio('menuSoundtrack3', [

            './assets/music/menuSoundtrack3.MP3'
        ]);
        this.load.audio('menuSoundtrack4', [

            './assets/music/menuSoundtrack.MP3'
        ]);

        this.load.audio('upgradeSoundtrack', [

            './assets/music/UpgradeSoundtrack.MP3'
        ]);
        this.load.audio('level1Soundtrack', [

            './assets/music/Level1Soundtrack.MP3'
        ]);
        this.load.audio('level2Soundtrack', [

            './assets/music/Level2Soundtrack.MP3'
        ]);
        this.load.audio('level3Soundtrack', [

            './assets/music/Level3Soundtrack.MP3'
        ]);
        this.load.audio('level4Soundtrack', [

            './assets/music/Level4Soundtrack.MP3'
        ]);

    }

    create() {
        // pozadi
        if (background1y === background2y) {
            background = this.add.tileSprite(640, 1792, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, 5376, 1280, 3584, 'menuBackground');
        } else {
            background = this.add.tileSprite(640, background1y, 1280, 3584, 'menuBackground');
            background2 = this.add.tileSprite(640, background2y, 1280, 3584, 'menuBackground');
        }

        // zvuk
        if (volume === undefined) {
            volume = 1;
        }
        if (musicEnd === 0) {
            music1 = this.sound.add('menuSoundtrack');
            music1.loop = true;
            music1.play();
            music2 = this.sound.add('menuSoundtrack2');
            music2.loop = true;
            music3 = this.sound.add('menuSoundtrack3');
            music3.loop = true;
            music4 = this.sound.add('menuSoundtrack4');
            music4.loop = true;
            buttonClick = this.sound.add('buttonClick');
            musicEnd = 1;
            music1.volume = volume;
            music2.volume = volume;
            music3.volume = volume;
            music4.volume = volume;
        }

        statusText = this.add.text(700, 293, '', { fill: "#000" });

        // souradnice x, y  a nazev obrazku, co se do toho da
        title = this.add.image(640, 100, 'title');
        playbutton = this.add.image(640, 250, 'play');
        loadbutton = this.add.image(640, 300, 'load');
        instructionsbutton = this.add.image(640, 350, 'instructions');
        leaderboardbutton = this.add.image(640, 400, 'leaderboard');
        creditsbutton = this.add.image(640, 450, 'credits');
        musicChangebutton = this.add.image(450, 850, 'ChangeSoundtrack');
        if (volume === 0) {
            volumeMutebutton = this.add.image(50, 850, 'SoundOff');
        }
        else {
            volumeMutebutton = this.add.image(50, 850, 'SoundOn');
        }
        volumeUpbutton = this.add.image(150, 850, 'Sound+');
        volumeDownbutton = this.add.image(250, 850, 'Sound-');

        // nastaveni tlacitek, aby byly interaktivni
        playbutton.setInteractive();
        loadbutton.setInteractive();
        instructionsbutton.setInteractive();
        creditsbutton.setInteractive();
        leaderboardbutton.setInteractive();
        volumeDownbutton.setInteractive();
        volumeUpbutton.setInteractive();
        volumeMutebutton.setInteractive();
        musicChangebutton.setInteractive();
        // nastaveni tlacitek, pri jake akci se ma co provest
        playbutton.on('pointerdown', function (pointer) {
            Menu = 1;
            buttonClick.play();
            playerName = prompt("Please enter your pilot name", "Pilot X");
            if (playerName === null) {
                playerName = "Pilot X";
            }
            else {
                while (playerName.length > 20) {
                    alert('Please enter a shorter name');

                    playerName = prompt("Please enter your pilot name", "Pilot X");
                }
                localStorage.setItem("playerName", playerName);
            }
        });
        loadbutton.on('pointerdown', function (pointer) {
            buttonClick.play();
            saveObject = JSON.parse(localStorage.getItem("save"));
            if (saveObject === null) {
                Menu = 6;
            } else {
                Menu = 5;
            }
        });

        instructionsbutton.on('pointerup', function (pointer) {
            Menu = 3;
            buttonClick.play();
        });
        creditsbutton.on('pointerup', function (pointer) {
            buttonClick.play();
            Menu = 4;

        });
        leaderboardbutton.on('pointerup', function (pointer) {
            Menu = 7;
            buttonClick.play();
        });
        volumeUpbutton.on('pointerup', function (pointer) {
            buttonClick.play();

            if (volume < 0.9) {
                volume += 0.2;
                volume = Math.round(volume * 10) / 10
                music1.volume = volume;
                music2.volume = volume;
                music3.volume = volume;
                music4.volume = volume;
                buttonClick.volume = volume;
                volumeMutebutton.setTexture('SoundOn');
            }
            else if (volume = 0.9) {
                volume += 0.1;
            }
        });
        volumeDownbutton.on('pointerup', function (pointer) {

            buttonClick.play();
            if (volume > 0) {
                volume *= 0.5;
                volume = Math.round(volume * 10) / 10
                music1.volume = volume;
                music2.volume = volume;
                music3.volume = volume;
                music4.volume = volume;
                buttonClick.volume = volume;
            }
        });
        volumeMutebutton.on('pointerup', function (pointer) {
            buttonClick.play();
            if (volume === 0) {
                volume = 1;
                volumeMutebutton.setTexture('SoundOn');
            } else {
                volume = 0;
                volumeMutebutton.setTexture('SoundOff');
            }
            music1.volume = volume;
            music2.volume = volume;
            music3.volume = volume;
            music4.volume = volume;
            buttonClick.volume = volume;
        });
        musicChangebutton.on('pointerup', function (pointer) {
            buttonClick.play();
            soundtrack += 1;
            music1.stop();
            music2.stop();
            music3.stop();
            music4.stop();
            if (soundtrack === 0) {
                music1.play();
            } else if (soundtrack === 1) {
                music2.play();
            } else if (soundtrack === 2) {
                music3.play();
            }
            else if (soundtrack === 3) {
                music4.play();
                soundtrack = -1;
            }
        });
    }

    update() { // funkce, ktera updatuje scenu
        //posouvani a prohazovani dvou obrazku tvoricich pozadi

        background.y -= 0.5;
        if (background.y === -1792) {
            background.y = 5376;
        }
        background2.y -= 0.5;

        if (background2.y === -1792) {
            background2.y = 5376;
        }
        // akce, ktere zmeni scenu na jinou a poslou ji, jak ma byt posunute pozadi aby neprobliklo nebo neposkocilo
        if (Menu === 1) {
            this.scene.start("PlayScene", { y1: background.y, y2: background2.y, volume: volume, playerName: localStorage.getItem("playerName") })
            Menu = 0;
            music1.stop();
            music2.stop();
            music3.stop();
            music4.stop();
            musicEnd = 0;
        }
        if (Menu === 3) {
            this.scene.start("InstructionsScene", { volume: volume })
            Menu = 0;
        }
        if (Menu === 4) {
            this.scene.start("CreditsScene", { y1: background.y, y2: background2.y, volume: volume })
            Menu = 0;
        }
        if (Menu === 5) {
            this.scene.start("UpgradeScene", { level: saveObject.level - 1, diff: saveObject.difficulty, money: saveObject.money, damageUpgrade: saveObject.damageUpgrade, shieldProtectionUpgrade: saveObject.shieldProtectionUpgrade, energyConsumptionUpgrade: saveObject.energyConsumptionUpgrade, energyConsumption2Upgrade: saveObject.energyConsumption2Upgrade, energyRegenerationUpgrade: saveObject.energyRegenerationUpgrade, numberOfBombsUpgrade: saveObject.numberOfBombsUpgrade, playerDamage: saveObject.playerDamage, score: saveObject.score, volume: volume, playerName: playerName, shipObject: saveObject.shipObject })
            music1.stop();
            music2.stop();
            music3.stop();
            music4.stop();
            Menu = 0;
            musicEnd = 0;
        }
        if (Menu === 6) {
            timer += 1;
            statusText.setText("GAME WAS NOT SAVED YET");
            if (timer > 600) {
                timer = 0;
                statusText.setText("");
                Menu = 0;
            }
        }
        if (Menu === 7) {
            this.scene.start("LeaderboardScene", { y1: background.y, y2: background2.y, volume: volume })
            Menu = 0;
        }


    }
}
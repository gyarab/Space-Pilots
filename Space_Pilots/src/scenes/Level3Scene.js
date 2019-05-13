import { arch } from "os";
// inicializace promennych
var difficulty;
var background;
var background2;
var playerShip;
var playerHealth;
var playerEnergy;
var playerDamage;
var damageUpgrade;
var numberOfBombs = 3;
var shieldProtectionUpgrade = 0;
var energyConsumptionUpgrade = 0;
var energyConsumption2Upgrade = 0;
var energyRegenerationUpgrade = 0;
var numberOfBombsUpgrade = 0;
var keys;
var spacebar;
var esc;
var X;
var B;
var bullets;
var laserBeams;
var playerBulletsList = []; // seznam hracovych strel pro AI
var Alien2BulletsA;
var Alien2BulletsB;
var Alien3Bullets;
var Alien4Bullets;
var BossBullets;
var aliens2;
var aliens3;
var aliens4;
var bosses;
var Boss1;
var aliens2List = [];
var aliens3List = [];
var aliens4List = [];
var BossList = [];
var alien4BulletsList = [];
var x2 = 0;
var y2 = 0;
var x3 = 0;
var y3 = 0;
var x4 = 0;
var y4 = 0;
var lastFired = 0;      // cas posledniho vystrelu hrace
var timer = 0;
var endTimer = 0;
var graphics;
var hsv;
var statusText;     // text zobrazovany pred ukazateli v horni casti okna
var output = [];    // promenna pro ukladani toho, co se zobrazi ve statusText
var fireCost = 60;
var money = 1000;
var level = 3;
var B;
var bombs;
var laser;
var laser2;
var dangerousBullet;
var Alien2Bullets;
var Explosion;
var BossExplosion;
var bossExplosion;
var bulletExplosion;
var music;
var thrust;
var alienExplosion;
var textBossName;
var volume = 1.0;
var score = 0;
var DamageBonusDrops;
var ShieldBonusDrops;
var EnergyBonusDrops;
var chance;
var energyBoost = 1;
var energyBoostDuration = 600;
var playerName;
var resume = false;
var shipObject;
var damageStat;
var bombExplode;
var bombExplodeTimer = 0;

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super({
            key: "Level3Scene"
        })
    }

    init(data) {
        playerName = data.playerName;
        volume = data.volume;
        score = data.score;
        difficulty = data.diff;
        money = data.money
        damageUpgrade = data.damageUpgrade;
        shieldProtectionUpgrade = data.shieldProtectionUpgrade;
        energyConsumptionUpgrade = data.energyConsumptionUpgrade;
        energyConsumption2Upgrade = data.energyConsumption2Upgrade;
        energyRegenerationUpgrade = data.energyRegenerationUpgrade;
        numberOfBombsUpgrade = data.numberOfBombsUpgrade;
        playerDamage = data.playerDamage;
        shipObject = data.shipObject;
        numberOfBombs = data.shipObject.bombStat;
        numberOfBombs += numberOfBombsUpgrade;
        playerDamage = 60 + (20 * (data.shipObject.damageStat - 1));
        damageStat = shipObject.damageStat;
    }

    preload() {
        this.load.image("backgroundLevel3", "./assets/BackgroundLevel3.jpg");
    }

    create() {
        // nastavi promenne 
        playerHealth = 1000;
        playerEnergy = 1000;
        timer = 0;

        aliens2List = [];
        aliens3List = [];
        aliens4List = [];
        BossList = [];

        output = [];
        money;

        background = this.add.tileSprite(640, -1792, 1280, 3584, 'backgroundLevel3');
        background2 = this.add.tileSprite(640, 1792, 1280, 3584, 'backgroundLevel3');

        // vytvori hracovu lod
        if (damageStat === 3) {
            playerShip = this.physics.add.image(640, 600, 'PlayerShip1');
        } else if (damageStat === 4) {
            playerShip = this.physics.add.image(640, 600, 'PlayerShip2');
        } else if (damageStat === 2) {
            playerShip = this.physics.add.image(640, 600, 'PlayerShip3');
        }
        // nastavi zakladni vlastnosti lodi
        playerShip.setDamping(true);
        playerShip.setDrag(0.7);
        playerShip.setAngularDrag(4000);
        playerShip.setCollideWorldBounds(true);

        // vytvori ukazatele zivotu a energie
        hsv = Phaser.Display.Color.HSVColorWheel();
        graphics = this.add.graphics({ x: 240, y: 32 });
        statusText = this.add.text(32, 29);
        textBossName = this.add.text(840, 20, '', { fill: "#000" });


        // vytvori "animaci" pohonu lodi
        thrust = this.add.particles('Thruster').createEmitter({
            angle: 90,
            scale: { start: 0.5, end: 0 },
            blendMode: 'FALSE',
            lifespan: 300,
            on: false
        });
        // vytvori explozi nepratel
        alienExplosion = this.add.particles('AlienExplosion').createEmitter({
            lifespan: 400,
            scale: { start: 0.5, end: 2 },
            on: false
        });
        bossExplosion = this.add.particles('BossExplosion').createEmitter({
            lifespan: 400,
            scale: { start: 0.5, end: 2 },
            on: false
        });

        // nastavi zvuky hry
        laser = this.sound.add('laser');
        laser.volume = volume;
        laser2 = this.sound.add('laser2');
        laser2.volume = volume;
        Explosion = this.sound.add('explosion');
        Explosion.volume = volume;
        BossExplosion = this.sound.add('bossExplosion');
        BossExplosion.volume = volume;
        music = this.sound.add('level3Soundtrack');
        music.loop = true;
        music.play();
        music.volume = volume;

        // nastavi vstupy z klavesnice
        keys = this.input.keyboard.addKeys("W,Q,E,A,D,S");
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        X = this.input.keyboard.addKey("X");
        B = this.input.keyboard.addKey("B");

        // vytvori tridu Bullet - strela
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:
                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'PlayerBullet');
                    this.speed = Phaser.Math.GetSpeed(800, 1);
                },

            // nastavi strele pozici lodi a vytvori ji
            fire: function (x, y) {
                this.setPosition(x, y - 50);

                this.setActive(true);
                this.setVisible(true);

                // pridani naboje do seznamu pro AI
                playerBulletsList.push(this);
                for (i in aliens3List) {
                    aliens3List[i].AICalculated = false;
                }
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y -= this.speed * delta;

                if (this.y < -50) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();

                    // odstraneni naboje ze seznamu pro AI
                    playerBulletsList = playerBulletsList.filter(function (comparedValue) {
                        return comparedValue == this;
                    });
                }
            }
        });
        // vytvori tridu laserBeam - hracuv laser
        var laserBeam = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    // stridani vice obrazku laseru, animace
                    if (timer % 12 === 0 || timer % 12 === 1 || timer % 12 === 2 || timer % 12 === 3) {
                        Phaser.GameObjects.Sprite.call(this, scene, -50, -50, 'PlayerLaser1');
                    }
                    else if (timer % 12 === 4 || timer % 12 === 5 || timer % 12 === 6 || timer % 12 === 7) {
                        Phaser.GameObjects.Sprite.call(this, scene, -50, -50, 'PlayerLaser2');
                    }
                    else {
                        Phaser.GameObjects.Sprite.call(this, scene, -50, -50, 'PlayerLaser3');
                    }
                    this.damage = 15;
                    this.energyConsumption = 12 - energyConsumption2Upgrade * 1;
                    this.lifeSpan = 1;



                },
            // vytvori laser
            fire: function (x, y) {
                this.setPosition(x, y - 500);
                this.setActive(true);
                this.setVisible(true);
            },

            // funkce, ktera laserBeam po urcite dobe smaze
            update: function (time, delta) {
                this.lifeSpan += 1;
                if (this.lifeSpan >= 3) {
                    this.destroy();
                }
            }

        });

        // vytvori tridu Bomb - hracova bomby
        var Bomb = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bomb');
                    this.damage = 1001;
                    this.lifeSpan = 0;

                },
            // nastavi strele pozici a vytvori ji
            fire: function () {
                this.setPosition(640, 448);
                this.setActive(true);
                this.setVisible(true);
            },
            // funkce, ktera Bomb po urcite dobe smaze
            update: function (time, delta) {
                this.lifeSpan += 1;
                if (this.lifeSpan > 20) {
                    this.destroy();
                }
            }

        });
        // vytvori druhou strelu nepratel
        var Alien2Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien1Bullet');
                    this.speed = 0.5;
                    this.damage = 100;


                },
            // nastavi strele pozici a vytvori ji
            fire: function (x, y) {
                this.setPosition(x, y + 50);
                this.setActive(true);
                this.setVisible(true);
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y += this.speed * delta;
                if (this.y > 896) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });
        // vytvori nepratelskou strelu letici sikmo dolu doprava
        var Alien2BulletA = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien2Bullet');
                    this.speed = 0.5;
                    this.damage = 100;
                    this.rotation = 0;


                },
            // nastavi strele pozici a vytvori ji
            fire: function (shooter) {
                this.setPosition(shooter.x + 28, shooter.y + 2);
                this.setActive(true);
                this.setVisible(true);
                this.rotation = -0.24;
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y += this.speed * 0.8 * delta;
                this.x += this.speed * 0.2 * delta;
                if (this.y > 896) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });
        // vytvori nepratelskou strelu letici sikmo dolu doleva
        var Alien2BulletB = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien2Bullet');
                    this.speed = 0.5;
                    this.damage = 100;
                    this.rotation = 0;
                },
            // nastavi strele pozici a vytvori ji
            fire: function (shooter) {
                this.setPosition(shooter.x - 28, shooter.y + 2);
                this.setActive(true);
                this.setVisible(true);
                this.rotation = +0.24;
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y += this.speed * 0.8 * delta;
                this.x -= this.speed * 0.2 * delta;
                if (this.y > 896) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });

        // strela letici smerem ke hraci
        var Alien3Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, -300, -300, 'Alien3Bullet');
                    this.speed = 0.45;
                    this.direction = 0;
                    this.xSpeed = 0;
                    this.ySpeed = 0;
                    this.damage = 100;
                },

            // nastavi strele pozici lodi a vytvori ji
            fire: function (shooter, target) {
                this.setPosition(shooter.x, shooter.y + 40);
                this.setActive(true);
                this.setVisible(true);
                this.direction = Math.atan((target.x - this.x) / (target.y - this.y));      // vraci odchylku osy y a smeru letu naboje (deleni nulou nenastane casto)

                if (target.y >= this.y) {   // podminka z duvodu, ze Math.atan(...) vraci stejnou hodnotu pro oba z dvojice navzajem opacnych smeru
                    this.xSpeed = this.speed * Math.sin(this.direction);
                    this.ySpeed = this.speed * Math.cos(this.direction);
                    this.rotation = -this.direction - Math.PI;      // PI * rad = 180°; minus, protoze obrazek se s rostouci hodnotou rotation otaci doprava, ale uhel doleva
                } else {
                    this.xSpeed = -this.speed * Math.sin(this.direction);
                    this.ySpeed = -this.speed * Math.cos(this.direction);
                    this.rotation = -this.direction;
                }
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.x += this.xSpeed * delta;
                this.y += this.ySpeed * delta;
                if (this.y > 896) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });
        // miny
        var Alien4Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien4Bullet');
                    this.damage = 175;
                    this.health = 50;
                },

            // nastavi strele pozici lodi a vytvori ji
            fire: function (x, y) {
                this.setPosition(x, y + 50);
                this.setActive(true);
                this.setVisible(true);
                this.initialX = x;
                this.initialTime = timer;
                alien4BulletsList.push(this);
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                if (this.y > 896 || this.y < 0 || this.health <= 0) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });
        // strely bosse
        var BossBullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Boss1Shot2');
                    this.speed = 0.45;
                    this.damage = 100;
                    this.uhel;

                },
            // nastavi strele pozici lodi a vytvori ji
            fire: function (shooter, uhel) {
                this.setPosition(shooter.x + 25, shooter.y + 110);
                this.setActive(true);
                this.setVisible(true);
                this.uhel = uhel;
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y += this.speed * Math.sin(this.uhel / 11 * 180 / 180 * Math.PI) * delta;
                this.x -= this.speed * Math.cos(this.uhel / 11 * 180 / 180 * Math.PI) * delta;

                if (this.y > 896 || this.x < 0 || this.x > 1280) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }
        });
        // bonusove vylepseni z nepratel
        var EnergyBonusDrop = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function ShieldBonusDrop(scene) {

                    this.lifespan = 600;
                    Phaser.GameObjects.Image.call(this, scene, -300, 0, 'Energy-powerUp');


                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function () {


                this.lifespan = this.lifespan - 1;

                if (this.lifespan === 0) {
                    this.destroy();

                }
            }

        });
        // bonusove vylepseni z nepratel
        var ShieldBonusDrop = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function ShieldBonusDrop(scene) {

                    this.lifespan = 600;
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Shield-powerUp');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function () {


                this.lifespan = this.lifespan - 1;

                if (this.lifespan === 0) {
                    this.destroy();

                }
            }

        });
        // bonusove vylepseni z nepratel
        var DamageBonusDrop = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function ShieldBonusDrop(scene) {

                    this.lifespan = 600;
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Damage-powerUp');


                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function () {


                this.lifespan = this.lifespan - 1;

                if (this.lifespan === 0) {
                    this.destroy();

                }
            }

        });
        // vytvari skupiny kazde tridy
        ShieldBonusDrops = this.physics.add.group({
            classType: ShieldBonusDrop,
            maxSize: 10,
            runChildUpdate: true
        });
        DamageBonusDrops = this.physics.add.group({
            classType: DamageBonusDrop,
            maxSize: 10,
            runChildUpdate: true
        });
        EnergyBonusDrops = this.physics.add.group({
            classType: EnergyBonusDrop,
            maxSize: 10,
            runChildUpdate: true
        });

        bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });
        laserBeams = this.physics.add.group({
            classType: laserBeam,
            maxSize: 3000,
            runChildUpdate: true
        });
        bombs = this.physics.add.group({
            classType: Bomb,
            maxSize: 30,
            runChildUpdate: true
        });
        Alien2Bullets = this.physics.add.group({
            classType: Alien2Bullet,
            maxSize: 30,
            runChildUpdate: true
        });
        Alien2BulletsA = this.physics.add.group({
            classType: Alien2BulletA,
            maxSize: 30,
            runChildUpdate: true
        });
        Alien2BulletsB = this.physics.add.group({
            classType: Alien2BulletB,
            maxSize: 30,
            runChildUpdate: true
        });
        Alien3Bullets = this.physics.add.group({
            classType: Alien3Bullet,
            maxSize: 200,
            runChildUpdate: true
        });
        Alien4Bullets = this.physics.add.group({
            classType: Alien4Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
        BossBullets = this.physics.add.group({
            classType: BossBullet,
            maxSize: 300,
            runChildUpdate: true
        });

        // nepratelska lod 2
        var Alien2 = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Alien2(scene) {

                    this.attackSpeed = 400;
                    this.lastShot = 0;
                    this.health = 500;
                    this.speed = 2;

                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien2');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
                this.leftCurve = (this.x > 640);
                this.startX = this.x;
            },

            update: function () {

                this.lastShot += 2;

                if (this.health <= 0) {
                    money += 300;
                    score += 225;
                    Explosion.play();
                    chance = Phaser.Math.Between(0, 100);
                    if (chance <= 10) {
                        DamageBonusDrop = DamageBonusDrops.get();
                        DamageBonusDrop.create(this.x, this.y);
                    }
                    this.destroy();
                    alienExplosion.emitParticleAt(this.x, this.y + 10);
                }
                if (this.y > 950) {
                    this.destroy();
                }
                // pohyb lodi
                if (this.y > 20 && this.y < 896) {
                    //uhel se snizuje od 20 do 458 (5/4PI), zvysuje do 896 (3/2PI)
                    if (this.y < 458) {
                        if (this.leftCurve) {
                            this.x += Math.cos(-(this.y - 20) / 438 * 4 / 9 * Math.PI + 3 / 2 * Math.PI) * this.speed * (this.startX - 100) / 1080;      // stihace spawnovany s x mezi 100 a 1180
                            this.y -= Math.sin(-(this.y - 20) / 438 * 4 / 9 * Math.PI + 3 / 2 * Math.PI) * this.speed;
                        } else {
                            this.x -= Math.cos(-(this.y - 20) / 438 * 4 / 9 * Math.PI + 3 / 2 * Math.PI) * this.speed * (1180 - this.startX) / 1280;     // stihace spawnovany s x mezi 100 a 1180
                            this.y -= Math.sin(-(this.y - 20) / 438 * 4 / 9 * Math.PI + 3 / 2 * Math.PI) * this.speed;
                        }
                    } else if (this.y < 896) {
                        if (this.leftCurve) {
                            this.x += Math.cos((this.y - 458) / 438 * 4 / 9 * Math.PI + 19 / 18 * Math.PI) * this.speed * (this.startX - 100) / 1080;        // stihace spawnovany s x mezi 100 a 1180
                            this.y -= Math.sin((this.y - 458) / 438 * 4 / 9 * Math.PI + 19 / 18 * Math.PI) * this.speed;
                        } else {
                            this.x -= Math.cos((this.y - 458) / 438 * 4 / 9 * Math.PI + 19 / 18 * Math.PI) * this.speed * (1180 - this.startX) / 1080;       // stihace spawnovany s x mezi 100 a 1180
                            this.y -= Math.sin((this.y - 458) / 438 * 4 / 9 * Math.PI + 19 / 18 * Math.PI) * this.speed;
                        }
                    }
                } else {
                    this.y += this.speed;
                }
            }
        });
        // nepratelska lod 3
        var Alien3 = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Alien3(scene) {

                    this.attackSpeed = 350;
                    this.lastShot = 0;
                    this.health = 500;
                    this.speed = 3;

                    this.AICalculated = false;      // informace o tom, zda jsou vypocitane manevry aktualni po poslednim vystrelu hrace
                    this.AIProgramAction;     // uhly pod kterymi stihac poleti
                    this.AIProgramTimes = [];       // casove body, kdy stihac zmeni smer letu
                    this.alphaInRads = 0.18;        // uhel mezi osou x a nejvyhodnejsi trasou pro proleteni pred nabojem hrace, je treba znovu pocitat pri zmene rychlosti letu strel/nepratel
                    this.prefersLeft = true;        // prvni uhybny manevr bude doprava, pokud se tim vyhne strelam

                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien3');
                },

            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },

            update: function () {
                this.lastShot += 2;

                if (this.health <= 0) {
                    money += 400;
                    score += 275;
                    this.destroy();
                    chance = Phaser.Math.Between(0, 100);
                    if (chance <= 20) {
                        EnergyBonusDrop = EnergyBonusDrops.get();
                        EnergyBonusDrop.create(this.x, this.y);
                    }
                    Explosion.play();
                    alienExplosion.emitParticleAt(this.x, this.y + 10);
                }
                if (this.y > 950) {
                    this.destroy();
                }

                // Uhybani strelam
                if (!this.AICalculated) {
                    dangerousBullet = null;
                    // Zjisteni naboje pod letounem
                    for (i in playerBulletsList) {
                        var bullet = playerBulletsList[i];
                        if (bullet.x - bullet.width / 2 < this.x + this.width / 2
                            && bullet.x + bullet.width / 2 > this.x - this.width / 2
                            && bullet.y - bullet.height / 2 > this.y + this.height / 2) {
                            if (dangerousBullet == null || dangerousBullet.y < bullet)      // chci ten nejbližší (s nejvyšší hodnotou y)
                                dangerousBullet = bullet;
                        }
                    }

                    if (this.y < 120) {
                        this.AIProgramAction = 3 / 2 * Math.PI;        // zvoli smer dolu
                        this.AIProgramTimes.push(timer + (120 - this.y) / this.speed);
                    } else if (dangerousBullet != null) {
                        this.prefersLeft = (dangerousBullet.x + dangerousBullet.width / 2 - this.x + this.width / 2 < -dangerousBullet.x + dangerousBullet.width / 2 + this.x + this.width / 2);
                        if (this.x < 80) {
                            this.prefersLeft = true;
                        } else if (this.x > 1200) {
                            this.prefersLeft = false;
                        }
                        if (this.prefersLeft) {
                            this.AIProgramAction = 0;        // prida smer doleva
                            this.AIProgramTimes.push(timer + (dangerousBullet.x + dangerousBullet.width / 2 - this.x + this.width / 2) / this.speed);
                        } else {
                            this.AIProgramAction = Math.PI;        // prida smer doprava
                            this.AIProgramTimes.push(timer + (-dangerousBullet.x + dangerousBullet.width / 2 + this.x + this.width / 2) / this.speed);
                        }
                    }
                    this.AICalculated = true;
                }

                // provadi predpocitany manevr
                if (this.AIProgramTimes.length != 0) {
                    if (timer <= this.AIProgramTimes[0]) {

                        if (this.AIProgramAction > Math.PI) {
                            this.x -= Math.cos(this.AIProgramAction) * this.speed;
                            this.y -= Math.sin(this.AIProgramAction) * this.speed;
                        } else {
                            this.x += Math.cos(this.AIProgramAction) * this.speed;
                            this.y += Math.sin(this.AIProgramAction) * this.speed;
                        }
                    } else {
                        this.AIProgramAction = 9;
                        this.AIProgramTimes.shift();
                        this.AICalculated = false;
                    }
                }
            }
        });
        // nepratelska lod 4
        var Alien4 = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Alien4(scene) {

                    this.attackSpeed = 125;
                    this.lastShot = 0;
                    this.health = 400;
                    this.speed = 6;
                    this.startsRight;
                    this.angle;
                    this.firstShotY = Phaser.Math.Between(this.height / 2, this.height / 2 + 124);

                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien4');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
                this.movesRight = (x < 1280 / 2);
                if (this.movesRight) {
                    this.angle = Math.atan((896 + this.height) / (1280 - this.x + this.width / 2));
                } else {
                    this.angle = Math.atan((896 + this.height) / (this.x + this.width / 2));
                }
            },
            update: function () {

                this.lastShot += 2;
                // pohyb
                if (this.y <= -this.height / 2 || this.y >= 896 + this.height) {
                    this.y += this.speed;
                } else {
                    this.y += this.speed * Math.sin(this.angle);
                    if (this.movesRight) {
                        this.x += this.speed * Math.cos(this.angle);
                    } else {
                        this.x -= this.speed * Math.cos(this.angle);
                    }
                }

                if (this.health <= 0) {
                    money += 270;
                    score += 220;
                    Explosion.play();
                    alienExplosion.emitParticleAt(this.x, this.y + 10);
                    this.destroy();
                    if (chance <= 21) {
                        ShieldBonusDrop = ShieldBonusDrops.get();
                        ShieldBonusDrop.create(this.x, this.y);
                    }
                }

                if (this.y > 896 + this.height / 2) {
                    this.destroy();

                }
            }
        });
        // Zaverecny nepritel levelu
        var Boss = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Boss(scene) {
                    this.attackSpeed = 10;
                    this.movement = 0;
                    this.lastShot = 0;
                    this.lastShot2 = 0;
                    this.health = 10000;
                    this.speed = 2;
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Boss3');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
                this.startsRight = (x < 1280 / 2);
            },

            update: function () {
                // pohyb Bosse
                if (this.y < 120) {
                    this.y += this.speed;
                } else if (this.y < 150) {
                    if (this.y + (150 - this.y) / 30 * this.speed + 0.1 > 150) {
                        this.y = 150;
                    } else {
                        this.y += (150 - this.y) / 30 * this.speed;
                    }
                }
                else {
                    if (this.startsRight) {
                        this.x = 640 - Math.cos(this.movement * Math.PI / 270) * (1280 - this.width) / 2;     //kazdym updatem se uhel v cosinu meni o 1 / 2 stupne
                    } else {
                        this.x = 640 + Math.cos(this.movement * Math.PI / 270) * (1280 - this.width) / 2;     //kazdym updatem se uhel v cosinu meni o 1 / 2 stupne
                    }

                    this.lastShot += 1;
                    this.lastShot2 += 1;
                    this.movement += 1;
                }

                if (this.health <= 0) {
                    money += 4000;
                    score += 3500;
                    this.destroy();
                    BossExplosion.play();
                    bossExplosion.emitParticleAt(this.x, this.y + 10);
                    playerShip.setCollideWorldBounds(false);
                }

            }
        });


        // vytvori skupinu nepratelskych lodi a nastavi vlastnosti skupiny
        aliens2 = this.physics.add.group({
            classType: Alien2,
            maxSize: 300,
            runChildUpdate: true
        });

        aliens3 = this.physics.add.group({
            classType: Alien3,
            maxSize: 300,
            runChildUpdate: true
        });

        aliens4 = this.physics.add.group({
            classType: Alien4,
            maxSize: 300,
            runChildUpdate: true
        });
        bosses = this.physics.add.group({
            classType: Boss,
            maxSize: 30,
            runChildUpdate: true
        });
        // vytvori sefa
        Boss1 = bosses.get();
        Boss1.create(Boss1.width / 2 + (1280 - Boss1.width) * Phaser.Math.Between(0, 1), -400 - 4000 * Boss1.speed);
        Boss1.setScale(.8);
        BossList.push(Boss1);

        // vytvoreni nepratel 
        for (var i = 0; i < 8; i++) {

            for (; ;) {
                x2 = Phaser.Math.Between(100, 1180);
                x3 = Phaser.Math.Between(100, 1180);
                x4 = Phaser.Math.Between(100, 1180);

                if ((x4 - x2 > 150 || x2 - x4 > 150) && (x3 - x4 > 150 || x4 - x3 > 150) && (x3 - x2 > 150 || x2 - x3 > 150)) {
                    break;
                }
            }
            y2 = Phaser.Math.Between(-320, 320);
            y3 = Phaser.Math.Between(-320, 320);
            y4 = Phaser.Math.Between(-320, 320);

            Alien2 = aliens2.get();
            Alien2.create(x2, -400 - i * 500 * Alien2.speed + y2);
            aliens2List.push(Alien2);

            Alien3 = aliens3.get();
            Alien3.create(x3, -400 - i * 500 * Alien3.speed + y3);
            aliens3List.push(Alien3);

            Alien4 = aliens4.get();
            Alien4.create(x4, -400 - i * 500 * Alien4.speed + y4);
            aliens4List.push(Alien4);
        }
        //exploze střely
        bulletExplosion = this.add.particles('AlienExplosion').createEmitter({
            lifespan: 200,
            scale: { start: 0.05, end: 0.2 },
            on: false
        });
    }




    update(time, delta) {
        // kontrola, jestli vsichni nepratele zemreli
        var allDead = true;
        for (var i = 0; i < BossList.length; i++) {
            if (BossList[0].scene != undefined) {
                allDead = false;
            }
        }

        // ovladani lodi
        if ((keys.W.isDown || keys.S.isDown || keys.A.isDown || keys.D.isDown) && allDead === false) {
            thrust.setPosition(playerShip.x, playerShip.y + 60);

            if (keys.W.isDown) {
                playerShip.y -= 4;
                thrust.emitParticle(1);
            }

            if (keys.S.isDown) {
                playerShip.y += 4;
            }

            if (keys.A.isDown) {
                playerShip.x -= 6;
            }

            if (keys.D.isDown) {
                playerShip.x += 6;
            }
        }
        // konec levelu, kontrola, ze nepratele jsou mrtvi
        if (allDead) {
            playerHealth = 1000;
            playerShip.setAccelerationY(-250);
            thrust.setPosition(playerShip.x, playerShip.y + 60);
            thrust.emitParticle(1);
            endTimer += 1;
        }
        // kolize strely s nepritelem
        function hitAlien(bullet, alien) {

            if (alien.health - (playerDamage + damageUpgrade * 20) < 0) {
                alien.health = 0;
            } else {
                alien.health -= (playerDamage + damageUpgrade * 20);
            }

            // odstraneni naboje ze seznamu pro AI
            playerBulletsList = playerBulletsList.filter(function (comparedValue) {
                return comparedValue == bullet;
            });
            if (alien.attackSpeed === 10) {
                bulletExplosion.emitParticleAt(bullet.x + Phaser.Math.Between(-5, 5), bullet.y - Phaser.Math.Between(50, 70));
            } else {
                bulletExplosion.emitParticleAt(bullet.x + Phaser.Math.Between(0, 5), bullet.y - Phaser.Math.Between(10, 25));
            }
            bullet.destroy();
        };
        // sebrani vylepseni
        function collectShield(player, ShieldBonusDrop) {
            ShieldBonusDrop.destroy();
            score += 75;
            if (playerHealth + 100 > 1000)
                playerHealth = 1000;
            else {
                playerHealth += 100;
            }
        };
        // sebrani vylepseni
        function collectDamage(player, DamageBonusDrop) {
            DamageBonusDrop.destroy();
            playerDamage += 10;
            score += 75;

        };
        // sebrani vylepseni
        function collectEnergy(player, EnergyBonusDrop) {
            EnergyBonusDrop.destroy();
            energyBoost = 2;
            energyBoostDuration = 0;
            score += 75;
        };
        // docasne vylepseni regenerace energie
        energyBoostDuration += 1;
        if (energyBoostDuration === 600) {
            energyBoost = 1;
        }

        // kolize laseru s nepritelem
        function hitAlienLaser(bullet, alien) {
            if (alien.y > -50) {
                if (alien.health - bullet.damage < 0) {
                    alien.health = 0;
                } else {
                    alien.health -= bullet.damage;
                }
            }
        };

        // kolize playerShip s Alieny
        function collision(player, alien) {
            alien.health = 0;
            if (playerHealth - 300 * difficulty < 0) {
                playerHealth = 0;
            } else {
                playerHealth -= 300 * difficulty;
            }
        };
        // kolize playerShip s bossem
        function bossCollision(player, alien) {
            playerHealth = 0;
        };

        // kolize strel s hracovou lodi
        function hitPlayer(bullet, playerShip) {
            bullet.destroy();
            bulletExplosion.emitParticleAt(bullet.x + Phaser.Math.Between(0, 5), bullet.y + Phaser.Math.Between(10, 25));
            if (allDead === false) {
                if (playerHealth - (bullet.damage * difficulty) * (1 - shieldProtectionUpgrade * 0.1) * (1 - (shipObject.shieldStat - 3) / 5) <= 0) {
                    playerHealth = 0;
                } else {

                    playerHealth -= (bullet.damage * difficulty) * (1 - shieldProtectionUpgrade * 0.1) * (1 - (shipObject.shieldStat - 3) / 5);
                }

                if (playerHealth <= 0) {
                    playerShip.destroy();
                    Explosion.play();

                }
            }
        };
        // nastavi detekci dotyku hracovi lode s cizimy objekty a spusti funkci, ktera provede kolizi
        if (timer === 0) {
            this.physics.add.overlap(playerShip, aliens2, collision, null, this);
            this.physics.add.overlap(playerShip, aliens3, collision, null, this);
            this.physics.add.overlap(playerShip, aliens4, collision, null, this);
            this.physics.add.overlap(playerShip, bosses, bossCollision, null, this);
            this.physics.add.overlap(playerShip, ShieldBonusDrops, collectShield, null, this);
            this.physics.add.overlap(playerShip, DamageBonusDrops, collectDamage, null, this);
            this.physics.add.overlap(playerShip, EnergyBonusDrops, collectEnergy, null, this);
        }
        timer += 1;
        // pri zmacknuti mezerniku vystreli hrac strelu
        if (spacebar.isDown && time > lastFired && playerEnergy >= fireCost + damageUpgrade * 20 - energyConsumptionUpgrade * 15) {
            var bullet = bullets.get();

            // strela
            if (bullet) {
                bullet.fire(playerShip.x, playerShip.y);
                laser2.play()
                this.physics.add.overlap(bullet, aliens2, hitAlien, null, this);
                this.physics.add.overlap(bullet, aliens3, hitAlien, null, this);
                this.physics.add.overlap(bullet, aliens4, hitAlien, null, this);
                this.physics.add.overlap(bullet, bosses, hitAlien, null, this);
                this.physics.add.overlap(bullet, Alien4Bullets, hitAlien, null, this);
                playerEnergy -= (fireCost + damageUpgrade * 20 - energyConsumptionUpgrade * 15);
                lastFired = time + 150; // prodleva mezi jednotlivymi strelami
            }
        }
        // laserovy paprsek
        if (X.isDown && time > lastFired && playerEnergy >= laserBeams.get().energyConsumption) {

            var laserbeam = laserBeams.get();
            laserbeam.fire(playerShip.x, playerShip.y);
            this.physics.add.overlap(laserbeam, aliens2, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, aliens3, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, aliens4, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, bosses, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, Alien4Bullets, hitAlienLaser, null, this);
            playerEnergy -= laserbeam.energyConsumption;
        }
        // navrat do hry
        if (resume) {
            music.resume();
            resume = false;
        }
        // pozastaveni hry
        if (Phaser.Input.Keyboard.JustUp(esc)) {
            this.scene.pause();
            this.scene.launch("PauseScene", { level: level, volume: volume });
            music.pause();
            keys.W.isDown = false;
            keys.A.isDown = false;
            keys.S.isDown = false;
            keys.D.isDown = false;
            spacebar.isDown = false;
            X.isDown = false;
            B.isDown = false;
            resume = true;
        }
        // pokladani bomb
        if (Phaser.Input.Keyboard.JustDown(B) && numberOfBombs > 0) {
            var bomb = bombs.get();
            bomb.fire();
            numberOfBombs -= 1;
            bombExplode = true;

        }
        if (bombExplode) {
            bombExplodeTimer += 1;
        }
        if (bombExplodeTimer > 22) {
            alienExplosion.emitParticleAt(640, 448);
            bombExplode = false;
            bombExplodeTimer = 0;
            for (var i = 0; i < aliens2List.length; i++) {
                if (aliens2List[i].y > -aliens2List[i].height / 2) {
                    aliens2List[i].health = 0;
                }
                if (aliens3List[i].y > -aliens3List[i].height / 2) {
                    aliens3List[i].health = 0;
                }
                if (aliens4List[i].y > -aliens4List[i].height / 2) {
                    aliens4List[i].health = 0;
                }
            }
            for (var i = 0; i < alien4BulletsList.length; i++) {
                alien4BulletsList[i].health = 0;
            }
            if (BossList[0].y > -BossList[0].height / 2) {
                if (BossList[0].health - 1000 < 0) {
                    BossList[0].health = 0;
                }
                else {
                    BossList[0].health -= 1000;
                }
            }
        }
        // strelba nepritele
        // strelba nepratel tridy Alien2
        for (var i = 0; i < aliens2List.length; i++) {

            if (aliens2List[i].lastShot > aliens2List[i].attackSpeed && aliens2List[i].y > 0 && aliens2List[i].y < 896) {
                laser.play()
                aliens2List[i].lastShot = 0;
                var bulleta = Alien2Bullets.get();
                var bulleta2 = Alien2BulletsA.get();
                var bulleta3 = Alien2BulletsB.get();
                bulleta.fire(aliens2List[i].x, aliens2List[i].y);
                bulleta2.fire(aliens2List[i]);
                bulleta3.fire(aliens2List[i]);
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
                this.physics.add.overlap(bulleta2, playerShip, hitPlayer, null, this);
                this.physics.add.overlap(bulleta3, playerShip, hitPlayer, null, this);
            }
        }

        // strelba nepratel tridy Alien3
        for (var i = 0; i < aliens3List.length; i++) {

            if (aliens3List[i].lastShot > aliens3List[i].attackSpeed && aliens3List[i].y > 0 && aliens3List[i].y < 896) {

                laser.play()
                aliens3List[i].lastShot = 0;
                var bulleta = Alien3Bullets.get();
                bulleta.fire(aliens3List[i], playerShip);
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);

            }
        }
        // strelba nepritele
        // strelba nepratel tridy Alien4
        for (var i = 0; i < aliens4List.length; i++) {

            if (aliens4List[i].lastShot > aliens4List[i].attackSpeed && aliens4List[i].y > aliens4List[i].firstShotY && aliens4List[i].y < 896) {
                laser.play()
                aliens4List[i].lastShot = 0;
                var bulleta = Alien4Bullets.get();
                bulleta.fire(aliens4List[i].x, aliens4List[i].y);
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
            }
        }
        // strelba bosse
        if (BossList[0].movement % BossList[0].attackSpeed == 0 && BossList[0].y === 150) {
            laser.play()
            var bulleta = BossBullets.get();
            var uhel = Math.abs(11 - (BossList[0].movement % (22 * BossList[0].attackSpeed) / BossList[0].attackSpeed));
            bulleta.fire(BossList[0], uhel);
            this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);

        }
        if (BossList[0].movement % (BossList[0].attackSpeed * 5) === 0 && BossList[0].y === 150) {
            laser.play()
            var bulleta3 = Alien3Bullets.get();
            bulleta3.fire(BossList[0], playerShip);
            this.physics.add.overlap(bulleta3, playerShip, hitPlayer, null, this);
        }

        // regenerace energie
        if (playerEnergy + (1.1 + energyRegenerationUpgrade * 0.15 + ((shipObject.energyRegenStat - 3) * 0.2)) * energyBoost < 1000) {
            playerEnergy += (1.1 + energyRegenerationUpgrade * 0.15 + ((shipObject.energyRegenStat - 3) * 0.2)) * energyBoost;
        } else {
            playerEnergy = 1000;
        }

        // pohyb pozadi
        background.y += 0.5;
        if (background.y === 5376) {
            background.y = -1792;
        }
        background2.y += 0.5;

        if (background2.y === 5376) {
            background2.y = -1792;
        }

        // kontrola, ze nepratele jsou mrtvi a spusti dalsi scenu
        if (endTimer > 250) {
            this.scene.start("UpgradeScene", { level: level, diff: difficulty, money: money, damageUpgrade: damageUpgrade, shieldProtectionUpgrade: shieldProtectionUpgrade, energyConsumptionUpgrade: energyConsumptionUpgrade, energyConsumption2Upgrade: energyConsumption2Upgrade, energyRegenerationUpgrade: energyRegenerationUpgrade, numberOfBombsUpgrade: numberOfBombsUpgrade, score: score, playerDamage: playerDamage, volume: volume, playerName: playerName, shipObject: shipObject })
            endTimer = 0;
            music.stop();
        }

        // gameover screen, konec hry
        if (playerHealth === 0) {
            console.log(volume);
            this.scene.start("GameoverScene", { score: score, volume: volume, playerName: playerName });
            playerEnergy = 1000;
            playerHealth = 1000;
            lastFired = 0;
            money = 0;
            music.stop();
        }

        //aktualizace ukazatelu energie a stitu
        graphics.clear();
        graphics.fillStyle(hsv[350].color, 1);
        graphics.fillRect(-2, -2, 504, 2);
        graphics.fillRect(-2, 8, 504, 2);
        graphics.fillRect(-2, -0, 2, 8);
        graphics.fillRect(500, -0, 2, 8);

        graphics.fillRect(-2, 14, 504, 2);
        graphics.fillRect(-2, 24, 504, 2);
        graphics.fillRect(-2, 16, 2, 8);
        graphics.fillRect(500, 16, 2, 8);

        graphics.fillStyle(hsv[230].color, 1);
        graphics.fillRect(0, 0, playerHealth * 0.5, 8);
        graphics.fillStyle(hsv[100].color, 1);
        graphics.fillRect(0, 16, Math.floor(playerEnergy) * 0.5, 8);

        if (BossList[0].y > 0) {
            textBossName.setText("Sephiroth");
            graphics.fillStyle(hsv[0].color, 1);
            graphics.fillRect(598, 14, 404, 2);
            graphics.fillRect(598, 24, 404, 2);
            graphics.fillRect(598, 16, 2, 10);
            graphics.fillRect(1000, 16, 2, 10);
            graphics.fillStyle(hsv[300].color, 1);
            graphics.fillRect(600, 16, BossList[0].health / 25, 8)
        }
        output.push('Shields: ' + Math.floor(playerHealth) + '/1000');
        output.push('Energy: ' + Math.floor(playerEnergy) + '/1000');
        output.push('Bombs: ' + numberOfBombs);
        output.push('Money: ' + money);
        output.push('Score: ' + score);
        statusText.setText(output);
        output = [];

    }
}
// inicializace promennych
var difficulty;
var background;
var background2;
var back = false;
var playerShip;
var playerHealth = 1000;
var playerEnergy = 1000;
var playerDamage = 100;
var damageUpgrade = 0;
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
var Alien1Bullets;
var Alien2BulletsA;
var Alien2BulletsB;
var BossBullets;
var aliens1;
var aliens2;
var bosses;
var aliens1List = [];
var aliens2List = [];
var BossList = [];
var lastFired = 0;
var Boss1;
var endTimer = 0;
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
var graphics;
var hsv;
var statusText;
var output = [];
var fireCost = 60;
var money = 42;
var level = 1;
var B;
var bombs;
var laser;
var laser2;
var level = 1;
var Alien2Bullets;
var Explosion;
var BossExplosion;
var thrust;
var timer;
var alienExplosion
var bossExplosion;
var bulletExplosion;
var music;
var DamageBonusDrops;
var ShieldBonusDrops;
var chance;
var score = 0;
var textBossName;
var volume = 1.0;
var playerName;
var resume = false;
var shipObject;
var damageStat;
var bombExplode;
var bombExplodeTimer = 0;

// uchovat damageBonus pro vsechny levely // zmenit pocet Upgradu

export class Level1Scene extends Phaser.Scene {
    constructor() {
        super({
            key: "Level1Scene"
        })
    }

    init(data) {

        playerName = data.playerName;
        difficulty = data.diff;
        volume = data.volume;
        shipObject = data.shipObject;
        numberOfBombs = data.shipObject.bombStat;
        playerDamage = 60 + (20 * (data.shipObject.damageStat - 1));
        damageStat = shipObject.damageStat;
    }

    preload() {
        this.load.image("backgroundLevel1", "./assets/BackgroundLevel1.jpg");
    }

    create() {

        playerHealth = 1000;
        playerEnergy = 1000;
        timer = 0;
        bombExplode = false;

        aliens1List = [];
        aliens2List = [];
        BossList = [];

        output = [];
        money = 0;

        background = this.add.tileSprite(640, -1792, 1280, 3584, 'backgroundLevel1');
        background2 = this.add.tileSprite(640, 1792, 1280, 3584, 'backgroundLevel1');

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

        laser = this.sound.add('laser');
        laser.volume = volume;
        laser2 = this.sound.add('laser2');
        // laser2.volume = volume;
        Explosion = this.sound.add('explosion');
        Explosion.volume = volume;
        BossExplosion = this.sound.add('bossExplosion');
        BossExplosion.volume = volume;
        music = this.sound.add('level1Soundtrack');
        music.loop = true;
        music.play();
        music.volume = volume;

        // nastavi vstupy z klavesnice
        keys = this.input.keyboard.addKeys("W,Q,E,A,D,S");
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        X = this.input.keyboard.addKey("X");
        B = this.input.keyboard.addKey("B");

        // vytvori tridu Bullet - strelba hrace
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
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.y -= this.speed * delta;

                if (this.y < -50) {
                    this.setActive(false);
                    this.setVisible(false);
                    this.destroy();
                }
            }

        });
        // vytvori tridu laserBeam - hracuv laser
        var laserBeam = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
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
            // nastavi strele pozici lodi a vytvori ji
            fire: function (x, y) {
                this.setPosition(x, y - 503.5);

                this.setActive(true);
                this.setVisible(true);
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
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
            // nastavi strele pozici lodi a vytvori ji
            fire: function () {
                this.setPosition(640, 448);
                this.setActive(true);
                this.setVisible(true);
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                this.lifeSpan += 1;
                if (this.lifeSpan >= 20) {
                    this.destroy();
                }
            }

        });
        //  vytvori prvni strelu nepratel
        var Alien1Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien1Bullet');
                    this.speed = 0.5;
                    this.damage = 100;


                },
            // nastavi strele pozici lodi a vytvori ji
            fire: function (x, y) {
                this.setPosition(x, y + 56);
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
        // vytvori druhou strelu nepratel
        var Alien2Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien1Bullet');
                    this.speed = 0.5;
                    this.damage = 100;


                },
            // nastavi strele pozici lodi a vytvori ji
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
            // nastavi strele pozici lodi a vytvori ji
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
            // nastavi strele pozici lodi a vytvori ji
            fire: function (shooter) {
                this.setPosition(shooter.x - 28, shooter.y + 2);
                this.setActive(true);
                this.setVisible(true);
                this.rotation = 0.24;
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
        // strely bosse
        var BossBullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Bullet(scene) {
                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Boss1Shot2');
                    this.speed = 0.5;
                    this.damage = 100;
                    this.uhel;


                },
            // nastavi strele pozici lodi a vytvori ji
            fire: function (shooter, uhel) {
                this.setPosition(shooter.x, shooter.y + 60);
                this.setActive(true);
                this.setVisible(true);
                this.uhel = uhel;
            },

            // funkce, ktera se stara o pohyb strely a smaze ji pri prekroceni hraci plochy
            update: function (time, delta) {
                if (this.uhel < 8) {
                    this.y += this.speed * (this.uhel * 0.0625 * 2) * delta;
                }
                else {
                    this.y += this.speed * (8 - this.uhel + 7) * 0.0625 * 2 * delta;
                }
                this.x += this.speed * (2 * this.uhel / 15 - 1) * delta;
                if (this.y > 896 || this.x > 1280 || this.x < 0) {
                    this.setActive(false);
                    this.setVisible(false);
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

                function DamageBonusDrop(scene) {

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
        Alien1Bullets = this.physics.add.group({
            classType: Alien1Bullet,
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
        BossBullets = this.physics.add.group({
            classType: BossBullet,
            maxSize: 300,
            runChildUpdate: true
        });
        // nepratelska lod 1
        var Alien1 = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Alien1(scene) {

                    this.attackSpeed = 325;
                    this.lastShot = 0;
                    this.health = 500;
                    this.speed = 2;

                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Alien1');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function () {

                this.lastShot += 2;
                this.y += this.speed;

                if (this.health <= 0) {
                    money += 250;
                    score += 175;
                    Explosion.play();
                    chance = Phaser.Math.Between(0, 100);
                    if (chance <= 21) {
                        ShieldBonusDrop = ShieldBonusDrops.get();
                        ShieldBonusDrop.create(this.x, this.y);
                    }
                    alienExplosion.emitParticleAt(this.x, this.y + 10);
                    this.destroy();

                }

                if (this.y > 950) {
                    this.destroy();

                }
            }
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
        var Boss = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Boss(scene) {
                    this.attackSpeed = 250;
                    this.movement = 0;
                    this.typeOfAttack = 0;
                    this.middle = false;
                    this.lastShot = 0;
                    this.health = 8000;
                    this.speed = 1;

                    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Boss1');

                },
            create: function (x, y) {
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function () {
                if (this.y < 150) {
                    this.y += this.speed * 2;
                }
                if (this.y === 150) {

                    if (this.movement < 340) {
                        this.x += this.speed;

                    } else if (this.movement === 340) {
                        this.middle = true;
                    } else if (this.movement > 340 && this.movement < 680) {
                    } else if (this.movement === 680) {
                        this.middle = false;
                    } else if (this.movement < 1020) {
                        this.x += this.speed;
                    }
                    else if (this.movement > 1020) {
                        this.x -= this.speed;
                    }
                    if (this.movement === 1700) {
                        this.movement = 0;

                        this.typeOfAttack += 1;

                    }
                    this.lastShot += 2;
                    this.movement += 1;
                }

                if (this.health <= 0) {
                    money += 2000;
                    score += 2500;
                    this.destroy();
                    BossExplosion.play();
                    bossExplosion.emitParticleAt(this.x, this.y + 10);
                    playerShip.setCollideWorldBounds(false);

                }

            }

        });
        // vytvori skupinu nepratelskych lodi a nastavi vlastnosti skupiny
        aliens1 = this.physics.add.group({
            classType: Alien1,
            maxSize: 30,
            runChildUpdate: true
        });
        aliens2 = this.physics.add.group({
            classType: Alien2,
            maxSize: 30,
            runChildUpdate: true
        });
        bosses = this.physics.add.group({
            classType: Boss,
            maxSize: 30,
            runChildUpdate: true
        });
        Boss1 = bosses.get();
        Boss1.create(300, -6000);
        BossList.push(Boss1);

        // vytvoreni nepratel 
        for (var i = 0; i < 8; i++) {

            for (; ;) {
                x1 = Phaser.Math.Between(300, 1180);
                x2 = Phaser.Math.Between(300, 1180);
                if (x1 - x2 > 170 || x2 - x1 > 170) {
                    break;
                }
            }

            y1 = Phaser.Math.Between(0, 100);
            y2 = Phaser.Math.Between(0, 100);


            Alien1 = aliens1.get();
            Alien1.create(x1, -200 - i * 700 + y1);
            aliens1List.push(Alien1);

            Alien2 = aliens2.get();
            Alien2.create(x2, -200 - i * 700 + y2);
            aliens2List.push(Alien2);
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
        // konec levelu
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
            if (alien.attackSpeed === 250) {
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
            this.physics.add.overlap(playerShip, aliens1, collision, null, this);
            this.physics.add.overlap(playerShip, aliens2, collision, null, this);
            this.physics.add.overlap(playerShip, bosses, bossCollision, null, this);
            this.physics.add.overlap(playerShip, ShieldBonusDrops, collectShield, null, this);
            this.physics.add.overlap(playerShip, DamageBonusDrops, collectDamage, null, this);
        }
        timer += 1;
        // ovladani pomoci klavesnice
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
        // pri zmacknuti mezerniku vystreli  
        if (spacebar.isDown && time > lastFired && playerEnergy >= fireCost + damageUpgrade * 20 - energyConsumptionUpgrade * 15) {
            var bullet = bullets.get();

            // strela
            if (bullet) {
                laser2.play();
                bullet.fire(playerShip.x, playerShip.y);
                this.physics.add.overlap(bullet, aliens1, hitAlien, null, this);
                this.physics.add.overlap(bullet, aliens2, hitAlien, null, this);
                this.physics.add.overlap(bullet, bosses, hitAlien, null, this);
                playerEnergy -= (fireCost + damageUpgrade * 20 - energyConsumptionUpgrade * 15);
                lastFired = time + 150; // prodleva mezi jednotlivymi strelami
            }
        }
        // laserovy paprsek
        if (X.isDown && time > lastFired && playerEnergy >= laserBeams.get().energyConsumption) {
            var laserbeam = laserBeams.get();
            laserbeam.fire(playerShip.x, playerShip.y);
            this.physics.add.overlap(laserbeam, aliens1, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, aliens2, hitAlienLaser, null, this);
            this.physics.add.overlap(laserbeam, bosses, hitAlienLaser, null, this);
            playerEnergy -= laserbeam.energyConsumption;
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
                if (aliens1List[i].y > -aliens1List[i].height / 2) {
                    aliens1List[i].health = 0;
                }
                if (aliens2List[i].y > -aliens2List[i].height / 2) {
                    aliens2List[i].health = 0;
                }
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



        // strelba nepritele
        // strelba nepratel tridy Alien1 a Alien2
        for (var i = 0; i < aliens1List.length; i++) {

            if (aliens1List[i].lastShot > aliens1List[i].attackSpeed && aliens1List[i].y > 0 && aliens1List[i].y < 896) {
                aliens1List[i].lastShot = 0;
                var bulleta = Alien1Bullets.get();
                bulleta.fire(aliens1List[i].x, aliens1List[i].y);
                laser.play();
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);

            }
        }
        for (var i = 0; i < aliens2List.length; i++) {

            if (aliens2List[i].lastShot > aliens2List[i].attackSpeed && aliens2List[i].y > 0 && aliens2List[i].y < 896) {
                aliens2List[i].lastShot = 0;
                var bulleta = Alien2Bullets.get();
                var bulleta2 = Alien2BulletsA.get();
                var bulleta3 = Alien2BulletsB.get();
                bulleta.fire(aliens2List[i].x, aliens2List[i].y);
                bulleta2.fire(aliens2List[i]);
                bulleta3.fire(aliens2List[i]);
                laser.play();
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
                this.physics.add.overlap(bulleta2, playerShip, hitPlayer, null, this);
                this.physics.add.overlap(bulleta3, playerShip, hitPlayer, null, this);

            }
        }
        // strelba sefa
        if (BossList[0].lastShot > BossList[0].attackSpeed && BossList[0].middle === true && BossList[0].y === 150) {
            for (i = 0; i < 16; i++) {
                laser.play()
                var bulleta = BossBullets.get();
                bulleta.fire(BossList[0], i)
                this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
            }
            BossList[0].lastShot = 0;
        }
        if (BossList[0].lastShot > BossList[0].attackSpeed / 2 && BossList[0].middle === false && BossList[0].typeOfAttack % 2 === 0 && BossList[0].y === 150) {
            var bulleta = Alien1Bullets.get();
            bulleta.fire(BossList[0].x + 125, BossList[0].y);
            this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
            laser.play()
            var bulleta2 = Alien1Bullets.get();
            bulleta2.fire(BossList[0].x - 125, BossList[0].y);
            this.physics.add.overlap(bulleta2, playerShip, hitPlayer, null, this);
            BossList[0].lastShot = 0;
        }

        if (BossList[0].lastShot > BossList[0].attackSpeed / 60 && BossList[0].middle === false && BossList[0].typeOfAttack % 2 === 1 && BossList[0].y === 150) {
            var bulleta = laserBeams.get();
            bulleta.fire(BossList[0].x, BossList[0].y + 1000)
            this.physics.add.overlap(bulleta, playerShip, hitPlayer, null, this);
            BossList[0].lastShot = 0;
        }

        // regenerace energie
        if (playerEnergy + 1.1 + energyRegenerationUpgrade * 0.15 + ((shipObject.energyRegenStat - 3) * 0.2) < 1000) {
            playerEnergy += 1.1 + energyRegenerationUpgrade * 0.15 + ((shipObject.energyRegenStat - 3) * 0.2);
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
        // ukonceni levelu
        if (endTimer > 250) {
            this.scene.start("UpgradeScene", { level: level, diff: difficulty, money: money, damageUpgrade: damageUpgrade, shieldProtectionUpgrade: shieldProtectionUpgrade, energyConsumptionUpgrade: energyConsumptionUpgrade, energyConsumption2Upgrade: energyConsumption2Upgrade, energyRegenerationUpgrade: energyRegenerationUpgrade, numberOfBombsUpgrade: numberOfBombsUpgrade, playerDamage: playerDamage, score: score, volume: volume, playerName: playerName, shipObject: shipObject })
            endTimer = 0;
            music.stop();
        }
        // gameover screen
        if (playerHealth === 0) {
            this.scene.start("GameoverScene", { score: score, volume: volume, playerName: playerName });
            score = 0;
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
        if (BossList[0].y > 0 && allDead === false) {
            textBossName.setText("Seth");
            graphics.fillStyle(hsv[0].color, 1);
            graphics.fillRect(598, 14, 404, 2);
            graphics.fillRect(598, 24, 404, 2);
            graphics.fillRect(598, 16, 2, 10);
            graphics.fillRect(1000, 16, 2, 10);
            graphics.fillStyle(hsv[300].color, 1);
            graphics.fillRect(600, 16, BossList[0].health / 20, 8)
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

/** @type {import("../typings/phaser")} */ // import typingu
import { MenuScene } from "./scenes/MenuScene"; // importy scen
import { CreditsScene } from "./scenes/CreditsScene";
import { PlayScene } from "./scenes/PlayScene";
import { InstructionsScene } from "./scenes/InstructionsScene";
import { Level1Scene } from "./scenes/Level1Scene";
import { Level2Scene } from "./scenes/Level2Scene";
import { Level3Scene } from "./scenes/Level3Scene";
import { Level4Scene } from "./scenes/Level4Scene";
import { PauseScene } from "./scenes/PauseScene";
import { GameoverScene } from "./scenes/GameoverScene";
import { VictoryScene } from "./scenes/VictoryScene";
import { UpgradeScene } from "./scenes/UpgradeScene";
import { LeaderboardScene } from "./scenes/LeaderboardScene";
import { InfiniteLevelScene } from "./scenes/InfiniteLevelScene";
import { InfiniteLevelPauseScene } from "./scenes/InfiniteLevelPauseScene";


// ohraniceni okna hry
var myCustomCanvas = document.createElement('canvas');
myCustomCanvas.id = 'myCustomCanvas';
myCustomCanvas.style = 'border: 4px solid black';

document.body.appendChild(myCustomCanvas);
// inicializace hry
let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280, // sirka okna
    height: 896, // vyska okna
    canvas: document.getElementById('myCustomCanvas'),
    //seznam scen
    scene: [
        MenuScene, CreditsScene, PlayScene, InstructionsScene,
        Level1Scene, Level2Scene, Level3Scene, Level4Scene, UpgradeScene,
        PauseScene, GameoverScene, VictoryScene, LeaderboardScene,
        InfiniteLevelScene, InfiniteLevelPauseScene
    ],
    audio: {
        disableWebAudio: false
    },
    render: {
        pixelArt: true
    },
    // nastaveni fyziky(gravitace, fps ...)
    physics: {
        default: "arcade",
        arcade: {
            fps: 60,
            gravity: { y: 0 },
        }
    }
});

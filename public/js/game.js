// MODELS
import Bismarck from "./models/Bismarck.js";
import Swordfish from "./models/Swordfish.js";

// HELPERS
import { setupTerrain } from "./helpers/terrain.js";

// SOCKETS
import { joinGame, setupBismarckSocketListeners, socket } from "./sockets/client-game-socket.js";

const parentDiv = document.getElementById("phaser-game");

const config = {
    type: Phaser.AUTO,
    width: parentDiv.clientWidth,
    height: parentDiv.clientHeight,
    parent: "phaser-game",
    transparent: true,
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let bismarck;
let airship;

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
    this.load.image("bismarck_missile", "/assets/bismarck_missile.png");
    this.load.image("airship", "/assets/airship.png");
    this.load.image("airship_missile", "/assets/airship_missile.png");
}

function create() {
    setupTerrain(this);

    bismarck = new Bismarck(this, 0, 100, socket);
    // airship = new Swordfish(this, 0, socket);

    joinGame();
    setupBismarckSocketListeners(this);
}

function update() {
    if (bismarck && ) {
        bismarck.update();
    }
    if (airship) airship.update();
}

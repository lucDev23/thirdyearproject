// MODELS
import Bismarck from "./models/Bismarck.js";
import Swordfish from "./models/Swordfish.js";

// HELPERS
import { setupTerrain } from "./helpers/terrain.js";

// SOCKETS
import { joinGame, setupBismarckSocketListeners, setupSwordfishSocketListeners, socket } from "./sockets/client-socket-manager.js";

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

let bismarck = null;
let airship = null;
let playerRole = null;

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
    this.load.image("bismarck_missile", "/assets/bismarck_missile.png");
    this.load.image("airship", "/assets/airship.png");
    this.load.image("airship_missile", "/assets/airship_missile.png");
}

async function create() {
    setupTerrain(this);

    playerRole = await joinGame();

    socket.on("create-bismarck", (position) => {
        if (!bismarck) {
            console.log("Creando Bismarck...");
            bismarck = new Bismarck(this, position.x, position.y, socket);
            setupBismarckSocketListeners(bismarck, this);
        }
    });

    socket.on("create-swordfish", (position) => {
        if (!airship) {
            console.log("Creando Swordfish...");
            airship = new Swordfish(this, position.x, position.y, socket);
            setupSwordfishSocketListeners(airship);
        }
    });

    // **Eliminar el Bismarck cuando el servidor lo indique**
    socket.on("remove-bismarck", () => {
        if (bismarck) {
            console.log("Eliminando Bismarck...");
            bismarck.destroy();
            bismarck = null;
        }
    });

    // **Eliminar el Swordfish cuando el servidor lo indique**
    socket.on("remove-swordfish", () => {
        if (airship) {
            console.log("Eliminando Swordfish...");
            airship.destroy();
            airship = null;
        }
    });
}

function update() {
    if (bismarck && playerRole === "bismarck") {
        bismarck.update();
    }

    if (airship && playerRole === "swordfish") {
        airship.update();
    }
}

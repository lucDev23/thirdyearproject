// MODELS
import Bismarck from "./models/Bismarck.js";
import Swordfish from "./models/Swordfish.js";

// HELPERS
import { setupTerrain } from "./helpers/terrain.js";

// SOCKETS
import { socket } from "./sockets/game-socket.js";

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
window.players = {}; // Objeto global para manejar jugadores

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
    this.load.image("bismarck_missile", "/assets/bismarck_missile.png");
    this.load.image("airship", "/assets/airship.png");
    this.load.image("airship_missile", "/assets/airship_missile.png");
}

function create() {
    setupTerrain(this);

    socket.emit("join-game"); // Notificar al servidor que se une al juego

    // Esperar a que el servidor asigne el rol antes de crear la nave
    socket.on("assign-role", (data) => {
        if (data.role === "bismarck") {
            bismarck = new Bismarck(this, 0, 100, socket);
            window.players[socket.id] = bismarck;
        } else {
            airship = new Swordfish(this, 100, 100, socket);
            window.players[socket.id] = airship;
        }
    });
}

function update() {
    if (bismarck) bismarck.update();
    if (airship) airship.update();
}

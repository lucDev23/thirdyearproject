//MODELS
import Bismarck from "./models/Bismarck.js";
import Swordfish from "./models/Swordfish.js"; // Importa Swordfish

//HELPERS
import { setupTerrain } from "./helpers/terrain.js";

const parentDiv = document.getElementById("phaser-game");

const socket = io();

const config = {
    type: Phaser.AUTO,
    width: parentDiv.clientWidth,
    height: parentDiv.clientHeight,
    parent: "phaser-game",
    transparent: true,
    physics: {
        default: "arcade",
        arcade: { 
			debug: true, 
		}
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let bismarck;
let airship;

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
    this.load.image("airship", "/assets/airship.png");
}

function create() {
	setupTerrain(this);

    bismarck = new Bismarck(this, 0, 100, socket);
    airship = new Swordfish(this, 100, 100, socket); // Usar la clase correcta
}

function update() {
    if (bismarck) bismarck.update();
    if (airship) airship.update();
}

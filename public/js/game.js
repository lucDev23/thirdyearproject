//MODELS
import Bismarck from "./models/Bismarck.js";

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

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
}

function create() {
	setupTerrain(this);

    bismarck = new Bismarck(this, 0, 100, socket);

}

function update() {
    if (bismarck) bismarck.update();
}

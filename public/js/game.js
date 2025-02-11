import Bismarck from "./models/Bismarck.js";

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
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let bismarck;

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
}

function create() {
    bismarck = new Bismarck(this, 400, 300, socket);
}

function update() {
    if (bismarck) bismarck.update();
}

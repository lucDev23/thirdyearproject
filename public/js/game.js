import Bismarck from "./models/Bismarck.js";

const parentDiv = document.getElementById("phaser-game");

const config = {
    type: Phaser.AUTO,
    width: parentDiv.clientWidth,
    height: parentDiv.clientHeight,
    parent: "phaser-game",
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image("bismarck", "/assets/bismarck.png");
}

function create() {
    bismarck = new Bismarck(this, 400, 300);
}

function update() {

}

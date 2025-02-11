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

}

function create() {

}

function update() {

}

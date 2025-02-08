const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "phaser-game",
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
let ship;
let cursors;
let missiles;
let otherPlayers = {}; // Almacenar barcos de otros jugadores
const speed = 50;
const rotationSpeed = 45;
const missileSpeed = 300;

function preload() {
    this.load.image("bismarck", "assets/bismarck_flipped_enhanced.png");
    this.load.image("missile", "assets/missile.png");
}

function create() {
    ship = this.physics.add.image(Math.random() * 800, Math.random() * 600, "bismarck").setOrigin(0.5, 0.7);
    ship.setScale(0.2);
    ship.setCollideWorldBounds(true);
    ship.setDamping(true);
    ship.setDrag(0.98);
    ship.setMaxVelocity(100);

    missiles = this.physics.add.group();

    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Escuchar actualización de jugadores
    socket.on("updatePlayers", (serverPlayers) => {
        // Eliminar barcos de jugadores que ya no están en la lista del servidor
        for (let id in otherPlayers) {
            if (!serverPlayers[id]) {
                otherPlayers[id].destroy(); // Eliminar sprite del barco
                delete otherPlayers[id]; // Eliminar referencia del objeto
            }
        }

        // Agregar o actualizar jugadores existentes
        for (let id in serverPlayers) {
            if (id !== socket.id) {
                if (!otherPlayers[id]) {
                    otherPlayers[id] = this.physics.add.image(serverPlayers[id].x, serverPlayers[id].y, "bismarck").setOrigin(0.5, 0.7);
                    otherPlayers[id].setScale(0.2);
                }
                otherPlayers[id].x = serverPlayers[id].x;
                otherPlayers[id].y = serverPlayers[id].y;
                otherPlayers[id].rotation = serverPlayers[id].rotation;
            }
        }
    });

    // Escuchar disparos de misiles
    socket.on("spawnMissile", (missileData) => {
        let missile = missiles.create(missileData.x, missileData.y, "missile");
        missile.setScale(1);
        missile.setRotation(missileData.rotation);
        this.physics.velocityFromRotation(missileData.rotation, missileSpeed, missile.body.velocity);
    });
}

function update(time, delta) {
    if (cursors.left.isDown) {
        ship.setAngularVelocity(-rotationSpeed);
    } else if (cursors.right.isDown) {
        ship.setAngularVelocity(rotationSpeed);
    } else {
        ship.setAngularVelocity(0);
    }

    if (cursors.up.isDown) {
        this.physics.velocityFromRotation(ship.rotation, speed, ship.body.velocity);
    } else if (cursors.down.isDown) {
        this.physics.velocityFromRotation(ship.rotation, -speed / 2, ship.body.velocity);
    } else {
        ship.setVelocity(0);
    }

    socket.emit("move", { x: ship.x, y: ship.y, rotation: ship.rotation });

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        fireMissile.call(this);
    }
}

function fireMissile() {
    let missile = missiles.create(ship.x, ship.y, "missile");
    missile.setScale(0.1);
    missile.setRotation(ship.rotation);
    this.physics.velocityFromRotation(ship.rotation, missileSpeed, missile.body.velocity);

    // Enviar el disparo al servidor
    socket.emit("fireMissile", { x: ship.x, y: ship.y, rotation: ship.rotation });
}

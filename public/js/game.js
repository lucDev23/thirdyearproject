const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "phaser-game",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let cursors;
let playerCircle; // Representación del jugador en Phaser
let playersGraphics = {}; // Almacena las bolitas de todos los jugadores

function preload() {
    this.load.image("fondo", "assets/sky.jpg"); // Cargar la imagen de fondo
}

function create() {
    // Agregar imagen de fondo (centrada en el canvas)
    this.add.image(400, 300, "fondo").setOrigin(0.5, 0.5);

    this.add.text(10, 10, "Usa las flechas para moverte", { fontSize: "16px", fill: "#fff" });

    cursors = this.input.keyboard.createCursorKeys();

    // Evento para recibir jugadores
    socket.on("updatePlayers", (serverPlayers) => {
        playersGraphics = {}; // Reiniciar gráficos de jugadores
        this.children.removeAll();

        // Volver a agregar el fondo después de limpiar todo
        this.add.image(400, 300, "fondo").setOrigin(0.5, 0.5);

        for (let id in serverPlayers) {
            let { x, y } = serverPlayers[id];
            let color = id === socket.id ? 0xff0000 : 0x0000ff; // Rojo para el jugador propio, azul para los demás
            playersGraphics[id] = this.add.circle(x, y, 10, color);
        }
    });
}

function update() {
    let player = players[socket.id];
    if (!player) return;

    // Movimiento con teclas
    if (cursors.left.isDown) player.x -= 2;
    if (cursors.right.isDown) player.x += 2;
    if (cursors.up.isDown) player.y -= 2;
    if (cursors.down.isDown) player.y += 2;

    // Enviar posición actualizada
    socket.emit("move", { x: player.x, y: player.y });

    // Actualizar posición en la pantalla
    if (playersGraphics[socket.id]) {
        playersGraphics[socket.id].x = player.x;
        playersGraphics[socket.id].y = player.y;
    }
}

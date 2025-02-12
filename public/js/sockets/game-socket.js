export const socket = io(); // Conectarse al servidor WebSocket

// Emitir evento de unión al juego
export function joinGame() {
    socket.emit("join-game");
}

// Emitir evento de movimiento del jugador
export function sendPlayerMovement(x, y, rotation) {
    socket.emit("move", { x, y, rotation });
}

// Escuchar actualización de jugadores desde el servidor
socket.on("update-players", (players) => {
    console.log("Jugadores actualizados:", players);
    updatePlayersInGame(players);
});

// Función que se ejecutará al recibir nuevas posiciones de los jugadores
function updatePlayersInGame(players) {
    // Aquí puedes actualizar los sprites en Phaser según la nueva información
    players.forEach(player => {
        if (window.gameObjects[player.id]) {
            const gameObject = window.gameObjects[player.id];
            gameObject.x = player.position.x;
            gameObject.y = player.position.y;
            gameObject.rotation = player.rotation;
        }
    });
}

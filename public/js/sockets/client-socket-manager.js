export const socket = io(); // Conectarse al servidor WebSocket

export function joinGame() {
    return new Promise((resolve) => {
        socket.emit("join-game");

        socket.on("player-assigned", (data) => {
            console.log(`Jugador asignado como: ${data.type}`);
            resolve(data.type);
        });
    });
}

// Emitir movimiento del Bismarck
export function sendBismarckMovement(position) {
    socket.emit("bismarck-move", position);
}

// Emitir movimiento del Swordfish
export function sendSwordfishMovement(position) {
    socket.emit("swordfish-move", position);
}

// **Bismarck escucha a los aviones**
export function setupBismarckSocketListeners(bismarck) {
    socket.on("bismarck-move", (movement) => {
        if (bismarck) {
            bismarck.setPosition(movement.x, movement.y);
            bismarck.setRotation(movement.rotation);
        }
    });
}

// **Swordfish escucha al Bismarck**
export function setupSwordfishSocketListeners(swordfish) {
    socket.on("swordfish-move", (movement) => {
        if (swordfish) {
            swordfish.setPosition(movement.x, movement.y);
            swordfish.setRotation(movement.rotation);
        }
    });
}

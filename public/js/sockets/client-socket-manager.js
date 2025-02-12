import BismarckMissile from "../models/BismarckMissile.js";

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
export function sendBismarckPosition(position) {
    socket.emit("bismarck-move", position);
}

export function sendBismarckFire(missile) {
	socket.emit("bismarck-fire", missile);
}

export function sendBismarckHitSwordfish() {
	socket.emit("bismarck-hit-swordfish");
}

// Emitir movimiento del Swordfish
export function sendSwordfishMovement(position) {
    socket.emit("swordfish-move", position);
}

// **Bismarck escucha a los aviones**
export function setupBismarckSocketListeners(bismarck, scene) {
    socket.on("bismarck-move", (position) => {
        if (bismarck) {
            bismarck.setPosition(position.x, position.y);
            bismarck.setRotation(position.rotation);
        }
    });

	socket.on("bismarck-fire", (missile) => {
		new BismarckMissile(scene, missile.position.x, missile.position.y, missile.position.rotation);
	})
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

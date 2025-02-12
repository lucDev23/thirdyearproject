import { Player } from "../models/Player.js";

export class GameSocketManager {
    constructor(io) {
        this.io = io;
        this.players = new Map(); // Almacena los jugadores conectados
        this.initSockets();
    }

    initSockets() {
        this.io.on("connection", (socket) => {
            console.log(`Jugador conectado: ${socket.id}`);

            // Evento cuando un jugador se une
            socket.on("join-game", () => this.handleJoinGame(socket));

            // Movimiento del Bismarck
            socket.on("bismarck-move", (movement) => this.handleBismarckMove(socket, movement));

            // Desconexión de jugadores
            socket.on("disconnect", () => this.handleDisconnect(socket));
        });
    }

    handleJoinGame(socket) {
        let type = "spectator";

        // Asignar tipo de jugador
        if (![...this.players.values()].some(p => p.type === "bismarck")) {
            type = "bismarck";
        } else if (![...this.players.values()].some(p => p.type === "swordfish")) {
            type = "swordfish";
        }

        const player = new Player(socket.id, type);
        this.players.set(socket.id, player);

        socket.emit("player-assigned", { type });
        console.log(`Jugador ${socket.id} asignado como: ${type}`);

        this.io.emit("update-players", Array.from(this.players.values())); // Notificar a todos
    }

    handleBismarckMove(socket, movement) {
        const player = this.players.get(socket.id);
        if (player && player.type === "bismarck") {
            socket.broadcast.emit("bismarck-update", movement);
        }
    }

    handleDisconnect(socket) {
        console.log(`Jugador desconectado: ${socket.id}`);
        this.players.delete(socket.id);

        // Si el Bismarck se desconecta, reasignar un nuevo Capitán
        if (![...this.players.values()].some(p => p.type === "bismarck") && this.players.size > 0) {
            const newBismarckId = this.players.keys().next().value;
            this.players.set(newBismarckId, new Player(newBismarckId, "bismarck"));

            this.io.to(newBismarckId).emit("player-assigned", { type: "bismarck" });
            console.log(`Nuevo Bismarck asignado: ${newBismarckId}`);
        }

        this.io.emit("update-players", Array.from(this.players.values())); // Notificar a todos
    }
}

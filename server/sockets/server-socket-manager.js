import { Player } from "../models/Player.js";
import { Position } from "../models/Position.js";

export class ServerSocketManager {
    constructor(io) {
        this.io = io;
        this.players = new Map(); // Almacena los jugadores conectados
        this.initSockets();
    }

    initSockets() {
        this.io.on("connection", (socket) => {
            console.log(`Jugador conectado: ${socket.id}`);

            socket.on("join-game", () => this.handleJoinGame(socket));

            socket.on("bismarck-move", (position) => this.handleBismarckMove(socket, position));

            socket.on("swordfish-move", (position) => this.handleSwordfishMove(socket, position));

            socket.on("disconnect", () => this.handleDisconnect(socket));
        });
    }

    handleJoinGame(socket) {
        let type = "spectator";

        const players = [...this.players.values()];
        if (!players.some(p => p.type === "bismarck")) {
            type = "bismarck";
        } else if (!players.some(p => p.type === "swordfish")) {
            type = "swordfish";
        }

        const player = new Player(socket.id, type);
        this.players.set(socket.id, player);

        socket.emit("player-assigned", { type });
        console.log(`SERVER: Jugador ${socket.id} asignado como: ${type}`);

		this.handlePlayerEntityCreation(type);
    }

	handlePlayerEntityCreation(type) {
		switch (type) {
			case "bismarck": 
				this.io.emit("create-bismarck", this.getBismarckPosition());

				if (this.getSwordfishPlayer()) {
					this.io.emit("create-swordfish", this.getSwordfishPosition());
				}
				break;
			
			case "swordfish": 
			this.io.emit("create-swordfish", this.getBismarckPosition());

			if (this.getBismarckPlayer()) {
				this.io.emit("create-bismarck", this.getSwordfishPosition());
			}
			break;
		}
	}

    handleBismarckMove(socket, position) {
		socket.broadcast.emit("bismarck-move", position);
    }

    handleSwordfishMove(socket, movement) {
        socket.broadcast.emit("swordfish-move", movement);
    }

    handleDisconnect(socket) {
		console.log(`Jugador desconectado: ${socket.id}`);
		
		const player = this.players.get(socket.id);
		if (player) {
			if (player.type === "bismarck") {
				this.io.emit("remove-bismarck"); // Notificar a todos que eliminen el Bismarck
			} else if (player.type === "swordfish") {
				this.io.emit("remove-swordfish"); // Notificar a todos que eliminen el Swordfish
			}
		}
	
		this.players.delete(socket.id);
	
		this.io.emit("update-players", Array.from(this.players.values()));
	}
	

    getBismarckPlayer() {
        return [...this.players.values()].find(p => p.type === "bismarck") || null;
    }

	getBismarckPosition() {
		const player = this.getBismarckPlayer();
		
		return player.position || new Position(0, 300, 0);
	}

    getSwordfishPlayer() {
        return [...this.players.values()].find(p => p.type === "swordfish") || null;
    }

	getSwordfishPosition() {
		const player = this.getSwordfishPlayer();
		
		return player.position || new Position(0, 300, 0);
	}
}

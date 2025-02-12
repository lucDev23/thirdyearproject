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

            socket.on("bismarck-move", (position) => this.handleBismarckPosition(socket, position));

			socket.on("bismarck-fire", (missile) => this.handleBismarckFire(socket, missile));

            socket.on("swordfish-move", (position) => this.handleSwordfishPosition(socket, position));

            socket.on("swordfish-fire", (missile) => this.handleSwordfishFire(socket, missile));

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

    handleBismarckPosition(socket, position) {
		// **Guardar la posición en el servidor**
		const player = this.getBismarckPlayer();
		if (player) {
			player.position = position;
		}
	
		// **Reenviar la posición a todos los clientes, incluido el que movió**
		socket.broadcast.emit("bismarck-move", position);
	}
	

	handleBismarckFire(socket, missile) {
		this.io.emit("bismarck-fire", missile);
    }

    handleSwordfishPosition(socket, position) {
		// **Guardar la posición en el servidor**
		const player = this.getSwordfishPlayer();
		if (player) {
			player.position = position;
		}
	
		// **Reenviar la posición a todos los clientes, incluido el que movió**
		socket.broadcast.emit("swordfish-move", position);
    }

    handleSwordfishFire(socket, missile) {
		this.io.emit("swordfish-fire", missile);
    }

    handleDisconnect(socket) {
		console.log(`Jugador desconectado: ${socket. id}`);
		
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

'use strict'

import GameService from "../services/GameService.js";

export default class GameSocket {
	constructor(io) {
		this.io = io;
		this.initSockets();
	}

	initSockets() {
		this.io.on("connection", (socket) => {
			console.log("Se unio un jugador con el Socket: " + socket.id);

			socket.on("create-game", ({ playerId }) => {
				console.log('entro')
				const gameCode = GameService.getGameCodeByPlayerIdAndVinculateSocketId(playerId, socket.id);

				socket.join(gameCode);
				GameService.printGames();
			})

			socket.on("join-game", ({ playerId, gameId }) => {
				console.log('entro')
				const gameCode = GameService.getGameCodeByPlayerIdAndVinculateSocketId(playerId, socket.id);

				socket.join(gameCode);
				GameService.printGames();
			})

			socket.on("disconnect", () => console.log("Chau " + socket.id));
		});
	}
}
import Game from "../models/Game.js";

class GameService {
	constructor() {
		if (GameService._instance) {
			return GameService._instance;
		}
		
		this.games = [];
		GameService._instance = this;
	}

	createGame(playerId) {
		const gameCode = Date.now().toString();

		console.log("Juego creado con el id: " + gameCode);

		const newGame = {
			code: gameCode,
			bismarckPlayer: playerId,
			bismarckPlayerSocket: null,
			swordfishPlayer: null,
			swordfishPlayerSocket: null
		};

		this.games.push(newGame);
	}

	joinGame(playerId, gameCode) {
		const game = this.games.find((game) => game.code === gameCode);

		game.swordfishPlayer = playerId;
	}

	getGameCodeByPlayerIdAndVinculateSocketId(playerId, socketId) {
		const game = this.games.find(
			(game) => game.bismarckPlayer === playerId || game.swordfishPlayer === playerId
		);

		if (game.bismarckPlayer === playerId) {
			game.bismarckPlayerSocket = socketId;
		} else {
			game.swordfishPlayer = playerId;
			game.swordfishPlayerSocket = socketId;
		}
		
		console.log(game);

		return game.code;
	}

	printGames() {
		console.log(this.games);
	}
}

const instance = new GameService();
Object.freeze(instance);

export default new GameService();
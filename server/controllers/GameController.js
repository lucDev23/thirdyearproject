'use strict'

import GameService from "../services/GameService.js";

export const createGame = async(req, res, next) => {
	try {
		const { playerId } = req.body;

		GameService.createGame(playerId);
		GameService.printGames();

		return next();
	} catch (error) {
		next(error);
	}
}

export const joinGame = async(req, res, next) => {
	try {
		const { playerId, gameCode } = req.body;

		GameService.joinGame(playerId, gameCode);
		GameService.printGames();

		return next();
	} catch (error) {
		next(error);
	}
}

export const sendSwordfishToFight = async(req, res, next) => {
	
}
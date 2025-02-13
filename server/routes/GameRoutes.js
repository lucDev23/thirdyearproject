'use strict';

import express from 'express';
import * as GameController from '../controllers/GameController.js'

const router = express.Router();

router.post('/create-game', GameController.createGame);

router.post('/join-game', GameController.joinGame)

router.post('/setup-swordfish', GameController.sendSwordfishToFight);

export default router;
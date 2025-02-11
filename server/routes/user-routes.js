'use strict'

import express from 'express';
import * as userController from '../controllers/user-controller.js';

const router = express.Router();

router.get('/setup-swordfish', userController.getSetupSwordfish);

export default router;
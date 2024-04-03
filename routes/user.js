import express from 'express';
import { login } from '../controllers/userController.js';

const router = express.Router();

// Route de connexion
router.post('/login', login);

export default router;

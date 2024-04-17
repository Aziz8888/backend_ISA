import express from 'express';
import { login, getUserDetailsByEmail  } from '../controllers/userController.js';

const router = express.Router();

// Route de connexion
router.post('/login', login);
// Route pour récupérer un utilisateur par son adresse e-mail
router.get('/getUserByEmail/:email', getUserDetailsByEmail);
export default router;

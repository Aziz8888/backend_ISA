import express from 'express';
import { getScoreByChapter,submitAnswers } from '../controllers/note.js'; // Assurez-vous que le chemin d'importation est correct

const router = express.Router();

// Route pour soumettre les réponses d'un étudiant et calculer les notes
router.post('/tests/submit', submitAnswers);
router.get('/scores/:userId/', getScoreByChapter);

export default router;

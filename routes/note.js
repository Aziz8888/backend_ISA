import express from 'express';
import { submitAnswers,recommanderVideosEtudiant} from '../controllers/note.js'; // Assurez-vous que le chemin d'importation est correct

const router = express.Router();

// Route pour soumettre les réponses d'un étudiant et calculer les notes
router.post('/tests/submit/', submitAnswers);
router.get('/rec/:testId/:studentId',recommanderVideosEtudiant);


export default router;

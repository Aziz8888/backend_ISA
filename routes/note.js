import express from "express";
import {
  submitAnswers,
  recommanderVideosEtudiant,
  getScoreByChapter,
  getAllScoresByChapter,
  getTotalScoreByTestIdAndStudentId,
  predictWithFlask,
} from "../controllers/note.js"; // Assurez-vous que le chemin d'importation est correct

const router = express.Router();

// Route pour soumettre les réponses d'un étudiant et calculer les notes
router.post("/tests/submit/", submitAnswers);
router.get("/rec/:testId/:studentId", recommanderVideosEtudiant);
//router.get("/scores/:userId/", getScoreByChapter);
router.get("/all-scores/", getAllScoresByChapter);
router.get("/scores/:userId/", getScoreByChapter);
router.get("/totales/:testId/:studentId", getTotalScoreByTestIdAndStudentId);
router.post("/predictWithFlask", predictWithFlask);

export default router;

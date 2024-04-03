import express from 'express';
import { createPerformance, getAllPerformances, getPerformanceById, updatePerformance, deletePerformance, runPythonScript,calculateTotalGrades ,getAllTotalGrades } from '../controllers/PerformanceController.js';

const router = express.Router();
// Routes for individual performance
router.get('/:performanceId', getPerformanceById);
router.put('/:performanceId', updatePerformance);
router.delete('/:performanceId', deletePerformance);
router.get('/:performanceId/totalgrades', calculateTotalGrades);
router.post('/:studentId/runScript', runPythonScript);
// Route for total grades of all performances
router.get('/totalgrades', getAllTotalGrades);

// Route for all performances
router.get('/', getAllPerformances);

// Route to create a new performance
router.post('/', createPerformance);


export default router;

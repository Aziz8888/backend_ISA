import express from 'express';
import { createQAQuestion, createQuizQuestion ,compareQAAnswer,compareQuizAnswer} from  '../controllers/QuestionController.js';
import upload from '../middlewares/multer-config.js'; // Import the upload middleware

const router = express.Router();

router.route('/createQAQuestion').post(upload, createQAQuestion); // Use upload middleware before the createQAQuestion handler
router.route('/createQuizQuestion').post(createQuizQuestion);
router.route('/compareQAAnswer').post(compareQAAnswer);
router.route('/compareQuizAnswer').post(compareQuizAnswer);


export default router;
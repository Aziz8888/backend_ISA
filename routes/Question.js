import express from 'express';
import { createQAQuestion, createQuizQuestion } from '../controllers/Question.js';
import upload from '../middlewares/multerconfig.js'; // Import the upload middleware

const router = express.Router();

router.route('/createQAQuestion').post(upload, createQAQuestion); // Use upload middleware before the createQAQuestion handler
router.route('/createQuizQuestion').post(createQuizQuestion);

export default router;

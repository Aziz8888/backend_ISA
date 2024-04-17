import express from 'express';
import { createQAQuestion, createQuizQuestion, deleteQuestionById, getAllQuestions, getQuestionById, updateQuestion } from '../controllers/Question.js';
import upload from '../middlewares/multer-config.js'; // Import the upload middleware

const router = express.Router();

router.route('/createQAQuestion').post(upload, createQAQuestion); // Use upload middleware before the createQAQuestion handler
router.route('/createQuizQuestion').post(upload,createQuizQuestion);
router.route('/getAllQuestions').get(getAllQuestions);
router.route('/getQuestion').get(getQuestionById);
router.route('/updateQuestion').put(updateQuestion);
router.route('/deleteQuestion/:id').delete(deleteQuestionById);

export default router;
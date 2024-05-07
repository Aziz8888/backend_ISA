import express from 'express';
import { poserQuestion } from '../controllers/detectionerr.js';

const router = express.Router();

router.post('/poser_question', poserQuestion);

export default router;
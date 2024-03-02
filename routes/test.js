import express from 'express';
const router = express.Router();
import { createTest } from '../controllers/test.js';
router
  .route('/createTest')
  .post(createTest);

export default router;
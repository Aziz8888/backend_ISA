import express from 'express';
const router = express.Router();
import { getTestById,getChaptersByTestId,createTest, deleteTestById, getAllTests, getTestByTitle, updateTest } from '../controllers/test.js';

router
  .route('/createTest')
  .post(createTest);

router
  .route('/updateTest/:id')
  .put(updateTest);  

router
  .route('/getAllTests')
  .get(getAllTests);

router
  .route('/getTest/:title')
  .get(getTestByTitle);

router
  .route('/deleteTest/:id')
  .delete(deleteTestById);

router.get('/tests/:testId/chapters', getChaptersByTestId);

router.get('/tests/:id', getTestById);

  
export default router;
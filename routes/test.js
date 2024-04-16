import express from 'express';
const router = express.Router();
import { createTest, deleteTestById, getAllTests, getTestByTitle, updateTest } from '../controllers/testController.js';

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
  .route('/getTest')
  .get(getTestByTitle);

router
  .route('/deleteTest')
  .delete(deleteTestById);
  
export default router;
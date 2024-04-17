import express from 'express';
import   { createStudent, deleteById, getAll, getById, updateById } from '../controllers/studentController.js';
const router = express.Router();

router.post('/', createStudent);
router.get('/all', getAll);
router.get('/:studentId', getById);
router.put('/:studentId', updateById); 
router.delete('/:studentId',deleteById); 

export default router;
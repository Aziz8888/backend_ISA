import express from 'express';
import { createPerformance, deleteById, getAll, getById, updateById } from '../controllers/performanceController.js';



const router = express.Router();
router.post('/',createPerformance);

router.get('/all', getAll );
router.get('/:id',getById);
router.delete('/:id',deleteById);
router.put('/:id', updateById);  
export default router;
// Teacher.js

import express from 'express';
const router = express.Router();
import TeacherController from '../controllers/TeacherController.js';

// Définir la route pour ajouter un enseignant
router.post('/', TeacherController.addTeacher);

export default router;
                                                                                                                                                                                                                                                                        
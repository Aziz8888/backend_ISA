import express from 'express';
const router = express.Router();
import TeacherController from '../controllers/TeacherController.js';

router.post('/', TeacherController.addTeacher);
router.get('/:id', TeacherController.getTeacherById);
router.get('/', TeacherController.getAllTeachers);
router.put('/:id', TeacherController.updateTeacher);
router.get('/getTeachersStudents/:teacherId', TeacherController.getTeachersStudents);

export default router;
    
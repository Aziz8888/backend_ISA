
import {  GetAllCours, GetCoursR, deleteById } from "../controllers/CoursR.js";
import {getQuiz} from "../controllers/compilateur.js";
import express from "express";
const router = express.Router();

router.route("/run-code").get(getQuiz);
router.get('/cours', GetAllCours); 
router.get('/cours/:nomCours', GetCoursR); 
router.delete('/cours/:id', deleteById);

export default router;

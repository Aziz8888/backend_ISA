import {addCompilateur,getQuiz} from "../controllers/compilateur.js";
import express from "express";
const router = express.Router();

router.route("/run-code").post(addCompilateur).get(getQuiz);


export default router;

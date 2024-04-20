
import {getQuiz} from "../controllers/compilateur.js";
import express from "express";
const router = express.Router();

router.route("/run-code").get(getQuiz);

export default router;

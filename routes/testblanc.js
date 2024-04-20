import { getQuiz } from "../controllers/testblanc.js";
import express from "express";
const router = express.Router();

router.route("/test").get(getQuiz);

export default router;

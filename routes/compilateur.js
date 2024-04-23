import { addCompilateur } from "../controllers/compilateur.js";
import express from "express";
const router = express.Router();

router.route("/run-code").post(addCompilateur);

export default router;

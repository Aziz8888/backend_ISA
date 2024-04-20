import multer from "../middlewares/multer-config.js";
import { AjouterCoursR } from "../controllers/CoursR.js";
import express from "express";
const router = express.Router();

router.route("/").post(multer,AjouterCoursR);


export default router;

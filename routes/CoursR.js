import multer from "../middlewares/multer-config.js";
import { AjouterCoursR, GetAllCours } from "../controllers/CoursR.js";
import express from "express";
const router = express.Router();

router
.route("/rec")
.post(multer,AjouterCoursR)
.get(GetAllCours);



export default router;

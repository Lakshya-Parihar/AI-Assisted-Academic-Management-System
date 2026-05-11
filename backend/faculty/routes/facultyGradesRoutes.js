import express from "express";
import { getGradesData, saveGrade, publishAllGrades } from "../controllers/facultyGradesController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.get("/data", getGradesData);
router.post("/save", saveGrade);
router.put("/publish-all", publishAllGrades);

export default router;
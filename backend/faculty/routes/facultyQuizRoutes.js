import express from "express";
import {
  getQuizData,
  createQuiz,
} from "../controllers/facultyQuizController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Changed authenticateFaculty to verifyToken here!
router.get("/data", verifyToken, getQuizData);
router.post("/create", verifyToken, createQuiz);

export default router;

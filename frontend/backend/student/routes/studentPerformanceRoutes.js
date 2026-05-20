import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  getMyGrades,
  getStudentQuizzes,
  getQuizQuestions,
  submitQuizResult,
} from "../controllers/studentPerformanceController.js";

const router = express.Router();

// Apply verifyToken to ALL routes in this file automatically
router.use(verifyToken);

// ==========================================
// 📚 GRADES & DASHBOARD ROUTE
// Frontend calls: studentApi.get("/my-grades")
// ==========================================
router.get("/grades", getMyGrades);

// ==========================================
// 📝 QUIZ PORTAL ROUTES
// Frontend calls: studentApi.get("/quizzes/...")
// ==========================================
router.get("/quizzes/list", getStudentQuizzes);
router.get("/quizzes/questions/:id", getQuizQuestions);
router.post("/quizzes/submit", submitQuizResult);

export default router;

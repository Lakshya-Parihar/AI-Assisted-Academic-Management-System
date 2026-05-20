import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  getLearningCourses,
  getCourseContent,
  saveCourseNote,
  trackStudentDownload,
  postCourseDiscussion,
} from "../controllers/studentLearningController.js";

const router = express.Router();

router.get("/learning/courses", verifyToken, getLearningCourses);
router.get("/learning/course/:courseId", verifyToken, getCourseContent);
router.post("/learning/note", verifyToken, saveCourseNote);
router.put(
  "/learning/materials/:id/download",
  verifyToken,
  trackStudentDownload,
);
router.post(
  "/learning/course/:courseId/discussion",
  verifyToken,
  postCourseDiscussion,
);

export default router;

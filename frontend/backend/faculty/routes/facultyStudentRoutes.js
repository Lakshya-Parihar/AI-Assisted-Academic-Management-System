import express from "express";
import {
  getBranchStudents,
  getStudentReport,
} from "../controllers/facultyStudentController.js";

// FIX 1 & 2: Folder is 'middlewares' and we use a default import (no curly braces)
import verifyFacultyToken from "../middlewares/authMiddleware.js";

const verifyToken = verifyFacultyToken;

const router = express.Router();

// Apply the middleware using the imported name
router.use(verifyToken);

// GET /api/faculty/my-students
router.get("/my-students", getBranchStudents);

// GET /api/faculty/student/:id/report
router.get("/student/:id/report", getStudentReport);

export default router;

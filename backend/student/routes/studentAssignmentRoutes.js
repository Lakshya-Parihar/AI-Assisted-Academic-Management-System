import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import verifyToken from "../middlewares/authMiddleware.js";
import { getMyCourses, getMyAssignments, submitAssignment, getAssignmentCount } from "../controllers/studentAssignmentController.js";
import { getStudentGrades } from "../controllers/studentGradesController.js";

const router = express.Router();

// --- MULTER CONFIGURATION ---
// Ensure the uploads directory exists before saving
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up where and how to save the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Example format: 5-1709849202-project.pdf
    const studentId = req.user?.student_id || req.user?.id || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${studentId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
 
const upload = multer({ storage: storage });

// --- ROUTES ---
router.use(verifyToken); // Secure all these routes

router.get("/courses", getMyCourses);
router.get("/", verifyToken, getMyAssignments);
router.get("/assignmentcount", verifyToken, getAssignmentCount);
// We inject the Multer 'upload.single("file")' middleware right before the controller function
router.post("/submit/:id", upload.single("file"), submitAssignment);

router.get("/grades", verifyToken, getStudentGrades);

export default router;
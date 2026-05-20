import express from "express";
import multer from "multer";
import path from "path";
import {
  getAssignments,
  createAssignment,
  getSubmissions,
  gradeSubmission,
  getAssignmentStatus,
  deleteAssignment,
  updateAssignment,
} from "../controllers/assignmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===============================
   Multer Configuration
=============================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===============================
   Assignment Routes
=============================== */

router.get("/", authMiddleware, getAssignments);
router.post("/create", authMiddleware, upload.single("attachment"), createAssignment);
router.get("/:assignmentId/submissions", getSubmissions);
router.get("/:assignmentId/status", getAssignmentStatus);
router.put("/grade/:submissionId", gradeSubmission);
router.delete("/:id", deleteAssignment);
router.put("/:id", upload.single("attachment"), updateAssignment);

export default router;

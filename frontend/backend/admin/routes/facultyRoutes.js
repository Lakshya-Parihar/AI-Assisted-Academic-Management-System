import express from "express";
import multer from "multer";
import {
  addFaculty,
  getAllFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyCount,
  getFacultyBranches,
  bulkUploadFaculty,
} from "../controllers/facultyController.js";
import { facultyUpload } from "../middlewares/facultyUpload.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const bulkUpload = multer({ dest: "uploads/" });

router.post(
  "/faculty",
  authMiddleware,
  facultyUpload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "resume_file", maxCount: 1 },
  ]),
  addFaculty,
);

// BULK FACULTY UPLOAD 🔥
// ==========================
router.post(
  "/faculty/bulk",
  authMiddleware,
  bulkUpload.single("file"),
  bulkUploadFaculty,
);

router.get("/faculty", authMiddleware, getAllFaculty);

/* UPDATE ✅ */
router.put(
  "/faculty/:id",
  facultyUpload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "resume_file", maxCount: 1 },
  ]),
  updateFaculty,
);
router.delete("/faculty/:id", deleteFaculty);

// Route to count all students
router.get("/faculty/count", getFacultyCount);

// Branches for editing form for facutly
router.get("/branches", getFacultyBranches);

export default router;

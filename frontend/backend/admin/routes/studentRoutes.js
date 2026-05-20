import express from "express";
import multer from "multer";
import { upload } from "../middlewares/upload.js";
import {
  addStudent,
  getAllStudents,
  deleteStudent,
  updateStudent,
  getStudentCount,
  promoteStudent,
  getRecentActivities,
  getTopStudents,
  bulkUploadStudents,
  downloadSampleZip, 
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const bulkUpload = multer({ dest: "uploads/" });

// Route to add a new student (with file uploads)
router.post(
  "/students",
  authMiddleware,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhar_file", maxCount: 1 },
    { name: "leaving_file", maxCount: 1 },
  ]),
  addStudent,
);

// Route to fetch all students
router.get("/students", authMiddleware, getAllStudents);

// Route to update a student
router.put(
  "/students/:id",
  authMiddleware,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  updateStudent,
);

// 2. Route to delete a student by ID
router.delete("/students/:id", authMiddleware, deleteStudent);

// Route to count all students
router.get("/students/count", getStudentCount);
router.put("/promote/:id", promoteStudent);

// dashboard activities
router.get("/activities", getRecentActivities);
router.get("/top-students", getTopStudents);

router.post("/students/bulk", bulkUpload.single("file"), bulkUploadStudents);
router.get("/students/sample-zip", downloadSampleZip);

export default router;

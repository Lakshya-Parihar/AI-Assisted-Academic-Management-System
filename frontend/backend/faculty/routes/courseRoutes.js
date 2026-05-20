import fs from "fs";
import multer from "multer";
import path from "path";
import express from "express";
import {
  getBranches,
  getFacultyCourses,
  getCourseChapters,
  addChapter,
  updateChapterStatus,
  getFilteredCourses,
  uploadMaterial,
  getMaterials,
  getCourseAnalytics,
  getCourseReportData,
  bulkAddChapters,
  deleteChapter,
} from "../controllers/facultyCourseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadDir = "uploads/materials";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `material-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

router.get("/branches", authMiddleware, getBranches);
router.get("/", authMiddleware, getFacultyCourses);
router.get("/:courseId/chapters", authMiddleware, getCourseChapters);
router.post("/:courseId/chapters", authMiddleware, addChapter);
router.put("/chapters/:chapterId", authMiddleware, updateChapterStatus);
router.get("/filteredcourses", authMiddleware, getFilteredCourses);
router.post("/:courseId/chapters/bulk", authMiddleware, bulkAddChapters);
router.delete("/chapters/:chapterId", authMiddleware, deleteChapter);

// --- MATERIALS & ANALYTICS ROUTES ---
router.post("/:courseId/materials", authMiddleware, upload.single("file"), uploadMaterial);
router.get("/:courseId/materials", authMiddleware, getMaterials);
router.get("/:courseId/analytics", authMiddleware, getCourseAnalytics);
router.get("/:courseId/report", authMiddleware, getCourseReportData);

export default router;

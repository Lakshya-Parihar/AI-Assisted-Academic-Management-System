import express from "express";
import multer from "multer";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  getSchedule,
  addCustomEvent,
  uploadTimetableCsv,
  getCourseProgress, // 🔥 IMPORT NEW FUNCTION
} from "../controllers/studentScheduleController.js";

const router = express.Router();
router.use(verifyToken);

const upload = multer({ dest: "uploads/temp/" });

router.get("/", getSchedule);
router.post("/custom", addCustomEvent);
router.post("/upload", upload.single("timetable"), uploadTimetableCsv);
router.post("/course-progress", getCourseProgress); // 🔥 ADD NEW ROUTE

export default router;

import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  getAverageAttendance,
  getMonthlyAttendance,
  getLowAttendanceStudents,
} from "../controllers/attendanceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/attendance/average", getAverageAttendance);
router.get("/attendance/monthly", getMonthlyAttendance);
router.get("/attendance/low", getLowAttendanceStudents);

export default router;

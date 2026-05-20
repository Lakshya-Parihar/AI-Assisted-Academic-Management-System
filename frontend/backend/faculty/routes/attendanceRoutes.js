import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getBranches,
  getCourses,
  getRoster,
  generatePin,
  saveAttendanceRecords, // We only need the new explicit locking function!
} from "../controllers/attendanceController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/branches", getBranches);
router.get("/courses", getCourses);
router.get("/roster", getRoster);

// This perfectly links to your new function
router.post("/save", saveAttendanceRecords);

// The geofence route
router.post("/generate-pin", generatePin);

export default router;

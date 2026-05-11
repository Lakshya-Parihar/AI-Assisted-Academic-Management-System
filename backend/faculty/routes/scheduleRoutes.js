import express from "express";
import { 
  getFacultySchedule, 
  addSchedule, 
  getFacultyCourses, 
  getFacultyScheduleRange, 
  importScheduleCSV, 
  upload // <-- Make sure upload is imported!
} from "../controllers/facultyScheduleController.js";

const router = express.Router();

// Order matters here! Keep the specific routes above the general "/" routes
router.get("/get-range", getFacultyScheduleRange); 
router.get("/my-courses", getFacultyCourses); 
router.get("/", getFacultySchedule);
router.post("/", addSchedule);

// The new CSV upload route using multer middleware
router.post("/import-csv", upload.single('scheduleFile'), importScheduleCSV);

export default router;
import express from "express";
import { addCourse, getAllCourses, deleteCourse, updateCourse, getCourseCount, } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/courses", authMiddleware, addCourse);
router.get("/courses", authMiddleware, getAllCourses);
router.delete("/courses/:id", authMiddleware, deleteCourse);
router.put("/courses/:id", authMiddleware, updateCourse);
router.get("/course/count", getCourseCount);

export default router;
import express from "express";
import { verifyAttendancePin, getMyAttendanceStats } from "../controllers/studentAttendanceController.js";

// 🚨 IMPORTANT: Change this import path to wherever your actual auth middleware is located!
// It might be named verifyToken, authenticate, etc., depending on what you named it in your auth routes.
import verifyToken from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// We put verifyToken back in the middle! This forces the app to read the student's login.
router.post("/attendance/verify", verifyToken, verifyAttendancePin);
router.get("/attendance/stats", verifyToken, getMyAttendanceStats);
export default router;
import express from "express";
import { getFacultyProfile, getFacultyBranches } from "../controllers/facultyProfileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET CURRENT FACULTY PROFILE
router.get("/profile", authMiddleware, getFacultyProfile);
router.get("/branches", authMiddleware, getFacultyBranches);

export default router;
import express from "express";
import { getDegreeProgress } from "../controllers/studentProgressController.js";

const router = express.Router();

// GET request to fetch the student's degree progress
// This will be accessed via: /api/student/degree
router.get("/", getDegreeProgress);

export default router;

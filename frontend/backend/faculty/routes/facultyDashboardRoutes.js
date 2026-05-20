import express from "express";
import { getFacultyDashboardData } from "../controllers/facultyDashboardController.js";

const router = express.Router();

// This sets up the route: GET /api/faculty/dashboard/:facultyId
router.get("/:facultyId", getFacultyDashboardData);

export default router;

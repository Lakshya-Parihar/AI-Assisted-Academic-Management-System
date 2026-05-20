import express from "express";
import {
  getStudentRiskAnalysis,
  getFacultyDashboardData,
  getAnalyticsKPIs,
  sendAcademicWarning,
} from "../controllers/facultyAnalyticsController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.get("/student/:id", getStudentRiskAnalysis);
router.get("/:facultyId/dashboard", getFacultyDashboardData);
router.get("/kpi-data", getAnalyticsKPIs);
router.post("/send-warning", sendAcademicWarning);

export default router;

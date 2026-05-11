import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { getNexusInsights } from "../controllers/studentAnalyticsController.js";

const router = express.Router();

// 1. Require the student to be logged in
router.use(verifyToken);

// 2. The endpoint that matches our React code: studentApi.get("/nexus/insights")
router.get("/insights", getNexusInsights);

export default router;

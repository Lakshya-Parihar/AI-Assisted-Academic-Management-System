import express from "express";
import {
  addCollege,
  getAllColleges,
  updateCollege,
  deleteCollege,
  getCollegeCount,
} from "../controllers/collegeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/colleges", authMiddleware, addCollege);
router.get("/colleges", authMiddleware, getAllColleges);
router.put("/colleges/:id", authMiddleware, updateCollege);
router.delete("/colleges/:id", authMiddleware, deleteCollege);
router.get("/college/count", getCollegeCount);

export default router;

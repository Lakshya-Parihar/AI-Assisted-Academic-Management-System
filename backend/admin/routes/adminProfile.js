import express from "express";
import { getAdminProfile, updateAdminProfile } from "../controllers/adminProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// GET profile
router.get("/profile", authMiddleware, getAdminProfile);

// UPDATE profile
router.put(
  "/profile",
  authMiddleware,
  upload.single("profile_photo"),
  updateAdminProfile
);

export default router;
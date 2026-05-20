import express from "express";
import { postCircular } from "../controllers/facultyCircularsController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs"; // Add this import

const router = express.Router();

// Ensure the directory exists before Multer tries to write to it
const uploadDir = "uploads/circulars/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer to save files in the "uploads/circulars" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `circular-${Date.now()}-${Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

router.use(verifyToken);
router.post("/publish", upload.array("attachments", 5), postCircular);

export default router;
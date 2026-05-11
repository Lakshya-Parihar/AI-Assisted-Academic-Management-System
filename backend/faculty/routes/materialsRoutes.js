import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  getMaterialStats, getAllMaterials, uploadGlobalMaterial, trackDownload, deleteMaterial 
} from "../controllers/facultyMaterialsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadDir = "uploads/materials";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `global-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

router.get("/stats",authMiddleware, getMaterialStats);
router.get("/", authMiddleware, getAllMaterials);
router.post("/upload", authMiddleware, upload.single("file"), uploadGlobalMaterial);
router.put("/:id/download", authMiddleware, trackDownload);
router.delete("/:id", authMiddleware, deleteMaterial);

export default router;
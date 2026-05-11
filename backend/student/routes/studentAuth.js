import express from "express";
import { studentLogin, resetStudentPassword, getStudentProfile, changeStudentPassword, } from "../controllers/studentAuthController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/reset-password", resetStudentPassword);
router.get("/profile", verifyToken, getStudentProfile);
router.put("/change-password", verifyToken, changeStudentPassword);


export default router;

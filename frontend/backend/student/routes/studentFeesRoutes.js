import express from "express";
import { getMyFees, payFees, getPaymentHistory  } from "../controllers/studentFeesController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-fees", verifyToken, getMyFees);
router.put("/pay/:id", verifyToken, payFees);
router.get("/history", verifyToken, getPaymentHistory);

export default router; 
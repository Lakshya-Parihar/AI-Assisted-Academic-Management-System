import express from "express";
import { getCirculars } from "../controllers/studentCircularsController.js";

const router = express.Router();
router.get("/", getCirculars);

export default router;

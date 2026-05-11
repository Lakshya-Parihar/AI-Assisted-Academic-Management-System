import express from "express";
import {
  setBranchFees,
  getBranchFees,
  updateBranchFees,
  deleteBranchFees ,
  getFeeTransactions,
  getFeeSummary,
  getFeesSummaryAdmin,
} from "../controllers/feesController.js";
import { getAllBranches } from "../controllers/branchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/branch-fees", setBranchFees);
router.get("/branches", authMiddleware, getAllBranches);
router.get("/", getBranchFees);
router.put("/:id", updateBranchFees);
router.delete("/:id", deleteBranchFees);
router.get("/transactions", getFeeTransactions);
router.get("/summary", getFeeSummary);
router.get("/summaryadmin", getFeesSummaryAdmin);


export default router;

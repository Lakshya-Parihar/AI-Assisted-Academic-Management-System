import express from "express";
import { addBranch, getAllBranches, deleteBranch, updateBranch, getBranchCount, getBranchesByCollege, } from "../controllers/branchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/branches", authMiddleware, addBranch);
router.get("/branches", authMiddleware, getAllBranches);
router.delete("/branches/:id", authMiddleware, deleteBranch);
router.put("/branches/:id", authMiddleware, updateBranch);
router.get("/branch/count", getBranchCount);
router.get("/branches/by-college/:college_id", getBranchesByCollege);



export default router;
import express from "express";
import {
  getAllCertificates,
  issueCertificate,
  revokeCertificate,
  upload,
  getCertificateRequests,
  rejectCertificateRequest,
} from "../controllers/adminCertificateController.js";

const router = express.Router();

router.get("/", getAllCertificates);
router.post("/issue", upload.single("certificateFile"), issueCertificate);
router.delete("/:id", revokeCertificate);

// --- NEW: Requests ---
router.get("/requests", getCertificateRequests);
router.put("/requests/:id/reject", rejectCertificateRequest);

export default router;

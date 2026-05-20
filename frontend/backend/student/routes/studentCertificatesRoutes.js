import express from "express";
import {
  getStudentCertificates,
  requestCertificate,
  getMyRequests,
} from "../controllers/studentCertificateController.js";

const router = express.Router();

// GET request to fetch the student's certificates
router.get("/", getStudentCertificates);

// --- NEW: Requests ---
// Note: Since this router is mounted at /api/student/certificates in server.js,
// the actual endpoint becomes /api/student/certificates/request
router.post("/request", requestCertificate);
router.get("/requests", getMyRequests);

export default router;

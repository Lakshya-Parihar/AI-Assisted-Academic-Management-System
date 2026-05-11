import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/certificates/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, "cert-" + Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });

export const getAllCertificates = async (req, res) => {
  try {
    const [certificates] = await db.query(
      `SELECT c.*, s.name as student_name, s.enrollment_no FROM student_certificates c JOIN students s ON c.student_id = s.id ORDER BY c.created_at DESC`,
    );
    res.status(200).json(certificates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch certificates", error: error.message });
  }
};

export const issueCertificate = async (req, res) => {
  try {
    const {
      student_id,
      title,
      category,
      description,
      badge_type,
      issue_date,
      request_id,
    } = req.body;
    const file = req.file;

    const verified_id = `AIA-${Math.floor(1000 + Math.random() * 9000)}`;
    const file_url = file ? file.path : null;

    await db.query(
      `INSERT INTO student_certificates (student_id, title, category, description, badge_type, issue_date, verified_id, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        title,
        category,
        description,
        badge_type || "Completion",
        issue_date,
        verified_id,
        file_url,
      ],
    );

    // If this was from a request, mark it as Approved
    if (request_id) {
      await db.query(
        `UPDATE certificate_requests SET status = 'Approved' WHERE id = ?`,
        [request_id],
      );
    }

    res
      .status(201)
      .json({ message: "Certificate issued successfully!", verified_id });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ message: "Failed to issue certificate", error: error.message });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const [cert] = await db.query(
      "SELECT file_url FROM student_certificates WHERE id = ?",
      [id],
    );
    if (cert.length > 0 && cert[0].file_url && fs.existsSync(cert[0].file_url))
      fs.unlinkSync(cert[0].file_url);
    await db.query("DELETE FROM student_certificates WHERE id = ?", [id]);
    res.status(200).json({ message: "Certificate revoked." });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke", error: error.message });
  }
};

// --- NEW: Get pending requests ---
export const getCertificateRequests = async (req, res) => {
  try {
    const [requests] = await db.query(`
            SELECT r.*, s.name as student_name, s.enrollment_no 
            FROM certificate_requests r 
            JOIN students s ON r.student_id = s.id 
            WHERE r.status = 'Pending' 
            ORDER BY r.created_at ASC
        `);
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

// --- NEW: Reject a request ---
export const rejectCertificateRequest = async (req, res) => {
  try {
    await db.query(
      `UPDATE certificate_requests SET status = 'Rejected' WHERE id = ?`,
      [req.params.id],
    );
    res.status(200).json({ message: "Request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject", error: error.message });
  }
};

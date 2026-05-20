import db from "../config/db.js";

// Get issued certificates
export const getStudentCertificates = async (req, res) => {
  try {
    const studentId = req.user?.id || req.query.student_id;
    const [certificates] = await db.query(
      `SELECT * FROM student_certificates WHERE student_id = ? ORDER BY issue_date DESC`,
      [studentId],
    );
    const stats = {
      total_earned: certificates.length,
      deans_list: certificates.filter((c) =>
        c.title.toLowerCase().includes("dean"),
      ).length,
      course_medals: certificates.filter(
        (c) => c.badge_type === "EXPERTISE" || c.badge_type === "HONOR",
      ).length,
    };
    res.status(200).json({ stats, certificates });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch certificates", error: error.message });
  }
};

// --- NEW: Request a Certificate ---
export const requestCertificate = async (req, res) => {
  try {
    const studentId = req.user?.id || req.body.student_id;
    const { requested_title, reason } = req.body;
    await db.query(
      `INSERT INTO certificate_requests (student_id, requested_title, reason) VALUES (?, ?, ?)`,
      [studentId, requested_title, reason],
    );
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit request", error: error.message });
  }
};

// --- NEW: Get My Requests ---
export const getMyRequests = async (req, res) => {
  try {
    const studentId = req.user?.id || req.query.student_id;
    const [requests] = await db.query(
      `SELECT * FROM certificate_requests WHERE student_id = ? ORDER BY created_at DESC`,
      [studentId],
    );
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

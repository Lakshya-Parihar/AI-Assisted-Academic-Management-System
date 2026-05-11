import db from "../config/db.js";

/* =========================
   GET FACULTY PROFILE
========================= */
export const getFacultyProfile = async (req, res) => {
  try {
    // coming from JWT middleware
    const facultyId = req.user.id;

    const [rows] = await db.query(
      "SELECT faculty_id, full_name, profile_photo FROM faculty WHERE faculty_id=?",
      [facultyId],
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("GET FACULTY PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFacultyBranches = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT b.id, b.branch_name
      FROM faculty f
      JOIN branches b ON f.branch_id = b.id
      WHERE f.faculty_id = ?
      `,
      [facultyId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching branches" });
  }
};

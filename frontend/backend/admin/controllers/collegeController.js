import db from "../config/db.js";

// --- ADD COLLEGE ---
export const addCollege = async (req, res) => {
  try {
    const sql = `
      INSERT INTO colleges (
        college_name, college_code, university_name, 
        hod_email, hod_phone, clg_address, established_year, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
 
    const values = [
      req.body.college_name,
      req.body.college_code,
      req.body.university_name,
      req.body.hod_email,
      req.body.hod_phone,
      req.body.clg_address,
      req.body.established_year,
      req.body.status || "Active",
    ];

    await db.query(sql, values);
    res.json({ message: "College added successfully" });
  } catch (err) {
    console.error("Add college error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "College Code already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET ALL COLLEGES ---
export const getAllColleges = async (req, res) => {
  try {
    const sql = "SELECT * FROM colleges ORDER BY id DESC";
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch colleges error:", err);
    res.status(500).json({ message: "Failed to fetch colleges" });
  }
};

// --- UPDATE COLLEGE ---
export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE colleges 
      SET college_name = ?, college_code = ?, university_name = ?, 
          hod_email = ?, hod_phone = ?, clg_address = ?, 
          established_year = ?, status = ?
      WHERE id = ?
    `;

    const values = [
      req.body.college_name,
      req.body.college_code,
      req.body.university_name,
      req.body.hod_email,
      req.body.hod_phone,
      req.body.clg_address,
      req.body.established_year,
      req.body.status,
      id,
    ];

    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "College not found" });

    res.json({ message: "College updated successfully" });
  } catch (err) {
    console.error("Update college error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- DELETE COLLEGE ---
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM colleges WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "College not found" });

    res.json({ message: "College deleted successfully" });
  } catch (err) {
    console.error("Delete college error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET COLLEGE COUNT ---
export const getCollegeCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      "SELECT COUNT(*) AS totalColleges FROM colleges"
    );

    res.json({ totalColleges: result.totalColleges });
  } catch (err) {
    console.error("College count error:", err);
    res.status(500).json({ message: "Failed to fetch college count" });
  }
};

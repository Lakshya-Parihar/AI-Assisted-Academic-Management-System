import db from "../config/db.js";

// --- ADD BRANCH ---
export const addBranch = async (req, res) => {
  try {
    const sql = `
      INSERT INTO branches (
        college_id,
        branch_name,
        branch_code,
        hod_name,
        contact_email,
        contact_phone,
        block_location,
        total_sems,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;

    const values = [
      req.body.college_id,
      req.body.branch_name,
      req.body.branch_code,
      req.body.hod_name,
      req.body.contact_email,
      req.body.contact_phone,
      req.body.block_location,
      req.body.total_sems,
    ];

    await db.query(sql, values);
    res.json({ message: "Branch added successfully" });
  } catch (err) {
    console.error("Add branch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET ALL BRANCHES ---
export const getAllBranches = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.*,
        c.college_name
      FROM branches b
      LEFT JOIN colleges c 
        ON b.college_id = c.id
      ORDER BY b.id DESC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch branches error:", err);
    res.status(500).json({ message: "Failed to fetch branches" });
  }
};

// --- UPDATE BRANCH ---
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      college_id,
      branch_name,
      branch_code,
      hod_name,
      contact_email,
      contact_phone,
      block_location,
      total_sems,
      status,
    } = req.body;

    const sql = `
      UPDATE branches SET
        college_id = ?,
        branch_name = ?,
        branch_code = ?,
        hod_name = ?,
        contact_email = ?,
        contact_phone = ?,
        block_location = ?,
        total_sems = ?,
        status = ?
      WHERE id = ?
    `;

    const values = [
      college_id,
      branch_name,
      branch_code,
      hod_name,
      contact_email,
      contact_phone,
      block_location,
      total_sems,
      status || "active",
      id,
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch updated successfully" });
  } catch (err) {
    console.error("Update branch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- DELETE BRANCH ---
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM branches WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    console.error("Delete branch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET BRANCH COUNT ---
export const getBranchCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      "SELECT COUNT(*) AS totalBranches FROM branches",
    );

    res.json({ totalBranches: result.totalBranches });
  } catch (err) {
    console.error("Branch count error:", err);
    res.status(500).json({ message: "Failed to fetch Branch count" });
  }
};

// --- GET BRANCHES BY COLLEGE ---
export const getBranchesByCollege = async (req, res) => {
  try {
    const { college_id } = req.params;

    const sql = `
      SELECT id, branch_name
      FROM branches
      WHERE college_id = ?
      AND status = 'active'
      ORDER BY branch_name ASC
    `;

    const [rows] = await db.query(sql, [college_id]);
    res.json(rows);
  } catch (err) {
    console.error("Fetch branches by college error:", err);
    res.status(500).json({ message: "Failed to fetch branches" });
  }
};

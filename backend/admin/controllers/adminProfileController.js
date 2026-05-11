import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* =========================
   GET ADMIN PROFILE
========================= */
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.admin_id;

    const [rows] = await db.query(
      "SELECT admin_id, name, email, profile_photo FROM admins WHERE admin_id = ?",
      [adminId]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE ADMIN PROFILE
========================= */
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.admin_id;
    const { name, email, password } = req.body;

    let query = "UPDATE admins SET name=?, email=?";
    let values = [name, email];

    /* =========================
       PROFILE IMAGE UPDATE
    ========================= */
    if (req.file) {
      query += ", profile_photo=?";
      values.push(req.file.filename);
    }

    /* =========================
       PASSWORD UPDATE
    ========================= */
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password=?";
      values.push(hashedPassword);
    }

    query += " WHERE admin_id=?";
    values.push(adminId);

    await db.query(query, values);

    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
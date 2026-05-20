import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// 🔥 FACULTY LOGIN CONTROLLER
export const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find faculty using EMAIL (based on your DB structure)
    const [rows] = await db.query(
      "SELECT * FROM faculty WHERE email = ?",
      [email]
    );

    // ❌ Faculty not found
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Faculty not found",
      });
    }

    const faculty = rows[0];

    // ❌ Check account status (VERY IMPORTANT based on your table)
    if (faculty.status !== "Active") {
      return res.status(403).json({
        message: "Your account is not active",
      });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, faculty.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // ✅ Create JWT Token (using faculty_id from your DB)
    const token = jwt.sign(
      {
        id: faculty.faculty_id,
        email: faculty.email,
        branch_id: faculty.branch_id,
        role: "faculty",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send only required data to frontend
    res.json({
      token,
      faculty: {
        faculty_id: faculty.faculty_id,
        full_name: faculty.full_name,
        email: faculty.email,
        phone_number: faculty.phone_number,
        designation: faculty.designation,
        branch_id: faculty.branch_id,
        profile_photo: faculty.profile_photo,
        status: faculty.status,
      },
    });
  } catch (error) {
    console.error("Faculty Login Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

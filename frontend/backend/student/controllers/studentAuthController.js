import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const studentLogin = async (req, res) => {
  try {
    const { enrollment_no, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM students WHERE enrollment_no = ? AND status = 'active'",
      [enrollment_no],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const student = rows[0];

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { student_id: student.id, email: student.email, role: "student" },
      "STUDENT_SECRET",
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        name: student.name,
        enrollment_no: student.enrollment_no,
        email: student.email,
        is_first_login: student.is_first_login,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 RESET PASSWORD
export const resetStudentPassword = async (req, res) => {
  const { enrollment_no, newPassword } = req.body;

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE students SET password = ?, is_first_login = 0 WHERE enrollment_no = ?",
      [hashed, enrollment_no],
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.student_id;

    const [rows] = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.enrollment_no,
        s.email,
        s.phone,
        s.gender,
        s.dob,
        s.semester,
        s.photo,
        s.status,
        s.state,
        s.city,
        s.pincode,
        s.father_name,
        s.father_occupation,
        s.mother_name,
        s.mother_occupation,
        s.tenth_percent,
        s.twelfth_percent,
        b.branch_name AS branch,
        c.college_name AS college,
        c.established_year AS year
      FROM students s
      JOIN branches b ON s.branch_id = b.id
      JOIN colleges c ON s.college_id = c.id
      WHERE s.id = ?`,
      [studentId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeStudentPassword = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    const { currentPassword, newPassword } = req.body;

    // get student
    const [rows] = await db.query(
      "SELECT password FROM students WHERE id = ?",
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = rows[0];

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE students SET password = ? WHERE id = ?",
      [hashedPassword, studentId]
    );

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

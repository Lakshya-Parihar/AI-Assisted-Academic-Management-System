import bcrypt from "bcryptjs";
import db from "../config/db.js";
import AdmZip from "adm-zip";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

let credentials = [];

// --- ADD STUDENT ---
export const addStudent = async (req, res) => {
  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const photo = req.files?.photo?.[0]?.filename || null;
    const aadhar = req.files?.aadhar_file?.[0]?.filename || null;
    const leaving = req.files?.leaving_file?.[0]?.filename || null;
    const sql = `
INSERT INTO students (
  enrollment_no, name, email, phone, gender, dob,
  college_id, branch_id, semester, state, city, pincode,
  father_name, father_occupation, mother_name, mother_occupation,
  tenth_percent, twelfth_percent,
  photo, aadhar_file, leaving_file,
  password, is_first_login, status
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?,1,'active')
`;

    const values = [
      req.body.enrollment_no,
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.gender,
      req.body.dob,
      req.body.college_id,
      req.body.branch_id,
      req.body.semester || 1,
      req.body.state,
      req.body.city,
      req.body.pincode,
      req.body.father_name,
      req.body.father_occupation,
      req.body.mother_name,
      req.body.mother_occupation,
      req.body.tenth_percent,
      req.body.twelfth_percent,
      photo,
      aadhar,
      leaving,
      hashedPassword,
    ];

    console.log("VALUES LENGTH:", values.length);

    await db.query(sql, values);

    console.log("🔐 Student temporary password:", tempPassword);

    res.json({
      message: "Student added successfully",
      tempPassword,
    });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET ALL STUDENTS ---
export const getAllStudents = async (req, res) => {
  try {
    const sql = `
      SELECT
        s.id,
        s.enrollment_no,
        s.name,
        s.email,
        s.phone,
        s.gender,
        s.dob,
        s.college_id,
        c.college_name,   -- ✅ JOINED
        s.branch_id,
        b.branch_name AS course,  -- ✅ JOINED
        s.semester,
        s.state,
        s.city,
        s.pincode,
        s.father_name,
        s.father_occupation,
        s.mother_name,
        s.mother_occupation,
        s.tenth_percent,
        s.twelfth_percent,
        s.status,
        s.is_first_login,
        s.created_at,

        CASE
          WHEN s.photo IS NOT NULL
          THEN CONCAT('http://localhost:5000/uploads/photos/', s.photo)
          ELSE NULL
        END AS photo,

        CASE
          WHEN s.aadhar_file IS NOT NULL
          THEN CONCAT('http://localhost:5000/uploads/aadhar/', s.aadhar_file)
          ELSE NULL
        END AS aadhar_file,

        CASE
          WHEN s.leaving_file IS NOT NULL
          THEN CONCAT('http://localhost:5000/uploads/leaving/', s.leaving_file)
          ELSE NULL
        END AS leaving_file

      FROM students s
      LEFT JOIN colleges c ON s.college_id = c.id
      LEFT JOIN branches b ON s.branch_id = b.id
      ORDER BY s.created_at DESC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// --- UPDATE STUDENT ---
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Student ID required" });
    }

    const updatedData = { ...req.body };

    // Handle photo update
    if (req.files?.photo?.[0]) {
      updatedData.photo = req.files.photo[0].filename;
    }

    const sql = "UPDATE students SET ? WHERE id = ?";
    await db.query(sql, [updatedData, id]);

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
};

// --- DELETE STUDENT ---
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from the URL (e.g., /students/5)

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const sql = "DELETE FROM students WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

// --- GET STUDENT COUNT ---
export const getStudentCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      "SELECT COUNT(*) AS totalStudents FROM students",
    );

    res.json({ totalStudents: result.totalStudents });
  } catch (err) {
    console.error("Student count error:", err);
    res.status(500).json({ message: "Failed to fetch student count" });
  }
};

// PROMOTE STUDENT TO NEXT SEMESTER
export const promoteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get student info
    const [[student]] = await db.query(
      `SELECT semester, branch_id FROM students WHERE id=?`,
      [id],
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentSem = student.semester;

    // 2️⃣ Get total semesters of branch
    const [[branch]] = await db.query(
      `SELECT total_sems FROM branches WHERE id=?`,
      [student.branch_id],
    );

    if (!branch) {
      return res.status(400).json({ error: "Branch not found" });
    }

    if (currentSem >= branch.total_sems) {
      return res.status(400).json({
        error: "Student already completed final semester",
      });
    }

    // 3️⃣ Check if current semester fees fully paid
    const [[fees]] = await db.query(
      `SELECT payment_status FROM student_fee_payments
       WHERE student_id=? AND semester=?`,
      [id, currentSem],
    );

    if (!fees || fees.payment_status !== "Paid") {
      return res.status(400).json({
        error: "Cannot promote. Current semester fees not fully paid.",
      });
    }

    // 4️⃣ Promote student
    await db.query(`UPDATE students SET semester=? WHERE id=?`, [
      currentSem + 1,
      id,
    ]);

    res.json({
      message: `Student promoted to Semester ${currentSem + 1}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const [activities] = await db.query(`
      
      /* 🧑‍🎓 STUDENTS */
      (
        SELECT 
          'student' AS type,
          s.name AS title,
          'New student registered' AS description,
          s.created_at AS time,
          s.enrollment_no,
          s.email,
          s.phone,
          b.branch_name AS branch,
          s.semester
        FROM students s
        LEFT JOIN branches b ON s.branch_id = b.id
      )

      UNION ALL

      /* 💰 FEES */
      (
        SELECT 
          'fees' AS type,
          s.name AS title,
          CONCAT('Paid ₹', f.amount_paid) AS description,
          f.payment_date AS time,
          s.enrollment_no,
          s.email,
          s.phone,
          b.branch_name AS branch,
          s.semester
        FROM fee_transactions f
        JOIN students s ON s.id = f.student_id
        LEFT JOIN branches b ON s.branch_id = b.id
        WHERE f.payment_date IS NOT NULL
      )

      UNION ALL

      /* 📚 ASSIGNMENTS */
      (
        SELECT 
          'assignment' AS type,
          s.name AS title,
          CONCAT('Submitted Assignment ID ', sub.assignment_id) AS description,
          sub.submitted_at AS time,
          s.enrollment_no,
          s.email,
          s.phone,
          b.branch_name AS branch,
          s.semester
        FROM submissions sub
        JOIN students s ON s.id = sub.student_id
        LEFT JOIN branches b ON s.branch_id = b.id
      )

      UNION ALL

      /* 📝 ATTENDANCE */
      (
        SELECT 
          'attendance' AS type,
          s.name AS title,
          CONCAT('Marked ', a.status) AS description,
          a.created_at AS time,
          s.enrollment_no,
          s.email,
          s.phone,
          b.branch_name AS branch,
          s.semester
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        LEFT JOIN branches b ON s.branch_id = b.id
      )

      ORDER BY time DESC
      LIMIT 10
    `);

    res.json(activities);
  } catch (err) {
    console.error("Activity Error:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

export const getTopStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.enrollment_no,
        b.branch_name AS branch,
        s.semester,

        ROUND(
          (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100
        ) AS attendance_percentage

      FROM students s
      JOIN attendance a ON a.student_id = s.id
      LEFT JOIN branches b ON s.branch_id = b.id

      GROUP BY s.id
      HAVING attendance_percentage IS NOT NULL
      ORDER BY attendance_percentage DESC
      LIMIT 5
    `);

    res.json(students);
  } catch (err) {
    console.error("Top Students Error:", err);
    res.status(500).json({ error: "Failed to fetch top students" });
  }
};

export const bulkUploadStudents = async (req, res) => {
  let extractPath = "";

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No ZIP file uploaded" });
    }

    const zipPath = req.file.path;

    // 📦 Extract ZIP
    const zip = new AdmZip(zipPath);
    extractPath = `uploads/extracted_${Date.now()}`;
    zip.extractAllTo(extractPath, true);

    // 📄 Read CSV
    const csvPath = path.join(extractPath, "students.csv");

    if (!fs.existsSync(csvPath)) {
      return res.status(400).json({ error: "students.csv not found in ZIP" });
    }

    const workbook = xlsx.readFile(csvPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const students = xlsx.utils.sheet_to_json(sheet);

    let credentials = [];
    let errors = [];
    let successCount = 0;

    for (let student of students) {
      try {
        // 🔍 BASIC VALIDATION
        if (!student.email || !student.enrollment_no || !student.name) {
          errors.push({
            email: student.email || "N/A",
            error: "Missing required fields",
          });
          continue;
        }

        // 🔁 DUPLICATE CHECK
        const [existing] = await db.query(
          "SELECT id FROM students WHERE email=?",
          [student.email],
        );

        if (existing.length > 0) {
          errors.push({
            email: student.email,
            error: "Email already exists",
          });
          continue;
        }

        // 🔐 Password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 📁 File Paths
        const photoPath = path.join(extractPath, "photos", student.photo || "");
        const aadharPath = path.join(
          extractPath,
          "aadhar",
          student.aadhar || "",
        );
        const leavingPath = path.join(
          extractPath,
          "leaving",
          student.leaving || "",
        );

        // ⚠️ File validation logs (optional)
        if (student.photo && !fs.existsSync(photoPath)) {
          console.warn(`Missing photo for ${student.email}`);
        }

        // 📂 Copy files (if exist)
        if (student.photo && fs.existsSync(photoPath)) {
          await fs.promises.copyFile(
            photoPath,
            `uploads/photos/${student.photo}`,
          );
        }

        if (student.aadhar && fs.existsSync(aadharPath)) {
          await fs.promises.copyFile(
            aadharPath,
            `uploads/aadhar/${student.aadhar}`,
          );
        }

        if (student.leaving && fs.existsSync(leavingPath)) {
          await fs.promises.copyFile(
            leavingPath,
            `uploads/leaving/${student.leaving}`,
          );
        }

        // 💾 Insert into DB
        await db.query(
          `INSERT INTO students 
          (enrollment_no, name, email, phone, gender, dob, college_id, branch_id, semester, state, city, pincode, father_name, father_occupation, mother_name, mother_occupation, tenth_percent, twelfth_percent, photo, aadhar_file, leaving_file, password, is_first_login, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active')`,
          [
            student.enrollment_no,
            student.name,
            student.email,
            student.phone || null,
            student.gender || "Male",
            student.dob || null,
            student.college_id || null,
            student.branch_id || null,
            student.semester || 1,
            student.state || null,
            student.city || null,
            student.pincode || null,
            student.father_name || null,
            student.father_occupation || null,
            student.mother_name || null,
            student.mother_occupation || null,
            student.tenth_percent || 0,
            student.twelfth_percent || 0,
            student.photo || null,
            student.aadhar || null,
            student.leaving || null,
            hashedPassword,
          ],
        );

        // 📋 Save credentials
        credentials.push({
          enrollment_no: student.enrollment_no,
          email: student.email,
          password: tempPassword,
        });

        successCount++;
      } catch (err) {
        errors.push({
          email: student.email || "N/A",
          error: err.message,
        });
      }
    }
    if (successCount === 0) {
      return res.status(400).json({
        message: "No students uploaded. All records may already exist.",
        errors,
      });
    }
    // 📊 Create credentials Excel
    const worksheet = xlsx.utils.json_to_sheet(credentials);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, worksheet, "Credentials");

    const filePath = `uploads/credentials_${Date.now()}.xlsx`;
    xlsx.writeFile(newWorkbook, filePath);

    // 📤 Send file + summary in headers
    res.setHeader("X-Success-Count", successCount);
    res.setHeader("X-Error-Count", errors.length);

    return res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk upload failed" });
  } finally {
    // 🧹 CLEANUP (VERY IMPORTANT)
    try {
      if (extractPath && fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
};

export const downloadSampleZip = async (req, res) => {
  try {
    const AdmZip = (await import("adm-zip")).default;
    const zip = new AdmZip();

    // 📄 Sample CSV content
    const csvContent = `enrollment_no,name,email,phone,gender,dob,college_id,branch_id,semester,state,city,pincode,father_name,father_occupation,mother_name,mother_occupation,tenth_percent,twelfth_percent,photo,aadhar,leaving
SN001,John Doe,john@example.com,9999999999,Male,2000-01-01,1,1,1,Gujarat,Ahmedabad,380001,Father Name,Engineer,Mother Name,Teacher,85,88,john.jpg,john_aadhar.pdf,john_leaving.pdf
SN002,Jane Smith,jane@example.com,8888888888,Female,2001-02-02,1,2,1,Gujarat,Surat,395001,Father Name,Business,Mother Name,Housewife,90,92,jane.jpg,jane_aadhar.pdf,jane_leaving.pdf`;

    zip.addFile("students.csv", Buffer.from(csvContent, "utf-8"));

    // 📁 Add empty folders
    zip.addFile("photos/", Buffer.alloc(0));
    zip.addFile("aadhar/", Buffer.alloc(0));
    zip.addFile("leaving/", Buffer.alloc(0));

    // 📤 Send ZIP
    const zipBuffer = zip.toBuffer();

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=sample_students.zip",
    });

    res.send(zipBuffer);
  } catch (err) {
    console.error("Sample ZIP error:", err);
    res.status(500).json({ error: "Failed to generate sample ZIP" });
  }
};

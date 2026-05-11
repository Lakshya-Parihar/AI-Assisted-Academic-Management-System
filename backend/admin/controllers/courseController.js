import db from "../config/db.js";

// --- ADD COURSE ---
export const addCourse = async (req, res) => {
  try {
    const sql = `
      INSERT INTO courses (
        course_code, course_name, department_id, assigned_faculty_id, course_coordinator_id,
        credits, semester, course_type, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.course_code,
      req.body.course_name,
      req.body.department_id,
      req.body.assigned_faculty_id || null,
      req.body.course_coordinator_id || null,
      req.body.credits,
      req.body.semester,
      req.body.course_type || 'Core',
      req.body.description,
      req.body.status || 'Active'
    ];

    await db.query(sql, values);
    res.json({ message: "Course added successfully" });
  } catch (err) {
    console.error("Add course error:", err);
    // Handle duplicate course code error specifically
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Course Code already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET ALL COURSES (with Department & Faculty Names) ---
export const getAllCourses = async (req, res) => {
  try {
    const sql = `
      SELECT c.*, 
             b.branch_name as department_name,
             f1.full_name as assigned_faculty_name,
             f2.full_name as coordinator_name
      FROM courses c
      LEFT JOIN branches b ON c.department_id = b.id
      LEFT JOIN faculty f1 ON c.assigned_faculty_id = f1.faculty_id
      LEFT JOIN faculty f2 ON c.course_coordinator_id = f2.faculty_id
      ORDER BY c.course_id DESC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// --- UPDATE COURSE ---
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      UPDATE courses 
      SET course_name = ?, course_code = ?, department_id = ?, 
          assigned_faculty_id = ?, course_coordinator_id = ?,
          credits = ?, semester = ?, course_type = ?, 
          status = ?, description = ?
      WHERE course_id = ?
    `;

    const values = [
      req.body.course_name,
      req.body.course_code,
      req.body.department_id,
      req.body.assigned_faculty_id || null,
      req.body.course_coordinator_id || null,
      req.body.credits,
      req.body.semester,
      req.body.course_type,
      req.body.status,
      req.body.description,
      id
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- DELETE COURSE ---
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM courses WHERE course_id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET COURSE COUNT ---
export const getCourseCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      "SELECT COUNT(*) AS totalCourses FROM courses"
    );

    res.json({ totalCourses: result.totalCourses });
  } catch (err) {
    console.error("Course count error:", err);
    res.status(500).json({ message: "Failed to fetch Course count" });
  }
};
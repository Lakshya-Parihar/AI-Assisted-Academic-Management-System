import db from "../config/db.js";

// 1. Get All Courses
export const getFacultyCourses = async (req, res) => {
  try {
    const branchId = req.user.branch_id;

    const [courses] = await db.query(`
      SELECT 
        c.*, 
        (SELECT COUNT(*) 
         FROM students s 
         WHERE s.branch_id = c.department_id 
         AND s.semester = c.semester 
         AND s.status = 'active') AS student_count,

        (SELECT IFNULL(
          ROUND(
            (SUM(CASE WHEN ch.status = 'Completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100
          ), 0
        ) 
         FROM chapters ch 
         WHERE ch.course_id = c.course_id) AS completion_percentage

      FROM courses c
      WHERE c.department_id = ?
      AND c.status = 'active'
    `, [branchId]);

    res.json(courses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// 2. Get Chapters for a specific Course
export const getCourseChapters = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM chapters WHERE course_id = ?",
      [courseId],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chapters" });
  }
};

// 3. Add a New Chapter
export const addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoUrl } = req.body;
    await db.query(
      "INSERT INTO chapters (course_id, title, video_url) VALUES (?, ?, ?)",
      [courseId, title, videoUrl || null],
    );
    res.status(201).json({ message: "Chapter added" });
  } catch (error) {
    res.status(500).json({ message: "Error adding chapter" });
  }
};

// 4. Update Chapter Status (Progress)
export const updateChapterStatus = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { status } = req.body;
    await db.query("UPDATE chapters SET status = ? WHERE id = ?", [
      status,
      chapterId,
    ]);
    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

export const getFilteredCourses = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    const query = `
      SELECT course_id, course_name, semester
      FROM courses
      WHERE department_id = ? AND semester = ?
      ORDER BY course_name ASC
    `;

    const [rows] = await db.query(query, [branch, semester]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

export const uploadMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });
    const fileUrl = req.file.path.replace(/\\/g, "/");
    const fileName = req.file.originalname;
    await db.query(
      `INSERT INTO course_materials (course_id, file_name, file_url) VALUES (?, ?, ?)`,
      [courseId, fileName, fileUrl],
    );
    res.json({ message: "Material uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading material" });
  }
};

export const getBranches = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, branch_name, branch_code FROM branches WHERE status = 'active'",
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches" });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM course_materials WHERE course_id = ? ORDER BY uploaded_at DESC",
      [courseId],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching materials" });
  }
};

export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [attendanceRows] = await db.query(
      `
      SELECT COUNT(*) as total_records, SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_records
      FROM attendance WHERE course_id = ?
    `,
      [courseId],
    );
    const total = attendanceRows[0].total_records || 0;
    const present = attendanceRows[0].present_records || 0;
    const avgAttendance = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    res.json({ avgAttendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

export const getCourseReportData = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [report] = await db.query(
      `
      SELECT s.enrollment_no, s.name, s.email,
        (SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id AND a.course_id = ? AND a.status = 'Present') as classes_attended
      FROM students s JOIN courses c ON s.branch_id = c.department_id AND s.semester = c.semester
      WHERE c.course_id = ? AND s.status = 'active'
    `,
      [courseId, courseId],
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Error generating report data" });
  }
};

export const bulkAddChapters = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { chapters } = req.body;

    if (!chapters || !chapters.length) {
      return res.status(400).json({ message: "No chapters provided" });
    }

    const values = [];
    const placeholders = chapters
      .map((ch) => {
        values.push(courseId, ch.title, ch.videoUrl || null);
        return "(?, ?, ?)";
      })
      .join(", ");

    await db.query(
      `INSERT INTO chapters (course_id, title, video_url) VALUES ${placeholders}`,
      values,
    );

    res
      .status(201)
      .json({ message: `${chapters.length} chapters added successfully` });
  } catch (error) {
    console.error("Error in bulkAddChapters:", error);
    res.status(500).json({ message: "Error bulk adding chapters" });
  }
};

// --- NEW: Delete a single chapter ---
export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    await db.query("DELETE FROM chapters WHERE id = ?", [chapterId]);
    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ message: "Error deleting chapter" });
  }
};
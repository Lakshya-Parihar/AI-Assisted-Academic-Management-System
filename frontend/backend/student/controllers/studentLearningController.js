import pool from "../config/db.js";

// 1. Get the student's enrolled courses
export const getLearningCourses = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;
    const [courses] = await pool.query(
      `
      SELECT c.course_id, c.course_code, c.course_name 
      FROM courses c
      JOIN students s ON c.department_id = s.branch_id AND c.semester = s.semester
      WHERE s.id = ? AND c.status = 'active'
    `,
      [studentId],
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// 2. Get specific course content (Chapters, Materials, Notes, DISCUSSIONS)
export const getCourseContent = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;
    const { courseId } = req.params;

    const [chapters] = await pool.query(
      "SELECT * FROM chapters WHERE course_id = ?",
      [courseId],
    );
    const [materials] = await pool.query(
      "SELECT * FROM course_materials WHERE course_id = ? ORDER BY uploaded_at DESC",
      [courseId],
    );
    const [notes] = await pool.query(
      "SELECT * FROM student_notes WHERE student_id = ? AND course_id = ? ORDER BY created_at ASC",
      [studentId, courseId],
    );

    // Fetch all discussions for this course
    const [discussions] = await pool.query(
      "SELECT * FROM course_discussions WHERE course_id = ? ORDER BY created_at ASC",
      [courseId],
    );

    res.json({ chapters, materials, notes, discussions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course content" });
  }
};

// 3. Save a personal note
export const saveCourseNote = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;
    const { course_id, note_text, timestamp } = req.body;

    await pool.query(
      "INSERT INTO student_notes (student_id, course_id, note_text, timestamp) VALUES (?, ?, ?, ?)",
      [studentId, course_id, note_text, timestamp || "00:00"],
    );
    res.status(201).json({ message: "Note saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save note" });
  }
};

// 4. Track Material Download
export const trackStudentDownload = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE course_materials SET downloads = downloads + 1 WHERE id = ?",
      [id],
    );
    res.json({ message: "Download tracked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to track download" });
  }
};

// 5. Post a Discussion Message
export const postCourseDiscussion = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;
    const { courseId } = req.params;
    const { text } = req.body;

    const [student] = await pool.query(
      "SELECT name FROM students WHERE id = ?",
      [studentId],
    );
    const studentName = student[0]?.name || "Anonymous Student";

    await pool.query(
      "INSERT INTO course_discussions (course_id, student_id, student_name, text) VALUES (?, ?, ?, ?)",
      [courseId, studentId, studentName, text],
    );

    res.status(201).json({ message: "Discussion posted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to post discussion" });
  }
};

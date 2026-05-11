import db from "../config/db.js";

// Fetch Courses & Existing Quizzes for the Builder Dashboard
export const getQuizData = async (req, res) => {
  try {
    const facultyEmail = req.user.email;

    // 1. Get Faculty ID
    const [facultyRes] = await db.query(
      "SELECT faculty_id FROM faculty WHERE email = ?",
      [facultyEmail],
    );
    if (facultyRes.length === 0)
      return res.status(404).json({ error: "Faculty not found" });
    const facultyId = facultyRes[0].faculty_id;

    // 2. Get active courses strictly assigned to this faculty
    const [courses] = await db.query(
      'SELECT course_id, course_code, course_name FROM courses WHERE assigned_faculty_id = ? AND status = "active"',
      [facultyId],
    );

    // 3. Get all existing quizzes created by this faculty for the sidebar ledger
    const [quizzes] = await db.query(
      `
            SELECT q.*, c.course_name, 
                   (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count,
                   (SELECT SUM(points) FROM quiz_questions WHERE quiz_id = q.id) as total_points
            FROM quizzes q
            JOIN courses c ON q.course_id = c.course_id
            WHERE q.faculty_id = ?
            ORDER BY q.created_at DESC
        `,
      [facultyId],
    );

    res.json({ courses, quizzes, facultyId });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    res.status(500).json({ error: "Server error fetching quiz data" });
  }
};

// Save a newly generated Quiz from the Frontend
export const createQuiz = async (req, res) => {
  try {
    const {
      faculty_id,
      course_id,
      title,
      description,
      time_limit,
      status,
      questions,
    } = req.body;

    // 1. Insert the Main Quiz Record
    const [quizResult] = await db.query(
      "INSERT INTO quizzes (course_id, faculty_id, title, description, time_limit, status) VALUES (?, ?, ?, ?, ?, ?)",
      [course_id, faculty_id, title, description, time_limit, status],
    );

    const quizId = quizResult.insertId;

    // 2. Insert all Questions tied to that Quiz
    for (let q of questions) {
      // Find which option was marked as correct (A, B, C, or D)
      const correctOpt = q.options.find((o) => o.isCorrect)?.id || "A";

      await db.query(
        "INSERT INTO quiz_questions (quiz_id, question_text, points, options, correct_option_id) VALUES (?, ?, ?, ?, ?)",
        [quizId, q.text, q.points, JSON.stringify(q.options), correctOpt], // JSON.stringify ensures it saves securely in the JSON column
      );
    }

    res
      .status(201)
      .json({ message: "Quiz minted to the Ledger successfully!" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Server error creating quiz" });
  }
};

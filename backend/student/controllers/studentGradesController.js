import db from "../config/db.js";

export const getStudentGrades = async (req, res) => {
  try {

    const studentId = req.user.student_id;

    const query = `
      SELECT
        c.course_name,
        a.title AS assignment_title,
        s.marks_obtained,
        a.deadline,
        s.submitted_at
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.course_id
      WHERE s.student_id = ?
      ORDER BY a.deadline DESC
    `;

    const [rows] = await db.query(query,[studentId]);

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Error fetching grades"});
  }
};
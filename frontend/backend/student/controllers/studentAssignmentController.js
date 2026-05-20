import pool from "../config/db.js";

// 1. Fetch Enrolled Courses based on Student's Branch & Semester
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;

    // 1️⃣ Get student info
    const [[student]] = await pool.query(
      "SELECT branch_id, semester FROM students WHERE id = ?",
      [studentId]
    );

    const { branch_id, semester } = student;

    // 2️⃣ Get courses + faculty (FIXED JOIN)
    const [courses] = await pool.query(
      `
      SELECT 
        c.course_id AS id,
        c.course_code,
        c.course_name,
        
        (
          SELECT f.full_name 
          FROM faculty f 
          WHERE f.branch_id = c.department_id
          LIMIT 1
        ) AS faculty_name

      FROM courses c
      WHERE c.department_id = ? 
        AND c.semester = ? 
        AND c.status = 'active'
      `,
      [branch_id, semester]
    );

    // 3️⃣ Add stats
    const detailedCourses = await Promise.all(
      courses.map(async (course) => {
        
        // 📊 Attendance
        const [[attendance]] = await pool.query(
          `
          SELECT 
            COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*) AS attendance_percentage
          FROM attendance
          WHERE student_id = ? AND course_id = ?
          `,
          [studentId, course.id]
        );

        // 📝 Assignments
        const [[assignmentStats]] = await pool.query(
          `
          SELECT 
            COUNT(*) AS total,
            COUNT(CASE WHEN s.id IS NOT NULL THEN 1 END) AS submitted
          FROM assignments a
          LEFT JOIN submissions s 
            ON a.id = s.assignment_id 
            AND s.student_id = ?
          WHERE a.course_id = ?
          `,
          [studentId, course.id]
        );

        const progress =
          assignmentStats.total > 0
            ? Math.round(
                (assignmentStats.submitted / assignmentStats.total) * 100
              )
            : 0;

        return {
          ...course,
          faculty_name: course.faculty_name || "Not Assigned",
          attendance: Math.round(attendance.attendance_percentage || 0),
          assignments: assignmentStats,
          progress,
        };
      })
    );

    res.json(detailedCourses);
  } catch (error) {
    console.error("Detailed Courses Error:", error);
    res.status(500).json({ error: "Failed to fetch detailed courses" });
  }
};

// 2. Fetch Assignments (Pending, Submitted, & Graded)
export const getMyAssignments = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;

    // Added attachment_url, marks_obtained, and proper 'graded' status checking
    const [assignments] = await pool.query(
      `
      SELECT 
        a.id, 
        a.title, 
        a.attachment_url,
        a.description,
        DATE_FORMAT(a.deadline, '%Y-%m-%d') as dueDate, 
        c.course_name as course,
        c.course_code,
        sub.marks_obtained,
        sub.file_url AS submission_file,
        IF(sub.status = 'graded', 'Graded', IF(sub.id IS NOT NULL, 'Submitted', 'Pending')) as status
      FROM assignments a
      JOIN courses c ON a.course_id = c.course_id
      JOIN students s ON c.department_id = s.branch_id AND c.semester = s.semester
      LEFT JOIN submissions sub ON a.id = sub.assignment_id AND sub.student_id = ?
      WHERE s.id = ? AND a.status = 'active'
      GROUP BY a.id
    `,
      [studentId, studentId],
    );

    res.json(assignments);
  } catch (error) {
    console.error("Assignments Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// 3. Submit Assignment (Save File to DB)
export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;
    const assignmentId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    const fileUrl = req.file.filename;

    const [existing] = await pool.query(
      `SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?`,
      [assignmentId, studentId],
    );

    if (existing.length > 0) {
      await pool.query(
        `
            UPDATE submissions 
            SET file_url = ?, submitted_at = NOW(), status = 'submitted' 
            WHERE id = ?
        `,
        [fileUrl, existing[0].id],
      );
    } else {
      await pool.query(
        `
            INSERT INTO submissions (assignment_id, student_id, file_url, status, submitted_at)
            VALUES (?, ?, ?, 'submitted', NOW())
        `,
        [assignmentId, studentId, fileUrl],
      );
    }

    res.json({ message: "Assignment uploaded successfully!", fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to submit assignment" });
  }
};

export const getAssignmentCount = async (req, res) => {
  try {
    const studentId = req.user.student_id;

    const [[student]] = await pool.query(
      "SELECT branch_id, semester FROM students WHERE id = ?",
      [studentId]
    );

    const { branch_id, semester } = student; //3,2

    const [[result]] = await pool.query(
      `
      SELECT COUNT(*) AS pending
      FROM assignments a
      LEFT JOIN submissions s
        ON a.id = s.assignment_id
        AND s.student_id = ?
      WHERE a.branch_id = ?
      AND a.semester = ?
      AND s.id IS NULL
      `,
      [studentId, branch_id, semester]
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

import db from "../config/db.js";

/* =====================================================
   1. Get All Assignments with Correct Student Counts
===================================================== */
export const getAssignments = async (req, res) => {
  try {
    const facultyId = req.user.id; // logged in faculty

    const query = `
      SELECT 
        a.id,
        a.title,
        a.description,
        a.deadline,
        a.attachment_url,
        a.status,
        c.course_name,
        c.semester,
        c.course_code,

        (SELECT COUNT(*) FROM submissions s 
         WHERE s.assignment_id = a.id) AS submission_count,

        (SELECT COUNT(*) FROM students st 
         WHERE st.branch_id = a.branch_id 
         AND st.semester = a.semester) AS total_students

      FROM assignments a
      JOIN courses c ON a.course_id = c.course_id

      WHERE a.faculty_id = ?

      ORDER BY a.created_at DESC
    `;

    const [rows] = await db.query(query, [facultyId]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

/* =====================================================
   2. Create Assignment
===================================================== */
export const createAssignment = async (req, res) => {
  try {
    const faculty_id = req.user.id;

    const { branch_id, semester, course_id, title, description, deadline } =
      req.body;

    const attachment_url = req.file ? req.file.filename : null;

    await db.query(
      `
      INSERT INTO assignments
      (branch_id, semester, course_id, faculty_id, title, description, deadline, attachment_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `,
      [
        branch_id,
        semester,
        course_id,
        faculty_id,
        title,
        description,
        deadline,
        attachment_url,
      ],
    );

    res.status(201).json({ message: "Assignment published successfully" });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Error creating assignment" });
  }
};

/* =====================================================
   3. Get Student Submission Status
===================================================== */
export const getAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Get assignment branch + semester
    const [assignRows] = await db.query(
      "SELECT branch_id, semester FROM assignments WHERE id = ?",
      [assignmentId],
    );

    if (assignRows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const { branch_id, semester } = assignRows[0];

    const query = `
      SELECT 
        st.id AS student_id,
        st.name,
        st.enrollment_no,
        sub.id AS submission_id,
        sub.status AS submission_status,
        sub.marks_obtained,
        sub.file_url,
        sub.submitted_at
      FROM students st
      LEFT JOIN submissions sub 
        ON st.id = sub.student_id 
        AND sub.assignment_id = ?
      WHERE st.branch_id = ?
      AND st.semester = ?
      ORDER BY st.name ASC
    `;

    const [rows] = await db.query(query, [assignmentId, branch_id, semester]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching status" });
  }
};

/* =====================================================
   4. Get Submissions
===================================================== */
export const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const query = `
      SELECT 
        s.*, 
        st.name AS student_name, 
        st.enrollment_no
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      WHERE s.assignment_id = ?
    `;

    const [rows] = await db.query(query, [assignmentId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

/* =====================================================
   5. Delete Assignment
===================================================== */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM assignments WHERE id = ?", [id]);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment" });
  }
};

/* =====================================================
   6. Update Assignment
===================================================== */
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline } = req.body;

    const newAttachment = req.file ? req.file.filename : null;

    if (newAttachment) {
      await db.query(
        `
        UPDATE assignments 
        SET title=?, description=?, deadline=?, attachment_url=?
        WHERE id=?
        `,
        [title, description, deadline, newAttachment, id],
      );
    } else {
      await db.query(
        `
        UPDATE assignments 
        SET title=?, description=?, deadline=?
        WHERE id=?
        `,
        [title, description, deadline, id],
      );
    }

    res.json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Error updating assignment" });
  }
};

/* =====================================================
   7. Grade Submission
===================================================== */
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks } = req.body;

    await db.query(
      "UPDATE submissions SET marks_obtained = ?, status = 'graded' WHERE id = ?",
      [marks, submissionId],
    );

    res.json({ message: "Graded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error grading submission" });
  }
};

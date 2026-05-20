import db from "../config/db.js";

/* =========================================================
   GET GRADES DATA (Reads from Exam Grades & Unified View)
========================================================= */
/* =========================================================
   GET GRADES DATA (Upgraded for Inter-Departmental Teaching)
========================================================= */
export const getGradesData = async (req, res) => {
  try {
    const facultyEmail = req.user.email;

    // 1. Get Home Branch ID and Faculty ID
    const [facultyRes] = await db.query(
      "SELECT branch_id, faculty_id FROM faculty WHERE email = ?",
      [facultyEmail]
    );
    if (facultyRes.length === 0)
      return res.status(404).json({ error: "Faculty not found" });

    const branchId = facultyRes[0].branch_id;
    const facultyId = facultyRes[0].faculty_id;

    // 2. Fetch Courses (Home Branch OR Explicitly Assigned)
    // We added 'department_id' here so React knows which branch the course belongs to
    const [courses] = await db.query(
      `SELECT course_id, course_code, course_name, assigned_faculty_id, semester, department_id 
       FROM courses 
       WHERE (department_id = ? OR assigned_faculty_id = ?) AND status = 'active'`,
      [branchId, facultyId]
    );

    // 3. Fetch Active Students (Home Branch OR Enrolled in an Assigned Course)
    // We added 'branch_id' so React can filter students accurately
    const [students] = await db.query(
      `SELECT DISTINCT s.id, s.enrollment_no, s.name, s.semester, s.photo, s.branch_id 
       FROM students s
       LEFT JOIN courses c ON s.branch_id = c.department_id AND s.semester = c.semester
       WHERE (s.branch_id = ? OR c.assigned_faculty_id = ?) AND s.status = 'active'`,
      [branchId, facultyId]
    );

    // 4. Fetch Editable Manual Exam Grades
    let existingGrades = [];
    const courseIds = courses.map((c) => c.course_id);
    
    if (courseIds.length > 0) {
        const [grades] = await db.query(
          `SELECT student_id, course_id, exam_type, marks_obtained, total_marks, status
           FROM exam_grades
           WHERE course_id IN (?)`,
          [courseIds]
        );
        existingGrades = grades;
    }

    // 5. Fetch read-only analytics
    const myCourses = courses.filter((c) => c.assigned_faculty_id === facultyId);
    const myCourseIds = myCourses.map((c) => c.course_id);
    
    let completionRate = 0;
    let classAverage = "0.0";

    if (myCourseIds.length > 0) {
        const [unifiedStats] = await db.query(
            `SELECT 
                COUNT(*) as total_assessments_taken,
                AVG((score / max_score) * 100) as true_average
             FROM unified_gradebook 
             WHERE course_id IN (?)`,
            [myCourseIds]
        );
        
        classAverage = unifiedStats[0].true_average 
            ? parseFloat(unifiedStats[0].true_average).toFixed(1) 
            : "0.0";
            
        // Calculate dynamic completion rate
        let expectedExams = 0;
        myCourses.forEach(mc => {
            expectedExams += students.filter(s => s.branch_id === mc.department_id && s.semester === mc.semester).length;
        });
        
        const enteredExams = existingGrades.filter(g => myCourseIds.includes(g.course_id)).length;
        completionRate = expectedExams > 0 ? ((enteredExams / expectedExams) * 100).toFixed(1) : 0;
    }

    res.json({
      students,
      courses,
      existingGrades,
      myFacultyId: facultyId,
      stats: { completionRate, classAverage },
    });
  } catch (error) {
    console.error("Error fetching grades data:", error);
    res.status(500).json({ error: "Server error fetching grades data" });
  }
};

/* =========================================================
   SAVE MANUAL EXAM GRADES (With Draft/Publish Support)
========================================================= */
export const saveGrade = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // We expect the frontend to tell us if they clicked "Save Draft" or "Publish Grades"
    // If undefined, default to 'draft' to be safe.
    const { student_id, exam_type, grades, status = "draft" } = req.body;

    const validGrades = grades.filter(
      (grade) => grade.marks_obtained !== "" && grade.marks_obtained !== null,
    );

    if (validGrades.length > 0) {
      // Create a 2D array for the bulk insert
      const values = validGrades.map((grade) => [
        student_id,
        grade.course_id,
        exam_type,
        grade.marks_obtained,
        grade.total_marks,
        status, // NEW: Inserting the draft/publish status
      ]);

      const query = `
        INSERT INTO exam_grades (student_id, course_id, exam_type, marks_obtained, total_marks, status) 
        VALUES ?
        ON DUPLICATE KEY UPDATE 
          marks_obtained = VALUES(marks_obtained), 
          total_marks = VALUES(total_marks),
          status = VALUES(status)
      `;

      await connection.query(query, [values]);
    }

    await connection.commit();
    res.json({
      message: `Grades saved successfully as ${status.toUpperCase()}!`,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving grades:", error);
    res.status(500).json({ error: "Server error saving grades" });
  } finally {
    connection.release();
  }
};

export const publishAllGrades = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    // A single query updates every draft for this specific course instantly
    await db.query(
      "UPDATE exam_grades SET status = 'published' WHERE course_id = ? AND status = 'draft'",
      [courseId],
    );

    res.json({ message: "All drafts published successfully!" });
  } catch (error) {
    console.error("Error publishing all grades:", error);
    res.status(500).json({ error: "Server error publishing grades" });
  }
};

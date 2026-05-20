// controllers/facultyStudentController.js
import db from "../config/db.js";

export const getBranchStudents = async (req, res) => {
  try {
    // const facultyEmail = req.user.email;
    // if (!facultyEmail)
    //   return res
    //     .status(400)
    //     .json({ error: "Could not find Faculty Email inside the token." });

    // const [facultyRes] = await db.query(
    //   "SELECT branch_id FROM faculty WHERE email = ?",
    //   [facultyEmail],
    // );
    const facultyId = req.user.id;

    if (!facultyId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const [facultyRes] = await db.query(
      "SELECT branch_id FROM faculty WHERE faculty_id = ?",
      [facultyId],
    );
    if (facultyRes.length === 0)
      return res.status(404).json({ error: "Faculty not found" });

    const branchId = facultyRes[0].branch_id;

    const [students] = await db.query(
      `
            SELECT 
                s.id, s.enrollment_no, s.name, s.email, s.phone, s.semester, s.photo, s.status,
                b.total_sems,
                b.branch_name,
                COALESCE((SUM(eg.marks_obtained) / NULLIF(SUM(eg.total_marks), 0)) * 4.0, 0) AS gpa
            FROM students s
            LEFT JOIN exam_grades eg ON s.id = eg.student_id
            LEFT JOIN branches b ON s.branch_id = b.id
            WHERE s.branch_id = ?
            GROUP BY s.id
            ORDER BY s.semester ASC, s.enrollment_no ASC
        `,
      [branchId],
    );

    const activeStudents = students.filter((s) => s.status === "active");
    const totalEnrolled = activeStudents.length;

    const totalGpa = activeStudents.reduce(
      (sum, s) => sum + parseFloat(s.gpa),
      0,
    );
    const avgGpa =
      totalEnrolled > 0 ? (totalGpa / totalEnrolled).toFixed(2) : "0.00";

    const [retentionData] = await db.query(
      `
            SELECT SUM(CASE WHEN status != 'dropped' THEN 1 ELSE 0 END) as retained_count, COUNT(*) as total_ever_enrolled
            FROM students WHERE branch_id = ?
        `,
      [branchId],
    );

    const retentionRate =
      retentionData[0].total_ever_enrolled > 0
        ? (
            (retentionData[0].retained_count /
              retentionData[0].total_ever_enrolled) *
            100
          ).toFixed(1)
        : "100.0";

    const readinessSum = activeStudents.reduce((sum, s) => {
      const totalSems = s.total_sems || 6;
      let percent = (s.semester / totalSems) * 100;
      return sum + Math.min(percent, 100);
    }, 0);

    const gradReadiness =
      totalEnrolled > 0 ? Math.round(readinessSum / totalEnrolled) : 0;

    res.json({
      students: activeStudents,
      stats: { totalEnrolled, avgGpa, retentionRate, gradReadiness },
    });
  } catch (error) {
    console.error("Error fetching branch students:", error);
    res.status(500).json({ error: "Server error fetching students" });
  }
};

export const getStudentReport = async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1. Get the student's branch
    const [studentInfo] = await db.query(
      "SELECT branch_id FROM students WHERE id = ?",
      [studentId],
    );
    if (studentInfo.length === 0)
      return res.status(404).json({ error: "Student not found" });
    const branchId = studentInfo[0].branch_id;

    // 2. Get Overall Attendance
    const [attendance] = await db.query(
      `
            SELECT COUNT(*) as total_classes, SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_classes
            FROM attendance WHERE student_id = ?
        `,
      [studentId],
    );

    // 3. Get Overall Assignment Average
    const [assignments] = await db.query(
      `
            SELECT COUNT(id) as total_submissions, AVG(marks_obtained) as avg_marks
            FROM submissions WHERE student_id = ? AND status = 'graded'
        `,
      [studentId],
    );

    // 4. GET REAL TRANSCRIPT (Courses + Specific Grades + Specific Attendance)
    const [transcriptRaw] = await db.query(
      `
            SELECT 
                c.course_id, c.course_code, c.course_name,
                f.full_name as instructor_name,
                (SELECT SUM(marks_obtained) FROM exam_grades WHERE course_id = c.course_id AND student_id = ?) as total_marks_obtained,
                (SELECT SUM(total_marks) FROM exam_grades WHERE course_id = c.course_id AND student_id = ?) as total_max_marks,
                (SELECT COUNT(*) FROM attendance WHERE course_id = c.course_id AND student_id = ?) as total_classes,
                (SELECT SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) FROM attendance WHERE course_id = c.course_id AND student_id = ?) as present_classes
            FROM courses c
            LEFT JOIN faculty f ON c.assigned_faculty_id = f.faculty_id
            WHERE c.department_id = ? AND c.status = 'active'
        `,
      [studentId, studentId, studentId, studentId, branchId],
    );

    // Format Percentages
    let attendancePercentage = 0;
    if (attendance[0].total_classes > 0) {
      attendancePercentage = (
        (attendance[0].present_classes / attendance[0].total_classes) *
        100
      ).toFixed(2);
    }

    // Format Transcript Array
    const transcript = transcriptRaw.map((course) => {
      const gradePercent =
        course.total_max_marks > 0
          ? (
              (course.total_marks_obtained / course.total_max_marks) *
              100
            ).toFixed(1)
          : null;

      const attndPercent =
        course.total_classes > 0
          ? ((course.present_classes / course.total_classes) * 100).toFixed(1)
          : 0;

      return {
        course_code: course.course_code,
        course_name: course.course_name,
        instructor: course.instructor_name || "TBA",
        grade_percent: gradePercent,
        attendance_percent: attndPercent,
      };
    });

    res.json({
      attendance: {
        total: attendance[0].total_classes || 0,
        present: attendance[0].present_classes || 0,
        percentage: parseFloat(attendancePercentage),
      },
      assignments: {
        totalSubmitted: assignments[0].total_submissions || 0,
        averageMarks: assignments[0].avg_marks
          ? parseFloat(assignments[0].avg_marks).toFixed(2)
          : 0,
      },
      transcript, // Send the real ledger data!
    });
  } catch (error) {
    console.error("Error fetching student report:", error);
    res.status(500).json({ error: "Server error fetching student report" });
  }
};

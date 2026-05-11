import db from "../config/db.js";

export const getDegreeProgress = async (req, res) => {
  try {
    // Get student ID from the authenticated token
    const studentId = req.user?.id || req.query.student_id;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // 1. Fetch Student & Branch Information
    const [studentInfo] = await db.query(
      `SELECT s.semester as current_semester, b.branch_name, b.total_sems, b.id as branch_id 
       FROM students s 
       JOIN branches b ON s.branch_id = b.id 
       WHERE s.id = ?`,
      [studentId],
    );

    if (studentInfo.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { current_semester, branch_name, total_sems, branch_id } =
      studentInfo[0];

    // 2. Fetch All Courses for this Student's Branch
    const [courses] = await db.query(
      `SELECT course_id, course_code, course_name, credits, semester, course_type 
       FROM courses 
       WHERE department_id = ? AND status = 'active'
       ORDER BY semester ASC`,
      [branch_id],
    );

    // 3. Process Data for the UI
    let totalCredits = 0;
    let earnedCredits = 0;

    let creditAudit = {
      Core: { earned: 0, total: 0 },
      Lab: { earned: 0, total: 0 },
      Elective: { earned: 0, total: 0 },
    };

    const schematicData = {};
    const activeSemesterCourses = [];

    courses.forEach((course) => {
      const type = course.course_type || "Core";
      if (!creditAudit[type]) creditAudit[type] = { earned: 0, total: 0 };

      totalCredits += course.credits;
      creditAudit[type].total += course.credits;

      let status = "Upcoming";
      if (course.semester < current_semester) {
        status = "Completed";
        earnedCredits += course.credits;
        creditAudit[type].earned += course.credits;
      } else if (course.semester === current_semester) {
        status = "In Progress";
        activeSemesterCourses.push(course);
      }

      // Group courses by Academic Year (Sem 1 & 2 = Year 1, Sem 3 & 4 = Year 2, etc.)
      const yearNumber = Math.ceil(course.semester / 2);
      const yearLabel = `YEAR ${yearNumber}`;

      if (!schematicData[yearLabel]) {
        schematicData[yearLabel] = [];
      }

      schematicData[yearLabel].push({ ...course, status });
    });

    const totalProgress =
      totalCredits > 0 ? Math.round((earnedCredits / totalCredits) * 100) : 0;

    res.status(200).json({
      program_name: branch_name,
      current_semester,
      total_progress: totalProgress,
      credit_audit: creditAudit,
      active_courses: activeSemesterCourses,
      schematic: schematicData,
    });
  } catch (error) {
    console.error("Progress Audit Error:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch degree progress",
        error: error.message,
      });
  }
};

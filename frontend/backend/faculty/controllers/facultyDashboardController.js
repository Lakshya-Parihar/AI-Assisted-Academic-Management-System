import db from "../config/db.js";

export const getFacultyDashboardData = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // 1. Fetch Active Courses, calculate total students & syllabus progress
    const [courses] = await db.query(
      `
      SELECT 
        c.course_id as id, 
        c.course_name as title, 
        c.course_code as code,
        (SELECT COUNT(*) FROM students s WHERE s.branch_id = c.department_id AND s.semester = c.semester AND s.status = 'active') as students,
        (SELECT COUNT(*) FROM chapters ch WHERE ch.course_id = c.course_id AND ch.status = 'Completed') as completed_chapters,
        (SELECT COUNT(*) FROM chapters ch WHERE ch.course_id = c.course_id) as total_chapters
      FROM courses c 
      WHERE c.assigned_faculty_id = ? AND c.status = 'active'
    `,
      [facultyId],
    );

    let totalStudents = 0;
    const activeCourses = courses.map((c) => {
      totalStudents += c.students;
      const progress =
        c.total_chapters > 0
          ? Math.round((c.completed_chapters / c.total_chapters) * 100)
          : 0;

      return {
        id: c.id,
        title: c.title,
        code: c.code,
        students: c.students,
        nextClass: "TBD",
        progress: progress,
      };
    });

    // 2. Fetch Action Items (Pending Assignment Submissions to Grade)
    const [submissions] = await db.query(
      `
      SELECT 
        s.id, 
        a.title as task, 
        c.course_code as course, 
        a.deadline as due,
        IF(a.deadline < NOW(), 1, 0) as urgent
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.course_id
      WHERE a.faculty_id = ? AND s.status = 'submitted'
    `,
      [facultyId],
    );

    const actionItems = submissions.map((sub) => ({
      id: sub.id,
      task: `Grade: ${sub.task}`,
      course: sub.course,
      due: new Date(sub.due).toLocaleDateString(),
      urgent: sub.urgent === 1,
    }));

    // 3. Fetch Today's Schedule
    const [schedules] = await db.query(
      `
      SELECT start_time as time, course_name as event, room_no as loc
      FROM schedules 
      WHERE faculty_id = ? AND date = CURDATE()
      ORDER BY start_time ASC
    `,
      [facultyId],
    );

    const scheduleList = schedules.map((s) => ({
      time: s.time,
      event: s.event,
      loc: s.loc,
      active: true,
    }));

    // 4. Construct the Stats Matrix
    const stats = [
      {
        value: totalStudents,
        label: "Total Students",
        iconName: "Users",
        bg: "rgba(245, 158, 11, 0.15)",
        color: "#F59E0B",
        sub: "Across assigned courses",
      },
      {
        value: activeCourses.length,
        label: "Active Courses",
        iconName: "BookOpen",
        bg: "rgba(99, 102, 241, 0.15)",
        color: "#6366F1",
        sub: "Currently teaching",
      },
      {
        value: actionItems.length,
        label: "Pending Tasks",
        iconName: "CheckSquare",
        bg: "rgba(239, 68, 68, 0.15)",
        color: "#EF4444",
        sub: "Requires grading",
      },
      {
        value: scheduleList.length,
        label: "Classes Today",
        iconName: "Clock",
        bg: "rgba(16, 185, 129, 0.15)",
        color: "#10B981",
        sub: "Scheduled sessions",
      },
    ];

    // 5. Send payload back to React
    res.status(200).json({
      stats,
      activeCourses,
      actionItems,
      schedule: scheduleList,
      riskAlerts: null,
    });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

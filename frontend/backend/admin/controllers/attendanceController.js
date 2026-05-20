import db from "../config/db.js";

export const getAverageAttendance = async (req, res) => {
  try {
    const [[result]] = await db.query(`
      SELECT 
        ROUND(
          (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
          2
        ) AS avgAttendance
      FROM attendance
    `);

    res.json({ avgAttendance: result.avgAttendance || 0 });
  } catch (error) {
    console.error("Attendance Error:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

export const getMonthlyAttendance = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT 
        DATE_FORMAT(attendance_date, '%b') AS month,
        ROUND(
          (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
          0
        ) AS attendance
      FROM attendance
GROUP BY YEAR(attendance_date), MONTH(attendance_date)
ORDER BY YEAR(attendance_date), MONTH(attendance_date)
    `);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance data" });
  }
};

export const getLowAttendanceStudents = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.phone,
        s.semester,
        b.branch_name,
        ROUND(
          (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100,
          0
        ) AS attendance
      FROM students s
      JOIN attendance a ON s.id = a.student_id
      LEFT JOIN branches b ON s.branch_id = b.id
      GROUP BY s.id
      HAVING attendance < 75
      ORDER BY attendance ASC
    `);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch low attendance" });
  }
};

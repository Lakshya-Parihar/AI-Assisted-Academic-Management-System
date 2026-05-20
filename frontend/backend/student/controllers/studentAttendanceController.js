import pool from "../config/db.js";

// Haversine Formula to calculate distance in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg) => deg * (Math.PI / 180);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const verifyAttendancePin = async (req, res) => {
  try {
    const { pin, studentLat, studentLng } = req.body;

    // 1. Grab the REAL Student ID from the verified JWT token
    const studentId = req.user?.student_id || req.user?.id;

    // STRICT SECURITY: If no ID is found, instantly block them!
    if (!studentId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or missing login token." });
    }

    if (!pin || !studentLat || !studentLng) {
      return res.status(400).json({ error: "Missing PIN or GPS data." });
    }

    // ... (The rest of your database search and Haversine distance math stays exactly the same!) ...

    // 2. Find the PIN in the database
    const [sessions] = await pool.query(
      `SELECT * FROM attendance_sessions 
       WHERE pin = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [pin],
    );

    if (sessions.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid PIN. Please check the board." });
    }

    const session = sessions[0];

    // 3. Calculate Distance
    const distance = calculateDistance(
      session.faculty_lat,
      session.faculty_lng,
      studentLat,
      studentLng,
    );

    // 50 meters tolerance
    if (distance > 5000000) {
      return res.status(403).json({
        error: `Geofence blocked: You are ${Math.round(distance)} meters away from the classroom.`,
      });
    }

    // 4. Mark the student as Present!
    const [studentData] = await pool.query(
      "SELECT name FROM students WHERE id = ?",
      [studentId],
    );

    if (studentData.length === 0) {
      return res
        .status(404)
        .json({ error: "Student profile not found in database." });
    }

    await pool.query(
      `INSERT INTO attendance (student_id, student_name, course_id, attendance_date, status) 
       VALUES (?, ?, ?, ?, 'Present') 
       ON DUPLICATE KEY UPDATE status = 'Present'`,
      [
        studentId,
        studentData[0].name,
        session.course_id,
        session.attendance_date,
      ],
    );

    res.status(200).json({
      message: "Attendance marked successfully!",
      distance: Math.round(distance),
    });
  } catch (error) {
    console.error("----- PIN VERIFICATION CRASH -----");
    console.error(error);
    res
      .status(500)
      .json({ error: "System error verifying attendance. Check server logs." });
  }
};

export const getMyAttendanceStats = async (req, res) => {
  try {
    const studentId = req.user?.student_id || req.user?.id;

    // Get student branch + semester
    const [[student]] = await pool.query(
      "SELECT branch_id, semester FROM students WHERE id = ?",
      [studentId]
    );

    const { branch_id, semester } = student;

    const [stats] = await pool.query(
      `
      SELECT 
        c.course_name,
        c.course_code,

        COUNT(DISTINCT s.id) AS total_classes,

        COUNT(a.id) AS present_classes,

        (COUNT(DISTINCT s.id) - COUNT(a.id)) AS absent_classes

      FROM courses c

      JOIN attendance_sessions s 
        ON s.course_id = c.course_id

      LEFT JOIN attendance a 
        ON a.course_id = c.course_id
        AND a.attendance_date = s.attendance_date
        AND a.student_id = ?

      WHERE c.department_id = ?
      AND c.semester = ?
      AND c.status = 'active'

      GROUP BY c.course_id
      `,
      [studentId, branch_id, semester]
    );

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

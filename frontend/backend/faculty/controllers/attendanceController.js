import pool from "../config/db.js";

// import pool from "../config/db.js";

// 1. Get ONLY the branch assigned to the faculty member[cite: 19]
export const getBranches = async (req, res) => {
  try {
    const facultyId = req.user.id; // Decoded from JWT
    const [branches] = await pool.query(
      `SELECT b.id, b.branch_name, b.branch_code 
       FROM branches b
       JOIN faculty f ON f.branch_id = b.id
       WHERE f.faculty_id = ? AND b.status = 'active'`,
      [facultyId]
    );
    res.status(200).json(branches);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to fetch authorized branch" });
  }
};

// 2. Get Courses restricted to the faculty's branch and semester[cite: 19]
export const getCourses = async (req, res) => {
  const { branch_id, semester } = req.query;
  const facultyId = req.user.id; 

  try {
    // Verification using correct column: faculty_id
    const [check] = await pool.query(
      "SELECT branch_id FROM faculty WHERE faculty_id = ?", 
      [facultyId]
    );

    if (check.length === 0 || check[0].branch_id != branch_id) {
        return res.status(403).json({ error: "Unauthorized access to this branch" });
    }

    // Fetch using correct column: department_id
    const [courses] = await pool.query(
      "SELECT course_id, course_name, course_code FROM courses WHERE department_id = ? AND semester = ? AND status = 'active'",
      [branch_id, semester],
    );
    res.status(200).json(courses);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};


// 3. Get Student Roster (with Attendance Status)
export const getRoster = async (req, res) => {
  const { course_id, date } = req.query;

  if (!course_id || !date) {
    return res.status(400).json({ error: "Course ID and Date are required." });
  }

  try {
    const [students] = await pool.query(
      `
    SELECT 
        s.id as student_id,
        s.name,
        s.enrollment_no,
        COALESCE(a.status, 'Absent') as current_status
    FROM students s
    JOIN courses c ON s.branch_id = c.department_id AND s.semester = c.semester
    LEFT JOIN attendance a 
        ON s.id = a.student_id 
        AND a.course_id = c.course_id 
        AND a.attendance_date = ?
    WHERE c.course_id = ? 
      AND s.status = 'active'
    ORDER BY s.enrollment_no ASC
`,
      [date, course_id],
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Database error fetching roster:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch roster. Check backend console." });
  }
};

// 4. Save Attendance
export const saveAttendance = async (req, res) => {
  const { course_id, date, attendance_records } = req.body;
  try {
    const values = attendance_records.map((r) => [
      r.student_id,
      r.name,
      course_id,
      date,
      r.status,
    ]);

    const query = `
        INSERT INTO attendance (student_id, student_name, course_id, attendance_date, status) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE 
            status = VALUES(status),
            student_name = VALUES(student_name)
    `;

    await pool.query(query, [values]);
    res.status(200).json({ message: "Attendance Saved Successfully!" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};

// 5. GENERATE GEOFENCED PIN
export const generatePin = async (req, res) => {
  try {
    const { course_id, date, lat, lng } = req.body;

    // Validate incoming data
    if (!course_id || !date || !lat || !lng) {
      return res
        .status(400)
        .json({ error: "Missing required location or course data." });
    }

    // Generate a random 4-digit PIN (between 1000 and 9999)
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    // Insert into the database with a 2-minute expiration window
    await pool.query(
      `INSERT INTO attendance_sessions 
        (course_id, attendance_date, pin, faculty_lat, faculty_lng, expires_at) 
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 2 MINUTE))`,
      [course_id, date, pin, lat, lng],
    );

    // Send the PIN back to the projector/faculty screen
    res.status(200).json({
      message: "PIN Generated Successfully",
      pin: pin,
    });
  } catch (error) {
    console.error("Generate PIN Error:", error);
    res.status(500).json({ error: "System error generating secure PIN." });
  }
};
// --- NEW: Save and explicitly lock Present/Absent records into the DB ---
export const saveAttendanceRecords = async (req, res) => {
  try {
    const { course_id, date, attendance_records } = req.body;

    if (!course_id || !date || !attendance_records) {
      return res.status(400).json({ error: "Missing required data." });
    }

    // Loop through the roster and explicitly write EVERY student to the database
    for (const student of attendance_records) {
      await pool.query(
        `INSERT INTO attendance (student_id, student_name, course_id, attendance_date, status) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE status = ?`,
        [
          student.student_id, 
          student.name, 
          course_id, 
          date, 
          student.status,  // Writes 'Present' or 'Absent' based on their live status
          student.status   // Updates it if a record already exists
        ]
      );
    }

    res.status(200).json({ message: "Attendance explicitly locked and saved!" });
  } catch (error) {
    console.error("----- SAVE ATTENDANCE CRASH -----", error);
    res.status(500).json({ error: "Failed to save attendance records to database." });
  }
};

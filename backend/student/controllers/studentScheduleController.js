import db from "../config/db.js";
import fs from "fs";

// 🔥 HELPER: Bulletproof Student ID Extractor
// If the token is missing the ID, it safely fetches it using the email!
const getStudentId = async (req) => {
  const user = req.user || req.student || {};
  let id = user.id || user.student_id || user.studentId;

  // Fallback: Fetch ID from database using email
  if (!id && user.email) {
    const [rows] = await db.query("SELECT id FROM students WHERE email = ?", [
      user.email,
    ]);
    if (rows.length > 0) id = rows[0].id;
  }
  return id;
};

// 1. Fetch the entire schedule for the student
export const getSchedule = async (req, res) => {
  try {
    const studentId = await getStudentId(req);
    if (!studentId)
      return res.status(401).json({ error: "Student ID missing." });

    const [schedule] = await db.query(
      "SELECT * FROM student_schedules WHERE student_id = ? ORDER BY start_time ASC",
      [studentId],
    );
    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule." });
  }
};

// 2. Add a custom event (is_imported = 0)
export const addCustomEvent = async (req, res) => {
  try {
    const studentId = await getStudentId(req);
    if (!studentId)
      return res.status(401).json({ error: "Student ID missing." });

    const {
      title,
      event_type,
      day_of_week,
      start_time,
      end_time,
      room,
      instructor,
    } = req.body;

    await db.query(
      `INSERT INTO student_schedules (student_id, title, event_type, day_of_week, start_time, end_time, room, instructor, is_imported) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        studentId,
        title,
        event_type || "STUDY",
        day_of_week,
        start_time,
        end_time,
        room,
        instructor,
      ],
    );

    res.status(201).json({ message: "Custom event added successfully!" });
  } catch (error) {
    console.error("Error adding custom event:", error);
    res.status(500).json({ error: "Failed to add custom event." });
  }
};

// 3. Upload and Parse College CSV
export const uploadTimetableCsv = async (req, res) => {
  try {
    const studentId = await getStudentId(req);

    if (!studentId) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Could not find Student ID." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded." });
    }

    // Read the file manually
    const csvData = fs.readFileSync(req.file.path, "utf8");
    const rows = csvData.split(/\r?\n/);

    // First, DELETE all old *imported* classes
    await db.query(
      "DELETE FROM student_schedules WHERE student_id = ? AND is_imported = 1",
      [studentId],
    );

    // Loop through CSV rows (skipping the header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.trim() === "") continue;

      const cols = row.split(",");
      if (cols.length >= 7) {
        await db.query(
          `INSERT INTO student_schedules (student_id, title, event_type, day_of_week, start_time, end_time, room, instructor, is_imported) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            studentId,
            cols[0].replace(/"/g, "").trim(),
            cols[1].replace(/"/g, "").trim(),
            cols[2].replace(/"/g, "").trim(),
            cols[3].replace(/"/g, "").trim(),
            cols[4].replace(/"/g, "").trim(),
            cols[5].replace(/"/g, "").trim(),
            cols[6].replace(/"/g, "").trim(),
          ],
        );
      }
    }

    // Clean up the uploaded file from the server
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Timetable imported successfully!" });
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).json({ error: "Failed to process CSV file." });
  }
};
// 4. Fetch dynamic course details based on Timetable Title
export const getCourseProgress = async (req, res) => {
  try {
    const { courseName } = req.body;

    // 1. Find the matching course ID using the course name from the schedule
    const [courseRows] = await db.query(
      "SELECT course_id, course_code, description FROM courses WHERE course_name = ?",
      [courseName.trim()],
    );

    if (courseRows.length === 0) {
      return res.json({
        found: false,
        message: "Detailed syllabus not mapped for this course yet.",
      });
    }

    const courseId = courseRows[0].course_id;

    // 2. Fetch the chapters for this course to calculate progress
    const [chapters] = await db.query(
      "SELECT * FROM chapters WHERE course_id = ? ORDER BY id ASC",
      [courseId],
    );

    const total = chapters.length;
    const completed = chapters.filter((c) => c.status === "Completed").length;
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Find the next 2 pending topics
    const nextTopics = chapters
      .filter((c) => c.status === "Pending" || c.status === "In Progress")
      .slice(0, 2);

    res.json({
      found: true,
      courseCode: courseRows[0].course_code,
      description: courseRows[0].description,
      totalChapters: total,
      completedChapters: completed,
      progressPct: progressPct,
      nextTopics: nextTopics,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ error: "Failed to fetch course details." });
  }
};

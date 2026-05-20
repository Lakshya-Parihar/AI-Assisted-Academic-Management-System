import db from "../config/db.js";
import fs from "fs";
import csvParser from "csv-parser";
import multer from "multer";
import path from "path";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

export const upload = multer({ storage: storage });

export const getFacultySchedule = async (req, res) => {
  try {
    const { date, faculty_id } = req.query;
    if (!date || !faculty_id)
      return res.status(400).json({ message: "Missing params" });
    const [rows] = await db.query(
      "SELECT * FROM schedules WHERE faculty_id = ? AND date = ? ORDER BY start_time ASC",
      [faculty_id, date],
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Database Error", error: error.message });
  }
};

export const getFacultyScheduleRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate)
      return res.status(400).json({ message: "Missing range parameters" });

    const query = `
      SELECT id, faculty_id, course_id, date, start_time, end_time, class_type, course_name, course_code, semester, room_no, student_count, status 
      FROM schedules 
      WHERE date BETWEEN ? AND ?
      ORDER BY date ASC, start_time ASC
    `;

    const [rows] = await db.query(query, [startDate, endDate]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Database Error", error: error.message });
  }
};

export const addSchedule = async (req, res) => {
  try {
    const {
      faculty_id,
      course_id,
      date,
      start_time,
      end_time,
      class_type,
      course_name,
      course_code,
      semester,
      room_no,
      student_count,
    } = req.body;
    const query = `INSERT INTO schedules (faculty_id, course_id, date, start_time, end_time, class_type, course_name, course_code, semester, room_no, student_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming')`;
    const [result] = await db.query(query, [
      faculty_id,
      course_id,
      date,
      start_time,
      end_time,
      class_type || "Lecture",
      course_name,
      course_code,
      semester || 1,
      room_no,
      student_count || 0,
    ]);
    res
      .status(201)
      .json({ message: "Added successfully", id: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding schedule", details: error.sqlMessage });
  }
};

export const getFacultyCourses = async (req, res) => {
  try {
    const { faculty_id } = req.query;
    if (!faculty_id)
      return res.status(400).json({ message: "Faculty ID is required" });
    const [rows] = await db.query(
      "SELECT course_id, course_code, course_name, semester FROM courses WHERE assigned_faculty_id = ? AND status = 'active'",
      [faculty_id],
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses from database" });
  }
};

// --- UPDATED CSV IMPORT LOGIC ---
export const importScheduleCSV = async (req, res) => {
  try {
    const faculty_id = req.body.faculty_id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded." });
    if (!faculty_id)
      return res.status(400).json({ message: "Faculty ID is missing." });

    const results = [];
    const uploadPath = file.path;

    await new Promise((resolve, reject) => {
      fs.createReadStream(uploadPath)
        .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))
        .on("data", (data) => {
          if (Object.keys(data).length > 0 && data.course_code)
            results.push(data);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    let successCount = 0;
    let errorList = [];

    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      try {
        const courseCode = row.course_code ? row.course_code.trim() : null;
        if (!courseCode) throw new Error("Missing course_code in CSV");

        const [courseCheck] = await db.query(
          "SELECT course_id, assigned_faculty_id FROM courses WHERE course_code = ? LIMIT 1",
          [courseCode],
        );

        if (courseCheck.length === 0)
          throw new Error(`Course code '${courseCode}' not found in database.`);

        // --- THE FIX ---
        // Instead of rejecting it, we assign the class to whoever is listed as the teacher in the database!
        // If the database says no one is assigned yet, it defaults to the person uploading it.
        const actual_faculty_id =
          courseCheck[0].assigned_faculty_id || faculty_id;
        const course_id = courseCheck[0].course_id;

        const query = `INSERT INTO schedules (faculty_id, course_id, date, start_time, end_time, class_type, course_name, course_code, semester, room_no, student_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming')`;

        await db.query(query, [
          actual_faculty_id,
          course_id,
          row.date?.trim(),
          row.start_time?.trim(),
          row.end_time?.trim(),
          row.class_type?.trim() || "Lecture",
          row.course_name?.trim() || "",
          courseCode,
          row.semester || 1,
          row.room_no?.trim() || "TBD",
          row.student_count || 0,
        ]);

        successCount++;
      } catch (rowError) {
        errorList.push(
          `Row ${i + 1} (${row.course_code || "Unknown"}): ${rowError.message}`,
        );
      }
    }

    if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);

    if (successCount === 0 && errorList.length > 0) {
      return res
        .status(400)
        .json({
          message: "All rows failed to import.",
          details: errorList.join(" | "),
        });
    }

    res.status(200).json({
      message: `Successfully imported ${successCount} classes! ${errorList.length > 0 ? `(Skipped ${errorList.length} rows with errors)` : ""}`,
      errorList: errorList,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ message: "Server error during import", details: error.message });
  }
};

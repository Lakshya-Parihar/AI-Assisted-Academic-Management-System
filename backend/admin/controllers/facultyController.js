import bcrypt from "bcryptjs";
import db from "../config/db.js";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";

// --- ADD FACULTY ---
export const addFaculty = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // ✅ STORE ONLY FILENAMES (same as student)
    const photo = req.files?.profile_photo?.[0]?.filename || null;
    const resume = req.files?.resume_file?.[0]?.filename || null;

    const sql = `
      INSERT INTO faculty (
        full_name, email, password, phone_number, gender, dob,
        city, state, branch_id,
        designation, qualification, specialization,
        experience_years, joining_date,
        profile_photo, resume_file,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    `;

    const values = [
      req.body.full_name,
      req.body.email,
      hashedPassword,
      req.body.phone_number,
      req.body.gender,
      req.body.dob,
      req.body.city,
      req.body.state,
      req.body.branch_id,
      req.body.designation,
      req.body.qualification,
      req.body.specialization,
      req.body.experience_years || 0,
      req.body.joining_date,
      photo,
      resume,
    ];

    await db.query(sql, values);

    res.json({ message: "Faculty added successfully" });
  } catch (err) {
    console.error("Add faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const sql = `
      SELECT
        f.faculty_id,
        f.full_name,
        f.email,
        f.phone_number,
        f.gender,
        f.dob,
        f.city,
        f.state,
        f.branch_id,
        f.designation,
        f.qualification,
        f.specialization,
        f.experience_years,
        f.joining_date,
        f.status,
        b.branch_name,

        -- FULL PHOTO URL
        CASE
          WHEN f.profile_photo IS NOT NULL
          THEN CONCAT('http://localhost:5000/uploads/faculty/photos/', f.profile_photo)
          ELSE NULL
        END AS profile_photo,

        -- FULL RESUME URL
        CASE
          WHEN f.resume_file IS NOT NULL
          THEN CONCAT('http://localhost:5000/uploads/faculty/resumes/', f.resume_file)
          ELSE NULL
        END AS resume_file

      FROM faculty f
      LEFT JOIN branches b ON b.id = f.branch_id
      ORDER BY f.faculty_id DESC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch faculty error:", err);
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
};

/* =========================
   UPDATE FACULTY
========================= */
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = { ...req.body };

    // 🚫 Never trust body for files
    delete updatedData.profile_photo;
    delete updatedData.resume_file;

    // ✅ Profile photo update
    if (req.files?.profile_photo?.[0]) {
      updatedData.profile_photo = req.files.profile_photo[0].filename;
    }

    // ✅ Resume update
    if (req.files?.resume_file?.[0]) {
      updatedData.resume_file = req.files.resume_file[0].filename;
    }

    const sql = "UPDATE faculty SET ? WHERE faculty_id = ?";
    await db.query(sql, [updatedData, id]);

    res.json({ message: "Faculty updated successfully" });
  } catch (err) {
    console.error("Update faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE FACULTY
========================= */
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM faculty WHERE faculty_id=?", [id]);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("Delete faculty error:", err);
    res.status(500).json({ message: "Failed to delete faculty" });
  }
};

// --- GET FACULTY COUNT ---
export const getFacultyCount = async (req, res) => {
  try {
    const [[result]] = await db.query(
      "SELECT COUNT(*) AS totalFaculties FROM faculty",
    );

    res.json({ totalFaculties: result.totalFaculties });
  } catch (err) {
    console.error("Faculty:", err);
    res.status(500).json({ message: "Failed to fetch faculty count" });
  }
};

// --- GET BRANCHES FOR EDIT MODAL --- //

export const getFacultyBranches = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT branch_id, branch_name FROM branches",
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch branches error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const bulkUploadFaculty = async (req, res) => {
//   try {
//     const zipPath = req.file.path;
//     const zip = new AdmZip(zipPath);
//     const extractPath = `uploads/extracted_${Date.now()}`;
//     zip.extractAllTo(extractPath, true);

//     // 📄 Read CSV
//     let csvPath = path.join(extractPath, "faculty.csv");

//     // handle nested zip
//     if (!fs.existsSync(csvPath)) {
//       const folders = fs.readdirSync(extractPath);
//       for (let folder of folders) {
//         const possible = path.join(extractPath, folder, "faculty.csv");
//         if (fs.existsSync(possible)) {
//           csvPath = possible;
//           break;
//         }
//       }
//     }

//     if (!fs.existsSync(csvPath)) {
//       throw new Error("faculty.csv not found");
//     }

//     const workbook = xlsx.readFile(csvPath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const facultyList = xlsx.utils.sheet_to_json(sheet);

//     for (let faculty of facultyList) {
//       // 🔐 HASH PASSWORD FROM CSV
//       const hashedPassword = await bcrypt.hash(faculty.password, 10);

//       // 📁 File paths
//       const photoPath = path.join(extractPath, "photos", faculty.profile_photo || "");
//       const resumePath = path.join(extractPath, "resume", faculty.resume_file || "");

//       // 📁 Ensure folders exist
//       fs.mkdirSync("uploads/faculty/photos", { recursive: true });
//       fs.mkdirSync("uploads/faculty/resumes", { recursive: true });

//       // 📁 Copy files
//       if (faculty.profile_photo && fs.existsSync(photoPath)) {
//         fs.copyFileSync(photoPath, `uploads/faculty/photos/${faculty.profile_photo}`);
//       }

//       if (faculty.resume_file && fs.existsSync(resumePath)) {
//         fs.copyFileSync(resumePath, `uploads/faculty/resumes/${faculty.resume_file}`);
//       }

//       // 💾 Insert (same as your addFaculty)
//       await db.query(
//         `INSERT INTO faculty (
//           full_name, email, password, phone_number, gender, dob,
//           city, state, branch_id,
//           designation, qualification, specialization,
//           experience_years, joining_date,
//           profile_photo, resume_file,
//           status
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
//         [
//           faculty.full_name,
//           faculty.email,
//           hashedPassword,
//           faculty.phone_number,
//           faculty.gender,
//           faculty.dob,
//           faculty.city,
//           faculty.state,
//           faculty.branch_id,
//           faculty.designation,
//           faculty.qualification,
//           faculty.specialization,
//           faculty.experience_years || 0,
//           faculty.joining_date,
//           faculty.profile_photo,
//           faculty.resume_file,
//         ]
//       );
//     }

//     fs.rmSync(extractPath, { recursive: true, force: true });
//     fs.unlinkSync(zipPath);

//     res.json({ message: "Bulk faculty upload successful" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Bulk upload failed" });
//   }
// };

export const bulkUploadFaculty = async (req, res) => {
  let extractPath = "";

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No ZIP file uploaded" });
    }

    const zipPath = req.file.path;
    const zip = new AdmZip(zipPath);

    extractPath = `uploads/extracted_${Date.now()}`;
    zip.extractAllTo(extractPath, true);

    // 📄 Find CSV (supports nested zip)
    const findCsv = (dir) => {
      const files = fs.readdirSync(dir);

      for (let file of files) {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
          const found = findCsv(fullPath);
          if (found) return found;
        } else if (file === "faculty.csv") {
          return fullPath;
        }
      }
      return null;
    };

    const csvPath = findCsv(extractPath);

    if (!csvPath) {
      return res.status(400).json({ message: "faculty.csv not found in ZIP" });
    }

    const workbook = xlsx.readFile(csvPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const facultyList = xlsx.utils.sheet_to_json(sheet);

    let successCount = 0;
    let errors = [];

    // 📁 Ensure folders exist once
    fs.mkdirSync("uploads/faculty/photos", { recursive: true });
    fs.mkdirSync("uploads/faculty/resumes", { recursive: true });

    for (let faculty of facultyList) {
      try {
        // 🔍 VALIDATION
        if (!faculty.email || !faculty.full_name) {
          errors.push({
            email: faculty.email || "N/A",
            error: "Missing required fields",
          });
          continue;
        }

        // 🔁 DUPLICATE CHECK
        const [existing] = await db.query(
          "SELECT faculty_id FROM faculty WHERE email=?",
          [faculty.email],
        );

        if (existing.length > 0) {
          errors.push({
            email: faculty.email,
            error: "Email already exists",
          });
          continue;
        }

        // 🔐 Password handling
        if (!faculty.password) {
          errors.push({
            email: faculty.email || "N/A",
            error: "Password missing",
          });
          continue;
        }

        const hashedPassword = await bcrypt.hash(faculty.password, 10);

        // 📁 File paths
        const photoPath = path.join(
          extractPath,
          "photos",
          faculty.profile_photo || "",
        );

        const resumePath = path.join(
          extractPath,
          "resume",
          faculty.resume_file || "",
        );

        // ⚠️ Log missing files (optional but useful)
        if (faculty.profile_photo && !fs.existsSync(photoPath)) {
          console.warn(`Missing photo for ${faculty.email}`);
        }

        if (faculty.resume_file && !fs.existsSync(resumePath)) {
          console.warn(`Missing resume for ${faculty.email}`);
        }

        // 📂 Copy files
        if (faculty.profile_photo && fs.existsSync(photoPath)) {
          await fs.promises.copyFile(
            photoPath,
            `uploads/faculty/photos/${faculty.profile_photo}`,
          );
        }

        if (faculty.resume_file && fs.existsSync(resumePath)) {
          await fs.promises.copyFile(
            resumePath,
            `uploads/faculty/resumes/${faculty.resume_file}`,
          );
        }

        // 💾 Insert into DB
        await db.query(
          `INSERT INTO faculty (
            full_name, email, password, phone_number, gender, dob,
            city, state, branch_id,
            designation, qualification, specialization,
            experience_years, joining_date,
            profile_photo, resume_file,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
          [
            faculty.full_name,
            faculty.email,
            hashedPassword,
            faculty.phone_number || null,
            faculty.gender || "Male",
            faculty.dob || null,
            faculty.city || null,
            faculty.state || null,
            faculty.branch_id || null,
            faculty.designation || null,
            faculty.qualification || null,
            faculty.specialization || null,
            faculty.experience_years || 0,
            faculty.joining_date || null,
            faculty.profile_photo || null,
            faculty.resume_file || null,
          ],
        );

        successCount++;
      } catch (err) {
        errors.push({
          email: faculty.email || "N/A",
          error: err.message,
        });
      }
    }

    // ❌ If nothing inserted
    if (successCount === 0) {
      return res.status(400).json({
        message: "No faculty uploaded. All records may already exist.",
        errors,
      });
    }

    // ✅ Success response
    res.json({
      message: `Upload complete. ${successCount} faculty added successfully.`,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (err) {
    console.error("Bulk faculty error:", err);
    res.status(500).json({ message: "Bulk upload failed" });
  } finally {
    // 🧹 CLEANUP
    try {
      if (extractPath && fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
  }
};

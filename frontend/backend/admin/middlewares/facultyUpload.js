import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_photo") {
      cb(null, "uploads/faculty/photos");
    } else if (file.fieldname === "resume_file") {
      cb(null, "uploads/faculty/resumes");
    } else {
      cb(null, "uploads/faculty");
    }
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const facultyUpload = multer({ storage });

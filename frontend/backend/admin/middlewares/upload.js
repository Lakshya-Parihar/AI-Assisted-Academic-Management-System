import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === "photo")
      cb(null, "uploads/photos");

    else if (file.fieldname === "aadhar_file")
      cb(null, "uploads/aadhar");

    else if (file.fieldname === "leaving_file")
      cb(null, "uploads/leaving");

    else if (file.fieldname === "profile_photo")
      cb(null, "uploads/admin");

  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
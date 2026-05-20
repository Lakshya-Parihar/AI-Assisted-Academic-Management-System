import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminProfileRoutes from "./routes/adminProfile.js";
import studentRoutes from "./routes/studentRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import adminCertificateRoutes from "./routes/adminCertificateRoutes.js";

const app = express();

// required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// expose uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminProfileRoutes);

// all student related routes:
//  POST /api/admin/students
//  GET  /api/admin/students
app.use("/api/admin/", studentRoutes);
app.use("/api/admin/", branchRoutes);
app.use("/api/admin/", courseRoutes);
app.use("/api/admin/", collegeRoutes);
app.get("/", (req, res) => {
  res.send("Admin API running");
});

app.use("/uploads", express.static("uploads"));
app.use("/api/admin", facultyRoutes);

app.use("/api/admin/fees", feesRoutes);
app.use("/api/admin/", attendanceRoutes);
app.use("/api/admin/certificates", adminCertificateRoutes);

app.listen(5000, () => {
  console.log("Admin service running on port 5000");
});

  
import "dotenv/config"; // MUST BE THE VERY FIRST LINE
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Notice we removed the other dotenv imports and dotenv.config() setup!

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import facultyAuthRoutes from "./routes/facultyAuth.js";
import facultyDashboardRoutes from "./routes/facultyDashboardRoutes.js";
import courseFaculty from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import facultyProfileRoutes from "./routes/facultyProfileRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import facultyAnalyticsRoutes from "./routes/facultyAnalyticsRoutes.js";
import facultyStudentRoutes from "./routes/facultyStudentRoutes.js";
import materialsRoutes from "./routes/materialsRoutes.js";
import facultyQuizRoutes from "./routes/facultyQuizRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import facultyGradesRoutes from "./routes/facultyGradesRoutes.js";
import facultyCircularsRoutes from "./routes/facultyCircularsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔥 FACULTY ROUTES
app.use("/api/faculty/auth", facultyAuthRoutes);
app.use("/api/faculty/dashboard", facultyDashboardRoutes);
app.use("/api/faculty/courses", courseFaculty);
app.use("/api/faculty/assignments", assignmentRoutes);
app.use("/api/faculty/attendance", attendanceRoutes);
app.use("/api/faculty", facultyProfileRoutes);
app.use("/api/faculty/analytics", facultyAnalyticsRoutes);
app.use("/api/faculty", facultyStudentRoutes);
app.use("/api/faculty/materials", materialsRoutes);
app.use("/api/faculty/quizzes", facultyQuizRoutes);
app.use("/api/faculty/schedule", scheduleRoutes);
app.use("/api/faculty/grades", facultyGradesRoutes);
app.use("/api/faculty/circulars", facultyCircularsRoutes);

// Pull the PORT from the .env file, fallback to 5002 if missing
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

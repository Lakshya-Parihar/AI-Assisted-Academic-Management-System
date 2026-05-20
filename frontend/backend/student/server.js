import express from "express";
import cors from "cors";
import path from "path";

import studentAuthRoutes from "./routes/studentAuth.js";
import studentFeesRoutes from "./routes/studentFeesRoutes.js";
import studentAttendanceRoutes from "./routes/studentAttendanceRoutes.js";
import studentAssignmentRoutes from "./routes/studentAssignmentRoutes.js";
import studentNexusRoutes from "./routes/studentNexusRoutes.js";
import studentLearningRoutes from "./routes/studentLearningRoutes.js";
import studentCertificateRoutes from "./routes/studentCertificatesRoutes.js";
import studentPerformanceRoutes from "./routes/studentPerformanceRoutes.js";
import studentCircularRoutes from "./routes/studentCircularRoutes.js";
import studentScheduleRoutes from "./routes/studentScheduleRoutes.js";
import studentDegreeRoutes from "./routes/studentDegreeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// student auth routes
app.use("/api/student/auth", studentAuthRoutes);

app.use("/api/student/fees", studentFeesRoutes);

// student attendance routes
app.use("/api/student", studentAttendanceRoutes);

// student assignment routes
app.use("/api/student/assignments", studentAssignmentRoutes);

app.use("/api/student/nexus", studentNexusRoutes);

app.use("/api/student/certificates", studentCertificateRoutes);

app.use("/api/student", studentLearningRoutes);

app.use("/api/student", studentPerformanceRoutes);

app.use("/api/student/circulars", studentCircularRoutes);

app.use("/api/student/schedule", studentScheduleRoutes);

app.use("/api/student/degree", studentDegreeRoutes);



const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🎓 Student service running on port ${PORT}`);
});

 
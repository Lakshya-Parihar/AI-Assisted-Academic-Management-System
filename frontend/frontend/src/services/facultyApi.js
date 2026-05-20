import axios from "axios";

const facultyApi = axios.create({
  baseURL: "http://localhost:5002/api/faculty",
});

/* =========================
   ATTACH TOKEN AUTOMATICALLY
========================= */
facultyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("facultyToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   FACULTY PROFILE API
========================= */

// 🔥 Fetch current faculty profile (name + profile_photo)
export const getFacultyProfile = () => {
  return facultyApi.get("/profile");
};

/* =========================
   STUDENTS API
========================= */

// 🔥 Fetch all students belonging to the logged-in faculty's branch
export const getFacultyStudents = () => {
  return facultyApi.get("/my-students");
};

// 🔥 Fetch academic report (attendance & assignments) for a specific student
export const getStudentReport = (studentId) => {
  return facultyApi.get(`/student/${studentId}/report`);
};

/* =========================
   GRADES API
========================= */
export const getGradesData = () => {
  return facultyApi.get("/grades/data");
};

export const saveStudentGrade = (gradeData) => {
  return facultyApi.post("/grades/save", gradeData);
};

export const publishAllCourseGrades = (data) => {
  return facultyApi.put("/grades/publish-all", data);
};

/* =========================
   ANALYTICS, DASHBOARD & AI API
========================= */
export const getStudentAIAnalysis = (studentId) => {
  return facultyApi.get(`/analytics/student/${studentId}`);
};

// ✅ UPDATED: Fetch Faculty Dashboard Data (Only declared once now!)
export const getFacultyDashboardData = (facultyId) => {
  return facultyApi.get(`/dashboard/${facultyId}`);
};

// 🔥 NEW: Fetch KPIs for the Analytics page
export const getAnalyticsKPIs = () => {
  return facultyApi.get(`/analytics/kpi-data`);
};

export const sendAcademicWarningEmail = (payload) => {
  return facultyApi.post("/analytics/send-warning", payload);
};

/* =========================
   MATERIALS MANAGEMENT API
========================= */

export const getFacultyCourses = () => {
  return facultyApi.get("/courses");
};

export const getMaterialStats = () => {
  return facultyApi.get("/materials/stats");
};

export const getAllMaterials = () => {
  return facultyApi.get("/materials");
};

// ✅ UPDATED: Removed explicit headers so the browser sets the boundary automatically
export const uploadMaterial = (formData) => {
  return facultyApi.post("/materials/upload", formData);
};

export const trackMaterialDownload = (id) => {
  return facultyApi.put(`/materials/${id}/download`);
};

export const deleteMaterial = (id) => {
  return facultyApi.delete(`/materials/${id}`);
};

/* =========================
   QUIZ BUILDER API 
========================= */
export const getQuizBuilderData = () => {
  return facultyApi.get("/quizzes/data");
};

export const createNewQuiz = (data) => {
  return facultyApi.post("/quizzes/create", data);
};

/* =========================
   SCHEDULE API
========================= */
// Fetch the daily schedule
export const getFacultyScheduleData = (date, facultyId) => {
  return facultyApi.get(`/schedule?date=${date}&faculty_id=${facultyId}`);
};

// Fetch schedule data for a week or custom range
export const getFacultyScheduleRangeData = (startDate, endDate, facultyId) => {
  return facultyApi.get(
    `/schedule/get-range?startDate=${startDate}&endDate=${endDate}&faculty_id=${facultyId}`,
  );
};

export const getAssignedCourses = (facultyId) => {
  return facultyApi.get(`/schedule/my-courses?faculty_id=${facultyId}`);
};

// Add a new class to the schedule
export const createSchedule = (scheduleData) => {
  return facultyApi.post("/schedule", scheduleData);
};

// Import schedule from CSV
export const importScheduleCSVData = (formData) => {
  return facultyApi.post("/schedule/import-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================
   CIRCULARS API
========================= */
export const publishCircular = (formData) => {
  return facultyApi.post("/circulars/publish", formData);
};

export default facultyApi;

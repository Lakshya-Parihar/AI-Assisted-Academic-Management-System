import axios from "axios";

const studentApi = axios.create({
  baseURL: "http://localhost:5001/api/student",
});

export const getStudentProfile = () => {
  return studentApi.get("/auth/profile");
};

export const changePassword = (data) => {
  return studentApi.put("/auth/change-password", data);
};

export const getMyFees = () => {
  return studentApi.get("/fees/my-fees");
};

// UPDATED: Now accepts a 'data' object containing the payment amount
export const payFees = (id, data) => {
  return studentApi.put(`/fees/pay/${id}`, data);
};

export const getPaymentHistory = () => studentApi.get("/fees/history");

export const getAttendanceStats = () => {
  return studentApi.get("/attendance/stats");
};

// export const submitAssignment = (data) => {
//   return studentApi.post("/assignments/submit", data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };

// export const getAssignments = () => {
//   return studentApi.get("/assignments");
// };

export const getMyCourses = () => {
  return studentApi.get("/assignments/courses");
};

export const getMyAssignments = () => {
  return studentApi.get("/assignments");
};

export const submitAssignment = (assignmentId, formData) => {
  return studentApi.post(`/assignments/submit/${assignmentId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAssignmentCount = () => {
  return studentApi.get("/assignments/assignmentcount");
};

export const getGrades = () => {
  return studentApi.get("/assignments/grades");
};

export const getMyGrades = () => {
  return studentApi.get("/grades");
};

/* =========================
   LEARNING CENTER API
========================= */
export const getLearningCourses = () => {
  return studentApi.get("/learning/courses");
};
export const getCourseContent = (courseId) => {
  return studentApi.get(`/learning/course/${courseId}`);
};
export const saveCourseNote = (data) => {
  return studentApi.post("/learning/note", data);
};
export const trackStudentMaterialDownload = (id) => {
  return studentApi.put(`/learning/materials/${id}/download`);
};
export const postCourseDiscussion = (courseId, text) => {
  return studentApi.post(`/learning/course/${courseId}/discussion`, { text });
};

// Fetch Circulars
export const getCircularsData = () => {
  return studentApi.get(`/circulars`);
};

// --- NEW: CERTIFICATE REQUESTS ---
export const requestNewCertificate = (data) => {
  return studentApi.post("/certificates/request", data);
};
export const getMyCertificateRequests = (studentId) => {
  return studentApi.get(`/certificates/requests?student_id=${studentId}`);
};
export const getCertificatesData = (studentId) => {
  return studentApi.get(`/certificates?student_id=${studentId}`);
};

export const getStudentQuizzes = () => studentApi.get("/quizzes/list");

export const getQuizQuestions = (quizId) =>
  studentApi.get(`/quizzes/questions/${quizId}`);

export const submitQuizResult = (data) =>
  studentApi.post("/quizzes/submit", data);

// --- STUDENT SCHEDULE API ---
export const getMySchedule = () => {
  return studentApi.get("/schedule");
};

export const addCustomEvent = (data) => {
  return studentApi.post("/schedule/custom", data);
};

export const uploadTimetableCsv = (formData) => {
  return studentApi.post("/schedule/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getCourseProgress = (data) =>
  studentApi.post("/schedule/course-progress", data);

// Fetch Degree Progress Audit
export const getDegreeProgressData = (studentId) => {
  // Updated to point to the new dedicated degree route!
  return studentApi.get(`/degree?student_id=${studentId}`);
};

studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("studentToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default studentApi;

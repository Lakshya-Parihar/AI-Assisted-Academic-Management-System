// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";

/* ======================
   ADMIN IMPORTS
====================== */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLayout from "./components/AdminSidebar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentLanding from "./pages/admin/AdminStudentLanding";
import AddStudent from "./pages/admin/AddStudent";
import ManageStudents from "./pages/admin/ManageStudents";
import AddBranch from "./pages/admin/AddBranch";
import ManageBranches from "./pages/admin/ManageBranches";
import AddCourse from "./pages/admin/AddCourse";
import ManageCourses from "./pages/admin/ManageCourses";
import AddFaculty from "./pages/admin/AddFaculty";
import ManageFaculty from "./pages/admin/ManageFaculty";
import AddCollege from "./pages/admin/AddCollege";
import ManageColleges from "./pages/admin/ManageColleges";
import AddFees from "./pages/admin/AddFees";
import ManageFees from "./pages/admin/ManageFees";
import ManageTransactions from "./pages/admin/ManageTransactions";
import ManageCertificates from "./pages/admin/ManageCertificates";

/* ======================
   STUDENT IMPORTS
====================== */
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import ResetPassword from "./pages/student/ResetPassword";
import StudentFees from "./pages/student/StudentFees";
import PaymentHistory from "./pages/student/PaymentHistory";
import StudentAttendance from "./pages/student/StudentAttendance";
import ChangePassword from "./pages/student/ChangePassword";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentGrades from "./pages/student/StudentGrades";
import StudentCourses from "./pages/student/StudentCourses";
import NexusAI from "./pages/student/NexusAI";
import StudentQuizPortal from "./pages/student/StudentQuizPortal";
import StudentCirculars from "./pages/student/StudentCirculars";
import DegreeProgress from "./pages/student/StudentDegreeProgress";
import CertificateGallery from "./pages/student/CertificateGallery";
import StudentLearningCenter from "./pages/student/StudentLearningCenter.jsx";
// import {
//   StudentOverview,
//   PlaceholderPage,
// } from "./pages/student/StudentDashboard";

/* ======================
   FACULTY IMPORTS
====================== */
import FacultyLogin from "./pages/faculty/FacultyLogin";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyLayout from "./pages/faculty/FacultyLayout";
import FacultyCourse from "./pages/faculty/FacultyCourse";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import AttendanceTracker from "./pages/faculty/AttendanceTracker";
import StudentRiskAnalysis from "./pages/faculty/StudentRiskAnalysis";
import FacultyStudentList from "./pages/faculty/FacultyStudentList";
import FacultyMaterials from "./pages/faculty/FacultyMaterials";
import FacultyQuizBuilder from "./pages/faculty/FacultyQuizBuilder";
import FacultySchedule from "./pages/faculty/FacultySchedule";
import FacultyGrades from "./pages/faculty/FacultyGrades";
import FcultyCircularsPost from "./pages/faculty/FacultyCircularsPost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* =====================================================
            ADMIN ROUTES (ENTERPRISE STRUCTURE)
        ===================================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="students" element={<StudentLanding />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="add-branch" element={<AddBranch />} />
          <Route path="manage-branches" element={<ManageBranches />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="add-faculty" element={<AddFaculty />} />
          <Route path="manage-faculty" element={<ManageFaculty />} />
          <Route path="add-college" element={<AddCollege />} />
          <Route path="manage-colleges" element={<ManageColleges />} />
          <Route path="add-fees" element={<AddFees />} />
          <Route path="manage-fees" element={<ManageFees />} />
          <Route path="fees-transactions" element={<ManageTransactions />} />
          <Route path="manage-certificates" element={<ManageCertificates />} />
        </Route>

        {/* =====================================================
            STUDENT ROUTES 
        ===================================================== */}
        <Route path="/student/login" element={<StudentLogin />} />

        <Route path="/student/reset-password" element={<ResetPassword />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="fees-history" element={<PaymentHistory />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="assignment" element={<StudentAssignments />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="nexus" element={<NexusAI />} />
          <Route path="quiz-portal" element={<StudentQuizPortal />} />
          <Route path="progress" element={<DegreeProgress />} />
          <Route path="circulars" element={<StudentCirculars />} />
          <Route path="certificates" element={<CertificateGallery />} />
          <Route path="learning" element={<StudentLearningCenter />} />
          {/* <Route
            path="schedule"
            element={<PlaceholderPage title="Class Schedule" />}
          /> */}
        </Route>

        {/* =====================================================
            FACULTY ROUTES 
        ===================================================== */}
        <Route path="/faculty/login" element={<FacultyLogin />} />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="courses" element={<FacultyCourse />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="attendance" element={<AttendanceTracker />} />
          <Route path="analytics" element={<StudentRiskAnalysis />} />
          <Route path="students" element={<FacultyStudentList />} />
          <Route path="materials" element={<FacultyMaterials />} />
          <Route path="quiz-builder" element={<FacultyQuizBuilder />} />
          <Route path="schedule" element={<FacultySchedule />} />
          <Route path="grades" element={<FacultyGrades />} />
          <Route path="circulars" element={<FcultyCircularsPost />} />
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Layers,
  FileText,
  Hash,
  Bookmark,
  User,
  UserCheck,
  AlertCircle,
} from "lucide-react";

const FormStyles = () => (
  <style>{`
    .onboard-container { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 900px; margin: 0 auto; padding-bottom: 4rem; }
    .onboard-card { width: 100%; background: rgba(15, 23, 42, 0.4); border-radius: 2rem; border: 1px solid rgba(30, 41, 59, 0.7); backdrop-filter: blur(30px); padding: 2.5rem; box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6); }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem 1.5rem; }
    
    .section-header { grid-column: span 2; display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 0.75rem; }
    .section-header span { font-size: 0.7rem; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap; }
    .section-header div { height: 1px; background: rgba(30, 41, 59, 0.7); flex: 1; opacity: 0.4; }

    .input-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .input-group label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-left: 0.2rem; }
    .field-wrapper { display: flex; align-items: center; gap: 0.6rem; background: #020617; border: 1px solid rgba(30, 41, 59, 0.7); border-radius: 0.75rem; padding: 0 1rem; transition: all 0.2s; }
    .field-wrapper:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
    .field-wrapper input, .field-wrapper select { background: none; border: none; color: white; padding: 0.75rem 0; width: 100%; outline: none; font-size: 0.9rem; }
    .field-wrapper select option { background: #0f172a; color: white; }
    
    .btn-submit { width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 1.1rem; border-radius: 1rem; font-weight: 800; font-size: 1rem; letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 2.5rem; transition: all 0.3s ease; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4); }
    .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
    
    .back-btn-bottom { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 0.8rem 1.5rem; border-radius: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; margin-top: 1rem; }
    .back-btn-bottom:hover { background: rgba(255,255,255,0.1); color: white; transform: translateY(-2px); }

    /* Toast Notification */
    .toast-notification { position: fixed; bottom: 2rem; right: 2rem; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; backdrop-filter: blur(10px); z-index: 1000; }
    .toast-notification.error { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }

    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .section-header { grid-column: span 1 !important; } }
  `}</style>
);

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // Toast state

  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]); // State for fetching faculties

  const [data, setData] = useState({
    course_name: "",
    course_code: "",
    department_id: "",
    assigned_faculty_id: "", // NEW
    course_coordinator_id: "", // NEW
    credits: "3",
    semester: "1",
    course_type: "Core",
    status: "Active",
    description: "",
  });

  // Fetch branches and faculties for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, facultyRes] = await Promise.all([
          adminApi.get("/branches"),
          adminApi.get("/faculty"),
        ]);
        setBranches(branchRes.data);
        setFaculties(facultyRes.data);
      } catch (err) {
        console.error("Failed to load prerequisite data", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.post("/courses", data);
      showToast("Course added successfully!", "success");
      setTimeout(() => navigate("/admin/manage-courses"), 1500);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to add course";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboard-container">
      <FormStyles />
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              COURSE REGISTRATION
            </h2>
          </div>

          <div className="onboard-card">
            <h3
              style={{
                textAlign: "center",
                color: "#6366f1",
                marginBottom: "2rem",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              COURSE DETAILS
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* --- COURSE IDENTITY --- */}
                <div className="section-header">
                  <span>Course Identity</span>
                  <div></div>
                </div>

                {/* Course Name */}
                <div className="input-group">
                  <label>Course Title</label>
                  <div className="field-wrapper">
                    <BookOpen size={16} color="#475569" />
                    <input
                      required
                      name="course_name"
                      value={data.course_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Data Structures"
                    />
                  </div>
                </div>

                {/* Course Code */}
                <div className="input-group">
                  <label>Course Code</label>
                  <div className="field-wrapper">
                    <Hash size={16} color="#475569" />
                    <input
                      required
                      name="course_code"
                      value={data.course_code}
                      onChange={handleInputChange}
                      placeholder="e.g. CS101"
                    />
                  </div>
                </div>

                {/* Department Dropdown */}
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>Department / Branch</label>
                  <div className="field-wrapper">
                    <Layers size={16} color="#475569" />
                    <select
                      required
                      name="department_id"
                      value={data.department_id}
                      onChange={handleInputChange}
                      style={{
                        color: data.department_id ? "white" : "#94a3b8",
                      }}
                    >
                      <option value="">Select Department</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* --- FACULTY ASSIGNMENTS (NEW FIELDS) --- */}
                <div className="section-header">
                  <span>Faculty Assignments</span>
                  <div></div>
                </div>

                {/* Assigned Faculty */}
                <div className="input-group">
                  <label>Assigned Faculty</label>
                  <div className="field-wrapper">
                    <User size={16} color="#475569" />
                    <select
                      name="assigned_faculty_id"
                      value={data.assigned_faculty_id}
                      onChange={handleInputChange}
                      style={{
                        color: data.assigned_faculty_id ? "white" : "#94a3b8",
                      }}
                    >
                      <option value="">None / Unassigned</option>
                      {faculties.map((f) => (
                        <option key={f.faculty_id} value={f.faculty_id}>
                          {f.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Course Coordinator */}
                <div className="input-group">
                  <label>Course Coordinator</label>
                  <div className="field-wrapper">
                    <UserCheck size={16} color="#475569" />
                    <select
                      name="course_coordinator_id"
                      value={data.course_coordinator_id}
                      onChange={handleInputChange}
                      style={{
                        color: data.course_coordinator_id ? "white" : "#94a3b8",
                      }}
                    >
                      <option value="">None / Unassigned</option>
                      {faculties.map((f) => (
                        <option key={f.faculty_id} value={f.faculty_id}>
                          {f.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* --- ACADEMIC STRUCTURE --- */}
                <div className="section-header">
                  <span>Academic Structure</span>
                  <div></div>
                </div>

                {/* Credits */}
                <div className="input-group">
                  <label>Credits</label>
                  <div className="field-wrapper">
                    <Bookmark size={16} color="#475569" />
                    <input
                      required
                      type="number"
                      name="credits"
                      value={data.credits}
                      onChange={handleInputChange}
                      placeholder="3"
                    />
                  </div>
                </div>

                {/* Semester */}
                <div className="input-group">
                  <label>Semester</label>
                  <div className="field-wrapper">
                    <FileText size={16} color="#475569" />
                    <input
                      required
                      type="number"
                      name="semester"
                      value={data.semester}
                      onChange={handleInputChange}
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Course Type */}
                <div className="input-group">
                  <label>Type</label>
                  <div className="field-wrapper">
                    <Layers size={16} color="#475569" />
                    <select
                      name="course_type"
                      value={data.course_type}
                      onChange={handleInputChange}
                    >
                      <option value="Core">Core</option>
                      <option value="Elective">Elective</option>
                      <option value="Lab">Lab</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="input-group">
                  <label>Status</label>
                  <div className="field-wrapper">
                    <CheckCircle2 size={16} color="#475569" />
                    <select
                      name="status"
                      value={data.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>Description (Optional)</label>
                  <div className="field-wrapper">
                    <input
                      name="description"
                      value={data.description}
                      onChange={handleInputChange}
                      placeholder="Brief overview..."
                    />
                  </div>
                </div>
              </div>

              <button disabled={loading} type="submit" className="btn-submit">
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle2 size={20} /> CREATE COURSE
                  </>
                )}
              </button>
            </form>
          </div>

          {/* === BOTTOM BACK BUTTON === */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="back-btn-bottom"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`toast-notification ${notification.type === "error" ? "error" : ""}`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCourse;

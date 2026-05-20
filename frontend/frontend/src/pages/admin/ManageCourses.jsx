import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit3,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Search,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertCircle,
  Hash,
  User,
  UserCheck,
  Bookmark,
  FileText
} from "lucide-react";
import adminApi from "../../services/adminApi";

const ManageStyles = () => (
  <style>{`
    .page-container { max-width: 1200px; margin: 0 auto; width: 100%; padding-bottom: 4rem; }
    
    /* Table & Card Styles */
    .glass-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th { 
      padding: 1.25rem 1rem; 
      color: #64748b; 
      font-size: 0.75rem; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      text-align: left; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
    }
    td { 
      padding: 1rem; 
      color: #f8fafc; 
      font-size: 0.95rem; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.03); 
      vertical-align: middle; 
      transition: background 0.2s;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.01); }
    tr:last-child td { border-bottom: none; }
    
    /* Actions */
    .action-btn { 
      background: rgba(2, 6, 23, 0.5); 
      border: 1px solid rgba(255, 255, 255, 0.1); 
      padding: 0.5rem; 
      border-radius: 0.5rem; 
      color: #94a3b8; 
      cursor: pointer; 
      transition: all 0.2s; 
      display: flex; align-items: center; justify-content: center; 
    }
    .action-btn:hover { background: rgba(99, 102, 241, 0.15); border-color: #6366f1; color: white; transform: translateY(-2px); }
    .action-btn.danger:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #f87171; }

    /* --- MODAL STYLES --- */
    .modal-overlay {
      position: fixed; inset: 0; 
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; 
      z-index: 1000; padding: 1rem;
    }
    
    .modal-card {
      background: linear-gradient(145deg, #0f172a, #020617);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 2rem;
      width: 100%; 
      max-height: 90vh;
      display: flex; flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.1);
      overflow-y: auto;
      position: relative;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }
    .modal-card::-webkit-scrollbar { display: none; } /* Chrome/Safari */

    .modal-close-btn {
      position: absolute; top: 1.5rem; right: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #94a3b8;
      transition: 0.2s; z-index: 20;
    }
    .modal-close-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; transform: rotate(90deg); }

    /* GRID LAYOUT */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .input-group label {
      display: block; color: #94a3b8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;
    }
    
    .input-group input, .input-group select, .input-group textarea {
      width: 100%;
      background: rgba(2, 6, 23, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.85rem 1rem;
      border-radius: 0.75rem;
      outline: none; font-size: 0.95rem;
      transition: all 0.2s;
    }
    .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    .input-group select option { background: #0f172a; color: white; }
    
    /* View Boxes */
    .info-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1.25rem;
      padding: 1.5rem;
    }
    .info-box-title {
      font-size: 0.75rem; font-weight: 800; color: #6366f1;
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;
    }

    /* Toast Notification */
    .toast-notification {
      position: fixed; bottom: 2rem; right: 2rem; background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 1rem 1.5rem;
      border-radius: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;
      backdrop-filter: blur(10px); z-index: 1100;
    }
    .toast-notification.error {
      background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;
    }

    @media (max-width: 768px) {
      .details-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1 !important; }
    }
  `}</style>
);

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]); // NEW: State for faculty list
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null); // Toast state

  const navigate = useNavigate();

  // Fetch all necessary data
  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, branchesRes, facultyRes] = await Promise.all([
        adminApi.get("/courses"),
        adminApi.get("/branches"),
        adminApi.get("/faculty")
      ]);
      setCourses(coursesRes.data);
      setBranches(branchesRes.data);
      setFaculties(facultyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await adminApi.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.course_id !== id));
      showToast("Course deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete course.", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.put(`/courses/${selectedCourse.course_id}`, selectedCourse);
      
      // Update local state by calling backend again to get the fresh joins (faculty names, etc)
      await loadData(); 
      setIsModalOpen(false);
      showToast("Course updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update course.", "error");
    }
  };

  const handleOpenModal = (course, mode) => {
    setSelectedCourse({ ...course });
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setSelectedCourse((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const filteredCourses = courses.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    return `${c.course_name || ""} ${c.course_code || ""} ${c.department_name || ""} ${c.assigned_faculty_name || ""} ${c.coordinator_name || ""} ${c.course_type || ""} ${c.status || ""}`
      .toLowerCase()
      .includes(term);
  });

  return (
    <div className="page-container">
      <ManageStyles />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-end', marginBottom: "2.5rem" }}>
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "6px 12px",
              borderRadius: "8px",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: 'uppercase',
              marginBottom: '1rem',
              transition: '0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'white'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", letterSpacing: '-1px', margin: 0 }}>
            Course Directory
          </h2>
        </div>

        <div style={{
          background: "rgba(2, 6, 23, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "0.75rem 1.25rem",
          borderRadius: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "350px",
          transition: '0.3s'
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#6366f1'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        >
          <Search size={18} color="#6366f1" />
          <input
            placeholder="Search courses, faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: "none", border: "none", color: "white", outline: "none", width: "100%", fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* List Table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Course Details</th>
                <th>Department</th>
                <th>Assigned Faculty</th>
                <th>Credits & Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <Search size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Courses Found</div>
                      <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c.course_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={20} color="#818cf8"/>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'white' }}>{c.course_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'monospace' }}>{c.course_code}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{c.department_name || `Dept ID: ${c.department_id}`}</td>
                    <td>
                      {c.assigned_faculty_name ? (
                        <div style={{ color: 'white', fontWeight: 600 }}>{c.assigned_faculty_name}</div>
                      ) : (
                        <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.85rem' }}>Unassigned</div>
                      )}
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{c.credits} Credits</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.course_type}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: "4px 12px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800, textTransform: 'uppercase',
                        background: c.status === 'Active' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: c.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${c.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                      }}>
                        {c.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: 'flex-end' }}>
                        <button className="action-btn" onClick={() => handleOpenModal(c, "view")} title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenModal(c, "edit")} title="Edit Course">
                          <Edit3 size={18} />
                        </button>
                        <button className="action-btn danger" onClick={() => handleDelete(c.course_id)} title="Delete Record">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ===== MIDNIGHT NEON MODAL ===== */}
      <AnimatePresence>
        {isModalOpen && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: modalMode === "view" ? "700px" : "800px" }}
            >
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>

              <div style={{ padding: "3rem" }}>
                {modalMode === "view" ? (
                  /* ===== VIEW MODE ===== */
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    
                    {/* Header Icon */}
                    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                      <div style={{
                        width: "100px", height: "100px", borderRadius: "1.5rem", padding: "4px",
                        border: "2px solid rgba(99,102,241,0.5)", background: "rgba(99,102,241,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: '0 0 30px rgba(99,102,241,0.2)'
                      }}>
                        <BookOpen size={48} color="#818cf8" />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "2.2rem", fontWeight: "900", margin: "0", color: "white", letterSpacing: '-0.5px', textAlign: 'center' }}>
                      {selectedCourse.course_name}
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", marginBottom: "3rem" }}>
                      <span style={{ color: "#818cf8", fontSize: "1rem", fontWeight: "700", fontFamily: 'monospace' }}>
                        {selectedCourse.course_code}
                      </span>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#475569" }}></span>
                      <span style={{
                        background: selectedCourse.status === 'Active' ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: selectedCourse.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${selectedCourse.status === 'Active' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: "800", textTransform: "uppercase"
                      }}>
                        {selectedCourse.status || "Active"}
                      </span>
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Structure Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Academic Structure</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          {[
                            ["Department", selectedCourse.department_name || `Dept ID: ${selectedCourse.department_id}`],
                            ["Course Type", selectedCourse.course_type],
                            ["Credits", `${selectedCourse.credits} Credits`],
                            ["Semester", `Semester ${selectedCourse.semester}`],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>{label}</div>
                              <div style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>{val || "-"}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Faculty Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Faculty Roles</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Assigned Faculty</div>
                            <div style={{ color: selectedCourse.assigned_faculty_name ? 'white' : '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <User size={16} color="#6366f1" /> {selectedCourse.assigned_faculty_name || "Unassigned"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Course Coordinator</div>
                            <div style={{ color: selectedCourse.coordinator_name ? 'white' : '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <UserCheck size={16} color="#6366f1" /> {selectedCourse.coordinator_name || "Unassigned"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description Box */}
                      {selectedCourse.description && (
                        <div className="info-box">
                          <h4 className="info-box-title">Course Description</h4>
                          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {selectedCourse.description}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                      <h3 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "white", letterSpacing: '-0.5px' }}>
                        EDIT COURSE
                      </h3>
                      <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        Update curriculum details and faculty assignments
                      </p>
                    </div>

                    <form onSubmit={handleUpdate}>
                      <div className="details-grid">
                        
                        <div className="input-group">
                          <label>Course Title</label>
                          <input
                            name="course_name"
                            value={selectedCourse.course_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Course Code</label>
                          <input
                            name="course_code"
                            value={selectedCourse.course_code}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                          <label>Department / Branch</label>
                          <select
                            name="department_id"
                            value={selectedCourse.department_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Department</option>
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.branch_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* NEW FACULTY FIELDS */}
                        <div className="input-group">
                          <label>Assigned Faculty</label>
                          <select
                            name="assigned_faculty_id"
                            value={selectedCourse.assigned_faculty_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">None / Unassigned</option>
                            {faculties.map((f) => (
                              <option key={f.faculty_id} value={f.faculty_id}>
                                {f.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Course Coordinator</label>
                          <select
                            name="course_coordinator_id"
                            value={selectedCourse.course_coordinator_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">None / Unassigned</option>
                            {faculties.map((f) => (
                              <option key={f.faculty_id} value={f.faculty_id}>
                                {f.full_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="input-group">
                          <label>Credits</label>
                          <input
                            type="number"
                            name="credits"
                            value={selectedCourse.credits}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Semester</label>
                          <input
                            type="number"
                            name="semester"
                            value={selectedCourse.semester}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label>Course Type</label>
                          <select
                            name="course_type"
                            value={selectedCourse.course_type || "Core"}
                            onChange={handleInputChange}
                          >
                            <option value="Core">Core</option>
                            <option value="Elective">Elective</option>
                            <option value="Lab">Lab</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Status</label>
                          <select
                            name="status"
                            value={selectedCourse.status || "Active"}
                            onChange={handleInputChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="input-group full-width" style={{ gridColumn: "span 2" }}>
                          <label>Description</label>
                          <textarea
                            rows="3"
                            name="description"
                            value={selectedCourse.description || ""}
                            onChange={handleInputChange}
                            style={{ resize: "none", paddingTop: "1rem" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}>
                        <button
                          type="submit"
                          style={{
                            width: "100%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white",
                            padding: "1.25rem", borderRadius: "1rem", border: "none", fontWeight: "800", fontSize: "1.05rem",
                            display: "flex", justifyContent: "center", alignItems: 'center', gap: "0.75rem", cursor: "pointer",
                            boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)", transition: '0.3s'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <Save size={20} /> SAVE CHANGES
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
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
            {notification.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCourses;
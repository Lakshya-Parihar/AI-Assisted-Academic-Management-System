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
  User,
  FileText,
  ExternalLink,
  Download,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Share2,
  Heart,
  MapPin,
  TrendingUp
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

    /* Promote Button */
    .promote-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-weight: 700;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex; align-items: center; gap: 0.4rem;
      transition: all 0.2s;
      box-shadow: 0 4px 10px -2px rgba(16, 185, 129, 0.4);
    }
    .promote-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px -2px rgba(16, 185, 129, 0.6);
    }

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
    
    .input-group label {
      display: block; color: #94a3b8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;
    }
    
    .input-group input, .input-group select {
      width: 100%;
      background: rgba(2, 6, 23, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.85rem 1rem;
      border-radius: 0.75rem;
      outline: none; font-size: 0.95rem;
      transition: all 0.2s;
    }
    .input-group input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    
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
    }
  `}</style>
);

const ManageStudents = () => {
  // --- STATE & LOGIC PRESERVED ---
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toast State
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this student?")) return;
    try {
      await adminApi.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast("Student deleted successfully.", "success");
    } catch (err) {
      console.error("Failed to delete student:", err);
      showToast("Failed to delete student. Please try again.", "error");
    }
  };

  const handleOpenModal = (student, mode) => {
    const completeData = {
      id: student.id || "",
      enrollment_no: student.enrollment_no || "",
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      course: student.course || "",
      semester: student.semester || "",
      status: student.status || "active",
      college_name: student.college_name || "",
      gender: student.gender || "",
      dob: student.dob ? student.dob.toString().split("T")[0] : "",
      photo: student.photo || "",
      aadhar_file: student.aadhar_file || "",
      leaving_file: student.leaving_file || "",
      state: student.state || "",
      city: student.city || "",
      pincode: student.pincode || "",
      father_name: student.father_name || "",
      father_occupation: student.father_occupation || "",
      mother_name: student.mother_name || "",
      mother_occupation: student.mother_occupation || "",
      tenth_percent: student.tenth_percent || "",
      twelfth_percent: student.twelfth_percent || "",
    };

    setSelectedStudent(completeData);
    setNewPhoto(null);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      editFields.forEach((f) => {
        formData.append(f.key, selectedStudent[f.key]);
      });
      if (newPhoto) formData.append("photo", newPhoto);

      await adminApi.put(`/students/${selectedStudent.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchStudents();
      setIsModalOpen(false);
      setNewPhoto(null);
      showToast("Student updated successfully ✅", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update student ❌", "error");
    }
  };

  const handlePromote = async (id) => {
    try {
      const res = await adminApi.put(`/promote/${id}`);
      showToast(res.data.message || "Student promoted successfully", "success");
      await fetchStudents();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Promotion failed", "error");
    }
  };

  const editFields = [
    { key: "enrollment_no", label: "ENROLLMENT NO" },
    { key: "name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "phone", label: "PHONE" },
    { key: "semester", label: "SEMESTER" },
    { key: "status", label: "STATUS" },
    { key: "state", label: "STATE" },
    { key: "city", label: "CITY" },
    { key: "pincode", label: "PINCODE" },
    { key: "father_name", label: "FATHER NAME" },
    { key: "father_occupation", label: "FATHER OCCUPATION" },
    { key: "mother_name", label: "MOTHER NAME" },
    { key: "mother_occupation", label: "MOTHER OCCUPATION" },
    { key: "tenth_percent", label: "TENTH PERCENT" },
    { key: "twelfth_percent", label: "TWELFTH PERCENT" },
  ];

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    return `${s.name || ""} ${s.enrollment_no || ""} ${s.email || ""} ${s.phone || ""} ${s.college_name || ""} ${s.course || ""} ${s.semester || ""} ${s.city || ""} ${s.state || ""} ${s.pincode || ""} ${s.status || ""}`
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
            Student Directory
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
            placeholder="Search by name, ID, college..."
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
                <th>Student Detail</th>
                <th>Enrollment ID</th>
                <th>Institution</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <Search size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Students Found</div>
                      <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {s.photo ? <img src={s.photo} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" /> : <User size={20} color="#818cf8"/>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'white' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.course} • Sem {s.semester}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", color: "#818cf8", fontWeight: 600 }}>{s.enrollment_no}</td>
                    <td style={{ color: '#cbd5e1' }}>{s.college_name}</td>
                    <td>
                      <span style={{
                        padding: "4px 12px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800, textTransform: 'uppercase',
                        background: s.status === 'active' || s.status === 'Verified' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: s.status === 'active' || s.status === 'Verified' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${s.status === 'active' || s.status === 'Verified' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                      }}>
                        {s.status || 'Verified'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: 'flex-end' }}>
                        <button className="action-btn" onClick={() => handleOpenModal(s, "view")} title="View Profile">
                          <Eye size={18} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenModal(s, "edit")} title="Edit Profile">
                          <Edit3 size={18} />
                        </button>
                        <button className="action-btn danger" onClick={() => handleDelete(s.id)} title="Delete Record">
                          <Trash2 size={18} />
                        </button>
                        <button className="promote-btn" onClick={() => handlePromote(s.id)}>
                          <TrendingUp size={16} /> Promote
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
        {isModalOpen && selectedStudent && (
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
                    
                    {/* Profile Header */}
                    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                      <div style={{
                        width: "120px", height: "120px", borderRadius: "50%", padding: "4px",
                        border: "3px solid #6366f1", background: "rgba(99,102,241,0.1)", overflow: "hidden",
                        boxShadow: '0 0 30px rgba(99,102,241,0.3)'
                      }}>
                        <img
                          src={selectedStudent.photo || "https://via.placeholder.com/150"}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "2.2rem", fontWeight: "900", margin: "0", color: "white", letterSpacing: '-0.5px' }}>
                      {selectedStudent.name}
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", marginBottom: "3rem" }}>
                      <span style={{ color: "#818cf8", fontSize: "1rem", fontWeight: "700", fontFamily: 'monospace' }}>
                        {selectedStudent.enrollment_no}
                      </span>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#475569" }}></span>
                      <span style={{
                        background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: '1px solid rgba(16,185,129,0.3)',
                        fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: "800", textTransform: "uppercase"
                      }}>
                        {selectedStudent.status || "Verified"}
                      </span>
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Academic & Contact Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Academic & Contact Overview</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          {[
                            ["Email Address", selectedStudent.email],
                            ["Phone Number", selectedStudent.phone],
                            ["Institution", selectedStudent.college_name],
                            ["Program", `${selectedStudent.course} (Sem ${selectedStudent.semester})`],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>{label}</div>
                              <div style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>{val || "-"}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Personal & Location Info Box */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="info-box" style={{ marginBottom: 0 }}>
                          <h4 className="info-box-title">Personal Details</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>DOB</div>
                              <div style={{ color: 'white', fontWeight: 600 }}>{selectedStudent.dob}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Gender</div>
                              <div style={{ color: 'white', fontWeight: 600 }}>{selectedStudent.gender}</div>
                            </div>
                          </div>
                        </div>
                        <div className="info-box" style={{ marginBottom: 0 }}>
                          <h4 className="info-box-title">Location</h4>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                            {selectedStudent.city}, {selectedStudent.state}
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Pincode: {selectedStudent.pincode}</div>
                        </div>
                      </div>

                      {/* Family & Grades Info Box */}
                      <div className="info-box" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(239, 68, 68, 0.05))', borderColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                          <div>
                            <p style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Father</p>
                            <p style={{ fontSize: "1.05rem", fontWeight: "700", color: "white" }}>{selectedStudent.father_name}</p>
                            <p style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{selectedStudent.father_occupation}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Mother</p>
                            <p style={{ fontSize: "1.05rem", fontWeight: "700", color: "white" }}>{selectedStudent.mother_name}</p>
                            <p style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{selectedStudent.mother_occupation}</p>
                          </div>
                        </div>
                        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(245, 158, 11, 0.2)", display: "flex", gap: '1rem' }}>
                          <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1.25rem", borderRadius: "1rem", flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700" }}>10th Grade</span>
                            <span style={{ fontWeight: "900", color: "#10b981", fontSize: '1.1rem' }}>{selectedStudent.tenth_percent}%</span>
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1.25rem", borderRadius: "1rem", flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700" }}>12th Grade</span>
                            <span style={{ fontWeight: "900", color: "#10b981", fontSize: '1.1rem' }}>{selectedStudent.twelfth_percent}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <a href={selectedStudent.leaving_file} target="_blank" rel="noreferrer"
                          style={{
                            flex: 1, textDecoration: "none", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                            padding: "1rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                            color: "#818cf8", fontSize: "0.9rem", fontWeight: "700", transition: '0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                        >
                          <FileText size={18} /> Leaving Certificate
                        </a>
                        <a href={selectedStudent.aadhar_file} target="_blank" rel="noreferrer"
                          style={{
                            flex: 1, textDecoration: "none", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                            padding: "1rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                            color: "#818cf8", fontSize: "0.9rem", fontWeight: "700", transition: '0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                        >
                          <ExternalLink size={18} /> Aadhar Card
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                      <h3 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "white", letterSpacing: '-0.5px' }}>
                        EDIT STUDENT
                      </h3>
                      <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        Update student credentials and academic records
                      </p>
                    </div>

                    <form onSubmit={handleSaveChanges}>
                      {/* Photo Upload */}
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                        <div style={{ textAlign: "center", position: "relative" }}>
                          <div style={{
                            width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden",
                            border: "2px dashed rgba(99,102,241,0.5)", background: "rgba(2,6,23,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          }}>
                            {newPhoto ? (
                              <img src={URL.createObjectURL(newPhoto)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : selectedStudent.photo ? (
                              <img src={selectedStudent.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <User size={40} color="#64748b" />
                            )}
                          </div>
                          <label style={{
                            position: "absolute", bottom: "5px", right: "0px", background: "#6366f1", color: "white",
                            width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", border: "3px solid #0f172a", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", transition: '0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <span style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "-2px" }}>+</span>
                            <input type="file" accept="image/*" onChange={(e) => setNewPhoto(e.target.files[0])} style={{ display: "none" }} />
                          </label>
                        </div>
                      </div>

                      {/* Edit Grid */}
                      <div className="details-grid">
                        {editFields.map((f) => (
                          <div key={f.key} className="input-group">
                            <label>{f.label}</label>
                            <input
                              name={f.key}
                              value={selectedStudent[f.key] || ""}
                              onChange={handleInputChange}
                              type="text"
                            />
                          </div>
                        ))}
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

export default ManageStudents;
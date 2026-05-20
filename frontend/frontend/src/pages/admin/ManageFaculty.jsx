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
  MapPin,
  Briefcase,
  CheckCircle2,
  AlertCircle
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
    .input-group input:focus, .input-group select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
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
    }
  `}</style>
);

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newResume, setNewResume] = useState(null);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toast State
  const [notification, setNotification] = useState(null);

  const filteredFaculty = faculty.filter((f) => {
    const term = searchTerm.toLowerCase();
    return `${f.full_name} ${f.email} ${f.branch_name} ${f.city} ${f.state} ${f.designation} ${f.specialization} ${f.status}`
      .toLowerCase()
      .includes(term);
  });

  const [modalMode, setModalMode] = useState("view"); // 'view' or 'edit'

  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await adminApi.get("/branches");
        setBranches(res.data);
      } catch (err) {
        console.error("Branch fetch error:", err);
      }
    };
    fetchBranches();
  }, []);

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- DELETE HANDLER (UPDATED) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this faculty member?")) return;

    try {
      await adminApi.delete(`/faculty/${id}`);
      setFaculty((prev) => prev.filter((f) => f.faculty_id !== id));
      showToast("Faculty deleted successfully.", "success");
    } catch (err) {
      console.error("Failed to delete faculty:", err);
      showToast("Failed to delete faculty. Please try again.", "error");
    }
  };

  const handleOpenModal = (faculty, mode) => {
    setSelectedFaculty({
      faculty_id: faculty.faculty_id,
      branch_id: faculty.branch_id,
      full_name: faculty.full_name || "",
      email: faculty.email || "",
      phone_number: faculty.phone_number || "",
      gender: faculty.gender || "",
      dob: faculty.dob ? faculty.dob.split("T")[0] : "",
      designation: faculty.designation || "",
      qualification: faculty.qualification || "",
      specialization: faculty.specialization || "",
      experience_years: faculty.experience_years || "",
      city: faculty.city || "",
      state: faculty.state || "",
      status: faculty.status || "Active",
      profile_photo: faculty.profile_photo || "",
      resume_file: faculty.resume_file || "",
      joining_date: faculty.joining_date || "" // Keeping this for view mode
    });

    setNewPhoto(null);
    setNewResume(null);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      editFields.forEach((f) => {
        formData.append(f.key, selectedFaculty[f.key]);
      });

      formData.append("branch_id", selectedFaculty.branch_id);

      if (newPhoto) {
        formData.append("profile_photo", newPhoto);
      }

      if (newResume) {
        formData.append("resume_file", newResume);
      }

      await adminApi.put(`/faculty/${selectedFaculty.faculty_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchFaculty();
      setIsModalOpen(false);
      setNewPhoto(null);
      setNewResume(null);

      showToast("Faculty updated successfully ✅", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update faculty ❌", "error");
    }
  };

  // view fields (Used strictly for mapping labels if needed, but handled custom below)
  const viewFields = [
    { key: "faculty_id", label: "FACULTY ID" },
    { key: "full_name", label: "FULL NAME" },
    { key: "email", label: "EMAIL" },
    { key: "phone_number", label: "PHONE" },
    { key: "branch_id", label: "BRANCH ID" },
    { key: "designation", label: "DESIGNATION" },
    { key: "qualification", label: "QUALIFICATION" },
    { key: "specialization", label: "SPECIALIZATION" },
    { key: "experience_years", label: "EXPERIENCE (YEARS)" },
    { key: "joining_date", label: "JOINING DATE" },
    { key: "city", label: "CITY" },
    { key: "state", label: "STATE" },
    { key: "status", label: "STATUS" },
    { key: "gender", label: "GENDER" },
    { key: "dob", label: "DOB" },
  ];

  // EDIT: limited & safe fields only
  const editFields = [
    { key: "full_name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "phone_number", label: "PHONE" },
    { key: "status", label: "STATUS" },
    { key: "state", label: "STATE" },
    { key: "city", label: "CITY" },
    { key: "designation", label: "DESIGNATION" },
    { key: "qualification", label: "QUALIFICATION" },
    { key: "specialization", label: "SPECIALIZATION" },
    { key: "experience_years", label: "EXPERIENCE (YEARS)" },
  ];

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
            Faculty Directory
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
            placeholder="Search faculty..."
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
                <th>Faculty Profile</th>
                <th>Faculty ID</th>
                <th>Branch</th>
                <th>City</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <Search size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Faculty Found</div>
                      <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((f) => (
                  <tr key={f.faculty_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {f.profile_photo ? <img src={f.profile_photo} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="" /> : <User size={20} color="#818cf8"/>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'white' }}>{f.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.designation} • {f.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", color: "#818cf8", fontWeight: 600 }}>{f.faculty_id}</td>
                    <td style={{ color: '#cbd5e1' }}>{f.branch_name}</td>
                    <td style={{ color: '#cbd5e1' }}>{f.city}</td>
                    <td>
                      <span style={{
                        padding: "4px 12px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800, textTransform: 'uppercase',
                        background: f.status === 'Active' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: f.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${f.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                      }}>
                        {f.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: 'flex-end' }}>
                        <button className="action-btn" onClick={() => handleOpenModal(f, "view")} title="View Profile">
                          <Eye size={18} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenModal(f, "edit")} title="Edit Profile">
                          <Edit3 size={18} />
                        </button>
                        <button className="action-btn danger" onClick={() => handleDelete(f.faculty_id)} title="Delete Record">
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
        {isModalOpen && selectedFaculty && (
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
                          src={selectedFaculty.profile_photo || "https://via.placeholder.com/150"}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "2.2rem", fontWeight: "900", margin: "0", color: "white", letterSpacing: '-0.5px' }}>
                      {selectedFaculty.full_name}
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", marginBottom: "3rem" }}>
                      <span style={{ color: "#818cf8", fontSize: "1rem", fontWeight: "700", fontFamily: 'monospace' }}>
                        {selectedFaculty.faculty_id}
                      </span>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#475569" }}></span>
                      <span style={{
                        background: selectedFaculty.status === 'Active' ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: selectedFaculty.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${selectedFaculty.status === 'Active' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: "800", textTransform: "uppercase"
                      }}>
                        {selectedFaculty.status || "Active"}
                      </span>
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Academic & Contact Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Professional & Contact Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          {[
                            ["Email Address", selectedFaculty.email],
                            ["Phone Number", selectedFaculty.phone_number],
                            ["Designation", selectedFaculty.designation],
                            ["Specialization", selectedFaculty.specialization],
                            ["Qualification", selectedFaculty.qualification],
                            ["Experience", selectedFaculty.experience_years ? `${selectedFaculty.experience_years} Years` : null],
                            ["Joining Date", selectedFaculty.joining_date ? selectedFaculty.joining_date.split("T")[0] : null],
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
                              <div style={{ color: 'white', fontWeight: 600 }}>{selectedFaculty.dob}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Gender</div>
                              <div style={{ color: 'white', fontWeight: 600 }}>{selectedFaculty.gender}</div>
                            </div>
                          </div>
                        </div>
                        <div className="info-box" style={{ marginBottom: 0 }}>
                          <h4 className="info-box-title">Location</h4>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                            {selectedFaculty.city}, {selectedFaculty.state}
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <a href={selectedFaculty.resume_file} target="_blank" rel="noreferrer"
                          style={{
                            flex: 1, textDecoration: "none", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                            padding: "1rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                            color: "#818cf8", fontSize: "0.9rem", fontWeight: "700", transition: '0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                        >
                          <FileText size={18} /> View Resume File
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                      <h3 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "white", letterSpacing: '-0.5px' }}>
                        EDIT FACULTY
                      </h3>
                      <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        Update faculty details and professional records
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
                            ) : selectedFaculty.profile_photo ? (
                              <img src={selectedFaculty.profile_photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                              value={selectedFaculty[f.key] || ""}
                              onChange={handleInputChange}
                              type="text"
                            />
                          </div>
                        ))}

                        {/* Branch Dropdown */}
                        <div className="input-group">
                          <label>Branch</label>
                          <select
                            name="branch_id"
                            value={selectedFaculty.branch_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.branch_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Resume Upload Box */}
                      <div style={{ marginTop: "1.5rem" }}>
                        <div className="input-group">
                           <label>Update Resume Document</label>
                           <label style={{ 
                             display: "flex", alignItems: "center", gap: "0.75rem", padding: "1.25rem", 
                             background: "rgba(99,102,241,0.05)", border: "1px dashed rgba(99,102,241,0.4)", 
                             borderRadius: "0.75rem", cursor: "pointer", color: "#818cf8", justifyContent: "center",
                             transition: "0.2s" 
                           }}
                           onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                           onMouseOut={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                           >
                             <FileText size={18} />
                             {newResume ? newResume.name : (selectedFaculty.resume_file ? "Replace existing Resume PDF" : "Upload Resume (PDF)")}
                             <input type="file" accept=".pdf" hidden onChange={(e) => setNewResume(e.target.files[0])} />
                           </label>
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

export default ManageFaculty;
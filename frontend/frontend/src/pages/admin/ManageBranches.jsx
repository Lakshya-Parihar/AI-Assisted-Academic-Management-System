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
  MapPin,
  User,
  Mail,
  Phone,
  Layers,
  School,
  Building2,
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
    
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
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

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toast State
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();

    const fetchColleges = async () => {
      try {
        const res = await adminApi.get("/colleges");
        setColleges(res.data);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };

    fetchColleges();
  }, []);

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await adminApi.delete(`/branches/${id}`);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      showToast("Branch deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete branch", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.put(`/branches/${selectedBranch.id}`, selectedBranch);
      setBranches((prev) =>
        prev.map((b) => (b.id === selectedBranch.id ? selectedBranch : b)),
      );
      setIsModalOpen(false);
      showToast("Branch updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update branch.", "error");
    }
  };

  const handleOpenModal = (branch, mode) => {
    setSelectedBranch({ ...branch });
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBranch((prev) => ({ ...prev, [name]: value }));
  };

  const filteredBranches = branches.filter((b) => {
    const term = searchTerm.toLowerCase().trim();

    return `${b.branch_name || ""} ${b.branch_code || ""} ${b.hod_name || ""} ${b.college_name || ""} ${b.contact_email || ""} ${b.contact_phone || ""} ${b.block_location || ""} ${b.total_sems || ""} ${b.status || ""}`
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
            Branch Directory
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
            placeholder="Search branches..."
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
                <th>Branch Name</th>
                <th>Code</th>
                <th>HOD</th>
                <th>Semesters</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <Search size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Branches Found</div>
                      <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBranches.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={20} color="#818cf8"/>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'white' }}>{b.branch_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{b.college_name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", color: "#818cf8", fontWeight: 600 }}>{b.branch_code}</td>
                    <td style={{ color: '#cbd5e1' }}>{b.hod_name}</td>
                    <td>
                      <span style={{
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "#818cf8",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}>
                        {b.total_sems} Sems
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: "4px 12px", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800, textTransform: 'uppercase',
                        background: b.status === 'active' || b.status === 'Active' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: b.status === 'active' || b.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${b.status === 'active' || b.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
                      }}>
                        {b.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: 'flex-end' }}>
                        <button className="action-btn" onClick={() => handleOpenModal(b, "view")} title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="action-btn" onClick={() => handleOpenModal(b, "edit")} title="Edit Branch">
                          <Edit3 size={18} />
                        </button>
                        <button className="action-btn danger" onClick={() => handleDelete(b.id)} title="Delete Record">
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
        {isModalOpen && selectedBranch && (
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
                        <Layers size={48} color="#818cf8" />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "2.2rem", fontWeight: "900", margin: "0", color: "white", letterSpacing: '-0.5px', textAlign: 'center' }}>
                      {selectedBranch.branch_name}
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", marginBottom: "3rem" }}>
                      <span style={{ color: "#818cf8", fontSize: "1rem", fontWeight: "700", fontFamily: 'monospace' }}>
                        {selectedBranch.branch_code}
                      </span>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#475569" }}></span>
                      <span style={{
                        background: selectedBranch.status === 'active' || selectedBranch.status === 'Active' ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: selectedBranch.status === 'active' || selectedBranch.status === 'Active' ? "#10b981" : "#f59e0b",
                        border: `1px solid ${selectedBranch.status === 'active' || selectedBranch.status === 'Active' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: "800", textTransform: "uppercase"
                      }}>
                        {selectedBranch.status || "Active"}
                      </span>
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Academic Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Academic Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Associated College</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <School size={16} color="#6366f1" /> {selectedBranch.college_name || "-"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Total Semesters</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Layers size={16} color="#6366f1" /> {selectedBranch.total_sems || "-"} Semesters
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Info Box */}
                      <div className="info-box">
                        <h4 className="info-box-title">Administrative Contact</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>HOD Name</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <User size={16} color="#6366f1" /> {selectedBranch.hod_name || "-"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Location / Block</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <MapPin size={16} color="#6366f1" /> {selectedBranch.block_location || "-"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>HOD Email</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Mail size={16} color="#6366f1" /> {selectedBranch.contact_email || "-"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>HOD Phone</div>
                            <div style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Phone size={16} color="#6366f1" /> {selectedBranch.contact_phone || "-"}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                      <h3 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "white", letterSpacing: '-0.5px' }}>
                        EDIT BRANCH
                      </h3>
                      <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        Update branch information and administrative details
                      </p>
                    </div>

                    <form onSubmit={handleUpdate}>
                      <div className="details-grid">
                        <div className="input-group">
                          <label>Branch Name</label>
                          <input
                            name="branch_name"
                            value={selectedBranch.branch_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Branch Code</label>
                          <input
                            name="branch_code"
                            value={selectedBranch.branch_code}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>College</label>
                          <select
                            name="college_id"
                            value={selectedBranch.college_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="">Select College</option>
                            {colleges.map((clg) => (
                              <option key={clg.id} value={clg.id}>
                                {clg.college_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="input-group">
                          <label>HOD Name</label>
                          <input
                            name="hod_name"
                            value={selectedBranch.hod_name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Total Semesters</label>
                          <input
                            type="number"
                            name="total_sems"
                            value={selectedBranch.total_sems}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="contact_email"
                            value={selectedBranch.contact_email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Phone</label>
                          <input
                            name="contact_phone"
                            value={selectedBranch.contact_phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="input-group">
                          <label>Location</label>
                          <input
                            name="block_location"
                            value={selectedBranch.block_location}
                            onChange={handleInputChange}
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

export default ManageBranches;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Edit3,
  ArrowLeft,
  Save,
  X,
  Layers,
  Trash2,
  IndianRupee,
  School,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getBranchFees,
  updateBranchFees,
  deleteBranchFees,
} from "../../services/adminApi";

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
    
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.5rem; }
    .input-group label {
      display: block; color: #94a3b8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; margin-bottom: 0.25rem; letter-spacing: 0.05em;
    }
    
    .input-group input {
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
      width: 100%;
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

  `}</style>
);

export default function ManageFees() {
  const navigate = useNavigate();
  const [fees, setFees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    const res = await getBranchFees();
    setFees(res.data);
  };

  const openModal = (fee, mode) => {
    setSelected({ ...fee });
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateBranchFees(selected.id, selected);
      fetchFees();
      setIsModalOpen(false);
      showToast("Fees updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update fees.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fees record?")) return;

    try {
      await deleteBranchFees(id);
      setFees((prev) => prev.filter((f) => f.id !== id));
      showToast("Fees record deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete fees record.", "error");
    }
  };

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
            Fee Management
          </h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Branch Name</th>
                <th style={{ width: "20%", textAlign: "center" }}>
                  Total Semesters
                </th>
                <th style={{ width: "25%", textAlign: "center" }}>
                  Total Course Fees
                </th>
                <th style={{ width: "15%", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {fees.length === 0 ? (
                 <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <IndianRupee size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Fee Records Found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                fees.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <School size={20} color="#818cf8"/>
                        </div>
                        <div style={{ fontWeight: 700, color: 'white' }}>{f.branch_name}</div>
                      </div>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          background: "rgba(99,102,241,.1)",
                          color: "#818cf8",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {f.total_sems} Sems
                      </span>
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#10b981",
                        fontSize: "1.05rem"
                      }}
                    >
                      ₹ {Number(f.total_course_fees).toLocaleString()}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          className="action-btn"
                          onClick={() => openModal(f, "view")}
                          title="View Fees"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="action-btn"
                          onClick={() => openModal(f, "edit")}
                          title="Edit Fees"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          className="action-btn danger"
                          onClick={() => handleDelete(f.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
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
        {isModalOpen && selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: modalMode === "view" ? "550px" : "550px" }}
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
                        border: "2px solid rgba(16,185,129,0.5)", background: "rgba(16,185,129,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: '0 0 30px rgba(16,185,129,0.2)'
                      }}>
                        <IndianRupee size={48} color="#10b981" />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "2rem", fontWeight: "900", margin: "0", color: "white", letterSpacing: '-0.5px', textAlign: 'center' }}>
                      {selected.branch_name}
                    </h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem", marginBottom: "2.5rem" }}>
                      <span style={{
                        background: "rgba(99, 102, 241, 0.15)",
                        color: "#818cf8",
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        fontSize: "0.7rem", padding: "4px 12px", borderRadius: "999px", fontWeight: "800", textTransform: "uppercase"
                      }}>
                        Fee Configuration
                      </span>
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div className="info-box">
                        <h4 className="info-box-title">Financial Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Layers size={18} color="#6366f1" />
                              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Total Semesters</div>
                            </div>
                            <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>{selected.total_sems} Semesters</div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <IndianRupee size={18} color="#10b981" />
                              <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Total Course Fees</div>
                            </div>
                            <div style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>₹ {Number(selected.total_course_fees).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                      <h3 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "white", letterSpacing: '-0.5px' }}>
                        EDIT FEES
                      </h3>
                      <p style={{ color: "#818cf8", marginTop: "0.5rem", fontWeight: 700, fontSize: "1rem" }}>
                        {selected.branch_name}
                      </p>
                    </div>

                    <form onSubmit={handleUpdate}>
                      <div className="input-group">
                        <label>Total Course Fees (₹)</label>
                        <div style={{ position: "relative" }}>
                          <IndianRupee size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            type="number"
                            value={selected.total_course_fees}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                total_course_fees: e.target.value,
                              })
                            }
                            style={{ paddingLeft: "2.5rem" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}>
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
}
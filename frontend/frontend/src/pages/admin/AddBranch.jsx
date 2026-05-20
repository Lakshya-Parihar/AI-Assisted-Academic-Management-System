import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";
import {
  MapPin,
  ArrowLeft,
  School,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  User,
  Layers,
  AlertCircle
} from "lucide-react";

// --- FULL CSS INCLUDED HERE ---
const FormStyles = () => (
  <style>{`
    /* Onboard Container */
    .onboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 4rem;
    }

    /* Base Card Style */
    .onboard-card {
      width: 100%;
      background: rgba(15, 23, 42, 0.4);
      border-radius: 2rem;
      border: 1px solid rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(30px);
      padding: 2.5rem;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem 1.5rem;
    }

    .section-header {
      grid-column: span 2;
      display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 0.75rem;
    }
    .section-header span {
      font-size: 0.7rem; font-weight: 900; color: #6366f1;
      text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap;
    }
    .section-header div { height: 1px; background: rgba(30, 41, 59, 0.7); flex: 1; opacity: 0.4; }

    .input-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .input-group label {
      font-size: 0.7rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 0.05em; margin-left: 0.2rem;
    }

    .field-wrapper {
      display: flex; align-items: center; gap: 0.6rem;
      background: #020617; border: 1px solid rgba(30, 41, 59, 0.7);
      border-radius: 0.75rem; padding: 0 1rem; transition: all 0.2s;
    }
    .field-wrapper:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }

    .field-wrapper input, .field-wrapper select, .field-wrapper textarea {
      background: none; border: none; color: white; padding: 0.75rem 0;
      width: 100%; outline: none; font-size: 0.9rem;
    }
    .field-wrapper select option { background: #0f172a; color: white; }

    /* Main Submit Button - Vivid Gradient & Glow */
    .btn-submit {
      width: 100%; 
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none; 
      padding: 1.1rem; 
      border-radius: 1rem;
      font-weight: 800; 
      font-size: 1rem; 
      letter-spacing: 0.5px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.75rem;
      margin-top: 2.5rem; 
      transition: all 0.3s ease;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-submit:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6); 
    }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

    /* Bottom Back Button */
    .back-btn-bottom {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }
    .back-btn-bottom:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      transform: translateY(-2px);
    }

    /* Toast Notification */
    .toast-notification {
      position: fixed; bottom: 2rem; right: 2rem; background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 1rem 1.5rem;
      border-radius: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;
      backdrop-filter: blur(10px); z-index: 100;
    }
    .toast-notification.error {
      background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .section-header, .full-width { grid-column: span 1 !important; }
    }
  `}</style>
);

const AddBranch = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // Toast state

  useEffect(() => {
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

  const [data, setData] = useState({
    college_id: "",
    branch_name: "",
    branch_code: "",
    hod_name: "",
    contact_email: "",
    contact_phone: "",
    block_location: "",
    total_sems: "",
  });

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
      await adminApi.post("/branches", data);
      showToast("Branch added successfully!", "success");
      
      // Delay navigation slightly so user sees the success toast
      setTimeout(() => navigate("/admin/manage-branches"), 1500);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to add branch";
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
          {/* Global Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
              BRANCH REGISTRATION
            </h2>
          </div>

          <div className="onboard-card">
            <h3 style={{ textAlign: "center", color: "#6366f1", marginBottom: "2rem", fontSize: "1.1rem", fontWeight: 800 }}>
              BRANCH DETAILS
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                
                {/* --- IDENTITY SECTION --- */}
                <div className="section-header">
                  <span>Identity & Affiliation</span><div></div>
                </div>

                <div className="input-group">
                  <label>Branch Name</label>
                  <div className="field-wrapper">
                    <Building size={16} color="#475569" />
                    <input
                      required
                      name="branch_name"
                      value={data.branch_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Branch Code</label>
                  <div className="field-wrapper">
                    <Layers size={16} color="#475569" />
                    <input
                      required
                      name="branch_code"
                      value={data.branch_code}
                      onChange={handleInputChange}
                      placeholder="e.g. CSE"
                    />
                  </div>
                </div>

                <div className="input-group full-width" style={{ gridColumn: "span 2" }}>
                  <label>Select College</label>
                  <div className="field-wrapper">
                    <School size={16} color="#475569" />
                    <select
                      required
                      name="college_id"
                      value={data.college_id}
                      onChange={handleInputChange}
                      style={{ color: data.college_id ? "white" : "#94a3b8" }}
                    >
                      <option value="">Select Associated College</option>
                      {colleges.map((clg) => (
                        <option key={clg.id} value={clg.id}>
                          {clg.college_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* --- ADMINISTRATION SECTION --- */}
                <div className="section-header">
                  <span>Administrative Details</span><div></div>
                </div>

                <div className="input-group">
                  <label>HOD Name</label>
                  <div className="field-wrapper">
                    <User size={16} color="#475569" />
                    <input
                      required
                      name="hod_name"
                      value={data.hod_name}
                      onChange={handleInputChange}
                      placeholder="Head of Dept"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <div className="field-wrapper">
                    <Mail size={16} color="#475569" />
                    <input
                      type="email"
                      name="contact_email"
                      value={data.contact_email}
                      onChange={handleInputChange}
                      placeholder="cse@college.edu"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Contact Phone</label>
                  <div className="field-wrapper">
                    <Phone size={16} color="#475569" />
                    <input
                      type="tel"
                      name="contact_phone"
                      value={data.contact_phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                {/* --- ACADEMICS & LOCATION SECTION --- */}
                <div className="section-header">
                  <span>Academics & Location</span><div></div>
                </div>

                <div className="input-group">
                  <label>Total Semesters</label>
                  <div className="field-wrapper">
                    <Layers size={16} color="#475569" />
                    <input
                      type="number"
                      name="total_sems"
                      value={data.total_sems}
                      onChange={handleInputChange}
                      placeholder="e.g. 8"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Location</label>
                  <div className="field-wrapper">
                    <MapPin size={16} color="#475569" />
                    <input
                      name="block_location"
                      value={data.block_location}
                      onChange={handleInputChange}
                      placeholder="e.g. Block A"
                    />
                  </div>
                </div>
              </div>

              <button disabled={loading} type="submit" className="btn-submit">
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 size={22} /> REGISTER BRANCH
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
            {notification.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddBranch;
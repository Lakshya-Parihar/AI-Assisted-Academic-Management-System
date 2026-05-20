import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  ShieldCheck,
  UploadCloud,
  Search,
  Trash2,
  UserCircle,
  Clock,
  FileText,
  XCircle,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllIssuedCertificates,
  issueStudentCertificate,
  revokeCertificate,
  getStudents,
  getPendingCertificateRequests,
  rejectStudentCertificateRequest,
} from "../../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";

const ManageStyles = () => (
  <style>{`
    .page-container { max-width: 1300px; margin: 0 auto; width: 100%; padding-bottom: 4rem; }
    
    /* Layout & Cards */
    .glass-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    
    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.5rem;
    }

    /* Summary Stats */
    .stat-box {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1.5rem 2rem;
      border-radius: 1.5rem;
      text-align: center;
      min-width: 160px;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }

    /* Inputs */
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
    .input-group label {
      display: block; color: #94a3b8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .input-group input, .input-group select, .input-group textarea {
      width: 100%; background: rgba(2, 6, 23, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
      color: white; padding: 0.85rem 1rem; border-radius: 0.75rem; outline: none; font-size: 0.95rem;
      transition: all 0.2s;
    }
    .input-group input:focus, .input-group select:focus, .input-group textarea:focus { 
      border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); 
    }
    .input-group select option { background: #0f172a; color: white; }

    /* Buttons */
    .btn-submit {
      width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; padding: 1.1rem; border-radius: 1rem; font-weight: 800; font-size: 1rem; 
      letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; 
      gap: 0.75rem; margin-top: 1.5rem; transition: all 0.3s ease; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

    /* Tabs */
    .tab-btn {
      background: none; border: none; font-size: 1.1rem; font-weight: 800; cursor: pointer;
      padding-bottom: 0.5rem; color: #64748b; border-bottom: 2px solid transparent; transition: 0.3s;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .tab-btn.active { color: white; border-bottom-color: #6366f1; }

    /* List Items */
    .list-item {
      background: rgba(2, 6, 23, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: 0.2s;
    }
    .list-item:hover { border-color: rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05); }

    .list-item.warning { border-color: rgba(245, 158, 11, 0.3); border-left: 4px solid #f59e0b; }
    .list-item.warning:hover { background: rgba(245, 158, 11, 0.05); }

    /* Scrollbar */
    .scroll-area { overflow-y: auto; max-height: 600px; padding-right: 0.5rem; }
    .scroll-area::-webkit-scrollbar { width: 6px; }
    .scroll-area::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
    .scroll-area::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }

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

    @media (max-width: 1024px) {
      .grid-layout { grid-template-columns: 1fr; }
    }
  `}</style>
);

const ManageCertificates = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ledger"); // 'ledger' or 'requests'
  const [notification, setNotification] = useState(null); // Toast state

  const [formData, setFormData] = useState({
    student_id: "",
    title: "",
    category: "",
    description: "",
    badge_type: "Completion",
    issue_date: "",
    request_id: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchData = async () => {
    try {
      const [certsRes, studentsRes, reqsRes] = await Promise.all([
        getAllIssuedCertificates(),
        getStudents(),
        getPendingCertificateRequests(),
      ]);
      setCertificates(certsRes.data);
      setStudents(studentsRes.data.filter((s) => s.status === "active"));
      setRequests(reqsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProcessRequest = (req) => {
    setFormData({
      student_id: req.student_id,
      title: req.requested_title,
      category: "General",
      description: `Issued for: ${req.reason}`,
      badge_type: "Completion",
      issue_date: new Date().toISOString().split("T")[0],
      request_id: req.id,
    });
    showToast("Form populated! Please attach the PDF document and click Issue.", "success");
  };

  const handleRejectRequest = async (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      try {
        await rejectStudentCertificateRequest(id);
        fetchData();
        showToast("Request rejected successfully.", "success");
      } catch (err) {
        showToast("Failed to reject.", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please attach a certificate file (PDF/Image).", "error");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("certificateFile", selectedFile);

    try {
      await issueStudentCertificate(data);
      showToast("Certificate successfully minted!", "success");
      setFormData({
        student_id: "",
        title: "",
        category: "",
        description: "",
        badge_type: "Completion",
        issue_date: "",
        request_id: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchData();
      setActiveTab("ledger");
    } catch (error) {
      showToast("Failed to issue certificate.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id, title) => {
    if (window.confirm(`REVOKE the certificate: ${title}?`)) {
      try {
        await revokeCertificate(id);
        fetchData();
        showToast("Certificate successfully revoked.", "success");
      } catch (error) {
        showToast("Failed to revoke.", "error");
      }
    }
  };

  const filteredCerts = certificates.filter(
    (c) =>
      c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="page-container">
      <ManageStyles />

      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "12px", color: "white", letterSpacing: '-1px' }}>
            <ShieldCheck color="#6366f1" size={32} strokeWidth={2.5} /> Institutional Ledger
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
            Securely issue and manage verifiable academic credentials.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="stat-box">
            <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#f59e0b", lineHeight: "1" }}>
              {requests.length}
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginTop: "8px", letterSpacing: '0.05em' }}>
              Pending Requests
            </div>
          </div>
          <div className="stat-box">
            <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#6366f1", lineHeight: "1" }}>
              {certificates.length}
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginTop: "8px", letterSpacing: '0.05em' }}>
              Total Issued
            </div>
          </div>
        </div>
      </div>

      <div className="grid-layout">
        
        {/* LEFT COLUMN: Mint Certificate Form */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem", color: "white" }}>
            <Award size={20} color="#6366f1" /> Mint New Certificate
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Select Student</label>
              <select required name="student_id" value={formData.student_id} onChange={handleInputChange} style={{ cursor: "pointer", color: formData.student_id ? 'white' : '#94a3b8' }}>
                <option value="" disabled>-- Select Recipient --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.enrollment_no} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Certificate Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Dean's List - Fall 2025" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="input-group">
                <label>Category</label>
                <input required type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. HONORS" />
              </div>
              <div className="input-group">
                <label>Badge Level</label>
                <select required name="badge_type" value={formData.badge_type} onChange={handleInputChange} style={{ cursor: "pointer" }}>
                  <option value="Completion">Completion</option>
                  <option value="Distinction">Distinction</option>
                  <option value="Honor">Honor</option>
                  <option value="Expertise">Expertise</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Issue Date</label>
              <input required type="date" name="issue_date" value={formData.issue_date} onChange={handleInputChange} style={{ colorScheme: "dark" }} />
            </div>

            <div className="input-group">
              <label>Description / Citation</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} placeholder="Official citation of achievement..." rows="3" style={{ resize: "none" }}></textarea>
            </div>

            <div className="input-group">
              <label>Attach Official Document</label>
              <div style={{
                border: "1px dashed rgba(99, 102, 241, 0.4)", borderRadius: "0.75rem", padding: "1.5rem", textAlign: "center",
                background: "rgba(2, 6, 23, 0.4)", transition: '0.2s', cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(2, 6, 23, 0.4)'}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} required accept=".pdf,image/*" style={{ display: "none" }} id="cert-upload" />
                <label htmlFor="cert-upload" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", margin: 0 }}>
                  <UploadCloud size={28} color={selectedFile ? "#10b981" : "#6366f1"} />
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: selectedFile ? "white" : "#94a3b8" }}>
                    {selectedFile ? selectedFile.name : "Click to browse (PDF/PNG)"}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? "Minting to Ledger..." : <><ShieldCheck size={20} /> ISSUE CERTIFICATE</>}
            </button>
          </form>
        </motion.div>

        {/* RIGHT COLUMN: Ledger & Requests Tabs */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          
          {/* Tab Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <button onClick={() => setActiveTab("ledger")} className={`tab-btn ${activeTab === "ledger" ? "active" : ""}`}>
                Ledger History
              </button>
              <button onClick={() => setActiveTab("requests")} className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}>
                Student Requests 
                {requests.length > 0 && (
                  <span style={{ background: "#f59e0b", color: "#000", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "8px" }}>
                    {requests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search (Only for Ledger) */}
            {activeTab === "ledger" && (
              <div style={{ position: "relative", width: "240px" }}>
                <Search size={16} color="#6366f1" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%", background: "rgba(2,6,23,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "99px", padding: "8px 16px 8px 36px", color: "white", outline: "none", fontSize: "0.85rem",
                  }}
                />
              </div>
            )}
          </div>

          {/* Tab Content Area */}
          <div className="scroll-area" style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>Loading secure records...</div>
            ) : activeTab === "ledger" ? (
              
              /* LEDGER TAB CONTENT */
              filteredCerts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <Search size={32} style={{ opacity: 0.5, marginBottom: '1rem', color: '#6366f1' }} />
                  <div>No certificates found in ledger.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredCerts.map((cert) => (
                    <div key={cert.id} className="list-item">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <ShieldCheck size={16} color="#10b981" />
                          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#10b981", letterSpacing: "0.5px" }}>
                            {cert.verified_id}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            • {new Date(cert.issue_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "white", marginBottom: "4px" }}>
                          {cert.title}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#94a3b8" }}>
                          <UserCircle size={16} color="#6366f1" /> {cert.student_name} <span style={{ fontFamily: 'monospace' }}>({cert.enrollment_no})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevoke(cert.id, cert.title)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444",
                          padding: "0.6rem 1rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center",
                          gap: "6px", fontSize: "0.8rem", fontWeight: "700", transition: "0.2s"
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                      >
                        <Trash2 size={16} /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : 
            
            /* REQUESTS TAB CONTENT */
            requests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                <CheckCircle2 size={32} style={{ opacity: 0.5, marginBottom: '1rem', color: '#10b981' }} />
                <div>No pending requests. You are all caught up!</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {requests.map((req) => (
                  <div key={req.id} className="list-item warning">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <Clock size={16} color="#f59e0b" />
                        <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#f59e0b", letterSpacing: "0.5px" }}>
                          PENDING REVIEW
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          • {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "white", marginBottom: "4px" }}>
                        {req.requested_title}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "8px", fontStyle: "italic" }}>
                        "{req.reason}"
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>
                        <UserCircle size={16} color="#6366f1" /> {req.student_name} <span style={{ fontFamily: 'monospace' }}>({req.enrollment_no})</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button
                        onClick={() => handleProcessRequest(req)}
                        style={{
                          background: "#6366f1", border: "none", color: "white", padding: "0.6rem 1rem", borderRadius: "0.5rem",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "700"
                        }}
                      >
                        <FileText size={14} /> Process
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        style={{
                          background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.6rem 1rem", borderRadius: "0.5rem",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "700", transition: "0.2s"
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

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

export default ManageCertificates;
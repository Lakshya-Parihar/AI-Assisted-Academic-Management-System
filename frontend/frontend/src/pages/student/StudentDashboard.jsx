import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  LayoutDashboard,
  Calendar,
  LogOut,
  Bell,
  Brain,
  Clock,
  FileText,
  Sparkles,
  Award,
  User,
  ReceiptIndianRupee,
  IndianRupee,
  FilePenLine,
  Building2,
  QrCode,
  NotebookTabs,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  MessageSquarePlus
} from "lucide-react";
import { 
  getStudentProfile,
  getAttendanceStats,
  getAssignmentCount,
  getMyGrades, 
  getCircularsData, 
  getCertificatesData 
} from "../../services/studentApi";

import StudentAttendance from "./StudentAttendance";
import ChangePassword from "./ChangePassword";
import StudentFees from "./StudentFees";
import PaymentHistory from "./PaymentHistory";
import StudentAssignments from "./StudentAssignments";
import StudentGrades from "./StudentGrades";
import StudentCourses from "./StudentCourses";
import NexusAI from "./NexusAI";
import StudentLearningCenter from "./StudentLearningCenter.jsx";
import StudentCertificates from "./CertificateGallery.jsx";
import StudentQuizPortal from "./StudentQuizPortal.jsx";
import StudentCirculars from "./StudentCirculars.jsx";
import DegreeProgress from "./StudentDegreeProgress.jsx";

const CustomCSS = () => (
  <style>{`
    :root {
      --bg-dark: #0B0E14;
      --panel-bg: rgba(20, 25, 35, 0.6);
      --border-color: rgba(45, 55, 72, 0.5);
      --primary-accent: #818cf8;
      --secondary-accent: #c084fc;
      --success: #34d399;
      --warning: #fbbf24;
      --danger: #f87171;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --sidebar-width: 280px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; }

    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-dark);
      color: var(--text-main);
      overflow-x: hidden;
    }

    .ambient-bg {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 0;
      background: 
        radial-gradient(circle at 15% 50%, rgba(129, 140, 248, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(192, 132, 252, 0.08) 0%, transparent 50%);
    }

    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0; top: 0;
      background: rgba(11, 14, 20, 0.8);
      backdrop-filter: blur(20px);
      border-right: 1px solid var(--border-color);
      display: flex; flex-direction: column;
      padding: 2rem 1.5rem;
      z-index: 100;
    }

    .sidebar-header {
      display: flex; align-items: center; gap: 1rem;
      margin-bottom: 2.5rem; padding-left: 0.5rem;
    }

    .brand-icon {
      width: 44px; height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary-accent), var(--secondary-accent));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(129, 140, 248, 0.25);
    }

    .brand-text { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.05em; }

    /* Hiding the visible scrollbar while maintaining scrollability */
    .nav-group {
      display: flex; flex-direction: column; gap: 0.4rem;
      flex: 1; overflow-y: auto; padding-right: 0.5rem;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .nav-group::-webkit-scrollbar { 
      display: none; /* Hide scrollbar for Chrome, Safari and Opera */
    }

    .nav-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.9rem 1.2rem;
      border-radius: 12px;
      color: var(--text-muted);
      font-size: 0.85rem; font-weight: 600; letter-spacing: 0.02em;
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
      text-transform: uppercase; /* Force all sidebar text to uppercase */
    }

    .nav-item:hover { background: rgba(255, 255, 255, 0.03); color: white; }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(129, 140, 248, 0.1), transparent);
      color: var(--primary-accent);
      border-left: 3px solid var(--primary-accent);
      border-radius: 0 12px 12px 0;
    }

    /* Fixed Logout Footer */
    .sidebar-footer {
      margin-top: auto;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .main-wrapper {
      flex: 1; margin-left: var(--sidebar-width);
      padding: 2.5rem 3.5rem;
      position: relative; z-index: 10;
    }

    .glass-card {
      background: var(--panel-bg);
      border-radius: 24px;
      border: 1px solid var(--border-color);
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .id-card-wrapper {
      background: linear-gradient(145deg, #1A1F2C 0%, #11151E 100%);
      border: 1px solid rgba(129, 140, 248, 0.2);
      border-radius: 28px;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
      display: flex;
      gap: 3rem;
      align-items: center;
    }

    .id-card-wrapper::before {
      content: ''; position: absolute;
      top: -50%; right: -20%;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .id-photo-section {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .id-photo-frame {
      width: 160px; height: 160px;
      border-radius: 24px;
      padding: 6px;
      background: linear-gradient(135deg, rgba(129, 140, 248, 0.5), rgba(192, 132, 252, 0.5));
      margin-bottom: 1.5rem;
    }

    .id-photo-inner {
      width: 100%; height: 100%;
      border-radius: 18px;
      background: var(--bg-dark);
      overflow: hidden;
    }

    .id-badge {
      display: inline-block;
      background: rgba(129, 140, 248, 0.15);
      color: var(--primary-accent);
      padding: 0.4rem 1rem;
      border-radius: 99px;
      font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em;
      border: 1px solid rgba(129, 140, 248, 0.3);
    }

    .id-details-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr); 
      gap: 1.5rem 2rem;
      flex: 1;
      z-index: 2;
    }

    .data-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .data-label {
      font-size: 0.75rem; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
    }
    .data-value {
      font-size: 0.95rem; font-weight: 600; color: white;
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .stat-card {
      padding: 1.5rem;
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
      border: 1px solid var(--border-color);
      display: flex; flex-direction: column; gap: 1rem;
      transition: transform 0.3s;
    }
    .stat-card:hover { transform: translateY(-4px); }

    .menu-item { padding: 12px 16px; font-size: 14px; cursor: pointer; transition: 0.2s; }
    .menu-item:hover { background: rgba(255,255,255,0.1); }
    
    .cat-tag {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
  `}</style>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "GOOD EVENING";
};

const getCategoryColor = (cat) => {
  switch (cat?.toUpperCase()) {
    case "EVENTS": return { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" };
    case "HOLIDAYS": return { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" };
    case "ACADEMICS": return { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" };
    case "ADMINISTRATIVE": return { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" };
    default: return { bg: "rgba(148, 163, 184, 0.15)", text: "#94A3B8" };
  }
};

const getBadgeColor = (type) => {
  switch (type?.toUpperCase()) {
    case "DISTINCTION": return { bg: "rgba(16, 185, 129, 0.2)", text: "#10B981" };
    case "EXPERTISE": return { bg: "rgba(59, 130, 246, 0.2)", text: "#3B82F6" };
    case "HONOR": return { bg: "rgba(168, 85, 247, 0.2)", text: "#A855F7" };
    default: return { bg: "rgba(148, 163, 184, 0.2)", text: "#F8FAFC" };
  }
};

const StudentOverview = ({ student, setView }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [gpaData, setGpaData] = useState({ cumulative: "0.00", standing: "" });
  const [aiForecast, setAiForecast] = useState({ predicted: "0.00" });
  const [circulars, setCirculars] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    getAttendanceStats().then(res => {
        let total = 0, present = 0, absent = 0;
        res.data.forEach((item) => {
          total += Number(item.total_classes) || 0;
          present += Number(item.present_classes) || 0;
          absent += Number(item.absent_classes) || 0;
        });
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        setAttendanceStats({ total_classes: total, present_classes: present, absent_classes: absent, percentage });
    }).catch(console.error);

    getAssignmentCount().then(res => setPendingAssignments(res.data.pending)).catch(console.error);

    getMyGrades().then(res => {
        if(res.data.gpaData) setGpaData(res.data.gpaData);
        if(res.data.aiForecast) setAiForecast(res.data.aiForecast);
    }).catch(console.error);

    getCircularsData().then(res => {
        setCirculars(res.data.circulars || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (student && (student.id || student.student_id)) {
        const sid = student.id || student.student_id;
        getCertificatesData(sid).then(res => {
            setCertificates(res.data.certificates || []);
        }).catch(console.error);
    }
  }, [student]);

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    navigate("/student/login");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="view-container">
      
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
            {getGreeting()}, <span style={{ color: "var(--primary-accent)" }}>{student?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Here is your academic overview for today.</p>
        </div>

        <div style={{ position: "relative" }}>
          <div onClick={() => setShowMenu(!showMenu)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: "rgba(255,255,255,0.03)", padding: "8px 16px", borderRadius: "99px", border: "1px solid var(--border-color)" }}>
            <img src={student?.photo ? `http://localhost:5000/uploads/photos/${student.photo}` : '/default-avatar.png'} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} alt="profile" />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{student?.name}</span>
          </div>
          {showMenu && (
            <div style={{ position: "absolute", right: 0, top: "60px", background: "#1e293b", borderRadius: "12px", width: "200px", zIndex: 9999, border: "1px solid var(--border-color)", overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div className="menu-item" onClick={() => setView("change-password")}>Change Password</div>
              <div className="menu-item" onClick={logout} style={{ color: '#f87171' }}>Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Identity Card */}
      <div className="id-card-wrapper" style={{ marginBottom: "2.5rem" }}>
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', opacity: 0.2 }}>
            <Building2 size={120} />
        </div>
        
        <div className="id-photo-section">
          <div className="id-photo-frame">
            <div className="id-photo-inner">
              {student?.photo ? (
                <img src={`http://localhost:5000/uploads/photos/${student.photo}`} alt="student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : ( <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><User size={64} color="#334155" /></div> )}
            </div>
          </div>
          <div className="id-badge">{student?.enrollment_no || "ENROLLMENT PENDING"}</div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.2rem" }}>{student?.name}</h3>
          <p style={{ color: "var(--primary-accent)", fontWeight: 600, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>{student?.college}</p>

          <div className="id-details-grid">
            <div className="data-group"><span className="data-label">Course Program</span><span className="data-value">{student?.branch || "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Current Semester</span><span className="data-value">{student?.semester ? `Semester ${student.semester}` : "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Gender</span><span className="data-value">{student?.gender || "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Date of Birth</span><span className="data-value">{student?.dob ? new Date(student.dob).toLocaleDateString("en-GB") : "Loading..."}</span></div>
            
            <div className="data-group"><span className="data-label">Email Address</span><span className="data-value" style={{fontSize: "0.85rem"}}>{student?.email || "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Phone Contact</span><span className="data-value">{student?.phone || "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Academic Status</span>
              <span className="data-value" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <span style={{width:'8px', height:'8px', borderRadius:'50%', background:'var(--success)'}}></span>{student?.status || "Loading..."}
              </span>
            </div>
            <div className="data-group"><span className="data-label">State</span><span className="data-value">{student?.state || "Loading..."}</span></div>

            <div className="data-group"><span className="data-label">City</span><span className="data-value">{student?.city || "Loading..."}</span></div>
            <div className="data-group"><span className="data-label">Pincode</span><span className="data-value">{student?.pincode || "Loading..."}</span></div>
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '10px', borderRadius: '12px' }}>
            <QrCode color="black" size={80} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="stat-card">
          <div style={{ display:'flex', justifyContent:'space-between'}}>
            <span className="data-label">Cumulative GPA</span>
            <Award color="var(--warning)" size={20} />
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{gpaData.cumulative} <span style={{fontSize:"1rem", color:"var(--text-muted)", fontWeight:600}}>/ 4.0</span></h2>
          <span style={{ fontSize:'0.8rem', color:'var(--success)'}}>{gpaData.standing || "Evaluating..."}</span>
        </div>

        <div className="stat-card">
          <div style={{ display:'flex', justifyContent:'space-between'}}>
            <span className="data-label">Overall Attendance</span>
            <Clock color="var(--success)" size={20} />
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{attendanceStats?.percentage ?? "--"}%</h2>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ width: `${attendanceStats?.percentage ?? 0}%`, background: "var(--success)", height: "100%" }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display:'flex', justifyContent:'space-between'}}>
            <span className="data-label">Pending Tasks</span>
            <NotebookTabs color="var(--danger)" size={20} />
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{pendingAssignments}</h2>
          <span style={{ fontSize:'0.8rem', color:'var(--text-muted)'}}>Assignments due soon</span>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)', borderColor: 'rgba(139, 92, 246, 0.3)'}}>
          <div style={{ display:'flex', justifyContent:'space-between'}}>
            <span className="data-label" style={{color:'#c4b5fd'}}>AIAAMS Forecast</span>
            <Sparkles color="#c4b5fd" size={20} />
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{aiForecast.predicted || "0.00"}</h2>
          <span style={{ fontSize:'0.8rem', color:'var(--text-muted)'}}>Predicted Trajectory</span>
        </div>
      </div>

      {/* Functional Widgets */}
      <div className="widget-grid">
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Recent Bulletins</h3>
            <Bell size={18} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {circulars.slice(0, 3).map((circ) => {
               const catStyle = getCategoryColor(circ.category);
               return (
                <div key={circ.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span className="cat-tag" style={{ background: catStyle.bg, color: catStyle.text }}>{circ.category}</span>
                            {circ.priority === "Urgent" && <span className="cat-tag" style={{ background: "rgba(239,68,68,0.15)", color: "var(--danger)"}}>URGENT</span>}
                        </div>
                        <p style={{ fontWeight: 600, fontSize:'0.9rem', marginBottom: '4px', lineHeight: 1.4 }}>{circ.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(circ.published_date).toLocaleDateString()}</p>
                    </div>
                </div>
               );
            })}
            {circulars.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>No recent bulletins.</p>}
          </div>
          <button onClick={() => setView('circulars')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
             View All Circulars <ArrowRight size={14}/>
          </button>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Latest Credentials</h3>
            <Award size={18} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {certificates.slice(0, 3).map((cert) => {
               const badgeStyle = getBadgeColor(cert.badge_type);
               return (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                             <ShieldCheck size={14} color="var(--success)" />
                             <p style={{ fontWeight: 600, fontSize:'0.9rem' }}>{cert.title}</p>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                    </div>
                    <span className="cat-tag" style={{ background: badgeStyle.bg, color: badgeStyle.text }}>{cert.badge_type}</span>
                </div>
               );
            })}
            {certificates.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>No certificates earned yet.</p>}
          </div>
          <button onClick={() => setView('certificates')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
             Open Certificate Gallery <ArrowRight size={14}/>
          </button>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", display:'flex', flexDirection:'column', justifyContent:'space-between', background: 'linear-gradient(145deg, rgba(20, 25, 35, 0.8) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#c4b5fd" /> Nexus AI Assistant
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Have questions about your coursework or need help drafting a study schedule? Nexus is connected directly to your academic data.
            </p>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <button 
                onClick={() => setView('nexus')}
                style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: '0.2s'
                }}
            >
                <MessageSquarePlus size={18} /> Start New Chat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const StudentDashboard = () => {
  const [view, setView] = useState("overview");
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentProfile();
        setStudent(res.data);
      } catch (err) { console.error("Failed to load student profile", err); }
    };
    fetchStudent();
  }, []);

  // Make sure logout is available at this level for the sidebar
  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    navigate("/student/login");
  };

  const renderView = () => {
    switch (view) {
      case "overview": return <StudentOverview student={student} setView={setView} />;
      case "nexus": return <NexusAI />;
      case "courses": return <StudentCourses setView={setView} />;
      case "grades": return <StudentGrades />;
      case "assignment": return <StudentAssignments />;
      case "attendance": return <StudentAttendance />;
      case "fees": return <StudentFees />;
      case "fees-history": return <PaymentHistory />;
      case "change-password": return <ChangePassword />;
      case "learning-center": return <StudentLearningCenter />;
      case "certificates": return <StudentCertificates />;
      case "quiz-portal": return <StudentQuizPortal />;
      case "circulars": return <StudentCirculars />;
      case "progress": return <DegreeProgress />;
      default: return null;
    }
  };

  return (
    <div className="app-layout">
      <CustomCSS />
      <div className="ambient-bg" />

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon"><Brain color="white" size={24} /></div>
          <h1 className="brand-text">AA<span style={{ color: "var(--primary-accent)" }}>AMS</span></h1>
        </div>

        <nav className="nav-group">
          <div className={`nav-item ${view === "overview" ? "active" : ""}`} onClick={() => setView("overview")}>
            <LayoutDashboard size={18} /> <span>OVERVIEW</span>
          </div>
          <div className={`nav-item ${view === "courses" ? "active" : ""}`} onClick={() => setView("courses")}>
            <Book size={18} /> <span>MY COURSES</span>
          </div>
          <div className={`nav-item ${view === "attendance" ? "active" : ""}`} onClick={() => setView("attendance")}>
            <FilePenLine size={18} /> <span>ATTENDANCE</span>
          </div>
          <div className={`nav-item ${view === "assignment" ? "active" : ""}`} onClick={() => setView("assignment")}>
            <NotebookTabs size={18} /> <span>ASSIGNMENTS</span>
          </div>
          <div className={`nav-item ${view === "grades" ? "active" : ""}`} onClick={() => setView("grades")}>
            <Award size={18} /> <span>GRADES</span>
          </div>
          <div className={`nav-item ${view === "fees" ? "active" : ""}`} onClick={() => setView("fees")}>
            <IndianRupee size={18} /> <span>PAYMENTS</span>
          </div>
          <div className={`nav-item ${view === "fees-history" ? "active" : ""}`} onClick={() => setView("fees-history")}>
            <ReceiptIndianRupee size={18} /> <span>TRANSACTIONS</span>
          </div>
          <div className={`nav-item ${view === "nexus" ? "active" : ""}`} onClick={() => setView("nexus")}>
            <Sparkles size={18} /> <span>NEXUS AI</span>
          </div>
          <div className={`nav-item ${view === "learning-center" ? "active" : ""}`} onClick={() => setView("learning-center")}>
            <BookOpen size={18} /> <span>LEARNING CENTER</span>
          </div>
          <div className={`nav-item ${view === "certificates" ? "active" : ""}`} onClick={() => setView("certificates")}>
            <FileText size={18} /> <span>CERTIFICATES</span>
          </div>
          <div className={`nav-item ${view === "quiz-portal" ? "active" : ""}`} onClick={() => setView("quiz-portal")}>
            <Brain size={18} /> <span>QUIZ PORTAL</span>
          </div>
          <div className={`nav-item ${view === "circulars" ? "active" : ""}`} onClick={() => setView("circulars")}>
            <Bell size={18} /> <span>CIRCULARS</span>
          </div>
          <div className={`nav-item ${view === "progress" ? "active" : ""}`} onClick={() => setView("progress")}>
            <Award size={18} /> <span>DEGREE PROGRESS</span>
          </div>
        </nav>

        {/* Fixed Logout Button in Footer */}
        <div className="sidebar-footer">
          <div className="nav-item" onClick={logout} style={{ color: "var(--danger)" }}>
            <LogOut size={18} /> <span>LOGOUT</span>
          </div>
        </div>
      </aside>

      <main className="main-wrapper">
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      </main>
    </div>
  );
};

export default StudentDashboard;
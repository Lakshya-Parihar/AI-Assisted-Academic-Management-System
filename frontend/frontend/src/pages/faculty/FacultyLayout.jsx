import React, { useState, useEffect } from "react";
import { getFacultyProfile } from "../../services/facultyApi";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FolderArchive,
  PenTool,
  Brain,
  BrainCircuit,
  GraduationCap,
  Calendar,
  Moon,
  Sun,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  User,
  BarChart,
  FileText,
} from "lucide-react";

const FacultyLayout = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [facultyName, setFacultyName] = useState("Faculty");
  const [facultyPhoto, setFacultyPhoto] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await getFacultyProfile();
        setFacultyName(res.data.full_name);
        setFacultyPhoto(res.data.profile_photo);
      } catch (err) {
        console.error("Failed to fetch faculty profile", err);
      }
    };
    fetchFaculty();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyData");
    navigate("/faculty/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="faculty-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          --bg-main: ${darkMode ? "#060813" : "#F8FAFC"};
          --sidebar-bg: ${darkMode ? "#0b0f1a" : "#FFFFFF"};
          --accent: #F59E0B; /* ScholarAI Orange */
          --card-bg: ${darkMode ? "rgba(17, 24, 39, 0.7)" : "#FFFFFF"};
          --text-primary: ${darkMode ? "#f1f5f9" : "#1E293B"};
          --text-secondary: ${darkMode ? "#94a3b8" : "#64748B"};
          --border: ${darkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0"};
          --font-family: 'Plus Jakarta Sans', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-family); }
        
        .faculty-app {
          display: flex; min-height: 100vh; background-color: var(--bg-main);
          color: var(--text-primary); transition: all 0.3s ease;
        }

        .sidebar {
          width: 280px; height: 100vh; position: fixed; left: 0; top: 0;
          background: var(--sidebar-bg); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; padding: 2rem 1.25rem; z-index: 100;
          transition: all 0.3s ease;
        }

        .brand-section {
          display: flex; align-items: center; gap: 12px; margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .brand-logo {
          background: var(--accent);
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
        }

        .nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.8rem 1rem; margin-bottom: 0.4rem; border-radius: 12px;
          color: var(--text-secondary); text-decoration: none; font-size: 0.85rem;
          font-weight: 700; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .nav-link:hover { background: rgba(150,150,150,0.05); color: var(--text-primary); }
        
        .nav-link.active {
          background: ${
            darkMode
              ? "linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, transparent 100%)"
              : "linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)"
          };
          color: var(--accent);
          border-left: 3px solid var(--accent);
          border-radius: 4px 12px 12px 4px;
        }

        .main-content { flex: 1; margin-left: 280px; display: flex; flex-direction: column; }
        
        .top-navbar {
          height: 80px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem; background: ${darkMode ? "rgba(6, 8, 19, 0.8)" : "rgba(248, 250, 252, 0.8)"};
          backdrop-filter: blur(10px); sticky top: 0; z-index: 50; border-bottom: 1px solid var(--border);
        }

        .user-card {
          display: flex; align-items: center; gap: 12px; background: rgba(150,150,150,0.05);
          padding: 6px 14px; border-radius: 14px; border: 1px solid var(--border);
          cursor: pointer; transition: 0.2s;
        }

        .sidebar nav::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">
            <Brain size={24} color={darkMode ? "black" : "white"} />
          </div>
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            AA<span style={{ color: "var(--accent)" }}>AMS</span>
          </span>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {[
            {
              to: "/faculty/dashboard",
              icon: <LayoutDashboard size={19} />,
              label: "DASHBOARD",
            },
            {
              to: "/faculty/students",
              icon: <Users size={19} />,
              label: "STUDENTS",
            },
            {
              to: "/faculty/attendance",
              icon: <ClipboardCheck size={19} />,
              label: "ATTENDANCE",
            },
            {
              to: "/faculty/courses",
              icon: <BookOpen size={19} />,
              label: "COURSES",
            },
            {
              to: "/faculty/materials",
              icon: <FolderArchive size={19} />,
              label: "MATERIALS",
            },
            {
              to: "/faculty/assignments",
              icon: <PenTool size={19} />,
              label: "ASSIGNMENTS",
            },
            {
              to: "/faculty/quiz-builder",
              icon: <BrainCircuit size={19} />,
              label: "QUIZ BUILDER",
            },
            {
              to: "/faculty/grades",
              icon: <GraduationCap size={19} />,
              label: "GRADES",
            },
            {
              to: "/faculty/analytics",
              icon: <BarChart size={19} />,
              label: "RISK ANALYSIS",
            },
            {
              to: "/faculty/circulars",
              icon: <FileText size={19} />,
              label: "CIRCULARS",
            },
            {
              to: "/faculty/schedule",
              icon: <Calendar size={19} />,
              label: "SCHEDULE",
            },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                {item.icon} <span>{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: "30px" }}>
          {/* <div
            className="nav-link"
            onClick={() => setDarkMode(!darkMode)}
            style={{ marginBottom: "0.5rem" }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              <span>{darkMode ? "LIGHT MODE" : "DARK MODE"}</span>
            </div>
          </div> */}

          <div
            className="nav-link"
            style={{ color: "#f87171" }}
            onClick={handleLogout}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <LogOut size={19} /> <span>LOGOUT</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="top-navbar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              // background: "rgba(150,150,150,0.05)",
              padding: "8px 16px",
              borderRadius: "12px",
              width: "320px",
              // border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Welcome again, {facultyName} Sir!
            </div>
          </div>

          <div
            className="user-card"
            onClick={() => navigate("/faculty/profile")}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                {facultyName}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--accent)",
                  fontWeight: 800,
                }}
              >
                FACULTY
              </div>
            </div>
            <div
              style={{
                width: 34,
                height: 34,
                background: "var(--accent)",
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyCenter: "center",
                border: "2px solid var(--border)",
              }}
            >
              {facultyPhoto ? (
                <img
                  src={`http://localhost:5000/uploads/faculty/photos/${facultyPhoto}`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={18} color="white" />
              )}
            </div>
          </div>
        </header>

        <main style={{ padding: "2rem 3rem", flex: 1, overflowY: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `var(--card-bg)`,
              borderRadius: "24px",
              padding: "2.5rem",
              border: "1px solid var(--border)",
              minHeight: "100%",
            }}
          >
            <Outlet context={{ darkMode }} />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;

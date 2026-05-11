import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getAdminProfile } from "../services/adminApi";
import {
  LayoutDashboard,
  Users,
  User,
  Library,
  LogOut,
  Menu,
  Award,
  IndianRupee,
  ChevronDown,
  BookMarked,
  ShieldCheck,
  Building2,
  UsersRound,
  Compass,
  BookOpen,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  
  const [adminName, setAdminName] = useState("Administrator");
  const [adminPhoto, setAdminPhoto] = useState(null); // <-- Added state for photo

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? "" : name);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminProfile();
        setAdminName(res.data.name);
        setAdminPhoto(res.data.profile_photo || null); // <-- Fetch photo from backend
      } catch (err) {
        console.error("Failed to fetch admin", err);
      }
    };
    fetchAdmin();
  }, []);

  // Helper to format the image URL just like in AdminProfile.jsx
  const getProfileImage = () => {
    if (!adminPhoto) return null;
    return `http://localhost:5000/uploads/admin/${adminPhoto}`;
  };

  return (
    <div className="app-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          --bg-main: #060813;
          --sidebar-bg: #0b0f1a;
          --accent: #6366f1;
          --accent-light: #818cf8;
          --card-bg: rgba(17, 24, 39, 0.7);
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --font-family: 'Plus Jakarta Sans', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-family); }
        
        .app-layout {
          display: flex; min-height: 100vh; background-color: var(--bg-main);
          color: var(--text-primary);
        }

        .sidebar {
          width: 280px; height: 100vh; position: fixed; left: 0; top: 0;
          background: var(--sidebar-bg); border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column; padding: 2rem 1.25rem; z-index: 100;
        }

        .brand-section {
          display: flex; align-items: center; gap: 12px; margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .brand-logo {
          background: linear-gradient(135deg, var(--accent), #4f46e5);
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
        }

        .nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.8rem 1rem; margin-bottom: 0.25rem; border-radius: 12px;
          color: var(--text-secondary); text-decoration: none; font-size: 0.85rem;
          font-weight: 600; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .nav-link:hover { background: rgba(255,255,255,0.03); color: white; }
        
        .nav-link.active {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
          color: var(--accent-light);
          border-left: 3px solid var(--accent);
          border-radius: 4px 12px 12px 4px;
        }

        .sub-menu { overflow: hidden; padding-left: 1rem; margin-bottom: 1rem; }
        .sub-link {
          display: block; padding: 0.6rem 1rem; font-size: 0.8rem;
          color: var(--text-secondary); text-decoration: none; border-radius: 8px;
          transition: 0.2s;
        }
        .sub-link:hover { color: white; padding-left: 1.2rem; }
        .sub-link.active { color: var(--accent-light); font-weight: 700; }

        .content-wrapper { flex: 1; margin-left: 280px; padding-bottom: 3rem; }
        
        .top-navbar {
          height: 80px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem; sticky top: 0; background: rgba(6, 8, 19, 0.8);
          backdrop-filter: blur(10px); z-index: 50;
        }

        .user-profile-btn {
          display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03);
          padding: 6px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer; transition: 0.2s;
        }
        .user-profile-btn:hover { background: rgba(255,255,255,0.07); }
      `}</style>

      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">
            <ShieldCheck size={24} color="white" />
          </div>
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            AA<span style={{ color: "var(--accent)" }}>AMS</span>
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <Link
            to="/admin/dashboard"
            className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <LayoutDashboard size={19} /> <span>DASHBOARD</span>
            </div>
          </Link>

          {[
            {
              id: "students",
              label: "STUDENTS",
              icon: <Users size={19} />,
              links: [
                { to: "/admin/students", l: "OVERVIEW" },
                { to: "/admin/add-student", l: "ADD STUDENT" },
                { to: "/admin/manage-students", l: "MANAGE STUDENTS" },
              ],
            },
            {
              id: "faculty",
              label: "FACULTY",
              icon: <UsersRound size={19} />,
              links: [
                { to: "/admin/add-faculty", l: "ADD FACULTY" },
                { to: "/admin/manage-faculty", l: "MANAGE FACULTY" },
              ],
            },
            {
              id: "college",
              label: "COLLEGES",
              icon: <Building2 size={19} />,
              links: [
                { to: "/admin/add-college", l: "ADD COLLEGE" },
                { to: "/admin/manage-colleges", l: "MANAGE COLLEGES" },
              ],
            },
            {
              id: "branch",
              label: "BRANCHES",
              icon: <Compass size={19} />,
              links: [
                { to: "/admin/add-branch", l: "ADD BRANCH" },
                { to: "/admin/manage-branches", l: "MANAGE BRANCHES" },
              ],
            },
            {
              id: "courses",
              label: "COURSES",
              icon: <BookOpen size={19} />,
              links: [
                { to: "/admin/add-course", l: "ADD COURSE" },
                { to: "/admin/manage-courses", l: "MANAGE COURSES" },
              ],
            },
            {
              id: "fees",
              label: "FINANCE",
              icon: <IndianRupee size={19} />,
              links: [
                { to: "/admin/add-fees", l: "SET FEES" },
                { to: "/admin/manage-fees", l: "MANAGE FEES" },
                { to: "/admin/fees-transactions", l: " TRANSACTION HISTORY" },
              ],
            },
          ].map((section) => (
            <div key={section.id}>
              <div
                className="nav-link"
                onClick={() => toggleDropdown(section.id)}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  {section.icon} <span>{section.label}</span>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    transform:
                      activeDropdown === section.id ? "rotate(180deg)" : "none",
                    transition: "0.3s",
                  }}
                />
              </div>
              <AnimatePresence>
                {activeDropdown === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="sub-menu"
                  >
                    {section.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`sub-link ${isActive(link.to) ? "active" : ""}`}
                      >
                        {link.l}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <Link
            to="/admin/manage-certificates"
            className={`nav-link ${isActive("/admin/manage-certificates") ? "active" : ""}`}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <Award size={19} /> <span>CERTIFICATES</span>
            </div>
          </Link>
        </nav>

        <div
          className="nav-link"
          style={{ color: "#f87171", marginTop: "auto" }}
          onClick={logout}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <LogOut size={19} /> <span>LOGOUT</span>
          </div>
        </div>
      </aside>

      <div className="content-wrapper">
        <header className="top-navbar">
          <h2 style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
            Welcome back, <span style={{ color: "white" }}>{adminName}</span>
          </h2>
          
          <div
            className="user-profile-btn"
            onClick={() => navigate("/admin/profile")}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                {adminName}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                Super Admin
              </div>
            </div>
            
            {/* UPDATED PROFILE IMAGE BOX */}
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--accent)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {adminPhoto ? (
                <img 
                  src={getProfileImage()} 
                  alt="Admin" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <User size={18} color="white" />
              )}
            </div>
            
          </div>
        </header>
        <main style={{ padding: "0 3rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
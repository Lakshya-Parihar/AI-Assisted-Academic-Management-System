import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  HeadphonesIcon,
  Server,
} from "lucide-react";

const App = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.adminId || !formData.password) {
      setError("Please enter your credentials");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Treating adminId as email for the backend
      const res = await axios.post(
        "http://localhost:5000/api/admin/auth/login",
        {
          email: formData.adminId,
          password: formData.password,
        },
      );

      // Save JWT
      localStorage.setItem("adminToken", res.data.token);

      // Redirect
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid Admin credentials");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kept for future logic if you implement password reset endpoint
  const handleRequestReset = (e) => {
    e.preventDefault();
    if (!formData.adminId) {
      setError("Enter your Admin Id to proceed");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView("reset");
    }, 1500);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView("success");
      setTimeout(() => setView("login"), 3000);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } },
  };

  const iconAnimation = {
    hover: { scale: 1.2, color: "#6366f1" },
    tap: { scale: 0.9 },
  };

  return (
    <div className="app-container">
      <style>{`
        /* --- GLOBAL RESET & VARS --- */
        :root {
          --bg-dark: #020617;
          --glass-bg: rgba(15, 23, 42, 0.6);
          --glass-border: rgba(30, 41, 59, 0.8);
          --primary: #6366f1;
          --primary-hover: #4f46e5;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --danger: #ef4444;
          --success: #22c55e;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }

        /* --- BACKGROUND BLOBS --- */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          opacity: 0.4;
        }
        .blob-1 {
          top: -10%; left: -10%; width: 50%; height: 50%;
          background: rgba(99, 102, 241, 0.2);
        }
        .blob-2 {
          bottom: -10%; right: -10%; width: 50%; height: 50%;
          background: rgba(147, 51, 234, 0.2);
        }

        /* --- LAYOUT UTILS --- */
        .wrapper {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6366f1, #9333ea);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 1.875rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          margin: 0;
          color: white;
        }
        
        .brand-highlight { color: var(--primary); }

        .subtitle {
          color: var(--text-muted);
          margin-top: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          opacity: 0.8;
        }

        /* --- CARDS & FORMS --- */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }

        .decorative-sparkle {
          position: absolute;
          top: 0; right: 0;
          padding: 1rem;
          opacity: 0.1;
          pointer-events: none;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          margin-left: 0.25rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid #334155;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .input-wrapper.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .input-icon {
          padding: 0 0.75rem 0 1rem;
          display: flex;
          color: #64748b;
        }

        input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.875rem 1rem 0.875rem 0;
          color: white;
          font-size: 0.95rem;
          outline: none;
        }

        input::placeholder { color: #475569; }

        .eye-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          position: absolute;
          right: 0.75rem;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: #cbd5e1; }

        /* --- CHECKBOX --- */
        .checkbox-group {
          display: flex;
          align-items: center;
          padding: 0 0.25rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 1px solid #334155;
          border-radius: 6px;
          background: rgba(30, 41, 59, 0.5);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        input[type="checkbox"] {
          display: none;
        }

        input[type="checkbox"]:checked + .checkbox-custom {
          background: var(--primary);
          border-color: var(--primary);
        }

        .check-icon {
          width: 14px;
          height: 14px;
          color: white;
          opacity: 0;
          transition: opacity 0.2s;
        }

        input[type="checkbox"]:checked + .checkbox-custom .check-icon {
          opacity: 1;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .checkbox-label:hover .checkbox-text { color: #cbd5e1; }

        /* --- BUTTONS --- */
        .btn-primary {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          background: linear-gradient(to right, #6366f1, #9333ea);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: box-shadow 0.3s;
        }
        .btn-primary:hover {
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.25);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-link {
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.875rem;
          cursor: pointer;
          margin-top: 1rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .btn-link:hover { color: var(--primary); }

        .btn-back {
          background: none;
          border: none;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .btn-back:hover { color: white; }

        /* --- ALERTS & MISC --- */
        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 0.875rem;
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .success-icon-box {
          width: 80px;
          height: 80px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
        }

        /* --- ADMIN FOOTER --- */
        .admin-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(30, 41, 59, 0.5);
          display: flex;
          justify-content: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(2, 6, 23, 0.5);
          border-radius: 999px;
          border: 1px solid rgba(30, 41, 59, 1);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        
        .status-text {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .support-link {
          font-size: 0.8rem;
          color: #64748b;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          transition: color 0.2s;
          cursor: pointer;
        }
        .support-link:hover { color: var(--primary); }

        .text-center { text-align: center; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
      `}</style>

      {/* Decorative Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="wrapper">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header"
        >
          <motion.div
            animate={{ rotate: view === "login" ? 0 : 360 }}
            className="logo-box"
          >
            <ShieldCheck size={32} color="white" />
          </motion.div>
          <h1>
            AA<span className="brand-highlight">AMS</span>
          </h1>
          <p className="subtitle">Administrative Control Panel</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* LOGIN VIEW */}
          {view === "login" && (
            <motion.div
              key="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <div className="decorative-sparkle">
                <Sparkles size={48} color="#818cf8" />
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="label">ADMIN EMAIL</label>
                  <div
                    className={`input-wrapper ${isHovered === "adminId" ? "active" : ""}`}
                    onMouseEnter={() => setIsHovered("adminId")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="input-icon">
                      <motion.div
                        animate={
                          isHovered === "adminId" ? iconAnimation.hover : {}
                        }
                      >
                        <User size={20} />
                      </motion.div>
                    </div>
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="e.g. example@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">PASSWORD</label>
                  <div
                    className={`input-wrapper ${isHovered === "password" ? "active" : ""}`}
                    onMouseEnter={() => setIsHovered("password")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="input-icon">
                      <motion.div
                        animate={
                          isHovered === "password" ? iconAnimation.hover : {}
                        }
                      >
                        <Lock size={20} />
                      </motion.div>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-btn"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                {/* <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        name="rememberMe" 
                        checked={formData.rememberMe} 
                        onChange={handleChange} 
                      />
                      <div className="checkbox-custom">
                        <Check className="check-icon" />
                      </div>
                    </div>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                </div> */}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-alert"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Admin Login <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>

                {/* IT Support Contact */}
                <div className="text-center">
                  <div className="support-link">
                    <HeadphonesIcon size={14} />
                    <span>Issue with credentials? Contact IT Support</span>
                  </div>
                </div>

                {/* System Status */}
                <div className="admin-footer">
                  <div className="status-badge">
                    <div className="status-dot" />
                    <span className="status-text">System v2.4.0: Online</span>
                    <Server size={12} className="text-slate-500 ml-1" />
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* HIDDEN: Forgot & Reset views exist in logic but aren't navigable */}
          {view === "forgot" && (
            <motion.div
              key="forgot"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <button onClick={() => setView("login")} className="btn-back">
                <ArrowLeft size={12} /> Back
              </button>
              <div className="text-center mb-6">
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "0.5rem",
                  }}
                >
                  Recover Access
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Verify your Admin ID to reset your password.
                </p>
              </div>
              <form onSubmit={handleRequestReset}>
                <div className="form-group">
                  <label className="label">Admin ID</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="adminId"
                      value={formData.adminId}
                      onChange={handleChange}
                      placeholder="ADM-2024-X"
                    />
                  </div>
                </div>
                {error && <div className="error-alert">{error}</div>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? "Sending Request..." : "Verify Identity"}
                </motion.button>
              </form>
            </motion.div>
          )}

          {view === "reset" && (
            <motion.div
              key="reset"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card"
            >
              <div className="text-center mb-6">
                <div
                  className="logo-box"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    width: "48px",
                    height: "48px",
                    marginBottom: "1rem",
                    boxShadow: "none",
                  }}
                >
                  <CheckCircle2 color="#22c55e" size={24} />
                </div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "0.5rem",
                  }}
                >
                  Create New Password
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Identity verified. Secure your admin account.
                </p>
              </div>
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label className="label">New Password</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Confirm Password</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {error && <div className="error-alert">{error}</div>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    background: "linear-gradient(to right, #16a34a, #0d9488)",
                  }}
                >
                  {isLoading ? "Updating..." : "Set New Password"}
                </motion.button>
              </form>
            </motion.div>
          )}

          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card text-center"
              style={{ padding: "3rem" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="success-icon-box"
              >
                <CheckCircle2 color="white" size={40} />
              </motion.div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.5rem",
                }}
              >
                Success!
              </h2>
              <p style={{ color: "#94a3b8" }}>
                Admin credentials updated. Redirecting to login...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Sparkles,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

/**
 * ScholarAI Student Portal - Login & Recovery
 * High-performance glassmorphism UI with Framer Motion.
 * Backend Logic Integrated.
 */

const StudentLogin = () => {
  // Views: 'login', 'forgot', 'reset', 'success'
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  /* ================= LOGIC ================= */

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

    if (!formData.enrollmentNumber || !formData.password) {
      setError("Please enter your credentials");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // API Call
      const res = await axios.post(
        "http://localhost:5001/api/student/auth/login",
        {
          enrollment_no: formData.enrollmentNumber, // Mapping UI state to Backend expectation
          password: formData.password,
        },
      );

      // Store Token & Data
      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("studentData", JSON.stringify(res.data.student));

      // Redirect
      // 🔐 FORCE PASSWORD CHANGE ON FIRST LOGIN
      if (res.data.student.is_first_login === 1) {
        navigate("/student/reset-password");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      // Error Handling
      if (err.response?.status === 401) {
        setError("Invalid enrollment ID or password");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestReset = (e) => {
    e.preventDefault();
    if (!formData.enrollmentNumber) {
      setError("Enter your enrollment number to proceed");
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

  /* ================= UI & CSS ================= */

  return (
    <div className="login-container">
      {/* CSS STYLES */}
      <style>{`
        :root {
          --bg-dark: #020617;
          --card-bg: rgba(15, 23, 42, 0.6);
          --border-color: #1e293b;
          --primary-cyan: #06b6d4;
          --primary-blue: #2563eb;
          --text-main: #ffffff;
          --text-muted: #94a3b8;
          --input-bg: rgba(30, 41, 59, 0.4);
          --error-bg: rgba(239, 68, 68, 0.1);
          --error-text: #f87171;
        }
 
        * { box-sizing: border-box; }

        body {
          margin: 0;
        }

        .login-container {
          min-height: 100vh;
          background-color: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        /* Background Blobs */
        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          opacity: 0.3;
          pointer-events: none;
        }
        .blob-cyan {
          background: rgba(6, 182, 212, 0.2);
          top: -100px;
          right: -100px;
        }
        .blob-blue {
          background: rgba(37, 99, 235, 0.2);
          bottom: -100px;
          left: -100px;
        }

        .auth-wrapper {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
          margin-bottom: 1.25rem;
          box-shadow: 0 10px 30px -5px rgba(6, 182, 212, 0.4);
        }

        .app-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .highlight { color: #22d3ee; }

        .app-subtitle {
          color: var(--text-muted);
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .glass-card {
          background: var(--card-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .sparkle-icon {
          position: absolute;
          top: 0;
          right: 0;
          padding: 1.5rem;
          opacity: 0.05;
          color: #22d3ee;
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.6rem;
          margin-left: 0.25rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1px solid #334155;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .input-group.active {
          border-color: var(--primary-cyan);
          background: rgba(30, 41, 59, 0.6);
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
        }

        .input-icon {
          padding-left: 1.25rem;
          display: flex;
          color: #64748b;
        }

        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1rem;
          color: var(--text-main);
          font-size: 1rem;
          outline: none;
        }
        .input-field::placeholder { color: #475569; }

        .eye-btn {
          background: none;
          border: none;
          position: absolute;
          right: 1rem;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #cbd5e1; }

        .error-box {
          background: var(--error-bg);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error-text);
          font-size: 0.875rem;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-primary {
          width: 100%;
          padding: 1.1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          border: none;
          background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(6, 182, 212, 0.4);
          filter: brightness(1.1);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0px);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer-link {
          text-align: center;
          margin-top: 1rem;
        }
        .btn-text {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-text:hover { color: #22d3ee; }

        .success-view {
          text-align: center;
          padding: 2.5rem 1rem;
        }
        .success-title { font-size: 1.75rem; font-weight: 800; color: white; margin-bottom: 0.75rem; }
        .success-desc { color: var(--text-muted); line-height: 1.5; }
      `}</style>

      {/* Background Decor */}
      <div className="blob blob-cyan" />
      <div className="blob blob-blue" />

      <div className="auth-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-header"
        >
          <div className="logo-box">
            <GraduationCap size={40} color="white" />
          </div>
          <h1 className="app-title">
            AA<span className="highlight">AMS</span>
          </h1>
          <p className="app-subtitle">Student Portal Access</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* LOGIN VIEW */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              className="glass-card"
            >
              <div className="sparkle-icon">
                <Sparkles size={56} />
              </div>

              <form onSubmit={handleLogin} className="form-stack">
                <div>
                  <label className="label">ENROLLMENT NUMBER</label>
                  <div
                    className={`input-group ${isHovered === "enroll" ? "active" : ""}`}
                    onMouseEnter={() => setIsHovered("enroll")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="input-icon">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      placeholder="e.g. EN2024001"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">PASSWORD</label>
                  <div
                    className={`input-group ${isHovered === "pass" ? "active" : ""}`}
                    onMouseEnter={() => setIsHovered("pass")}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="input-icon">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-btn"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="error-box"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}

                <button disabled={isLoading} className="btn-primary">
                  {isLoading ? "Validating Credentials..." : "Secure Login"}
                </button>

                <div className="footer-link">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                    }}
                    className="btn-text"
                  >
                    Trouble signing in?
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* SUCCESS VIEW */}
          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card success-view"
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                <CheckCircle2 size={48} color="#22c55e" />
              </div>
              <h2 className="success-title">Password Reset</h2>
              <p className="success-desc">
                Your credentials have been updated successfully. Returning to
                login...
              </p>
            </motion.div>
          )}

          {/* FORGOT & RESET VIEWS */}
          {(view === "forgot" || view === "reset") && (
            <motion.div
              key="others"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card"
            >
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {view === "forgot"
                    ? "Identity Verification"
                    : "Create New Password"}
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {view === "forgot"
                    ? "Confirm your enrollment ID to continue."
                    : "Set a strong, unique password for your account."}
                </p>
              </div>

              <form
                onSubmit={
                  view === "forgot" ? handleRequestReset : handlePasswordUpdate
                }
                className="form-stack"
              >
                {view === "forgot" ? (
                  <div>
                    <label className="label">Enrollment ID</label>
                    <div className="input-group">
                      <div className="input-icon">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="enrollmentNumber"
                        value={formData.enrollmentNumber}
                        onChange={handleChange}
                        placeholder="EN2024XXXX"
                        className="input-field"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="label">New Password</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <Lock size={20} />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Min. 6 characters"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Confirm New Password</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <Lock size={20} />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Match passwords"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="error-box">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <button disabled={isLoading} className="btn-primary">
                  {isLoading ? "Processing Request..." : "Continue"}
                </button>

                <div className="footer-link">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="btn-text"
                  >
                    Return to Login
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentLogin;

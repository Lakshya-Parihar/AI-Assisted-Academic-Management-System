import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle, CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CustomCSS = () => (
  <style>{`
    :root {
      --bg-dark: #020617;
      --panel-bg: rgba(15, 23, 42, 0.6);
      --border-color: rgba(30, 41, 59, 0.7);
      --indigo-primary: #6366f1;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --red: #ef4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .app-container {
      min-height: 100vh;
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    /* Background Ambience */
    .bg-orb {
      position: fixed; pointer-events: none; z-index: 0;
      border-radius: 9999px; filter: blur(120px);
    }
    .orb-1 { top: -10%; left: -10%; width: 50%; height: 50%; background: rgba(79, 70, 229, 0.15); }
    .orb-2 { bottom: -10%; right: -10%; width: 50%; height: 50%; background: rgba(147, 51, 234, 0.1); }

    /* Card */
    .glass-card {
      width: 100%;
      max-width: 420px;
      background: var(--panel-bg);
      border: 1px solid var(--border-color);
      border-radius: 2rem;
      backdrop-filter: blur(30px);
      padding: 3rem 2.5rem;
      box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
      position: relative;
      z-index: 10;
    }

    /* Header */
    .header-section { text-align: center; margin-bottom: 2.5rem; }
    .logo-box {
      width: 64px; height: 64px; border-radius: 1.25rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
    }
    .page-title { font-size: 1.75rem; font-weight: 800; color: white; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .page-subtitle { color: var(--text-muted); font-size: 0.85rem; }

    /* Forms */
    .input-group { margin-bottom: 1.25rem; }
    
    .input-wrapper {
      display: flex; align-items: center; gap: 0.75rem;
      background: #020617; border: 1px solid var(--border-color);
      border-radius: 1rem; padding: 0 1.25rem;
      transition: all 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: var(--indigo-primary);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }
    
    .input-field {
      width: 100%; background: none; border: none;
      padding: 1rem 0; color: white; outline: none; font-size: 0.95rem;
    }
    .input-field::placeholder { color: #475569; }

    /* Button */
    .btn-primary {
      width: 100%; padding: 1.1rem; border-radius: 1rem;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
      border: none; color: white; font-weight: 700; font-size: 1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 1rem;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Alerts */
    .error-box {
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171; font-size: 0.85rem; padding: 0.75rem 1rem;
      border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `}</style>
);

const ResetPassword = () => {
  // Logic Preservation: Fallback for localStorage to prevent preview crash
  const student = typeof window !== 'undefined' && localStorage.getItem("studentData") 
    ? JSON.parse(localStorage.getItem("studentData")) 
    : { enrollment_no: "DEMO_USER" };

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5001/api/student/auth/reset-password",
        {
          enrollment_no: student.enrollment_no,
          newPassword,
        },
      );

      alert("Password updated. Please login again.");
      localStorage.clear();
      navigate("/student/login");
    } catch (err) {
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <CustomCSS />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="glass-card"
      >
        <div className="header-section">
          <div className="logo-box">
            <Lock size={32} color="white" />
          </div>
          <h2 className="page-title">Set New Password</h2>
          <p className="page-subtitle">Create a secure password for your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-wrapper">
              <Lock size={18} color="#64748b" />
              <input
                type="password"
                className="input-field"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <CheckCircle2 size={18} color="#64748b" />
              <input
                type="password"
                className="input-field"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="error-box"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div style={{ width: '1.2rem', height: '1.2rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                Update Password <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
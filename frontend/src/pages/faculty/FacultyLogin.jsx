import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Brain,
  AlertCircle,
  Eye,
  EyeOff,
  Headphones,
  Server,
  Activity,
} from "lucide-react";

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Logic remains untouched as per request
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter your credentials");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5002/api/faculty/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );
      localStorage.setItem("facultyToken", res.data.token);
      navigate("/faculty/dashboard");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid Faculty credentials"
          : "Server error. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          --brand-primary: #F59E0B;
          --brand-dark: #000000;
          --glass-bg: rgba(10, 12, 16, 0.8);
          --glass-border: rgba(245, 158, 11, 0.2);
          --text-main: #FFFFFF;
          --text-muted: #94A3B8;
        }

        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .login-page {
          min-height: 102vh;
          background-color: var(--brand-dark);
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 40%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          overflow: hidden;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 32px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .brand-header { text-align: center; margin-bottom: 40px; }
        
        .logo-circle {
          width: 72px; height: 72px;
          background: var(--brand-primary);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
        }

        .input-group { margin-bottom: 20px; }
        .input-label { 
          font-size: 11px; font-weight: 800; color: var(--brand-primary);
          letter-spacing: 1.5px; margin-bottom: 8px; display: block;
        }

        .input-control {
          display: flex; align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 0 16px;
          transition: all 0.3s ease;
        }

        .input-control.focused {
          border-color: var(--brand-primary);
          background: rgba(245, 158, 11, 0.02);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
        }

        input {
          flex: 1; background: none; border: none; padding: 14px 12px;
          color: white; outline: none; font-size: 14px;
        }

        .btn-login {
          width: 100%; padding: 16px; border-radius: 14px; border: none;
          background: var(--brand-primary); color: #000000;
          font-weight: 800; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s ease; margin-top: 10px;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          color: #F87171; border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px; border-radius: 10px; font-size: 13px;
          margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
        }

        .footer-status {
          margin-top: 32px; display: flex; align-items: center; justify-content: center;
          gap: 12px; font-size: 11px; color: var(--text-muted);
          font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="brand-header">
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="logo-circle"
          >
            <Brain size={36} color="black" weight="bold" />
          </motion.div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "white",
              margin: 0,
            }}
          >
            AA<span style={{ color: "var(--brand-primary)" }}>AMS</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              marginTop: "4px",
              fontWeight: "600",
            }}
          >
            FACULTY ACCESS PANEL
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="input-label">OFFICIAL EMAIL</span>
            <div
              className={`input-control ${focusedField === "email" ? "focused" : ""}`}
            >
              <User
                size={18}
                color={
                  focusedField === "email"
                    ? "var(--brand-primary)"
                    : "var(--text-muted)"
                }
              />
              <input
                type="email"
                name="email"
                placeholder="faculty@institution.edu"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange}
                value={formData.email}
              />
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">PASSWORD</span>
            <div
              className={`input-control ${focusedField === "password" ? "focused" : ""}`}
            >
              <Lock
                size={18}
                color={
                  focusedField === "password"
                    ? "var(--brand-primary)"
                    : "var(--text-muted)"
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                onChange={handleChange}
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-msg"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? "AUTHORIZING..." : "LOGIN TO PORTAL"}
            {!isLoading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a
            href="#"
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Headphones size={14} /> Contact Technical Support
          </a>
        </div>

        <div className="footer-status">
          <Activity size={14} color="#22C55E" />
          <span>System Encryption Active</span>
          <ShieldCheck size={14} />
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { changePassword } from "../../services/studentApi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("Password changed successfully. Please login again.");

      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentData");

      navigate("/student/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <div
        className="view-card"
        style={{
          padding: "2.5rem",
          maxWidth: "500px",
          width: "100%",
          borderRadius: "1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <Lock size={40} color="var(--cyan-accent)" />
          <h2
            style={{
              marginTop: "0.5rem",
              fontSize: "1.8rem",
              fontWeight: 800,
            }}
          >
            Change Password
          </h2>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginTop: "0.3rem",
            }}
          >
            Update your account password securely
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <div>
            <label className="id-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label className="id-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label className="id-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Security note */}
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <ShieldCheck size={16} color="#10b981" />
            You will be logged out after changing password.
          </div>

          {/* Button */}
          <button
            type="submit"
            style={{
              marginTop: "0.8rem",
              padding: "0.9rem",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
              color: "white",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.7rem 0.8rem",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2,6,23,0.6)",
  color: "white",
  marginTop: "0.3rem",
  outline: "none",
};

export default ChangePassword;
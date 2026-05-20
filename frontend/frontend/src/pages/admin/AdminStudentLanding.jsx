import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, BookMarked } from "lucide-react";

const StudentLanding = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: "100%", maxWidth: "1000px", padding: "2rem 0" }}>
      <style>{`
        .action-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(30, 41, 59, 0.7); border-radius: 1.5rem; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; backdrop-filter: blur(30px); }
        .action-card:hover { border-color: #6366f1; background: rgba(99, 102, 241, 0.05); }
        .action-icon-lg { width: 80px; height: 80px; margin: 0 auto 1.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #818cf8; }
        .landing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; width: 100%; max-width: 1000px; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          STUDENT MANAGEMENT MODULE
        </h2>
        <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          Welcome to the central hub for student administration. Here you can register new enrollments, update academic records, and track metrics.
        </p>
      </div>

      <div className="landing-grid">
        <div className="action-card" onClick={() => navigate("/admin/add-student")}>
          <div className="action-icon-lg"><UserPlus size={36} /></div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>ADD NEW STUDENT</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Register a new student into the system with full academic and personal details.</p>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/manage-students")}>
          <div className="action-icon-lg"><BookMarked size={36} /></div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>MANAGE STUDENTS</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>View, edit, archive, or delete existing student profiles and update their status.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentLanding;
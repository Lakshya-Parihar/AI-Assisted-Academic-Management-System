import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layout,
  Clock,
  CheckCircle2,
  Library,
  Book,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. API function kept exactly as is
import { getMyCourses } from "../../services/studentApi";

const CustomCSS = () => (
  <style>{`
    .course-card {
      background: rgba(20, 25, 35, 0.6);
      border-radius: 24px;
      padding: 1.5rem;
      border: 1px solid rgba(129, 140, 248, 0.2);
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      /* Font match to sidebar */
      font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif;
    }

    .course-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 4px;
      background: linear-gradient(90deg, #818cf8, #c084fc);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .course-card:hover {
      transform: translateY(-5px);
      border-color: rgba(129, 140, 248, 0.4);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .course-card:hover::before {
      opacity: 1;
    }

    .progress-track {
      height: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      overflow: hidden;
      margin-top: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #818cf8, #c084fc);
      border-radius: 10px;
      transition: width 1s ease-in-out;
    }

    .btn-action {
      flex: 1;
      padding: 12px;
      background: rgba(129, 140, 248, 0.1);
      border: 1px solid rgba(129, 140, 248, 0.3);
      border-radius: 12px;
      color: #818cf8;
      font-size: 0.85rem;
      font-weight: 600; /* Adjusted for sidebar consistency */
      letter-spacing: 0.025em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-action:hover {
      background: rgba(129, 140, 248, 0.2);
      color: #fff;
    }
  `}</style>
);

export default function StudentCourses({ setView }) {
  const navigate = useNavigate();

  // 2. State management untouched
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fetch real courses from your database untouched
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        padding: "2.5rem 3.5rem", 
        color: "#F8FAFC", 
        fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif" 
      }}
    >
      <CustomCSS />

      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "3rem" }}>
        <div style={{ 
            padding: "1rem", 
            background: "linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(192, 132, 252, 0.2))", 
            borderRadius: "16px",
            border: "1px solid rgba(129, 140, 248, 0.3)"
        }}>
          <Book size={32} color="#818cf8" />
        </div>
        <div>
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: "700",
                margin: 0,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                fontFamily:
                  "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
              }}
            >
            My Courses
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#94A3B8", fontSize: "0.95rem", fontWeight: "500" }}>
            Current Semester Academic Load & Progression
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        
        {isLoading ? (
          <div style={{ color: "#818cf8", display: "flex", alignItems: "center", gap: "10px", fontWeight: 500 }}>
             <Clock size={20} className="animate-spin" /> Syncing course registry...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ color: "#94A3B8", background: "rgba(255,255,255,0.02)", padding: "2rem", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)", fontWeight: "500" }}>
            No courses assigned for this semester.
          </div>
        ) : (
          courses.map((course, idx) => {
            const attendance = course.attendance ?? 75;
            const progress = course.progress ?? 60;
            const assignments = course.assignments ?? { total: 10, submitted: 5 };

            return (
              <motion.div
                key={course.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="course-card"
              >
                {/* Course Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ flex: 1, paddingRight: "1rem" }}>
                    <h3 style={{ fontWeight: "700", fontSize: "1.15rem", margin: "0 0 0.25rem 0", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                      {course.course_name || "Unknown Course"}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "0.85rem", fontWeight: 500 }}>
                      <GraduationCap size={14} color="#c084fc" /> 
                      Prof. {course.faculty_name || "Not Assigned"}
                    </div>
                  </div>

                  <span style={{
                      background: "rgba(129, 140, 248, 0.15)",
                      color: "#818cf8",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      border: "1px solid rgba(129, 140, 248, 0.3)",
                      fontFamily: "monospace" /* Usually standard for codes in sidebars */
                    }}>
                    {course.course_code || "N/A"}
                  </span>
                </div>

                {/* Progress Bar Section */}
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <span>Syllabus Covered</span>
                    <span style={{ color: "#fff" }}>{progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "4px" }}>
                      Attendance
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.1rem", fontWeight: 700, color: attendance >= 75 ? "#34d399" : "#f87171" }}>
                      {attendance >= 75 ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      {attendance}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "4px" }}>
                      Assignments
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                      {assignments.submitted}
                      <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}>/ {assignments.total}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div style={{ display: "flex", marginTop: "1.5rem" }}>
                  <button onClick={() => setView("assignment")} className="btn-action">
                    <Layout size={16} /> View Assignments <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
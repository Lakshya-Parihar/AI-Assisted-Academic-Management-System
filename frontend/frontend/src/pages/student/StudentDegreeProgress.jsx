import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  FileDown,
  Shield,
  Server,
  Layout,
  LineChart,
  BookOpen,
} from "lucide-react";
import { getDegreeProgressData } from "../../services/studentApi";

const DegreeProgress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedStudent = JSON.parse(localStorage.getItem("studentData") || "{}");
  const studentId = storedStudent.id || storedStudent.student_id || 1;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await getDegreeProgressData(studentId);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load progress data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [studentId]);

  const theme = {
    bg: "#0B1120",
    panel: "rgba(30, 41, 59, 0.4)",
    panelSolid: "#1E293B",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    teal: "#10B981",
    blue: "#3B82F6",
    purple: "#A855F7",
    border: "rgba(255, 255, 255, 0.08)",
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Audit...
      </div>
    );
  }

  if (!data)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No data available.
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ marginBottom: "40px" }}>
        <p
          style={{
            color: theme.subtext,
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Degree Progress Audit
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "800",
                margin: "0 0 8px 0",
                color: theme.text,
              }}
            >
              {data.program_name}
            </h1>
            <p
              style={{
                margin: 0,
                color: theme.subtext,
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Semester {data.current_semester} Active • A schematic view of your
              journey towards institutional mastery.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: "800",
                margin: 0,
                color: theme.text,
                lineHeight: "1",
              }}
            >
              {data.total_progress}%
            </h2>
            <p
              style={{
                margin: 0,
                color: theme.subtext,
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontWeight: "700",
                marginTop: "4px",
              }}
            >
              Total Completion
            </p>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "12px",
            background: theme.panelSolid,
            borderRadius: "6px",
            marginTop: "32px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${data.total_progress}%`,
              height: "100%",
              background: `linear-gradient(90deg, #3B82F6 0%, #10B981 100%)`,
              borderRadius: "6px",
              transition: "width 1s ease-in-out",
            }}
          ></div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Active Semester Box */}
          <div
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                margin: "0 0 24px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <BookOpen size={20} color={theme.teal} /> Active Semester
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {data.active_courses.length === 0 ? (
                <p style={{ color: theme.subtext, fontSize: "14px" }}>
                  No active courses found for this semester.
                </p>
              ) : (
                data.active_courses.map((course) => (
                  <div
                    key={course.course_id}
                    style={{
                      borderLeft: `3px solid ${theme.teal}`,
                      paddingLeft: "16px",
                      background: "rgba(255,255,255,0.02)",
                      padding: "12px 12px 12px 16px",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: theme.teal,
                          fontWeight: "800",
                        }}
                      >
                        {course.course_code}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: theme.teal,
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontWeight: "700",
                        }}
                      >
                        In Progress
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme.text,
                        lineHeight: "1.4",
                      }}
                    >
                      {course.course_name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Credit Audit Box */}
          <div
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "800",
                margin: "0 0 24px 0",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: theme.subtext,
              }}
            >
              Credit Audit
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {Object.keys(data.credit_audit).map((type) => {
                const stats = data.credit_audit[type];
                if (stats.total === 0) return null;
                const percent = Math.round((stats.earned / stats.total) * 100);
                const barColor =
                  type === "Core"
                    ? theme.blue
                    : type === "Lab"
                      ? theme.teal
                      : theme.purple;

                return (
                  <div key={type}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ color: theme.subtext, fontWeight: "500" }}>
                        {type} Engineering
                      </span>
                      <span style={{ fontWeight: "700", color: theme.text }}>
                        {stats.earned} / {stats.total} Credits
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: barColor,
                          borderRadius: "3px",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              style={{
                width: "100%",
                marginTop: "40px",
                padding: "14px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
              }
            >
              <FileDown size={18} /> Download Full Transcript
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - SCHEMATIC */}
        <div
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            padding: "32px",
            gridColumn: "span 2 / span 2",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  margin: "0 0 6px 0",
                  color: theme.text,
                }}
              >
                Curriculum Schematic
              </h2>
              <p style={{ margin: 0, color: theme.subtext, fontSize: "14px" }}>
                Inter-dependency roadmap for {data.program_name}
              </p>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: theme.subtext,
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                <CheckCircle2 size={16} color={theme.teal} /> COMPLETED
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: theme.subtext,
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                <Circle size={16} color={theme.blue} /> IN PROGRESS
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              paddingLeft: "100px",
              marginTop: "20px",
            }}
          >
            {/* Main vertical timeline line */}
            <div
              style={{
                position: "absolute",
                left: "70px",
                top: "0",
                bottom: "0",
                width: "2px",
                background: theme.border,
              }}
            ></div>

            {Object.keys(data.schematic).map((yearKey) => (
              <div
                key={yearKey}
                style={{ position: "relative", marginBottom: "48px" }}
              >
                {/* Year Label */}
                <div
                  style={{
                    position: "absolute",
                    left: "-100px",
                    top: "24px",
                    width: "60px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: "800",
                    color: theme.subtext,
                    letterSpacing: "1px",
                  }}
                >
                  {yearKey}
                </div>

                {/* Horizontal branch line connecting timeline to courses */}
                <div
                  style={{
                    position: "absolute",
                    left: "-30px",
                    top: "30px",
                    width: "30px",
                    height: "2px",
                    background: theme.border,
                  }}
                ></div>

                {/* Dot on the timeline */}
                <div
                  style={{
                    position: "absolute",
                    left: "-35px",
                    top: "25px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: theme.panelSolid,
                    border: `2px solid ${theme.border}`,
                  }}
                ></div>

                {/* Courses Grid for this Year */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {data.schematic[yearKey].map((course) => {
                    const isCompleted = course.status === "Completed";
                    const isActive = course.status === "In Progress";

                    return (
                      <div
                        key={course.course_id}
                        style={{
                          background: isActive
                            ? "rgba(59, 130, 246, 0.08)"
                            : theme.panelSolid,
                          border: `1px solid ${isActive ? theme.blue : isCompleted ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)"}`,
                          borderRadius: "10px",
                          padding: "20px",
                          position: "relative",
                          opacity: course.status === "Upcoming" ? 0.5 : 1,
                          transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "translateY(-2px)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        {isCompleted && (
                          <CheckCircle2
                            size={18}
                            color={theme.teal}
                            style={{
                              position: "absolute",
                              top: "20px",
                              right: "20px",
                            }}
                          />
                        )}
                        {isActive && (
                          <div
                            style={{
                              position: "absolute",
                              top: "20px",
                              right: "20px",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: theme.blue,
                              boxShadow: "0 0 12px #3B82F6",
                            }}
                          ></div>
                        )}

                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: isCompleted
                              ? theme.teal
                              : isActive
                                ? theme.blue
                                : theme.subtext,
                            marginBottom: "8px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {course.course_code}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            color: theme.text,
                            lineHeight: "1.4",
                          }}
                        >
                          {course.course_name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER - CAREER SPECIALIZATION */}
      <div
        style={{
          background: theme.panel,
          border: `1px solid ${theme.border}`,
          borderRadius: "16px",
          padding: "40px",
          marginTop: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div style={{ maxWidth: "500px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "800",
              margin: "0 0 12px 0",
              color: theme.text,
            }}
          >
            Curriculum Specialization
          </h2>
          <p
            style={{
              margin: 0,
              color: theme.subtext,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Your current course selection aligns{" "}
            <strong style={{ color: theme.text }}>82%</strong> with the{" "}
            <strong style={{ color: theme.text }}>
              Senior Systems Engineer
            </strong>{" "}
            profile in our career ledger.
          </p>
        </div>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", opacity: 0.7 }}>
            <Server
              size={28}
              color={theme.subtext}
              style={{ margin: "0 auto 12px auto" }}
            />
            <div
              style={{ fontSize: "14px", fontWeight: "800", color: theme.text }}
            >
              Backend
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.subtext,
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              ADVANCED
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Layout
              size={28}
              color={theme.teal}
              style={{ margin: "0 auto 12px auto" }}
            />
            <div
              style={{ fontSize: "14px", fontWeight: "800", color: theme.teal }}
            >
              Architect
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.teal,
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              INTERMEDIATE
            </div>
          </div>
          <div style={{ textAlign: "center", opacity: 0.7 }}>
            <Shield
              size={28}
              color={theme.subtext}
              style={{ margin: "0 auto 12px auto" }}
            />
            <div
              style={{ fontSize: "14px", fontWeight: "800", color: theme.text }}
            >
              Security
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.subtext,
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              FUNDAMENTAL
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <LineChart
              size={28}
              color={theme.blue}
              style={{ margin: "0 auto 12px auto" }}
            />
            <div
              style={{ fontSize: "14px", fontWeight: "800", color: theme.blue }}
            >
              Data Sci
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.blue,
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              INTERMEDIATE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeProgress;

import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Users,
  BookOpen,
  Clock,
  ArrowRight,
  Bell,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  Zap,
  MoreVertical,
  ClipboardList,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
// Import the real API calls you provided
import {
  getFacultyProfile,
  getFacultyDashboardData,
} from "../../services/facultyApi";

const CustomCSS = ({ darkMode }) => (
  <style>{`
    :root {
      --fac-bg: ${darkMode ? "#0B0E14" : "#F8FAFC"};
      --fac-panel: ${darkMode ? "rgba(20, 25, 35, 0.7)" : "#FFFFFF"};
      --fac-border: ${darkMode ? "rgba(45, 55, 72, 0.5)" : "#E2E8F0"};
      --fac-text-main: ${darkMode ? "#F8FAFC" : "#1E293B"};
      --fac-text-muted: ${darkMode ? "#94A3B8" : "#64748B"};
      --fac-primary: #F59E0B;
      --fac-primary-glow: rgba(245, 158, 11, 0.15);
      --fac-indigo: #6366F1;
      --fac-success: #10B981;
      --fac-danger: #EF4444;
    }

    .fac-wrapper {
      background-color: var(--fac-bg);
      color: var(--fac-text-main);
      min-height: 100vh;
      padding: 2.5rem 3.5rem;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .fac-glass-card {
      background: var(--fac-panel);
      border: 1px solid var(--fac-border);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(16px);
      box-shadow: ${darkMode ? "0 20px 40px rgba(0, 0, 0, 0.2)" : "0 10px 30px rgba(0, 0, 0, 0.05)"};
      transition: all 0.3s ease;
    }

    .fac-glass-card:hover {
      border-color: rgba(245, 158, 11, 0.3);
      transform: translateY(-2px);
    }

    .stat-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .course-card {
      background: ${darkMode ? "rgba(255, 255, 255, 0.02)" : "#FAFBFC"};
      border: 1px solid var(--fac-border);
      border-radius: 16px;
      padding: 1.25rem;
      transition: 0.2s;
    }
    
    .course-card:hover {
      background: ${darkMode ? "rgba(255, 255, 255, 0.04)" : "#F1F5F9"};
      border-color: var(--fac-primary);
    }

    .progress-bar-bg {
      height: 6px;
      background: var(--fac-border);
      border-radius: 8px;
      overflow: hidden;
      margin-top: 8px;
    }

    .progress-bar-fill {
      height: 100%;
      background: var(--fac-primary);
      border-radius: 8px;
      transition: width 1s ease-in-out;
    }

    .action-btn {
      padding: 8px 12px;
      background: transparent;
      border: 1px solid var(--fac-border);
      color: var(--fac-text-main);
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: 0.2s;
    }

    .action-btn:hover {
      background: var(--fac-primary-glow);
      border-color: var(--fac-primary);
      color: var(--fac-primary);
    }

    .task-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--fac-border);
    }
    .task-row:last-child { border-bottom: none; }

    .timeline-item {
      position: relative;
      padding-left: 24px;
      padding-bottom: 24px;
      border-left: 2px solid var(--fac-border);
    }
    .timeline-item:last-child { border-left-color: transparent; padding-bottom: 0; }
    .timeline-dot {
      position: absolute;
      left: -6px;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--fac-primary);
      box-shadow: 0 0 0 4px var(--fac-bg);
    }
  `}</style>
);

const FacultyDashboard = () => {
  const ctx = useOutletContext();
  const darkMode = ctx?.darkMode ?? true;
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  // Real Data States
  const [facultyName, setFacultyName] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    activeCourses: [],
    actionItems: [],
    schedule: [],
    riskAlerts: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Time Tracker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Real Data - Merged into a single robust function
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        let facId = null;
        let fName = "Faculty Member";

        // Try to get profile from API first
        try {
          const profileRes = await getFacultyProfile();
          // Check for both id and faculty_id to be safe
          facId = profileRes.data?.id || profileRes.data?.faculty_id;
          fName = profileRes.data?.full_name || profileRes.data?.name || fName;
        } catch (e) {
          console.warn(
            "Profile fetch failed, falling back to local storage",
            e,
          );
        }

        // Fallback to local storage if API fails or doesn't return ID
        if (!facId) {
          const localData = JSON.parse(localStorage.getItem("facultyData"));
          facId = localData?.id || localData?.faculty_id;
          fName = localData?.full_name || localData?.name || fName;
        }

        setFacultyName(fName);

        if (facId) {
          // Fetch the Dashboard aggregates
          const dashRes = await getFacultyDashboardData(facId);
          if (dashRes.data) {
            setDashboardData(dashRes.data);
          }
        } else {
          console.error("No faculty ID found to fetch dashboard data.");
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Helper to map string icon names from DB to Lucide components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "Users":
        return Users;
      case "CheckSquare":
        return CheckSquare;
      case "Clock":
        return Clock;
      case "Award":
        return Award;
      case "BookOpen":
        return BookOpen; // Added this missing icon map
      default:
        return Users;
    }
  };

  if (isLoading) {
    return (
      <div
        className="fac-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomCSS darkMode={darkMode} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "var(--fac-primary)",
          }}
        >
          <Loader2 size={40} className="animate-spin" />
          <h2 style={{ margin: 0, fontWeight: 800 }}>
            Initializing Faculty Secure Workspace...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fac-wrapper">
      <CustomCSS darkMode={darkMode} />

      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "3rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--fac-success)",
                boxShadow: "0 0 10px var(--fac-success)",
              }}
            ></div>
            <span
              style={{
                color: "var(--fac-text-muted)",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • Faculty Portal
            </span>
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            {getGreeting()},{" "}
            <span style={{ color: "var(--fac-primary)" }}>
              Prof. {facultyName?.split(" ")[0] || facultyName}
            </span>
          </h1>
          <p
            style={{
              color: "var(--fac-text-muted)",
              fontSize: "1rem",
              marginTop: "4px",
            }}
          >
            Here is your academic overview and required actions for today.
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            style={{
              background: "var(--fac-panel)",
              border: "1px solid var(--fac-border)",
              color: "var(--fac-text-main)",
              padding: "12px",
              borderRadius: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* STATS MATRIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {dashboardData.stats?.map((item, idx) => {
          const Icon = getIconComponent(item.iconName);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="fac-glass-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="stat-icon-box"
                  style={{ background: item.bg, color: item.color }}
                >
                  <Icon size={24} />
                </div>
                <TrendingUp size={16} color="var(--fac-success)" />
              </div>
              <h4 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>
                {item.value}
              </h4>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--fac-text-muted)",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "0.75rem",
                  color: "var(--fac-text-muted)",
                  opacity: 0.8,
                }}
              >
                {item.sub}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "2rem",
        }}
      >
        {/* LEFT COLUMN: Main Workspace */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Action Center / To-Do */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="fac-glass-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: 0,
                }}
              >
                <ClipboardList color="var(--fac-primary)" size={22} /> Action
                Center
              </h2>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--fac-text-muted)",
                  fontWeight: 600,
                }}
              >
                {(dashboardData.actionItems || []).length} Pending Tasks
              </span>
            </div>
            <div>
              {dashboardData.actionItems?.map((item) => (
                <div key={item.id} className="task-row">
                  <div style={{ paddingTop: "2px" }}>
                    {item.urgent ? (
                      <AlertCircle size={18} color="var(--fac-danger)" />
                    ) : (
                      <CheckCircle2 size={18} color="var(--fac-text-muted)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: item.urgent
                          ? "var(--fac-text-main)"
                          : "var(--fac-text-muted)",
                      }}
                    >
                      {item.task}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "0.8rem",
                        color: "var(--fac-text-muted)",
                      }}
                    >
                      {item.course} •{" "}
                      <span
                        style={{
                          color: item.urgent ? "var(--fac-danger)" : "inherit",
                        }}
                      >
                        {item.due}
                      </span>
                    </p>
                  </div>
                  <button
                      onClick={() => navigate("/faculty/grades")}
                      className="action-btn"
                    // style={{ padding: "6px 12px" }}

                    >
                    Review
                  </button>
                </div>
              ))}
              {(!dashboardData.actionItems ||
                dashboardData.actionItems.length === 0) && (
                <p
                  style={{
                    color: "var(--fac-text-muted)",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    margin: "2rem 0",
                  }}
                >
                  All caught up! No pending actions.
                </p>
              )}
            </div>
          </motion.div>

          {/* Active Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="fac-glass-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                Course Management
              </h2>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {(dashboardData.activeCourses || []).map((course) => (
                <div key={course.id} className="course-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "var(--fac-primary-glow)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BookOpen size={18} color="var(--fac-primary)" />
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "1.1rem",
                              fontWeight: 800,
                            }}
                          >
                            {course.title}
                          </h4>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "0.7rem",
                              fontWeight: 800,
                              background: "var(--fac-bg)",
                              border: "1px solid var(--fac-border)",
                              color: "var(--fac-text-muted)",
                            }}
                          >
                            {course.code}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "0.8rem",
                            color: "var(--fac-text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          <Users
                            size={12}
                            style={{
                              display: "inline",
                              marginRight: "4px",
                              position: "relative",
                              top: "2px",
                            }}
                          />{" "}
                          {course.students} Students • Next: {course.nextClass}
                        </p>
                      </div>
                    </div>

                    <div style={{ width: "120px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ color: "var(--fac-text-muted)" }}>
                          Syllabus
                        </span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${course.progress}%`,
                            background:
                              course.progress === 100
                                ? "var(--fac-success)"
                                : "var(--fac-primary)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Quick Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--fac-border)",
                    }}
                  >
                    <button
                      onClick={() => navigate("/faculty/attendance")}
                      className="action-btn"
                    >
                      <CheckSquare size={14} /> Attendance
                    </button>
                    <button
                      onClick={() => navigate("/faculty/assignments")}
                      className="action-btn"
                    >
                      <FileText size={14} /> Assignments
                    </button>
                    <button
                      onClick={() => navigate("/faculty/grades")}
                      className="action-btn"
                    >
                      <Award size={14} /> Grades
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button className="action-btn" style={{ border: "none" }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {(!dashboardData.activeCourses ||
                dashboardData.activeCourses.length === 0) && (
                <p
                  style={{
                    color: "var(--fac-text-muted)",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  No assigned courses found.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Sidebar Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Timeline Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="fac-glass-card"
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: 0,
              }}
            >
              <Calendar size={18} color="var(--fac-primary)" /> Today's Schedule
            </h3>
            <div style={{ marginLeft: "8px", marginTop: "1rem" }}>
              {dashboardData.schedule?.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div
                    className="timeline-dot"
                    style={{
                      background: item.active
                        ? "var(--fac-primary)"
                        : "var(--fac-border)",
                    }}
                  ></div>
                  <div style={{ position: "relative", top: "-4px" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: item.active
                          ? "var(--fac-primary)"
                          : "var(--fac-text-muted)",
                      }}
                    >
                      {item.time}
                    </p>
                    <h5
                      style={{
                        margin: "4px 0",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--fac-text-main)",
                      }}
                    >
                      {item.event}
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        color: "var(--fac-text-muted)",
                      }}
                    >
                      {item.loc}
                    </p>
                  </div>
                </div>
              ))}
              {(!dashboardData.schedule ||
                dashboardData.schedule.length === 0) && (
                <p
                  style={{
                    color: "var(--fac-text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  No events scheduled for today.
                </p>
              )}
            </div>
          </motion.div>

          {/* AI Insights / Risk Alerts */}
          {dashboardData.riskAlerts && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="fac-glass-card"
              style={{
                background:
                  "linear-gradient(145deg, var(--fac-panel), rgba(239, 68, 68, 0.05))",
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  margin: "0 0 1rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--fac-danger)",
                }}
              >
                <ShieldAlert size={18} /> Student Risk Alerts
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--fac-text-muted)",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                }}
              >
                Nexus AI has identified{" "}
                <strong>{dashboardData.riskAlerts.count} students</strong> in{" "}
                {dashboardData.riskAlerts.course} who have missed consecutive
                assignments and are at risk of failing.
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "var(--fac-danger)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                Review Flagged Students
              </button>
            </motion.div>
          )}

          {/* Quick Tools Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fac-glass-card"
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                margin: "0 0 1rem 0",
              }}
            >
              Quick Resources
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {[
                { label: "Syllabus", icon: BookOpen, path: "/faculty/courses" },
                { label: "Circulars", icon: Bell, path: "/faculty/circulars" },
                {
                  label: "Analytics",
                  icon: TrendingUp,
                  path: "/faculty/analytics",
                },
              ].map((tool, i) => (
                <button
                  key={i}
                  onClick={() => navigate(tool.path)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "16px 10px",
                    background: "var(--fac-bg)",
                    border: "1px solid var(--fac-border)",
                    borderRadius: "12px",
                    color: "var(--fac-text-main)",
                    cursor: "pointer",
                  }}
                >
                  <tool.icon size={20} color="var(--fac-primary)" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Award,
  AlertCircle,
  Sparkles,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
 
// 🔥 Use the named export we set up in studentApi.js
import { getMyGrades } from "../../services/studentApi";

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);

  // 🔥 New state variables to capture your rich backend payload!
  const [gpaData, setGpaData] = useState({
    cumulative: "0.00",
    standing: "",
    trend: "",
  });
  const [chartData, setChartData] = useState([]);
  const [aiForecast, setAiForecast] = useState({
    predicted: "0.00",
    confidence: 0,
  });
  const [insight, setInsight] = useState("");

  const [loading, setLoading] = useState(true);
  const [examFilter, setExamFilter] = useState("Mid-Sem");

  const theme = {
    cardBg: "rgba(15, 23, 42, 0.4)",
    border: "rgba(30, 41, 59, 0.7)",
    text: "#f8fafc",
    subtext: "#94a3b8",
    inputBg: "#020617",
    accent: "#6366f1",
    aiGlow: "rgba(139, 92, 246, 0.15)",
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const res = await getMyGrades();

        // Map all your amazing backend data to state
        setGrades(res.data.grades || []);
        setInsight(
          res.data.insight || "AIAAMS is analyzing your trajectory...",
        );
        if (res.data.gpaData) setGpaData(res.data.gpaData);
        if (res.data.chartData) setChartData(res.data.chartData);
        if (res.data.aiForecast) setAiForecast(res.data.aiForecast);
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const filteredGrades = grades.filter(
    (g) => !g.exam_type || g.exam_type === examFilter,
  );

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: theme.text,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
            fontFamily:
                "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
          }}
        >
          My Grades
        </h1>
        <p style={{ color: theme.subtext, fontSize: "1rem" }}>
          Manage your active assessments and view high-fidelity academic
          tracking.
        </p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.5fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* WIDGET 1: CUMULATIVE GPA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.border}`,
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                color: theme.subtext,
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <Activity size={16} /> Cumulative GPA
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "8px" }}
            >
              <span
                style={{
                  fontSize: "4rem",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                {gpaData.cumulative}
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: theme.subtext,
                }}
              >
                / 4.0
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ color: theme.subtext }}>Academic Standing</span>
            <span
              style={{
                color: "#10b981",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <TrendingUp size={14} /> {gpaData.standing || "Evaluating..."}
            </span>
          </div>
        </motion.div>

        {/* WIDGET 2: AI FORECAST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${theme.cardBg}, ${theme.aiGlow})`,
            backdropFilter: "blur(20px)",
            border: `1px solid rgba(139, 92, 246, 0.3)`,
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#c4b5fd",
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Sparkles size={16} /> AIAAMS Forecast
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                color: "#c4b5fd",
                lineHeight: 1,
              }}
            >
              {aiForecast.predicted || "0.00"}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: theme.subtext,
              }}
            >
              Est. GPA
            </span>
          </div>

          <div
            style={{
              marginTop: "auto",
              fontSize: "0.95rem",
              color: theme.text,
              lineHeight: 1.5,
              background: "rgba(0,0,0,0.2)",
              padding: "12px",
              borderRadius: "8px",
              borderLeft: "3px solid #8b5cf6",
            }}
          >
            {loading ? (
              <span style={{ animation: "pulse 2s infinite" }}>
                Analyzing trajectory...
              </span>
            ) : (
              insight
            )}
          </div>
        </motion.div>

        {/* WIDGET 3: PERFORMANCE TRAJECTORY CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.border}`,
            borderRadius: "1.5rem",
            padding: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "1.1rem",
                margin: 0,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              GPA Progression Velocity
            </h2>
            <span
              style={{
                background: theme.inputBg,
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                color: theme.subtext,
                fontWeight: 700,
              }}
            >
              SEM
            </span>
          </div>

          <div style={{ flex: 1, minHeight: "180px" }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.subtext}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme.subtext}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 4.0]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke={theme.accent}
                    strokeWidth={3}
                    dot={{ r: 4, fill: theme.accent, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: theme.subtext,
                }}
              >
                Analysis data syncing...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* RESULT OVERVIEW LIST (Raw Course Grades) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: theme.cardBg,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.border}`,
          borderRadius: "1.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem 2rem",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(2, 6, 23, 0.4)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Award size={20} color={theme.accent} />
            <h2
              style={{
                color: "white",
                fontSize: "1.2rem",
                margin: 0,
                fontWeight: 700,
              }}
            >
              Course Breakdowns
            </h2>
          </div>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            style={{
              background: theme.inputBg,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              fontSize: "0.95rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="Mid-Sem">Mid-Semester</option>
            <option value="Final-Sem">Final Semester</option>
            <option value="Practical">Practicals</option>
          </select>
        </div>

        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", color: theme.subtext }}>
              Loading your secure ledger...
            </div>
          ) : filteredGrades.length === 0 ? (
            <div style={{ textAlign: "center", color: theme.subtext }}>
              No evaluations posted for this category yet.
            </div>
          ) : (
            <AnimatePresence>
              {filteredGrades.map((grade, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.5rem",
                    background: "rgba(2, 6, 23, 0.4)",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        background: theme.inputBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <BookOpen size={24} color={theme.accent} />
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: theme.text,
                          fontSize: "1.1rem",
                          fontWeight: "600",
                        }}
                      >
                        {grade.course_name}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: theme.subtext,
                          fontSize: "0.85rem",
                          marginTop: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <GraduationCap size={14} /> {grade.course_code}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {grade.marks_obtained !== null ? (
                      <>
                        <div
                          style={{
                            color: theme.subtext,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            marginBottom: "4px",
                          }}
                        >
                          {grade.exam_type} Score
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "4px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.75rem",
                              fontWeight: 800,
                              color: "white",
                            }}
                          >
                            {grade.marks_obtained}
                          </span>
                          <span
                            style={{
                              fontSize: "1rem",
                              color: theme.subtext,
                              fontWeight: 600,
                            }}
                          >
                            / {grade.total_marks || 100}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: theme.subtext,
                          background: theme.inputBg,
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <AlertCircle size={16} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                          Awaiting Evaluation
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}

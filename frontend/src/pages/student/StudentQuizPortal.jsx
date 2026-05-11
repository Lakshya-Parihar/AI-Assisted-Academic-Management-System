import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Zap,
  AlertCircle,
  BarChart2,
  TrendingUp,
  Filter,
  CheckCircle2,
  PlayCircle,
  Clock,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Flag,
  Award,
  Search,
  Eye,
  ShieldCheck,
} from "lucide-react";

import {
  getStudentQuizzes,
  getMyGrades,
  getQuizQuestions,
  submitQuizResult,
} from "../../services/studentApi";

export default function StudentQuizPortal() {
  // --- CORE STATE (Logic preserved exactly from source)[cite: 8] ---
  const [loading, setLoading] = useState(true);
  const [gpaData, setGpaData] = useState({
    cumulative: "0.00",
    standing: "Evaluating...",
    trend: "+0.00",
  });
  const [chartData, setChartData] = useState([]);
  const [aiForecast, setAiForecast] = useState({
    predicted: "0.00",
    probabilities: [],
    confidence: 0,
    alert: null,
  });
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState(null);

  // --- ACTIVE QUIZ STATE ---
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const theme = {
    bg: "#0B1120",
    cardBg: "rgba(15, 23, 42, 0.6)",
    border: "rgba(129, 140, 248, 0.2)",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    accent: "#818cf8", // Indigo
    secondary: "#c084fc", // Purple
    success: "#34d399",
    danger: "#f87171",
  };

  // --- LOGIC HANDLERS (Untouched)[cite: 8] ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const gradesRes = await getMyGrades();
        if (gradesRes.data) {
          setGpaData((prev) => gradesRes.data.gpaData || prev);
          setChartData((prev) => gradesRes.data.chartData || prev);
          setAiForecast((prev) => gradesRes.data.aiForecast || prev);
        }
      } catch (e) {
        console.warn("Grades fallback used.");
      }

      const quizRes = await getStudentQuizzes();
      if (quizRes.data) {
        setQuizzes(quizRes.data.quizzes || []);
        setResults(quizRes.data.results || []);
        setStudentId(quizRes.data.studentId);
      }
    } catch (error) {
      console.error("Error dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStartQuiz = async (quiz) => {
    setLoading(true);
    try {
      const res = await getQuizQuestions(quiz.id);
      setQuestions(res.data);
      setActiveQuiz(quiz);
      setCurrentQ(0);
      setAnswers({});
      setFlagged({});
      setTimeLeft(quiz.time_limit * 60);
      setQuizResult(null);
    } catch (err) {
      alert("Secure fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !quizResult) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && activeQuiz && !quizResult) {
      handleSubmitQuiz();
    }
  }, [activeQuiz, timeLeft, quizResult]);

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      let score = 0;
      let totalPoints = 0;
      questions.forEach((q) => {
        totalPoints += q.points || 1;
        if (String(answers[q.id]) === String(q.correct_option_id)) {
          score += q.points || 1;
        }
      });
      await submitQuizResult({
        student_id: studentId,
        quiz_id: activeQuiz.id,
        score,
        total_points: totalPoints,
      });
      setQuizResult({ score, totalPoints });
      fetchDashboardData();
    } catch (e) {
      alert("Error submitting quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const getOptionText = (opt) => {
    if (!opt) return "Option";
    if (typeof opt === "string") return opt;
    return opt.text || opt.value || opt.label || String(opt);
  };

  // --- REDESIGNED VIEW 1: ACTIVE QUIZ ENGINE[cite: 8] ---
  if (activeQuiz) {
    return (
      <div
        style={{
          backgroundColor: theme.bg,
          color: theme.text,
          minHeight: "100vh",
          fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
        }}
      >
        {!quizResult ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header / HUD */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2rem 3rem",
                borderBottom: `1px solid ${theme.border}`,
                background: "rgba(15, 23, 42, 0.4)",
              }}
            >
              <div>
                <h2
                  style={{ fontSize: "1.8rem", fontWeight: "800", margin: 0 }}
                >
                  {activeQuiz.title}
                </h2>
                <p
                  style={{
                    color: theme.subtext,
                    fontSize: "0.9rem",
                    margin: "4px 0 0 0",
                  }}
                >
                  {activeQuiz.course_name} • {activeQuiz.course_code}
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={hudCardStyle(theme)}>
                  <span style={hudLabelStyle(theme)}>TIME REMAINING</span>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "800",
                      color: timeLeft < 60 ? theme.danger : theme.success,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Clock size={18} /> {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                  </div>
                </div>
                <div style={hudCardStyle(theme)}>
                  <span style={hudLabelStyle(theme)}>PROGRESS</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: "800" }}>
                    {Object.keys(answers).length} / {questions.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: "3rem",
                padding: "3rem",
              }}
            >
              <div
                style={{
                  background: theme.cardBg,
                  borderRadius: "24px",
                  padding: "3rem",
                  border: `1px solid ${theme.border}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    color: theme.accent,
                    letterSpacing: "2px",
                    marginBottom: "1.5rem",
                  }}
                >
                  QUESTION {currentQ + 1} OF {questions.length}
                </div>
                <h3
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "600",
                    lineHeight: 1.5,
                    marginBottom: "3rem",
                  }}
                >
                  {questions[currentQ]?.question_text}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {(() => {
                    let opts = [];
                    try {
                      opts =
                        typeof questions[currentQ]?.options === "string"
                          ? JSON.parse(questions[currentQ].options)
                          : questions[currentQ]?.options || [];
                    } catch (e) {
                      console.error(e);
                    }

                    return opts.map((opt, i) => {
                      const isSelected =
                        answers[questions[currentQ].id] ===
                        (opt.id || String(i));
                      return (
                        <button
                          key={i}
                          onClick={() =>
                            setAnswers((p) => ({
                              ...p,
                              [questions[currentQ].id]: opt.id || String(i),
                            }))
                          }
                          style={optionStyle(isSelected, theme)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <div style={optionCircleStyle(isSelected, theme)}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span
                              style={{
                                fontSize: "1rem",
                                fontWeight: isSelected ? "700" : "500",
                              }}
                            >
                              {getOptionText(opt)}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={20} color={theme.success} />
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4rem",
                    paddingTop: "2rem",
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ((p) => p - 1)}
                    style={navButtonStyle(false, theme)}
                  >
                    PREVIOUS
                  </button>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() =>
                        setFlagged((p) => ({
                          ...p,
                          [questions[currentQ].id]: !p[questions[currentQ].id],
                        }))
                      }
                      style={flagButtonStyle(
                        flagged[questions[currentQ]?.id],
                        theme,
                      )}
                    >
                      <Flag size={16} />{" "}
                      {flagged[questions[currentQ]?.id] ? "UNFLAG" : "FLAG"}
                    </button>
                    <button
                      onClick={() =>
                        currentQ === questions.length - 1
                          ? handleSubmitQuiz()
                          : setCurrentQ((p) => p + 1)
                      }
                      style={navButtonStyle(true, theme)}
                    >
                      {currentQ === questions.length - 1
                        ? "FINISH ASSESSMENT"
                        : "NEXT QUESTION"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quiz Sidebar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <div style={sideCardStyle(theme)}>
                  <h4 style={sideHeaderStyle(theme)}>QUESTION MAP</h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.8rem",
                    }}
                  >
                    {questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentQ(i)}
                        style={mapCircleStyle(
                          currentQ === i,
                          !!answers[q.id],
                          flagged[q.id],
                          theme,
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    ...sideCardStyle(theme),
                    textAlign: "center",
                    border: `1px dashed ${theme.border}`,
                  }}
                >
                  <Zap
                    size={32}
                    color={theme.subtext}
                    style={{ margin: "0 auto 1rem", opacity: 0.3 }}
                  />
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: theme.subtext,
                      margin: 0,
                    }}
                  >
                    REFERENCE ASSETS
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: theme.subtext,
                      marginTop: "8px",
                    }}
                  >
                    Relevant figures will render here for technical questions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Completion View */
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center" }}
            >
              <Trophy
                size={80}
                color={theme.success}
                style={{ marginBottom: "2rem" }}
              />
              <h2
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                }}
              >
                Results Verified
              </h2>
              <p
                style={{
                  fontSize: "1.4rem",
                  color: theme.subtext,
                  marginBottom: "3rem",
                }}
              >
                You achieved{" "}
                <span style={{ color: theme.success, fontWeight: "800" }}>
                  {quizResult.score}
                </span>{" "}
                / {quizResult.totalPoints} points
              </p>
              <button
                onClick={() => setActiveQuiz(null)}
                style={navButtonStyle(true, theme)}
              >
                RETURN TO PORTAL
              </button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // --- REDESIGNED VIEW 2: DASHBOARD[cite: 8] ---
  return (
    <div
      style={{
        padding: "3rem",
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "inline-flex",
            background: "rgba(129, 140, 248, 0.1)",
            color: theme.accent,
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "800",
            letterSpacing: "1.5px",
            marginBottom: "1rem",
            border: `1px solid ${theme.border}`,
          }}
        >
          SEMESTER PERFORMANCE: ACTIVE
        </div>
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
          QUIZ PORTAL
        </h1>
        <p
          style={{ color: theme.subtext, fontSize: "1.1rem", marginTop: "8px" }}
        >
          Verify academic credentials and access real-time performance
          analytics.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {/* GPA Card */}
        <div style={dashCardStyle(theme)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <span style={dashLabelStyle(theme)}>CUMULATIVE GPA</span>
            <ShieldCheck size={20} color={theme.accent} />
          </div>
          <div style={{ fontSize: "5rem", fontWeight: "900", lineHeight: 1 }}>
            {gpaData.cumulative}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontWeight: 700 }}>{gpaData.standing}</span>
              <span style={{ color: theme.success, fontWeight: 800 }}>
                {gpaData.trend} velocity
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "85%",
                  height: "100%",
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.secondary})`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Recharts Performance */}
        <div style={dashCardStyle(theme)}>
          <h4 style={{ ...dashLabelStyle(theme), marginBottom: "2rem" }}>
            PERFORMANCE PROGRESSION
          </h4>
          <div style={{ height: "240px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.subtext, fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="gpa" radius={[10, 10, 0, 0]}>
                  {chartData.map((e, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === chartData.length - 1
                          ? theme.accent
                          : "rgba(129, 140, 248, 0.15)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment Table Redesign */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gap: "2rem",
        }}
      >
        <div style={dashCardStyle(theme)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0 }}>
              Available Assessments
            </h3>
            <Filter size={18} color={theme.subtext} />
          </div>
          {quizzes.map((quiz, i) => {
            const pastRes = results.find((r) => r.quiz_id === quiz.id);
            return (
              <div
                key={quiz.id}
                style={tableRowStyle(i === quizzes.length - 1, theme)}
              >
                <div>
                  <h5
                    style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}
                  >
                    {quiz.title}
                  </h5>
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "4px" }}
                  >
                    <span style={tagStyle(theme)}>{quiz.course_code}</span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: theme.subtext,
                        fontWeight: 500,
                      }}
                    >
                      {quiz.course_name}
                    </span>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2rem" }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: theme.subtext,
                      }}
                    >
                      TIME
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                      {quiz.time_limit} MIN
                    </div>
                  </div>
                  {pastRes ? (
                    <div
                      style={{
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "rgba(52, 211, 153, 0.1)",
                        color: theme.success,
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      SCORE: {pastRes.score} / {pastRes.total_points}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      style={playButtonStyle(theme)}
                    >
                      <PlayCircle size={18} /> START
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Sidebar */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={aiCardStyle(theme)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  background: theme.accent,
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <Zap size={16} color="white" />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                AI PREDICTIVE MODEL
              </span>
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: theme.subtext,
                marginBottom: "8px",
              }}
            >
              EXPECTED OUTCOME
            </div>
            <div style={{ fontSize: "3.5rem", fontWeight: "900" }}>
              {aiForecast.predicted}{" "}
              <span style={{ fontSize: "1rem", color: theme.subtext }}>
                GPA
              </span>
            </div>
          </div>

          {aiForecast.alert && (
            <div style={alertCardStyle(theme)}>
              <AlertCircle size={20} color={theme.danger} />
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: "4px",
                  }}
                >
                  {aiForecast.alert.course} {aiForecast.alert.issue}
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: theme.subtext,
                    margin: 0,
                  }}
                >
                  {aiForecast.alert.desc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- STYLING OBJECTS[cite: 8] ---
const hudCardStyle = (t) => ({
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${t.border}`,
  padding: "0.8rem 1.5rem",
  borderRadius: "16px",
  minWidth: "140px",
});
const hudLabelStyle = (t) => ({
  fontSize: "0.65rem",
  fontWeight: 800,
  color: t.subtext,
  letterSpacing: "1px",
  display: "block",
  marginBottom: "4px",
});
const optionStyle = (sel, t) => ({
  width: "100%",
  padding: "1.5rem",
  border: `1px solid ${sel ? t.accent : t.border}`,
  background: sel ? "rgba(129, 140, 248, 0.05)" : "transparent",
  borderRadius: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: sel ? "white" : t.subtext,
  transition: "0.2s",
});
const optionCircleStyle = (sel, t) => ({
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: sel ? t.accent : "rgba(255,255,255,0.05)",
  color: sel ? "black" : t.subtext,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
});
const navButtonStyle = (pri, t) => ({
  padding: "12px 24px",
  background: pri ? t.accent : "transparent",
  color: pri ? "black" : t.subtext,
  border: pri ? "none" : `1px solid ${t.border}`,
  borderRadius: "12px",
  fontWeight: "800",
  fontSize: "0.85rem",
  cursor: "pointer",
});
const flagButtonStyle = (flg, t) => ({
  padding: "12px 24px",
  background: flg ? "rgba(248, 113, 113, 0.1)" : "transparent",
  color: flg ? t.danger : t.subtext,
  border: `1px solid ${flg ? t.danger : t.border}`,
  borderRadius: "12px",
  fontWeight: "800",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
});
const sideCardStyle = (t) => ({
  background: t.cardBg,
  padding: "1.5rem",
  borderRadius: "20px",
  border: `1px solid ${t.border}`,
});
const sideHeaderStyle = (t) => ({
  fontSize: "0.7rem",
  fontWeight: 800,
  color: t.subtext,
  letterSpacing: "1px",
  marginBottom: "1.5rem",
});
const mapCircleStyle = (cur, ans, flg, t) => ({
  aspectRatio: "1",
  borderRadius: "10px",
  border: cur ? `2px solid ${t.accent}` : "none",
  background: cur ? t.accent : ans ? t.border : "rgba(255,255,255,0.03)",
  color: cur ? "black" : ans ? "white" : t.subtext,
  fontWeight: "800",
  position: "relative",
  cursor: "pointer",
});
const dashCardStyle = (t) => ({
  background: t.cardBg,
  padding: "2.5rem",
  borderRadius: "28px",
  border: `1px solid ${t.border}`,
  backdropFilter: "blur(12px)",
});
const dashLabelStyle = (t) => ({
  fontSize: "0.75rem",
  fontWeight: 800,
  color: t.subtext,
  letterSpacing: "2px",
});
const tableRowStyle = (last, t) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.5rem 0",
  borderBottom: last ? "none" : `1px solid ${t.border}`,
});
const tagStyle = (t) => ({
  background: "rgba(129, 140, 248, 0.1)",
  color: t.accent,
  padding: "2px 8px",
  borderRadius: "6px",
  fontSize: "0.7rem",
  fontWeight: 800,
});
const playButtonStyle = (t) => ({
  background: t.accent,
  color: "black",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: 800,
  fontSize: "0.85rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});
const aiCardStyle = (t) => ({
  background: `linear-gradient(180deg, rgba(129, 140, 248, 0.2), #0B1120)`,
  padding: "2.5rem",
  borderRadius: "28px",
  border: `1px solid ${t.border}`,
});
const alertCardStyle = (t) => ({
  background: "rgba(248, 113, 113, 0.1)",
  border: "1px solid rgba(248, 113, 113, 0.2)",
  borderRadius: "20px",
  padding: "1.5rem",
  display: "flex",
  gap: "1rem",
  alignItems: "center",
});

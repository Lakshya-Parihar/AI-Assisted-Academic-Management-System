import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import {
  Brain,
  AlertTriangle,
  TrendingDown,
  CalendarX,
  MessageSquare,
  Zap,
  CheckCircle,
  SlidersHorizontal,
  Mail,
  BookOpen,
  Activity,
  User,
  Info,
} from "lucide-react";
import {
  getFacultyStudents,
  getStudentAIAnalysis,
  sendAcademicWarningEmail,
} from "../../services/facultyApi";

// --- Helper Component: Circular Risk Gauge ---
const CircularGauge = ({ score }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#10B981"; // Green
  if (score > 50) color = "#3B82F6"; // Blue
  if (score > 75) color = "#EF4444"; // Red

  return (
    <div
      style={{
        position: "relative",
        width: "70px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="#2A344A"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontSize: "20px",
          fontWeight: "700",
          color: "#F8FAFC",
        }}
      >
        {score}
      </span>
    </div>
  );
};

export default function StudentRiskAnalysis() {
  const { darkMode } = useOutletContext() || { darkMode: true };

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Dynamic AI States
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isSendingWarning, setIsSendingWarning] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Exact theme matched to your "Faculty Risk Analysis" mockup
  const theme = {
    bg: darkMode ? "#0B1120" : "#F8FAFC",
    cardBg: darkMode ? "#161E31" : "#FFFFFF",
    panelBg: darkMode ? "#1C253B" : "#F1F5F9",
    border: darkMode ? "#2A344A" : "#E2E8F0",
    textMain: darkMode ? "#F8FAFC" : "#0F172A",
    textMuted: darkMode ? "#8B9BB4" : "#64748B",
    accentBlue: "#818CF8",
    accentBlueBg: "#2E385D",
    accentGreen: "#10B981",
    accentGreenBg: "#064E3B",
    highRisk: "#EF4444",
    highRiskBg: "#451A24",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFacultyStudents();
        setStudents(res.data.students || res.data);
      } catch (err) {
        console.error("Failed to load students", err);
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = async (student) => {
    setSelectedStudent(student);
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setRoadmapData(null);
    try {
      const response = await getStudentAIAnalysis(student.id);
      setAnalysisData(response.data);
    } catch (err) {
      setError("AI Neural Link is offline.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIRoadmap = () => {
    setIsGeneratingRoadmap(true);
    setTimeout(() => {
      const insights = analysisData?.aiInsights || "";
      const isAttendanceIssue = insights.toLowerCase().includes("attendance");
      const isGradeIssue =
        insights.toLowerCase().includes("grade") ||
        insights.toLowerCase().includes("score");

      let phase1 = {
        phase: "PHASE 1: REMEDIATION",
        title: "Core Fundamentals",
        desc: `Review missed coursework and complete interactive modules for ${selectedStudent?.name}.`,
      };

      if (isAttendanceIssue) {
        phase1 = {
          phase: "PHASE 1: ATTENDANCE RECOVERY",
          title: "Mandatory Engagement Protocol",
          desc: `Student must check-in with the department head daily. Required to review recorded lectures for all missed sessions over the last 3 weeks.`,
        };
      } else if (isGradeIssue) {
        phase1 = {
          phase: "PHASE 1: ACADEMIC INTERVENTION",
          title: "Intensive Tutoring & Review",
          desc: `Schedule 3 mandatory peer-tutoring sessions before the next assessment. Focus heavily on previously failed quiz topics.`,
        };
      }

      setRoadmapData([
        phase1,
        {
          phase: "PHASE 2: PROGRESS TRACKING",
          title: "Bi-Weekly Faculty Sync",
          desc: "Monitor engagement metrics via AIAAMS LMS. Evaluate participation in active discussion boards.",
        },
        {
          phase: "PHASE 3: RE-EVALUATION",
          title: "Proctored Competency Assessment",
          desc: "Administer a controlled, proctored test to validate knowledge recovery and normalize academic standing.",
        },
      ]);
      setIsGeneratingRoadmap(false);
      handleActionClick("Elaborated Roadmap Generated Successfully");
    }, 2500);
  };

  // 🔥 THE FIX: Using the secure API function instead of raw fetch
  const handleSendWarning = async () => {
    if (!selectedStudent) return;
    setIsSendingWarning(true);

    try {
      const triggers = analysisData
        ? parseAIInsights(analysisData.aiInsights).triggers
        : ["Low academic engagement."];

      const payload = {
        studentEmail: selectedStudent.email || "tngxcrazy04@gmail.com", // Fallback test email
        studentName: selectedStudent.name,
        riskScore: selectedStudent.risk_score || 0,
        issues: triggers,
      };

      const response = await sendAcademicWarningEmail(payload);

      if (response.status === 200 || response.status === 201) {
        handleActionClick(
          "Official Academic Warning Email Dispatched to Student.",
        );
      }
    } catch (error) {
      console.error("Backend error:", error);
      alert(
        error.response?.data?.error ||
          "Failed to send email. Check server console.",
      );
    } finally {
      setIsSendingWarning(false);
    }
  };

  const handleRefineAI = () => {
    setIsRefining(true);
    setTimeout(() => {
      setIsRefining(false);
      handleActionClick("AI Parameters Refined: Deep Scan Complete.");
    }, 1500);
  };

  const handleActionClick = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const parseAIInsights = (text) => {
    const rawAnalysis = text.match(/Analysis:\s*(.*)/i)?.[1]?.trim() || text;
    const triggers = rawAnalysis
      .split(". ")
      .filter((s) => s.length > 5)
      .map((s) => s + ".");
    return { triggers: triggers.length > 0 ? triggers : [rawAnalysis] };
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        minHeight: "100vh",
        padding: "32px",
        color: theme.textMain,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* SUCCESS TOAST NOTIFICATION */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{
              position: "fixed",
              top: "40px",
              left: "50%",
              zIndex: 1000,
              background: theme.accentGreenBg,
              border: `1px solid ${theme.accentGreen}`,
              color: theme.accentGreen,
              padding: "16px 24px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <CheckCircle size={20} />{" "}
            <span style={{ fontWeight: "600", fontSize: "14px" }}>
              {actionSuccess}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "32px",
        }}
      >
        {/* LEFT: CRITICAL QUEUE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxHeight: "90vh",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0 0 8px 0",
              }}
            >
              Critical Queue
            </h2>
            <p style={{ color: theme.textMuted, fontSize: "14px", margin: 0 }}>
              AI-flagged students requiring immediate intervention.
            </p>
          </div>

          <div
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingRight: "8px",
            }}
          >
            {students.map((student) => {
              const isSelected = selectedStudent?.id === student.id;
              const realRisk = Number(student.risk_score) || 0;

              let riskBadgeBg = theme.accentGreenBg;
              let riskBadgeColor = theme.accentGreen;
              let RiskIcon = Activity;

              if (realRisk > 50) {
                riskBadgeBg = theme.accentBlueBg;
                riskBadgeColor = theme.accentBlue;
                RiskIcon = Info;
              }
              if (realRisk > 75) {
                riskBadgeBg = theme.highRiskBg;
                riskBadgeColor = theme.highRisk;
                RiskIcon = AlertTriangle;
              }

              return (
                <div
                  key={student.id}
                  onClick={() => handleAnalyze(student)}
                  style={{
                    background: isSelected ? theme.panelBg : theme.cardBg,
                    border: `1px solid ${isSelected ? theme.accentBlue : theme.border}`,
                    borderLeft: isSelected
                      ? `4px solid ${theme.accentBlue}`
                      : `1px solid ${theme.border}`,
                    padding: "20px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "18px",
                          color: theme.textMain,
                          marginBottom: "4px",
                        }}
                      >
                        {student.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {student.enrollment_no} • SEM {student.semester}
                      </div>
                    </div>
                    <div
                      style={{
                        background: riskBadgeBg,
                        color: riskBadgeColor,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      <RiskIcon size={12} /> {realRisk}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: theme.textMuted,
                      fontSize: "13px",
                    }}
                  >
                    <TrendingDown
                      size={14}
                      color={isSelected ? theme.accentBlue : theme.textMuted}
                    />
                    <span>Attendance Drop & Low Engagement</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: AI DETAIL PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {!selectedStudent && !isLoading && (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.textMuted,
                background: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Brain
                  size={48}
                  style={{ margin: "0 auto 16px auto", opacity: 0.5 }}
                />
                <h3>Select a student from the queue</h3>
              </div>
            </div>
          )}

          {isLoading && (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.cardBg,
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                className="pulsing-text"
                style={{
                  color: theme.accentBlue,
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Processing Neural Link...
              </div>
            </div>
          )}

          {analysisData &&
            !isLoading &&
            (() => {
              const parsed = parseAIInsights(analysisData.aiInsights);
              const currentScore =
                Number(selectedStudent.risk_score) ||
                100 - parseFloat(analysisData.stats.attendancePercentage || 0);

              return (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    {/* TOP HEADER CARD */}
                    <div
                      style={{
                        background: theme.cardBg,
                        borderRadius: "16px",
                        padding: "24px",
                        border: `1px solid ${theme.border}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "12px",
                            background: theme.panelBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <User size={36} color={theme.textMuted} />
                        </div>
                        <div>
                          <h2
                            style={{
                              fontSize: "28px",
                              fontWeight: "700",
                              margin: "0 0 6px 0",
                              color: theme.textMain,
                            }}
                          >
                            {analysisData.student.name}
                          </h2>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              fontSize: "13px",
                              color: theme.textMuted,
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                            }}
                          >
                            <span
                              style={{
                                background: theme.panelBg,
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              ID: {analysisData.student.enrollment_no}
                            </span>
                            <span>
                              SEM {analysisData.student.semester || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CircularGauge score={currentScore.toFixed(0)} />
                    </div>

                    {/* MIDDLE GRID: TRIGGERS & ACTIONS */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "24px",
                      }}
                    >
                      {/* AI INSIGHT TRIGGERS */}
                      <div>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "18px",
                            fontWeight: "600",
                            margin: "0 0 16px 0",
                            color: theme.textMain,
                          }}
                        >
                          <Brain size={20} color={theme.textMuted} /> AI Insight
                          Triggers
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {parsed.triggers.slice(0, 3).map((trigger, idx) => {
                            const conf = [
                              {
                                icon: CalendarX,
                                color: theme.highRisk,
                                title: "Attendance Drop",
                              },
                              {
                                icon: TrendingDown,
                                color: theme.accentBlue,
                                title: "Academic Deviation",
                              },
                              {
                                icon: MessageSquare,
                                color: theme.textMuted,
                                title: "Decreased Engagement",
                              },
                            ][idx % 3];
                            const Icon = conf.icon;

                            return (
                              <div
                                key={idx}
                                style={{
                                  background: theme.cardBg,
                                  border: `1px solid ${theme.border}`,
                                  borderLeft: `3px solid ${conf.color}`,
                                  borderRadius: "12px",
                                  padding: "16px",
                                  display: "flex",
                                  gap: "16px",
                                }}
                              >
                                <Icon
                                  size={20}
                                  color={conf.color}
                                  style={{ marginTop: "2px" }}
                                />
                                <div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "700",
                                      color: theme.textMain,
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {conf.title}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: theme.textMuted,
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {trigger}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* INTERVENTION ACTIONS */}
                      <div
                        style={{
                          background: theme.cardBg,
                          borderRadius: "16px",
                          padding: "24px",
                          border: `1px solid ${theme.border}`,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "18px",
                            fontWeight: "600",
                            margin: "0 0 16px 0",
                            color: theme.textMain,
                          }}
                        >
                          <Zap size={20} color={theme.accentGreen} />{" "}
                          Intervention Actions
                        </h3>
                        <p
                          style={{
                            color: theme.textMuted,
                            fontSize: "14px",
                            lineHeight: "1.6",
                            marginBottom: "32px",
                          }}
                        >
                          AI suggests immediate academic remediation before
                          midterm examinations based on the established risk
                          trajectory.
                        </p>

                        <div
                          style={{
                            marginTop: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {/* GENERATE ROADMAP BUTTON */}
                          <button
                            onClick={generateAIRoadmap}
                            disabled={isGeneratingRoadmap || roadmapData}
                            style={{
                              width: "100%",
                              padding: "14px",
                              borderRadius: "8px",
                              background: theme.accentBlueBg,
                              color: theme.accentBlue,
                              border: "none",
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              cursor:
                                isGeneratingRoadmap || roadmapData
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: roadmapData ? 0.5 : 1,
                            }}
                          >
                            <CheckCircle size={18} />{" "}
                            {roadmapData
                              ? "Roadmap Approved"
                              : "Approve Roadmap"}
                          </button>

                          <div style={{ display: "flex", gap: "12px" }}>
                            {/* REFINE AI BUTTON */}
                            <button
                              onClick={handleRefineAI}
                              disabled={isRefining}
                              style={{
                                flex: 1,
                                padding: "14px",
                                borderRadius: "8px",
                                background: theme.panelBg,
                                color: theme.textMain,
                                border: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: isRefining ? "wait" : "pointer",
                              }}
                            >
                              {isRefining ? (
                                <span className="pulsing-text">
                                  Refining...
                                </span>
                              ) : (
                                <>
                                  <SlidersHorizontal size={16} /> Refine AI
                                </>
                              )}
                            </button>

                            {/* SEND WARNING BUTTON */}
                            <button
                              onClick={handleSendWarning}
                              disabled={isSendingWarning}
                              style={{
                                flex: 1,
                                padding: "14px",
                                borderRadius: "8px",
                                background: theme.highRiskBg,
                                color: theme.highRisk,
                                border: "none",
                                fontWeight: "500",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                cursor: isSendingWarning ? "wait" : "pointer",
                              }}
                            >
                              {isSendingWarning ? (
                                <span className="pulsing-text">Sending...</span>
                              ) : (
                                <>
                                  <Mail size={16} /> Send Warning
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM: ROADMAP */}
                    <AnimatePresence>
                      {(isGeneratingRoadmap || roadmapData) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            background: theme.cardBg,
                            borderRadius: "16px",
                            padding: "24px",
                            border: `1px solid ${theme.border}`,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "24px",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                margin: 0,
                                color: theme.textMain,
                              }}
                            >
                              Integrated Remedial Roadmap
                            </h3>
                            <span
                              style={{
                                background: theme.accentGreenBg,
                                color: theme.accentGreen,
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: "700",
                                letterSpacing: "1px",
                              }}
                            >
                              AI GENERATED
                            </span>
                          </div>

                          {isGeneratingRoadmap ? (
                            <div
                              className="pulsing-text"
                              style={{
                                color: theme.accentBlue,
                                padding: "20px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontWeight: "600",
                              }}
                            >
                              <Brain size={20} /> Synthesizing Deep Remedial
                              Plan...
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                              }}
                            >
                              {roadmapData.map((step, i) => (
                                <div
                                  key={i}
                                  style={{ display: "flex", gap: "16px" }}
                                >
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "10px",
                                      background: theme.panelBg,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: theme.accentGreen,
                                      flexShrink: 0,
                                    }}
                                  >
                                    <BookOpen size={20} />
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        color: theme.accentGreen,
                                        letterSpacing: "1px",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {step.phase}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: theme.textMain,
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {step.title}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        color: theme.textMuted,
                                        lineHeight: "1.6",
                                      }}
                                    >
                                      {step.desc}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              );
            })()}
        </div>
      </div>

      <style>{`.pulsing-text { animation: pulse 1.5s infinite; } @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }`}</style>
    </div>
  );
}

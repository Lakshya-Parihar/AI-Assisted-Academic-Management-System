import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ShieldCheck,
  Loader,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import studentApi from "../../services/studentApi";

export default function StudentAttendance() {
  // --- PIN & GEO-FENCE STATE ---
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);

  // --- ANALYTICS STATE ---
  const [stats, setStats] = useState([]);

  const theme = {
    bg: "#020617",
    cardBg: "rgba(15, 23, 42, 0.7)",
    border: "rgba(59, 130, 246, 0.2)",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    accent: "#3B82F6",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
  };

  useEffect(() => {
    // 1. Check if they already marked attendance today
    const savedStatus = localStorage.getItem("attendance_marked");
    if (savedStatus) {
      const data = JSON.parse(savedStatus);
      setStatus("success");
      setAttendanceData(data);
      setMessage(`Already marked present (${data.distance}m away).`);
    }

    // 2. Load the subject-wise analytics
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Uses your existing Axios instance to fetch the tracking data
      const res = await studentApi.get("/attendance/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load attendance stats", err);
    }
  };

  const handleVerify = () => {
    if (pin.length !== 4) {
      setStatus("error");
      setMessage("Please enter a valid 4-digit PIN.");
      return;
    }

    setIsVerifying(true);
    setStatus(null);
    setMessage("Acquiring GPS Signal...");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Geolocation not supported.");
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          setMessage("Verifying location...");
          const token =
            localStorage.getItem("token") ||
            localStorage.getItem("studentToken") ||
            localStorage.getItem("jwt");

          if (!token) {
            throw new Error("Login session expired. Please log in again.");
          }

          // Keeping your exact raw fetch logic intact
          const response = await fetch(
            `http://${window.location.hostname}:5001/api/student/attendance/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                pin: pin,
                studentLat: latitude,
                studentLng: longitude,
              }),
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to verify PIN.");
          }

          const successPayload = {
            distance: data.distance,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date().toLocaleDateString(),
          };

          setStatus("success");
          setAttendanceData(successPayload);
          setMessage(`Success! Marked present.`);
          localStorage.setItem(
            "attendance_marked",
            JSON.stringify(successPayload),
          );
          setPin("");

          // Refresh the analytics rings immediately after marking present!
          fetchStats();
        } catch (err) {
          setStatus("error");
          setMessage(err.message || "Verification failed.");
        } finally {
          setIsVerifying(false);
        }
      },
      (error) => {
        setIsVerifying(false);
        setStatus("error");
        setMessage("Location Access Required.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleReset = () => {
    localStorage.removeItem("attendance_marked");
    setStatus(null);
    setAttendanceData(null);
    setPin("");
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        padding: "32px",
        fontFamily: "'Inter', sans-serif",
        color: theme.text,
      }}
    >
      {/* HEADER SECTION */}
      <div
        style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            display: "inline-flex",
            padding: "16px",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderRadius: "20px",
            marginBottom: "16px",
          }}
        >
          <MapPin size={32} color={theme.accent} />
        </motion.div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px",
          }}
        >
          AAAMS ATTENDANCE
        </h1>
        <p style={{ color: theme.subtext, fontSize: "16px" }}>
          Secure Classroom Verification & Analytics
        </p>
      </div>

      {/* TOP HALF: PIN VERIFICATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <motion.div
            layout
            style={{
              backgroundColor: theme.cardBg,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${theme.border}`,
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <CheckCircle2
                      size={64}
                      color={theme.success}
                      style={{ margin: "0 auto" }}
                    />
                  </div>
                  <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    Attendance Marked!
                  </h2>

                  <div
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.05)",
                      padding: "16px",
                      borderRadius: "16px",
                      border: `1px solid rgba(16, 185, 129, 0.2)`,
                      marginTop: "20px",
                      marginBottom: "24px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: theme.subtext }}>Time:</span>
                      <span style={{ fontWeight: "600" }}>
                        {attendanceData?.time}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: theme.subtext }}>Distance:</span>
                      <span style={{ fontWeight: "600" }}>
                        {attendanceData?.distance}m
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: theme.subtext }}>Status:</span>
                      <span style={{ color: theme.success, fontWeight: "700" }}>
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      color: theme.subtext,
                      padding: "14px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = theme.text;
                      e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = theme.subtext;
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <RefreshCw size={16} /> Mark Next Class
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "12px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: "50%",
                        marginBottom: "12px",
                      }}
                    >
                      <KeyRound size={24} color={theme.accent} />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: theme.subtext,
                        fontSize: "14px",
                      }}
                    >
                      Enter the PIN from the screen to verify your presence.
                    </p>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000"
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    disabled={isVerifying}
                    style={{
                      width: "100%",
                      padding: "20px",
                      borderRadius: "16px",
                      border: `2px solid ${status === "error" ? theme.danger : theme.accent}`,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      color: "white",
                      fontSize: "36px",
                      fontWeight: "800",
                      textAlign: "center",
                      outline: "none",
                      letterSpacing: "16px",
                      boxSizing: "border-box",
                      marginBottom: "20px",
                    }}
                  />

                  {message && (
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px",
                        backgroundColor:
                          status === "error"
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(255, 255, 255, 0.05)",
                        color:
                          status === "error" ? theme.danger : theme.subtext,
                      }}
                    >
                      {isVerifying ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <AlertCircle size={18} />
                      )}{" "}
                      {message}
                    </div>
                  )}

                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || pin.length !== 4}
                    style={{
                      width: "100%",
                      backgroundColor:
                        isVerifying || pin.length !== 4
                          ? "rgba(59, 130, 246, 0.3)"
                          : theme.accent,
                      color: "white",
                      padding: "18px",
                      borderRadius: "16px",
                      border: "none",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isVerifying ? "Verifying Presence..." : "Mark as Present"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM HALF: SUBJECT-WISE ANALYTICS */}
      <div
        style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "40px" }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <TrendingUp color={theme.accent} /> Subject-Wise Tracking
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((subject, idx) => {
            const percentage =
              subject.total_classes > 0
                ? (
                    (subject.present_classes / subject.total_classes) *
                    100
                  ).toFixed(1)
                : 0;
            const isDanger = percentage < 75;

            let statusColor = theme.success;
            if (isDanger) statusColor = theme.danger;
            else if (percentage < 80) statusColor = theme.warning;

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                style={{
                  background: theme.cardBg,
                  padding: "24px",
                  borderRadius: "16px",
                  border: `1px solid ${isDanger ? theme.danger : theme.border}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>
                      {subject.course_name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: theme.subtext,
                      }}
                    >
                      {subject.course_code}
                    </p>
                  </div>
                  {isDanger ? (
                    <AlertCircle color={theme.danger} />
                  ) : (
                    <CheckCircle2 color={theme.success} />
                  )}
                </div>

                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: theme.subtext }}>
                      Classes: {subject.present_classes}/{subject.total_classes}
                    </span>
                    <span style={{ fontWeight: "bold", color: statusColor }}>
                      {percentage}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: statusColor,
                        borderRadius: "4px",
                        transition: "width 1s ease-out",
                      }}
                    />
                  </div>
                </div>

                {isDanger && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "10px",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: theme.danger,
                      fontWeight: "500",
                    }}
                  >
                    ⚠️ Shortage: Below 75% university requirement.
                  </div>
                )}
              </motion.div>
            );
          })}

          {stats.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: theme.subtext,
                border: `1px dashed ${theme.border}`,
                borderRadius: "16px",
              }}
            >
              No attendance records found for this semester yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

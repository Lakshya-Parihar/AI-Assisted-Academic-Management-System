import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Save,
  Users,
  Filter,
  MapPin,
  KeyRound,
  Timer,
  ShieldAlert,
  CheckCircle2,
  SearchX,
  ChevronDown,
} from "lucide-react";
import facultyApi from "../../services/facultyApi";

// --- Custom Select Component for Theme Consistency ---
const ScholarSelect = ({
  label,
  value,
  options,
  onChange,
  disabled,
  darkMode,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
        flex: 1,
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontWeight: "800",
          color: theme.textMuted,
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </label>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "12px 16px",
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {options.find((opt) => opt.value == value)?.label || "Select..."}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              background: darkMode ? "#111827" : "#FFFFFF",
              border: `1px solid ${theme.border}`,
              borderRadius: "14px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)",
              zIndex: 100,
              maxHeight: "200px",
              overflowY: "auto",
              padding: "6px",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: opt.value == value ? theme.primary : theme.textMain,
                  background:
                    opt.value == value ? `${theme.primary}15` : "transparent",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AttendanceTracker() {
  const { darkMode } = useOutletContext();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [semester, setSemester] = useState("1");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [students, setStudents] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // PIN & GPS State[cite: 21]
  const [pin, setPin] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const timerRef = useRef(null);

  const theme = {
    primary: "#F59E0B",
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
  };

  // 1. Restricted Branch Fetch[cite: 19, 21]
  useEffect(() => {
    facultyApi
      .get("/attendance/branches")
      .then((res) => {
        setBranches(res.data);
        if (res.data.length > 0) setSelectedBranch(res.data[0].id.toString());
      })
      .catch(console.error);
  }, []);

  // 2. Course Fetch[cite: 19, 21]
  useEffect(() => {
    if (!selectedBranch) return;
    facultyApi
      .get(
        `/attendance/courses?branch_id=${selectedBranch}&semester=${semester}`,
      )
      .then((res) => {
        setCourses(res.data);
        if (res.data.length > 0)
          setSelectedCourse(res.data[0].course_id.toString());
        else setSelectedCourse("");
      });
  }, [selectedBranch, semester]);

  // 3. Roster Fetch & 4. Live Polling Logic[cite: 21]
  // 3. Roster Fetch & 4. Live Polling Logic
  useEffect(() => {
    let isActive = true; // Cleanup flag to prevent state updates from stale requests

    const fetchRoster = () => {
      if (!selectedCourse) return;

      facultyApi
        .get(
          `/attendance/roster?course_id=${selectedCourse}&date=${selectedDate}`,
        )
        .then((res) => {
          // Only update the state if the effect is still active
          if (isActive) {
            setStudents(
              res.data.map((s) => ({
                student_id: s.student_id,
                name: s.name,
                enrollment_no: s.enrollment_no,
                status: s.current_status || "Absent",
              })),
            );
          }
        })
        .catch(console.error);
    };

    // Initial fetch
    fetchRoster();

    // Start polling
    let poll;
    if (pin && selectedCourse) {
      poll = setInterval(fetchRoster, 3000);
    }

    // Cleanup function runs when dependencies change or component unmounts
    return () => {
      isActive = false; // Kills any pending promise state updates
      clearInterval(poll); // Stops the timer
    };
  }, [selectedCourse, selectedDate, pin]);

  // 5. Timer Logic[cite: 21]
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && pin) {
      setPin(null);
      setMessage("PIN Expired.");
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, pin]);

  // --- Handlers ---
  const handleGeneratePin = () => {
    setLocationError("");
    setIsGenerating(true);
    if (!navigator.geolocation) {
      setLocationError("GPS not supported");
      setIsGenerating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await facultyApi.post("/attendance/generate-pin", {
            course_id: selectedCourse,
            date: selectedDate,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setPin(res.data.pin);
          setTimeLeft(60);
          setMessage("PIN active!");
        } catch (err) {
          setLocationError("Server Error");
        } finally {
          setIsGenerating(false);
        }
      },
      () => {
        setLocationError("Location permission denied");
        setIsGenerating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await facultyApi.post("/attendance/save", {
        course_id: selectedCourse,
        date: selectedDate,
        attendance_records: students,
      });

      // 1. Show success message
      setMessage("Session Saved Successfully!");

      // 2. Wait 2 seconds so the user can read the message, then clear everything
      setTimeout(() => {
        setMessage("");
        setSelectedCourse(""); // Clears the subject dropdown
        setStudents([]); // Clears the roster grid
        setPin(null); // Kills the active PIN vault
        setTimeLeft(0); // Resets the timer

        // Optional: Reset date to today
        setSelectedDate(new Date().toISOString().split("T")[0]);
      }, 3000);
    } catch (err) {
      setMessage("Save Failed. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "24px",
        padding: "32px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: theme.textMain,
            }}
          >
            Mark Attendance
          </h2>
          <p
            style={{
              color: theme.textMuted,
              fontSize: "14px",
              marginTop: "4px",
              margin: 0,
            }}
          >
            Mark real-time attendance for your branch's students with geofence
            PINs.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* THIS IS THE MISSING MESSAGE UI */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  color: message.includes("Failed")
                    ? theme.danger
                    : theme.success,
                  fontSize: "13px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: message.includes("Failed")
                    ? `${theme.danger}15`
                    : `${theme.success}15`,
                  padding: "10px 16px",
                  borderRadius: "10px",
                }}
              >
                <CheckCircle2 size={16} /> {message}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            disabled={isSaving || students.length === 0}
            style={{
              background: theme.primary,
              color: "#000",
              border: "none",
              padding: "12px 24px",
              borderRadius: "14px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor:
                isSaving || students.length === 0 ? "not-allowed" : "pointer",
              opacity: isSaving || students.length === 0 ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <Save size={18} /> {isSaving ? "SAVING..." : "SAVE SESSION"}
          </button>
        </div>
      </header>

      {/* FILTER GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr 1fr",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <ScholarSelect
          label="BRANCH (LOCKED)"
          value={selectedBranch}
          options={branches.map((b) => ({ label: b.branch_code, value: b.id }))}
          disabled
          theme={theme}
          darkMode={darkMode}
        />
        <ScholarSelect
          label="SEMESTER"
          value={semester}
          onChange={setSemester}
          options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
            label: `Sem ${s}`,
            value: s,
          }))}
          theme={theme}
          darkMode={darkMode}
        />
        <ScholarSelect
          label="SUBJECT"
          value={selectedCourse}
          onChange={setSelectedCourse}
          options={courses.map((c) => ({
            label: c.course_name,
            value: c.course_id,
          }))}
          theme={theme}
          darkMode={darkMode}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: theme.textMuted,
              letterSpacing: "0.5px",
            }}
          >
            SESSION DATE
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9",
              border: `1px solid ${theme.border}`,
              padding: "12px",
              borderRadius: "12px",
              color: theme.textMain,
              outline: "none",
              fontWeight: "600",
            }}
          />
        </div>
      </div>

      {/* PIN VAULT */}
      <div
        style={{
          background: darkMode
            ? "rgba(245, 158, 11, 0.05)"
            : "rgba(245, 158, 11, 0.02)",
          border: `1px dashed ${theme.primary}`,
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <AnimatePresence mode="wait">
          {pin ? (
            <motion.div
              key="pin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h1
                style={{
                  fontSize: "72px",
                  fontWeight: "900",
                  color: theme.primary,
                  margin: 0,
                  letterSpacing: "12px",
                }}
              >
                {pin}
              </h1>
              <p
                style={{
                  color: timeLeft < 10 ? theme.danger : theme.textMain,
                  fontWeight: "800",
                }}
              >
                <Timer size={20} /> {timeLeft}s remaining
              </p>
            </motion.div>
          ) : (
            <div>
              <MapPin
                size={48}
                color={theme.primary}
                style={{ marginBottom: "16px" }}
              />
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: theme.textMain,
                }}
              >
                Secure GPS Authorization
              </h3>
              <button
                onClick={handleGeneratePin}
                disabled={!selectedCourse || isGenerating}
                style={{
                  background: theme.primary,
                  color: "#000",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                {isGenerating ? "ACQUIRING GPS..." : "GENERATE SMART PIN"}
              </button>
              {locationError && (
                <p
                  style={{
                    color: theme.danger,
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  <ShieldAlert size={14} /> {locationError}
                </p>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ROSTER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {students.length > 0 ? (
          students.map((s) => (
            <div
              key={s.student_id}
              style={{
                background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC",
                padding: "20px",
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: "800", fontSize: "14px", margin: 0 }}>
                  {s.name}
                </p>
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: "11px",
                    margin: 0,
                  }}
                >
                  ID: {s.enrollment_no}
                </p>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "10px",
                  fontWeight: "900",
                  background:
                    s.status === "Present"
                      ? `${theme.success}15`
                      : `${theme.danger}15`,
                  color: s.status === "Present" ? theme.success : theme.danger,
                }}
              >
                {s.status.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <div
            style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}
          >
            <SearchX size={48} color={theme.textMuted} />
            <p style={{ color: theme.textMuted }}>No students found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

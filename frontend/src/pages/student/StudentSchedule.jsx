import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Upload,
  Plus,
  X,
  Brain,
  BookOpen,
  Clock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  getMySchedule,
  addCustomEvent,
  uploadTimetableCsv,
  getMyAssignments,
  getCourseProgress, // 🔥 Make sure this is imported
} from "../../services/studentApi";

export default function StudentSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔥 Course Details Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);

  const fileInputRef = useRef(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    event_type: "STUDY",
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    room: "",
    instructor: "",
  });

  const theme = {
    bg: "#0B1120",
    cardBg: "#111827",
    panelSolid: "#1E293B",
    border: "#334155",
    textMain: "#F8FAFC",
    textMuted: "#94A3B8",
    accentBlue: "#3B82F6",
    accentPurple: "#8B5CF6",
    urgentRed: "#EF4444",
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const schedRes = await getMySchedule();
      setSchedule(schedRes.data || []);
      const assignRes = await getMyAssignments();
      setAssignments(assignRes.data || []);
    } catch (e) {
      console.error("Failed to load schedule", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("timetable", file);
    try {
      await uploadTimetableCsv(formData);
      fetchData();
      alert("College timetable successfully imported!");
    } catch (error) {
      alert("Failed to upload CSV.");
    }
    e.target.value = null;
  };

  const handleAddCustomEvent = async (e) => {
    e.preventDefault();
    try {
      await addCustomEvent(newEvent);
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      alert("Failed to add event");
    }
  };

  // 🔥 Fetch Course Details from Backend
  const handleViewCourseDetails = async (courseName) => {
    setLoadingCourse(true);
    setShowCourseModal(true);
    try {
      const res = await getCourseProgress({ courseName });
      setCourseDetails(res.data);
    } catch (error) {
      console.error(error);
      setCourseDetails({ found: false, message: "Error fetching data." });
    } finally {
      setLoadingCourse(false);
    }
  };

  // 🔥 Colorful Tiles Logic
  const getEventColor = (type) => {
    const t = (type || "").toUpperCase();
    if (t.includes("LECTURE"))
      return {
        bg: "rgba(59, 130, 246, 0.15)",
        border: "#3B82F6",
        text: "#60A5FA",
      }; // Neon Blue
    if (t.includes("LAB"))
      return {
        bg: "rgba(139, 92, 246, 0.15)",
        border: "#8B5CF6",
        text: "#A78BFA",
      }; // Neon Purple
    if (t.includes("STUDY"))
      return {
        bg: "rgba(16, 185, 129, 0.15)",
        border: "#10B981",
        text: "#34D399",
      }; // Neon Emerald
    if (t.includes("EXAM") || t.includes("QUIZ"))
      return {
        bg: "rgba(244, 63, 94, 0.15)",
        border: "#F43F5E",
        text: "#FB7185",
      }; // Neon Rose
    return {
      bg: "rgba(6, 182, 212, 0.15)",
      border: "#06B6D4",
      text: "#22D3EE",
    }; // Neon Cyan default
  };

  const getEventStyles = (startTime, endTime) => {
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    const startHour = parseInt(startParts[0]);
    const startMin = parseInt(startParts[1]);
    const endHour = parseInt(endParts[0]);
    const endMin = parseInt(endParts[1]);

    const topOffsetMins = (startHour - 8) * 60 + startMin;
    const durationMins = (endHour - startHour) * 60 + (endMin - startMin);

    return { top: `${topOffsetMins}px`, height: `${durationMins}px` };
  };

  const nextLecture =
    schedule.find((e) => e.event_type.toUpperCase() === "LECTURE") ||
    schedule[0];

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.textMain,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.5px",
            }}
          >
            Weekly Ledger
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: theme.textMuted,
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            <Calendar size={18} /> Fall Semester • Current Week
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "transparent",
              color: theme.textMain,
              border: `1px solid ${theme.border}`,
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} /> Add Personal Study
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              background: theme.accentBlue,
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Upload size={16} /> Import College Timetable
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2rem",
        }}
      >
        {/* LEFT PANE: CALENDAR GRID */}
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "1.5rem",
            border: `1px solid ${theme.border}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px repeat(5, 1fr)",
              background: theme.panelSolid,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div />
            {days.map((day, idx) => (
              <div
                key={day}
                style={{
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  borderLeft: idx !== 0 ? `1px solid ${theme.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "800",
                    color: theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px",
                  }}
                >
                  {day.substring(0, 3)}
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "800",
                    color: theme.textMain,
                  }}
                >
                  {23 + idx}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px repeat(5, 1fr)",
              flex: 1,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: `1px solid ${theme.border}`,
                background: "rgba(255,255,255,0.01)",
              }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: "60px",
                    padding: "0.5rem",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: theme.textMuted,
                    textAlign: "right",
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                </div>
              ))}
            </div>

            {days.map((day, idx) => {
              const dayEvents = schedule.filter((e) => e.day_of_week === day);

              return (
                <div
                  key={day}
                  style={{
                    position: "relative",
                    borderRight:
                      idx !== 4 ? `1px solid ${theme.border}` : "none",
                  }}
                >
                  {hours.map((hour) => (
                    <div
                      key={`line-${hour}`}
                      style={{
                        height: "60px",
                        borderBottom: `1px solid rgba(255,255,255,0.03)`,
                      }}
                    />
                  ))}

                  {/* 🔥 COLORFUL EVENT TILES */}
                  {dayEvents.map((evt, i) => {
                    const styles = getEventStyles(evt.start_time, evt.end_time);
                    const colors = getEventColor(evt.event_type);

                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          left: "4px",
                          right: "4px",
                          top: styles.top,
                          height: styles.height,
                          background: colors.bg,
                          border: `1px solid ${colors.border}40`,
                          borderLeft: `3px solid ${colors.border}`,
                          borderRadius: "6px",
                          padding: "8px",
                          overflow: "hidden",
                          cursor: "pointer",
                          zIndex: 10,
                          boxShadow: `0 4px 12px ${colors.border}10`,
                        }}
                        onClick={() => handleViewCourseDetails(evt.title)} // Click tile to open details
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: "800",
                            color: colors.text,
                            letterSpacing: "0.5px",
                            marginBottom: "2px",
                            textTransform: "uppercase",
                          }}
                        >
                          {evt.event_type} {!evt.is_imported && " (CUSTOM)"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            color: theme.textMain,
                            lineHeight: 1.2,
                            marginBottom: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {evt.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: theme.textMuted,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {evt.room}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: WIDGETS */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "1rem",
              padding: "1.5rem",
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: "800",
                color: theme.textMuted,
                letterSpacing: "1px",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Next Lecture
            </div>
            {nextLecture ? (
              <>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: theme.textMain,
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {nextLecture.title}
                </h3>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: theme.textMuted,
                    marginBottom: "1rem",
                  }}
                >
                  Starting at {nextLecture.start_time.substring(0, 5)}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.85rem",
                    color: theme.textMuted,
                    marginBottom: "1.5rem",
                  }}
                >
                  <MapPin size={14} /> {nextLecture.room || "TBA"}
                </div>
                {/* 🔥 COURSE DETAILS BUTTON */}
                <button
                  onClick={() => handleViewCourseDetails(nextLecture.title)}
                  style={{
                    width: "100%",
                    background: "#BFDBFE",
                    color: "#0F172A",
                    border: "none",
                    padding: "0.8rem",
                    borderRadius: "0.5rem",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  View Course Details
                </button>
              </>
            ) : (
              <div style={{ color: theme.textMuted, fontSize: "0.9rem" }}>
                No upcoming lectures today.
              </div>
            )}
          </div>

          <div
            style={{
              background: theme.cardBg,
              borderRadius: "1rem",
              padding: "1.5rem",
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: "800",
                color: theme.textMuted,
                letterSpacing: "1px",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              Upcoming Deadlines
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {assignments.slice(0, 3).map((a, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: theme.textMain,
                      }}
                    >
                      {a.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        background:
                          i === 0
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color: i === 0 ? theme.urgentRed : "#10B981",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {new Date(a.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      background: theme.panelSolid,
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        width: i === 0 ? "80%" : "30%",
                        height: "100%",
                        background: i === 0 ? theme.urgentRed : "#10B981",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 COURSE PROGRESS MODAL 🔥 */}
      <AnimatePresence>
        {showCourseModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "500px",
                padding: "2.5rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <BookOpen size={24} color={theme.accentBlue} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: theme.accentBlue,
                        fontWeight: "800",
                        letterSpacing: "1px",
                      }}
                    >
                      SYLLABUS TRACKER
                    </div>
                    <h2
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "1.25rem",
                        fontWeight: "800",
                      }}
                    >
                      {nextLecture?.title || "Course Details"}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowCourseModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {loadingCourse ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: theme.textMuted,
                  }}
                >
                  Scanning curriculum database...
                </div>
              ) : courseDetails?.found ? (
                <div>
                  {/* Progress Bar */}
                  <div
                    style={{
                      background: theme.panelSolid,
                      padding: "1.5rem",
                      borderRadius: "0.75rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: theme.textMuted,
                        }}
                      >
                        Portion Completed
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "800",
                          color: theme.accentGreen,
                        }}
                      >
                        {courseDetails.progressPct}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: theme.bg,
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${courseDetails.progressPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: theme.accentGreen,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: theme.textMuted,
                        marginTop: "8px",
                        textAlign: "right",
                      }}
                    >
                      {courseDetails.totalChapters -
                        courseDetails.completedChapters}{" "}
                      chapters remaining
                    </div>
                  </div>

                  {/* Next Topics */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      color: theme.textMuted,
                      letterSpacing: "1px",
                      marginBottom: "1rem",
                      textTransform: "uppercase",
                    }}
                  >
                    Up Next In Curriculum
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {courseDetails.nextTopics.length > 0 ? (
                      courseDetails.nextTopics.map((topic, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            background: theme.bg,
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <Activity
                            size={16}
                            color={theme.accentPurple}
                            style={{ marginTop: "2px" }}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "700",
                                color: theme.textMain,
                                marginBottom: "4px",
                              }}
                            >
                              {topic.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: theme.textMuted,
                              }}
                            >
                              Status: {topic.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: theme.accentGreen,
                          fontSize: "0.9rem",
                          fontWeight: "700",
                        }}
                      >
                        <CheckCircle2 size={18} /> Syllabus Fully Completed!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: theme.textMuted,
                    background: theme.panelSolid,
                    borderRadius: "0.75rem",
                  }}
                >
                  <BookOpen
                    size={32}
                    style={{ margin: "0 auto 1rem auto", opacity: 0.5 }}
                  />
                  {courseDetails?.message ||
                    "Course syllabus has not been uploaded by the faculty yet."}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD CUSTOM EVENT MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "500px",
                padding: "2rem",
              }}
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
                  style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}
                >
                  Add Personal Study Event
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={handleAddCustomEvent}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: theme.textMuted,
                      fontWeight: "700",
                      marginBottom: "6px",
                    }}
                  >
                    Event Title
                  </label>
                  <input
                    required
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    style={{
                      width: "100%",
                      background: theme.panelSolid,
                      border: `1px solid ${theme.border}`,
                      color: "#fff",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: theme.textMuted,
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      Day
                    </label>
                    <select
                      value={newEvent.day_of_week}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          day_of_week: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        background: theme.panelSolid,
                        border: `1px solid ${theme.border}`,
                        color: "#fff",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        outline: "none",
                      }}
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: theme.textMuted,
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      Room/Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.room}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, room: e.target.value })
                      }
                      style={{
                        width: "100%",
                        background: theme.panelSolid,
                        border: `1px solid ${theme.border}`,
                        color: "#fff",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: theme.textMuted,
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      Start Time (HH:MM)
                    </label>
                    <input
                      required
                      type="time"
                      value={newEvent.start_time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, start_time: e.target.value })
                      }
                      style={{
                        width: "100%",
                        background: theme.panelSolid,
                        border: `1px solid ${theme.border}`,
                        color: "#fff",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: theme.textMuted,
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      End Time (HH:MM)
                    </label>
                    <input
                      required
                      type="time"
                      value={newEvent.end_time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, end_time: e.target.value })
                      }
                      style={{
                        width: "100%",
                        background: theme.panelSolid,
                        border: `1px solid ${theme.border}`,
                        color: "#fff",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: theme.accentBlue,
                    color: "#fff",
                    border: "none",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  Add to Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CheckCircle2,
  X,
  EyeOff,
  Eye,
  Send,
  ChevronDown,
  Layers,
  FileText,
  BarChart2,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  getGradesData,
  saveStudentGrade,
  publishAllCourseGrades,
} from "../../services/facultyApi";

// --- Premium Custom Dropdown Component ---
const ScholarSelect = ({
  label,
  value,
  options,
  onChange,
  disabled,
  darkMode,
  theme,
  icon: Icon,
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
        minWidth: "220px",
        flex: 1,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "11px",
            fontWeight: "900",
            color: theme.textMuted,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "14px 16px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "700",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? `0 0 15px ${theme.primary}22` : "none",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          {Icon && <Icon size={16} color={theme.textMuted} />}
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {options.find((opt) => opt.value == value)?.label || "Select..."}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} color={theme.textMuted} />
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
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              zIndex: 100,
              maxHeight: "250px",
              overflowY: "auto",
              padding: "6px",
            }}
          >
            {options.length === 0 && (
              <div
                style={{
                  padding: "10px",
                  color: theme.textMuted,
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                No options available
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: opt.value == value ? theme.primary : theme.textMain,
                  background:
                    opt.value == value ? `${theme.primary}15` : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    opt.value == value ? `${theme.primary}15` : "transparent")
                }
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

export default function FacultyGrades() {
  const { darkMode = true } = useOutletContext() || {};

  // --- SCHOLAR AI THEME ---
  const theme = {
    primary: "#F59E0B", // Scholar Amber
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
    indigo: "#6366F1",
    accentBg: darkMode ? "rgba(245, 158, 11, 0.05)" : "rgba(245, 158, 11, 0.1)",
    modalOverlay: darkMode ? "rgba(0,0,0,0.8)" : "rgba(15, 23, 42, 0.6)",
  };

  // --- STATE (Untouched) ---
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [existingGrades, setExistingGrades] = useState([]);
  const [myFacultyId, setMyFacultyId] = useState(null);
  const [stats, setStats] = useState({ completionRate: 0, classAverage: 0 });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const [examType, setExamType] = useState("Mid-Sem");
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  // --- LOGIC (Untouched) ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getGradesData();
      setStudents(response.data.students);
      setCourses(response.data.courses);
      setExistingGrades(response.data.existingGrades);
      setMyFacultyId(response.data.myFacultyId);
      setStats(response.data.stats || { completionRate: 0, classAverage: 0 });

      const myCourses = response.data.courses.filter(
        (c) => c.assigned_faculty_id === response.data.myFacultyId,
      );
      if (myCourses.length > 0 && !activeCourseId)
        setActiveCourseId(myCourses[0].course_id);
    } catch (error) {
      showToast("Failed to fetch data", "error");
    }
  };

  const studentGradesMap = useMemo(() => {
    const map = {};
    existingGrades.forEach((g) => {
      if (!map[g.student_id]) map[g.student_id] = {};
      if (!map[g.student_id][g.course_id]) map[g.student_id][g.course_id] = {};
      map[g.student_id][g.course_id][g.exam_type] = g;
    });
    return map;
  }, [existingGrades]);

  const hasDraftsForActiveCourse = useMemo(() => {
    return existingGrades.some(
      (g) => g.course_id === activeCourseId && g.status === "draft",
    );
  }, [existingGrades, activeCourseId]);

  useEffect(() => {
    if (selectedStudent) {
      const initialInputs = {};
      courses.forEach((course) => {
        const existing = existingGrades.find(
          (g) =>
            g.student_id === selectedStudent.id &&
            g.course_id === course.course_id &&
            g.exam_type === examType,
        );
        initialInputs[course.course_id] = {
          marks: existing ? existing.marks_obtained : "",
          total: existing ? existing.total_marks : "100",
        };
      });
      setGradeInputs(initialInputs);
    }
  }, [selectedStudent, examType, courses, existingGrades]);

  const handleInputChange = (courseId, field, value) => {
    setGradeInputs((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], [field]: value },
    }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveGrade = async (status) => {
    setIsSaving(true);

    // 🔥 FIX: Filter by faculty ID AND the student's specific branch and semester
    const payloadGrades = courses
      .filter(
        (c) =>
          c.assigned_faculty_id === myFacultyId &&
          c.department_id === selectedStudent.branch_id &&
          c.semester === selectedStudent.semester,
      )
      .map((c) => ({
        course_id: c.course_id,
        marks_obtained: gradeInputs[c.course_id]?.marks, // Added optional chaining just in case
        total_marks: gradeInputs[c.course_id]?.total,
      }));

    try {
      await saveStudentGrade({
        student_id: selectedStudent.id,
        exam_type: examType,
        grades: payloadGrades,
        status: status,
      });
      fetchData();
      setSelectedStudent(null);
      showToast(
        `Grades ${status === "published" ? "published" : "saved as draft"} for ${selectedStudent.name}`,
      );
    } catch (error) {
      showToast("Failed to save grades", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to publish all draft grades for this course? Students will receive access immediately.",
      )
    )
      return;
    setIsPublishingAll(true);
    try {
      await publishAllCourseGrades({ courseId: activeCourseId });
      fetchData();
      showToast("All draft grades published successfully!");
    } catch (error) {
      showToast("Failed to publish grades", "error");
    } finally {
      setIsPublishingAll(false);
    }
  };

  const activeCourse = courses.find((c) => c.course_id === activeCourseId);
  const activeCourseName = activeCourse?.course_name || "Select Course";

  const filteredStudents = students.filter(
    (student) =>
      student.semester === activeCourse?.semester &&
      student.branch_id === activeCourse?.department_id,
  );

  // --- UI RENDER ---
  return (
    <div
      style={{
        color: theme.textMain,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "32px",
        minHeight: "100vh",
      }}
    >
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div
            style={{
              display: "inline-block",
              background: theme.accentBg,
              color: theme.primary,
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            AIAAMS PORTAL • {activeCourseName}
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "900",
              margin: "0 0 8px 0",
              letterSpacing: "-1px",
            }}
          >
            Grading Ledger
          </h1>
          <p
            style={{
              color: theme.textMuted,
              margin: 0,
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Manage manual evaluation metrics, drafts, and publication
            synchronization.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handlePublishAll}
          disabled={!hasDraftsForActiveCourse || isPublishingAll}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            background: hasDraftsForActiveCourse
              ? theme.primary
              : darkMode
                ? "rgba(255,255,255,0.05)"
                : "#E2E8F0",
            color: hasDraftsForActiveCourse ? "#000" : theme.textMuted,
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: "900",
            cursor:
              hasDraftsForActiveCourse && !isPublishingAll
                ? "pointer"
                : "not-allowed",
            boxShadow: hasDraftsForActiveCourse
              ? `0 10px 25px -5px ${theme.primary}66`
              : "none",
            transition: "all 0.2s",
          }}
        >
          <Send size={18} />{" "}
          {isPublishingAll ? "EXECUTING..." : "PUBLISH ALL DRAFTS"}
        </motion.button>
      </div>

      {/* FILTER BAR & LIST CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "32px",
          padding: "32px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* DUAL FILTERS */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "32px",
            flexWrap: "wrap",
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: "24px",
          }}
        >
          <ScholarSelect
            label="TARGET COURSE"
            icon={Layers}
            value={activeCourseId || ""}
            onChange={(val) => setActiveCourseId(parseInt(val))}
            options={courses
              .filter((c) => c.assigned_faculty_id === myFacultyId)
              .map((c) => ({ label: c.course_name, value: c.course_id }))}
            theme={theme}
            darkMode={darkMode}
          />
          <ScholarSelect
            label="EVALUATION TYPE"
            icon={FileText}
            value={examType}
            onChange={(val) => setExamType(val)}
            options={[
              { label: "Mid-Semester Evaluation", value: "Mid-Sem" },
              { label: "Final-Semester Evaluation", value: "Final-Sem" },
              { label: "Practical Assessment", value: "Practical" },
            ]}
            theme={theme}
            darkMode={darkMode}
          />
        </div>

        {/* LEDGER LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            padding: "0 24px 16px 24px",
            fontSize: "11px",
            fontWeight: "900",
            color: theme.textMuted,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <div>Student Profile</div>
          <div>Evaluation Status</div>
          <div>Obtained Score</div>
          <div>Visibility State</div>
        </div>

        <div
          className="hide-scroll"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <AnimatePresence>
            {filteredStudents.length === 0 ? (
              <div
                style={{
                  padding: "60px",
                  textAlign: "center",
                  background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                  borderRadius: "20px",
                  border: `1px dashed ${theme.border}`,
                }}
              >
                <BarChart2
                  size={48}
                  color={theme.textMuted}
                  style={{ margin: "0 auto 16px", opacity: 0.5 }}
                />
                <h4
                  style={{
                    color: theme.textMain,
                    fontSize: "16px",
                    fontWeight: "800",
                    marginBottom: "8px",
                  }}
                >
                  No Profiles Found
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.textMuted,
                    margin: 0,
                  }}
                >
                  Select a different course configuration to evaluate.
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const gradeRecord =
                  studentGradesMap[student.id]?.[activeCourseId]?.[examType];
                const score = gradeRecord
                  ? parseFloat(gradeRecord.marks_obtained)
                  : null;
                const total = gradeRecord
                  ? parseFloat(gradeRecord.total_marks)
                  : null;
                const isDraft = gradeRecord && gradeRecord.status === "draft";

                let statusBadge =
                  score !== null
                    ? {
                        text: "GRADED",
                        bg: `${theme.success}15`,
                        color: theme.success,
                      }
                    : {
                        text: "PENDING",
                        bg: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                        color: theme.textMuted,
                      };

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                      padding: "24px",
                      background: darkMode
                        ? "rgba(255,255,255,0.01)"
                        : "#FAFBFC",
                      borderRadius: "20px",
                      border: `1px solid ${theme.border}`,
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "14px",
                          background: theme.accentBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: theme.primary,
                        }}
                      >
                        <User size={20} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "800",
                            color: theme.textMain,
                            marginBottom: "4px",
                          }}
                        >
                          {student.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.textMuted,
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {student.enrollment_no}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: statusBadge.bg,
                          color: statusBadge.color,
                          fontSize: "10px",
                          fontWeight: "900",
                          letterSpacing: "1px",
                        }}
                      >
                        {statusBadge.text}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: darkMode
                            ? "rgba(255,255,255,0.05)"
                            : "#FFFFFF",
                          border: `1px solid ${theme.border}`,
                          padding: "10px 16px",
                          borderRadius: "12px",
                          fontSize: "16px",
                          fontWeight: "900",
                          color:
                            score !== null ? theme.primary : theme.textMuted,
                        }}
                      >
                        {score !== null ? `${score} / ${total}` : "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: isDraft
                          ? theme.primary
                          : score !== null
                            ? theme.success
                            : theme.textMuted,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {score !== null ? (
                        isDraft ? (
                          <>
                            <EyeOff size={16} /> Draft Mode
                          </>
                        ) : (
                          <>
                            <Eye size={16} /> Published
                          </>
                        )
                      ) : (
                        "—"
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- EVALUATION MODAL --- */}
      <AnimatePresence>
        {selectedStudent && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.modalOverlay,
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: "32px",
                padding: "40px",
                width: "100%",
                maxWidth: "640px",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "28px",
                      fontWeight: "900",
                      color: theme.textMain,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Evaluate Profile
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: theme.primary,
                      }}
                    >
                      {selectedStudent.name}
                    </span>
                    <span style={{ color: theme.textMuted }}>•</span>
                    <span
                      style={{
                        color: theme.textMuted,
                        fontSize: "13px",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {selectedStudent.enrollment_no}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = theme.primary)}
                  onMouseLeave={(e) => (e.target.style.color = theme.textMuted)}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <ScholarSelect
                  label="EVALUATION CONTEXT"
                  icon={FileText}
                  value={examType}
                  onChange={(val) => setExamType(val)}
                  options={[
                    { label: "Mid-Semester Evaluation", value: "Mid-Sem" },
                    { label: "Final-Semester Evaluation", value: "Final-Sem" },
                    { label: "Practical Assessment", value: "Practical" },
                  ]}
                  theme={theme}
                  darkMode={darkMode}
                />

                <div
                  className="hide-scroll"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {/* 🔥 FIX: Filter courses before mapping them to the UI */}
                  {courses
                    .filter(
                      (c) =>
                        c.department_id === selectedStudent.branch_id &&
                        c.semester === selectedStudent.semester,
                    )
                    .map((course) => {
                      const isAuthorized =
                        course.assigned_faculty_id === myFacultyId;
                      const inputValues = gradeInputs[course.course_id] || {
                        marks: "",
                        total: "100",
                      };

                      return (
                        <div
                          key={course.course_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "20px",
                            backgroundColor: isAuthorized
                              ? darkMode
                                ? "rgba(255,255,255,0.02)"
                                : "#FAFBFC"
                              : "transparent",
                            border: `1px solid ${isAuthorized ? theme.border : "transparent"}`,
                            borderRadius: "16px",
                            opacity: isAuthorized ? 1 : 0.3,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "900",
                                color: isAuthorized
                                  ? theme.primary
                                  : theme.textMuted,
                                letterSpacing: "1px",
                                marginBottom: "4px",
                              }}
                            >
                              {course.course_code}
                            </div>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "15px",
                                fontWeight: "700",
                                color: theme.textMain,
                              }}
                            >
                              {course.course_name}
                            </h4>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Score"
                              value={inputValues.marks}
                              onChange={(e) =>
                                handleInputChange(
                                  course.course_id,
                                  "marks",
                                  e.target.value,
                                )
                              }
                              disabled={!isAuthorized}
                              style={{
                                width: "80px",
                                padding: "12px",
                                borderRadius: "10px",
                                border: `1px solid ${isAuthorized ? theme.primary : theme.border}`,
                                backgroundColor: isAuthorized
                                  ? theme.accentBg
                                  : "transparent",
                                color: isAuthorized
                                  ? theme.primary
                                  : theme.textMain,
                                textAlign: "center",
                                outline: "none",
                                fontSize: "15px",
                                fontWeight: "900",
                              }}
                            />
                            <span
                              style={{
                                color: theme.textMuted,
                                fontWeight: "900",
                                fontSize: "16px",
                              }}
                            >
                              /
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={inputValues.total}
                              onChange={(e) =>
                                handleInputChange(
                                  course.course_id,
                                  "total",
                                  e.target.value,
                                )
                              }
                              disabled={!isAuthorized}
                              style={{
                                width: "80px",
                                padding: "12px",
                                borderRadius: "10px",
                                border: `1px solid ${theme.border}`,
                                backgroundColor: darkMode
                                  ? "rgba(255,255,255,0.02)"
                                  : "white",
                                color: theme.textMuted,
                                textAlign: "center",
                                outline: "none",
                                fontSize: "15px",
                                fontWeight: "900",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div
                  style={{ display: "flex", gap: "16px", marginTop: "16px" }}
                >
                  <button
                    type="button"
                    onClick={() => handleSaveGrade("draft")}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: "16px",
                      backgroundColor: "transparent",
                      color: theme.textMain,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "14px",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: "pointer",
                      transition: "0.2s",
                      letterSpacing: "0.5px",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "#F1F5F9")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    {isSaving ? "SAVING DRAFT..." : "SAVE AS DRAFT"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveGrade("published")}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: "16px",
                      backgroundColor: theme.primary,
                      color: "#000",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "14px",
                      fontWeight: "900",
                      cursor: "pointer",
                      transition: "0.2s",
                      letterSpacing: "0.5px",
                      boxShadow: `0 10px 20px -10px ${theme.primary}80`,
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                    onMouseLeave={(e) => (e.target.style.opacity = 1)}
                  >
                    {isSaving ? "PUBLISHING..." : "PUBLISH TO STUDENT"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              zIndex: 9999,
              background: toast.type === "error" ? theme.danger : theme.success,
              color: "#000",
              padding: "16px 24px",
              borderRadius: "16px",
              boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: "800",
              fontSize: "14px",
              letterSpacing: "0.5px",
            }}
          >
            {toast.type === "success" && <CheckCircle2 size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

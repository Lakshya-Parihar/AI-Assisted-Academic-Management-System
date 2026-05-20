import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  FileText,
  ArrowLeft,
  CloudUpload,
  File,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Trash2,
  Edit3,
  ChevronRight,
  Eye,
  ChevronDown,
} from "lucide-react";
import facultyApi from "../../services/facultyApi";

// --- Premium Custom Dropdown Component ---
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
        width: "100%",
        marginBottom: "24px",
      }}
    >
      {label && (
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
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "16px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? `0 0 15px ${theme.primary}22` : "none",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            paddingRight: "10px",
          }}
        >
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
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              zIndex: 100,
              maxHeight: "200px",
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
                  padding: "10px 12px",
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

const FacultyAssignments = () => {
  const { darkMode = true } = useOutletContext() || {};

  // --- STATES (Untouched) ---
  const [view, setView] = useState("list");
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentStatusList, setStudentStatusList] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [marks, setMarks] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  const [formData, setFormData] = useState({
    branch_id: "",
    semester: "",
    course_id: "",
    title: "",
    description: "",
    deadline: "",
    attachment: null,
  });

  // --- SCHOLAR AI THEME ---
  const theme = {
    primary: "#F59E0B", // Amber
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
    indigo: "#6366F1",
    accentBg: darkMode ? "rgba(245, 158, 11, 0.05)" : "rgba(245, 158, 11, 0.1)",
  };

  // --- API CALLS & LOGIC (Untouched) ---
  useEffect(() => {
    fetchAssignments();
    fetchBranches();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await facultyApi.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await facultyApi.get("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async (branchId, semester) => {
    try {
      const res = await facultyApi.get(
        `/courses/filteredcourses?branch=${branchId}&semester=${semester}`,
      );
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedBranch && selectedSemester)
      fetchCourses(selectedBranch, selectedSemester);
  }, [selectedBranch, selectedSemester]);

  const fetchAssignmentStatus = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const res = await facultyApi.get(`/assignments/${assignment.id}/status`);
      setStudentStatusList(res.data);
      setView("status");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    try {
      await facultyApi.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      alert("Error deleting assignment");
    }
  };

  const handleEdit = (assignment) => {
    setIsEditing(true);
    setEditId(assignment.id);
    setExistingFile(assignment.attachment_url);
    setFormData({
      course_id: assignment.course_id,
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline ? assignment.deadline.slice(0, 16) : "",
      attachment: null,
    });
    setView("create");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("branch_id", selectedBranch);
    data.append("semester", selectedSemester);
    data.append("course_id", formData.course_id);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("deadline", formData.deadline);
    if (formData.attachment) data.append("attachment", formData.attachment);

    try {
      if (isEditing) {
        await facultyApi.put(`/assignments/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Assignment Updated!");
      } else {
        await facultyApi.post("/assignments/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Assignment Created Successfully!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error saving assignment");
    }
  };

  const resetForm = () => {
    setView("list");
    fetchAssignments();
    setIsEditing(false);
    setEditId(null);
    setExistingFile(null);
    setFormData({
      course_id: "",
      title: "",
      description: "",
      deadline: "",
      attachment: null,
    });
  };

  const handleMarksChange = (submissionId, value) => {
    setMarks((prev) => ({ ...prev, [submissionId]: value }));
  };

  const saveMarks = async (submissionId) => {
    try {
      await facultyApi.put(`/assignments/grade/${submissionId}`, {
        marks: marks[submissionId],
      });
      alert("Marks saved successfully");
      fetchAssignmentStatus(selectedAssignment);
    } catch (err) {
      console.error(err);
      alert("Error saving marks");
    }
  };

  const inputStyle = {
    padding: "16px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
    color: theme.textMain,
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontWeight: "600",
  };

  // --- UI RENDER ---
  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "32px",
        minHeight: "100vh",
        color: theme.textMain,
      }}
    >
      {/* Hide Scrollbars Global Override */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- LIST VIEW --- */}
      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    margin: "0 0 8px 0",
                    letterSpacing: "-1px",
                  }}
                >
                  Assignment Management
                </h1>
                <p
                  style={{
                    margin: 0,
                    color: theme.textMuted,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Manage deployments, track submissions, and evaluate
                  performance.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setView("create");
                  setFormData({
                    course_id: "",
                    title: "",
                    description: "",
                    deadline: "",
                    attachment: null,
                  });
                }}
                style={{
                  background: theme.primary,
                  color: "#000",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "14px",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "0.2s",
                  letterSpacing: "1px",
                  fontSize: "13px",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
              >
                <Plus size={18} strokeWidth={3} /> DEPLOY ASSIGNMENT
              </button>
            </header>

            <div
              style={{
                background: theme.surface,
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1.5fr 1.5fr 1.2fr 1fr 1fr",
                  alignItems: "center",
                  padding: "20px 24px",
                  background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                  borderBottom: `1px solid ${theme.border}`,
                  color: theme.textMuted,
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                <div>Assignment Name</div>
                <div>Course Context</div>
                <div>Deadline</div>
                <div>Compliance</div>
                <div>Status</div>
                <div style={{ textAlign: "right" }}>Actions</div>
              </div>

              {assignments.length === 0 ? (
                <div
                  style={{
                    padding: "60px",
                    textAlign: "center",
                    color: theme.textMuted,
                  }}
                >
                  <FileText
                    size={48}
                    style={{ margin: "0 auto 16px", opacity: 0.3 }}
                  />
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      margin: "0 0 8px 0",
                      color: theme.textMain,
                    }}
                  >
                    No Deployments Found
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Click "Deploy Assignment" to initialize a new task.
                  </p>
                </div>
              ) : (
                assignments.map((assign) => {
                  const total = assign.total_students || 0;
                  const count = assign.submission_count || 0;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  const isActive = assign.status === "active";

                  return (
                    <div
                      key={assign.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2.5fr 1.5fr 1.5fr 1.2fr 1fr 1fr",
                        alignItems: "center",
                        padding: "24px",
                        borderBottom: `1px solid ${theme.border}`,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = darkMode
                          ? "rgba(255,255,255,0.01)"
                          : "#FAFBFC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
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
                          <FileText size={20} />
                        </div>
                        <span
                          style={{
                            fontWeight: "800",
                            color: theme.textMain,
                            fontSize: "15px",
                          }}
                        >
                          {assign.title}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: theme.textMuted,
                          fontWeight: "600",
                        }}
                      >
                        {assign.course_name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: theme.textMuted,
                          fontWeight: "600",
                        }}
                      >
                        <Calendar size={14} color={theme.primary} />{" "}
                        {new Date(assign.deadline).toLocaleDateString()}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              height: "6px",
                              width: "80px",
                              background: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "#E2E8F0",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: theme.primary,
                                borderRadius: "10px",
                              }}
                            ></div>
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "800",
                              color: theme.textMain,
                            }}
                          >
                            {count}/{total}
                          </span>
                        </div>
                        <button
                          onClick={() => fetchAssignmentStatus(assign)}
                          style={{
                            fontSize: "11px",
                            fontWeight: "800",
                            color: theme.primary,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: 0,
                            textTransform: "uppercase",
                          }}
                        >
                          View Submission <ChevronRight size={12} />
                        </button>
                      </div>
                      <div>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "900",
                            background: isActive
                              ? `${theme.success}15`
                              : `${theme.danger}15`,
                            color: isActive ? theme.success : theme.danger,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {assign.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(assign)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.primary,
                            background: `${theme.primary}15`,
                            cursor: "pointer",
                            border: "none",
                            transition: "0.2s",
                          }}
                          title="Modify"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(assign.id)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.danger,
                            background: `${theme.danger}15`,
                            cursor: "pointer",
                            border: "none",
                            transition: "0.2s",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* --- STATUS VIEW --- */}
        {view === "status" && selectedAssignment && (
          <motion.div
            key="status"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                <button
                  onClick={() => setView("list")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: theme.textMuted,
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                    marginBottom: "16px",
                    background: "none",
                    border: "none",
                    padding: 0,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = theme.primary)}
                  onMouseLeave={(e) => (e.target.style.color = theme.textMuted)}
                >
                  <ArrowLeft size={16} /> Return to Submissions
                </button>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    color: theme.textMain,
                    margin: "0 0 8px 0",
                    letterSpacing: "-1px",
                  }}
                >
                  {selectedAssignment.title}
                </h1>
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: "14px",
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  Student Submissions
                </p>
              </div>
            </div>

            <div
              style={{
                background: theme.surface,
                borderRadius: "24px",
                border: `1px solid ${theme.border}`,
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <div className="hide-scroll" style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: darkMode
                          ? "rgba(255,255,255,0.02)"
                          : "#F8FAFC",
                        borderBottom: `1px solid ${theme.border}`,
                      }}
                    >
                      {[
                        "Student ID",
                        "Enrollment",
                        "Status",
                        "Timestamp",
                        "Evaluation",
                        "Attachment",
                      ].map((head, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "20px 24px",
                            fontSize: "11px",
                            fontWeight: "800",
                            color: theme.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            textAlign: head === "Artifact" ? "center" : "left",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentStatusList.map((student) => {
                      const submitted = !!student.submission_id;
                      return (
                        <tr
                          key={student.student_id}
                          style={{
                            borderBottom: `1px solid ${theme.border}`,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = darkMode
                              ? "rgba(255,255,255,0.01)"
                              : "#FAFBFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "20px 24px",
                              fontSize: "14px",
                              fontWeight: "800",
                              color: theme.textMain,
                            }}
                          >
                            {student.name}
                          </td>
                          <td
                            style={{
                              padding: "20px 24px",
                              fontSize: "13px",
                              color: theme.textMuted,
                              fontWeight: "600",
                            }}
                          >
                            {student.enrollment_no}
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "10px",
                                fontWeight: "900",
                                background: submitted
                                  ? `${theme.success}15`
                                  : `${theme.danger}15`,
                                color: submitted ? theme.success : theme.danger,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                              }}
                            >
                              {submitted ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <XCircle size={12} />
                              )}{" "}
                              {submitted ? "Acquired" : "Pending"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "20px 24px",
                              fontSize: "13px",
                              color: theme.textMuted,
                              fontWeight: "600",
                            }}
                          >
                            {student.submitted_at
                              ? new Date(
                                  student.submitted_at,
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            {submitted ? (
                              student.marks_obtained !== null &&
                              student.marks_obtained !== undefined ? (
                                <span
                                  style={{
                                    fontWeight: "900",
                                    color: theme.primary,
                                    fontSize: "15px",
                                  }}
                                >
                                  {student.marks_obtained}{" "}
                                  <span
                                    style={{
                                      color: theme.textMuted,
                                      fontSize: "12px",
                                    }}
                                  >
                                    / 50
                                  </span>
                                </span>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                  }}
                                >
                                  <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    style={{
                                      width: "60px",
                                      padding: "8px",
                                      borderRadius: "8px",
                                      border: `1px solid ${theme.border}`,
                                      background: darkMode
                                        ? "rgba(255,255,255,0.03)"
                                        : "white",
                                      color: theme.textMain,
                                      fontSize: "13px",
                                      outline: "none",
                                      fontWeight: "700",
                                      textAlign: "center",
                                    }}
                                    onChange={(e) =>
                                      handleMarksChange(
                                        student.submission_id,
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <button
                                    onClick={() =>
                                      saveMarks(student.submission_id)
                                    }
                                    style={{
                                      padding: "8px 16px",
                                      background: theme.indigo,
                                      color: "white",
                                      border: "none",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      fontWeight: "800",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Grade
                                  </button>
                                </div>
                              )
                            ) : (
                              <span
                                style={{
                                  color: theme.textMuted,
                                  fontWeight: "600",
                                }}
                              >
                                —
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "20px 24px",
                              textAlign: "center",
                            }}
                          >
                            {submitted ? (
                              <a
                                href={`http://localhost:5001/uploads/${student.file_url}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "10px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: theme.indigo,
                                  background: `${theme.indigo}15`,
                                  textDecoration: "none",
                                  transition: "0.2s",
                                }}
                                title="Inspect Artifact"
                              >
                                <Eye size={16} />
                              </a>
                            ) : (
                              <span style={{ color: theme.border }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- CREATE / EDIT VIEW --- */}
        {view === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ maxWidth: "1000px", margin: "0 auto" }}
          >
            <button
              onClick={() => setView("list")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: theme.textMuted,
                fontSize: "12px",
                fontWeight: "800",
                cursor: "pointer",
                marginBottom: "24px",
                background: "none",
                border: "none",
                padding: 0,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => (e.target.style.color = theme.primary)}
              onMouseLeave={(e) => (e.target.style.color = theme.textMuted)}
            >
              <ArrowLeft size={16} /> Return to Submissions
            </button>

            <h2
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: theme.textMain,
                marginBottom: "32px",
                letterSpacing: "-1px",
              }}
            >
              {isEditing ? "Modify Assignment" : "Create Assignment"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                background: theme.surface,
                borderRadius: "32px",
                padding: "40px",
                border: `1px solid ${theme.border}`,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "x",
                  columnGap: "24px",
                }}
              >
                <ScholarSelect
                  label="BRANCH"
                  value={selectedBranch}
                  onChange={(val) => {
                    setSelectedBranch(val);
                    setSelectedSemester("");
                    setCourses([]);
                  }}
                  options={branches.map((b) => ({
                    label: b.branch_name,
                    value: b.id,
                  }))}
                  theme={theme}
                  darkMode={darkMode}
                />

                <ScholarSelect
                  label="SEMESTER"
                  value={selectedSemester}
                  onChange={(val) => {
                    setSelectedSemester(val);
                    setFormData({ ...formData, semester: val });
                    setCourses([]);
                  }}
                  options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
                    label: `Semester ${s}`,
                    value: s,
                  }))}
                  theme={theme}
                  darkMode={darkMode}
                />

                <ScholarSelect
                  label="COURSE"
                  value={formData.course_id}
                  disabled={!selectedSemester}
                  onChange={(val) =>
                    setFormData({ ...formData, course_id: val })
                  }
                  options={courses.map((c) => ({
                    label: c.course_name,
                    value: c.course_id,
                  }))}
                  theme={theme}
                  darkMode={darkMode}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "24px",
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
                    ASSIGNMENT TITLE
                  </label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. Quantum Mechanics Essay"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "24px",
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
                  DEADLINE
                </label>
                <input
                  type="datetime-local"
                  style={{
                    ...inputStyle,
                    maxWidth: "300px",
                    colorScheme: darkMode ? "dark" : "light",
                  }}
                  required
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "32px",
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
                  DESCRIPTION / INSTRUCTIONS (OPTIONAL)
                </label>
                <textarea
                  style={{ ...inputStyle, height: "120px", resize: "vertical" }}
                  placeholder="Enter detailed instructions here..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "40px",
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
                  {isEditing ? "MODIFY ATTACHMENT (OPTIONAL)" : "ATTACH ATTACHMENT"}
                </label>
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  style={{
                    border: `2px dashed ${theme.primary}55`,
                    borderRadius: "20px",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: darkMode
                      ? "rgba(245, 158, 11, 0.02)"
                      : "#FFFBEB",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkMode
                      ? "rgba(245, 158, 11, 0.05)"
                      : "#FEF3C7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = darkMode
                      ? "rgba(245, 158, 11, 0.02)"
                      : "#FFFBEB")
                  }
                >
                  <CloudUpload
                    size={40}
                    color={theme.primary}
                    style={{ marginBottom: "16px" }}
                  />
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: theme.textMain,
                      marginBottom: "8px",
                    }}
                  >
                    {formData.attachment ? (
                      <span style={{ color: theme.success }}>
                        {formData.attachment.name} (Staged)
                      </span>
                    ) : existingFile ? (
                      <span>
                        Active Attachment:{" "}
                        <span style={{ color: theme.primary }}>
                          {existingFile}
                        </span>
                      </span>
                    ) : (
                      "BROWSE ATTACHMENTS"
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.textMuted,
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isEditing && !formData.attachment
                      ? "Click to overwrite existing attachment"
                      : "Supported: PDF, DOCX, JPG"}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  paddingTop: "24px",
                  borderTop: `1px solid ${theme.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setView("list")}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: `1px solid ${theme.border}`,
                    background: "transparent",
                    color: theme.textMain,
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "#F1F5F9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "14px 32px",
                    borderRadius: "14px",
                    border: "none",
                    background: theme.primary,
                    color: "#000",
                    fontWeight: "900",
                    fontSize: "13px",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                  onMouseLeave={(e) => (e.target.style.opacity = 1)}
                >
                  {isEditing ? "UPDATE ASSIGNMENT" : "DEPLOY ASSIGNMENT"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyAssignments;

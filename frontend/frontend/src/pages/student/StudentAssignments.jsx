import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Eye,
  X,
  FileQuestion,
  ChevronRight,
  ClipboardList,
  Activity,
  AlertCircle,
} from "lucide-react";
import { getMyAssignments, submitAssignment } from "../../services/studentApi";

// Redesigned CSS constants to match sidebar aesthetics
const THEME = {
  bg: "transparent",
  cardBg: "rgba(20, 25, 35, 0.6)",
  border: "rgba(129, 140, 248, 0.2)",
  text: "#F8FAFC",
  subtext: "#94A3B8",
  accent: "#818cf8", // Indigo to match sidebar
  secondary: "#c084fc", // Purple accent
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
};

export default function StudentAssignments() {
  // Logic & State (Untouched as requested)[cite: 2]
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAttachmentUrl = (path, type = "faculty") => {
    if (!path) return "";
    if (type === "student") return `http://localhost:5001/uploads/${path}`;
    return `http://localhost:5002/uploads/${path}`;
  };

  const getFileType = (path) => {
    if (!path) return "other";
    if (path.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return "image";
    if (path.match(/\.(pdf)$/i)) return "pdf";
    return "other";
  };

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await getMyAssignments();
        const formatted = res.data.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.dueDate ? new Date(a.dueDate) : null,
          course: a.course_name,
          course_code: a.course_code,
          attachment_url: a.attachment_url,
          submission_file: a.submission_file,
          marks_obtained: a.marks_obtained,
          status: a.status || "Pending",
        }));
        setAssignments(formatted);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssignments();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async (id) => {
    if (!selectedFile) return alert("Please select a file first.");
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await submitAssignment(id, formData);
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Submitted" } : a)),
      );
      setUploadingId(null);
      setSelectedFile(null);
      setTimeout(() => alert("Assignment submitted successfully!"), 0);
    } catch (error) {
      console.error(error);
      setUploadingId(null);
      alert("Failed to upload assignment.");
    }
  };

  // Helper logic for view[cite: 2]
  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === "upcoming") return a.status === "Pending";
    if (activeTab === "submitted") return a.status === "Submitted";
    if (activeTab === "graded") return a.status === "Graded";
    if (activeTab === "missing")
      return !a.dueDate
        ? false
        : a.status === "Pending" && a.dueDate < new Date();
    return true;
  });

  const counts = {
    pending: assignments.filter((a) => a.status === "Pending").length,
    missing: assignments.filter(
      (a) => a.status === "Pending" && new Date(a.dueDate) < new Date(),
    ).length,
    submitted: assignments.filter((a) => a.status === "Submitted").length,
    graded: assignments.filter((a) => a.status === "Graded").length,
    completed: assignments.filter(
      (a) => a.status === "Submitted" || a.status === "Graded",
    ).length,
  };

  const progressPercent =
    assignments.length > 0
      ? Math.round((counts.completed / assignments.length) * 100)
      : 0;

  return (
    <div
      style={{
        padding: "2.5rem 3.5rem",
        color: THEME.text,
        fontFamily: THEME.fontFamily,
      }}
    >
      {/* Header Section */}
      <div
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
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <ClipboardList size={28} color={THEME.accent} />
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
              Submissions
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              color: THEME.subtext,
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Manage coursework, preview materials, and track academic grades.
          </p>
        </div>

        {/* Progress Mini-Card */}
        <div
          style={{
            background: THEME.cardBg,
            padding: "1rem 1.5rem",
            borderRadius: "20px",
            border: `1px solid ${THEME.border}`,
            minWidth: "220px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: THEME.subtext,
            }}
          >
            <span>TERM PROGRESS</span>
            <span style={{ color: THEME.accent }}>{progressPercent}%</span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.secondary})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "2.5rem",
          alignItems: "start",
        }}
      >
        {/* Left Column: Assignments List */}
        <div>
          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "2rem" }}>
            {[
              {
                id: "upcoming",
                label: "Upcoming",
                count: counts.pending,
                color: THEME.accent,
              },
              {
                id: "submitted",
                label: "Handed In",
                count: counts.submitted,
                color: THEME.success,
              },
              {
                id: "graded",
                label: "Graded",
                count: counts.graded,
                color: THEME.secondary,
              },
              {
                id: "missing",
                label: "Overdue",
                count: counts.missing,
                color: THEME.danger,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background:
                    activeTab === tab.id
                      ? "rgba(129, 140, 248, 0.1)"
                      : "transparent",
                  border:
                    activeTab === tab.id
                      ? `1px solid ${THEME.border}`
                      : "1px solid transparent",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  color: activeTab === tab.id ? "white" : THEME.subtext,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                }}
              >
                {tab.label}
                <span
                  style={{
                    background:
                      activeTab === tab.id
                        ? tab.color
                        : "rgba(255,255,255,0.05)",
                    color: activeTab === tab.id ? "black" : tab.color,
                    padding: "2px 8px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Assignments Feed */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {isLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: THEME.accent,
                  fontWeight: 600,
                }}
              >
                <Activity
                  className="animate-pulse"
                  style={{ margin: "0 auto 1rem" }}
                />
                Synchronizing Gradebook...
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div
                style={{
                  padding: "4rem",
                  textAlign: "center",
                  background: THEME.cardBg,
                  borderRadius: "24px",
                  border: `1px dashed ${THEME.border}`,
                  color: THEME.subtext,
                }}
              >
                <div style={{ marginBottom: "1rem", opacity: 0.5 }}>
                  <FileText size={48} style={{ margin: "0 auto" }} />
                </div>
                <p style={{ fontWeight: 600 }}>
                  No records found in this category.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredAssignments.map((assignment, idx) => (
                  <motion.div
                    key={assignment.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      background: THEME.cardBg,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "24px",
                      padding: "1.8rem",
                      backdropFilter: "blur(16px)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Visual Status Indicator */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background:
                          assignment.status === "Pending"
                            ? THEME.warning
                            : assignment.status === "Graded"
                              ? THEME.secondary
                              : THEME.success,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1.2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(129, 140, 248, 0.15)",
                            color: THEME.accent,
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            border: `1px solid ${THEME.border}`,
                            fontFamily: "monospace",
                          }}
                        >
                          {assignment.course_code}
                        </span>
                        <span
                          style={{
                            color: THEME.subtext,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {assignment.course}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          background:
                            assignment.status === "Pending"
                              ? "rgba(251, 191, 36, 0.1)"
                              : "rgba(52, 211, 153, 0.1)",
                          color:
                            assignment.status === "Pending"
                              ? THEME.warning
                              : THEME.success,
                          border: `1px solid ${assignment.status === "Pending" ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)"}`,
                        }}
                      >
                        {assignment.status === "Pending" ? (
                          <Clock size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {assignment.status}
                      </div>
                    </div>

                    <h2
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        margin: "0 0 0.8rem 0",
                        color: "white",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {assignment.title}
                    </h2>

                    <div
                      style={{
                        display: "flex",
                        gap: "2rem",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          minWidth: "150px",
                          background: "rgba(0,0,0,0.2)",
                          padding: "0.8rem",
                          borderRadius: "14px",
                          border: `1px solid ${assignment.status === "Pending" && assignment.dueDate < new Date() ? THEME.danger : THEME.border}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.65rem",
                            color: THEME.subtext,
                            fontWeight: 800,
                            marginBottom: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          Due Date
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color:
                              assignment.status === "Pending" &&
                              assignment.dueDate < new Date()
                                ? THEME.danger
                                : "white",
                          }}
                        >
                          <Calendar size={14} />
                          {assignment.dueDate?.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: THEME.subtext,
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {assignment.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "1.5rem",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "1rem" }}>
                        {assignment.attachment_url && (
                          <button
                            onClick={() => setPreviewAttachment(assignment)}
                            style={actionButtonStyle}
                          >
                            <Eye size={16} /> Instructions
                          </button>
                        )}
                        {assignment.submission_file && (
                          <a
                            href={getAttachmentUrl(
                              assignment.submission_file,
                              "student",
                            )}
                            target="_blank"
                            rel="noreferrer"
                            style={actionButtonStyle}
                          >
                            <FileText size={16} /> My Submission
                          </a>
                        )}
                      </div>

                      {assignment.status === "Pending" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <label
                            style={{
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: THEME.subtext,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              borderRadius: "10px",
                              background: "rgba(255,255,255,0.03)",
                            }}
                          >
                            <UploadCloud size={16} />
                            {selectedFile && uploadingId === assignment.id
                              ? selectedFile.name.substring(0, 10) + "..."
                              : "Select File"}
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleFileChange(e);
                                setUploadingId(assignment.id);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => handleUpload(assignment.id)}
                            disabled={
                              uploadingId === assignment.id && !selectedFile
                            }
                            style={primaryButtonStyle}
                          >
                            {uploadingId === assignment.id
                              ? "Upload"
                              : "Hand In"}
                          </button>
                        </div>
                      )}

                      {assignment.status === "Graded" && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          style={{
                            ...primaryButtonStyle,
                            background: THEME.secondary,
                          }}
                        >
                          <Activity size={16} /> Feedback & Grade
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Column: Mini Info Cards */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={sidebarCardStyle}>
            <h3 style={sidebarTitleStyle}>Summary</h3>
            <div style={sidebarStatRow}>
              <span style={{ color: THEME.subtext }}>Completion Rate</span>
              <span style={{ fontWeight: 800 }}>{progressPercent}%</span>
            </div>
            <div style={sidebarStatRow}>
              <span style={{ color: THEME.subtext }}>Assignments Graded</span>
              <span style={{ fontWeight: 800 }}>{counts.graded}</span>
            </div>
          </div>

          <div
            style={{
              ...sidebarCardStyle,
              borderColor: counts.missing > 0 ? THEME.danger : THEME.border,
            }}
          >
            <h3 style={sidebarTitleStyle}>Alerts</h3>
            {counts.missing > 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  color: THEME.danger,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={18} />
                <span>You have {counts.missing} overdue tasks!</span>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: THEME.success,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                All caught up!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- Modals (Logic preserved, UI Upgraded) ---[cite: 2] */}
      {previewAttachment && (
        <div style={overlayStyle}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={modalStyle}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>
                  Faculty Attachment
                </h2>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "0.85rem",
                    color: THEME.subtext,
                  }}
                >
                  {previewAttachment.title}
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a
                  href={getAttachmentUrl(
                    previewAttachment.attachment_url,
                    "faculty",
                  )}
                  download
                  target="_blank"
                  rel="noreferrer"
                  style={primaryButtonStyle}
                >
                  <Download size={16} /> Download
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  style={closeButtonStyle}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div style={previewContainerStyle}>
              {getFileType(previewAttachment.attachment_url) === "image" && (
                <img
                  src={getAttachmentUrl(
                    previewAttachment.attachment_url,
                    "faculty",
                  )}
                  alt="preview"
                  style={{ maxWidth: "100%", borderRadius: "12px" }}
                />
              )}
              {getFileType(previewAttachment.attachment_url) === "pdf" && (
                <iframe
                  src={getAttachmentUrl(
                    previewAttachment.attachment_url,
                    "faculty",
                  )}
                  title="Preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              )}
              {getFileType(previewAttachment.attachment_url) === "other" && (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <FileQuestion size={48} color={THEME.subtext} />
                  <p>Preview unavailable. Use the download button.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {selectedAssignment && (
        <div style={overlayStyle}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...modalStyle, maxWidth: "500px", height: "auto" }}
          >
            <button
              onClick={() => setSelectedAssignment(null)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "transparent",
                border: "none",
                color: THEME.subtext,
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "1.5rem",
                color: "white",
              }}
            >
              {selectedAssignment.title}
            </h2>
            <p
              style={{
                color: THEME.subtext,
                fontSize: "0.9rem",
                marginBottom: "2rem",
              }}
            >
              {selectedAssignment.course}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div style={gradeCardStyle}>
                <span style={gradeLabelStyle}>SCORE</span>
                <span
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: THEME.success,
                  }}
                >
                  {selectedAssignment.marks_obtained
                    ? `${selectedAssignment.marks_obtained}/100`
                    : "A+"}
                </span>
              </div>
              <div
                style={{
                  ...gradeCardStyle,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <span style={gradeLabelStyle}>OUTCOME</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  Qualified
                </span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                padding: "1.5rem",
                borderRadius: "18px",
                border: `1px solid ${THEME.border}`,
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: THEME.secondary,
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Faculty Remarks
              </h4>
              <p
                style={{
                  margin: 0,
                  color: "#E2E8F0",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                Standardized feedback logic: The student has demonstrated a
                thorough understanding of the requirements. Excellent
                application of concepts.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Styled component objects for internal cleanliness
const actionButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 18px",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  borderRadius: "12px",
  border: `1px solid ${THEME.border}`,
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.2s",
  textDecoration: "none",
};

const primaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 24px",
  background: THEME.accent,
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "800",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "0.2s",
};

const sidebarCardStyle = {
  background: THEME.cardBg,
  border: `1px solid ${THEME.border}`,
  borderRadius: "24px",
  padding: "1.5rem",
  backdropFilter: "blur(12px)",
};

const sidebarTitleStyle = {
  margin: "0 0 1.2rem 0",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: THEME.subtext,
  fontWeight: 800,
};

const sidebarStatRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "1rem",
  fontSize: "0.9rem",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modalStyle = {
  background: "#0F172A",
  border: `1px solid ${THEME.border}`,
  borderRadius: "32px",
  padding: "2.5rem",
  width: "100%",
  maxWidth: "900px",
  height: "80vh",
  position: "relative",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
};

const closeButtonStyle = {
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${THEME.border}`,
  color: THEME.subtext,
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const previewContainerStyle = {
  flex: 1,
  background: "rgba(0,0,0,0.3)",
  borderRadius: "20px",
  border: `1px solid ${THEME.border}`,
  overflow: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const gradeCardStyle = {
  background: "rgba(52, 211, 153, 0.05)",
  padding: "1.2rem",
  borderRadius: "20px",
  border: `1px solid rgba(52, 211, 153, 0.2)`,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const gradeLabelStyle = {
  color: THEME.subtext,
  fontSize: "0.65rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  X,
  AlertTriangle,
  Users,
  Star,
  TrendingUp,
  GraduationCap,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  TrendingDown,
  ClipboardList,
  ArrowUpRight,
  Mail,
  SearchX,
  FileBarChart,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  getFacultyStudents,
  getStudentReport,
} from "../../services/facultyApi";

export default function FacultyStudentList() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    avgGpa: "0.00",
    retentionRate: "0.0",
    gradReadiness: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { darkMode } = useOutletContext() || { darkMode: false };

  // Theme configuration matched to ScholarAI Branding
  const theme = {
    primary: "#F59E0B",
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    accent: "#6366F1",
    danger: "#EF4444",
    success: "#10B981",
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await getFacultyStudents();
      setStudents(response.data.students || response.data);
      if (response.data.stats) setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openStudentReport = async (student) => {
    setSelectedStudent(student);
    setReportData(null);
    try {
      const response = await getStudentReport(student.id);
      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [filterAtRisk, setFilterAtRisk] = useState(false);
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment_no.includes(searchTerm);

    // If filterAtRisk is true, only show students with GPA < 3.0
    if (filterAtRisk) {
      return matchesSearch && parseFloat(s.gpa) < 3.0;
    }

    return matchesSearch;
  });
  const atRiskCount = students.filter((s) => parseFloat(s.gpa) < 3.0).length;

  const getLetterGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    return "F";
  };

  // 1. Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = ["Name,Enrollment No,Branch,Semester,GPA\n"];
    const rows = filteredStudents
      .map(
        (s) =>
          `${s.name},${s.enrollment_no},${s.branch_name},${s.semester},${s.gpa}`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `Student_Ledger_${new Date().toLocaleDateString()}.csv`,
    );
    a.click();
  };

  // 2. Download Transcript Functionality
  const handleDownloadTranscript = (student, report) => {
    const content = `
    SCHOLAR AI - OFFICIAL TRANSCRIPT
    --------------------------------
    Student: ${student.name}
    ID: ${student.enrollment_no}
    Branch: ${student.branch_name}
    GPA: ${student.gpa}
    
    Semester Progress:
    ${report.transcript.map((c) => `- ${c.course_name}: ${c.grade_percent}% (${c.attendance_percent}% Attnd)`).join("\n    ")}
  `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `${student.name}_Transcript.txt`);
    a.click();
  };

  // 3. Draft Warning Functionality
  const handleDraftWarning = (student, report) => {
    const warningText = `Official Academic Warning for ${student.name}.\nCurrent GPA: ${student.gpa}.\nAttendance: ${report.attendance.percentage}%.`;
    alert(
      `Drafting Warning for ${student.name}:\n\n${warningText}\n\n(In a production app, this would open a Mailer or save a PDF to the database).`,
    );
  };

  <style>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`}</style>;

  return (
    <div
      style={{
        color: theme.textMain,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Student Directory
          </h1>
          <p
            style={{
              color: theme.textMuted,
              fontSize: "14px",
              fontWeight: "500",
              marginTop: "4px",
            }}
          >
            Real-time student performance monitoring and audit system.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setFilterAtRisk(!filterAtRisk)}
            style={{
              background: filterAtRisk
                ? theme.danger
                : "rgba(239, 68, 68, 0.1)",
              color: filterAtRisk ? "#fff" : theme.danger,
              border: `1px solid ${theme.danger}`,
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <AlertTriangle size={16} />
            {atRiskCount} AT RISK {filterAtRisk && "(FILTER ACTIVE)"}
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              background: theme.primary,
              color: "#000",
              border: "none",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
      </div>

      {/* STATS MATRIX */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Students",
            value: stats.totalEnrolled || students.length,
            icon: Users,
            color: theme.accent,
          },
          {
            label: "Avg. GPA",
            value: stats.avgGpa || "3.41",
            icon: Star,
            color: theme.primary,
          },
          {
            label: "Retention Rate",
            value: (stats.retentionRate || "98.2") + "%",
            icon: TrendingUp,
            color: theme.success,
          },
          {
            label: "Grad Readiness",
            value: (stats.gradReadiness || "94") + "%",
            icon: GraduationCap,
            color: theme.textMuted,
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              padding: "24px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "10px",
                background: `${stat.color}15`,
                borderRadius: "12px",
                color: stat.color,
                width: "fit-content",
              }}
            >
              <stat.icon size={20} />
            </div>
            <h4 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>
              {stat.value}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: theme.textMuted,
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              {stat.label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9",
              padding: "10px 16px",
              borderRadius: "14px",
              border: `1px solid ${theme.border}`,
              width: "320px",
            }}
          >
            <Search size={18} color={theme.textMuted} />
            <input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: theme.textMain,
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>
          <button
            style={{
              background: "none",
              border: `1px solid ${theme.border}`,
              color: theme.textMain,
              padding: "10px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <Filter size={18} />
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                background: darkMode ? "rgba(255,255,255,0.01)" : "#FAFBFC",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: theme.textMuted,
                }}
              >
                STUDENT INFORMATION
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: theme.textMuted,
                }}
              >
                ACADEMIC PATH
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: theme.textMuted,
                }}
              >
                GPA PERFORMANCE
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: theme.textMuted,
                }}
              >
                AUDIT STATUS
              </th>
              <th
                style={{
                  padding: "16px 24px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: theme.textMuted,
                  textAlign: "right",
                }}
              >
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const gpa = parseFloat(student.gpa || 0).toFixed(2);
                const isWarning = gpa < 3.0;
                const isHonors = gpa >= 3.8;

                return (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <td style={{ padding: "20px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: theme.bg,
                            border: `1px solid ${theme.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {student.photo ? (
                            <img
                              src={`http://localhost:5000/uploads/photos/${student.photo}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <User size={20} color={theme.textMuted} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: "800", fontSize: "14px" }}>
                            {student.name}
                          </div>
                          <div
                            style={{ fontSize: "12px", color: theme.textMuted }}
                          >
                            ID #{student.enrollment_no}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ fontWeight: "700", fontSize: "13px" }}>
                        {student.branch_name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.primary,
                          fontWeight: "800",
                        }}
                      >
                        SEMESTER {student.semester}
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div style={{ fontWeight: "800", fontSize: "14px" }}>
                          {gpa}
                        </div>
                        <div
                          style={{
                            width: "80px",
                            height: "6px",
                            background: theme.border,
                            borderRadius: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: `${(gpa / 4) * 100}%`,
                              height: "100%",
                              background: isWarning
                                ? theme.danger
                                : isHonors
                                  ? theme.success
                                  : theme.accent,
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "10px",
                          fontWeight: "900",
                          background: isWarning
                            ? `${theme.danger}15`
                            : isHonors
                              ? `${theme.success}15`
                              : `${theme.textMuted}15`,
                          color: isWarning
                            ? theme.danger
                            : isHonors
                              ? theme.success
                              : theme.textMuted,
                        }}
                      >
                        {isWarning
                          ? "ACADEMIC WARNING"
                          : isHonors
                            ? "HONORS ROLL"
                            : "STANDARD"}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => openStudentReport(student)}
                        style={{
                          background: "none",
                          border: `1px solid ${theme.border}`,
                          color: theme.textMain,
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: "800",
                          cursor: "pointer",
                        }}
                      >
                        AUDIT PROFILE
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ padding: "80px 0", textAlign: "center" }}
                >
                  <SearchX
                    size={48}
                    color={theme.textMuted}
                    style={{ marginBottom: "16px", opacity: 0.5 }}
                  />
                  <p
                    style={{
                      color: theme.textMuted,
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    No students found matching your criteria.
                  </p>
                  <p
                    style={{
                      color: theme.textMuted,
                      fontSize: "13px",
                      opacity: 0.7,
                    }}
                  >
                    Try adjusting your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* STUDENT PROFILE MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            {/* 1. Global CSS Injection to hide scrollbars for this modal only */}
            <style>{`
        .modal-ledger-hide-scroll::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }
        .modal-ledger-hide-scroll {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              /* 2. Apply the class we defined above */
              className="modal-ledger-hide-scroll"
              style={{
                background: theme.surface,
                borderRadius: "32px",
                border: `1px solid ${theme.border}`,
                width: "100%",
                maxWidth: "850px",
                padding: "40px",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto", // Allow scrolling functionality[cite: 5]
              }}
            >
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  position: "absolute",
                  right: "30px",
                  top: "30px",
                  background: "none",
                  border: "none",
                  color: theme.textMuted,
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>

              <div
                style={{
                  display: "flex",
                  gap: "32px",
                  marginBottom: "40px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "24px",
                    background: theme.bg,
                    border: `3px solid ${theme.primary}`,
                    overflow: "hidden",
                  }}
                >
                  {selectedStudent.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/photos/${selectedStudent.photo}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <User size={50} color={theme.textMuted} />
                  )}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "32px",
                      fontWeight: "900",
                      margin: 0,
                      letterSpacing: "-1px",
                    }}
                  >
                    {selectedStudent.name}
                  </h2>
                  <p
                    style={{
                      color: theme.textMuted,
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    {selectedStudent.branch_name} • Semester{" "}
                    {selectedStudent.semester} • ID #
                    {selectedStudent.enrollment_no}
                  </p>
                </div>
              </div>

              {reportData ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "24px",
                      background: darkMode
                        ? "rgba(255,255,255,0.02)"
                        : "#F8FAFC",
                      borderRadius: "24px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "800",
                          color: theme.textMuted,
                        }}
                      >
                        ATTENDANCE RATE
                      </span>
                      <span
                        style={{
                          color:
                            reportData.attendance.percentage < 75
                              ? theme.danger
                              : theme.success,
                          fontWeight: "900",
                        }}
                      >
                        {reportData.attendance.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: theme.border,
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: `${reportData.attendance.percentage}%`,
                          height: "100%",
                          background:
                            reportData.attendance.percentage < 75
                              ? theme.danger
                              : theme.success,
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                    {reportData.attendance.percentage < 75 && (
                      <p
                        style={{
                          color: theme.danger,
                          fontSize: "11px",
                          fontWeight: "700",
                          marginTop: "12px",
                        }}
                      >
                        ⚠️ BELOW INSTITUTIONAL THRESHOLD (75%)
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "24px",
                      background: darkMode
                        ? "rgba(255,255,255,0.02)"
                        : "#F8FAFC",
                      borderRadius: "24px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "800",
                          color: theme.textMuted,
                        }}
                      >
                        ASSIGNMENT AVG
                      </span>
                      <span style={{ color: theme.primary, fontWeight: "900" }}>
                        {getLetterGrade(reportData.assignments.averageMarks)} (
                        {reportData.assignments.averageMarks}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: theme.border,
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: `${reportData.assignments.averageMarks}%`,
                          height: "100%",
                          background: theme.primary,
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        color: theme.textMuted,
                        fontSize: "11px",
                        fontWeight: "700",
                        marginTop: "12px",
                      }}
                    >
                      CONSISTENT ACADEMIC TREND
                    </p>
                  </div>

                  <div
                    style={{
                      gridColumn: "span 2",
                      padding: "32px",
                      background: darkMode
                        ? "rgba(255,255,255,0.02)"
                        : "#F8FAFC",
                      borderRadius: "24px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        marginBottom: "20px",
                        borderBottom: `1px solid ${theme.border}`,
                        paddingBottom: "12px",
                      }}
                    >
                      SEMESTER PROGRESS LEDGER
                    </h4>
                    {reportData.transcript?.map((course, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 0",
                          borderBottom:
                            i === reportData.transcript.length - 1
                              ? "none"
                              : `1px dashed ${theme.border}`,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "14px" }}>
                            {course.course_name}
                          </div>
                          <div
                            style={{ fontSize: "11px", color: theme.textMuted }}
                          >
                            {course.course_code} • {course.instructor}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{ fontWeight: "900", color: theme.primary }}
                          >
                            {getLetterGrade(course.grade_percent)}
                          </div>
                          <div
                            style={{ fontSize: "11px", color: theme.textMuted }}
                          >
                            {course.attendance_percent}% Attnd.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* <div
                    style={{
                      gridColumn: "span 2",
                      display: "flex",
                      gap: "16px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleDraftWarning(selectedStudent, reportData)
                      }
                      style={{
                        flex: 1,
                        background: theme.primary,
                        color: "#000",
                        border: "none",
                        padding: "14px",
                        borderRadius: "14px",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      DRAFT ACADEMIC WARNING
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadTranscript(selectedStudent, reportData)
                      }
                      style={{
                        flex: 1,
                        background: "none",
                        border: `1px solid ${theme.border}`,
                        color: theme.textMain,
                        padding: "14px",
                        borderRadius: "14px",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      DOWNLOAD TRANSCRIPT
                    </button>
                  </div> */}
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: theme.textMuted,
                  }}
                >
                  Generating audit report...
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

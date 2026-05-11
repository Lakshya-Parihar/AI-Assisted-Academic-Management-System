import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Share2,
  ShieldCheck,
  Calendar,
  Award,
  Plus,
  Clock,
  XCircle,
  CheckCircle2,
  FileText,
  X,
  Eye,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  getCertificatesData,
  requestNewCertificate,
  getMyCertificateRequests,
} from "../../services/studentApi";

const CertificateGallery = () => {
  const [data, setData] = useState({ stats: {}, certificates: [] });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reqForm, setReqForm] = useState({ requested_title: "", reason: "" });

  // NEW: Preview State
  const [previewFile, setPreviewFile] = useState(null);

  const storedStudent = JSON.parse(localStorage.getItem("studentData") || "{}");
  const studentId = storedStudent.id || storedStudent.student_id || 1;

  const fetchData = useCallback(async () => {
    try {
      const [certRes, reqRes] = await Promise.all([
        getCertificatesData(studentId),
        getMyCertificateRequests(studentId),
      ]);
      setData(certRes.data);
      setRequests(reqRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const t = {
    bg: "#0B1120",
    panel: "rgba(30, 41, 59, 0.5)",
    border: "rgba(129, 140, 248, 0.2)",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    accent: "#818cf8",
    secondary: "#c084fc",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
  };

  const getBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case "DISTINCTION":
        return {
          bg: "rgba(52, 211, 153, 0.1)",
          text: t.success,
          border: t.success,
        };
      case "EXPERTISE":
        return {
          bg: "rgba(129, 140, 248, 0.1)",
          text: t.accent,
          border: t.accent,
        };
      case "HONOR":
        return {
          bg: "rgba(192, 132, 252, 0.1)",
          text: t.secondary,
          border: t.secondary,
        };
      default:
        return {
          bg: "rgba(148, 163, 184, 0.1)",
          text: t.subtext,
          border: t.border,
        };
    }
  };

  const handleDownload = (cert) => {
    if (!cert.file_url || cert.file_url === "#") {
      alert("Official document not yet attached to ledger.");
      return;
    }
    const fileUrl = `http://localhost:5000/${cert.file_url.replace(/\\/g, "/")}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      `${cert.title.replace(/\s+/g, "_")}_cert.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (cert) => {
    if (!cert.file_url || cert.file_url === "#") {
      alert("Preview unavailable: Document pending upload.");
      return;
    }
    const fileUrl = `http://localhost:5000/${cert.file_url.replace(/\\/g, "/")}`;
    setPreviewFile({ ...cert, url: fileUrl });
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: t.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.accent,
        }}
      >
        <Clock className="animate-spin" size={48} />
      </div>
    );

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestNewCertificate({ student_id: studentId, ...reqForm });
      alert("Request sent to administration successfully.");
      setIsModalOpen(false);
      setReqForm({ requested_title: "", reason: "" });
      fetchData();
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: t.bg,
        color: t.text,
        minHeight: "100vh",
        padding: "3rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
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
              gap: "10px",
              color: t.accent,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            <Award size={16} /> Verified Academic Ledger
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
            Certificate Gallery
          </h1>
          <p
            style={{
              color: t.subtext,
              marginTop: "8px",
              fontSize: "1rem",
              maxWidth: "600px",
            }}
          >
            Securely manage and verify your earned honors and professional
            certifications.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})`,
            border: "none",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "14px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 20px -5px rgba(129,140,248,0.4)",
          }}
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "4rem",
        }}
      >
        {[
          {
            label: "Earned Assets",
            val: data.stats.total_earned,
            icon: <CheckCircle2 color={t.success} />,
          },
          {
            label: "Dean's Excellence",
            val: data.stats.deans_list,
            icon: <ShieldCheck color={t.accent} />,
          },
          {
            label: "Course Medals",
            val: data.stats.course_medals,
            icon: <Award color={t.secondary} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: t.panel,
              border: `1px solid ${t.border}`,
              padding: "2rem",
              borderRadius: "24px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: t.subtext,
                  letterSpacing: "1px",
                }}
              >
                {stat.label.toUpperCase()}
              </span>
              {stat.icon}
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "800" }}>
              {stat.val < 10 ? `0${stat.val}` : stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem",
        }}
      >
        {data.certificates.map((cert) => {
          const badge = getBadgeColor(cert.badge_type);
          return (
            <div
              key={cert.id}
              style={{
                background: t.panel,
                border: `1px solid ${t.border}`,
                borderRadius: "28px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  height: "200px",
                  background:
                    "radial-gradient(circle at top right, #1e293b, #0f172a)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={64} color={badge.text} style={{ opacity: 0.2 }} />
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: badge.bg,
                    color: badge.text,
                    padding: "6px 14px",
                    borderRadius: "10px",
                    fontSize: "0.7rem",
                    fontWeight: "800",
                    border: `1px solid ${badge.border}`,
                  }}
                >
                  {cert.badge_type}
                </div>
              </div>

              <div style={{ padding: "2rem", flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: t.accent,
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {cert.category}
                </div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "800",
                    marginBottom: "12px",
                  }}
                >
                  {cert.title}
                </h3>
                <p
                  style={{
                    color: t.subtext,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    marginBottom: "2rem",
                  }}
                >
                  {cert.description}
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handlePreview(cert)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${t.border}`,
                      color: "white",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Eye size={16} /> Preview
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    style={{
                      flex: 1,
                      background: t.accent,
                      border: "none",
                      color: "white",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Download size={16} /> Get PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "#0F172A",
              width: "95%",
              height: "90vh",
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                padding: "1.5rem 2rem",
                background: "#1E293B",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <FileText color={t.accent} />
                <h2
                  style={{ fontSize: "1.1rem", fontWeight: "800", margin: 0 }}
                >
                  {previewFile.title}
                </h2>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  color: t.subtext,
                  padding: "8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>
            <iframe
              src={previewFile.url}
              style={{ width: "100%", flex: 1, border: "none" }}
              title="Preview"
            />
          </div>
        </div>
      )}

      {/* Requests Table */}
      {requests.length > 0 && (
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Clock color={t.accent} /> Recent Activity
          </h2>
          <div
            style={{
              background: t.panel,
              border: `1px solid ${t.border}`,
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            {requests.map((req, i) => (
              <div
                key={i}
                style={{
                  padding: "1.5rem 2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom:
                    i !== requests.length - 1
                      ? `1px solid ${t.border}`
                      : "none",
                }}
              >
                <div>
                  <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                    {req.requested_title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: t.subtext }}>
                    {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: "10px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    background:
                      req.status === "Pending"
                        ? "rgba(251,191,36,0.1)"
                        : req.status === "Approved"
                          ? "rgba(52,211,153,0.1)"
                          : "rgba(248,113,113,0.1)",
                    color:
                      req.status === "Pending"
                        ? t.warning
                        : req.status === "Approved"
                          ? t.success
                          : t.danger,
                  }}
                >
                  {req.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal - Request */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 17, 32, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              background: "#0F172A",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "28px",
              border: `1px solid ${t.border}`,
              padding: "2.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
                Request Document
              </h2>
              <X
                onClick={() => setIsModalOpen(false)}
                style={{ cursor: "pointer", color: t.subtext }}
              />
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: t.subtext,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  DOCUMENT TYPE
                </label>
                <input
                  required
                  type="text"
                  value={reqForm.requested_title}
                  onChange={(e) =>
                    setReqForm({ ...reqForm, requested_title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#1E293B",
                    border: `1px solid ${t.border}`,
                    borderRadius: "12px",
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ marginBottom: "2.5rem" }}>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: t.subtext,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  PURPOSE
                </label>
                <textarea
                  required
                  rows="4"
                  value={reqForm.reason}
                  onChange={(e) =>
                    setReqForm({ ...reqForm, reason: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#1E293B",
                    border: `1px solid ${t.border}`,
                    borderRadius: "12px",
                    color: "white",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  background: t.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                {isSubmitting ? "Processing..." : "Submit to Administration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGallery;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Download,
  AlertCircle,
  Calendar,
  Filter,
  ArrowRight,
  X,
} from "lucide-react";
import { getCircularsData } from "../../services/studentApi";
 
const Circulars = () => {
  const [data, setData] = useState({ stats: {}, circulars: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Notices");

  // State for the fully working Modal
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const res = await getCircularsData();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load circulars", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCirculars();
  }, []);

  const theme = {
    bg: "#0B1120",
    panelSolid: "#1E293B",
    panelHover: "rgba(30, 41, 59, 0.8)",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    primary: "#3B82F6",
    urgent: "#EF4444",
    border: "rgba(255, 255, 255, 0.08)",
  };

  // Updated to perfectly match the Faculty Publisher categories
  const categories = [
    "All Notices",
    "Academics",
    "Administrative",
    "Exams",
    "Events",
    "Holidays",
  ];

  const filteredCirculars =
    activeCategory === "All Notices"
      ? data.circulars
      : data.circulars.filter((c) => c.category === activeCategory);

  const urgentCirculars = filteredCirculars.filter(
    (c) => c.priority === "Urgent",
  );
  const normalCirculars = filteredCirculars.filter(
    (c) => c.priority !== "Urgent",
  );

  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case "EVENTS":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" };
      case "HOLIDAYS":
        return { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" };
      case "ACADEMICS":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" };
      case "ADMINISTRATIVE":
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94A3B8" };
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Bulletins...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      {/* 🔥 THE FULLY WORKING MODAL 🔥 */}
      <AnimatePresence>
        {selectedNotice && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotice(null)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                cursor: "pointer",
              }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                background: theme.panelSolid,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                width: "100%",
                maxWidth: "700px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "24px 32px",
                  borderBottom: `1px solid ${theme.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  > 
                    <span
                      style={{
                        background: getCategoryColor(selectedNotice.category)
                          .bg,
                        color: getCategoryColor(selectedNotice.category).text,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {selectedNotice.category}
                    </span>
                    {selectedNotice.priority === "Urgent" && (
                      <span
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: theme.urgent,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <AlertCircle size={12} /> URGENT
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      fontWeight: "800",
                      color: theme.text,
                      lineHeight: "1.3",
                    }}
                  >
                    {selectedNotice.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    padding: "8px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    color: theme.subtext,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = theme.subtext)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div
                style={{
                  padding: "32px",
                  overflowY: "auto",
                  flex: 1,
                  fontSize: "15px",
                  color: theme.subtext,
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedNotice.content}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "20px 32px",
                  borderTop: `1px solid ${theme.border}`,
                  background: "rgba(0,0,0,0.2)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "24px" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: theme.subtext,
                      fontWeight: "600",
                    }}
                  >
                    <Calendar size={14} />{" "}
                    {new Date(selectedNotice.published_date).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: theme.subtext,
                      fontWeight: "600",
                    }}
                  >
                    <UserCircle size={14} /> {selectedNotice.publisher}
                  </span>
                </div>

                {selectedNotice.attachment_url &&
                  selectedNotice.attachment_url !== "#" && (
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:5002/${selectedNotice.attachment_url}`,
                          "_blank",
                        )
                      }
                      style={{
                        background: theme.primary,
                        border: "none",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Download size={16} /> Download Attached File
                    </button>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div style={{ marginBottom: "32px" }}>
        <p
          style={{
            color: theme.subtext,
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Institutional Communications
        </p>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            margin: "0 0 12px 0",
            color: theme.text,
          }}
        >
          Circulars & Announcements
        </h1>
        <p
          style={{
            margin: 0,
            color: theme.subtext,
            fontSize: "15px",
            lineHeight: "1.6",
            maxWidth: "700px",
          }}
        >
          Stay informed with the latest academic bulletins, campus events, and
          administrative directives from the Rectorate.
        </p>
      </div>

      {/* FILTER TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          borderBottom: `1px solid ${theme.border}`,
          paddingBottom: "16px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  activeCategory === cat ? theme.primary : theme.panelSolid,
                color: activeCategory === cat ? "#fff" : theme.subtext,
                border: `1px solid ${activeCategory === cat ? theme.primary : theme.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: theme.subtext,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Filter size={16} /> Filter by Date Range
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "32px",
        }}
      >
        {/* LEFT COLUMN - NOTICES LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* URGENT NOTICES */}
          {urgentCirculars.map((circular) => (
            <div
              key={circular.id}
              onClick={() => setSelectedNotice(circular)}
              style={{
                background: theme.panelSolid,
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                borderLeft: `4px solid ${theme.urgent}`,
                padding: "24px",
                position: "relative",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = theme.panelHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = theme.panelSolid)
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: theme.urgent,
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                  }}
                >
                  <AlertCircle size={14} /> URGENT ACTION REQUIRED
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.subtext,
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  REF: {circular.ref_id}
                </div>
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  margin: "0 0 16px 0",
                  color: theme.text,
                }}
              >
                {circular.title}
              </h2>
              <p
                style={{
                  margin: "0 0 24px 0",
                  color: theme.subtext,
                  fontSize: "14px",
                  lineHeight: "1.6",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {circular.content}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: `1px solid ${theme.border}`,
                  paddingTop: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "24px" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: theme.subtext,
                      fontWeight: "600",
                    }}
                  >
                    <Calendar size={14} />{" "}
                    {new Date(circular.published_date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: theme.subtext,
                      fontWeight: "600",
                    }}
                  >
                    <UserCircle size={14} /> {circular.publisher}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* NORMAL NOTICES */}
          {normalCirculars.map((circular) => {
            const dateObj = new Date(circular.published_date);
            const catStyle = getCategoryColor(circular.category);

            return (
              <div
                key={circular.id}
                onClick={() => setSelectedNotice(circular)}
                style={{
                  background: theme.panelSolid,
                  borderRadius: "12px",
                  border: `1px solid ${theme.border}`,
                  padding: "20px",
                  display: "flex",
                  gap: "24px",
                  transition: "0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = theme.panelHover)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = theme.panelSolid)
                }
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "10px",
                    width: "64px",
                    height: "64px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: theme.text,
                      lineHeight: "1",
                    }}
                  >
                    {dateObj.getDate()}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: theme.subtext,
                      textTransform: "uppercase",
                      marginTop: "2px",
                    }}
                  >
                    {dateObj.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        margin: 0,
                        color: theme.text,
                      }}
                    >
                      {circular.title}
                    </h3>
                    <span
                      style={{
                        background: catStyle.bg,
                        color: catStyle.text,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "800",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {circular.category}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      color: theme.subtext,
                      fontSize: "13px",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {circular.content}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <span
                      style={{
                        color: theme.text,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Read Full Notice <ArrowRight size={12} />
                    </span>
                    <span style={{ color: theme.border }}>•</span>
                    <span style={{ color: theme.subtext }}>
                      Posted by {circular.publisher}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN - REAL STATS WIDGET ONLY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              background: theme.panelSolid,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
              padding: "24px",
            }}
          >
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: theme.subtext,
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: "0 0 16px 0",
              }}
            >
              Notice Statistics
            </h4>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: theme.subtext,
                  fontWeight: "500",
                }}
              >
                Total Bulletins (This Month)
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: theme.text,
                  fontWeight: "800",
                }}
              >
                {data.stats.total_month || 0}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "2px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "100%",
                  background: theme.primary,
                  borderRadius: "2px",
                }}
              ></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", color: theme.subtext }}>
                Unread Notices
              </span>
              <span
                style={{
                  background: theme.urgent,
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: "800",
                }}
              >
                {data.stats.unread_urgent || 0} NEW
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circulars;

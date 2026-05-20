import React, { useState, useEffect, useRef } from "react";
import {
  getMaterialStats,
  getAllMaterials,
  uploadMaterial,
  trackMaterialDownload,
  deleteMaterial,
  getFacultyCourses,
} from "../../services/facultyApi";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import {
  UploadCloud, FileText, Video, BookOpen, Trash2, Download, Eye,
  BarChart2, CheckCircle, Folder, X, FileQuestion, ChevronDown, CheckCircle2, ShieldCheck
} from "lucide-react";

// --- Premium Custom Dropdown Component ---
const ScholarSelect = ({ label, value, options, onChange, disabled, darkMode, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", width: "100%", marginBottom: "16px" }}>
      {label && <label style={{ fontSize: "11px", fontWeight: "800", color: theme.textMuted, letterSpacing: "0.5px" }}>{label}</label>}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "14px 16px", borderRadius: "14px", fontSize: "14px", fontWeight: "600",
          cursor: disabled ? "not-allowed" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "all 0.2s ease", boxShadow: isOpen ? `0 0 15px ${theme.primary}22` : "none"
        }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "10px" }}>
          {options.find(opt => opt.value == value)?.label || "Select Target Course..."}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={16} /></motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: "8px",
              background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${theme.border}`,
              borderRadius: "14px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)", zIndex: 100,
              maxHeight: "200px", overflowY: "auto", padding: "6px"
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{
                  padding: "10px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                  color: opt.value == value ? theme.primary : theme.textMain,
                  background: opt.value == value ? `${theme.primary}15` : "transparent", cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F8FAFC"}
                onMouseLeave={(e) => e.target.style.background = opt.value == value ? `${theme.primary}15` : "transparent"}
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


export default function FacultyMaterials() {
  const { darkMode = true } = useOutletContext() || {};

  // --- STATE (Untouched) ---
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalFiles: 0, totalDownloads: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  // --- SCHOLAR AI THEME ---
  const theme = {
    primary: "#F59E0B",
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
    accentBg: darkMode ? "rgba(245, 158, 11, 0.05)" : "rgba(245, 158, 11, 0.1)"
  };

  // --- LOGIC (Untouched) ---
  const loadData = async () => {
    try {
      const [matRes, statRes, courseRes] = await Promise.all([
        getAllMaterials(), getMaterialStats(), getFacultyCourses()
      ]);
      setMaterials(matRes.data); setStats(statRes.data); setCourses(courseRes.data);
    } catch (error) { console.error("Failed to load materials data", error); }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file.");
    if (!selectedCourseId) return alert("Please select a course for this material.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("course_id", selectedCourseId);

    try {
      await uploadMaterial(formData);
      setSelectedFile(null); setSelectedCourseId(""); alert("Material Uploaded Successfully!"); loadData();
    } catch (error) { alert("Upload failed."); } finally { setIsUploading(false); }
  };

  const getFileType = (path) => {
    if (!path) return "other";
    if (path.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return "image";
    if (path.match(/\.(pdf)$/i)) return "pdf";
    if (path.match(/\.(mp4|webm|ogg)$/i)) return "video";
    return "other"; 
  };

  const handleView = async (mat) => {
    try {
      await trackMaterialDownload(mat.id);
      setPreviewMaterial(mat); loadData(); 
    } catch (error) { console.error("Failed to track view"); }
  };

  const handleExplicitDownload = async (mat) => {
    try {
      await trackMaterialDownload(mat.id);
      const fileUrl = `http://localhost:5002/${mat.file_url}`;
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = mat.file_name; document.body.appendChild(a); a.click();
      document.body.removeChild(a); window.URL.revokeObjectURL(blobUrl); loadData();
    } catch (error) { console.error("Failed to force download", error); alert("Error downloading file."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try { await deleteMaterial(id); loadData(); } catch (error) { alert("Failed to delete file."); }
  };

  const filteredMaterials = materials.filter((m) => {
    if (activeTab === "all") return true;
    if (!m.file_name || !m.file_name.includes(".")) return false;
    const ext = m.file_name.split(".").pop().toLowerCase();
    if (activeTab === "slides" && ["ppt", "pptx", "key"].includes(ext)) return true;
    if (activeTab === "video" && ["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return true;
    if (activeTab === "docs" && ["doc", "docx", "txt", "pdf", "rtf", "xls", "xlsx", "csv"].includes(ext)) return true;
    return false;
  });

  const emptyStateMessage = {
    all: "No materials found. Upload a file to get started.",
    slides: "No lecture slides (.ppt, .pptx) uploaded yet.",
    video: "No video recordings (.mp4, .mov) uploaded yet.",
    docs: "No reading materials (.pdf, .docx) uploaded yet.",
  }[activeTab];

  // --- UI RENDER ---
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "32px", minHeight: "100vh", color: theme.textMain }}>
      
      {/* HEADER & TOP STATS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0", letterSpacing: "-1px" }}>Resource Managament</h1>
          <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px", fontWeight: "500" }}>Manage, distribute, and analyze your academic content securely.</p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, padding: "20px 24px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
            <div style={{ background: `${theme.success}15`, padding: "12px", borderRadius: "12px", color: theme.success }}>
              <Download size={24} />
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", color: theme.textMuted, fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Total Downloads</p>
              <h3 style={{ margin: 0, fontSize: "28px", color: theme.textMain, fontWeight: "900", lineHeight: "1" }}>{stats.totalDownloads}</h3>
            </div>
          </div>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, padding: "20px 24px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
            <div style={{ background: `${theme.primary}15`, padding: "12px", borderRadius: "12px", color: theme.primary }}>
              <Folder size={24} />
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", color: theme.textMuted, fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Total Files</p>
              <h3 style={{ margin: 0, fontSize: "28px", color: theme.textMain, fontWeight: "900", lineHeight: "1" }}>{stats.totalFiles}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* FUNCTIONAL TABS */}
      <div style={{ display: "flex", gap: "32px", borderBottom: `2px solid ${theme.border}`, marginBottom: "40px" }}>
        {[
          { id: "all", label: "All Materials", icon: <Folder size={18} /> },
          { id: "slides", label: "Lecture Slides", icon: <FileText size={18} /> },
          { id: "video", label: "Recordings", icon: <Video size={18} /> },
          { id: "docs", label: "Reading Docs", icon: <BookOpen size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "transparent", border: "none", padding: "0 0 16px 0", position: "relative",
              color: activeTab === tab.id ? theme.primary : theme.textMuted,
              fontWeight: "800", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              transition: "color 0.2s ease", letterSpacing: "0.5px"
            }}
          >
            {tab.icon} {tab.label.toUpperCase()}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabMat" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "3px", background: theme.primary, borderRadius: "3px 3px 0 0" }} />
            )}
          </button>
        ))}
      </div>

      {/* TWO COLUMN MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: UPLOAD & LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* UPLOAD BOX */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "24px", padding: "40px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ maxWidth: "440px", margin: "0 auto" }}>
              <div style={{ background: theme.accentBg, width: "72px", height: "72px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <UploadCloud size={32} color={theme.primary} />
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "900", color: theme.textMain, margin: "0 0 8px 0" }}>Deploy Resource</h2>
              <p style={{ color: theme.textMuted, fontSize: "14px", margin: "0 0 24px 0", fontWeight: "500", lineHeight: "1.6" }}>
                Select a target course, then browse your secure file directory. Supported constraints: PDF, PPTX, MP4, DOCX.
              </p>
              
              <ScholarSelect 
                value={selectedCourseId} 
                onChange={setSelectedCourseId} 
                options={courses.map(c => ({ label: `${c.course_code} - ${c.course_name}`, value: c.course_id }))} 
                theme={theme} darkMode={darkMode} 
              />
              
              <div style={{ display: "flex", gap: "16px" }}>
                <label style={{ flex: 1, padding: "16px", border: `1px solid ${theme.primary}`, color: theme.primary, borderRadius: "14px", fontWeight: "800", cursor: "pointer", fontSize: "13px", transition: "0.2s", letterSpacing: "1px", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseOver={(e) => e.target.style.background = theme.accentBg} onMouseOut={(e) => e.target.style.background = "transparent"}>
                  {selectedFile ? selectedFile.name.substring(0, 20) + "..." : "BROWSE ASSETS"}
                  <input type="file" style={{ display: "none" }} onChange={(e) => setSelectedFile(e.target.files[0])} />
                </label>
                <button onClick={handleUpload} disabled={isUploading || !selectedFile} style={{ flex: 1, padding: "16px", background: theme.primary, color: "#000", border: "none", borderRadius: "14px", fontWeight: "900", cursor: isUploading || !selectedFile ? "not-allowed" : "pointer", fontSize: "13px", opacity: (isUploading || !selectedFile) ? 0.5 : 1, transition: "0.2s", letterSpacing: "1px" }}>
                  {isUploading ? "EXECUTING..." : "CONFIRM UPLOAD"}
                </button>
              </div>
            </div>
          </div>

          {/* RECENT MATERIALS LIST */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "24px", padding: "32px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "900", color: theme.textMain }}>
              {activeTab === "all" ? "Encrypted File Directory" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Assets`}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <AnimatePresence>
                {filteredMaterials.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 0", background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderRadius: "16px", border: `1px dashed ${theme.border}` }}>
                    <Folder size={48} color={theme.textMuted} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                    <p style={{ color: theme.textMain, margin: "0 0 8px 0", fontSize: "16px", fontWeight: "800" }}>Directory Empty</p>
                    <p style={{ color: theme.textMuted, margin: 0, fontSize: "14px", fontWeight: "500" }}>{emptyStateMessage}</p>
                  </motion.div>
                ) : (
                  filteredMaterials.map((mat) => (
                    <motion.div key={mat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", border: `1px solid ${theme.border}`, borderRadius: "16px", background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = theme.primary} onMouseOut={(e) => e.currentTarget.style.borderColor = theme.border}>
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ background: theme.accentBg, padding: "14px", borderRadius: "12px" }}>
                          <FileText size={24} color={theme.primary} />
                        </div>
                        <div>
                          <h4 style={{ margin: "0 0 6px 0", color: theme.textMain, fontSize: "15px", fontWeight: "700" }}>{mat.file_name}</h4>
                          <p style={{ margin: 0, color: theme.textMuted, fontSize: "12px", fontWeight: "600" }}>{mat.course_code} • {new Date(mat.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px", color: theme.textMuted, fontSize: "12px", fontWeight: "800", background: darkMode ? "rgba(255,255,255,0.05)" : "white", padding: "8px 16px", borderRadius: "10px", border: `1px solid ${theme.border}`, marginRight: "8px" }}>
                          <Download size={14} /> {mat.downloads || 0}
                        </span>
                        <button onClick={() => handleView(mat)} style={{ background: `${theme.primary}20`, color: theme.primary, border: "none", padding: "10px", borderRadius: "10px", cursor: "pointer", transition: "0.2s" }} title="Preview Asset">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleExplicitDownload(mat)} style={{ background: `${theme.success}20`, color: theme.success, border: "none", padding: "10px", borderRadius: "10px", cursor: "pointer", transition: "0.2s" }} title="Force Download">
                          <Download size={18} />
                        </button>
                        <button onClick={() => handleDelete(mat.id)} style={{ background: `${theme.danger}20`, color: theme.danger, border: "none", padding: "10px", borderRadius: "10px", cursor: "pointer", transition: "0.2s" }} title="Delete Asset">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & WIDGETS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "24px", padding: "32px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 28px 0", fontSize: "16px", fontWeight: "900", color: theme.textMain, display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.5px" }}>
              Engagement Telemetry <BarChart2 size={20} color={theme.primary} />
            </h3>
            
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "800", color: theme.textMuted, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span>Extraction Velocity</span>
                <span style={{ color: theme.success }}>Optimal</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", borderRadius: "10px", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1 }} style={{ height: "100%", background: theme.success, borderRadius: "10px" }} />
              </div>
            </div>
            
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "800", color: theme.textMuted, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span>Syllabus Saturation</span>
                <span style={{ color: theme.primary }}>{courses.length} Courses</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", borderRadius: "10px", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1, delay: 0.2 }} style={{ height: "100%", background: theme.primary, borderRadius: "10px" }} />
              </div>
            </div>

            <div style={{ background: darkMode ? "rgba(16, 185, 129, 0.05)" : "#ECFDF5", border: `1px solid ${theme.success}40`, padding: "20px", borderRadius: "16px", marginTop: "32px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: theme.success, fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px" }}>
                <ShieldCheck size={16} /> System Integrity
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: darkMode ? "#A7F3D0" : "#065F46", lineHeight: "1.6", fontWeight: "500" }}>
                Cryptographic distribution is active. Files deployed here are instantly accessible to enrolled student nodes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MODAL: PREVIEW FACULTY ATTACHMENT 
      ========================================= */}
      <AnimatePresence>
        {previewMaterial && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "32px", width: "100%", maxWidth: "900px", height: "85vh", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ margin: "0 0 6px 0", fontSize: "24px", color: theme.textMain, fontWeight: "900", letterSpacing: "-0.5px" }}>Material Decryption</h2>
                  <p style={{ margin: 0, fontSize: "14px", color: theme.textMuted, fontWeight: "600" }}>{previewMaterial.file_name}</p>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <button onClick={() => handleExplicitDownload(previewMaterial)} style={{ background: theme.primary, color: "#000", padding: "12px 20px", borderRadius: "12px", border: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px" }}>
                    <Download size={16} /> EXTRACT FILE
                  </button>
                  <button onClick={() => setPreviewMaterial(null)} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: `1px solid ${theme.border}`, color: theme.textMuted, width: "44px", height: "44px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, background: darkMode ? "rgba(0,0,0,0.4)" : "#F8FAFC", borderRadius: "20px", border: `1px solid ${theme.border}`, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {getFileType(previewMaterial.file_url) === "image" && (
                  <img src={`http://localhost:5002/${previewMaterial.file_url}`} alt="attachment" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                )}
                {getFileType(previewMaterial.file_url) === "pdf" && (
                  <iframe src={`http://localhost:5002/${previewMaterial.file_url}`} title="Document Preview" style={{ width: "100%", height: "100%", border: "none" }} />
                )}
                {getFileType(previewMaterial.file_url) === "video" && (
                  <video src={`http://localhost:5002/${previewMaterial.file_url}`} controls style={{ width: "100%", height: "100%", outline: "none", backgroundColor: "black" }} />
                )}
                {getFileType(previewMaterial.file_url) === "other" && (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <FileQuestion size={64} color={theme.textMuted} style={{ marginBottom: "20px", opacity: 0.5 }} />
                    <h3 style={{ color: theme.textMain, margin: "0 0 12px 0", fontSize: "20px", fontWeight: "800" }}>Raw Format Detected</h3>
                    <p style={{ color: theme.textMuted, fontSize: "14px", maxWidth: "340px", margin: "0 auto", lineHeight: "1.6", fontWeight: "500" }}>
                      This artifact (.pptx, .docx, .zip) requires an external client. Use the Extract button above.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
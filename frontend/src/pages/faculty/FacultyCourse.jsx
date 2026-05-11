import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, ArrowLeft, CheckCircle, Circle, Filter, Users, Clock,
  FileText, Folder, Activity, UploadCloud, File, BarChart2, BookOpen,
  Download, Upload, Trash2, ChevronDown, CheckCircle2
} from "lucide-react";
import facultyApi from "../../services/facultyApi";

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
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", flex: 1 }}>
      {label && <label style={{ fontSize: "11px", fontWeight: "800", color: theme.textMuted, letterSpacing: "0.5px" }}>{label}</label>}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "12px 16px", borderRadius: "14px", fontSize: "14px", fontWeight: "600",
          cursor: disabled ? "not-allowed" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "all 0.2s ease", boxShadow: isOpen ? `0 0 15px ${theme.primary}22` : "none"
        }}
      >
        <span>{options.find(opt => opt.value == value)?.label || "Select..."}</span>
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
                  padding: "10px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
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

const FacultyCourses = () => {
  const { darkMode = true } = useOutletContext() || {}; 
  
  // --- STATE (Untouched) ---
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [semester, setSemester] = useState("1");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [chapters, setChapters] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterVideo, setNewChapterVideo] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterialFile, setSelectedMaterialFile] = useState(null);
  const [analytics, setAnalytics] = useState({ avgAttendance: 0 });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    accentBg: darkMode ? "rgba(245, 158, 11, 0.05)" : "rgba(245, 158, 11, 0.1)"
  };

  // --- LOGIC (Untouched) ---
  useEffect(() => {
    facultyApi.get("/courses/branches")
      .then((res) => {
        setBranches(res.data);
        if (res.data.length > 0) setSelectedBranch(res.data[0].id.toString());
      }).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedBranch || !semester) return;
    setLoading(true);
    facultyApi.get(`/courses?branch_id=${selectedBranch}&semester=${semester}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedBranch, semester]);

  const handleCourseAction = async (course, tab) => {
    setSelectedCourse(course);
    setActiveTab(tab);
    setLoading(true);
    try {
      if (tab === "syllabus") {
        const res = await facultyApi.get(`/courses/${course.course_id}/chapters`);
        setChapters(res.data);
      } else if (tab === "materials") {
        const res = await facultyApi.get(`/courses/${course.course_id}/materials`);
        setMaterials(res.data);
      } else if (tab === "analytics") {
        const chRes = await facultyApi.get(`/courses/${course.course_id}/chapters`);
        setChapters(chRes.data);
        const anRes = await facultyApi.get(`/courses/${course.course_id}/analytics`);
        setAnalytics(anRes.data);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    try {
      await facultyApi.post(`/courses/${selectedCourse.course_id}/chapters`, {
        title: newChapterTitle, videoUrl: newChapterVideo,
      });
      setNewChapterTitle(""); setNewChapterVideo("");
      handleCourseAction(selectedCourse, "syllabus");
    } catch (err) { alert("Failed to add chapter"); }
  };

  const toggleChapterStatus = async (chapter) => {
    const newStatus = chapter.status === "Completed" ? "Pending" : "Completed";
    try {
      const updatedChapters = chapters.map((c) => c.id === chapter.id ? { ...c, status: newStatus } : c);
      setChapters(updatedChapters);
      await facultyApi.put(`/courses/chapters/${chapter.id}`, { status: newStatus });
      const res = await facultyApi.get(`/courses?branch_id=${selectedBranch}&semester=${semester}`);
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await facultyApi.delete(`/courses/chapters/${chapterId}`);
      handleCourseAction(selectedCourse, "syllabus");
      const res = await facultyApi.get(`/courses?branch_id=${selectedBranch}&semester=${semester}`);
      setCourses(res.data);
    } catch (err) { console.error(err); alert("Failed to delete chapter"); }
  };

  const handleMaterialUpload = async () => {
    if (!selectedMaterialFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", selectedMaterialFile);
    try {
      await facultyApi.post(`/courses/${selectedCourse.course_id}/materials`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedMaterialFile(null); alert("Material Uploaded!");
      handleCourseAction(selectedCourse, "materials");
    } catch (error) { alert("Failed to upload material"); }
  };

  const downloadChaptersCSV = () => {
    let csv = "Chapter Title,YouTube Link\n";
    if (chapters.length > 0) {
      chapters.forEach((ch) => {
        const safeTitle = ch.title.replace(/"/g, '""');
        const safeVideo = ch.video_url || "";
        csv += `"${safeTitle}","${safeVideo}"\n`;
      });
    } else {
      csv += `"Sample Chapter 1","https://youtu.be/example"\n`;
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selectedCourse.course_code}_Syllabus_Template.csv`; a.click();
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split("\n");
      const newChapters = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const lastCommaIndex = row.lastIndexOf(",");
        if (lastCommaIndex !== -1) {
          let title = row.substring(0, lastCommaIndex).trim().replace(/^"|"$/g, "");
          let videoUrl = row.substring(lastCommaIndex + 1).trim().replace(/^"|"$/g, "");
          if (title) newChapters.push({ title, videoUrl });
        } else {
          let title = row.replace(/^"|"$/g, "").trim();
          if (title) newChapters.push({ title, videoUrl: "" });
        }
      }
      if (newChapters.length === 0) return alert("No valid chapters found in the CSV.");
      setLoading(true);
      try {
        await facultyApi.post(`/courses/${selectedCourse.course_id}/chapters/bulk`, { chapters: newChapters });
        alert(`Successfully imported ${newChapters.length} chapters!`);
        handleCourseAction(selectedCourse, "syllabus");
      } catch (err) { console.error("Import error:", err); alert("Failed to import chapters from CSV."); } 
      finally { if (fileInputRef.current) fileInputRef.current.value = ""; setLoading(false); }
    };
    reader.readAsText(file);
  };

  const downloadCSVReport = async () => {
    try {
      const res = await facultyApi.get(`/courses/${selectedCourse.course_id}/report`);
      const data = res.data;
      if (data.length === 0) return alert("No student data available for this course.");
      let csv = "Enrollment No,Student Name,Email,Classes Attended\n";
      data.forEach((row) => { csv += `"${row.enrollment_no}","${row.name}","${row.email}","${row.classes_attended}"\n`; });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${selectedCourse.course_code}_Analytics_Report.csv`; a.click();
    } catch (error) { alert("Failed to generate CSV report"); }
  };

  // --- UI RENDER ---
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "32px", minHeight: "100vh", color: theme.textMain }}>
      
      {/* Hide Scrollbars for cleaner UI */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {!selectedCourse ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <header style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0", letterSpacing: "-1px" }}>Course Directory</h1>
            <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px", fontWeight: "500" }}>
              Manage your assigned curriculum, materials, and student performance.
            </p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
            {loading ? (
              <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: theme.primary, fontWeight: "800" }}>
                <Activity className="animate-spin" size={32} style={{ margin: "0 auto 16px" }} /> Loading Portfolio...
              </div>
            ) : courses.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "80px", textAlign: "center", color: theme.textMuted, background: theme.surface, borderRadius: "24px", border: `1px dashed ${theme.border}` }}>
                <Filter size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                <h3 style={{ margin: "0 0 8px 0", color: theme.textMain, fontSize: "18px", fontWeight: "800" }}>No Courses Found</h3>
                <p style={{ margin: 0, fontSize: "14px" }}>No subjects are assigned for this configuration.</p>
              </div>
            ) : (
              courses.map((course) => {
                const realProgress = course.completion_percentage || 0;
                return (
                  <motion.div key={course.course_id} whileHover={{ y: -4 }} style={{
                    background: theme.surface, borderRadius: "24px", border: `1px solid ${theme.border}`,
                    overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
                  }}>
                    <div style={{ padding: "24px", background: theme.accentBg }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <span style={{ background: darkMode ? "rgba(255,255,255,0.1)" : "#FFFFFF", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", border: `1px solid ${theme.border}`, color: theme.textMain, letterSpacing: "1px" }}>
                          {course.course_code}
                        </span>
                        <span style={{ background: `${theme.primary}20`, padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", color: theme.primary, letterSpacing: "1px" }}>
                          {course.course_type?.toUpperCase() || "CORE"}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 16px 0", color: theme.textMain, lineHeight: "1.3", letterSpacing: "-0.5px" }}>
                        {course.course_name}
                      </h3>
                      <div style={{ display: "flex", gap: "20px", color: theme.textMuted, fontSize: "13px", fontWeight: "600" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Users size={16} /> {course.student_count || 0} Students</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={16} /> {course.credits} Credits</div>
                      </div>
                    </div>
                    
                    <div style={{ padding: "24px", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", color: theme.textMuted, marginBottom: "10px" }}>
                        <span>SYLLABUS PROGRESS</span>
                        <span style={{ color: theme.primary }}>{realProgress}%</span>
                      </div>
                      <div style={{ height: "8px", borderRadius: "10px", background: darkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0", overflow: "hidden", marginBottom: "12px" }}>
                        <div style={{ width: `${realProgress}%`, height: "100%", background: theme.primary, borderRadius: "10px", transition: "width 0.5s ease" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${theme.border}`, background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC" }}>
                      {[
                        { id: "syllabus", icon: FileText, label: "Syllabus" },
                        { id: "materials", icon: Folder, label: "Materials" },
                        { id: "analytics", icon: Activity, label: "Analytics" }
                      ].map(action => (
                        <button key={action.id} onClick={() => handleCourseAction(course, action.id)} style={{
                          padding: "16px 0", background: "transparent", border: "none", borderRight: action.id !== "analytics" ? `1px solid ${theme.border}` : "none",
                          color: theme.textMuted, fontSize: "12px", fontWeight: "800", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s"
                        }} onMouseEnter={e => { e.currentTarget.style.color = theme.primary; e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9"; }} onMouseLeave={e => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = "transparent"; }}>
                          <action.icon size={20} />
                          <span>{action.label.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <button onClick={() => setSelectedCourse(null)} style={{
            display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: theme.textMuted,
            cursor: "pointer", fontSize: "13px", fontWeight: "800", marginBottom: "24px", padding: 0, letterSpacing: "1px"
          }} onMouseEnter={e => e.target.style.color = theme.primary} onMouseLeave={e => e.target.style.color = theme.textMuted}>
            <ArrowLeft size={16} /> RETURN TO PORTFOLIO
          </button>

          <div style={{ display: "flex", gap: "32px", borderBottom: `2px solid ${theme.border}`, marginBottom: "40px" }}>
            {[
              { id: "syllabus", label: "SYLLABUS MANAGER", icon: <FileText size={18} /> },
              { id: "materials", label: "RESOURCE VAULT", icon: <Folder size={18} /> },
              { id: "analytics", label: "PERFORMANCE AI", icon: <Activity size={18} /> },
            ].map((tab) => (
              <button key={tab.id} onClick={() => handleCourseAction(selectedCourse, tab.id)} style={{
                background: "transparent", border: "none", padding: "16px 0", color: activeTab === tab.id ? theme.primary : theme.textMuted,
                fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                borderBottom: activeTab === tab.id ? `3px solid ${theme.primary}` : "3px solid transparent", marginBottom: "-2px", transition: "0.2s"
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", alignItems: "start" }}>
            
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div style={{ background: theme.surface, borderRadius: "32px", border: `1px solid ${theme.border}`, padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "40px" }}>
                <div>
                  <span style={{ background: theme.accentBg, padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", color: theme.primary, letterSpacing: "1px" }}>
                    {selectedCourse.course_code}
                  </span>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "16px 0 8px 0", letterSpacing: "-1px" }}>{selectedCourse.course_name}</h1>
                  <p style={{ color: theme.textMuted, margin: 0, fontWeight: "600" }}>Semester {selectedCourse.semester} • {selectedCourse.credits} Academic Credits</p>
                </div>
                <div style={{ textAlign: "right", minWidth: "140px", background: darkMode ? "rgba(255,255,255,0.03)" : "#F8FAFC", padding: "20px", borderRadius: "20px", border: `1px solid ${theme.border}` }}>
                  <span style={{ display: "block", fontSize: "36px", fontWeight: "900", color: theme.primary, lineHeight: "1" }}>
                    {selectedCourse.completion_percentage || 0}%
                  </span>
                  <span style={{ display: "block", fontSize: "10px", color: theme.textMuted, fontWeight: "900", textTransform: "uppercase", marginTop: "8px", letterSpacing: "1px" }}>
                    Completion
                  </span>
                </div>
              </div>

              {/* TAB: SYLLABUS */}
              {activeTab === "syllabus" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: `1px solid ${theme.border}`, marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>Curriculum Map</h3>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <input type="file" accept=".csv" ref={fileInputRef} style={{ display: "none" }} onChange={handleImportCSV} />
                      <button onClick={() => fileInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", color: theme.textMain, border: `1px solid ${theme.border}`, padding: "10px 16px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = theme.primary} onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}>
                        <Upload size={16} /> IMPORT CSV
                      </button>
                      <button onClick={downloadChaptersCSV} style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.primary, color: "#000", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", transition: "0.2s" }}>
                        <Download size={16} /> EXPORT CSV
                      </button>
                    </div>
                  </div>

                  <div className="hide-scroll" style={{ display: "flex", flexDirection: "column", maxHeight: "500px", overflowY: "auto" }}>
                    {loading ? (
                      <p style={{ color: theme.primary, fontWeight: "800", textAlign: "center", padding: "40px" }}>Loading curriculum...</p>
                    ) : chapters.length === 0 ? (
                      <div style={{ padding: "60px", textAlign: "center", color: theme.textMuted, background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderRadius: "20px", border: `1px dashed ${theme.border}` }}>
                        <BookOpen size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                        <h4 style={{ color: theme.textMain, fontSize: "16px", fontWeight: "800", marginBottom: "8px" }}>No Modules Found</h4>
                        <p style={{ fontSize: "14px", margin: 0 }}>Construct your syllabus using the side panel or import a CSV framework.</p>
                      </div>
                    ) : (
                      chapters.map((chapter) => (
                        <div key={chapter.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", borderBottom: `1px solid ${theme.border}`, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <div onClick={() => toggleChapterStatus(chapter)} style={{ cursor: "pointer" }}>
                            {chapter.status === "Completed" ? <CheckCircle2 size={24} color={theme.success} /> : <Circle size={24} color={theme.textMuted} />}
                          </div>
                          <span style={{ flex: 1, fontSize: "15px", fontWeight: "700", color: chapter.status === "Completed" ? theme.textMuted : theme.textMain, textDecoration: chapter.status === "Completed" ? "line-through" : "none" }}>
                            {chapter.title}
                          </span>
                          <span style={{ fontSize: "10px", fontWeight: "900", padding: "6px 12px", borderRadius: "8px", background: chapter.status === "Completed" ? `${theme.success}15` : darkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0", color: chapter.status === "Completed" ? theme.success : theme.textMuted, letterSpacing: "1px" }}>
                            {chapter.status.toUpperCase()}
                          </span>
                          <button onClick={() => handleDeleteChapter(chapter.id)} title="Delete Module" style={{ background: "transparent", border: "none", color: theme.danger, cursor: "pointer", padding: "8px", display: "flex", borderRadius: "8px", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = `${theme.danger}20`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* TAB: MATERIALS */}
              {activeTab === "materials" && (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", paddingBottom: "20px", borderBottom: `1px solid ${theme.border}`, marginBottom: "20px" }}>
                    Resource Vault
                  </h3>
                  {loading ? (
                    <p style={{ color: theme.primary, fontWeight: "800", textAlign: "center", padding: "40px" }}>Decrypting resources...</p>
                  ) : materials.length === 0 ? (
                    <div style={{ padding: "60px", textAlign: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderRadius: "20px", border: `1px dashed ${theme.border}` }}>
                      <Folder size={48} color={theme.textMuted} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                      <h4 style={{ color: theme.textMain, margin: "0 0 8px 0", fontSize: "16px", fontWeight: "800" }}>Vault Empty</h4>
                      <p style={{ color: theme.textMuted, margin: 0, fontSize: "14px" }}>Deploy lecture assets and references via the secure upload panel.</p>
                    </div>
                  ) : (
                    <div className="hide-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "500px", overflowY: "auto" }}>
                      {materials.map((mat) => (
                        <div key={mat.id} style={{ display: "flex", alignItems: "center", gap: "20px", background: darkMode ? "rgba(255,255,255,0.03)" : "#F8FAFC", padding: "20px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                          <div style={{ padding: "12px", background: theme.accentBg, borderRadius: "12px" }}>
                            <File size={24} color={theme.primary} />
                          </div>
                          <span style={{ color: theme.textMain, flex: 1, fontWeight: "700", fontSize: "15px" }}>{mat.file_name}</span>
                          <a href={`http://localhost:5002/${mat.file_url}`} target="_blank" rel="noreferrer" style={{ color: "#000", background: theme.primary, padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontSize: "12px", fontWeight: "900", letterSpacing: "1px" }}>
                            ACCESS FILE
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* TAB: ANALYTICS */}
              {activeTab === "analytics" && (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", paddingBottom: "20px", borderBottom: `1px solid ${theme.border}`, marginBottom: "32px" }}>
                    Performance AI Matrix
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", padding: "32px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: theme.textMuted }}>
                        <Users size={20} /> <span style={{ fontWeight: "900", fontSize: "11px", letterSpacing: "1px" }}>ACTIVE COHORT</span>
                      </div>
                      <span style={{ fontSize: "48px", fontWeight: "900", color: theme.textMain }}>{selectedCourse.student_count || 0}</span>
                    </div>
                    
                    <div style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", padding: "32px", borderRadius: "24px", border: `1px solid ${theme.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: theme.textMuted }}>
                        <BookOpen size={20} /> <span style={{ fontWeight: "900", fontSize: "11px", letterSpacing: "1px" }}>MODULES CLEARED</span>
                      </div>
                      <span style={{ fontSize: "48px", fontWeight: "900", color: theme.textMain }}>
                        {chapters.filter((c) => c.status === "Completed").length} <span style={{ fontSize: "20px", color: theme.textMuted }}>/ {chapters.length}</span>
                      </span>
                    </div>

                    <div style={{ background: darkMode ? "rgba(16, 185, 129, 0.1)" : "#ECFDF5", padding: "32px", borderRadius: "24px", border: `1px solid ${theme.success}40`, gridColumn: "1 / -1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: theme.success }}>
                        <BarChart2 size={24} /> <span style={{ fontWeight: "900", fontSize: "12px", letterSpacing: "1px" }}>ENGAGEMENT QUOTIENT (AVG ATTENDANCE)</span>
                      </div>
                      <span style={{ fontSize: "56px", fontWeight: "900", color: theme.success }}>{analytics.avgAttendance}%</span>
                      <p style={{ margin: "12px 0 0 0", color: theme.success, fontSize: "14px", fontWeight: "600", opacity: 0.8 }}>Computed recursively across all logged temporal sessions.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: ACTION PANEL */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {activeTab === "syllabus" && (
                <div style={{ background: theme.surface, borderRadius: "32px", border: `1px solid ${theme.border}`, padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "900", color: theme.textMain }}>Deploy Module</h4>
                  <form onSubmit={handleAddChapter}>
                    <label style={{ fontSize: "11px", fontWeight: "800", color: theme.textMuted, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>MODULE TITLE</label>
                    <input style={{ width: "100%", padding: "16px", borderRadius: "12px", border: `1px solid ${theme.border}`, background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF", color: theme.textMain, outline: "none", fontSize: "14px", marginBottom: "20px", fontWeight: "600", boxSizing: "border-box" }} placeholder="e.g. Advanced Quantum Mechanics..." value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} required />
                    
                    <label style={{ fontSize: "11px", fontWeight: "800", color: theme.textMuted, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>MEDIA LINK (OPTIONAL)</label>
                    <input style={{ width: "100%", padding: "16px", borderRadius: "12px", border: `1px solid ${theme.border}`, background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF", color: theme.textMain, outline: "none", fontSize: "14px", marginBottom: "32px", fontWeight: "600", boxSizing: "border-box" }} placeholder="YouTube URL..." value={newChapterVideo} onChange={(e) => setNewChapterVideo(e.target.value)} />
                    
                    <button type="submit" style={{ width: "100%", padding: "16px", background: theme.primary, color: "#000", border: "none", borderRadius: "14px", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
                      <Plus size={18} strokeWidth={3} /> INITIALIZE MODULE
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "materials" && (
                <div style={{ background: theme.surface, borderRadius: "32px", border: `1px solid ${theme.border}`, padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "900", color: theme.textMain }}>Secure Upload</h4>
                  <label style={{ display: "block", border: `2px dashed ${theme.primary}55`, borderRadius: "20px", padding: "40px 20px", textAlign: "center", marginBottom: "24px", background: darkMode ? "rgba(245, 158, 11, 0.02)" : "#FFFBEB", cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(245, 158, 11, 0.05)" : "#FEF3C7"} onMouseLeave={e => e.currentTarget.style.background = darkMode ? "rgba(245, 158, 11, 0.02)" : "#FFFBEB"}>
                    <UploadCloud size={40} color={theme.primary} style={{ margin: "0 auto 16px" }} />
                    <p style={{ margin: "0 0 8px 0", color: theme.textMain, fontSize: "14px", fontWeight: "800" }}>{selectedMaterialFile ? selectedMaterialFile.name : "BROWSE SECURE ASSETS"}</p>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>SUPPORTED: PDF, PPTX, DOCX</p>
                    <input type="file" style={{ display: "none" }} onChange={(e) => setSelectedMaterialFile(e.target.files[0])} />
                  </label>
                  <button onClick={handleMaterialUpload} disabled={!selectedMaterialFile} style={{ width: "100%", padding: "16px", background: theme.primary, color: "#000", border: "none", borderRadius: "14px", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: selectedMaterialFile ? "pointer" : "not-allowed", opacity: selectedMaterialFile ? 1 : 0.5, transition: "0.2s" }}>
                    EXECUTE UPLOAD
                  </button>
                </div>
              )}

              {activeTab === "analytics" && (
                <div style={{ background: theme.surface, borderRadius: "32px", border: `1px solid ${theme.border}`, padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <h4 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "900", color: theme.textMain }}>Data Extraction</h4>
                  <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "32px", lineHeight: "1.6", fontWeight: "500" }}>Generate a highly structured comma-separated matrix containing deep cohort analytics and attendance quotients.</p>
                  <button onClick={downloadCSVReport} style={{ width: "100%", padding: "16px", background: "transparent", color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: "14px", fontWeight: "900", fontSize: "13px", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.color = theme.primary; }} onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMain; }}>
                    <File size={18} /> EXTRACT CSV REPORT
                  </button>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FacultyCourses;
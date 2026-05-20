import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import {
  Plus, Sparkles, UploadCloud, FileText, CheckCircle2, Clock, AlignLeft,
  X, BookOpen, Layers, ChevronDown
} from "lucide-react";
import { getQuizBuilderData, createNewQuiz } from "../../services/facultyApi"; //[cite: 20]

// --- Premium Custom Dropdown Component ---
const ScholarSelect = ({ label, value, options, onChange, disabled, darkMode, theme, icon: Icon }) => {
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
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", width: "100%", marginBottom: "24px" }}>
      {label && <label style={{ fontSize: "11px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</label>}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
          border: `1px solid ${isOpen ? theme.primary : theme.border}`,
          color: disabled ? theme.textMuted : theme.textMain,
          padding: "16px", borderRadius: "12px", fontSize: "14px", fontWeight: "600",
          cursor: disabled ? "not-allowed" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          transition: "all 0.2s ease", boxShadow: isOpen ? `0 0 15px ${theme.primary}22` : "none", opacity: disabled ? 0.5 : 1
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          {Icon && <Icon size={18} color={theme.textMuted} />}
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {options.find(opt => opt.value == value)?.label || "Select..."}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={16} color={theme.textMuted} /></motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: "8px",
              background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${theme.border}`,
              borderRadius: "14px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)", zIndex: 100,
              maxHeight: "200px", overflowY: "auto", padding: "6px"
            }}
          >
            {options.length === 0 && <div style={{ padding: "10px", color: theme.textMuted, fontSize: "12px", textAlign: "center" }}>No options available</div>}
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

export default function FacultyQuizBuilder() {
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
    modalOverlay: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(15, 23, 42, 0.6)",
  };

  // --- Backend Data State (Untouched) ---[cite: 20]
  const [courses, setCourses] = useState([]);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Form State (Untouched) ---[cite: 20]
  const [quizDetails, setQuizDetails] = useState({
    course_id: "", title: "", timeLimit: "60", description: "", status: "PUBLISHED",
  });

  const [questions, setQuestions] = useState([
    {
      id: Date.now(), text: "", points: 5,
      options: [
        { id: "A", text: "", isCorrect: true },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ],
    },
  ]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");

  // --- LOGIC (Untouched) ---[cite: 20]
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await getQuizBuilderData();
      setCourses(res.data.courses); setPastQuizzes(res.data.quizzes); setFacultyId(res.data.facultyId);
      if (res.data.courses.length > 0) {
        setQuizDetails((prev) => ({ ...prev, course_id: res.data.courses[0].course_id }));
      }
    } catch (error) { console.error("Failed to fetch builder data", error); }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: "", points: 5, options: [{ id: "A", text: "", isCorrect: true }, { id: "B", text: "", isCorrect: false }, { id: "C", text: "", isCorrect: false }, { id: "D", text: "", isCorrect: false }] }]);
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updatedQs = [...questions];
    if (field === "isCorrect") updatedQs[qIndex].options.forEach((opt) => (opt.isCorrect = false));
    updatedQs[qIndex].options[optIndex][field] = value;
    setQuestions(updatedQs);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQs = [...questions];
    if (field === "points") updatedQs[qIndex][field] = parseInt(value) || 0;
    else updatedQs[qIndex][field] = value;
    setQuestions(updatedQs);
  };

  const processImport = () => {
    const blocks = importText.split("\n\n").map((b) => b.trim()).filter((b) => b.length > 0);
    const newQuestions = [];

    blocks.forEach((block, index) => {
      const lines = block.split("\n").map((l) => l.trim());
      if (lines.length < 6) return;

      const questionText = lines[0];
      const options = lines.slice(1, 5);
      const correct = lines[5];
      const formattedOptions = ["A", "B", "C", "D"].map((id, i) => ({ id, text: options[i] || "", isCorrect: id === correct }));

      newQuestions.push({ id: Date.now() + index, text: questionText, points: 5, options: formattedOptions });
    });

    if (newQuestions.length > 0) {
      const isOnlyEmpty = questions.length === 1 && questions[0].text.trim() === "";
      if (isOnlyEmpty) setQuestions(newQuestions); else setQuestions([...questions, ...newQuestions]);
      setIsImportModalOpen(false); setImportText("");
    } else {
      alert("Invalid format. Please check your input.");
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizDetails.title || !quizDetails.course_id) return alert("Please provide a Quiz Title and select a Course.");
    const hasEmptyQuestions = questions.some((q) => q.text.trim() === "");
    if (hasEmptyQuestions) return alert("Please fill in all question texts before generating the quiz.");

    setIsSubmitting(true);
    const payload = {
      faculty_id: facultyId, course_id: quizDetails.course_id, title: quizDetails.title,
      description: quizDetails.description, time_limit: parseInt(quizDetails.timeLimit),
      status: quizDetails.status, questions: questions,
    };

    try {
      await createNewQuiz(payload);
      alert("Quiz successfully minted to the Academic Ledger!");
      setQuizDetails({ ...quizDetails, title: "", description: "" });
      setQuestions([{ id: Date.now(), text: "", points: 5, options: [{ id: "A", text: "", isCorrect: true }, { id: "B", text: "", isCorrect: false }, { id: "C", text: "", isCorrect: false }, { id: "D", text: "", isCorrect: false }] }]);
      fetchData(); 
    } catch (err) { console.error(err); alert("Failed to save quiz."); } 
    finally { setIsSubmitting(false); }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  // Reusable input style
  const inputStyle = {
    width: "100%", background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
    border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px 16px 16px 48px",
    color: theme.textMain, fontSize: "14px", fontWeight: "600", outline: "none", boxSizing: "border-box"
  };

  // --- UI RENDER ---
  return (
    <div style={{ color: theme.textMain, fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "32px", minHeight: "100vh" }}>
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0", letterSpacing: "-1px" }}>Quiz Builder</h1>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: theme.textMuted }}>Create assessments with precise formatting and institutional standards.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: BUILDER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            
            <ScholarSelect 
              label="TARGET COURSE"
              icon={Layers}
              value={quizDetails.course_id}
              onChange={(val) => setQuizDetails({ ...quizDetails, course_id: val })}
              options={courses.map(c => ({ label: `${c.course_code}: ${c.course_name}`, value: c.course_id }))}
              theme={theme} darkMode={darkMode}
            />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>Quiz Nomenclature</label>
                <FileText size={18} color={theme.textMuted} style={{ position: "absolute", left: "16px", top: "42px" }} />
                <input type="text" value={quizDetails.title} onChange={(e) => setQuizDetails({ ...quizDetails, title: e.target.value })} placeholder="e.g. Advanced Networking Sem 2" style={inputStyle} />
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>Time Limit (Mins)</label>
                <Clock size={18} color={theme.textMuted} style={{ position: "absolute", left: "16px", top: "42px" }} />
                <input type="number" value={quizDetails.timeLimit} onChange={(e) => setQuizDetails({ ...quizDetails, timeLimit: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>Description & Instructions</label>
              <AlignLeft size={18} color={theme.textMuted} style={{ position: "absolute", left: "16px", top: "42px" }} />
              <textarea value={quizDetails.description} onChange={(e) => setQuizDetails({ ...quizDetails, description: e.target.value })} placeholder="Enter assessment guidelines..." rows="3" style={{ ...inputStyle, resize: "vertical", height: "120px" }} />
            </div>
          </div>

          {/* QUESTIONS LEDGER */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: theme.textMain }}>Question Ledger</h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: `1px solid ${theme.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", color: theme.textMuted }}>QUESTIONS: {questions.length}</span>
                <span style={{ background: `${theme.primary}15`, border: `1px solid ${theme.primary}40`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", color: theme.primary }}>TOTAL POINTS: {totalPoints}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <AnimatePresence>
                {questions.map((q, qIndex) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderLeft: `6px solid ${theme.primary}`, borderRadius: "24px", padding: "32px", position: "relative", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                        <span style={{ fontSize: "28px", fontWeight: "900", color: theme.primary, opacity: 0.4 }}>{String(qIndex + 1).padStart(2, "0")}</span>
                        <input type="text" value={q.text} onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)} placeholder="Formulate your question..." style={{ background: "transparent", border: "none", color: theme.textMain, fontSize: "16px", fontWeight: "800", outline: "none", width: "100%" }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "20px", borderLeft: `1px solid ${theme.border}` }}>
                        <span style={{ fontSize: "11px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px" }}>POINTS</span>
                        <input type="number" value={q.points} onChange={(e) => handleQuestionChange(qIndex, "points", e.target.value)} style={{ width: "60px", background: darkMode ? "rgba(255,255,255,0.02)" : "#F1F5F9", border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px", color: theme.textMain, textAlign: "center", fontWeight: "800", outline: "none" }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {q.options.map((opt, optIndex) => (
                        <div key={opt.id} onClick={() => handleOptionChange(qIndex, optIndex, "isCorrect", true)} style={{ display: "flex", alignItems: "center", gap: "12px", background: opt.isCorrect ? `${theme.success}10` : darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF", border: `2px solid ${opt.isCorrect ? theme.success : theme.border}`, borderRadius: "12px", padding: "16px", cursor: "pointer", transition: "all 0.2s ease" }}>
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${opt.isCorrect ? theme.success : theme.textMuted}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {opt.isCorrect && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: theme.success }} />}
                          </div>
                          <input type="text" value={opt.text} onChange={(e) => handleOptionChange(qIndex, optIndex, "text", e.target.value)} placeholder={`Option ${opt.id}`} style={{ background: "transparent", border: "none", color: opt.isCorrect ? theme.success : theme.textMain, fontSize: "14px", fontWeight: "700", outline: "none", width: "100%" }} onClick={(e) => e.stopPropagation()} />
                          {opt.isCorrect && <span style={{ fontSize: "10px", fontWeight: "900", color: theme.success, letterSpacing: "1px" }}>CORRECT</span>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginTop: "32px" }}>
              <button onClick={handleAddQuestion} style={{ background: "transparent", border: `2px dashed ${theme.border}`, borderRadius: "20px", padding: "24px", color: theme.textMain, fontSize: "13px", fontWeight: "900", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", cursor: "pointer", transition: "0.2s", letterSpacing: "1px" }} onMouseEnter={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.color = theme.primary; }} onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMain; }}>
                <Plus size={24} color="inherit" /> APPEND NEW ROW
              </button>

              <button onClick={() => setIsImportModalOpen(true)} style={{ background: `${theme.indigo}15`, border: `2px dashed ${theme.indigo}40`, borderRadius: "20px", padding: "24px", color: theme.indigo, fontSize: "13px", fontWeight: "900", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", transition: "0.2s", letterSpacing: "1px" }} onMouseEnter={e => e.currentTarget.style.background = `${theme.indigo}25`} onMouseLeave={e => e.currentTarget.style.background = `${theme.indigo}15`}>
                <UploadCloud size={24} /> BULK IMPORT
              </button>
            </div>

            <button onClick={handleSubmitQuiz} disabled={isSubmitting} style={{ width: "100%", background: theme.primary, border: "none", borderRadius: "16px", padding: "20px", color: "#000", fontSize: "15px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", cursor: "pointer", boxShadow: `0 10px 30px -10px ${theme.primary}60`, marginTop: "40px", transition: "0.2s", opacity: isSubmitting ? 0.7 : 1, letterSpacing: "1px" }}>
              {isSubmitting ? "GENERATING..." : <><Plus size={20} strokeWidth={3} /> INITIALIZE QUIZ DEPLOYMENT</>}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: `${theme.indigo}20`, padding: "12px", borderRadius: "12px" }}><Sparkles size={24} color={theme.indigo} /></div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: theme.textMain }}>Curriculum AI</h4>
                <div style={{ fontSize: "10px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>CONTEXT GENERATOR</div>
              </div>
            </div>

            <div style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "#F1F5F9", borderLeft: `4px solid ${theme.primary}`, padding: "20px", borderRadius: "0 16px 16px 0", marginBottom: "24px" }}>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: theme.textMuted, fontStyle: "italic", lineHeight: "1.6", fontWeight: "500" }}>
                "Based on your recent lecture, would you like to add a question about advanced data structures?"
              </p>
              <button style={{ background: "transparent", border: "none", color: theme.primary, fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0, letterSpacing: "1px" }}>
                <Plus size={16} /> GENERATE DRAFT
              </button>
            </div>
            <input type="text" placeholder="Prompt AI generator..." style={{ width: "100%", background: darkMode ? "rgba(0,0,0,0.4)" : "#FFFFFF", border: `1px solid ${theme.border}`, padding: "16px", borderRadius: "12px", color: theme.textMain, fontSize: "14px", fontWeight: "600", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div>
            <h4 style={{ fontSize: "12px", fontWeight: "900", color: theme.textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>EXISTING LEDGER</h4>
            <div className="hide-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "600px", overflowY: "auto", paddingRight: "8px" }}>
              {pastQuizzes.length === 0 ? (
                <div style={{ color: theme.textMuted, fontSize: "14px", fontWeight: "500", textAlign: "center", padding: "40px", background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderRadius: "20px", border: `1px dashed ${theme.border}` }}>
                  No historical data.
                </div>
              ) : (
                pastQuizzes.map((quiz) => (
                  <div key={quiz.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "20px", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = theme.primary} onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}>
                    <div style={{ fontSize: "11px", color: theme.textMuted, fontWeight: "800", marginBottom: "8px", letterSpacing: "0.5px" }}>{quiz.course_name}</div>
                    <h5 style={{ margin: "0 0 12px 0", fontSize: "15px", color: theme.textMain, fontWeight: "800" }}>{quiz.title}</h5>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ background: quiz.status === "PUBLISHED" ? `${theme.success}15` : darkMode ? "rgba(255,255,255,0.1)" : "#F1F5F9", color: quiz.status === "PUBLISHED" ? theme.success : theme.textMuted, padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", letterSpacing: "1px" }}>{quiz.status}</span>
                      <span style={{ fontSize: "12px", color: theme.textMuted, fontWeight: "700" }}>{quiz.question_count} Qs • {quiz.total_points || 0} Pts</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.modalOverlay, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "40px", width: "100%", maxWidth: "700px", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)" }}>
              
              <button onClick={() => setIsImportModalOpen(false)} style={{ position: "absolute", top: "32px", right: "32px", background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: "none", color: theme.textMuted, cursor: "pointer", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={20} />
              </button>

              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                  <div style={{ background: `${theme.indigo}20`, padding: "12px", borderRadius: "14px" }}><UploadCloud size={24} color={theme.indigo} /></div>
                  <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "900", color: theme.textMain, letterSpacing: "-0.5px" }}>Bulk Import Protocol</h2>
                </div>
                <p style={{ color: theme.textMuted, margin: 0, fontSize: "14px", fontWeight: "500" }}>Inject plain text. The parser will construct the ledger automatically.</p>
              </div>

              <textarea
                value={importText} onChange={(e) => setImportText(e.target.value)}
                placeholder={`Example Format:\nWhat is the powerhouse of the cell?\nMitochondria\nNucleus\nRibosome\nEndoplasmic Reticulum\nA`}
                rows="10"
                style={{ width: "100%", background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC", border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", color: theme.textMain, fontSize: "14px", fontFamily: "monospace", outline: "none", boxSizing: "border-box", resize: "none", marginBottom: "32px", fontWeight: "500" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                <button onClick={() => setIsImportModalOpen(false)} style={{ background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMain, padding: "14px 24px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", letterSpacing: "1px" }}>ABORT</button>
                <button onClick={processImport} style={{ background: theme.indigo, color: "#fff", border: "none", padding: "14px 32px", borderRadius: "12px", fontSize: "13px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "1px" }}>
                  <Sparkles size={16} /> INITIALIZE PARSER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
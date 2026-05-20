import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, AlertCircle, Activity, FileText, CheckCircle, Bold, Italic, Link2,
  List, ListOrdered, Quote, Image as ImageIcon, Pin, Mail, UploadCloud, Trash2,
  CheckCircle2, BellRing, Eye
} from "lucide-react";
import { publishCircular } from "../../services/facultyApi";
import { useOutletContext } from "react-router-dom";

export default function FacultyCircularsPost() {
  const { darkMode = true } = useOutletContext() || {};

  // --- STATE (Untouched) ---[cite: 17]
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [formData, setFormData] = useState({ title: "", category: "Academics", priority: "Normal", content: "" });
  const [pinToTop, setPinToTop] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState([]);

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
  };

  // --- LOGIC (Untouched) ---[cite: 17]
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);
      submitData.append("content", formData.content);

      if (attachedFiles.length > 0) {
        attachedFiles.forEach((file) => submitData.append("attachments", file));
      }

      await publishCircular(submitData);
      setSuccessMsg("Bulletin published to the academic network successfully!");
      setFormData({ title: "", category: "Academics", priority: "Normal", content: "" });
      setAttachedFiles([]); 
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Failed to publish", err); alert("Failed to publish circular.");
    } finally { setLoading(false); }
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setAttachedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- REUSABLE STYLES ---
  const inputStyle = {
    width: "100%", background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
    border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "16px",
    color: theme.textMain, fontSize: "14px", fontWeight: "600", outline: "none",
    boxSizing: "border-box", transition: "all 0.2s ease"
  };

  // --- UI RENDER ---
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "32px", minHeight: "100vh", color: theme.textMain }}>
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SUCCESS NOTIFICATION */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{ position: "fixed", top: "40px", left: "50%", zIndex: 1000, background: `${theme.success}15`, border: `1px solid ${theme.success}`, color: theme.success, padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", backdropFilter: "blur(12px)", boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.3)" }}
          >
            <CheckCircle2 size={20} /> <span style={{ fontWeight: "800", fontSize: "14px", letterSpacing: "0.5px" }}>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0", letterSpacing: "-1px" }}>Draft New Circular</h1>
        <p style={{ color: theme.textMuted, margin: 0, fontSize: "14px", fontWeight: "500", maxWidth: "600px", lineHeight: "1.6" }}>
          Broadcast official communications to the student body and faculty
          members. Ensure all details are accurate before publishing.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: FORM */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            
            {/* Title */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Circular Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. End-of-Semester Architecture Update" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = theme.primary)} onBlur={(e) => (e.target.style.borderColor = theme.border)} />
            </div>

            {/* Category & Priority */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Classification</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {["Academics", "Administrative", "Events"].map((cat) => (
                    <button type="button" key={cat} onClick={() => setFormData({ ...formData, category: cat })} style={{ padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", border: `1px solid ${formData.category === cat ? theme.primary : theme.border}`, background: formData.category === cat ? theme.accentBg : "transparent", color: formData.category === cat ? theme.primary : theme.textMuted, transition: "all 0.2s ease" }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Priority Override</label>
                <button type="button" onClick={() => setFormData({ ...formData, priority: formData.priority === "Urgent" ? "Normal" : "Urgent" })} style={{ width: "100%", padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", border: `1px solid ${formData.priority === "Urgent" ? theme.danger : theme.border}`, background: formData.priority === "Urgent" ? `${theme.danger}15` : "transparent", color: formData.priority === "Urgent" ? theme.danger : theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s ease", letterSpacing: "1px" }}>
                  <AlertCircle size={16} /> {formData.priority === "Urgent" ? "URGENT FLAG ACTIVE" : "FLAG AS URGENT"}
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Data Payload</label>
              <div style={{ background: darkMode ? "rgba(255,255,255,0.01)" : "#FAFBFC", border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden", transition: "0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderBottom: `1px solid ${theme.border}`, background: darkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9" }}>
                  <Bold size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <Italic size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <Link2 size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <div style={{ width: "1px", height: "16px", background: theme.border }}></div>
                  <List size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <ListOrdered size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <Quote size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                  <div style={{ width: "1px", height: "16px", background: theme.border }}></div>
                  <ImageIcon size={16} color={theme.textMuted} style={{ cursor: "pointer" }} />
                </div>
                <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Initiate data sequence here..." style={{ width: "100%", minHeight: "350px", background: "transparent", border: "none", padding: "24px", color: theme.textMain, fontSize: "14px", fontWeight: "500", lineHeight: "1.8", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
            <button type="button" onClick={() => setFormData({ title: "", category: "Academics", priority: "Normal", content: "" })} style={{ padding: "16px 32px", background: "transparent", color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: "14px", fontSize: "13px", fontWeight: "800", cursor: "pointer", transition: "0.2s", letterSpacing: "1px" }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              DISCARD DRAFT
            </button>
            <button type="submit" disabled={loading} style={{ padding: "16px 40px", background: theme.primary, color: "#000", border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: "900", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "8px", opacity: loading ? 0.7 : 1, transition: "0.2s", letterSpacing: "1px", boxShadow: `0 10px 25px -5px ${theme.primary}60` }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
              {loading ? "PUBLISHING...." : <><Send size={16} /> PUBLISH CIRCULAR</>}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: PREVIEW & SETTINGS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Live Mobile Render */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <Activity size={16} color={theme.primary} /> Live Preview
            </label>

            <div className="hide-scroll" style={{ width: "100%", height: "450px", background: darkMode ? "#02040A" : "#F8FAFC", border: `8px solid ${darkMode ? "#1F2937" : "#CBD5E1"}`, borderRadius: "40px", padding: "24px", boxSizing: "border-box", overflowY: "auto", position: "relative", boxShadow: "inset 0 10px 20px rgba(0,0,0,0.2)" }}>
              {/* Hardware Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "24px", background: darkMode ? "#1F2937" : "#CBD5E1", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}></div>

              <div style={{ marginTop: "32px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: formData.priority === "Urgent" ? `${theme.danger}20` : theme.accentBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", color: formData.priority === "Urgent" ? theme.danger : theme.primary }}>
                  {formData.priority === "Urgent" ? <AlertCircle size={20} /> : <BellRing size={20} />}
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: "900", color: theme.textMain, margin: "0 0 12px 0", lineHeight: "1.4", letterSpacing: "-0.5px" }}>
                  {formData.title || "Circular Title Will Appear Here"}
                </h3>

                <span style={{ display: "inline-block", background: formData.priority === "Urgent" ? `${theme.danger}15` : theme.accentBg, color: formData.priority === "Urgent" ? theme.danger : theme.primary, padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px", border: `1px solid ${formData.priority === "Urgent" ? theme.danger : theme.primary}40` }}>
                  {formData.category} {formData.priority === "Urgent" && "• PRIORITY: HIGH"}
                </span>

                <div style={{ fontSize: "13px", color: theme.textMuted, lineHeight: "1.7", whiteSpace: "pre-wrap", wordBreak: "break-word", fontWeight: "500" }}>
                  {formData.content || "Draft your message in the editor. It will render here in real-time as students will see it on their mobile devices."}
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry & Attachments */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "32px", padding: "32px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}>
            
            <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Visibility Settings</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC", padding: "16px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: theme.textMain, display: "flex", alignItems: "center", gap: "10px" }}><Pin size={16} color={theme.primary} /> Pin to Top</span>
                <div onClick={() => setPinToTop(!pinToTop)} style={{ width: "40px", height: "24px", background: pinToTop ? theme.primary : darkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0", borderRadius: "12px", position: "relative", cursor: "pointer", transition: "0.2s" }}>
                  <div style={{ position: "absolute", top: "3px", left: pinToTop ? "19px" : "3px", width: "18px", height: "18px", background: pinToTop ? "#000" : theme.textMuted, borderRadius: "50%", transition: "0.2s" }}></div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC", padding: "16px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: theme.textMain, display: "flex", alignItems: "center", gap: "10px" }}><Mail size={16} color={theme.indigo} /> Send Email
                  Notification</span>
                <div onClick={() => setSendEmail(!sendEmail)} style={{ width: "40px", height: "24px", background: sendEmail ? theme.indigo : darkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0", borderRadius: "12px", position: "relative", cursor: "pointer", transition: "0.2s" }}>
                  <div style={{ position: "absolute", top: "3px", left: sendEmail ? "19px" : "3px", width: "18px", height: "18px", background: sendEmail ? "#fff" : theme.textMuted, borderRadius: "50%", transition: "0.2s" }}></div>
                </div>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Encrypted Attachments</label>
            <div style={{ border: `2px dashed ${theme.primary}50`, borderRadius: "20px", padding: "32px 20px", textAlign: "center", position: "relative", cursor: "pointer", marginBottom: "16px", background: darkMode ? "rgba(245, 158, 11, 0.02)" : "#FFFBEB", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(245, 158, 11, 0.05)" : "#FEF3C7"} onMouseLeave={e => e.currentTarget.style.background = darkMode ? "rgba(245, 158, 11, 0.02)" : "#FFFBEB"}>
              <input type="file" multiple onChange={handleFileUpload} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
              <UploadCloud size={32} color={theme.primary} style={{ margin: "0 auto 12px auto" }} />
              <div style={{ fontSize: "14px", fontWeight: "800", color: theme.textMain, marginBottom: "4px", letterSpacing: "0.5px" }}>BROWSE FILE SYSTEM</div>
              <div style={{ fontSize: "11px", color: theme.textMuted, fontWeight: "600", letterSpacing: "0.5px" }}>SUPPORTED: PDF, JPEG, DOCX</div>
            </div>

            {attachedFiles.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {attachedFiles.map((file, idx) => (
                  <div key={idx} style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC", border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                      <div style={{ padding: "10px", background: theme.accentBg, borderRadius: "10px", flexShrink: 0 }}><FileText size={16} color={theme.primary} /></div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: theme.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                        <div style={{ fontSize: "11px", color: theme.textMuted, fontWeight: "600" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFile(idx)} style={{ background: `${theme.danger}15`, border: "none", cursor: "pointer", color: theme.danger, padding: "10px", borderRadius: "10px", flexShrink: 0, transition: "0.2s" }} title="Remove Attachment">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
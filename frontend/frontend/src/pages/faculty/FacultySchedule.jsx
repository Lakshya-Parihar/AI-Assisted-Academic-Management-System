import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  X, FileInput, UploadCloud, BookOpen, Video, AlignLeft, Layers
} from "lucide-react";
import {
  getAssignedCourses,
  createSchedule,
  getFacultyScheduleRangeData,
  importScheduleCSVData,
} from "../../services/facultyApi";

const FacultySchedule = () => {
  const { darkMode = true } = useOutletContext() || {};
  const fileInputRef = useRef(null);

  // --- STATE (Untouched) ---
  const [scheduleDataByDay, setScheduleDataByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedClass, setSelectedClass] = useState(null); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_code: "", course_name: "", class_type: "Lecture", semester: "1",
    start_time: "", end_time: "", room_no: "", student_count: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const storedData = JSON.parse(localStorage.getItem("facultyData") || "{}");
  const facultyId = storedData.id || storedData.faculty_id || storedData.facultyId || 1;

  // --- SCHOLAR AI THEME ---
  const theme = {
    primary: "#F59E0B", // Scholar Amber
    bg: darkMode ? "#000000" : "#F8FAFC",
    surface: darkMode ? "#0A0C10" : "#FFFFFF",
    textMain: darkMode ? "#FFFFFF" : "#1E293B",
    textMuted: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#1F2937" : "#E2E8F0",
    gridLine: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    success: "#10B981",
    danger: "#EF4444",
    indigo: "#6366F1",
    accentBg: darkMode ? "rgba(245, 158, 11, 0.05)" : "rgba(245, 158, 11, 0.1)",
    modalOverlay: darkMode ? "rgba(0,0,0,0.8)" : "rgba(15, 23, 42, 0.6)",
  };

  // --- LOGIC (Untouched) ---
  const getCardTheme = (type, isMyClass) => {
    const opacity = isMyClass ? "1" : "0.5";
    const bgOpacity = darkMode ? "0.15" : "0.1";

    if (type?.toLowerCase().includes("lab")) {
      return { bg: `rgba(16, 185, 129, ${bgOpacity})`, border: theme.success, text: theme.success, opacity };
    } else if (type?.toLowerCase().includes("webinar") || type?.toLowerCase().includes("meeting")) {
      return { bg: `rgba(99, 102, 241, ${bgOpacity})`, border: theme.indigo, text: theme.indigo, opacity };
    }
    return { bg: `rgba(245, 158, 11, ${bgOpacity})`, border: theme.primary, text: theme.primary, opacity };
  };

  const getFormattedDate = (dateObj) => {
    const d = new Date(dateObj);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const getWeekRangeDates = (date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const diffStart = d.getDate() - dayOfWeek;
    const startDateObj = new Date(d.setDate(diffStart));
    const endDateObj = new Date(d.setDate(diffStart + 6));
    return { startDateObj, endDateObj, sqlStartDate: getFormattedDate(startDateObj), sqlEndDate: getFormattedDate(endDateObj) };
  };

  const fetchScheduleWeekRange = async (date) => {
    setLoading(true);
    const { sqlStartDate, sqlEndDate } = getWeekRangeDates(date);
    try {
      const res = await getFacultyScheduleRangeData(sqlStartDate, sqlEndDate, facultyId);
      const groupedData = {};
      res.data.forEach((item) => {
        const itemDateSql = getFormattedDate(item.date);
        if (!groupedData[itemDateSql]) groupedData[itemDateSql] = [];
        groupedData[itemDateSql].push(item);
      });
      setScheduleDataByDay(groupedData);
    } catch (error) {
      console.error("Failed to fetch schedule range", error);
      setScheduleDataByDay({});
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchScheduleWeekRange(selectedDate);
    const fetchMyCourses = async () => {
      try { const res = await getAssignedCourses(facultyId); setMyCourses(res.data); } 
      catch (error) { console.error("Failed to fetch courses", error); }
    };
    fetchMyCourses();
    setFormData((prev) => ({ ...prev, date: getFormattedDate(selectedDate) }));
  }, [selectedDate, facultyId]);

  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset * 7);
    setSelectedDate(newDate);
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCourseChange = (e) => {
    const selectedCode = e.target.value;
    const course = myCourses.find((c) => c.course_code === selectedCode);
    if (course) {
      setFormData({ ...formData, course_id: course.course_id, course_code: course.course_code, course_name: course.course_name, semester: course.semester || "1" });
    }
  };

  const handleAddSingleClassSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_code) return alert("Please select a course.");
    setIsSubmitting(true);
    try {
      await createSchedule({ faculty_id: facultyId, date: getFormattedDate(selectedDate), ...formData });
      setIsModalOpen(false); fetchScheduleWeekRange(selectedDate);
      setFormData({ course_id: "", course_code: "", course_name: "", class_type: "Lecture", semester: "1", start_time: "", end_time: "", room_no: "", student_count: "", date: getFormattedDate(selectedDate) });
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Failed to add class: ${backendError}`);
    } finally { setIsSubmitting(false); }
  };

  const handleCSVFileImportClick = () => fileInputRef.current.click();

  const handleCSVFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) return alert("Please upload a valid CSV file.");

    const formDataCSVImport = new FormData();
    formDataCSVImport.append("scheduleFile", file);
    formDataCSVImport.append("faculty_id", facultyId);

    setIsUploading(true);
    try {
      const responseImportCSV = await importScheduleCSVData(formDataCSVImport);
      let finalAlertMsg = responseImportCSV.data.message;
      if (responseImportCSV.data.errorList && responseImportCSV.data.errorList.length > 0) {
        finalAlertMsg += "\n\nReasons for skipped rows:\n" + responseImportCSV.data.errorList.join("\n");
      }
      alert(finalAlertMsg); fileInputRef.current.value = ""; fetchScheduleWeekRange(selectedDate);
    } catch (importError) {
      const serverErrorDetails = importError.response?.data?.details || importError.response?.data?.message || importError.message;
      alert(`Failed to import timetable from CSV: \n${serverErrorDetails}`); fileInputRef.current.value = "";
    } finally { setIsUploading(false); }
  };

  const START_HOUR = 7;
  const END_HOUR = 20;
  const ROW_HEIGHT = 80;

  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 0, min: 0 };
    const [h, m] = timeStr.split(":").map(Number);
    return { hour: h, min: m };
  };

  // --- REUSABLE STYLES ---
  const inputStyle = {
    width: "100%", background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF",
    border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px",
    color: theme.textMain, outline: "none", fontSize: "14px", fontWeight: "600",
    boxSizing: "border-box", transition: "border-color 0.2s"
  };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: "900", color: theme.textMuted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" };

  // --- GRID RENDER ---
  const renderCalendarGrid = () => {
    const { startDateObj } = getWeekRangeDates(selectedDate);
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const weekDaysArr = [];
    const copyDate = new Date(startDateObj);
    for (let i = 0; i < 7; i++) { weekDaysArr.push(new Date(copyDate)); copyDate.setDate(copyDate.getDate() + 1); }
    const hours = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) { hours.push(i); }

    return (
      <div style={{ display: "flex", flexDirection: "column", background: theme.surface, borderRadius: "24px", border: `1px solid ${theme.border}`, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, background: darkMode ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
          <div style={{ width: "80px", flexShrink: 0, borderRight: `1px solid ${theme.border}` }} />
          {weekDaysArr.map((dayDate, index) => {
            const isToday = dayDate.getDate() === new Date().getDate() && dayDate.getMonth() === new Date().getMonth();
            return (
              <div key={index} style={{ flex: 1, minWidth: "120px", padding: "20px 0", textAlign: "center", borderRight: index !== 6 ? `1px solid ${theme.border}` : "none", background: isToday ? theme.accentBg : "transparent" }}>
                <div style={{ fontSize: "12px", fontWeight: "900", color: isToday ? theme.primary : theme.textMuted, letterSpacing: "1px", marginBottom: "4px" }}>{weekdays[index]}</div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: isToday ? theme.primary : theme.textMain, letterSpacing: "-1px" }}>{dayDate.getDate()}</div>
              </div>
            );
          })}
        </div>

        <div className="hide-scroll" style={{ display: "flex", overflowY: "auto", overflowX: "auto", maxHeight: "700px", position: "relative" }}>
          <div style={{ width: "80px", flexShrink: 0, borderRight: `1px solid ${theme.border}`, background: theme.surface, position: "sticky", left: 0, zIndex: 10 }}>
            {hours.map((hour) => (
              <div key={hour} style={{ height: `${ROW_HEIGHT}px`, display: "flex", justifyContent: "flex-end", padding: "10px 16px 0 0" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: theme.textMuted }}>{hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flex: 1, minWidth: "840px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
              {hours.map((hour, i) => <div key={`line-${i}`} style={{ height: `${ROW_HEIGHT}px`, borderBottom: `1px solid ${theme.gridLine}`, boxSizing: "border-box" }} />)}
            </div>

            {weekDaysArr.map((dayDate, dayIndex) => {
              const sqlDayStr = getFormattedDate(dayDate);
              const eventsForDay = scheduleDataByDay[sqlDayStr] || [];

              return (
                <div key={dayIndex} style={{ flex: 1, position: "relative", borderRight: dayIndex !== 6 ? `1px solid ${theme.gridLine}` : "none" }}>
                  {eventsForDay.map((item) => {
                    const { hour: sH, min: sM } = parseTime(item.start_time);
                    const { hour: eH, min: eM } = parseTime(item.end_time);
                    const topOffset = (sH - START_HOUR + sM / 60) * ROW_HEIGHT;
                    const durationHrs = eH + eM / 60 - (sH + sM / 60);
                    const height = durationHrs * ROW_HEIGHT;

                    const isMyClass = item.faculty_id === Number(facultyId);
                    const cardColors = getCardTheme(item.class_type, isMyClass);

                    if (sH < START_HOUR || sH > END_HOUR) return null;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: cardColors.opacity, scale: 1 }}
                        onClick={() => setSelectedClass(item)}
                        style={{
                          position: "absolute", top: `${topOffset}px`, height: `${height}px`, left: "4px", right: "4px",
                          background: cardColors.bg, border: `1px solid ${cardColors.border}`, borderLeft: `4px solid ${cardColors.border}`,
                          borderRadius: "12px", padding: "12px", overflow: "hidden", backdropFilter: "blur(4px)",
                          zIndex: 2, cursor: "pointer", display: "flex", flexDirection: "column", transition: "transform 0.2s, z-index 0.2s, box-shadow 0.2s"
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.zIndex = 5; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = `0 10px 25px -5px ${cardColors.border}66`; }}
                        onMouseOut={(e) => { e.currentTarget.style.zIndex = 2; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "900", color: cardColors.text, letterSpacing: "0.5px" }}>{item.start_time} - {item.end_time}</span>
                          {!isMyClass && <span style={{ fontSize: "9px", fontWeight: "900", color: theme.textMuted, background: theme.border, padding: "2px 6px", borderRadius: "6px", letterSpacing: "1px" }}>OTHER</span>}
                        </div>
                        <strong style={{ fontSize: "14px", color: theme.textMain, lineHeight: "1.2", marginBottom: "4px", fontWeight: "800" }}>{item.course_code}</strong>
                        <span style={{ fontSize: "12px", color: theme.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: "600" }}>{item.course_name}</span>
                        
                        {height > 70 && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "auto", paddingTop: "6px" }}>
                            <MapPin size={12} color={cardColors.text} />
                            <span style={{ fontSize: "11px", color: cardColors.text, fontWeight: "700" }}>{item.room_no}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- UI RENDER ---
  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ padding: "32px 40px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0", color: theme.textMain, letterSpacing: "-1px" }}>Academic Timetable</h1>
          <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px", fontWeight: "500" }}>Manage your lecture distribution, office hours, and temporal events.</p>
        </div>

        {/* Center Navigator Pill */}
        <div style={{ display: "flex", alignItems: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#FFFFFF", border: `1px solid ${theme.border}`, borderRadius: "24px", padding: "6px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
          <button onClick={() => changeWeek(-1)} style={{ background: "transparent", border: "none", padding: "10px", cursor: "pointer", color: theme.textMain, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "180px" }}>
            <span style={{ fontSize: "15px", fontWeight: "900", color: theme.textMain, letterSpacing: "0.5px" }}>
              {getWeekRangeDates(selectedDate).startDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {getWeekRangeDates(selectedDate).endDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span style={{ fontSize: "10px", fontWeight: "800", color: theme.primary, letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>Academic Week</span>
          </div>
          <button onClick={() => changeWeek(1)} style={{ background: "transparent", border: "none", padding: "10px", cursor: "pointer", color: theme.textMain, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <input type="file" ref={fileInputRef} onChange={handleCSVFileChange} style={{ display: "none" }} accept=".csv" />
          <button onClick={handleCSVFileImportClick} disabled={isUploading} style={{ background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMain, padding: "14px 24px", borderRadius: "14px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s", letterSpacing: "0.5px" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}>
            {isUploading ? <UploadCloud className="animate-pulse" size={18} /> : <FileInput size={18} />}
            {isUploading ? "IMPORTING..." : "BULK IMPORT"}
          </button>
          <button onClick={() => setIsModalOpen(true)} style={{ background: theme.primary, border: "none", color: "#000", padding: "14px 28px", borderRadius: "14px", fontSize: "13px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 10px 25px -5px ${theme.primary}66`, transition: "0.2s", letterSpacing: "0.5px" }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
            <Plus size={18} strokeWidth={3} /> INITIALIZE EVENT
          </button>
        </div>
      </div>

      <div style={{ padding: "40px", maxWidth: "1600px", margin: "0 auto" }}>
        
        {/* LEGEND */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "32px", background: theme.surface, padding: "16px 24px", borderRadius: "16px", border: `1px solid ${theme.border}`, width: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: theme.textMain, fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: theme.primary }}></div> Lectures
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: theme.textMain, fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: theme.success }}></div> Labs / Practical
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: theme.textMain, fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: theme.indigo }}></div> Meetings
          </div>
        </div>

        {/* MAIN CALENDAR RENDER */}
        {loading ? (
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "24px", textAlign: "center", padding: "120px", color: theme.primary, fontWeight: "900", fontSize: "18px", letterSpacing: "1px" }}>
            SYNCHRONIZING TIMETABLE...
          </div>
        ) : renderCalendarGrid()}
      </div>

      {/* --- NEW: CLASS DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedClass && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: theme.modalOverlay, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: theme.surface, width: "500px", borderRadius: "32px", border: `1px solid ${theme.border}`, borderTop: `6px solid ${theme.primary}`, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", overflow: "hidden" }}>
              
              <div style={{ padding: "32px", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ padding: "6px 12px", background: theme.accentBg, color: theme.primary, borderRadius: "8px", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {selectedClass.class_type || "Lecture"}
                  </div>
                  <button onClick={() => setSelectedClass(null)} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9", border: "none", color: theme.textMuted, cursor: "pointer", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = theme.textMain)} onMouseLeave={(e) => (e.currentTarget.style.color = theme.textMuted)}>
                    <X size={18} />
                  </button>
                </div>
                
                <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "900", color: theme.textMain, letterSpacing: "-0.5px" }}>{selectedClass.course_name}</h2>
                <p style={{ margin: 0, color: theme.textMuted, fontWeight: "700", fontSize: "14px" }}>Course Code: {selectedClass.course_code}</p>
              </div>

              <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                
                <div style={{ display: "flex", gap: "20px", alignItems: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC", padding: "16px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                  <div style={{ background: `${theme.primary}20`, padding: "12px", borderRadius: "12px" }}><Clock size={20} color={theme.primary} /></div>
                  <div>
                    <div style={{ color: theme.textMain, fontSize: "15px", fontWeight: "800", marginBottom: "4px" }}>
                      {new Date(selectedClass.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} • {selectedClass.start_time} - {selectedClass.end_time}
                    </div>
                    <div style={{ color: theme.success, fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Scheduled & Active</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center", background: darkMode ? "rgba(255,255,255,0.02)" : "#FAFBFC", padding: "16px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                  <div style={{ background: `${theme.primary}20`, padding: "12px", borderRadius: "12px" }}><MapPin size={20} color={theme.primary} /></div>
                  <div>
                    <div style={{ color: theme.textMain, fontSize: "15px", fontWeight: "800", marginBottom: "4px" }}>{selectedClass.room_no || "TBD"}</div>
                    <div style={{ color: theme.textMuted, fontSize: "12px", fontWeight: "600" }}>Designated Physical Node</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <div style={{ background: `${theme.primary}20`, padding: "12px", borderRadius: "12px" }}><Users size={20} color={theme.primary} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: theme.textMain, fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>{selectedClass.student_count || 0} Students Enrolled</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ flex: 1, height: "8px", background: darkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ width: "85%", height: "100%", background: theme.primary, borderRadius: "10px" }}></div>
                      </div>
                      <span style={{ fontSize: "12px", color: theme.textMain, fontWeight: "800" }}>85% Avg</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <button onClick={() => alert("This feature is planned for a future enhancement!")} style={{ width: "100%", padding: "16px", background: theme.primary, color: "#000", border: "none", borderRadius: "14px", fontSize: "14px", fontWeight: "900", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", transition: "0.2s", letterSpacing: "1px", boxShadow: `0 10px 25px -5px ${theme.primary}60` }} onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)} onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}>
                    <Video size={18} strokeWidth={3} /> JOIN VIRTUAL NODE
                  </button>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button onClick={() => alert("This feature is planned for a future enhancement!")} style={{ flex: 1, padding: "14px", background: "transparent", color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", transition: "0.2s", letterSpacing: "0.5px" }} onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      MODIFY EVENT
                    </button>
                    <button onClick={() => alert("This feature is planned for a future enhancement!")} style={{ flex: 1, padding: "14px", background: "transparent", color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", transition: "0.2s", letterSpacing: "0.5px" }} onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      VIEW ASSETS
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SLEEK MODAL FOR ADDING CLASS --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: theme.modalOverlay, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", padding: "20px" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: theme.surface, width: "540px", borderRadius: "32px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              
              <div style={{ padding: "32px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.accentBg }}>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: theme.textMain, display: "flex", alignItems: "center", gap: "12px", letterSpacing: "-0.5px" }}>
                  <div style={{ padding: "12px", background: theme.surface, borderRadius: "12px", color: theme.primary, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    <BookOpen size={20} />
                  </div>
                  Initialize Schedule
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.textMuted, cursor: "pointer", padding: "10px", borderRadius: "12px", display: "flex", transition: "0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = theme.textMain)} onMouseLeave={(e) => (e.currentTarget.style.color = theme.textMuted)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSingleClassSubmit} style={{ padding: "40px 32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Assigned Course Matrix</label>
                  <select required name="course_code" value={formData.course_code} onChange={handleCourseChange} style={{ ...inputStyle, cursor: "pointer", color: theme.textMain }}>
                    <option value="" disabled>-- Select a Course --</option>
                    {myCourses.map((course) => (
                      <option key={course.course_code} value={course.course_code} style={{ color: "#000" }}>{course.course_code} - {course.course_name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>Start Horizon</label>
                    <input type="time" required name="start_time" value={formData.start_time} onChange={handleInputChange} style={{ ...inputStyle, colorScheme: darkMode ? "dark" : "light" }} />
                  </div>
                  <div>
                    <label style={labelStyle}>End Horizon</label>
                    <input type="time" required name="end_time" value={formData.end_time} onChange={handleInputChange} style={{ ...inputStyle, colorScheme: darkMode ? "dark" : "light" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div>
                    <label style={labelStyle}>Physical Node (Room)</label>
                    <input required name="room_no" value={formData.room_no} onChange={handleInputChange} style={inputStyle} placeholder="e.g. Auditorium A" />
                  </div>
                  <div>
                    <label style={labelStyle}>Cohort Volume</label>
                    <input type="number" name="student_count" value={formData.student_count} onChange={handleInputChange} style={inputStyle} placeholder="e.g. 60" />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "40px", paddingTop: "32px", borderTop: `1px solid ${theme.border}` }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "16px 24px", borderRadius: "14px", background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMain, cursor: "pointer", fontWeight: "800", fontSize: "13px", transition: "0.2s", letterSpacing: "1px" }} onMouseEnter={(e) => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    ABORT
                  </button>
                  <button type="submit" disabled={isSubmitting} style={{ padding: "16px 32px", borderRadius: "14px", background: theme.primary, border: "none", color: "#000", cursor: "pointer", fontWeight: "900", fontSize: "13px", boxShadow: `0 10px 25px -5px ${theme.primary}60`, transition: "0.2s", letterSpacing: "1px", opacity: isSubmitting ? 0.7 : 1 }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                    {isSubmitting ? "EXECUTING..." : "COMMIT TO LEDGER"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultySchedule;
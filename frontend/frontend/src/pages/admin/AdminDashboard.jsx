import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UsersRound, Building2, Compass, BookOpen, Activity, Zap, TrendingUp, ChevronRight, BookMarked, MapPin, Library, GraduationCap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import adminApi from "../../services/adminApi";

const AdminDashboard = () => {
  // --- RESTORED ORIGINAL LOGIC & STATE ---
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalBranches, setTotalBranches] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [lowAttendance, setLowAttendance] = useState([]);
  const [fees, setFees] = useState({
    collected: 0,
    pending: 0,
    percentage: 0,
  });
  const [activities, setActivities] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await adminApi.get("/students/count");
        setTotalStudents(res.data.totalStudents);
      } catch (err) { console.error(err); }
    };
    fetchStudentCount();
  }, []);

  useEffect(() => {
    const fetchFacultyCount = async () => {
      try {
        const res = await adminApi.get("/faculty/count");
        setTotalFaculty(res.data.totalFaculties);
      } catch (err) { console.error(err); }
    };
    fetchFacultyCount();
  }, []);

  useEffect(() => {
    const fetchCollegeCount = async () => {
      try {
        const res = await adminApi.get("/college/count");
        setTotalColleges(res.data.totalColleges);
      } catch (err) { console.error(err); }
    };
    fetchCollegeCount();
  }, []);

  useEffect(() => {
    const fetchBranchCount = async () => {
      try {
        const res = await adminApi.get("/branch/count");
        setTotalBranches(res.data.totalBranches);
      } catch (err) { console.error(err); }
    };
    fetchBranchCount();
  }, []);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const res = await adminApi.get("/course/count");
        setTotalCourses(res.data.totalCourses);
      } catch (err) { console.error(err); }
    };
    fetchCourseCount();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await adminApi.get("/attendance/average");
        setAvgAttendance(res.data.avgAttendance);
      } catch (err) { console.error(err); }
    };
    fetchAttendance();
  }, []);

  const attendanceData = [
    { month: "Nov", attendance: 70 },
    { month: "Dec", attendance: 65 },
    { month: "Jan", attendance: 68 },
    { month: "Feb", attendance: 72 },
    { month: "Mar", attendance: 64 },
  ];

  useEffect(() => {
    const fetchLowAttendance = async () => {
      try {
        const res = await adminApi.get("/attendance/low");
        setLowAttendance(res.data);
      } catch (err) { console.error(err); }
    };
    fetchLowAttendance();
  }, []);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await adminApi.get("/fees/summaryadmin");
        setFees(res.data);
      } catch (err) { console.error(err); }
    };
    fetchFees();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await adminApi.get("/activities");
      setActivities(res.data);
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchTopStudents = async () => {
      const res = await adminApi.get("/top-students");
      setTopStudents(res.data);
    };
    fetchTopStudents();
  }, []);

  // --- RESTORED HELPER FUNCTIONS ---
  const getActivityColor = (type) => {
    switch (type) {
      case "student": return "rgba(59,130,246,0.2)";
      case "fees": return "rgba(16,185,129,0.2)";
      case "assignment": return "rgba(168,85,247,0.2)";
      case "attendance": return "rgba(245,158,11,0.2)";
      default: return "rgba(148,163,184,0.2)";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "student": return "🧑‍🎓";
      case "fees": return "💰";
      case "assignment": return "📚";
      case "attendance": return "📝";
      default: return "📌";
    }
  };

  const getExtraDetails = (item) => {
    switch (item.type) {
      case "fees": return "Payment received via system";
      case "assignment": return "Submitted by student";
      case "attendance": return "Attendance updated";
      case "student": return "New enrollment completed";
      default: return "";
    }
  };

  const formatRelativeTime = (time) => {
    const now = new Date();
    const past = new Date(time);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return past.toLocaleDateString();
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  // --- RENDER WITH ENHANCED UI ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", paddingBottom: "4rem" }}>
      <style>{`
        .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-box { background: #0f172a; border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 20px; transition: 0.3s; }
        .stat-box:hover { transform: translateY(-5px); border-color: #6366f1; }
        .icon-shape { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .main-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 2rem; width: 100%; }
        .list-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 16px; margin-bottom: 0.75rem; border: 1px solid transparent; }
      `}</style>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, wordSpacing: '5px' }}>ADMIN DASHBOARD</h1>
      </div>

      <div className="dash-grid">
        <StatCard icon={<Users size={22}/>} label="Total Students" value={totalStudents} color="#6366f1" />
        <StatCard icon={<GraduationCap size={22}/>} label="Faculty Members" value={totalFaculty} color="#10b981" />
        <StatCard icon={<Library size={22}/>} label="Colleges" value={totalColleges} color="#f59e0b" />
        <StatCard icon={<MapPin size={22}/>} label="Branches" value={totalBranches} color="#8b5cf6" />
        <StatCard icon={<BookMarked size={22}/>} label="Courses" value={totalCourses} color="#06b6d4" />
        <StatCard icon={<Activity size={22}/>} label="Avg. Attendance" value={`${Math.round(avgAttendance)}%`} color="#ef4444" />
      </div>

      {/* CHANGED: display from 'grid' to 'flex' and direction to 'column' to span full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem', width: '100%' }}>
        <div className="main-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#6366f1"/> Attendance Overview
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="main-card" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>💰 Fees Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '16px' }}>
              <p style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>COLLECTED</p>
              <h2 style={{ fontSize: '1.3rem' }}>₹{fees.collected?.toLocaleString()}</h2>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '16px' }}>
              <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>PENDING</p>
              <h2 style={{ fontSize: '1.3rem' }}>₹{fees.pending?.toLocaleString()}</h2>
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
              <span>Collection Progress</span>
              <span style={{ color: '#10b981' }}>{fees.percentage}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}>
              <div style={{ width: `${fees.percentage}%`, height: '100%', background: '#10b981', borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Low Attendancerestored list */}
      <div className="main-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ef4444' }}>⚠️ Low Attendance Students</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {lowAttendance.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No students below 75%</p>
          ) : (
            lowAttendance.slice(0, 6).map((s) => (
              <div key={s.id} className="list-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.branch_name} • Sem {s.semester}</div>
                </div>
                <div style={{ color: s.attendance < 50 ? "#ef4444" : "#f59e0b", fontWeight: 800 }}>{s.attendance}%</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHANGED: display from 'grid' to 'flex' and direction to 'column' to span full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div className="main-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>🔔 Recent Activities</h3>
          {activities.map((item, i) => (
            <div key={i} className="list-item">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: getActivityColor(item.type), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getActivityIcon(item.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.description}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>{formatRelativeTime(item.time)}</div>
            </div>
          ))}
        </div>

        <div className="main-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>🏆 Top Students</h3>
          {topStudents.map((student, index) => (
            <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ width: 32, fontSize: '1.2rem' }}>{getRankIcon(index)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{student.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{student.branch} • Sem {student.semester}</div>
              </div>
              <div style={{ color: '#10b981', fontWeight: 800 }}>{student.attendance_percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-box">
    <div className="icon-shape" style={{ background: `${color}15`, color: color }}>{icon}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{label}</div>
  </div>
);

export default AdminDashboard;
// src/admin/AddStudent.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi"; // Adjust path if needed
import {
  User,
  ArrowLeft,
  CheckCircle2,
  Zap,
  UserSquare2,
  CalendarDays,
  Percent,
  School,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  Home,
  Briefcase,
  Camera,
  FileUp,
  FileCheck,
  UploadCloud,
  Download,
  AlertCircle,
} from "lucide-react";

// --- FORM SPECIFIC STYLES ---
const FormStyles = () => (
  <style>{`
    /* Onboard Container */
    .onboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 4rem;
    }

    /* Base Card Style for Separation */
    .onboard-card {
      width: 100%;
      background: rgba(15, 23, 42, 0.4);
      border-radius: 2rem;
      border: 1px solid rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(30px);
      padding: 2.5rem;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem 1.5rem;
    }

    .section-header {
      grid-column: span 2;
      display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 0.75rem;
    }
    .section-header span {
      font-size: 0.7rem; font-weight: 900; color: #6366f1;
      text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap;
    }
    .section-header div { height: 1px; background: rgba(30, 41, 59, 0.7); flex: 1; opacity: 0.4; }

    .input-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .input-group label {
      font-size: 0.7rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 0.05em; margin-left: 0.2rem;
    }

    .field-wrapper {
      display: flex; align-items: center; gap: 0.6rem;
      background: #020617; border: 1px solid rgba(30, 41, 59, 0.7);
      border-radius: 0.75rem; padding: 0 1rem; transition: all 0.2s;
    }
    .field-wrapper:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }

    .field-wrapper input, .field-wrapper select {
      background: none; border: none; color: white; padding: 0.75rem 0;
      width: 100%; outline: none; font-size: 0.9rem;
    }
    .field-wrapper select option { background: #0f172a; color: white; }

    /* Photo Upload Area - ORIGINAL CENTERED */
    .photo-area { grid-column: span 2; display: flex; justify-content: center; margin-bottom: 1rem; }
    .photo-circle {
      width: 90px; height: 90px; border-radius: 1.5rem;
      border: 2px dashed rgba(30, 41, 59, 0.7); background: #020617;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; overflow: hidden; transition: 0.3s;
    }
    .photo-circle:hover { border-color: #6366f1; }
    .photo-circle img { width: 100%; height: 100%; object-fit: cover; }

    /* File Row */
    .file-row { grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.75rem; }
    .upload-box {
      background: rgba(2, 6, 23, 0.6); border: 1px dashed rgba(30, 41, 59, 0.7);
      border-radius: 0.8rem; padding: 0.75rem 1rem;
      display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: 0.2s;
    }
    .upload-box:hover { border-color: #6366f1; background: rgba(99, 102, 241, 0.05); }
    .upload-box p { font-size: 0.75rem; font-weight: 700; color: white; margin-bottom: 2px; }
    .upload-box span { font-size: 0.65rem; color: #94a3b8; }

    /* --- IMPROVISED BUTTON STYLES --- */
    
    /* Main Submit Button - Vivid Gradient & Glow */
    .btn-submit {
      width: 100%; 
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none; 
      padding: 1.1rem; 
      border-radius: 1rem;
      font-weight: 800; 
      font-size: 1rem; 
      letter-spacing: 0.5px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.75rem;
      margin-top: 2.5rem; 
      transition: all 0.3s ease;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-submit:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6); 
    }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

    /* Bulk Section Unique Styles */
    .bulk-card {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(2, 6, 23, 0.8));
      border: 1px dashed rgba(99, 102, 241, 0.4);
    }

    .bulk-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      margin-top: 1.5rem;
    }

    .bulk-file-input {
      background: rgba(2, 6, 23, 0.8);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 0.7rem 1.2rem;
      border-radius: 0.75rem;
      color: #94a3b8;
      font-size: 0.85rem;
    }

    /* Bulk Upload Button - Emerald Glow */
    .bulk-btn-upload {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px -5px rgba(16, 185, 129, 0.4);
      display: flex; align-items: center; gap: 8px;
    }
    .bulk-btn-upload:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 12px 25px -5px rgba(16, 185, 129, 0.6); 
    }

    /* Sample Download Button - Indigo Outline Glow */
    .bulk-btn-sample {
      background: rgba(99, 102, 241, 0.05);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .bulk-btn-sample:hover { 
      background: rgba(99, 102, 241, 0.15); 
      border-color: #818cf8; 
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
    }

    /* Bottom Back Button */
    .back-btn-bottom {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }
    .back-btn-bottom:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      transform: translateY(-2px);
    }

    .bulk-instructions {
      color: #cbd5e1;
      font-size: 0.85rem;
      line-height: 1.6;
      text-align: left;
      background: rgba(0,0,0,0.4);
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid #f59e0b;
    }

    .bulk-terminal {
      background: #020617;
      padding: 1.2rem;
      border-radius: 0.75rem;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.8rem;
      color: #10b981;
      text-align: left;
      border: 1px solid rgba(255,255,255,0.05);
      margin: 0;
    }

    /* Toast Notification */
    .toast-notification {
      position: fixed; bottom: 2rem; right: 2rem; background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 1rem 1.5rem;
      border-radius: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;
      backdrop-filter: blur(10px); z-index: 1000;
    }
    .toast-notification.error {
      background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .section-header, .photo-area, .file-row { grid-column: span 1; }
    }
  `}</style>
);

const AddStudent = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // Toast state

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await adminApi.get("/colleges");
        setColleges(res.data);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };
    fetchColleges();
  }, []);

  const [data, setData] = useState({
    name: "",
    id: "",
    college_id: "",
    branch_id: "",
    semester: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    photo: null,
    state: "",
    city: "",
    pincode: "",
    fatherName: "",
    fatherOcc: "",
    motherName: "",
    motherOcc: "",
    tenthPercent: "",
    twelfthPercent: "",
    aadharFile: null,
    leavingFile: null,
  });

  useEffect(() => {
    if (!data.college_id) {
      setBranches([]);
      return;
    }
    const fetchBranches = async () => {
      try {
        const res = await adminApi.get(
          `/branches/by-college/${data.college_id}`,
        );
        setBranches(res.data);
      } catch (err) {
        console.error("Failed to fetch branches", err);
      }
    };
    fetchBranches();
  }, [data.college_id]);

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData((prev) => ({ ...prev, [field]: file }));
  };

  const handleInputChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Form Validation Logic
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!data.photo) {
      showToast("Please upload a student photo.", "error");
      return false;
    }
    if (!data.name || data.name.trim().length < 3) {
      showToast("Full Name must be at least 3 characters long.", "error");
      return false;
    }
    if (!data.id || data.id.trim().length < 3) {
      showToast("Please provide a valid Enrollment ID.", "error");
      return false;
    }
    if (!data.dob) {
      showToast("Please select a Date of Birth.", "error");
      return false;
    }
    if (!emailRegex.test(data.email)) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    if (!phoneRegex.test(data.phone)) {
      showToast("Please enter a valid phone number (10-15 digits).", "error");
      return false;
    }
    if (!data.college_id) {
      showToast("Please select a College.", "error");
      return false;
    }
    if (!data.branch_id) {
      showToast("Please select a Branch.", "error");
      return false;
    }
    if (!data.semester || data.semester < 1 || data.semester > 8) {
      showToast("Please enter a valid semester (1-8).", "error");
      return false;
    }
    if (
      data.tenthPercent < 0 ||
      data.tenthPercent > 100 ||
      data.twelfthPercent < 0 ||
      data.twelfthPercent > 100
    ) {
      showToast("Percentages must be between 0 and 100.", "error");
      return false;
    }
    if (!data.aadharFile) {
      showToast("Please upload the Aadhar Card document.", "error");
      return false;
    }
    if (!data.leavingFile) {
      showToast("Please upload the Leaving Certificate.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("enrollment_no", data.id);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("gender", data.gender);
      formData.append("dob", data.dob);
      formData.append("college_id", data.college_id);
      formData.append("branch_id", data.branch_id);
      formData.append("semester", data.semester);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("pincode", data.pincode);
      formData.append("father_name", data.fatherName);
      formData.append("father_occupation", data.fatherOcc);
      formData.append("mother_name", data.motherName);
      formData.append("mother_occupation", data.motherOcc);
      formData.append("tenth_percent", data.tenthPercent);
      formData.append("twelfth_percent", data.twelfthPercent);

      if (data.photo) formData.append("photo", data.photo);
      if (data.aadharFile) formData.append("aadhar_file", data.aadharFile);
      if (data.leavingFile) formData.append("leaving_file", data.leavingFile);

      await adminApi.post("/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Student added & credentials generated!", "success");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      showToast(
        "Failed to add student. Please verify the provided details.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const [bulkFile, setBulkFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      showToast("Please select a ZIP file for bulk upload.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const response = await adminApi.post("/students/bulk", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student_credentials.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Students uploaded & credentials downloaded!", "success");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setBulkFile(null);
    } catch (err) {
      console.error(err);

      // ✅ THIS IS THE FIX: Properly handling the Blob error response
      if (err.response?.data instanceof Blob) {
        try {
          // 1. Convert the Blob to raw text
          const text = await err.response.data.text();

          // 2. Parse the text into a real JSON object
          const errorData = JSON.parse(text);

          // 3. Show ONLY the clean message in the toast
          const cleanMessage = errorData.message || "Bulk upload failed.";
          showToast(cleanMessage, "error");

          // 4. Log the detailed errors (like missing emails) to the console so you can debug
          if (errorData.errors) {
            console.log("Detailed Upload Errors:");
            console.table(errorData.errors);
          }
        } catch (parseError) {
          // Fallback if parsing fails
          showToast("Bulk upload failed.", "error");
        }
      } else {
        showToast(
          "Bulk upload failed. Please check the file structure.",
          "error",
        );
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setBulkFile(null);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await adminApi.get("/students/sample-zip", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample_students.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      showToast("Failed to download sample ZIP", "error");
    }
  };

  return (
    <div className="onboard-container">
      <FormStyles />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%" }}
        >
          {/* Global Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              STUDENT REGISTRATION
            </h2>
          </div>

          {/* === SECTION 1: MANUAL REGISTRATION FORM === */}
          <div className="onboard-card">
            <h3
              style={{
                textAlign: "center",
                color: "#6366f1",
                marginBottom: "2rem",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              ADD STUDENT MANUALLY
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Photo Upload - ORIGINAL CENTERED */}
              <div className="photo-area">
                <label className="photo-circle">
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleFileChange("photo", e)}
                  />
                  {data.photo ? (
                    <img src={URL.createObjectURL(data.photo)} alt="Student" />
                  ) : (
                    <>
                      <Camera size={24} color="#475569" />
                      <span
                        style={{
                          fontSize: "0.55rem",
                          fontWeight: 800,
                          color: "#475569",
                          marginTop: "4px",
                        }}
                      >
                        PHOTO
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div className="form-grid">
                {/* --- IDENTITY SECTION --- */}
                <div className="section-header">
                  <span>Identity</span>
                  <div></div>
                </div>
                <div className="input-group">
                  <label>Full Legal Name</label>
                  <div className="field-wrapper">
                    <User size={16} color="#475569" />
                    <input
                      required
                      value={data.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Enrollment ID</label>
                  <div className="field-wrapper">
                    <Zap size={16} color="#475569" />
                    <input
                      required
                      value={data.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                      placeholder="SN24-XXXX"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <div className="field-wrapper">
                    <UserSquare2 size={16} color="#475569" />
                    <select
                      value={data.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <option
                        value="Male"
                        style={{ backgroundColor: "#000", color: "white" }}
                      >
                        Male
                      </option>
                      <option
                        value="Female"
                        style={{ backgroundColor: "#000", color: "white" }}
                      >
                        Female
                      </option>
                      <option
                        value="Other"
                        style={{ backgroundColor: "#000", color: "white" }}
                      >
                        Other
                      </option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <div className="field-wrapper">
                    <CalendarDays size={16} color="#475569" />
                    <input
                      required
                      type="date"
                      value={data.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  </div>
                </div>

                {/* --- ACADEMIC SECTION --- */}
                <div className="section-header">
                  <span>Academic Performance</span>
                  <div></div>
                </div>
                <div className="input-group">
                  <label>10th Percentage (%)</label>
                  <div className="field-wrapper">
                    <Percent size={16} color="#475569" />
                    <input
                      required
                      value={data.tenthPercent}
                      onChange={(e) =>
                        handleInputChange("tenthPercent", e.target.value)
                      }
                      type="number"
                      step="0.01"
                      placeholder="e.g. 85.00"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>12th Percentage (%)</label>
                  <div className="field-wrapper">
                    <Percent size={16} color="#475569" />
                    <input
                      required
                      value={data.twelfthPercent}
                      onChange={(e) =>
                        handleInputChange("twelfthPercent", e.target.value)
                      }
                      type="number"
                      step="0.01"
                      placeholder="e.g. 82.50"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>College Name</label>
                  <div className="field-wrapper">
                    <School size={16} color="#475569" />
                    <select
                      required
                      name="college_id"
                      value={data.college_id}
                      onChange={(e) =>
                        handleInputChange("college_id", e.target.value)
                      }
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#000", color: "white" }}
                      >
                        Select College
                      </option>
                      {colleges.map((clg) => (
                        <option
                          key={clg.id}
                          value={clg.id}
                          style={{ backgroundColor: "#000", color: "white" }}
                        >
                          {clg.college_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Branch</label>
                  <div className="field-wrapper">
                    <BookOpen size={16} color="#475569" />
                    <select
                      required
                      value={data.branch_id || ""}
                      onChange={(e) =>
                        handleInputChange("branch_id", e.target.value)
                      }
                      style={{ color: data.branch_id ? "white" : "#94a3b8" }}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option
                          key={branch.id}
                          value={branch.id}
                          style={{ backgroundColor: "#000", color: "white" }}
                        >
                          {branch.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Semester</label>
                  <div className="field-wrapper">
                    <Calendar size={16} color="#475569" />
                    <input
                      required
                      type="number"
                      min="1"
                      max="8"
                      value={data.semester}
                      onChange={(e) =>
                        handleInputChange("semester", e.target.value)
                      }
                      placeholder="Current Semester"
                    />
                  </div>
                </div>

                {/* --- COMMUNICATION SECTION --- */}
                <div className="section-header">
                  <span>Communication & Location</span>
                  <div></div>
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="field-wrapper">
                    <Mail size={16} color="#475569" />
                    <input
                      required
                      value={data.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      type="email"
                      placeholder="email@address.com"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="field-wrapper">
                    <Phone size={16} color="#475569" />
                    <input
                      required
                      value={data.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      type="tel"
                      placeholder="+91..."
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Address (City & State)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="City"
                      />
                    </div>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>Pincode</label>
                  <div className="field-wrapper">
                    <Home size={16} color="#475569" />
                    <input
                      required
                      value={data.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>

                {/* --- FAMILY SECTION --- */}
                <div className="section-header">
                  <span>Family Background</span>
                  <div></div>
                </div>
                <div className="input-group">
                  <label>Father's Detail</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.fatherName}
                        onChange={(e) =>
                          handleInputChange("fatherName", e.target.value)
                        }
                        placeholder="Name"
                      />
                    </div>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.fatherOcc}
                        onChange={(e) =>
                          handleInputChange("fatherOcc", e.target.value)
                        }
                        placeholder="Occupation"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>Mother's Detail</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.motherName}
                        onChange={(e) =>
                          handleInputChange("motherName", e.target.value)
                        }
                        placeholder="Name"
                      />
                    </div>
                    <div className="field-wrapper" style={{ flex: 1 }}>
                      <input
                        required
                        value={data.motherOcc}
                        onChange={(e) =>
                          handleInputChange("motherOcc", e.target.value)
                        }
                        placeholder="Occupation"
                      />
                    </div>
                  </div>
                </div>

                {/* --- DOCUMENTS SECTION --- */}
                <div className="section-header">
                  <span>Document Uploads</span>
                  <div></div>
                </div>
                <div className="file-row">
                  <label className="upload-box">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange("aadharFile", e)}
                    />
                    {data.aadharFile ? (
                      <FileCheck size={20} color="#10b981" />
                    ) : (
                      <FileUp size={20} color="#6366f1" />
                    )}
                    <div>
                      <p>Aadhar Card</p>
                      <span>{data.aadharFile?.name || "Upload IMG / PDF"}</span>
                    </div>
                  </label>
                  <label className="upload-box">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange("leavingFile", e)}
                    />
                    {data.leavingFile ? (
                      <FileCheck size={20} color="#10b981" />
                    ) : (
                      <FileUp size={20} color="#6366f1" />
                    )}
                    <div>
                      <p>Leaving Cert</p>
                      <span>
                        {data.leavingFile?.name || "Upload IMG / PDF"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON (Improved) */}
              <button disabled={loading} type="submit" className="btn-submit">
                {loading ? (
                  <span className="flex items-center gap-2">Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 size={22} /> SUBMIT REGISTRATION
                  </>
                )}
              </button>
            </form>
          </div>

          {/* === SECTION 2: SEPARATED BULK UPLOAD === */}
          <div className="onboard-card bulk-card">
            <h3
              style={{
                textAlign: "center",
                color: "white",
                marginBottom: "0.5rem",
                fontSize: "1.4rem",
                fontWeight: 900,
              }}
            >
              Bulk Student Upload
            </h3>
            <p
              style={{
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.85rem",
                marginBottom: "2rem",
              }}
            >
              Save time by uploading multiple records via ZIP archive.
            </p>

            <div className="bulk-controls">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setBulkFile(e.target.files[0])}
                ref={fileInputRef}
                className="bulk-file-input"
              />

              <button
                type="button"
                onClick={handleBulkUpload}
                className="bulk-btn-upload"
              >
                <UploadCloud size={18} /> Upload Bulk Students
              </button>
            </div>

            <div className="bulk-instructions">
              📦 <strong>Upload a ZIP file containing:</strong>
              <br />• <b>students.csv</b> (with correct column names)
              <br />• <b>photos/</b> (student images like john.jpg)
              <br />• <b>aadhar/</b> (PDF/IMG files)
              <br />• <b>leaving/</b> (PDF/IMG files)
              <br />
              <br />
              ⚠️ <strong>Make sure:</strong>
              <br />
              • File names in CSV match folder files exactly
              <br />
              • students.csv is in the root (not inside another folder)
              <br />• ZIP structure is correct
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="bulk-btn-sample"
              >
                <Download size={16} /> Download Sample ZIP
              </button>
            </div>

            <pre className="bulk-terminal">
              {`sample.zip
│
├── students.csv
├── photos/
│   ├── john.jpg
│   └── jane.jpg
├── aadhar/
│   ├── john.pdf
│   └── jane.pdf
└── leaving/
    ├── john.pdf
    └── jane.pdf`}
            </pre>
          </div>
          {/* === BOTTOM BACK BUTTON === */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="back-btn-bottom"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`toast-notification ${notification.type === "error" ? "error" : ""}`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddStudent;

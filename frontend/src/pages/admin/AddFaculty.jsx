// src/admin/AddFaculty.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";
import {
  User,
  Mail,
  Phone,
  Lock,
  CalendarDays,
  MapPin,
  GraduationCap,
  Briefcase,
  FileUp,
  FileCheck,
  Camera,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  AlertCircle,
} from "lucide-react";

const FormStyles = () => (
  <style>{`
    /* Onboard Container - ORIGINAL */
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
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0 0.75rem;
    }

    .section-header span {
      font-size: 0.7rem;
      font-weight: 900;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      white-space: nowrap;
    }

    .section-header div {
      height: 1px;
      background: rgba(30, 41, 59, 0.7);
      flex: 1;
      opacity: 0.4;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .input-group label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-left: 0.2rem;
    }

    .field-wrapper {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #020617;
      border: 1px solid rgba(30, 41, 59, 0.7);
      border-radius: 0.75rem;
      padding: 0 1rem;
      transition: all 0.2s;
    }

    .field-wrapper:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .field-wrapper input,
    .field-wrapper select {
      background: none;
      border: none;
      color: white;
      padding: 0.75rem 0;
      width: 100%;
      outline: none;
      font-size: 0.9rem;
    }

    /* Photo Upload Area - ORIGINAL CENTERED */
    .photo-area {
      grid-column: span 2;
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .photo-circle {
      width: 90px;
      height: 90px;
      border-radius: 1.5rem;
      border: 2px dashed rgba(30, 41, 59, 0.7);
      background: #020617;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: 0.3s;
    }

    .photo-circle:hover {
      border-color: #6366f1;
    }

    .photo-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .file-row {
      grid-column: span 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .upload-box {
      background: rgba(2, 6, 23, 0.6);
      border: 1px dashed rgba(30, 41, 59, 0.7);
      border-radius: 0.8rem;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: 0.2s;
    }

    .upload-box:hover {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.05);
    }

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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 2.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-submit:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
    }
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

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
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bulk-btn-upload:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 25px -5px rgba(16, 185, 129, 0.6);
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
      .form-grid {
        grid-template-columns: 1fr;
      }
      .section-header,
      .photo-area,
      .file-row {
        grid-column: span 1;
      }
    }
  `}</style>
);

const AddFaculty = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Toast State
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    gender: "Male",
    dob: "",
    city: "",
    state: "",
    branch_id: "",
    designation: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    joining_date: "",
    profile_photo: null,
    resume_file: null,
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  useEffect(() => {
    adminApi.get("/branches").then((res) => setBranches(res.data));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Helper to show toast
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Form Validation Logic
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!formData.profile_photo) {
      showToast("Please upload a profile photo.", "error");
      return false;
    }
    if (formData.full_name.trim().length < 3) {
      showToast("Full Name must be at least 3 characters long.", "error");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return false;
    }
    if (!phoneRegex.test(formData.phone_number)) {
      showToast("Please enter a valid phone number (10-15 digits).", "error");
      return false;
    }
    if (!formData.branch_id) {
      showToast("Please select a branch from the dropdown.", "error");
      return false;
    }
    if (formData.experience_years < 0) {
      showToast("Experience years cannot be a negative number.", "error");
      return false;
    }
    if (!formData.resume_file) {
      showToast("Please upload the Resume File.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();

      // append only text fields
      Object.keys(formData).forEach((key) => {
        if (!["profile_photo", "resume_file"].includes(key)) {
          data.append(key, formData[key]);
        }
      });

      // append files manually
      if (formData.profile_photo) {
        data.append("profile_photo", formData.profile_photo);
      }

      if (formData.resume_file) {
        data.append("resume_file", formData.resume_file);
      }

      await adminApi.post("/faculty", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Faculty registered successfully!", "success");

      // Delay navigation slightly so user sees the success toast
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message ||
          "Failed to add faculty. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const [bulkFile, setBulkFile] = useState(null);

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      showToast("Please select a ZIP file containing the bulk data.", "error");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", bulkFile);

    try {
      await adminApi.post("/faculty/bulk", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Bulk Faculty uploaded successfully!", "success");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setBulkFile(null);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message ||
          "Bulk upload failed. Please verify ZIP structure.",
        "error",
      );
    }
  };

  return (
    <div className="onboard-container">
      <FormStyles />

      <AnimatePresence>
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
              FACULTY REGISTRATION
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
              Manual Entry
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="photo-area">
                <label className="photo-circle">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange("profile_photo", e)}
                  />
                  {formData.profile_photo ? (
                    <img
                      src={URL.createObjectURL(formData.profile_photo)}
                      alt="Faculty"
                    />
                  ) : (
                    <>
                      <Camera size={22} color="#475569" />
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
                <div className="section-header">
                  <span>Identity</span>
                  <div />
                </div>

                <Input
                  required
                  label="Full Name"
                  icon={<User size={16} color="#475569" />}
                  name="full_name"
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                <Input
                  required
                  label="Email"
                  icon={<Mail size={16} color="#475569" />}
                  name="email"
                  type="email"
                  onChange={handleChange}
                  placeholder="email@address.com"
                />
                <Input
                  required
                  label="Password"
                  icon={<Lock size={16} color="#475569" />}
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="********"
                />
                <Input
                  required
                  label="Phone"
                  icon={<Phone size={16} color="#475569" />}
                  name="phone_number"
                  type="tel"
                  onChange={handleChange}
                  placeholder="+91 9345678900"
                />
                <Input
                  required
                  label="DOB"
                  icon={<CalendarDays size={16} color="#475569" />}
                  name="dob"
                  type="date"
                  onChange={handleChange}
                />

                <div className="input-group">
                  <label>Gender</label>
                  <div className="field-wrapper">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option
                        value="Male"
                        style={{ backgroundColor: "#000000", color: "white" }}
                      >
                        Male
                      </option>
                      <option
                        value="Female"
                        style={{ backgroundColor: "#000000", color: "white" }}
                      >
                        Female
                      </option>
                      <option
                        value="Other"
                        style={{ backgroundColor: "#000000", color: "white" }}
                      >
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <Input
                  required
                  label="City"
                  icon={<MapPin size={16} color="#475569" />}
                  name="city"
                  onChange={handleChange}
                  placeholder="Ahmedabad"
                />

                <Input
                  required
                  label="State"
                  icon={<MapPin size={16} color="#475569" />}
                  name="state"
                  onChange={handleChange}
                  placeholder="Gujarat"
                />

                <div className="section-header">
                  <span>Academic</span>
                  <div />
                </div>

                <div className="input-group">
                  <label>Branch</label>
                  <div className="field-wrapper">
                    <select
                      name="branch_id"
                      value={formData.branch_id}
                      onChange={handleChange}
                      required
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#000000", color: "white" }}
                      >
                        Select Branch
                      </option>
                      {branches.map((b) => (
                        <option
                          key={b.id}
                          value={b.id}
                          style={{ backgroundColor: "#000000", color: "white" }}
                        >
                          {b.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  required
                  label="Designation"
                  icon={<Briefcase size={16} color="#475569" />}
                  name="designation"
                  onChange={handleChange}
                  placeholder="Assistant Professor"
                />
                <Input
                  required
                  label="Qualification"
                  icon={<GraduationCap size={16} color="#475569" />}
                  name="qualification"
                  onChange={handleChange}
                  placeholder="PhD in Computer Science"
                />
                <Input
                  required
                  label="Specialization"
                  name="specialization"
                  onChange={handleChange}
                  placeholder="Artificial Intelligence"
                />
                <Input
                  required
                  label="Experience (Years)"
                  name="experience_years"
                  type="number"
                  onChange={handleChange}
                  placeholder="5"
                />
                <Input
                  required
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  onChange={handleChange}
                  placeholder="2023-01-01"
                />

                <div className="section-header">
                  <span>Documents</span>
                  <div />
                </div>

                <div className="file-row">
                  <label className="upload-box">
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => handleFileChange("resume_file", e)}
                    />
                    {formData.resume_file ? (
                      <FileCheck size={18} color="#10b981" />
                    ) : (
                      <FileUp size={18} color="#6366f1" />
                    )}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: formData.resume_file ? "#10b981" : "white",
                      }}
                    >
                      {formData.resume_file?.name || "Resume (PDF)"}
                    </span>
                  </label>
                </div>
              </div>

              <button disabled={loading} className="btn-submit">
                <CheckCircle2 size={20} />
                {loading ? "Processing..." : "ADD FACULTY"}
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
              Bulk Faculty Upload
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
                <UploadCloud size={18} /> Upload Bulk Faculty
              </button>
            </div>

            <div className="bulk-instructions">
              📦 <strong>Upload a ZIP file containing:</strong>
              <br />• <b>faculty.csv</b> (with correct column names)
              <br />• <b>photos/</b> (faculty images like john.jpg)
              <br />• <b>resume/</b> (PDF files like john.pdf)
              <br />
              <br />
              ⚠️ <strong>Make sure:</strong>
              <br />
              • File names in CSV match folder files exactly
              <br />
              • faculty.csv is in the root (not inside another folder)
              <br />• ZIP structure is correct
            </div>

            <pre className="bulk-terminal">
              {`sample_faculty.zip
│
├── faculty.csv
├── photos/
│   ├── john.jpg
│   └── jane.jpg
└── resume/
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

const Input = ({ label, icon, ...props }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="field-wrapper">
      {icon}
      <input {...props} />
    </div>
  </div>
);

// We can remove the FileBox component as it's not currently used, but left here in case you need it later
const FileBox = ({ label, setFile }) => (
  <label className="upload-box">
    <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
    <FileUp size={18} />
    <span>{label}</span>
  </label>
);

export default AddFaculty;

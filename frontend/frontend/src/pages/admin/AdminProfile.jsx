import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Save, Camera, Settings, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "../../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";

const ProfileStyles = () => (
  <style>{`
    .page-container { max-width: 1100px; margin: 0 auto; width: 100%; padding-bottom: 4rem; }
    
    .grid-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
    
    .glass-card {
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(30, 41, 59, 0.7);
      border-radius: 24px;
      padding: 2.5rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    
    .input-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .input-group label {
      color: #94a3b8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em; margin-left: 0.25rem;
    }
    
    .field-wrapper {
      display: flex; align-items: center; gap: 0.75rem;
      background: rgba(2, 6, 23, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem; padding: 0 1.25rem; transition: all 0.2s;
    }
    .field-wrapper:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
    .field-wrapper input {
      background: none; border: none; color: white; padding: 1rem 0;
      width: 100%; outline: none; font-size: 0.95rem;
    }
    .field-wrapper input::placeholder { color: #475569; }
    
    .btn-submit {
      width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; padding: 1.1rem; border-radius: 1rem; font-weight: 800; font-size: 1rem; 
      letter-spacing: 0.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; 
      gap: 0.75rem; margin-top: 1rem; transition: all 0.3s ease; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
    
    /* Profile Picture Styles */
    .profile-pic-container {
      position: relative; width: 160px; height: 160px; margin: 0 auto 1.5rem; cursor: pointer;
    }
    .profile-pic-wrapper {
      width: 100%; height: 100%; border-radius: 50%; padding: 4px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
    }
    .profile-pic-inner {
      width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
      background: #020617; display: flex; align-items: center; justify-content: center;
    }
    .profile-overlay {
      position: absolute; inset: 4px; border-radius: 50%; background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s;
    }
    .profile-pic-container:hover .profile-overlay { opacity: 1; }
    
    .toast-notification {
      position: fixed; bottom: 2rem; right: 2rem; background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 1rem 1.5rem;
      border-radius: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;
      backdrop-filter: blur(10px); z-index: 100;
    }

    @media (max-width: 768px) {
      .grid-layout { grid-template-columns: 1fr; }
    }
  `}</style>
);

const AdminProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdminProfile();
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
        setProfileImage(res.data.profile_photo || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setNotification("Image must be under 2MB");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const getImageSrc = () => {
    if (!profileImage) return null;
    if (profileImage.startsWith("blob:")) {
      return profileImage;
    }
    return `http://localhost:5000/uploads/admin/${profileImage}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);

      if (imageFile) {
        form.append("profile_photo", imageFile);
      }

      const res = await updateAdminProfile(form);
      setNotification(res.data.message || "Profile updated successfully");
      setTimeout(() => setNotification(""), 3000);

      localStorage.removeItem("adminToken");
      setTimeout(() => navigate("/admin/login"), 1000);
    } catch (err) {
      setNotification("Update failed");
      setTimeout(() => setNotification(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <ProfileStyles />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-end', marginBottom: "2.5rem" }}>
        <div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "6px 12px",
              borderRadius: "8px",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: 'uppercase',
              marginBottom: '1rem',
              transition: '0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'white'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0", display: "flex", alignItems: "center", gap: "12px", color: "white", letterSpacing: '-1px' }}>
            <Shield color="#6366f1" size={32} strokeWidth={2.5} /> Admin Profile
          </h1>
        </div>
      </div>

      <div className="grid-layout">
        
        {/* LEFT CARD - PROFILE PHOTO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="profile-pic-container" onClick={handleImageClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
              accept="image/*"
            />
            <div className="profile-pic-wrapper">
              <div className="profile-pic-inner">
                {profileImage ? (
                  <img
                    src={getImageSrc()}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={64} color="#64748b" />
                )}
              </div>
            </div>
            <div className="profile-overlay">
              <Camera size={32} color="#fff" />
            </div>
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "white", margin: "0 0 4px 0" }}>
            {formData.name || "Administrator"}
          </h2>
          <p style={{ color: "#818cf8", fontSize: "0.9rem", fontWeight: "600", textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
            Super Admin
          </p>
        </motion.div>

        {/* RIGHT CARD - FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="glass-card"
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1rem", color: "white" }}>
            <Settings size={20} color="#6366f1" /> Account Settings
          </h3>

          <form onSubmit={handleSubmit}>
            
            {/* NAME */}
            <div className="input-group">
              <label>Full Name</label>
              <div className="field-wrapper">
                <User size={18} color="#64748b" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email Address</label>
              <div className="field-wrapper">
                <Mail size={18} color="#64748b" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>New Password</label>
              <div className="field-wrapper">
                <Lock size={18} color="#64748b" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              <Save size={20} />
              {loading ? "UPDATING PROFILE..." : "UPDATE PROFILE"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            className="toast-notification"
          >
            <CheckCircle2 size={20} /> {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;
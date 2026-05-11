import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Map,
  BookOpen,
  CalendarDays,
  ArrowRight,
  Library,
  Compass,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // --- Design System: Premium Dark High-Tech Campus ---
  const theme = {
    bgBase: "#020611", // Deepest space black
    bgGradient:
      "radial-gradient(circle at top center, #0B1A3A 0%, #020611 100%)", // Top-lit glow effect
    bgSectionAlt:
      "linear-gradient(180deg, rgba(11, 26, 58, 0.2) 0%, rgba(2, 6, 17, 1) 100%)",
    bgCardGradient:
      "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(11, 19, 37, 0.8) 100%)",
    borderLight: "rgba(255, 255, 255, 0.08)",
    borderHighlight: "rgba(59, 130, 246, 0.3)", // Subtle blue border for cards
    primaryBlue: "#2563eb",
    accentCyan: "#10B981",
    textMain: "#F8FAFC",
    textMuted: "#94A3B8",
  };

  const styles = {
    page: {
      background: theme.bgGradient,
      backgroundColor: theme.bgBase, // Fallback
      color: theme.textMain,
      fontFamily: '"Inter", system-ui, sans-serif',
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      margin: 0,
      padding: 0,
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "0 1.5rem" : "0 4rem",
      position: "relative",
      zIndex: 10,
    },
    navbar: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 100,
      padding: isMobile ? "1.5rem" : "2rem 4rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      borderBottom: `1px solid ${theme.borderLight}`,
      background: "rgba(2, 6, 17, 0.3)",
      backdropFilter: "blur(12px)",
    },
    navLinks: {
      display: isMobile ? "none" : "flex",
      gap: "2.5rem",
      alignItems: "center",
    },
    navLinkItem: {
      color: theme.textMain,
      textDecoration: "none",
      fontSize: "0.85rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "color 0.2s",
    },
    heroSection: {
      position: "relative",
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      // 🔥 Changed: Dark on the left for text readability, fading to transparent on the right to reveal the campus
      background: `linear-gradient(to right, rgba(2, 6, 17, 0.95) 0%, rgba(2, 6, 17, 0.7) 40%, rgba(2, 6, 17, 0.2) 100%), url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2686&auto=format&fit=crop')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", // 🔥 Adds a premium parallax scroll effect
      paddingTop: "100px",
      boxSizing: "border-box",
      borderBottom: `1px solid ${theme.borderLight}`,
    },
    badge: {
      border: `1px solid ${theme.borderHighlight}`,
      background: "rgba(37, 99, 235, 0.1)",
      padding: "6px 12px",
      borderRadius: "50px",
      fontSize: "0.65rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
      fontWeight: 700,
      color: "#60A5FA", // Light blue text for the badge
      width: "fit-content",
      marginBottom: "1.5rem",
      boxShadow: "0 0 20px rgba(37, 99, 235, 0.2)", // Subtle glow
    },
    btnPrimary: {
      background: "#F8FAFC",
      color: "#0F172A",
      padding: "12px 24px",
      borderRadius: "6px",
      border: "none",
      fontWeight: 600,
      fontSize: "0.9rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 14px rgba(255, 255, 255, 0.15)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    btnSecondary: {
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(8px)",
      color: theme.textMain,
      padding: "12px 24px",
      borderRadius: "6px",
      border: `1px solid ${theme.borderLight}`,
      fontWeight: 600,
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    section: {
      padding: isMobile ? "4rem 0" : "8rem 0",
      borderBottom: `1px solid ${theme.borderLight}`,
    },
    sectionAlt: {
      padding: isMobile ? "4rem 0" : "8rem 0",
      borderBottom: `1px solid ${theme.borderLight}`,
      background: theme.bgSectionAlt, // Alternate background for depth
    },
    card: {
      background: theme.bgCardGradient,
      border: `1px solid ${theme.borderLight}`,
      borderTop: `1px solid ${theme.borderHighlight}`, // Accent top border
      borderRadius: "12px",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(10px)",
    },
    solidCtaBanner: {
      background: `linear-gradient(135deg, ${theme.primaryBlue} 0%, #1E3A8A 100%)`, // Enhanced rich gradient
      borderRadius: "16px",
      padding: isMobile ? "3rem 2rem" : "4rem",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "2rem",
      margin: "6rem 0",
      boxShadow: "0 20px 40px rgba(37, 99, 235, 0.25)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  };

  return (
    <div style={styles.page}>
      {/* --- NAVBAR --- */}
      <nav style={styles.navbar}>
        <div
          style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-1px" }}
        >
          AIAAMS Campus
        </div>

        <div style={styles.navLinks}>
          <span style={styles.navLinkItem}>Campus Map</span>
          <span style={styles.navLinkItem}>Departments</span>
          <span style={styles.navLinkItem}>Student Life</span>
          <span style={styles.navLinkItem}>Facilities</span>
        </div>

        {!isMobile && (
          <button
            style={{ ...styles.btnPrimary, padding: "8px 20px" }}
            onClick={() => navigate("/student/login")}
          >
            Student Login
          </button>
        )}

        {isMobile && (
          <Menu size={28} onClick={() => setIsMobileMenuOpen(true)} />
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div style={styles.heroSection}>
        <div style={styles.container}>
          <div style={{ maxWidth: "700px" }}>
            <div style={styles.badge}>STUDENT DISCOVERY PORTAL</div>

            <h1
              style={{
                fontSize: isMobile ? "2.5rem" : "4.5rem",
                fontWeight: 700,
                lineHeight: 1.05,
                margin: "0 0 1.5rem 0",
                letterSpacing: "-1px",
              }}
            >
              The Architectural <br />
              <span
                style={{
                  color: "#60A5FA",
                  textShadow: "0 0 30px rgba(96, 165, 250, 0.4)",
                }}
              >
                Edge of Campus Life
              </span>
            </h1>

            <p
              style={{
                color: theme.textMuted,
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
                maxWidth: "550px",
              }}
            >
              AIAAMS orchestrates your college experience into an elite,
              ledger-grade journey. Leverage our interactive campus guides and
              AI-driven curriculum insights to transcend traditional learning
              boundaries.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button style={styles.btnPrimary}>
                Begin Campus Tour <ArrowRight size={16} />
              </button>
              <button style={styles.btnSecondary}>Explore Colleges</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CAMPUS FACILITIES SECTION --- */}
      <div style={styles.section}>
        <div style={styles.container}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "flex-end",
              marginBottom: "3rem",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: "0 0 0.5rem 0",
                  letterSpacing: "-0.5px",
                }}
              >
                Discover Your Campus
              </h2>
              <p
                style={{
                  color: theme.textMuted,
                  margin: 0,
                  maxWidth: "450px",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                Everything you need to succeed is right here. Navigate
                university facilities, access digital libraries, and stay
                updated with student events.
              </p>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "2px",
                color: theme.textMuted,
                textTransform: "uppercase",
              }}
            >
              CAMPUS HIGHLIGHTS // 001
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            <div style={styles.card}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                <Map size={24} color="#F8FAFC" />
              </div>
              <h3 style={{ fontSize: "1.25rem", margin: "1rem 0 0 0" }}>
                Interactive Maps
              </h3>
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                Locate lecture halls, laboratories, hostels, and cafeterias
                instantly with our 3D interactive campus guide.
              </p>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#60A5FA",
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
              >
                VIEW MAPS <ArrowRight size={14} />
              </div>
            </div>

            <div style={styles.card}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "12px",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                <Library size={24} color={theme.accentCyan} />
              </div>
              <h3 style={{ fontSize: "1.25rem", margin: "1rem 0 0 0" }}>
                Digital Library
              </h3>
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                Access thousands of research papers, digital textbooks, and
                historical archives from anywhere on campus.
              </p>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: theme.accentCyan,
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
              >
                BROWSE ARCHIVES <ArrowRight size={14} />
              </div>
            </div>

            <div style={styles.card}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                <CalendarDays size={24} color="#F8FAFC" />
              </div>
              <h3 style={{ fontSize: "1.25rem", margin: "1rem 0 0 0" }}>
                Student Hub
              </h3>
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                Stay connected with upcoming college fests, academic seminars,
                and extra-curricular society meetups.
              </p>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#60A5FA",
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
              >
                VIEW EVENTS <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STUDENT ONBOARDING SECTION (Alternate Background) --- */}
      <div style={styles.sectionAlt}>
        <div style={styles.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  margin: "0 0 1rem 0",
                  lineHeight: 1.1,
                }}
              >
                Seamless
                <br />
                Campus Integration
              </h2>
              <p
                style={{
                  color: theme.textMuted,
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                Your first day on campus shouldn't be confusing. The AIAAMS
                portal maps out your entire semester before you even step foot
                in class.
              </p>
              <div style={{ position: "relative" }}>
                {/* Subtle glow behind the image */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-10px",
                    background: "linear-gradient(45deg, #2563eb, #10B981)",
                    opacity: 0.15,
                    filter: "blur(20px)",
                    borderRadius: "12px",
                  }}
                ></div>
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2034&auto=format&fit=crop"
                  alt="Campus Buildings"
                  style={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.borderLight}`,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              {[
                {
                  num: "01",
                  title: "Digital ID & Access",
                  desc: "Your student profile serves as your digital ID, granting secure access to libraries, hostels, and recreational centers.",
                },
                {
                  num: "02",
                  title: "Smart Enrollment",
                  desc: "Browse detailed information about all available courses and departments to make informed decisions for your major.",
                },
                {
                  num: "03",
                  title: "Live Dashboards",
                  desc: "Once enrolled, log in to view your personalized timetable, academic deadlines, and real-time faculty announcements.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#60A5FA",
                      background: "rgba(37, 99, 235, 0.15)",
                      border: `1px solid rgba(37, 99, 235, 0.3)`,
                      padding: "10px 14px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "1.2rem",
                        margin: "0 0 0.5rem 0",
                        fontWeight: 600,
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        color: theme.textMuted,
                        margin: 0,
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA BANNER SECTION --- */}
      <div style={styles.container}>
        <div style={styles.solidCtaBanner}>
          <div>
            <h2
              style={{
                fontSize: "2.2rem",
                margin: "0 0 0.5rem 0",
                fontWeight: 600,
                letterSpacing: "-0.5px",
              }}
            >
              Ready to architect your future?
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                margin: 0,
                fontSize: "1.05rem",
              }}
            >
              Join 40+ premier institutions on the AIAAMS network.
            </p>
          </div>
          <button
            style={{
              background: "#040914",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "16px 32px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            Claim Student Seat
          </button>
        </div>

        {/* --- FOOTER --- */}
        <footer
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2rem 0",
            borderTop: `1px solid ${theme.borderLight}`,
            fontSize: "0.85rem",
            color: theme.textMuted,
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontWeight: 800,
                color: theme.textMain,
                fontSize: "1.1rem",
                letterSpacing: "-0.5px",
              }}
            >
              AIAAMS
            </span>
            <span>© 2026 AIAAMS. The Premier Student Campus Portal.</span>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <span
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = theme.textMuted)}
            >
              Campus Guidelines
            </span>
            <span
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = theme.textMuted)}
            >
              Admissions
            </span>
            <span
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = theme.textMuted)}
            >
              Directory
            </span>
            <span
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = theme.textMuted)}
            >
              Help Desk
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

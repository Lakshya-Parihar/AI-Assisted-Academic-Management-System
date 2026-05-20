import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  Sparkles,
  FileText,
  Calendar,
  BrainCircuit,
  CheckCircle,
  Loader2,
  Cpu,
  Plus, // <-- Added for the attachment icon
} from "lucide-react";
import ChatBubble from "../../components/ChatBubble";

const NexusAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const chatEndRef = useRef(null);

  // --- DYNAMIC ID LOGIC ---
  const storedData = localStorage.getItem("studentData");
  const studentId = storedData ? JSON.parse(storedData).id : null;

  // --- CONNECT DIRECTLY TO PYTHON FASTAPI FOR HISTORY ---
  useEffect(() => {
    if (!studentId) {
      setIsHistoryLoading(false);
      return;
    }

    axios
      .post("http://127.0.0.1:8000/history", { student_id: studentId })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([
            {
              role: "bot",
              text: "Hello! I'm Nexus, your academic assistant. How can I help you today?",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      })
      .catch((err) => console.error("Failed to load chat history", err))
      .finally(() => setIsHistoryLoading(false));
  }, [studentId]);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- CONNECT DIRECTLY TO PYTHON FASTAPI FOR CHAT ---
  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isTyping) return;

    if (!studentId) {
      alert("Error: No Student ID found. Please log in again.");
      return;
    }

    const newUserMsg = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        student_id: studentId,
        message: textToSend,
      });

      const newBotMsg = {
        role: "bot",
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = {
        role: "bot",
        text: "I'm sorry, I am having trouble connecting to my Python server. Is FastAPI running on port 8000?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    {
      icon: <FileText size={18} color="#A855F7" />,
      title: "Summarize my recent notes",
      bgColor: "rgba(168, 85, 247, 0.1)",
    },
    {
      icon: <Calendar size={18} color="#3B82F6" />,
      title: "Create a study schedule",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      icon: <BrainCircuit size={18} color="#A855F7" />,
      title: "Explain a complex topic",
      bgColor: "rgba(168, 85, 247, 0.1)",
    },
    {
      icon: <CheckCircle size={18} color="#3B82F6" />,
      title: "Generate practice questions",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
  ];

  // Theme matching the new screenshot
  const theme = {
    bg: "#0B1120",
    panelBg: "rgba(30, 41, 59, 0.4)",
    border: "rgba(255, 255, 255, 0.1)",
    text: "#F8FAFC",
    subtext: "#94A3B8",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
  };

  if (isHistoryLoading) {
    return (
      <div
        style={{
          height: "100vh",
          background: theme.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.text,
        }}
      >
        Loading Nexus...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "24px 40px",
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "0 0 4px 0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Sparkles color="#A855F7" size={24} /> Nexus AI
          </h1>
          <p style={{ margin: 0, color: theme.subtext, fontSize: "14px" }}>
            Your intelligent academic assistant.
          </p>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
          {/* Render all messages */}
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <ChatBubble message={msg} />

              {/* Insert Suggestions right after the FIRST welcome message ONLY if no other messages exist */}
              {index === 0 &&
                messages.length === 1 &&
                msg.text.includes("Hello! I'm Nexus") && (
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      overflowX: "auto",
                      padding: "10px 0 30px 48px",
                      scrollbarWidth: "none",
                    }}
                  >
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSend(item.title)}
                        style={{
                          background: theme.panelBg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: "12px",
                          padding: "16px 20px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          minWidth: "200px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          backdropFilter: "blur(10px)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(168, 85, 247, 0.5)";
                          e.currentTarget.style.background =
                            "rgba(30, 41, 59, 0.7)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.background = theme.panelBg;
                        }}
                      >
                        <div
                          style={{
                            background: item.bgColor,
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </div>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#E2E8F0",
                            lineHeight: "1.4",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </React.Fragment>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cpu size={18} color="#A855F7" />
              </div>
              <div
                style={{
                  padding: "14px 20px",
                  background: "rgba(30, 41, 59, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  borderTopLeftRadius: "4px",
                }}
              >
                <Loader2
                  size={18}
                  color="#A855F7"
                  style={{ animation: "spin 2s linear infinite" }}
                />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* BOTTOM INPUT BAR */}
      <div
        style={{ padding: "20px 40px", background: theme.bg, flexShrink: 0 }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            background: "rgba(15, 23, 42, 0.6)",
            border: `1px solid ${theme.border}`,
            borderRadius: "9999px",
            padding: "8px 12px 8px 20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Plus icon on the left */}
          <button
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: theme.subtext,
              padding: "0 8px 0 0",
            }}
          >
            <Plus size={22} />
          </button>

          <input
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "12px 8px",
              color: "white",
              outline: "none",
              fontSize: "15px",
            }}
            placeholder="Ask Nexus anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
          />

          {/* Gradient Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{
              background: input.trim() ? theme.gradient : "#334155",
              border: "none",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.3s ease",
              flexShrink: 0,
              opacity: input.trim() ? 1 : 0.5,
            }}
            onMouseOver={(e) => {
              if (input.trim()) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseOut={(e) => {
              if (input.trim()) e.currentTarget.style.opacity = "1";
            }}
          >
            <Send size={18} color="white" style={{ marginLeft: "2px" }} />
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default NexusAI;

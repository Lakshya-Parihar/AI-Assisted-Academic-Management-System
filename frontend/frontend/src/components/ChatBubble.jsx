import React from "react";
import { motion } from "framer-motion";
import { User, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatBubble = ({ message }) => {
  const isUser = message.role === "user";

  const rowStyle = {
    display: "flex",
    marginBottom: "1.5rem",
    width: "100%",
    justifyContent: isUser ? "flex-end" : "flex-start",
  };

  const avatarBaseStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  };

  const botAvatarStyle = {
    ...avatarBaseStyle,
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    marginRight: "12px",
  };

  const userAvatarStyle = {
    ...avatarBaseStyle,
    background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    marginLeft: "12px",
  };

  const bubbleBaseStyle = {
    maxWidth: "75%",
    padding: "14px 18px",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    position: "relative",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  };

  const botBubbleStyle = {
    ...bubbleBaseStyle,
    background: "rgba(30, 41, 59, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#e2e8f0",
    borderRadius: "12px",
    borderTopLeftRadius: "4px",
  };

  const userBubbleStyle = {
    ...bubbleBaseStyle,
    background:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.7), rgba(59, 130, 246, 0.7))",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    borderRadius: "12px",
    borderTopRightRadius: "4px",
  };

  const timeStyle = {
    fontSize: "0.7rem",
    opacity: 0.6,
    marginTop: "8px",
    textAlign: isUser ? "right" : "left",
    display: "block",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={rowStyle}
    >
      {!isUser && (
        <div style={botAvatarStyle}>
          <Cpu size={18} color="#0EA5E9" />
        </div>
      )}

      <div style={isUser ? userBubbleStyle : botBubbleStyle}>
        <div style={{ wordBreak: "break-word" }}>
          <ReactMarkdown>{message.text || ""}</ReactMarkdown>
        </div>
        <div style={timeStyle}>{message.time}</div>
      </div>

      {isUser && (
        <div style={userAvatarStyle}>
          <User size={18} color="#1e293b" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;

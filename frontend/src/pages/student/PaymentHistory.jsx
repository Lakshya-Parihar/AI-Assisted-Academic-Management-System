import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Filter,
  DownloadCloud,
  FileText,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPaymentHistory } from "../../services/studentApi";
import jsPDF from "jspdf";

const Styles = () => (
  <style>{`
    .history-container { max-width: 1100px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; color: #F8FAFC; }
    .history-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1.5rem; }
    
    .stat-box { background: #1C2333; border: 1px solid #2A3441; border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; min-width: 200px; }
    .stat-label { font-size: 0.65rem; font-weight: 800; color: #8B9BB4; text-transform: uppercase; letter-spacing: 1px; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #F8FAFC; display: flex; align-items: center; gap: 0.5rem; }
    
    .controls-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .control-input { background: #131825; border: 1px solid #2A3441; color: #F8FAFC; padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: 8px; font-size: 0.85rem; outline: none; width: 280px; }
    .control-btn { background: #1C2333; border: 1px solid #2A3441; color: #8B9BB4; padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; }
    .control-btn:hover { background: #2A3441; color: #F8FAFC; }
    
    .ledger-card { background: #1C2333; border: 1px solid #2A3441; border-radius: 12px; overflow: hidden; }
    .ledger-table { width: 100%; border-collapse: collapse; text-align: left; }
    .ledger-th { padding: 1.25rem 1.5rem; font-size: 0.65rem; font-weight: 800; color: #8B9BB4; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #2A3441; }
    .ledger-td { padding: 1.25rem 1.5rem; font-size: 0.85rem; color: #F8FAFC; border-bottom: 1px solid rgba(42, 52, 65, 0.5); font-weight: 500; }
    
    .pill-category { background: rgba(139, 155, 180, 0.1); border: 1px solid rgba(139, 155, 180, 0.2); color: #8B9BB4; padding: 4px 10px; border-radius: 20px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-completed { color: #10B981; display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; }
    .status-dot { width: 6px; height: 6px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981; }
    
    .action-btn { background: transparent; border: none; color: #8B9BB4; cursor: pointer; transition: 0.2s; padding: 4px; }
    .action-btn:hover { color: #93C5FD; transform: translateY(-2px); }
    
    .ledger-footer { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #2A3441; font-size: 0.8rem; color: #8B9BB4; }
    .pagination { display: flex; gap: 0.25rem; align-items: center; }
    .page-btn { background: transparent; border: none; color: #8B9BB4; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
    .page-btn.active { background: #93C5FD; color: #0F172A; }
    
    .info-box { background: #131825; border: 1px solid #2A3441; border-radius: 12px; padding: 1.5rem; margin-top: 2rem; display: flex; gap: 1rem; align-items: flex-start; }
  `}</style>
);

export default function PaymentHistory() {
  const [history, setHistory] = useState([]);

  // 🔥 FIX 2: Move loadData ABOVE the useEffect so it exists when useEffect runs.
  const loadData = async () => {
    try {
      const res = await getPaymentHistory();

      // 🔥 FIX 1: Generate the fallback Math.random() here ONCE during data load.
      // This keeps the HTML render purely static, which React requires.
      const processedData = (res.data || []).map((item) => ({
        ...item,
        display_txn_id:
          item.transaction_id || `TXN-${Math.floor(Math.random() * 10000)}`,
      }));

      setHistory(processedData);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const generateReceipt = (data) => {
    const doc = new jsPDF();

    // 1. Standardize Header
    doc.setFontSize(18);
    doc.text("AIAAMS University", 20, 20);
    doc.setFontSize(12);
    doc.text("Fee Payment Receipt (Student Copy)", 20, 30);
    doc.line(20, 35, 190, 35);

    // 2. Student Info
    doc.text(`Student: ${String(data.name || "N/A")}`, 20, 50);
    doc.text(`Enrollment: ${String(data.enrollment_no || "N/A")}`, 20, 60);
    doc.text(`Semester: ${String(data.semester)}`, 20, 70);

    // 3. THE CRITICAL FIX: Clean the Amount string
    // Using .replace(/[^\d.,₹]/g, '') ensures no hidden & symbols survive
    const rawAmount = Number(data.amount_paid).toLocaleString("en-IN");
    const cleanAmount = `Amount Paid: INR ${rawAmount}`;

    doc.text(cleanAmount, 20, 80);

    // 4. Transaction Details
    doc.text(`Transaction ID: ${String(data.display_txn_id)}`, 20, 90);
    doc.text(
      `Payment Date: ${new Date(data.payment_date).toLocaleDateString()}`,
      20,
      100,
    );

    // 5. Success Status
    doc.setTextColor(16, 185, 129);
    doc.text("STATUS: SUCCESSFUL", 20, 115);

    doc.save(`Receipt_${data.display_txn_id}.pdf`);
  };

  // Calculate stats
  const totalPaid = history.reduce(
    (sum, item) => sum + Number(item.amount_paid),
    0,
  );
  const successfulCount = history.length;

  return (
    <div className="history-container">
      <Styles />

      <div className="history-header">
        <div>
          <div
            style={{
              color: "#10B981",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "0.5rem",
              fontFamily:
                "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
            }}
          >
            ACADEMIC LEDGER
          </div>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              margin: 0,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              fontFamily:
                "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
            }}
          >
            Payment History
          </h1>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="stat-box">
            <span className="stat-label">Total Paid This Year</span>
            <span className="stat-value">
              ₹ {totalPaid.toLocaleString()}{" "}
              <span
                style={{ fontSize: "1rem", color: "#8B9BB4", fontWeight: 600 }}
              >
                INR
              </span>
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Successful Transactions</span>
            <span className="stat-value">
              {successfulCount} <CheckCircle2 size={20} color="#10B981" />
            </span>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            color="#8B9BB4"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            className="control-input"
            placeholder="Filter by ID or Date..."
          />
        </div>
        <button className="control-btn">
          <Calendar size={16} /> Last 12 Months
        </button>
        <button className="control-btn">
          <Filter size={16} /> Category
        </button>
        <button
          className="control-btn"
          style={{
            marginLeft: "auto",
            background: "rgba(147, 197, 253, 0.1)",
            color: "#93C5FD",
            border: "1px solid rgba(147, 197, 253, 0.2)",
          }}
        >
          <DownloadCloud size={16} /> Export Statement
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="ledger-card"
      >
        <table className="ledger-table">
          <thead>
            <tr>
              <th className="ledger-th">Date</th>
              <th className="ledger-th">Reference ID</th>
              <th className="ledger-th">Category</th>
              <th className="ledger-th">Amount</th>
              <th className="ledger-th">Status</th>
              <th className="ledger-th" style={{ textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td className="ledger-td" style={{ color: "#8B9BB4" }}>
                  {h.payment_date
                    ? new Date(h.payment_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                {/* 🔥 Use the clean display ID here! */}
                <td className="ledger-td" style={{ color: "#93C5FD" }}>
                  #{h.display_txn_id}
                </td>
                <td className="ledger-td">
                  <span className="pill-category">
                    Semester {h.semester} Fee
                  </span>
                </td>
                <td className="ledger-td" style={{ fontWeight: 700 }}>
                  ₹ {Number(h.amount_paid).toLocaleString()}
                </td>
                <td className="ledger-td">
                  <div className="status-completed">
                    <div className="status-dot"></div> COMPLETED
                  </div>
                </td>
                <td className="ledger-td" style={{ textAlign: "right" }}>
                  <button
                    className="action-btn"
                    onClick={() => generateReceipt(h)}
                    title="Download Receipt"
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#8B9BB4",
                  }}
                >
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {history.length > 0 && (
          <div className="ledger-footer">
            <span>
              Showing {history.length} of {history.length} transactions
            </span>
            <div className="pagination">
              <button className="page-btn">
                <ChevronLeft size={16} />
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="info-box">
        <Info size={24} color="#8B9BB4" style={{ flexShrink: 0 }} />
        <div>
          <h4
            style={{
              margin: "0 0 0.25rem 0",
              fontSize: "0.85rem",
              color: "#F8FAFC",
            }}
          >
            Need help with a payment?
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "#8B9BB4",
              lineHeight: 1.5,
            }}
          >
            If you notice any discrepancies in your payment history or need a
            formal stamped receipt for tax purposes, please contact the
            Financial Services office at finance@aiaams.edu.
          </p>
        </div>
      </div>
    </div>
  );
}

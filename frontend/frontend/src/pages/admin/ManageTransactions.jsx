import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  IndianRupee,
  Activity,
  CreditCard,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/adminApi";
import jsPDF from "jspdf";

const Styles = () => (
  <style>{`
    .page-container { max-width: 1200px; margin: 0 auto; width: 100%; padding-bottom: 4rem; }
    
    /* Table & Card Styles */
    .glass-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
    
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th { 
      padding: 1.25rem 1rem; 
      color: #64748b; 
      font-size: 0.75rem; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      text-align: left; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
    }
    td { 
      padding: 1rem; 
      color: #f8fafc; 
      font-size: 0.95rem; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.03); 
      vertical-align: middle; 
      transition: background 0.2s;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.01); }
    tr:last-child td { border-bottom: none; }

    /* Summary Cards */
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-box {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: 0.3s;
    }
    .summary-box:hover { transform: translateY(-5px); }

    .summary-icon {
      width: 64px; height: 64px; border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
    }

    /* Buttons */
    .export-btn {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 0.75rem;
      color: white;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      transition: all 0.3s ease;
      box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
    }
    .export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.6);
    }

    .receipt-btn {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      color: #10b981;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }
    .receipt-btn:hover {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .summary-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

export default function ManageTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_collected: 0,
    total_transactions: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await adminApi.get("/fees/transactions");
    setTransactions(res.data);

    const sumRes = await adminApi.get("/fees/summary");
    setSummary(sumRes.data);
  };

  // 🔹 Export CSV
  const exportCSV = () => {
    const headers = [
      "Student",
      "Enrollment",
      "Branch",
      "Semester",
      "Amount",
      "Payment Mode",
      "Transaction ID",
      "Date",
    ];

    const rows = transactions.map((t) => [
      t.student_name,
      t.enrollment_no,
      t.branch_name,
      t.semester,
      t.amount_paid,
      t.payment_method,
      t.transaction_id,
      new Date(t.payment_date).toLocaleDateString(),
    ]);

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fee_transactions.csv";
    a.click();
  };

  // 🔹 Receipt Generator
  const generateReceipt = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AAAMS University", 20, 20);

    doc.setFontSize(12);
    doc.text("Fee Payment Receipt (Admin Copy)", 20, 30);

    doc.line(20, 35, 190, 35);

    doc.text(`Student: ${data.student_name}`, 20, 50);
    doc.text(`Enrollment: ${data.enrollment_no}`, 20, 60);
    doc.text(`Branch: ${data.branch_name}`, 20, 70);
    doc.text(`Semester: ${data.semester}`, 20, 80);
    doc.text(
      `Amount Paid: RS ${Number(data.amount_paid).toLocaleString()}`,
      20,
      90
    );
    doc.text(`Payment Mode: ${data.payment_method}`, 20, 100);
    doc.text(`Transaction ID: ${data.transaction_id}`, 20, 110);
    doc.text(
      `Payment Date: ${new Date(
        data.payment_date
      ).toLocaleDateString()}`,
      20,
      120
    );

    doc.setTextColor(0, 150, 0);
    doc.text("STATUS: SUCCESSFUL", 20, 135);

    doc.save(`Receipt_${data.transaction_id}.pdf`);
  };

  return (
    <div className="page-container">
      <Styles />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.5rem",
        }}
      >
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

          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", letterSpacing: '-1px', margin: 0 }}>
            Transaction History
          </h2>
        </div>

        <button onClick={exportCSV} className="export-btn">
          <Download size={18} /> EXPORT CSV
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="summary-box" style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.05), #0f172a)', borderColor: 'rgba(16,185,129,0.15)' }}>
          <div className="summary-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <IndianRupee size={32} color="#10b981" />
          </div>
          <div>
            <p style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Total Fees Collected
            </p>
            <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 900, margin: 0 }}>
              ₹ {Number(summary.total_collected).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="summary-box" style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.05), #0f172a)', borderColor: 'rgba(99,102,241,0.15)' }}>
          <div className="summary-icon" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Activity size={32} color="#818cf8" />
          </div>
          <div>
            <p style={{ color: "#818cf8", fontSize: "0.8rem", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Total Transactions
            </p>
            <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 900, margin: 0 }}>
              {summary.total_transactions}
            </h3>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Academic Info</th>
                <th>Txn ID</th>
                <th>Amount</th>
                <th>Payment Info</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "#64748b" }}>
                      <CreditCard size={40} style={{ marginBottom: "1rem", opacity: 0.5, color: '#6366f1' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>No Transactions Found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="#818cf8"/>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'white' }}>{t.student_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{t.enrollment_no}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1' }}>{t.branch_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sem {t.semester}</div>
                    </td>
                    <td style={{ fontFamily: "monospace", color: "#64748b", fontSize: '0.85rem' }}>
                      {t.transaction_id}
                    </td>
                    <td>
                      <span style={{ 
                        background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)',
                        padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem' 
                      }}>
                        ₹ {Number(t.amount_paid).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ color: 'white', fontSize: '0.85rem' }}>{t.payment_method || "Online"}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(t.payment_date).toLocaleDateString()}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => generateReceipt(t)}
                          className="receipt-btn"
                          title="Download Receipt PDF"
                        >
                          <FileText size={16} /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
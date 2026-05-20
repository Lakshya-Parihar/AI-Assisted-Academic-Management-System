import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Megaphone,
  CreditCard,
  Landmark,
  Lock,
  CheckCircle,
} from "lucide-react";
import { getMyFees, payFees } from "../../services/studentApi";

const Styles = () => (
  <style>{`
    .fees-wrapper { max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; color: #F8FAFC; }
    
    /* Header Area */
    .header-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 2.2rem; font-weight: 700; margin: 0 0 0.5rem 0; letter-spacing: -1px; }
    .page-subtitle { color: #8B9BB4; font-size: 0.9rem; margin: 0; }
    
    .discount-alert { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 1rem 1.25rem; border-radius: 8px; display: flex; gap: 1rem; align-items: center; max-width: 400px; }
    .discount-icon { background: rgba(16, 185, 129, 0.2); padding: 8px; border-radius: 6px; color: #34D399; }
    
    /* Semester Tabs */
    .semester-tabs { display: flex; gap: 0.75rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem; }
    .sem-tab { background: #171D2B; border: 1px solid #2A3441; color: #8B9BB4; padding: 0.6rem 1.25rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; white-space: nowrap; }
    .sem-tab.active { background: rgba(92, 131, 244, 0.15); color: #7FA1FA; border-color: #5C83F4; }
    .sem-tab:hover:not(.active) { background: #1C2333; color: #F8FAFC; }

    /* Layout Grid */
    .dashboard-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; align-items: start; }
    @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

    /* Blue Balance Card */
    .balance-card { 
      background: linear-gradient(135deg, #7FA1FA 0%, #5C83F4 100%); 
      border-radius: 12px; padding: 2rem; position: relative; overflow: hidden; margin-bottom: 1.5rem; 
      box-shadow: 0 10px 30px rgba(92, 131, 244, 0.2);
    }
    .balance-card.paid { background: linear-gradient(135deg, #34D399 0%, #10B981 100%); box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
    .balance-card::after { content: ''; position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; border: 2px solid rgba(255,255,255,0.1); border-radius: 50%; }
    .balance-card::before { content: ''; position: absolute; bottom: -30%; left: 20%; width: 300px; height: 300px; border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; }
    
    .bc-label { color: rgba(15, 23, 42, 0.7); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; position: relative; z-index: 2; }
    .bc-amount { color: #0F172A; font-size: 3.5rem; font-weight: 800; letter-spacing: -2px; margin: 0 0 2rem 0; position: relative; z-index: 2; }
    .bc-footer { display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 2; }
    .bc-date-val { color: #0F172A; font-size: 1.2rem; font-weight: 700; margin-top: 0.25rem; }
    .btn-invoice { background: #0F172A; color: #F8FAFC; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-invoice:hover { background: #1E293B; }

    /* Fee Breakdown Table */
    .breakdown-card { background: #171D2B; border: 1px solid #2A3441; border-radius: 12px; padding: 1.5rem; }
    .breakdown-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .breakdown-title { font-size: 1.1rem; font-weight: 600; margin: 0; }
    .breakdown-label { color: #8B9BB4; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    
    .table-header { display: grid; grid-template-columns: 2fr 1fr 1fr; padding-bottom: 1rem; border-bottom: 1px solid #2A3441; margin-bottom: 1rem; }
    .th-item { color: #8B9BB4; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .th-right { text-align: right; }
    
    .tr-row { display: grid; grid-template-columns: 2fr 1fr 1fr; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(42, 52, 65, 0.5); }
    .tr-row:last-child { border-bottom: none; }
    .item-title { font-weight: 600; font-size: 0.95rem; margin: 0 0 0.25rem 0; color: #F8FAFC; }
    .item-desc { color: #8B9BB4; font-size: 0.75rem; margin: 0; }
    
    .pill { padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; }
    .pill-academic { background: rgba(59, 130, 246, 0.1); color: #93C5FD; }
    .pill-facility { background: rgba(139, 92, 246, 0.1); color: #C4B5FD; }
    .pill-tech { background: rgba(16, 185, 129, 0.1); color: #6EE7B7; }
    .pill-lifestyle { background: rgba(245, 158, 11, 0.1); color: #FCD34D; }

    .item-amount { text-align: right; font-weight: 700; font-family: monospace; font-size: 0.95rem; }

    /* Payment Widget */
    .payment-widget { background: #1C2333; border: 1px solid #2A3441; border-radius: 12px; padding: 1.5rem; }
    .pw-title { font-size: 1.2rem; font-weight: 600; margin: 0 0 0.5rem 0; }
    .pw-desc { color: #8B9BB4; font-size: 0.85rem; margin: 0 0 1.5rem 0; line-height: 1.5; }
    
    .method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .method-btn { background: #131825; border: 1px solid #2A3441; border-radius: 8px; padding: 1rem; display: flex; flexDirection: column; align-items: center; gap: 0.5rem; color: #8B9BB4; cursor: pointer; transition: 0.2s; }
    .method-btn.active { border-color: #60A5FA; color: #F8FAFC; background: rgba(96, 165, 250, 0.05); }
    .method-label { font-size: 0.85rem; font-weight: 600; }
    
    .input-wrapper { background: #131825; border: 1px solid #2A3441; border-radius: 8px; display: flex; align-items: center; padding: 0 1rem; margin-bottom: 1.5rem; }
    .currency-symbol { color: #8B9BB4; font-weight: 700; font-size: 1.2rem; }
    .amount-input { background: transparent; border: none; color: #F8FAFC; font-size: 1.5rem; font-weight: 700; width: 100%; padding: 1rem 0.5rem; outline: none; font-family: monospace; }
    
    .summary-box { border-top: 1px solid #2A3441; border-bottom: 1px solid #2A3441; padding: 1rem 0; margin-bottom: 1.5rem; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; color: #8B9BB4; }
    .summary-row.total { color: #F8FAFC; font-weight: 700; font-size: 0.95rem; margin-bottom: 0; margin-top: 1rem; }
    
    .btn-pay { background: linear-gradient(135deg, #A5C8FF 0%, #7A9DF8 100%); color: #0F172A; border: none; width: 100%; padding: 1rem; border-radius: 8px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-transform: uppercase; transition: 0.2s; }
    .btn-pay:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }
  `}</style>
);

export default function StudentFees() {
  const [allFees, setAllFees] = useState([]);
  const [activeFeeData, setActiveFeeData] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [method, setMethod] = useState("card");
  const navigate = useNavigate();

  // 🔥 FIX 2: loadFees is defined BEFORE useEffect
  const loadFees = async () => {
    try {
      const res = await getMyFees();

      if (res.data && res.data.fees) {
        const feesList = res.data.fees.sort((a, b) => a.semester - b.semester);
        setAllFees(feesList);

        const activeSem = res.data.activeSemester || feesList[0]?.semester;
        const activeRecord = feesList.find((f) => f.semester === activeSem);

        if (activeRecord) {
          // eslint-disable-next-line react-hooks/immutability
          handleSelectSemester(activeRecord);
        }
      }
    } catch (error) {
      console.error("Failed to load fees from database:", error);
      // Mock data completely removed here. Real errors will be properly logged.
    }
  };

  // 🔥 FIX 1: useEffect calls loadFees, but has an empty dependency array
  useEffect(() => {
    loadFees();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectSemester = (record) => {
    setActiveFeeData(record);
    const remaining =
      Number(record.semester_fees) - Number(record.amount_paid || 0);
    setPayAmount(remaining > 0 ? remaining.toString() : "");
  };

  const handlePay = async () => {
    if (!activeFeeData) return;

    const totalFee = Number(activeFeeData.semester_fees);
    const alreadyPaid = Number(activeFeeData.amount_paid || 0);
    const remaining = totalFee - alreadyPaid;
    const amountToPay = parseFloat(payAmount || 0);

    if (amountToPay <= 0 || isNaN(amountToPay))
      return alert("Please enter a valid amount.");
    if (amountToPay > remaining)
      return alert(`You only owe ₹${remaining.toLocaleString()}.`);

    try {
      await payFees(activeFeeData.id, { amount: amountToPay });
      alert(`Payment of ₹${amountToPay.toLocaleString()} Successful!`);
      loadFees(); // Reload data from DB
    } catch (error) {
      alert(error.response?.data?.error || "Payment failed. Please try again.");
    }
  };

  if (!activeFeeData)
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Loading financial ledger...
      </div>
    );

  // Real data calculations mapped directly to your database columns
  const totalFee = Number(activeFeeData.semester_fees);
  const paid = Number(activeFeeData.amount_paid || 0);
  const remaining = totalFee - paid;
  const isPaid = remaining <= 0 || activeFeeData.payment_status === "Paid";

  // Calculate Processing Fee (0.5% for visual accuracy to mockup)
  const numericInput = parseFloat(payAmount || 0);
  const processingFee = numericInput > 0 ? numericInput * 0.005 : 0;
  const totalCharge = numericInput + processingFee;

  // Dynamic visual breakdown based on the real semester_fees column
  const breakdown = [
    {
      title: "Tuition Fee",
      desc: "Full-time Academic Enrollment",
      category: "ACADEMIC",
      pill: "pill-academic",
      amount: totalFee * 0.68,
    },
    {
      title: "Laboratory Access",
      desc: "Specialized STEM Research Facilities",
      category: "FACILITY",
      pill: "pill-facility",
      amount: totalFee * 0.1,
    },
    {
      title: "Digital Resources",
      desc: "LMS Access, E-Library, Software Licenses",
      category: "TECH",
      pill: "pill-tech",
      amount: totalFee * 0.06,
    },
    {
      title: "Campus Amenities",
      desc: "Health Services, Recreation, Student Union",
      category: "LIFESTYLE",
      pill: "pill-lifestyle",
      amount: totalFee * 0.16,
    },
  ];

  return (
    <div className="fees-wrapper">
      <Styles />

      {/* HEADER */}
      <div className="header-container">
        <div>
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
          >Fees Management</h1>
          <p className="page-subtitle">
            Academic Year 2025/2026 • Ledger Overview
          </p>
        </div>

        <div className="discount-alert">
          <div className="discount-icon">
            <Megaphone size={20} />
          </div>
          <div>
            <div
              style={{
                color: "#34D399",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              DISCOUNT ALERT
            </div>
            <div style={{ color: "#D1FAE5", fontSize: "0.85rem" }}>
              Early Bird Discount Available if paid by end of week.
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTER TABS */}
      <div className="semester-tabs">
        {allFees.map((fee) => (
          <button
            key={fee.id}
            className={`sem-tab ${activeFeeData.id === fee.id ? "active" : ""}`}
            onClick={() => handleSelectSemester(fee)}
          >
            Semester {fee.semester}
            {fee.payment_status === "Paid" && (
              <CheckCircle size={14} color="#10B981" />
            )}
            {fee.payment_status === "Partial" && (
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#F59E0B",
                  borderRadius: "50%",
                }}
              ></span>
            )}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div>
          {/* BALANCE CARD */}
          <motion.div
            key={activeFeeData.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`balance-card ${isPaid ? "paid" : ""}`}
          >
            <div className="bc-label">TOTAL OUTSTANDING BALANCE</div>
            <h2 className="bc-amount">
              ₹{" "}
              {remaining.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
            <div className="bc-footer">
              <div>
                <div className="bc-label">STATUS</div>
                <div className="bc-date-val">
                  {isPaid
                    ? "Fully Cleared"
                    : activeFeeData.payment_status === "Partial"
                      ? "Partially Paid"
                      : "Pending Payment"}
                </div>
              </div>
              <button
                className="btn-invoice"
                onClick={() => navigate("fees-history")}
              >
                View Full Invoice
              </button>
            </div>
          </motion.div>

          {/* FEE BREAKDOWN */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="breakdown-card"
          >
            <div className="breakdown-header">
              <h3 className="breakdown-title">
                Fee Breakdown (Sem {activeFeeData.semester})
              </h3>
              <span className="breakdown-label">SEMESTRAL LEDGER</span>
            </div>

            <div className="table-header">
              <span className="th-item">ITEM DESCRIPTION</span>
              <span className="th-item">CATEGORY</span>
              <span className="th-item th-right">AMOUNT</span>
            </div>

            {breakdown.map((item, idx) => (
              <div className="tr-row" key={idx}>
                <div>
                  <h4 className="item-title">{item.title}</h4>
                  <p className="item-desc">{item.desc}</p>
                </div>
                <div>
                  <div className={`pill ${item.pill}`}>{item.category}</div>
                </div>
                <div className="item-amount">
                  ₹{" "}
                  {item.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: WIDGET */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="payment-widget"
        >
          <h3 className="pw-title">Make a Payment</h3>
          <p className="pw-desc">
            Securely clear your dues using our encrypted gateway.
          </p>

          <div
            className="bc-label"
            style={{ color: "#8B9BB4", marginBottom: "0.75rem" }}
          >
            SELECT METHOD
          </div>
          <div className="method-grid">
            <div
              className={`method-btn ${method === "card" ? "active" : ""}`}
              onClick={() => setMethod("card")}
            >
              <CreditCard size={24} />
              <span className="method-label">Card</span>
            </div>
            <div
              className={`method-btn ${method === "transfer" ? "active" : ""}`}
              onClick={() => setMethod("transfer")}
            >
              <Landmark size={24} />
              <span className="method-label">Transfer</span>
            </div>
          </div>

          <div
            className="bc-label"
            style={{ color: "#8B9BB4", marginBottom: "0.75rem" }}
          >
            PAYMENT AMOUNT
          </div>
          <div className="input-wrapper">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              className="amount-input"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.00"
              disabled={isPaid}
            />
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span>Already Paid</span>
              <span style={{ fontFamily: "monospace", color: "#10B981" }}>
                ₹ {paid.toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Processing Fee (0.5%)</span>
              <span style={{ fontFamily: "monospace" }}>
                ₹ {processingFee.toFixed(2)}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total Charge</span>
              <span style={{ fontFamily: "monospace" }}>
                ₹ {totalCharge.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="btn-pay"
            onClick={handlePay}
            disabled={isPaid || numericInput <= 0}
            style={isPaid ? { background: "#1E293B", color: "#8B9BB4" } : {}}
          >
            <Lock size={16} />{" "}
            {isPaid ? "SEMESTER CLEARED" : "PROCEED TO SECURE PAYMENT"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

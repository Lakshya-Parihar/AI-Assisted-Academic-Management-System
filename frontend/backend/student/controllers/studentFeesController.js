import db from "../config/db.js";

// GET STUDENT CURRENT FEES
// GET STUDENT CURRENT FEES
export const getMyFees = async (req, res) => {
  try {
    const studentId = req.user.student_id;

    if (!studentId) {
      return res.status(401).json({ error: "Student not authenticated" });
    }

    // 1️⃣ Get student + branch details
    const [[data]] = await db.query(
      `
      SELECT s.semester,
             b.total_sems,
             bf.total_course_fees
      FROM students s
      JOIN branches b ON s.branch_id = b.id
      JOIN branch_fees bf ON bf.branch_id = b.id
      WHERE s.id = ?
      `,
      [studentId]
    );

    if (!data) {
      return res.status(400).json({
        error: "Fees not configured for this branch",
      });
    }

    const activeSemester = data.semester;
    const totalSems = data.total_sems;
    const semesterFees = data.total_course_fees / totalSems;

    // 2️⃣ Ensure all semester records exist
    for (let sem = 1; sem <= totalSems; sem++) {
      const [existing] = await db.query(
        `SELECT id FROM student_fee_payments 
         WHERE student_id=? AND semester=?`,
        [studentId, sem]
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO student_fee_payments
           (student_id, semester, semester_fees, amount_paid, payment_status)
           VALUES (?, ?, ?, 0.00, 'Pending')`,
          [studentId, sem, semesterFees]
        );
      }
    }

    // 3️⃣ Get only CURRENT + NEXT semester
    const [fees] = await db.query(
      `
      SELECT *
      FROM student_fee_payments
      WHERE student_id = ?
      AND (semester = ? OR semester = ?)
      ORDER BY semester ASC
      `,
      [studentId, activeSemester, activeSemester + 1]
    );

    // 4️⃣ Send structured response
    res.json({
      activeSemester,
      fees,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// PAY FEES (PROCESS PARTIAL OR FULL PAYMENTS)
export const payFees = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Get semester record
    const [[record]] = await db.query(
      `SELECT * FROM student_fee_payments 
       WHERE id=? AND student_id=?`,
      [id, studentId]
    );

    if (!record) {
      return res.status(404).json({ error: "Semester record not found" });
    }

    // ✅ Get student's ACTIVE academic semester
    const [[student]] = await db.query(
      `SELECT semester FROM students WHERE id=?`,
      [studentId]
    );

    const activeSemester = student.semester;

    // 🔒 RULE 1: Cannot pay future semester (not promoted yet)
    if (record.semester > activeSemester) {
      return res.status(400).json({
        error: "You are not promoted to this semester yet.",
      });
    }

    // 🔒 RULE 2: Must complete previous semester first
    if (record.semester > 1) {
      const [[previous]] = await db.query(
        `SELECT payment_status FROM student_fee_payments
         WHERE student_id=? AND semester=?`,
        [studentId, record.semester - 1]
      );

      if (!previous || previous.payment_status !== "Paid") {
        return res.status(400).json({
          error:
            "Complete previous semester before paying this semester.",
        });
      }
    }

    const newPaid =
      Number(record.amount_paid) + Number(amount);

    if (newPaid > Number(record.semester_fees)) {
      return res.status(400).json({
        error: "Overpayment not allowed",
      });
    }

    const status =
      newPaid === Number(record.semester_fees)
        ? "Paid"
        : "Partial";

    const txn = "AMS" + Math.floor(Math.random() * 1000000);

    // ✅ Insert individual transaction (important for receipts)
    await db.query(
      `INSERT INTO fee_transactions
       (student_id, semester, semester_fee_id, amount_paid, payment_method, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        record.semester,
        record.id,
        amount,
        "Online",
        txn,
      ]
    );

    // ✅ Update semester summary
    await db.query(
      `UPDATE student_fee_payments
       SET amount_paid=?, payment_status=?
       WHERE id=?`,
      [newPaid, status, id]
    );

    res.json({
      message: "Payment Successful",
      transaction_id: txn,
      status,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET STUDENT PAYMENT HISTORY
export const getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user.student_id;

    const [rows] = await db.query(
      `
      SELECT 
        ft.id,
        ft.student_id,
        ft.semester,
        ft.amount_paid,
        ft.payment_method,
        ft.transaction_id,
        ft.payment_date,
        
        s.name,
        s.enrollment_no,
        
        b.branch_name
        
      FROM fee_transactions ft
      JOIN students s ON ft.student_id = s.id
      JOIN branches b ON s.branch_id = b.id
      
      WHERE ft.student_id = ?
      ORDER BY ft.payment_date DESC
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
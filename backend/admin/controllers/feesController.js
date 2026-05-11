import db from "../config/db.js";

export const setBranchFees = async (req,res)=>{
  try{
    const { branch_id, total_course_fees } = req.body;

    // Check if branch already has fees
    const [existing] = await db.query(
      "SELECT id FROM branch_fees WHERE branch_id=?",
      [branch_id]
    );

    if(existing.length > 0){
      // 🚫 Don't allow duplicate insert
      return res.status(400).json({
        message:"Fees already exist for this branch. Update from Manage Fees."
      });
    }

    // Insert only if not exists
    await db.query(
      `INSERT INTO branch_fees(branch_id,total_course_fees)
       VALUES(?,?)`,
      [branch_id,total_course_fees]
    );

    res.json({message:"Fees Added Successfully"});

  }catch(err){
    res.status(500).json({error:err.message});
  }
};

// 🔥 GET ALL BRANCH FEES WITH BRANCH NAME
export const getBranchFees = async (req,res)=>{
  try{
    const [rows] = await db.query(`
      SELECT bf.id,
             bf.branch_id,
             bf.total_course_fees,
             b.branch_name,
             b.total_sems
      FROM branch_fees bf
      JOIN branches b ON bf.branch_id = b.id
      ORDER BY b.branch_name ASC
    `);

    res.json(rows);
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

// 🔥 UPDATE FEES
export const updateBranchFees = async (req,res)=>{
  try{
    const { id } = req.params;
    const { total_course_fees } = req.body;

    await db.query(
      `UPDATE branch_fees
       SET total_course_fees=?
       WHERE id=?`,
      [total_course_fees,id]
    );

    res.json({message:"Fees updated successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

export const deleteBranchFees = async (req,res)=>{
  try{
    const { id } = req.params;

    await db.query(
      "DELETE FROM branch_fees WHERE id=?",
      [id]
    );

    res.json({message:"Fees deleted successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

export const getFeeTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ft.id,
        s.name AS student_name,
        s.enrollment_no,
        b.branch_name,
        ft.semester,
        ft.amount_paid,
        ft.payment_method,
        ft.transaction_id,
        ft.payment_date
      FROM fee_transactions ft
      JOIN students s ON s.id = ft.student_id
      JOIN branches b ON b.id = s.branch_id
      ORDER BY ft.payment_date DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getFeeSummary = async (req, res) => {
  try {
    const [[total]] = await db.query(`
      SELECT SUM(amount_paid) AS total_collected
      FROM fee_transactions
    `);

    const [[count]] = await db.query(`
      SELECT COUNT(*) AS total_transactions
      FROM fee_transactions
    `);

    res.json({
      total_collected: total.total_collected || 0,
      total_transactions: count.total_transactions
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeesSummaryAdmin = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        SUM(amount_paid) AS collected,
        SUM(semester_fees) AS total,
        (SUM(semester_fees) - SUM(amount_paid)) AS pending
      FROM student_fee_payments
    `);

    const collected = result[0].collected || 0;
    const total = result[0].total || 0;
    const pending = result[0].pending || 0;

    const percentage = total > 0 
      ? Math.round((collected / total) * 100) 
      : 0;

    res.json({
      collected,
      pending,
      total,
      percentage,
    });
  } catch (error) {
    console.error("Fees Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch fees summary" });
  }
};
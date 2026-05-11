import db from "../config/db.js";

// 1. Get Top-Level Stats
export const getMaterialStats = async (req, res) => {
  try {
    const [fileCount] = await db.query(
      "SELECT COUNT(*) as total FROM course_materials",
    );
    const [downloadCount] = await db.query(
      "SELECT SUM(downloads) as total_downloads FROM course_materials",
    );

    res.json({
      totalFiles: fileCount[0].total || 0,
      totalDownloads: downloadCount[0].total_downloads || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// 2. Get All Materials with Course Info
export const getAllMaterials = async (req, res) => {
  try {
    const branchId = req.user.branch_id;

    const [materials] = await db.query(
      `
      SELECT cm.*, c.course_code, c.course_name 
      FROM course_materials cm
      JOIN courses c ON cm.course_id = c.course_id
      WHERE c.department_id = ?
      ORDER BY cm.uploaded_at DESC
    `,
      [branchId],
    );

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

// 3. Upload New Material (Global)
export const uploadGlobalMaterial = async (req, res) => {
  try {
    const { course_id } = req.body;
        const branchId = req.user.branch_id;

    // 🔥 Check if course belongs to faculty department
    const [[course]] = await db.query(
      "SELECT * FROM courses WHERE course_id = ? AND department_id = ?",
      [course_id, branchId],
    );

    if (!course) {
      return res.status(403).json({ error: "Unauthorized course access" });
    }

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = req.file.path.replace(/\\/g, "/");

    await db.query(
      `INSERT INTO course_materials (course_id, file_name, file_url, downloads) 
       VALUES (?, ?, ?, 0)`,
      [course_id, req.file.originalname, fileUrl],
    );

    res.json({ message: "Material uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

// 4. Increment Download Count
export const trackDownload = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE course_materials SET downloads = downloads + 1 WHERE id = ?",
      [id],
    );
    res.json({ message: "Download tracked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to track download" });
  }
};

// 5. Delete Material
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
        const branchId = req.user.branch_id;
;

    const [[material]] = await db.query(
      `
      SELECT cm.* 
      FROM course_materials cm
      JOIN courses c ON cm.course_id = c.course_id
      WHERE cm.id = ? AND c.department_id = ?
    `,
      [id, branchId],
    );

    if (!material) {
      return res.status(403).json({ error: "Unauthorized delete" });
    }

    await db.query("DELETE FROM course_materials WHERE id = ?", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

import db from "../config/db.js"; // This is the crucial import that was missing

export const postCircular = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    // Fallback logic for the publisher name to prevent NULL constraint errors
    const facultyName =
      req.user?.full_name || req.faculty?.full_name || "Admin/Faculty";

    const ref_id = `AIA-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const published_date = new Date().toISOString().split("T")[0];

    let attachment_urls = null;
    if (req.files && req.files.length > 0) {
      const paths = req.files.map((file) => file.path.replace(/\\/g, "/"));
      // Ensure this is saved as a plain string if your DB doesn't support JSON types
      attachment_urls = JSON.stringify(paths);
    }

    const query = `
        INSERT INTO circulars (title, content, category, priority, publisher, ref_id, published_date, attachment_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Perform the database insert
    await db.query(query, [
      title || "Untitled", // Fallback for title
      content || "", // Fallback for content
      category || "Academics",
      priority || "Normal",
      facultyName,
      ref_id,
      published_date,
      attachment_urls,
    ]);

    // Send the response immediately so the frontend stops loading
    res.status(201).json({ message: "Circular published successfully!" });

    // Handle the email in the background
    if (priority === "Urgent") {
      try {
        const [students] = await db.query(
          "SELECT email FROM students WHERE email IS NOT NULL",
        );
        const studentEmails = students.map((s) => s.email);
        if (studentEmails.length > 0) {
          // sendEmail logic...
        }
      } catch (e) {
        console.error("Background email failed:", e.message);
      }
    }
  } catch (error) {
    // Check your terminal where the server is running to see the EXACT SQL error
    console.error("DATABASE ERROR:", error.sqlMessage || error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error during database insertion." });
  }
};

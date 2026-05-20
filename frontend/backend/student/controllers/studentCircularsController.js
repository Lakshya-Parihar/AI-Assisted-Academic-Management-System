import db from "../config/db.js";

export const getCirculars = async (req, res) => {
  try {
    // Fetch all circulars sorted by newest first
    const [circulars] = await db.query(
      `SELECT * FROM circulars ORDER BY published_date DESC, created_at DESC`,
    );

    // Calculate statistics for the student dashboard widgets
    const currentMonth = new Date().getMonth() + 1;
    const totalMonth = circulars.filter((c) => {
      const cMonth = new Date(c.published_date).getMonth() + 1;
      return cMonth === currentMonth;
    }).length;

    const unreadUrgent = circulars.filter(
      (c) => c.priority === "Urgent",
    ).length;

    // FIX: Parse the JSON attachment URLs into clean strings for the frontend
    const processedCirculars = circulars.map((c) => {
      let cleanUrl = c.attachment_url;

      if (cleanUrl && typeof cleanUrl === "string") {
        try {
          // Convert '["uploads/file.png"]' back into an array
          const parsed = JSON.parse(cleanUrl);

          // Extract the first file path from the array so the frontend gets a clean string
          cleanUrl =
            Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : cleanUrl;
        } catch (e) {
          // If it fails to parse, it's likely already a normal string, so leave it alone
        }
      }

      return {
        ...c,
        attachment_url: cleanUrl,
      };
    });

    // Return the cleaned circulars
    res.json({
      stats: { total_month: totalMonth, unread_urgent: unreadUrgent },
      circulars: processedCirculars,
    });
  } catch (error) {
    console.error("Error fetching circulars:", error);
    res.status(500).json({ error: "Failed to fetch circulars" });
  }
};

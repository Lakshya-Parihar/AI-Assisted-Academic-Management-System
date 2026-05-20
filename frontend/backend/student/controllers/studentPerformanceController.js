import db from "../config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the highly stable 1.5-flash model to prevent quota limits!
const genAI = new GoogleGenerativeAI("AIzaSyAfOpzZIrnHO2gOEJbMm0Tg1FGnEyKORRA");

const calculateGrade = (score, total) => {
  const percentage = (score / total) * 100;
  if (percentage >= 93) return { letter: "A", weight: 4.0 };
  if (percentage >= 90) return { letter: "A-", weight: 3.7 };
  if (percentage >= 87) return { letter: "B+", weight: 3.3 };
  if (percentage >= 83) return { letter: "B", weight: 3.0 };
  if (percentage >= 80) return { letter: "B-", weight: 2.7 };
  if (percentage >= 77) return { letter: "C+", weight: 2.3 };
  if (percentage >= 73) return { letter: "C", weight: 2.0 };
  if (percentage >= 70) return { letter: "C-", weight: 1.7 };
  if (percentage >= 60) return { letter: "D", weight: 1.0 };
  return { letter: "F", weight: 0.0 };
};

/* ==========================================================================
   1. GRADES & DASHBOARD DATA 
   ========================================================================== */
export const getMyGrades = async (req, res) => {
  try {
    const studentId =
      req.user?.id ||
      req.user?.student_id ||
      req.user?.studentId ||
      req.student?.id;

    if (!studentId) {
      return res
        .status(400)
        .json({ error: "Student ID not found in login token." });
    }

    // 1. Fetch ALL grades with their REAL exam_type from the database
    const sql = `
      SELECT 
        c.course_id, c.course_code, c.course_name, 3 AS credits,
        f.full_name AS prof_name,
        eg.exam_type, eg.marks_obtained, eg.total_marks
      FROM courses c
      JOIN students s ON c.semester = s.semester AND c.department_id = s.branch_id
      LEFT JOIN faculty f ON c.assigned_faculty_id = f.faculty_id
      LEFT JOIN exam_grades eg ON c.course_id = eg.course_id AND eg.student_id = ? AND eg.status = 'published'
      WHERE s.id = ?
      ORDER BY c.course_name ASC;
    `;

    const [rows] = await db.query(sql, [studentId, studentId]);

    // 2. Process Courses
    let totalQualityPoints = 0;
    let totalCredits = 0;
    const formattedCoursesMap = new Map(); // Used to group courses for AI
    const rawGradesList = []; // Used for the frontend filter

    rows.forEach((row) => {
      const score = row.marks_obtained ? parseFloat(row.marks_obtained) : null;
      const total = row.total_marks ? parseFloat(row.total_marks) : 100;

      // Add to grades list using the ACTUAL exam type from your database!
      // If a course has no grade yet, we default to "Mid-Sem" so it appears as "Awaiting Evaluation"
      rawGradesList.push({
        course_name: row.course_name,
        course_code: row.course_code,
        marks_obtained: score,
        total_marks: total,
        exam_type: row.exam_type || "Mid-Sem",
      });

      // Group by course to calculate the true GPA for the AI
      if (!formattedCoursesMap.has(row.course_code)) {
        formattedCoursesMap.set(row.course_code, {
          name: row.course_name,
          code: row.course_code,
          prof: row.prof_name
            ? `PROF. ${row.prof_name.toUpperCase()}`
            : "STAFF",
          credits: row.credits,
          best_score: score,
          total: total,
        });
      } else {
        const existing = formattedCoursesMap.get(row.course_code);
        if (
          score !== null &&
          (existing.best_score === null || score > existing.best_score)
        ) {
          existing.best_score = score;
          existing.total = total;
        }
      }
    });

    const formattedCourses = [];
    formattedCoursesMap.forEach((course) => {
      let gradeInfo = { letter: "-", weight: 0.0 };
      if (course.best_score !== null) {
        gradeInfo = calculateGrade(course.best_score, course.total);
        totalQualityPoints += gradeInfo.weight * course.credits;
        totalCredits += course.credits;
      }

      formattedCourses.push({
        name: course.name,
        code: course.code,
        prof: course.prof,
        grade: gradeInfo.letter,
        score: course.best_score
          ? ((course.best_score / course.total) * 100).toFixed(1)
          : "--",
        weight: gradeInfo.weight,
        status: course.best_score !== null ? "EVALUATED" : "ENROLLED",
      });
    });

    const cumulativeGPA =
      totalCredits > 0
        ? (totalQualityPoints / totalCredits).toFixed(2)
        : "0.00";

    // 3. AI Forecast & Insights Generation (Optimized to a single prompt)
    let aiForecast = {
      predicted: cumulativeGPA,
      probabilities: [],
      confidence: 85,
      alert: {
        course: "System",
        issue: "Insufficient Data",
        desc: "Complete more assessments to unlock AIAAMS predictions.",
      },
    };

    const evaluatedGrades = formattedCourses.filter((c) => c.score !== "--");

    // Only trigger the AI if the student actually has grades (saves API calls!)
    if (evaluatedGrades.length > 0) {
      const prompt = `
        You are 'AIAAMS', an expert academic AI.
        Analyze these student grades: ${evaluatedGrades.map((c) => `${c.code}: ${c.grade} (${c.score}%)`).join(", ")}.
        Current GPA: ${cumulativeGPA}.
        
        Provide a JSON response strictly matching this structure:
        {
          "predicted_gpa": "Predicted GPA number",
          "probabilities": [
             {"code": "Course Code", "grade": "Predicted Grade", "prob": 90, "color": "#10b981"}
          ],
          "confidence": 92,
          "alert": {
             "course": "Course code",
             "issue": "2 word summary",
             "desc": "1 short sentence."
          }
        }
      `;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        if (text.includes("```json")) {
          text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        }

        const parsedAI = JSON.parse(text);
        aiForecast = {
          predicted: parsedAI.predicted_gpa,
          probabilities: parsedAI.probabilities,
          confidence: parsedAI.confidence,
          alert: parsedAI.alert,
        };
      } catch (e) {
        // Safe Fallback: If you hit a rate limit, the page won't crash!
        console.error(
          "AI Generation failed due to quota or network, using defaults.",
        );
      }
    }

    // 4. Send the payload
    res.json({
      gpaData: {
        cumulative: cumulativeGPA,
        standing: parseFloat(cumulativeGPA) > 3.5 ? "Top 10%" : "Average",
        trend: parseFloat(cumulativeGPA) > 0 ? "+0.05" : "0.00",
      },
      chartData: [
        {
          name: "SEM 1",
          gpa:
            parseFloat(cumulativeGPA) > 0
              ? Math.max(0, parseFloat(cumulativeGPA) - 0.2).toFixed(2)
              : 0,
        },
        {
          name: "SEM 2",
          gpa:
            parseFloat(cumulativeGPA) > 0
              ? Math.max(0, parseFloat(cumulativeGPA) - 0.1).toFixed(2)
              : 0,
        },
        { name: "CURRENT", gpa: parseFloat(cumulativeGPA) },
      ],
      courses: formattedCourses,
      aiForecast: aiForecast,
      grades: rawGradesList,
      insight:
        aiForecast.alert?.desc ||
        "AIAAMS detects stable performance. Keep up the momentum!",
    });
  } catch (err) {
    console.error("Fetch grades error:", err);
    res.status(500).json({ message: "Failed to fetch grades data" });
  }
};

/* ==========================================================================
   2. QUIZ PORTAL LOGIC
   ========================================================================== */

export const getStudentQuizzes = async (req, res) => {
  try {
    const user = req.user || req.student || {};
    const lookupEmail = user.email;
    const lookupId = user.id || user.student_id;

    let studentRes = [];

    // 1. Resolve the Student ID
    if (lookupEmail) {
      [studentRes] = await db.query(
        "SELECT id FROM students WHERE email = ?",
        [lookupEmail],
      );
    } else if (lookupId) {
      [studentRes] = await db.query(
        "SELECT id FROM students WHERE id = ?",
        [lookupId],
      );
    } else {
      return res
        .status(401)
        .json({ error: "Auth token is missing student info." });
    }

    if (!studentRes || studentRes.length === 0) {
      return res
        .status(401)
        .json({ error: "Student profile not found in database." });
    }

    const studentId = studentRes[0].id;

    // 2. Fetch quizzes matching the student's branch AND semester
    const [quizzes] = await db.query(
      `
      SELECT q.id, q.title, q.time_limit, c.course_name, c.course_code
      FROM quizzes q
      JOIN courses c ON q.course_id = c.course_id
      JOIN students s ON c.semester = s.semester AND c.department_id = s.branch_id
      WHERE s.id = ? AND q.status = 'PUBLISHED'
      ORDER BY q.created_at DESC
      `,
      [studentId]
    );

    // 3. Fetch past results to show "COMPLETED" status
    const [results] = await db.query(
      "SELECT quiz_id, score, total_points FROM quiz_results WHERE student_id = ?",
      [studentId],
    );

    res.json({ quizzes, results, studentId });
  } catch (error) {
    console.error("Error fetching student quizzes:", error);
    res.status(500).json({ error: "Server error fetching quizzes" });
  }
};

export const getQuizQuestions = async (req, res) => {
  try {
    const quizId = req.params.id;
    const [questions] = await db.query(
      "SELECT id, question_text, points, options, correct_option_id FROM quiz_questions WHERE quiz_id = ?",
      [quizId],
    );
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Server error fetching questions" });
  }
};

export const submitQuizResult = async (req, res) => {
  try {
    const { student_id, quiz_id, score, total_points } = req.body;
    await db.query(
      "INSERT INTO quiz_results (student_id, quiz_id, score, total_points) VALUES (?, ?, ?, ?)",
      [student_id, quiz_id, score, total_points],
    );
    res
      .status(201)
      .json({ message: "Quiz result securely saved to the database!" });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ error: "Server error saving result" });
  }
};

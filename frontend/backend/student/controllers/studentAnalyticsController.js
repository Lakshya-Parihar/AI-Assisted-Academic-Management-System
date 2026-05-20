import db from '../config/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Initialize Gemini (Ensure your .env has GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getNexusInsights = async (req, res) => {
    try {
        // req.user.id comes from your verifyToken middleware!
        const studentId = req.user.id; 
        
        // 1. Fetch the student's grades to provide context to the AI
        const [grades] = await db.query(`
            SELECT c.course_name, eg.marks_obtained, eg.total_marks 
            FROM exam_grades eg 
            JOIN courses c ON eg.course_id = c.course_id 
            WHERE eg.student_id = ?
        `, [studentId]);

        // 2. The prompt is strictly formatted so the React frontend can split it into the two cards
        const prompt = `
            You are Nexus AI, a highly intelligent academic advisor for the AIAAMS system. 
            Analyze these student grades: ${JSON.stringify(grades)}
            
            Provide your response in exactly two sections:
            "Performance Prediction": [Write 1 paragraph predicting their final trajectory if they continue at this rate]
            "Improvement Suggestions": [Write 1 paragraph with 2 specific, actionable study tips based strictly on their weakest subject]
        `;

        // 3. Call the currently active Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        
        // 4. Send the text back to the React tab
        res.json({ ai_analysis: result.response.text() });

    } catch (error) {
        console.error("Nexus Analytics Error:", error);
        res.status(500).json({ error: "Nexus AI is currently offline" });
    }
};
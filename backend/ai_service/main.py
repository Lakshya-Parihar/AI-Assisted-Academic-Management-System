import os
import mysql.connector
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # <-- Expanded origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- DATABASE CONNECTION ---
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # Default XAMPP user
        password="",  # Default XAMPP password
        database="ams_db",  # <-- FIXED: Was "AMS" but your database is "ams_db"
    )


# Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# --- MODELS ---
# Updated to accept student_id
class ChatRequest(BaseModel):
    student_id: int
    message: str


class ChatResponse(BaseModel):
    reply: str


class HistoryRequest(BaseModel):
    student_id: int


class MessageItem(BaseModel):
    role: str
    text: str
    time: str


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(data: ChatRequest):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch previous history to give Gemini context
        sql = """
            SELECT role, message as text 
            FROM chat_history 
            WHERE student_id = %s 
            ORDER BY timestamp ASC 
            LIMIT 20
        """
        cursor.execute(sql, (data.student_id,))
        history_rows = cursor.fetchall()

        # Format history for Gemini
        contents = []
        
        # System Instruction
        contents.append({
            "role": "user",
            "parts": [{"text": "You are Nexus AI, an intelligent and highly helpful academic assistant for college students. Keep your answers formatting clean, encouraging, and academically focused."}]
        })

        for row in history_rows:
            # Gemini roles: "user" or "model"
            g_role = "model" if row["role"] == "bot" else "user"
            contents.append({
                "role": g_role,
                "parts": [{"text": row["text"]}]
            })

        # Add current message
        contents.append({
            "role": "user",
            "parts": [{"text": data.message}]
        })

        # Call Gemini using the new SDK syntax
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents
        )
        
        reply_text = response.text

        # --- SAVE TO DATABASE ---
        insert_sql = """
            INSERT INTO chat_history (student_id, role, message) 
            VALUES (%s, %s, %s)
        """
        
        # Save User Message
        cursor.execute(insert_sql, (data.student_id, "user", data.message))
        # Save Bot Message
        cursor.execute(insert_sql, (data.student_id, "bot", reply_text))

        conn.commit()
        cursor.close()
        conn.close()

        return {"reply": reply_text}

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        raise HTTPException(status_code=500, detail="Database Connection Error")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/history", response_model=List[MessageItem])
def get_chat_history(data: HistoryRequest):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch formatted history
        sql = """
            SELECT 
                role, 
                message as text, 
                DATE_FORMAT(timestamp, '%h:%i %p') as time 
            FROM chat_history 
            WHERE student_id = %s 
            ORDER BY timestamp ASC 
            LIMIT 50
        """
        cursor.execute(sql, (data.student_id,))
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))
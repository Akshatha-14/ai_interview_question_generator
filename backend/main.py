from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from groq import Groq
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise Exception("GROQ_API_KEY not found in .env file")

# Initialize Groq Client
client = Groq(api_key=api_key)



# Request Model
class InterviewRequest(BaseModel):
    skill: str = Field(..., min_length=1)
    num_questions: int = Field(..., gt=0, le=20)

# Home Route
@app.get("/")
def home():
    return {
        "message": "AI Interview Question Generator is running"
    }

# Generate Questions Route
@app.post("/generate")
def generate_questions(request: InterviewRequest):

    prompt = f"""
    Generate {request.num_questions} interview questions for {request.skill}.

    Rules:
    - Questions should be suitable for technical interviews.
    - Return only the questions.
    - One question per line.
    """

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        output = response.choices[0].message.content

        questions = [
            q.strip()
            for q in output.split("\n")
            if q.strip()
        ]

        return {
            "skill": request.skill,
            "questions": questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
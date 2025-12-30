from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import tempfile
import json
from pydantic import BaseModel

from pdf_loader import extract_text
from chunker import chunk_text
from summarizer import summarize
from flashcards import generate_flashcards
from quiz import generate_quiz
from chat import answer_question
from flowchart import generate_flowchart

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # MVP only
    allow_methods=["*"],
    allow_headers=["*"],
)

DOCUMENT_CHUNKS = []

@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    global DOCUMENT_CHUNKS
    async def event_stream():
        global DOCUMENT_CHUNKS
        # 1️⃣ Save file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            pdf_path = tmp.name

        # 2️⃣ Extract + chunk
        text = extract_text(pdf_path)
        chunks = chunk_text(text)
        DOCUMENT_CHUNKS = chunks
        # 3️⃣ Summary (FIRST)
        summary = summarize(chunks)
        yield json.dumps({
            "type": "summary",
            "data": summary
        }) + "\n"

        # 4️⃣ Flashcards (SECOND)
        flashcards = generate_flashcards(chunks)
        yield json.dumps({
            "type": "flashcards",
            "data": flashcards
        }) + "\n"

        # 5️⃣ Quiz (THIRD)
        quiz = generate_quiz(chunks)
        yield json.dumps({
            "type": "quiz",
            "data": quiz
        }) + "\n"

    return StreamingResponse(
        event_stream(),
        media_type="application/json"
    )

# 🔹 Chat endpoint
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(req: ChatRequest):
    if not DOCUMENT_CHUNKS:
        return {"answer": "Please upload a document first."}

    answer = answer_question(DOCUMENT_CHUNKS, req.question)
    return {"answer": answer}


@app.post("/flowchart")
async def flowchart_pdf(file: UploadFile = File(...)):
    # same pdf → text → chunks pipeline
    flowchart = generate_flowchart(DOCUMENT_CHUNKS)
    return {"flowchart": flowchart}


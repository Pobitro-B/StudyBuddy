# 📘 StudyBuddy

**StudyBuddy** is an AI-powered study assistant that transforms uploaded documents into interactive learning tools. Instead of passively reading notes, users can **pull knowledge on demand** — summaries, flashcards, quizzes, and conversational Q&A — all from a single uploaded file.

> Upload once. Learn actively.

---

## ✨ Features (Current)

### 📄 Document Upload & Analysis
- Upload PDFs or text-based study material
- Backend processes the document in chunks
- Results are streamed incrementally to the frontend

---

### 🧠 AI-Generated Summary
- Concise, readable summary of the uploaded content
- Rendered only when the user explicitly clicks **Summary**
- Preserves formatting and paragraph structure

---

### 🃏 Flashcards (Fully Functional)
- Auto-generated question–answer pairs
- Interactive card flipping
- Previous / Next navigation
- Reset state when re-entering the flashcard view

---

### 💬 Document-Aware Chatbot (Q&A)
- Users can ask natural-language questions about the document
- Chatbot grounds responses in document context
- Gracefully handles missing information
- Designed to be **helpful, not hallucinating**

> Example:
> - User: *Is that good?*
> - Bot: Explains that the document does not contain subjective judgments

---

### 🔘 Feature-on-Demand UI
- Nothing is shown automatically
- Users explicitly trigger:
  - Summary
  - Flashcards
  - Quiz (currently paused)
  - Flowchart (experimental)
- Clean separation between processing and interaction

---

## 🧪 Experimental / In-Progress

### 🧩 Quiz System
- UI scaffold exists
- Quiz data is generated but rendering has issues
- Temporarily paused to focus on core UX

---

### 🗺️ Flowchart Generation
- Mermaid-based visualization
- Goal: represent **document content**, not processing steps
- Currently unstable due to:
  - Overly rigid prompt assumptions
  - Inconsistent document structure
- Parked for future iteration

---

## 🏗️ Tech Stack

### Frontend
- React
- Bootstrap (styling & layout)
- Mermaid.js (flowchart rendering – experimental)
- Streaming fetch API for incremental updates

### Backend
- FastAPI
- Ollama (LLM inference)
- Chunk-based document processing
- Streaming JSON responses

---

## 🔄 Application Flow

1. User uploads a document  
2. Backend processes and streams:
   - Summary
   - Flashcards
   - Quiz
   - Flowchart (if enabled)
3. Frontend stores results but **renders nothing by default**
4. User selects which feature to view via buttons
5. Chatbot allows follow-up Q&A on the document

---

## 🎯 Design Philosophy

- **Pull, don’t push**: users choose what they want to see
- **Explicit interactions** over auto-rendering
- **Grounded AI**: prefer “I don’t know” over hallucination
- UI clarity > feature overload
- Build foundations first, polish later

---

## 🚀 Planned Improvements

- Fix quiz rendering logic
- Smarter, structure-agnostic flowchart generation
- Chatbot with light reasoning beyond strict extraction
- Polished UI (animations, transitions, spacing)
- Better error states and loading feedback

---

## 🧠 Project Status

**Active development**  
Core pipeline is stable. Advanced visualizations are intentionally paused until UX and data reliability are solid.

import { useState, useEffect, useRef } from "react"
import mermaid from "mermaid"

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Views: summary | flashcards | quiz | flowchart | chat
  const [view, setView] = useState(null)

  // Flashcards
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Quiz
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)

  // Chat
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)

  // Flowchart
  const [flowchartCode, setFlowchartCode] = useState(null)
  const flowchartRef = useRef(null)

  /* -------------------- FILE UPLOAD -------------------- */
  const uploadFile = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    setResult({})
    setView(null)
    setAnswers({})
    setScore(null)
    setCardIndex(0)
    setFlipped(false)

    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop()

      lines.forEach(line => {
        const parsed = JSON.parse(line)
        setResult(prev => ({
          ...prev,
          [parsed.type]: parsed.data,
        }))
      })
    }

    setLoading(false)
  }

  /* -------------------- FLOWCHART RENDER -------------------- */
  useEffect(() => {
    if (!flowchartCode || view !== "flowchart") return

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
    })
    console.log(flowchartCode)
    mermaid
      .render("studybuddy-flowchart", flowchartCode)
      .then(({ svg }) => {
        if (flowchartRef.current) {
          flowchartRef.current.innerHTML = svg
        }
      })
      .catch(console.error)
  }, [flowchartCode, view])

  /* -------------------- FLAGS -------------------- */
  const hasSummary = !!result?.summary
  const hasFlashcards = result?.flashcards?.length > 0
  const hasQuiz = result?.quiz?.length > 0

  return (
    <div className="container py-5">
      <h1 className="mb-2">📘 StudyBuddy</h1>
      <p className="text-muted mb-4">
        Upload notes. Pull knowledge on demand.
      </p>

      {/* Upload */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <input
            type="file"
            className="form-control mb-3"
            accept="
              .pdf,.txt,
              .doc,.docx,.odt,
              .ppt,.pptx,
              image/*
            "
            onChange={e => setFile(e.target.files[0])}
          />


          <button
            className="btn btn-primary"
            onClick={uploadFile}
            disabled={loading}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info text-center">
          🧠 StudyBuddy is thinking…
        </div>
      )}

      {/* Action Buttons */}
      {result && !loading && (
        <div className="d-flex gap-2 flex-wrap mb-4">
          <button
            className="btn btn-outline-primary"
            disabled={!hasSummary}
            onClick={() => setView("summary")}
          >
            Summary
          </button>

          <button
            className="btn btn-outline-success"
            disabled={!hasFlashcards}
            onClick={() => {
              setView("flashcards")
              setCardIndex(0)
              setFlipped(false)
            }}
          >
            Flashcards
          </button>

          <button
            className="btn btn-outline-warning"
            disabled={!hasQuiz}
            onClick={() => setView("quiz")}
          >
            Quiz
          </button>

          <button
            className="btn btn-outline-dark"
            onClick={async () => {
              setView("flowchart")
              setFlowchartCode(null)

              const formData = new FormData()
              formData.append("file", file)

              const res = await fetch("http://127.0.0.1:8000/flowchart", {
                method: "POST",
                body: formData,
              })

              const data = await res.json()
              setFlowchartCode(data.flowchart)
            }}
          >
            Flowchart
          </button>

          <button
            className="btn btn-outline-info"
            onClick={() => setView("chat")}
          >
            Chat
          </button>
        </div>
      )}

      {/* SUMMARY */}
      {view === "summary" && hasSummary && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Summary</h5>
            <p style={{ whiteSpace: "pre-line" }}>{result.summary}</p>
          </div>
        </div>
      )}

      {/* FLASHCARDS */}
      {view === "flashcards" && hasFlashcards && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>
              Flashcard {cardIndex + 1} / {result.flashcards.length}
            </h5>

            <div
              className="border rounded p-4 text-center mb-3 bg-light"
              style={{ cursor: "pointer", minHeight: "120px" }}
              onClick={() => setFlipped(!flipped)}
            >
              {flipped
                ? result.flashcards[cardIndex].answer
                : result.flashcards[cardIndex].question}
            </div>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                disabled={cardIndex === 0}
                onClick={() => {
                  setCardIndex(cardIndex - 1)
                  setFlipped(false)
                }}
              >
                Prev
              </button>

              <button
                className="btn btn-secondary"
                disabled={cardIndex === result.flashcards.length - 1}
                onClick={() => {
                  setCardIndex(cardIndex + 1)
                  setFlipped(false)
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ (kept intact) */}
      {view === "quiz" && hasQuiz && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Quiz</h5>
            <p className="text-muted">Quiz logic kept as-is for now 🛠️</p>
          </div>
        </div>
      )}

      {/* FLOWCHART */}
      {view === "flowchart" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5>Flowchart</h5>

            {!flowchartCode && (
              <p className="text-muted">Generating flowchart…</p>
            )}

            <div
              ref={flowchartRef}
              className="mt-3 p-3 rounded bg-dark overflow-auto"
              style={{ minHeight: "300px" }}
            />
          </div>
        </div>
      )}

      {/* CHAT */}
      {view === "chat" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Ask StudyBuddy</h5>

            <div
              className="border rounded p-3 mb-3"
              style={{ height: "300px", overflowY: "auto" }}
            >
              {chatMessages.map((m, i) => (
                <div key={i} className="mb-2">
                  <strong>{m.role === "user" ? "You" : "StudyBuddy"}:</strong>
                  <div>{m.text}</div>
                </div>
              ))}

              {chatLoading && <div className="text-muted">Thinking…</div>}
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Ask something about the document…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={!chatInput}
                onClick={async () => {
                  const q = chatInput
                  setChatInput("")
                  setChatLoading(true)

                  setChatMessages(prev => [
                    ...prev,
                    { role: "user", text: q },
                  ])

                  const res = await fetch("http://127.0.0.1:8000/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: q }),
                  })

                  const data = await res.json()

                  setChatMessages(prev => [
                    ...prev,
                    { role: "assistant", text: data.answer },
                  ])

                  setChatLoading(false)
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

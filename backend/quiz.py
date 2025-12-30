import json
from ollama_client import call_ollama

QUIZ_PROMPT = """
You are a tutor.

From the following content, create 5 multiple-choice questions.

Rules:
- Each question must have exactly 4 options
- Only ONE option is correct
- Return STRICT JSON in this format:

[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }}
]

CONTENT:
{content}
"""

def generate_quiz(chunks):
    quiz = []

    for chunk in chunks[:2]:  # keep it cheap for MVP
        prompt = QUIZ_PROMPT.format(content=chunk)
        raw = call_ollama(prompt)

        try:
            data = json.loads(raw)
            quiz.extend(data)
        except Exception:
            continue

    return quiz[:5]

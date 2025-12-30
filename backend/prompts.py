SUMMARY_PROMPT = """
You are a study assistant.
Summarize the following content clearly and concisely.
Focus on key concepts and definitions.

Content:
{content}
"""

FLASHCARD_PROMPT = """
You are a study assistant.

Create flashcards from the content below.

Rules:
- Output ONLY valid JSON
- No explanations
- No markdown
- No extra text
- The output must be a JSON array

Format exactly like this:
[
  {{ "question": "...", "answer": "..." }}
]

Content:
{content}
"""



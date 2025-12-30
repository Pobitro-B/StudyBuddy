from ollama_client import call_ollama

CHAT_PROMPT = """
You are StudyBuddy, a helpful study assistant.

Use the document context as your primary source of truth.
You are allowed to:
- Explain
- Infer
- Summarize
- Give opinions or judgments IF they logically follow from the content

Rules:
- Do NOT invent facts not supported by the document
- If the document lacks explicit information, you may give a reasonable interpretation and clearly label it as an inference
- If the question is subjective, respond thoughtfully using general knowledge + document context

Document context:
{context}

User question:
{question}

Answer clearly and helpfully.
"""


def answer_question(chunks, question):
    # MVP: use first N chunks (simple + fast)
    context = "\n\n".join(chunks[:5])

    prompt = CHAT_PROMPT.format(
        context=context,
        question=question
    )

    return call_ollama(prompt)

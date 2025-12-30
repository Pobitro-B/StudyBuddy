from pdf_loader import extract_text
from chunker import chunk_text
from summarizer import summarize
from flashcards import generate_flashcards

pdf_path = "sample.pdf"

text = extract_text(pdf_path)
chunks = chunk_text(text)

summary = summarize(chunks)
flashcards = generate_flashcards(chunks)

print("\n=== SUMMARY ===\n")
print(summary)

print("\n=== FLASHCARDS ===\n")
for card in flashcards:
    print(f"Q: {card['question']}")
    print(f"A: {card['answer']}\n")

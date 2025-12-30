def chunk_text(text, max_chars=3000):
    #print("chunker triggerred!")
    chunks = []
    current = ""

    for para in text.split("\n"):
        if len(current) + len(para) < max_chars:
            current += para + "\n"
        else:
            chunks.append(current)
            current = para + "\n"

    if current:
        chunks.append(current)

    return chunks

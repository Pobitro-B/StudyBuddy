from ollama_client import call_ollama
from prompts import FLASHCARD_PROMPT
import json
import re


def extract_json_array(text):
    """
    Extract the first JSON array from model output.
    """
    match = re.search(r"\[\s*{.*?}\s*\]", text, re.DOTALL)
    return match.group() if match else None


def generate_flashcards(chunks):
    all_cards = []

    for chunk in chunks:
        prompt = FLASHCARD_PROMPT.format(content=chunk)

        response = call_ollama(prompt)
        #print("FLASHCARD RAW RESPONSE:\n", response)

        json_text = extract_json_array(response)

        if not json_text:
            continue

        try:
            cards = json.loads(json_text)
            all_cards.extend(cards)
        except json.JSONDecodeError:
            continue

    return all_cards

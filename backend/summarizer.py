from ollama_client import call_ollama
from prompts import SUMMARY_PROMPT

def summarize(chunks):
    #print("summarizer loaded")
    summaries = []
    for chunk in chunks:
        prompt = SUMMARY_PROMPT.format(content=chunk)
        summaries.append(call_ollama(prompt))
    return "\n".join(summaries)

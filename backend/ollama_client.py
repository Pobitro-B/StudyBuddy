import subprocess

def call_ollama(prompt: str, model="llama3.1:8b") -> str:
    #print("ollama triggerred")
    process = subprocess.run(
        ["ollama", "run", model],
        input=prompt.encode("utf-8"),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    return process.stdout.decode("utf-8").strip()

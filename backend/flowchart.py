from typing import List
from ollama_client import call_ollama

FLOWCHART_PROMPT = """
Extract a structured outline from the content.

Rules:
- Output plain text ONLY
- Use this format exactly:

Section: <Section Name>
- <Item>
- <Item>
- <Item>

Content:
{content}
"""
def parse_outline(text: str):
    sections = {}
    current = None

    for line in text.splitlines():
        line = line.strip()
        if line.startswith("Section:"):
            current = line.replace("Section:", "").strip()
            sections[current] = []
        elif line.startswith("-") and current:
            sections[current].append(line[1:].strip())

    return sections

def outline_to_mermaid(sections: dict) -> str:
    lines = ["flowchart TD"]
    node_id = 1
    ids = {}

    def new_node(label):
        nonlocal node_id
        nid = f"N{node_id}"
        node_id += 1
        lines.append(f"{nid}[{label}]")
        return nid

    root = new_node("Document Overview")

    for section, items in sections.items():
        sid = new_node(section)
        lines.append(f"{root} --> {sid}")

        for item in items[:5]:  # cap for readability
            cid = new_node(item[:40])
            lines.append(f"{sid} --> {cid}")

    return "\n".join(lines)

def generate_flowchart(chunks: List[str]) -> str:
    content = "\n".join(chunks[:8])

    outline_raw = call_ollama(
        prompt=FLOWCHART_PROMPT.format(content=content)
    )

    sections = parse_outline(outline_raw)
    return outline_to_mermaid(sections)
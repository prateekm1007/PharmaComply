import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def load_files(evidence_dir="audit_dump", playbook_path="TriHealth_Governed_Architecture.md"):
    files = {}
    for root, _, fns in os.walk(evidence_dir):
        for fn in fns:
            path = os.path.join(root, fn)
            with open(path, "r", errors="ignore") as f:
                files[path] = f.read()
    if os.path.exists(playbook_path):
        with open(playbook_path, "r", errors="ignore") as f:
            files[playbook_path] = f.read()
    return files

def generate_advisory_review(files):
    prompt = """
IMPORTANT DISCLAIMERS:
- AI-assisted advisory review only
- Non-deterministic
- Human validation required
- Not suitable as an audit control

Compare governance intent vs implementation.
Return strengths, gaps, and confidence levels.
"""
    content = "\n\n".join([f"File: {k}\n{v[:8000]}" for k, v in files.items()])
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": prompt},
                  {"role": "user", "content": content}],
        temperature=0.3
    )
    return response.choices[0].message.content

if __name__ == "__main__":
    report = generate_advisory_review(load_files())
    with open("AI_Governance_Review_Report.md", "w") as f:
        f.write(report)
    print("Generated AI_Governance_Review_Report.md")

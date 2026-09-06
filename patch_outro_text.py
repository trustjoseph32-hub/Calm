with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = "<p className=\"mt-4 text-neutral-200 font-medium\">Найдите сейчас 5 предметов, которые видите вокруг себя, и назовите их про себя.</p>"
replacement = """<p className="mt-4 text-neutral-200 font-medium leading-relaxed">Найдите сейчас 5 предметов, которые видите вокруг себя, и назовите их про себя.</p>
                <p className="mt-4 text-neutral-200 font-medium leading-relaxed">После того, как сделаете это, прикоснитесь руками также к 5 разным предметам.</p>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match target text")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

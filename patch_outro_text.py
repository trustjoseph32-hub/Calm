import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """              <h2 className="text-2xl font-medium">Отлично.</h2>
              <div className="text-neutral-400">
                <p className="mb-6">А теперь давайте немного заземлимся.</p>"""

replacement = """              <div className="text-neutral-400">
                <h2 className="text-2xl font-medium text-white mb-8">А теперь давайте заземлимся</h2>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """                className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
              >
                Готово"""

replacement = """                className="w-full py-4 mt-8 rounded-full font-medium text-lg bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Готово"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Failed to match")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

import re

with open('src/screens/Home.tsx', 'r') as f:
    content = f.read()

# Remove the settings button
target = """          <button onClick={() => navigate('/settings')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all" aria-label="Settings">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md" strokeWidth={1.5} />
          </button>"""

if target in content:
    content = content.replace(target, "")
    print("Replaced button successfully")
else:
    print("Failed to match target button")
    
# Remove Settings import
content = content.replace("Settings, ", "")

with open('src/screens/Home.tsx', 'w') as f:
    f.write(content)

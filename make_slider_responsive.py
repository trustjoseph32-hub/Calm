import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """      <div 
        className="relative min-h-[120px] bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center justify-center text-center select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <p className="text-neutral-300 text-base leading-relaxed pointer-events-none whitespace-pre-wrap">"""

replacement = """      <div 
        className="relative min-h-[160px] sm:min-h-[120px] bg-neutral-900/50 rounded-xl p-6 sm:p-4 border border-neutral-800 flex items-center justify-center text-center select-none active:scale-[0.99] transition-transform shadow-inner touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <p className="text-neutral-300 text-[15px] sm:text-base leading-relaxed pointer-events-none whitespace-pre-wrap">"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced slider classes")
else:
    print("Failed to replace slider classes")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

jsx_target = """                  {isExpanding ? 'Вдох' : 'Выдох'}"""
jsx_replacement = """                  {isExpanding ? (isSOS && isSecondInhale ? 'До-вдох' : 'Вдох') : 'Выдох'}"""

if jsx_target in content:
    content = content.replace(jsx_target, jsx_replacement)
    print("Replaced JSX")
else:
    print("Failed to find JSX")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

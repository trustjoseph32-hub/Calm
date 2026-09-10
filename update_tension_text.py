import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'([ \t]+)НАПРЯЧЬСЯ([ \t\n]+)', r'\1ВДОХ - НАПРЯЖЕНИЕ\2', content)
content = re.sub(r'([ \t]+)РАССЛАБИТЬСЯ([ \t\n]+)', r'\1ВЫДОХ - РАССЛАБЛЕНИЕ\2', content)

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)

print("Applied Regex replace")

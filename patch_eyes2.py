import re

with open('src/screens/Instruction.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'animate={{ x: [-16, 16, -16] }}',
    'animate={{ x: [-22, 22, -22] }}'
)

with open('src/screens/Instruction.tsx', 'w') as f:
    f.write(content)

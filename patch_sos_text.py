with open('src/screens/SosInstruction.tsx', 'r') as f:
    content = f.read()

target = "Дышите вместе с расширяющимся кругом."
replacement = "Дышите вместе с расширяющимся кругом двойным вдохом (Вдох-доВдох)."

content = content.replace(target, replacement)

with open('src/screens/SosInstruction.tsx', 'w') as f:
    f.write(content)

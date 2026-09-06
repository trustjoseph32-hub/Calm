with open('src/screens/SosInstruction.tsx', 'r') as f:
    content = f.read()

target = "Дышите вместе с расширяющимся кругом двойным вдохом (Вдох-доВдох)."
replacement = "Дышите вместе с расширяющимся кругом двойным вдохом носом (Вдох-доВдох) и выдохом ртом."

content = content.replace(target, replacement)

with open('src/screens/SosInstruction.tsx', 'w') as f:
    f.write(content)

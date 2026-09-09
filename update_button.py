import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

content = content.replace("Готово, я назвал(а)", "Готово")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
print("Updated button text")

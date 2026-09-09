import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = '<p className="text-neutral-400">Следите за шариком, дышите с кругом. Но теперь **на вдохе сильно сжимайте кулаки и напрягайте плечи**, а **на выдохе полностью их расслабляйте**.</p>'
replacement = '<p className="text-neutral-400">Следите за шариком, дышите с кругом. <br/>И теперь <span className="text-neutral-200 font-medium">на вдохе сильно сжимайте кулаки и напрягайте плечи</span>, а <span className="text-neutral-200 font-medium">на выдохе полностью их разжимайте и расслабляйте</span>.</p>'

if target in content:
    content = content.replace(target, replacement)
    print("Replaced stage 3 text")
else:
    print("Target not found")

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)

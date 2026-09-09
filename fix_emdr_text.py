import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = '<p className="text-neutral-400">На этом этапе не нужно специально дышать. Просто непрерывно следите глазами за светящимся шариком. Это запустит процесс переработки напряжения.</p>'
replacement = '<p className="text-neutral-400">На этом этапе просто непрерывно следите глазами за двигающимся шариком. Это запустит процесс первичный переработки напряжения вашей нервной системы.</p>'

if target in content:
    content = content.replace(target, replacement)
    print("Replaced text")
else:
    print("Target not found")

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)

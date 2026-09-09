import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "import { Checkin } from './screens/Checkin';"
replacement = "import { Checkin } from './screens/Checkin';\nimport { Day1Engine } from './screens/Day1Engine';"

if target in content:
    content = content.replace(target, replacement)
    print("Added import Day1Engine")

with open('src/App.tsx', 'w') as f:
    f.write(content)

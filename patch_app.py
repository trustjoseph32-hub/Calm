import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

if "import { Day1Engine }" not in content:
    content = content.replace("import { PracticeSetupRouter } from './screens/PracticeSetup';", "import { PracticeSetupRouter } from './screens/PracticeSetup';\nimport { Day1Engine } from './screens/Day1Engine';")

target = '<Route path="/practice/active" element={<PracticeEngineWrapper />} />'
replacement = '<Route path="/practice/active" element={<PracticeEngineWrapper />} />\n      <Route path="/practice/day1" element={<Day1Engine />} />'

if '<Route path="/practice/day1"' not in content:
    content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Patched App.tsx")

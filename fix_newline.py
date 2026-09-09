import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target1 = '<span key="focus"><span className="font-medium text-neutral-200">Фокус дня:</span>\\nЗамечать'
target2 = '<span key="explanation"><span className="font-medium text-neutral-200">Для чего это нужно:</span>\\nИзмерение'

if target1 in content:
    content = content.replace(target1, '<span key="focus"><span className="font-medium text-neutral-200 block mb-2">Фокус дня:</span>Замечать')
if target2 in content:
    content = content.replace(target2, '<span key="explanation"><span className="font-medium text-neutral-200 block mb-2">Для чего это нужно:</span>Измерение')

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Fixed newlines using block styling")

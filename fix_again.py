import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """  const handleStartDay = (day: number) => {
    if (day === 1) {
      navigate('/practice/day1');
      return;
    }
    navigate('/checkin');
  };"""

content = content.replace(target, "")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Removed duplicate")

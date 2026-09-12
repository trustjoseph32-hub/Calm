import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Update handleStartDay
new_handle = """  const handleStartDay = (day: number) => {
    navigate(`/course/run/${day}`);
  };"""

content = re.sub(
    r'const handleStartDay = \(day: number\) => \{.*?\};',
    new_handle,
    content,
    flags=re.DOTALL
)

# Fix missing import if needed (navigate is already there)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

print("Updated Course.tsx handleStartDay")

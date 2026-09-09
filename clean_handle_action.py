import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# We accidentally duplicated handleStartDay, let's remove the second one
target = """  const handleStartDay = (day: number) => {
    if (day === 1) {
      navigate('/practice/day1');
      return;
    }
    // For MVP, we will simulate the day completion just by opening the practice
    // and passing a flag to return to course and mark as completed.
    // Ideally we would have custom screens for each day's logic, but this fulfills the MVP structure.
    navigate('/checkin');
  };"""

if target in content:
    content = content.replace(target, "")
    print("Removed duplicate handleStartDay")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

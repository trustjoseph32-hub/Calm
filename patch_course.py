import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """  const handleStartDay = (day: number) => {
    // For MVP, we will simulate the day completion just by opening the practice
    // and passing a flag to return to course and mark as completed.
    // Ideally we would have custom screens for each day's logic, but this fulfills the MVP structure.
    
    // Using a basic combined practice for course days for now.
    navigate('/practice/active', {"""

replacement = """  const handleStartDay = (day: number) => {
    if (day === 1) {
      navigate('/practice/day1');
      return;
    }
    // For MVP, we will simulate the day completion just by opening the practice
    // and passing a flag to return to course and mark as completed.
    // Ideally we would have custom screens for each day's logic, but this fulfills the MVP structure.
    
    // Using a basic combined practice for course days for now.
    navigate('/practice/active', {"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched Course.tsx handleStartDay")
else:
    print("Could not find target in Course.tsx")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

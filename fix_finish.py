import re

with open('src/screens/Day1Engine.tsx', 'r') as f:
    content = f.read()

target = "const { updateCourseProgress } = useAppStore();"
replacement = "const { markCourseDayCompleted } = useAppStore();"

target_finish = """  const finishDay1 = () => {
    updateCourseProgress({
      currentDay: 2,
      lastCompletedDate: new Date().toISOString()
    });
    navigate('/course');
  };"""

replacement_finish = """  const finishDay1 = () => {
    markCourseDayCompleted(1);
    navigate('/course');
  };"""

if target in content:
    content = content.replace(target, replacement)
if target_finish in content:
    content = content.replace(target_finish, replacement_finish)

with open('src/screens/Day1Engine.tsx', 'w') as f:
    f.write(content)
print("Updated finish handler")

import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Fix useAppStore call
old_store = "const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();"
new_store = "const { courseProgress, courseProfile, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();\n  const courseData = getCourseData(courseProfile?.anxietyPattern || null);"

content = content.replace(old_store, new_store)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

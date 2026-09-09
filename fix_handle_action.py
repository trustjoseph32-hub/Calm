import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """export function Course() {
  const navigate = useNavigate();
  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();

  const isSameDay = (d1: Date, d2: Date) => {"""

replacement = """export function Course() {
  const navigate = useNavigate();
  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();

  const handleStartDay = (day: number) => {
    if (day === 1) {
      navigate('/practice/day1');
      return;
    }
    navigate('/checkin');
  };

  const handleAction = (id: string, day: number) => {
    if (id === 'session') {
      handleStartDay(day);
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {"""

content = content.replace("  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();\n\n  const isSameDay = (d1: Date, d2: Date) => {", "  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();\n\n  const handleStartDay = (day: number) => {\n    if (day === 1) {\n      navigate('/practice/day1');\n      return;\n    }\n    navigate('/checkin');\n  };\n\n  const handleAction = (id: string, day: number) => {\n    if (id === 'session') {\n      handleStartDay(day);\n    }\n  };\n\n  const isSameDay = (d1: Date, d2: Date) => {")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Replaced handleAction via regex fallback")

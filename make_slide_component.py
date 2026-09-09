import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# We need to extract the slide rendering into a mini component or use state in the main component.
# BUT wait, `Course.tsx` is a full screen component. It currently maps over `courseData` and renders cards.
# If we want a swipable slider for Day 1 inside the card... 
# Actually, since it's just Day 1, we can create a sub-component `DayCard` that holds state.

# Find the start of the map loop.
target_map = """        <div className="space-y-6">
          {courseData.map((lesson) => {
            const isAvailable = lesson.day <= courseProgress.currentDay;
            const isCompleted = courseProgress.completedDays.includes(lesson.day);
            const isCurrent = lesson.day === courseProgress.currentDay;
            
            return ("""

# We'll just replace the entire content mapping part inside the card.
# But wait, it's easier to create a small component at the top of the file.

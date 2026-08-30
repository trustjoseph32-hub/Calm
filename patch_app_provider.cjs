const fs = require('fs');
let code = fs.readFileSync('src/store/AppProvider.tsx', 'utf8');

code = code.replace(
  'completedDays: [],',
  'completedDays: [],\n    completedFocusDays: [],'
);

code = code.replace(
  'markCourseDayCompleted: (day: number) => void;',
  'markCourseDayCompleted: (day: number) => void;\n  toggleCourseFocusDay: (day: number) => void;'
);

code = code.replace(
  'courseProgress: { currentDay: 1, completedDays: [] }',
  'courseProgress: { currentDay: 1, completedDays: [], completedFocusDays: [] }'
);

code = code.replace(
  'nextDay > 10 ? 10 : nextDay',
  'nextDay > 14 ? 14 : nextDay'
);

code = code.replace(
  'const markCourseDayCompleted = (day: number) => {',
  `const toggleCourseFocusDay = (day: number) => {
    setState((prev) => {
      const focusDays = prev.courseProgress.completedFocusDays || [];
      const newFocusDays = focusDays.includes(day)
        ? focusDays.filter((d) => d !== day)
        : [...focusDays, day];
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          completedFocusDays: newFocusDays,
        },
      };
    });
  };

  const markCourseDayCompleted = (day: number) => {`
);

code = code.replace(
  'markCourseDayCompleted,',
  'markCourseDayCompleted,\n        toggleCourseFocusDay,'
);

fs.writeFileSync('src/store/AppProvider.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const oldFilter = "const completedFocusItems = courseData.filter(lesson => courseProgress.completedFocusDays?.includes(lesson.day));";
const newFilter = `  // Только самые мощные техники попадают в постоянный Арсенал
  const ARTIFACT_DAYS = [2, 3, 6, 8, 10, 13];
  const completedFocusItems = courseData.filter(lesson => 
    courseProgress.completedFocusDays?.includes(lesson.day) && ARTIFACT_DAYS.includes(lesson.day)
  );`;

code = code.replace(oldFilter, newFilter);

fs.writeFileSync('src/screens/Course.tsx', code);

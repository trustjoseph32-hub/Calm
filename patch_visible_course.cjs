const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const oldVisibleDataLogic = `  const isDev = (typeof process !== "undefined" && process.env.NODE_ENV === "development") || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

  const visibleCourseData = isDev 
    ? courseData 
    : courseData.filter(lesson => lesson.day <= courseProgress.currentDay + 1);`;

const newVisibleDataLogic = `  const isDev = (typeof process !== "undefined" && process.env.NODE_ENV === "development") || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

  // Показываем только текущий день, как просил пользователь
  const currentDaySafe = Math.min(courseProgress.currentDay, courseData.length);
  const visibleCourseData = courseData.filter(lesson => lesson.day === currentDaySafe);`;

code = code.replace(oldVisibleDataLogic, newVisibleDataLogic);
fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched visibleCourseData in Course.tsx");

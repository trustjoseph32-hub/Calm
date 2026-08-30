const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const returnStatement = '  return (\n    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">';
const codeToInject = `  const isDev = import.meta.env.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');
  const visibleCourseData = isDev 
    ? courseData 
    : courseData.filter(lesson => lesson.day <= courseProgress.currentDay);

`;

code = code.replace(returnStatement, codeToInject + returnStatement);
code = code.replace('{courseData.map((lesson) => {', '{visibleCourseData.map((lesson) => {');

fs.writeFileSync('src/screens/Course.tsx', code);

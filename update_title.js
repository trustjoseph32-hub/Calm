import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

const oldTitle = 'const displayTitle = viewingDay === 1 ? "Снизить напряжение" :';
const newTitle = 'const displayTitle = viewingDay === 1 ? "Снижаем напряжение" :';

content = content.replace(oldTitle, newTitle);

fs.writeFileSync('src/screens/Course.tsx', content);

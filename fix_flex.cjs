const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const oldFlex = `<div className="flex flex-col sm:flex-row gap-3 mt-4 border-t border-neutral-700/50 pt-4">`;
const newFlex = `<div className={\`flex flex-col gap-3 mt-4 border-t border-neutral-700/50 pt-4 \${lesson.day === 2 ? '' : 'sm:flex-row'}\`}>`;

code = code.replace(oldFlex, newFlex);
fs.writeFileSync('src/screens/Course.tsx', code);

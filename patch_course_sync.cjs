const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

code = code.replace(
  "type: 'course',",
  "type: [2, 6, 10, 13].includes(day) ? 'synchronized' : 'course',"
);

fs.writeFileSync('src/screens/Course.tsx', code);

const fs = require('fs');

let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');
code = code.replace(/fill-white/g, "fill-neutral-900");
fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');
code = code.replace(
  "const duration = phase === 'in' ? settings.breathingIn * 1000 : settings.breathingOut * 1000;",
  "const duration = settings.breathingIn * 1000;"
);
code = code.replace(
  /transition=\{\{\s*duration: phase === 'in' \? settings.breathingIn : settings.breathingOut,/g,
  "transition={{\n            duration: settings.breathingIn,"
);
fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

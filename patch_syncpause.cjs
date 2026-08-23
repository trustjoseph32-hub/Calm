const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');
code = code.replace(
  "setPauseTimeLeft(15);",
  "setPauseTimeLeft(10);"
);
code = code.replace(
  "return 15;",
  "return 10;"
);
fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

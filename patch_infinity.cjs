const fs = require('fs');

let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

code = code.replace(
  "xOffset = -amplitude * Math.cos(t);",
  "xOffset = amplitude * Math.sin(t);"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

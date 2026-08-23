const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

code = code.replace(
  'const breathProgress = easeInOutSine(phaseProgress);\n  const visualProgress = phaseProgress;',
  "const breathProgress = easeInOutSine(phaseProgress);\n  const visualProgress = state === 'INFINITY_ACTIVE' ? phaseProgress : easeInOutSine(phaseProgress);"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

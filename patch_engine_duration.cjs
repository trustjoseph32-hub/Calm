const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');
code = code.replace(
  "let baseDurationMs = breathPhaseRef.current === 'in' ? settings.syncInhaleDuration * 1000 : settings.syncExhaleDuration * 1000;",
  "let baseDurationMs = settings.syncInhaleDuration * 1000;"
);
fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

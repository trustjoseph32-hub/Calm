const fs = require('fs');

let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

code = code.replace(
  "if (state === 'PAUSE_2') setState('COUNTDOWN_TRIANGLE');",
  "if (state === 'PAUSE_2') { if (isSOS) setState('COUNTDOWN_DIAGONAL'); else setState('COUNTDOWN_TRIANGLE'); }"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

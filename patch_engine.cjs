const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

code = code.replace(
  "      durationMs = breathPhaseRef.current === 'in' ? settings.syncInhaleDuration * 1000 : settings.syncExhaleDuration * 1000;\n    }\n\n    if (active) {",
  "      let baseDurationMs = breathPhaseRef.current === 'in' ? settings.syncInhaleDuration * 1000 : settings.syncExhaleDuration * 1000;\n      const progress = Math.min(1, activeTimeMsRef.current / phaseDurationMs);\n      const speedMultiplier = 1 + (0.2 * progress);\n      durationMs = baseDurationMs / speedMultiplier;\n    }\n\n    if (active) {"
);

code = code.replace(
  "if (activeTimeMsRef.current >= 60000) {",
  "if (activeTimeMsRef.current >= phaseDurationMs) {"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

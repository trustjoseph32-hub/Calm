const fs = require('fs');

let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

// We want to keep easeInOutSine for the circle scale, but use linear for orb position.
// Let's replace `const visualProgress = easeInOutSine(phaseProgress);`
// with:
// `const breathProgress = easeInOutSine(phaseProgress);`
// `const visualProgress = phaseProgress;`

code = code.replace(
  'const visualProgress = easeInOutSine(phaseProgress);',
  'const breathProgress = easeInOutSine(phaseProgress);\n  const visualProgress = phaseProgress;'
);

// Now replace visualProgress with breathProgress ONLY for the breathing circle.
// The breathing circle is around lines 402-404:
code = code.replace(
  /opacity: breathPhase === 'in' \? 0\.2 \+ \(visualProgress \* 0\.5\) : 0\.7 - \(visualProgress \* 0\.5\),/g,
  "opacity: breathPhase === 'in' ? 0.2 + (breathProgress * 0.5) : 0.7 - (breathProgress * 0.5),"
);
code = code.replace(
  /transform: `scale\(\$\{breathPhase === 'in' \? 0\.72 \+ \(visualProgress \* 0\.28\) : 1\.0 - \(visualProgress \* 0\.28\)\}\)`/g,
  "transform: `scale(${breathPhase === 'in' ? 0.72 + (breathProgress * 0.28) : 1.0 - (breathProgress * 0.28)})`"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);

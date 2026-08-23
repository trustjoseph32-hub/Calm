const fs = require('fs');

let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');

// The first two replacements affected the reduced motion gradients:
// It should be:
// animate={{ opacity: isActive ? [0.1, 0.4, 0.1] : 0.1 }}
// transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}
//
// and:
// animate={{ opacity: isActive ? [0.1, 0.1, 0.4, 0.1] : 0.1 }}
// transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}

code = code.replace(
  /animate=\{\{ opacity: isActive \? \[0\.1, 0\.4, 0\.1\] : 0\.1 \}\}\s*transition=\{\{ duration: getSpeedSeconds\(\),\s*repeat: Infinity,\s*repeatType: "reverse",\s*ease: "linear" \}\}/g,
  'animate={{ opacity: isActive ? [0.1, 0.4, 0.1] : 0.1 }}\n              transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}'
);

code = code.replace(
  /animate=\{\{ opacity: isActive \? \[0\.1, 0\.1, 0\.4, 0\.1\] : 0\.1 \}\}\s*transition=\{\{ duration: getSpeedSeconds\(\),\s*repeat: Infinity,\s*repeatType: "reverse",\s*ease: "linear" \}\}/g,
  'animate={{ opacity: isActive ? [0.1, 0.1, 0.4, 0.1] : 0.1 }}\n              transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}'
);

fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

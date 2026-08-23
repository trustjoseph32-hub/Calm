const fs = require('fs');

let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');

// The orb transition currently is:
// transition={isActive ? {
//   duration: getSpeedSeconds() * 2,
//   repeat: Infinity,
//   ease: "easeInOut"
// } : { duration: 0.5 }}

// We want to change the animation to only use 2 points and reverse it:
// animate={isActive ? {
//   x: [`-${parseInt(getAmplitudeWidth())/2}vw`, `${parseInt(getAmplitudeWidth())/2}vw`]
// } : { x: 0 }}
// transition={isActive ? {
//   duration: getSpeedSeconds(),
//   repeat: Infinity,
//   repeatType: "reverse",
//   ease: "linear"
// } : { duration: 0.5 }}

code = code.replace(
  /x: \[`-\$\{parseInt\(getAmplitudeWidth\(\)\)\/2\}vw`, `\$\{parseInt\(getAmplitudeWidth\(\)\)\/2\}vw`, `-\$\{parseInt\(getAmplitudeWidth\(\)\)\/2\}vw`\]/g,
  "x: [`-${parseInt(getAmplitudeWidth())/2}vw`, `${parseInt(getAmplitudeWidth())/2}vw`]"
);

code = code.replace(
  /duration: getSpeedSeconds\(\) \* 2,\s*repeat: Infinity,\s*ease: "easeInOut"/g,
  'duration: getSpeedSeconds(),\n              repeat: Infinity,\n              repeatType: "reverse",\n              ease: "linear"'
);

fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

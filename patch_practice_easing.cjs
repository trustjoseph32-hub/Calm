const fs = require('fs');
let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');

code = code.replace(
  /x: \[`-\$\{parseInt\(getAmplitudeWidth\(\)\)\/2\}vw`, `\$\{parseInt\(getAmplitudeWidth\(\)\)\/2\}vw`\]/g,
  "x: [`-${parseInt(getAmplitudeWidth())/2}vw`, `${parseInt(getAmplitudeWidth())/2}vw`, `-${parseInt(getAmplitudeWidth())/2}vw`]"
);

code = code.replace(
  /duration: getSpeedSeconds\(\),\s*repeat: Infinity,\s*repeatType: "reverse",\s*ease: "linear"/g,
  'duration: getSpeedSeconds() * 2,\n              repeat: Infinity,\n              ease: "easeInOut"'
);

fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

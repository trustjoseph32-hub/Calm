const fs = require('fs');
let code = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf8');
code = code.replace(
  "type: 'synchronized',",
  "type: 'synchronized',\n        isSOS: true,"
);
fs.writeFileSync('src/screens/SosInstruction.tsx', code);

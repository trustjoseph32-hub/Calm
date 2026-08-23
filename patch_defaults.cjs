const fs = require('fs');
let code = fs.readFileSync('src/store/AppProvider.tsx', 'utf8');
code = code.replace(
  "breathingOut: 6,",
  "breathingOut: 4,"
);
code = code.replace(
  "syncExhaleDuration: 6,",
  "syncExhaleDuration: 4,"
);
fs.writeFileSync('src/store/AppProvider.tsx', code);

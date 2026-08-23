const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedSetup.tsx', 'utf8');
code = code.replace(
  "Практика состоит из 5 фаз по 1 минуте с короткими паузами.",
  "Практика состоит из 5 фаз по 1.5 минуты с короткими паузами."
);
fs.writeFileSync('src/screens/SynchronizedSetup.tsx', code);

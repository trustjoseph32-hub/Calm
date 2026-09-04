const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

code = code.replace(/import.meta.env.DEV/g, '(typeof process !== "undefined" && process.env.NODE_ENV === "development")');
code = code.replace(/SmartphoneOff/g, 'PhoneOff');

fs.writeFileSync('src/screens/Course.tsx', code);

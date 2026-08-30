const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

code = code.replace(
  '<span className="font-medium text-neutral-300">Сессия в приложении:</span>',
  '<span className="font-medium text-neutral-300">Сессия по протоколу:</span>'
);

fs.writeFileSync('src/screens/Course.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

code = code.replace(
  "{isCompleted ? 'Сессия пройдена' : 'Начать сессию'}",
  "{isCompleted ? 'Протокол пройден' : 'Начать по протоколу'}"
);

fs.writeFileSync('src/screens/Course.tsx', code);

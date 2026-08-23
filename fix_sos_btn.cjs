const fs = require('fs');

let code = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf8');
code = code.replace(/<Play className="w-6 h-6 fill-neutral-900" \/>/g, '<Play className="w-6 h-6 fill-white" />');
fs.writeFileSync('src/screens/SosInstruction.tsx', code);

import fs from 'node:fs';

let content = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf-8');
fs.writeFileSync('src/screens/SosInstruction.backup.tsx', content);

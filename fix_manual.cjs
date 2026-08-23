const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src/screens').map(f => path.join('src/screens', f));
files.push('src/App.tsx');

for (const file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix the broken SOS red backgrounds
    content = content.replace(/bg-red-950\/300/g, "bg-red-500");
    
    // Check if bg-neutral-900/10 was changed, it wasn't.
    // Check text-neutral-500 - is it used instead of text-neutral-400?
    // Let's make sure neutral-700 text in the icons is good. text-neutral-500 for icon is fine.
    
    fs.writeFileSync(file, content);
  }
}

const fs = require('fs');

function patch(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  // Make play/pause button dark
  code = code.replace(/bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-200 transition-colors shadow-lg/g, "bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-800 transition-colors shadow-lg");

  fs.writeFileSync(filename, code);
}

patch('src/screens/PracticeEngine.tsx');


const fs = require('fs');

function cleanupPractice(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix buttons in PracticeEngine that got weird hover states
  code = code.replace(/bg-neutral-50 text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-800/g, "bg-neutral-900 text-white rounded-full font-medium text-lg hover:bg-neutral-800");
  code = code.replace(/hover:bg-neutral-800 transition-colors pointer-events-auto mt-4/g, "hover:bg-neutral-100 transition-colors pointer-events-auto mt-4");
  code = code.replace(/p-3 bg-white\/50 border border-neutral-200 hover:bg-neutral-800 backdrop-blur-md/g, "p-3 bg-white/50 border border-neutral-200 hover:bg-white backdrop-blur-md");
  
  // Track line
  code = code.replace(/bg-white\/20/g, "bg-black/10");

  fs.writeFileSync(filename, code);
}

cleanupPractice('src/screens/PracticeEngine.tsx');

function cleanupSync(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  code = code.replace(/bg-white text-neutral-900 rounded-full/g, "bg-neutral-900 text-white rounded-full");
  code = code.replace(/hover:bg-neutral-100 transition-colors pointer-events-auto/g, "hover:bg-neutral-800 transition-colors pointer-events-auto");
  code = code.replace(/from-white\/20/g, "from-black/5");
  code = code.replace(/bg-\[radial-gradient\([^)]+\)\] from-white\/20/g, (match) => match.replace("from-white/20", "from-black/5"));

  // Check PAUSED state buttons
  code = code.replace(/bg-neutral-900 text-white rounded-full font-medium text-lg"\s*>\s*Продолжить/g, 'bg-neutral-900 text-white rounded-full font-medium text-lg hover:bg-neutral-800">\n                Продолжить');
  code = code.replace(/bg-transparent text-neutral-400 rounded-full font-medium text-lg border border-neutral-700/g, "bg-transparent text-neutral-500 rounded-full font-medium text-lg border border-neutral-200 hover:bg-neutral-100");

  // Fix timer and countdown colors
  code = code.replace(/text-8xl font-light text-neutral-900/g, "text-8xl font-light text-neutral-800");
  code = code.replace(/text-6xl font-light text-neutral-900/g, "text-6xl font-light text-neutral-800");

  fs.writeFileSync(filename, code);
}

cleanupSync('src/screens/SynchronizedEngine.tsx');


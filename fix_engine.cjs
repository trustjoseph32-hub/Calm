const fs = require('fs');

function fixEngine(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix circle
  code = code.replace(/bg-neutral-300 blur-2xl sm:blur-3xl mix-blend-multiply/g, "bg-white blur-2xl sm:blur-3xl mix-blend-screen");
  
  // Fix gradients
  code = code.replace(/from-black\/5/g, "from-white/20");

  // Fix orb
  code = code.replace(/bg-neutral-800 shadow-\[0_0_30px_10px_rgba\(0,0,0,0\.1\)\]/g, "bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]");

  // Fix backgrounds
  code = code.replace(/bg-neutral-800\/90/g, "bg-neutral-900/90");
  code = code.replace(/bg-neutral-800\/95/g, "bg-neutral-900/95");
  code = code.replace(/bg-neutral-800 px-6/g, "bg-neutral-900 px-6"); // GROUNDING
  
  // Fix Play/Pause button text color
  code = code.replace(/bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-200/g, "bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-200");

  fs.writeFileSync(filename, code);
}

fixEngine('src/screens/PracticeEngine.tsx');
fixEngine('src/screens/SynchronizedEngine.tsx');


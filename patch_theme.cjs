const fs = require('fs');

function replaceAll(str, mapObj) {
  let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  return str.replace(re, function(matched){
    return mapObj[matched.toLowerCase()] || mapObj[matched];
  });
}

function processFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  // General wrappers
  code = code.replace(/bg-neutral-900 text-white/g, "bg-neutral-50 text-neutral-900");
  code = code.replace(/from-neutral-900 to-neutral-800/g, "from-neutral-100 to-neutral-50");
  
  // Overlays
  code = code.replace(/bg-neutral-900\/90/g, "bg-white/90");
  code = code.replace(/bg-neutral-900\/95/g, "bg-white/95");
  code = code.replace(/bg-neutral-900/g, "bg-white"); // Care with this one
  code = code.replace(/text-white/g, "text-neutral-900");
  code = code.replace(/text-neutral-300/g, "text-neutral-500");
  code = code.replace(/text-neutral-200/g, "text-neutral-600");
  code = code.replace(/text-neutral-400/g, "text-neutral-500");

  // Specific HUD elements
  code = code.replace(/bg-neutral-800\/50/g, "bg-white/50 border border-neutral-200");
  code = code.replace(/hover:bg-neutral-800/g, "hover:bg-neutral-100");
  code = code.replace(/hover:bg-neutral-700\/80/g, "hover:bg-neutral-200/80");
  code = code.replace(/border-neutral-700/g, "border-neutral-200");
  
  // Specific canvas elements
  // Orb
  code = code.replace(/bg-white shadow-\[0_0_30px_10px_rgba\(255,255,255,0\.4\)\]/g, "bg-neutral-800 shadow-[0_0_30px_10px_rgba(0,0,0,0.1)]");
  
  // Breathing text
  code = code.replace(/text-white\/70/g, "text-neutral-800/70");

  // Buttons that were white on dark, should now be dark on light
  code = code.replace(/bg-white text-neutral-900/g, "bg-neutral-900 text-white");
  code = code.replace(/hover:bg-neutral-100/g, "hover:bg-neutral-800");

  // Fix pause button
  code = code.replace(/<Pause className="w-8 h-8 fill-neutral-900" \/>/g, '<Pause className="w-8 h-8 fill-white" />');
  code = code.replace(/<Play className="w-8 h-8 fill-neutral-900 translate-x-0.5" \/>/g, '<Play className="w-8 h-8 fill-white translate-x-0.5" />');

  // Fix circle mix blend
  code = code.replace(/bg-white blur-2xl sm:blur-3xl mix-blend-screen/g, "bg-neutral-300 blur-2xl sm:blur-3xl mix-blend-multiply");
  code = code.replace(/from-white\/20/g, "from-black/5");

  // Some overrides for CHECKOUT state (already light)
  // we might have messed up checkout state, let's fix it later manually if needed.

  fs.writeFileSync(filename, code);
}

processFile('src/screens/PracticeEngine.tsx');
processFile('src/screens/SynchronizedEngine.tsx');


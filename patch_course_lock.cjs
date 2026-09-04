const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const oldLock = `<div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <Lock className="w-5 h-5 text-neutral-500" />
                </div>`;
const newLock = `<div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 flex items-center justify-center border border-neutral-600/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)]">
                  <Lock className="w-5 h-5 drop-shadow-md text-neutral-400" />
                </div>`;
code = code.replace(oldLock, newLock);
fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course lock icon");

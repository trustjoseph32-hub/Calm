const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const mainOld = `isCompleted 
                          ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'`;
const mainNew = `isCompleted 
                          ? 'bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-300 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]' 
                          : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]'`;

code = code.split(mainOld).join(mainNew);

const focusOld = `isFocusCompleted 
                        ? 'bg-green-900/20 text-green-400 border-green-900/50 hover:bg-green-900/30' 
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'`;
const focusNew = `isFocusCompleted 
                        ? 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-emerald-50 border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)] drop-shadow-md' 
                        : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 text-neutral-400 border-neutral-600/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'`;

code = code.split(focusOld).join(focusNew);

// Add border to main button classes
code = code.split(`className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] \${`).join(`className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all border active:scale-[0.98] \${`);

// Focus button already has 'border' in its template string `... active:scale-[0.98] border ${` but let's change transition-transform to transition-all
code = code.split(`transition-transform active:scale-[0.98] border`).join(`transition-all active:scale-[0.98] border`);

fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course.tsx buttons");

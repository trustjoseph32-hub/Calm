const fs = require('fs');
let code = fs.readFileSync('src/screens/Onboarding.tsx', 'utf8');

const oldBtn = `className="w-full max-w-xs py-4 rounded-full bg-white text-neutral-900 text-lg font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:bg-neutral-200"`;
const newBtn = `className="w-full max-w-xs py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md text-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 hover:scale-[1.02]"`;
code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/screens/Onboarding.tsx', code);
console.log("Patched Onboarding.tsx buttons");

const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

const backOld = `<button 
          onClick={() => navigate(-1)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>`;
const backNew = `<button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>`;
code = code.replace(backOld, backNew);

const saveOld = `className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-4 rounded-2xl transition-colors active:scale-[0.98]"`;
const saveNew = `className="w-full py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white font-medium transition-all active:scale-[0.98] border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]"`;
code = code.replace(saveOld, saveNew);

fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Patched Checkin.tsx buttons");

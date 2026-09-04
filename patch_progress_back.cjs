const fs = require('fs');
let code = fs.readFileSync('src/screens/Progress.tsx', 'utf8');

const backOld = `<button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-neutral-500 hover:text-neutral-100 transition-colors"
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

fs.writeFileSync('src/screens/Progress.tsx', code);
console.log("Patched Progress.tsx back button");

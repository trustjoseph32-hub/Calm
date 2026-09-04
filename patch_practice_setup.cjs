const fs = require('fs');

let code = fs.readFileSync('src/screens/PracticeSetup.tsx', 'utf8');

// Back button
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

// Start button
const startOld = `className="w-full py-4 rounded-full bg-white text-neutral-900 text-lg font-medium transition-transform active:scale-[0.98] hover:bg-neutral-200 shadow-md flex justify-center items-center gap-2"`;
const startNew = `className="w-full py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white text-lg font-medium transition-all active:scale-[0.98] border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02] flex justify-center items-center gap-2"`;
code = code.replace(startOld, startNew);
// Play icon
code = code.replace(`<Play className="w-5 h-5 fill-neutral-900" />`, `<Play className="w-5 h-5 fill-indigo-100 drop-shadow-md" />`);

// Option icons
code = code.split(`className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 shadow-sm shrink-0 mt-1"`).join(`className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] mt-1"`);
code = code.split(`<Wind className="w-6 h-6" strokeWidth={1.5} />`).join(`<Wind className="w-6 h-6 drop-shadow-md text-neutral-400" strokeWidth={1.5} />`);
code = code.split(`<Activity className="w-6 h-6" strokeWidth={1.5} />`).join(`<Activity className="w-6 h-6 drop-shadow-md text-neutral-400" strokeWidth={1.5} />`);
code = code.split(`<ScanEye className="w-6 h-6" strokeWidth={1.5} />`).join(`<ScanEye className="w-6 h-6 drop-shadow-md text-neutral-400" strokeWidth={1.5} />`);

const syncIconOld = `className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-100 shrink-0 mt-1 group-hover:bg-neutral-700 group-hover:text-white transition-colors"`;
const syncIconNew = `className="w-12 h-12 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-indigo-50 flex items-center justify-center shrink-0 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md mt-1"`;
code = code.replace(syncIconOld, syncIconNew);

// Time selection buttons
const timeBtnActiveOld = `'border-neutral-800 bg-neutral-200 text-neutral-900 shadow-md'`;
const timeBtnActiveNew = `'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md'`;
const timeBtnInactiveOld = `'border-neutral-700 text-neutral-500 hover:border-neutral-600 bg-neutral-800'`;
const timeBtnInactiveNew = `'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'`;
code = code.split(timeBtnActiveOld).join(timeBtnActiveNew);
code = code.split(timeBtnInactiveOld).join(timeBtnInactiveNew);

fs.writeFileSync('src/screens/PracticeSetup.tsx', code);
console.log("Patched PracticeSetup.tsx buttons");

// SynchronizedSetup.tsx
let sync = fs.readFileSync('src/screens/SynchronizedSetup.tsx', 'utf8');
sync = sync.replace(backOld, backNew);

const syncStartOld = `className="w-full py-4 rounded-full bg-white text-neutral-900 text-lg font-medium transition-transform active:scale-[0.98] hover:bg-neutral-200 shadow-md flex justify-center items-center gap-2"`;
sync = sync.replace(syncStartOld, startNew);
sync = sync.replace(`<Play className="w-5 h-5 fill-neutral-900" />`, `<Play className="w-5 h-5 fill-indigo-100 drop-shadow-md" />`);
sync = sync.split(timeBtnActiveOld).join(timeBtnActiveNew);
sync = sync.split(timeBtnInactiveOld).join(timeBtnInactiveNew);

fs.writeFileSync('src/screens/SynchronizedSetup.tsx', sync);
console.log("Patched SynchronizedSetup.tsx buttons");

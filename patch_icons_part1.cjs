const fs = require('fs');

// Patch Home.tsx header buttons
let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');
const oldHomeIcons = `<div className="flex gap-4">
          <button onClick={() => navigate('/progress')} className="p-2 text-neutral-500 hover:text-neutral-100 transition-colors" aria-label="Progress">
            <Activity className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 text-neutral-500 hover:text-neutral-100 transition-colors" aria-label="Settings">
            <Settings className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>`;
const newHomeIcons = `<div className="flex gap-4">
          <button onClick={() => navigate('/progress')} className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all" aria-label="Progress">
            <Activity className="w-5 h-5 drop-shadow-md" strokeWidth={1.5} />
          </button>
          <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all" aria-label="Settings">
            <Settings className="w-5 h-5 drop-shadow-md" strokeWidth={1.5} />
          </button>
        </div>`;
home = home.replace(oldHomeIcons, newHomeIcons);
fs.writeFileSync('src/screens/Home.tsx', home);

// Patch Progress.tsx icons
let progress = fs.readFileSync('src/screens/Progress.tsx', 'utf8');

const actStr = `<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                  <Activity className="w-5 h-5" />
                </div>`;
const newActStr = `<div className="w-10 h-10 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white flex items-center justify-center border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] mb-4">
                  <Activity className="w-5 h-5 drop-shadow-md text-indigo-50" />
                </div>`;
progress = progress.replace(actStr, newActStr);

const calStr = `<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                  <Calendar className="w-5 h-5" />
                </div>`;
const newCalStr = `<div className="w-10 h-10 rounded-full bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-white flex items-center justify-center border border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)] mb-4">
                  <Calendar className="w-5 h-5 drop-shadow-md text-emerald-50" />
                </div>`;
progress = progress.replace(calStr, newCalStr);

const timeStr = `<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4">
                  <Clock className="w-5 h-5" />
                </div>`;
const newTimeStr = `<div className="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 via-orange-600 to-orange-800 text-white flex items-center justify-center border border-orange-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(249,115,22,0.4)] mb-4">
                  <Clock className="w-5 h-5 drop-shadow-md text-orange-50" />
                </div>`;
progress = progress.replace(timeStr, newTimeStr);

fs.writeFileSync('src/screens/Progress.tsx', progress);

console.log("Patched Home and Progress");

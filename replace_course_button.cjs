const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

const targetOld = `<button 
          onClick={() => navigate('/course')}
          className="flex flex-col text-left bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-neutral-700 hover:border-neutral-700 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-900/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-neutral-900/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-neutral-700 text-neutral-500 flex items-center justify-center shrink-0">
              <Calendar className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-neutral-100">Пройти курс</h3>
              <p className="text-base text-neutral-500 mt-2">День {courseProgress.currentDay} из 14</p>
            </div>
          </div>
        </button>`;

const targetNew = `<button 
          onClick={() => navigate('/course')}
          className="flex flex-col text-left bg-indigo-950/20 p-8 rounded-[2rem] shadow-sm border border-indigo-900/40 hover:border-indigo-800/50 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
              <Calendar className="w-8 h-8 fill-current" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-indigo-100">Пройти курс</h3>
              <p className="text-base text-indigo-200/70 mt-2">День {courseProgress.currentDay} из 14</p>
            </div>
          </div>
        </button>`;

if (code.includes(targetOld)) {
  code = code.replace(targetOld, targetNew);
  fs.writeFileSync('src/screens/Home.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find the target string. The spacing might be off.");
}

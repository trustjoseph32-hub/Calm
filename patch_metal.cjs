const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// 1. SOS Button
const sosOld = `<div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
              <Zap className="w-8 h-8 fill-current" strokeWidth={1.5} />
            </div>`;
const sosNew = `<div className="w-16 h-16 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 text-white flex items-center justify-center shrink-0 border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)]">
              <Zap className="w-8 h-8 fill-red-100 drop-shadow-md" strokeWidth={1.5} />
            </div>`;
code = code.replace(sosOld, sosNew);

// 2. Course Button
const courseOld = `<div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
              <Pill className="w-8 h-8 fill-indigo-200/20" strokeWidth={1.5} />
            </div>`;
const courseNew = `<div className="w-16 h-16 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white flex items-center justify-center shrink-0 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)]">
              <Pill className="w-8 h-8 text-indigo-50 fill-indigo-200/20 drop-shadow-md" strokeWidth={1.5} />
            </div>`;
code = code.replace(courseOld, courseNew);

// 3. Instruction Button
const instOld = `<div className="w-16 h-16 rounded-full bg-blue-950/30 text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8" strokeWidth={1.5} />
            </div>`;
const instNew = `<div className="w-16 h-16 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]">
              <BookOpen className="w-8 h-8 drop-shadow-md" strokeWidth={1.5} />
            </div>`;
code = code.replace(instOld, instNew);

fs.writeFileSync('src/screens/Home.tsx', code);
console.log("Patched successfully!");

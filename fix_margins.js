import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

// intro
content = content.replace(
  'className="space-y-4 text-lg text-slate-300 leading-relaxed flex-1"',
  'className="space-y-2 sm:space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed flex-1 overflow-y-auto min-h-0 py-2"'
);

// pre-check
content = content.replace(
  'className="text-slate-400 mb-12"',
  'className="text-slate-400 mb-6 sm:mb-12"'
);
content = content.replace(
  'className="text-6xl font-light mb-8 tabular-nums"',
  'className="text-5xl sm:text-6xl font-light mb-6 sm:mb-8 tabular-nums"'
);
content = content.replace(
  'className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-12"',
  'className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-6 sm:mb-12"'
);

// stage-intro
content = content.replace(
  'className="text-lg text-slate-300 mb-8"',
  'className="text-base sm:text-lg text-slate-300 mb-4 sm:mb-8"'
);
content = content.replace(
  'className="bg-white/5 rounded-2xl p-6 border border-white/10 text-left w-full"',
  'className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 text-left w-full"'
);

// practice
content = content.replace(
  'className="text-slate-400 font-mono text-lg mb-12"',
  'className="text-slate-400 font-mono text-lg mb-4 sm:mb-12"'
);
content = content.replace(
  'className="relative w-full h-full min-h-[50vh] flex items-center justify-center mb-12"',
  'className="relative w-full flex-1 flex items-center justify-center mb-4 sm:mb-12 min-h-0 py-8"'
);
content = content.replace(
  'className="mt-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"',
  'className="mt-4 sm:mt-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"'
);

// post-check
content = content.replace(
  'className="text-slate-400 mb-12"',
  'className="text-slate-400 mb-6 sm:mb-12"'
);

// summary
content = content.replace(
  'className="bg-white/5 rounded-2xl p-6 mb-8 w-full border border-white/10"',
  'className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full border border-white/10 overflow-y-auto min-h-0"'
);

// sos-reveal
content = content.replace(
  'className="bg-white/5 rounded-2xl p-6 mb-8 w-full border border-white/10 text-left"',
  'className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full border border-white/10 text-left overflow-y-auto min-h-0"'
);

fs.writeFileSync('src/screens/Day1Engine.tsx', content);

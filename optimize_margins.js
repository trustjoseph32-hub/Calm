import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

// intro
content = content.replace(
  'className="w-full max-w-sm flex flex-col h-full justify-center"',
  'className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center py-4"'
);

// pre-check
content = content.replace(
  'className="w-full max-w-sm flex flex-col h-full justify-center text-center"',
  'className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center text-center py-4"'
);
content = content.replace(
  'className="text-6xl font-light mb-8 tabular-nums"',
  'className="text-6xl font-light mb-4 sm:mb-8 tabular-nums"'
);
content = content.replace(
  'className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-12"',
  'className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-6"'
);

// stage-intro
content = content.replace(
  'className="flex-1 flex flex-col justify-center text-center"',
  'className="flex-1 flex flex-col justify-center text-center py-2 min-h-0"'
);
content = content.replace(
  'className="text-3xl font-medium mb-6 text-white"',
  'className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-6 text-white"'
);

// practice
content = content.replace(
  'className="w-full flex flex-col items-center justify-center flex-1"',
  'className="w-full flex flex-col items-center justify-between sm:justify-center flex-1 py-4 min-h-0"'
);
content = content.replace(
  'className="relative w-full flex-1 flex items-center justify-center mb-4 sm:mb-12 min-h-0 py-8"',
  'className="relative w-full flex-1 flex items-center justify-center min-h-0"'
);

// post-check
content = content.replace(
  'className="w-full max-w-sm flex flex-col items-center text-center"',
  'className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"'
);
content = content.replace(
  'className="text-slate-400 mb-6 sm:mb-12"',
  'className="text-slate-400 mb-4 sm:mb-12"'
);
content = content.replace(
  'className="text-6xl font-light mb-8 tabular-nums"', // wait this is already changed? Oh wait I didn't change it in post-check.
  'className="text-6xl font-light mb-4 sm:mb-8 tabular-nums"'
);

// summary & sos-reveal 
// Add h-full justify-between for all motion containers that use it.
content = content.replace(
  'className="w-full max-w-sm flex flex-col items-center text-center"',
  'className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"'
);

content = content.replace(
  'className="w-full max-w-sm flex flex-col items-center text-center"',
  'className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"'
);

fs.writeFileSync('src/screens/Day1Engine.tsx', content);

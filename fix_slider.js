import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

content = content.replace(
  'className="flex-1 w-full p-6 md:p-8 rounded-[2rem] bg-[#0A1325]/80 border border-blue-500/20 backdrop-blur-xl shadow-2xl"',
  'className="flex-1 w-full p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0A1325]/80 border border-blue-500/20 backdrop-blur-xl shadow-2xl"'
);

content = content.replace(
  'className="flex justify-between items-start mb-8"',
  'className="flex justify-between items-start mb-4 md:mb-8"'
);

content = content.replace(
  'className="relative pt-2 pb-6"',
  'className="relative pt-2 pb-4 md:pb-6"'
);

content = content.replace(
  'className="text-white/70 font-light text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-md"',
  'className="text-white/70 font-light text-sm md:text-lg leading-relaxed mb-4 md:mb-10 max-w-md"'
);

fs.writeFileSync('src/screens/Course.tsx', content);

const fs = require('fs');
let code = fs.readFileSync('src/screens/Instruction.tsx', 'utf8');

// Icons
code = code.replace(
  `className="w-12 h-12 rounded-full bg-blue-950/30 flex items-center justify-center mb-6 text-blue-400"`,
  `className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center mb-6 border border-blue-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(59,130,246,0.4)] text-blue-50 drop-shadow-md"`
);

code = code.replace(
  `className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600"`,
  `className="w-12 h-12 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 flex items-center justify-center mb-6 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] text-indigo-50 drop-shadow-md"`
);

code = code.replace(
  `className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-6 text-neutral-500"`,
  `className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md"`
);

code = code.replace(
  `className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-6 text-neutral-500"`,
  `className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md"`
);

code = code.replace(
  `className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-6 text-neutral-500"`,
  `className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md"`
);

// Back button
code = code.replace(
  `className="p-2 -ml-2 text-neutral-500 hover:text-neutral-100 transition-colors"`,
  `className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"`
);
// Drop shadow on the back icon
code = code.replace(
  `<ArrowLeft className="w-6 h-6" />`,
  `<ArrowLeft className="w-5 h-5 drop-shadow-md" />`
);

fs.writeFileSync('src/screens/Instruction.tsx', code);
console.log("Patched Instruction.tsx");

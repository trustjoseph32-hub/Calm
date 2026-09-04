const fs = require('fs');
let code = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf8');

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

// Start button
code = code.replace(
  `className="w-full py-5 rounded-full bg-red-500 text-white text-xl font-medium transition-transform active:scale-[0.98] hover:bg-red-600 shadow-md shadow-red-500/20 flex justify-center items-center gap-2"`,
  `className="w-full py-5 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 text-white text-xl font-medium transition-transform active:scale-[0.98] border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)] drop-shadow-md flex justify-center items-center gap-2"`
);
// Drop shadow on Play icon
code = code.replace(
  `<Play className="w-6 h-6 fill-white" />`,
  `<Play className="w-6 h-6 fill-red-100 drop-shadow-md" />`
);

// Sound toggle buttons
const activeClassOld = `'bg-neutral-200 text-neutral-900 shadow-md'`;
const activeClassNew = `'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md'`;
const inactiveClassOld = `'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:border-neutral-600'`;
const inactiveClassNew = `'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'`;

code = code.split(activeClassOld).join(activeClassNew);
code = code.split(inactiveClassOld).join(inactiveClassNew);

// Adjust sound buttons container gap
code = code.replace(
  `className="grid grid-cols-2 sm:grid-cols-4 gap-2"`,
  `className="grid grid-cols-2 sm:grid-cols-4 gap-3"`
);

// We need to add border to the button base classes in SosInstruction
code = code.replace(
  `className={\`py-3 rounded-2xl text-sm font-medium transition-all \${`,
  `className={\`py-3 rounded-2xl text-sm font-medium transition-all border \${`
);
code = code.replace(
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all \${`,
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border \${`
);
code = code.replace(
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all \${`,
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border \${`
);
code = code.replace(
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all \${`,
  `className={\`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border \${`
);


fs.writeFileSync('src/screens/SosInstruction.tsx', code);
console.log("Patched SosInstruction.tsx");

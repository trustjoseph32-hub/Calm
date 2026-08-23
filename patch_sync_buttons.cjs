const fs = require('fs');

let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

code = code.replace(
  /bg-neutral-50 text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-800 transition-colors shadow-md/g,
  "bg-neutral-900 text-white rounded-full font-medium text-lg hover:bg-neutral-800 transition-colors shadow-md"
);

code = code.replace(
  /p-3 bg-white\/50 border border-neutral-200 hover:bg-neutral-800 backdrop-blur-md rounded-full text-neutral-500/g,
  "p-3 bg-white/50 border border-neutral-200 hover:bg-white backdrop-blur-md rounded-full text-neutral-600 hover:text-neutral-900"
);

code = code.replace(
  /hover:bg-neutral-100 mt-4/g,
  "hover:bg-neutral-100 transition-colors mt-4"
);

code = code.replace(
  /text-neutral-500 transition-colors text-sm/g,
  "text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);


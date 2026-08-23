const fs = require('fs');

function fixToggles(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix toggles
  code = code.replace(/peer-checked:bg-neutral-800/g, "peer-checked:bg-neutral-400");
  code = code.replace(/after:bg-neutral-800/g, "after:bg-white");

  // Fix "Удалить мои данные" button
  code = code.replace(/border-red-200 text-red-600 bg-red-950\/30 hover:bg-red-100/g, "border-red-900/50 text-red-400 bg-red-950/30 hover:bg-red-900/30");

  fs.writeFileSync(filename, code);
}

fixToggles('src/screens/Settings.tsx');
fixToggles('src/screens/SynchronizedSetup.tsx');


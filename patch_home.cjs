const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

const importStr = "import { useAppStore } from '../store/AppProvider';";
code = code.replace(importStr, importStr + "\nimport { Logo } from '../components/Logo';");

const headerOld = `        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Panic Attack Club</h1>
          <p className="text-sm text-neutral-500 mt-1">Спокойно, без паники</p>
        </div>`;
const headerNew = `        <div className="flex items-center gap-3">
          <div className="text-indigo-400">
            <Logo className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Panic Attack Club</h1>
            <p className="text-sm text-neutral-500 mt-1">Спокойно, без паники</p>
          </div>
        </div>`;
        
code = code.replace(headerOld, headerNew);

fs.writeFileSync('src/screens/Home.tsx', code);

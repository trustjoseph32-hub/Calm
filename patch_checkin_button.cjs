const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

const targetStr = `<button 
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white font-medium transition-all active:scale-[0.98] border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]"
          >
            Сохранить состояние
          </button>`;

const replacement = `<button 
            onClick={handleSubmit}
            disabled={anxiety === null || physical === null || emotional === null || thoughts === null}
            className={\`w-full py-4 rounded-full text-white font-medium transition-all active:scale-[0.98] border shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.4)] drop-shadow-md hover:scale-[1.02] \${anxiety === null || physical === null || emotional === null || thoughts === null ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 border-indigo-300/40'}\`}
          >
            Сохранить состояние
          </button>`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Patched Checkin button");

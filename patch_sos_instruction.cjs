const fs = require('fs');
let code = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf8');

const targetStr1 = `  const [anxietyBefore, setAnxietyBefore] = useState<number | null>(null);

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
        anxietyBefore: anxietyBefore,
      }
    });
  };`;

const replacement1 = `  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
      }
    });
  };`;

const targetStr2 = `      </header>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-neutral-100 mb-2 text-center">Оценка состояния</h2>
        <p className="text-sm text-neutral-400 text-center mb-6">Насколько сильное напряжение сейчас?</p>
        <div className="px-2">
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={anxietyBefore === null ? 5 : anxietyBefore} 
            onChange={(e) => setAnxietyBefore(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
            <span>0</span>
            <span>10</span>
          </div>
          <div className="text-4xl font-light mt-6 text-center text-neutral-100">
            {anxietyBefore === null ? '-' : anxietyBefore}
          </div>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col justify-center gap-12 max-w-md mx-auto w-full pb-12">`;

const replacement2 = `      </header>
      
      <main className="flex-1 flex flex-col justify-center gap-12 max-w-md mx-auto w-full pb-12">`;

code = code.replace(targetStr1, replacement1);
code = code.replace(targetStr2, replacement2);

fs.writeFileSync('src/screens/SosInstruction.tsx', code);
console.log("Patched SosInstruction.tsx");

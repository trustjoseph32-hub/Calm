const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

const oldIconsBlock = `<SliderField 
            icon={<Activity className="w-5 h-5 text-indigo-400" />}
            title="Тревожность"
            description="От полного спокойствия (0) до паники (10)"
            value={anxiety} 
            setValue={setAnxiety} 
          />
          <SliderField 
            icon={<ActivitySquare className="w-5 h-5 text-orange-400" />}
            title="Физическое напряжение"
            description="От расслабленности (0) до скованности в теле (10)"
            value={physical} 
            setValue={setPhysical} 
          />
          <SliderField 
            icon={<Heart className="w-5 h-5 text-pink-400" />}
            title="Эмоциональный фон"
            description="От подавленного (0) до радостного (10)"
            value={emotional} 
            setValue={setEmotional} 
          />
          <SliderField 
            icon={<BrainCircuit className="w-5 h-5 text-emerald-400" />}
            title="Навязчивые мысли"
            description="От ясной головы (0) до мысленной «жвачки» (10)"
            value={thoughts} 
            setValue={setThoughts} 
          />`;

const newIconsBlock = `<SliderField 
            icon={<Activity className="w-5 h-5 drop-shadow-md text-indigo-50" />}
            color="indigo"
            title="Тревожность"
            description="От полного спокойствия (0) до паники (10)"
            value={anxiety} 
            setValue={setAnxiety} 
          />
          <SliderField 
            icon={<ActivitySquare className="w-5 h-5 drop-shadow-md text-orange-50" />}
            color="orange"
            title="Физическое напряжение"
            description="От расслабленности (0) до скованности в теле (10)"
            value={physical} 
            setValue={setPhysical} 
          />
          <SliderField 
            icon={<Heart className="w-5 h-5 drop-shadow-md text-pink-50" />}
            color="pink"
            title="Эмоциональный фон"
            description="От подавленного (0) до радостного (10)"
            value={emotional} 
            setValue={setEmotional} 
          />
          <SliderField 
            icon={<BrainCircuit className="w-5 h-5 drop-shadow-md text-emerald-50" />}
            color="emerald"
            title="Навязчивые мысли"
            description="От ясной головы (0) до мысленной «жвачки» (10)"
            value={thoughts} 
            setValue={setThoughts} 
          />`;

code = code.replace(oldIconsBlock, newIconsBlock);

const oldSliderFunc = `function SliderField({ icon, title, description, value, setValue }: { 
  icon: React.ReactNode, title: string, description: string, value: number, setValue: (v: number) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 bg-neutral-900 rounded-lg">
          {icon}
        </div>`;

const newSliderFunc = `function SliderField({ icon, color, title, description, value, setValue }: { 
  icon: React.ReactNode, color: 'indigo'|'orange'|'pink'|'emerald', title: string, description: string, value: number, setValue: (v: number) => void 
}) {
  const getGradients = () => {
    switch(color) {
      case 'indigo': return 'from-indigo-400 via-indigo-600 to-indigo-800 border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)]';
      case 'orange': return 'from-orange-400 via-orange-500 to-orange-700 border-orange-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(249,115,22,0.4)]';
      case 'pink': return 'from-pink-400 via-pink-600 to-pink-800 border-pink-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(236,72,153,0.4)]';
      case 'emerald': return 'from-emerald-400 via-emerald-600 to-emerald-800 border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)]';
      default: return 'from-neutral-500 via-neutral-600 to-neutral-800 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={\`mt-1 w-10 h-10 rounded-full bg-gradient-to-b flex items-center justify-center shrink-0 border \${getGradients()}\`}>
          {icon}
        </div>`;
code = code.replace(oldSliderFunc, newSliderFunc);

const oldInput = `<input 
          type="range" 
          min="0" 
          max="10" 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />`;

// Custom thumb styles + lighter track. We drop accent-color because we use custom pseudo-elements for appearance-none
const thumbStyles = `[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-gray-100 [&::-moz-range-thumb]:to-gray-300 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/50 [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)]`;

const newInput = `<input 
          type="range" 
          min="0" 
          max="10" 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className={\`w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer \${thumbStyles}\`}
        />`;

code = code.replace(oldInput, newInput);

fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Patched Checkin.tsx");

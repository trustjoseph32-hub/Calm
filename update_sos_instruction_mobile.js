import fs from 'node:fs';

const content = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Waves, CloudRain, Wind, VolumeX } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function SosInstruction() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppStore();

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
      }
    });
  };

  return (
    <div className="flex-1 w-full h-[100dvh] relative bg-[#050B14] overflow-hidden font-sans flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center px-4 py-3 md:py-6 md:px-8 w-full max-w-7xl mx-auto shrink-0">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md shrink-0"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <h1 className="text-lg md:text-2xl font-light text-white ml-3 md:ml-4 tracking-tight">Скорая помощь</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1 flex flex-col justify-between px-4 md:px-8 w-full max-w-3xl mx-auto pb-4 md:pb-8 overflow-y-auto scrollbar-hide gap-3 md:gap-6">
        
        <div className="w-full p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0A1325]/80 border border-red-500/20 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-4 md:gap-8">
            {/* Step 1 */}
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-medium shrink-0 text-xs md:text-sm mt-0.5">1</div>
              <p className="text-white/80 font-light text-[13px] md:text-lg leading-snug md:leading-relaxed">
                Дышите вместе с расширяющимся кругом двойным вдохом носом (Вдох-доВдох) и выдохом ртом.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-medium shrink-0 text-xs md:text-sm mt-0.5">2</div>
              <div className="flex flex-col gap-3 md:gap-6 w-full">
                <p className="text-white/80 font-light text-[13px] md:text-lg leading-snug md:leading-relaxed">
                  Направляйте взгляд вместе с шариком до самого конца и до небольшого ощущения напряжения в мышцах глаз в крайних точках.
                </p>
                
                {/* Modern Flat Eyes Animation */}
                <div className="flex justify-center w-full">
                  <div className="flex gap-4 md:gap-6">
                    {/* Left Eye */}
                    <div className="w-12 h-6 md:w-16 md:h-8 bg-white/10 border border-white/20 rounded-[50%] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                      <motion.div
                        animate={{ x: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-400/50 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-black/80 rounded-full" />
                      </motion.div>
                    </div>
                    {/* Right Eye */}
                    <div className="w-12 h-6 md:w-16 md:h-8 bg-white/10 border border-white/20 rounded-[50%] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                      <motion.div
                        animate={{ x: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-400/50 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-black/80 rounded-full" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-medium shrink-0 text-xs md:text-sm mt-0.5">3</div>
              <p className="text-white/80 font-light text-[13px] md:text-lg leading-snug md:leading-relaxed">
                На вдохе зажимайте ладони в кулаки, на выдохе расслабляйте.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-6 mt-auto">
          {/* Audio Settings */}
          <div className="w-full p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0A1325]/80 border border-blue-500/10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-white/90 text-sm md:text-lg font-medium mb-3 md:mb-4">Звуковое сопровождение</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'none', syncBilateralAudio: false })}
                className={\`py-2.5 px-3 md:py-3 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all border flex justify-center items-center gap-2 \${
                  settings.syncAmbientSound === 'none' && !settings.syncBilateralAudio
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                }\`}
              >
                <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" /> Тишина
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'wind', syncBilateralAudio: true })}
                className={\`py-2.5 px-3 md:py-3 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all border flex justify-center items-center gap-2 \${
                  settings.syncAmbientSound === 'wind'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                }\`}
              >
                <Wind className="w-3.5 h-3.5 md:w-4 md:h-4" /> Ветер
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'rain', syncBilateralAudio: true })}
                className={\`py-2.5 px-3 md:py-3 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all border flex justify-center items-center gap-2 \${
                  settings.syncAmbientSound === 'rain'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                }\`}
              >
                <CloudRain className="w-3.5 h-3.5 md:w-4 md:h-4" /> Дождь
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'sea', syncBilateralAudio: true })}
                className={\`py-2.5 px-3 md:py-3 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all border flex justify-center items-center gap-2 \${
                  settings.syncAmbientSound === 'sea'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                }\`}
              >
                <Waves className="w-3.5 h-3.5 md:w-4 md:h-4" /> Море
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 md:py-5 rounded-full bg-white text-slate-900 text-base md:text-xl font-medium transition-transform active:scale-[0.98] hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex justify-center items-center gap-2 md:gap-3 shrink-0"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-slate-900" />
            Начать
          </button>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/screens/SosInstruction.tsx', content);

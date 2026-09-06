import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Waves, CloudRain, Wind } from 'lucide-react';
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
    <div className="flex-1 flex flex-col px-4 py-4 sm:py-8 max-w-2xl mx-auto w-full h-full min-h-[100svh]">
      <header className="flex items-center mb-4 sm:mb-8">
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md" />
        </button>
        <h1 className="text-lg sm:text-xl font-medium ml-2 sm:ml-4 text-neutral-100">
          Скорая помощь
        </h1>
      </header>
      
      <main className="flex-1 flex flex-col justify-center gap-4 sm:gap-8 max-w-md mx-auto w-full pb-4 sm:pb-8">
        <div className="flex gap-6 items-start">
          <div className="text-2xl sm:text-4xl font-light text-neutral-500">1</div>
          <p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">
            Дышите вместе с расширяющимся кругом двойным вдохом носом (Вдох-доВдох) и выдохом ртом.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          <div className="text-2xl sm:text-4xl font-light text-neutral-500">2</div>
          <p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">
            Направляйте взгляд вместе с шариком до самого конца и до небольшого ощущения напряжения в мышцах глаз в крайних точках.
          </p>
        </div>
        
        <div className="flex justify-center w-full mt-[-0.5rem] sm:mt-[-1rem]">
          <div className="flex gap-4 sm:gap-8">
            {/* Left Eye */}
            <div className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
              <motion.div
                animate={{ x: [-18, 18, -18] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
              >
                {/* Pupil */}
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
                {/* Catchlight */}
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full absolute top-1.5 right-1.5 sm:top-2 sm:right-2 blur-[0.5px]" />
              </motion.div>
              {/* Eyelid shadow overlay */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Right Eye */}
            <div className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
              <motion.div
                animate={{ x: [-18, 18, -18] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/80 rounded-full absolute top-1.5 right-1.5 sm:top-2 sm:right-2 blur-[0.5px]" />
              </motion.div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="text-2xl sm:text-4xl font-light text-neutral-500">3</div>
          <p className="text-lg sm:text-2xl font-medium text-neutral-100 leading-tight">
            На вдохе зажимайте ладони в кулаки, на выдохе расслабляйте.
          </p>
        </div>
      </main>

      <div className="mt-auto pt-2 sm:pt-6 flex flex-col gap-3 sm:gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider px-2">Звуковое сопровождение</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => updateSettings({ syncAmbientSound: 'none', syncBilateralAudio: false })}
              className={`py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-medium transition-all border ${
                settings.syncAmbientSound === 'none' && !settings.syncBilateralAudio
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              Тишина
            </button>
            <button
              onClick={() => updateSettings({ syncAmbientSound: 'wind', syncBilateralAudio: true })}
              className={`py-2 sm:py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncAmbientSound === 'wind'
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              <Wind className="w-4 h-4" /> Ветер
            </button>
            <button
              onClick={() => updateSettings({ syncAmbientSound: 'rain', syncBilateralAudio: true })}
              className={`py-2 sm:py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncAmbientSound === 'rain'
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              <CloudRain className="w-4 h-4" /> Дождь
            </button>
            <button
              onClick={() => updateSettings({ syncAmbientSound: 'sea', syncBilateralAudio: true })}
              className={`py-2 sm:py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncAmbientSound === 'sea'
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              <Waves className="w-4 h-4" /> Море
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3 sm:py-5 rounded-full mt-2 sm:mt-0 bg-gradient-to-b from-red-400 via-red-600 to-red-800 text-white text-xl font-medium transition-transform active:scale-[0.98] border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)] drop-shadow-md flex justify-center items-center gap-2"
        >
          <Play className="w-6 h-6 fill-red-100 drop-shadow-md" />
          Начать
        </button>
      </div>
    </div>
  );
}

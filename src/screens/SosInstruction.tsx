import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        anxietyBefore: 10,
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full min-h-screen">
      <header className="flex items-center mb-12">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Скорая помощь
        </h1>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-12 max-w-md mx-auto w-full pb-12">
        <div className="flex gap-6 items-start">
          <div className="text-4xl font-light text-neutral-500">1</div>
          <p className="text-2xl font-medium text-neutral-100 leading-tight">
            Дышите вместе с расширяющимся кругом.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          <div className="text-4xl font-light text-neutral-500">2</div>
          <p className="text-2xl font-medium text-neutral-100 leading-tight">
            Направляйте взгляд вместе с шариком до самого конца и до немного болевых ощущений.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          <div className="text-4xl font-light text-neutral-500">3</div>
          <p className="text-2xl font-medium text-neutral-100 leading-tight">
            На вдохе зажимайте ладони в кулаки, на выдохе расслабляйте.
          </p>
        </div>
      </main>

      <div className="mt-auto pt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider px-2">Звуковое сопровождение</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'none', syncBilateralAudio: false })}
              className={`py-3 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncBackgroundNoise === 'none' && !settings.syncBilateralAudio
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              Тишина
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'wind', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncBackgroundNoise === 'wind'
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              <Wind className="w-4 h-4" /> Ветер
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'rain', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncBackgroundNoise === 'rain'
                  ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                  : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600/40 text-neutral-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
              }`}
            >
              <CloudRain className="w-4 h-4" /> Дождь
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'sea', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all border ${
                settings.syncBackgroundNoise === 'sea'
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
          className="w-full py-5 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 text-white text-xl font-medium transition-transform active:scale-[0.98] border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)] drop-shadow-md flex justify-center items-center gap-2"
        >
          <Play className="w-6 h-6 fill-red-100 drop-shadow-md" />
          Начать
        </button>
      </div>
    </div>
  );
}

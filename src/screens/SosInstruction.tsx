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
          className="p-2 -ml-2 text-neutral-500 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'none', syncBilateralAudio: false })}
              className={`py-3 rounded-2xl text-sm font-medium transition-all ${
                settings.syncBackgroundNoise === 'none' && !settings.syncBilateralAudio
                  ? 'bg-neutral-200 text-neutral-900 shadow-md' 
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:border-neutral-600'
              }`}
            >
              Тишина
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'wind', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all ${
                settings.syncBackgroundNoise === 'wind'
                  ? 'bg-neutral-200 text-neutral-900 shadow-md' 
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:border-neutral-600'
              }`}
            >
              <Wind className="w-4 h-4" /> Ветер
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'rain', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all ${
                settings.syncBackgroundNoise === 'rain'
                  ? 'bg-neutral-200 text-neutral-900 shadow-md' 
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:border-neutral-600'
              }`}
            >
              <CloudRain className="w-4 h-4" /> Дождь
            </button>
            <button
              onClick={() => updateSettings({ syncBackgroundNoise: 'sea', syncBilateralAudio: true })}
              className={`py-3 flex justify-center items-center gap-2 rounded-2xl text-sm font-medium transition-all ${
                settings.syncBackgroundNoise === 'sea'
                  ? 'bg-neutral-200 text-neutral-900 shadow-md' 
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:border-neutral-600'
              }`}
            >
              <Waves className="w-4 h-4" /> Море
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-5 rounded-full bg-red-500 text-white text-xl font-medium transition-transform active:scale-[0.98] hover:bg-red-600 shadow-md shadow-red-500/20 flex justify-center items-center gap-2"
        >
          <Play className="w-6 h-6 fill-white" />
          Начать
        </button>
      </div>
    </div>
  );
}

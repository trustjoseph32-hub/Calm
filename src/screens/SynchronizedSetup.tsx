import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function SynchronizedSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSettings } = useAppStore();
  const anxietyBefore = location.state?.anxietyBefore;

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        anxietyBefore,
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Синхронная практика
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Структура практики</h2>
            <p className="text-sm text-neutral-500">Практика состоит из 5 фаз по 1.5 минуты с короткими паузами.</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-neutral-500">
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 1: Горизонтальное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-400"></div> Фаза 2: Вертикальное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 3: Треугольное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-400"></div> Фаза 4: Диагональное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 5: Слежение восьмеркой</div>
          </div>
        </section>

        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Дыхание</h2>
            <div className="flex items-start gap-2 bg-neutral-900 p-3 rounded-xl mt-2 text-sm text-neutral-500">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
              <p>Дыши комфортно. Не нужно делать максимально глубокий вдох.</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-neutral-100">Вдох и выдох (секунды)</span>
            <select 
              value={settings.syncInhaleDuration}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ syncInhaleDuration: val, syncExhaleDuration: val });
              }}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-500"
            >
              {[1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(n => <option key={n} value={n}>{n} с</option>)}
            </select>
          </div>
        </section>

        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Звук</h2>
          </div>
          
          <div className="flex gap-3">
             <button
                onClick={() => updateSettings({ syncBilateralAudio: false })}
                className={`flex-1 py-3 rounded-2xl border text-sm transition-all ${
                  !settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Без звука
              </button>
              <button
                onClick={() => updateSettings({ syncBilateralAudio: true })}
                className={`flex-1 py-3 rounded-2xl border text-sm transition-all ${
                  settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Билатеральный звук
              </button>
          </div>

          {(settings.syncBilateralAudio || settings.syncBackgroundNoise !== 'none') && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 mt-4">
               {settings.syncBilateralAudio && (
                 <div className="flex items-start gap-2 bg-neutral-900 p-3 rounded-xl text-sm text-neutral-500">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
                    <p>Для правильного эффекта используй наушники.</p>
                  </div>
               )}
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Громкость звука</span>
                    <span className="text-neutral-100 font-medium">{settings.syncVolume}%</span>
                 </div>
                 <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.syncVolume}
                    onChange={(e) => updateSettings({ syncVolume: Number(e.target.value) })}
                    className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
               </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-700 mt-2">
            <h3 className="text-sm font-medium text-neutral-100">Фоновый шум</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ syncBackgroundNoise: 'none' })}
                className={`py-2 rounded-xl border text-sm transition-all ${
                  settings.syncBackgroundNoise === 'none'
                    ? 'border-neutral-800 bg-neutral-200 text-neutral-900' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Без шума
              </button>
              <button
                onClick={() => updateSettings({ syncBackgroundNoise: 'wind' })}
                className={`py-2 rounded-xl border text-sm transition-all ${
                  settings.syncBackgroundNoise === 'wind'
                    ? 'border-neutral-800 bg-neutral-200 text-neutral-900' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Ветер
              </button>
              <button
                onClick={() => updateSettings({ syncBackgroundNoise: 'rain' })}
                className={`py-2 rounded-xl border text-sm transition-all ${
                  settings.syncBackgroundNoise === 'rain'
                    ? 'border-neutral-800 bg-neutral-200 text-neutral-900' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Дождь
              </button>
              <button
                onClick={() => updateSettings({ syncBackgroundNoise: 'sea' })}
                className={`py-2 rounded-xl border text-sm transition-all ${
                  settings.syncBackgroundNoise === 'sea'
                    ? 'border-neutral-800 bg-neutral-200 text-neutral-900' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Море
              </button>
            </div>
          </div>
        </section>

        <button
          onClick={handleStart}
          className="mt-4 w-full py-4 rounded-full bg-white text-neutral-900 text-lg font-medium transition-transform active:scale-[0.98] hover:bg-neutral-200 shadow-md flex justify-center items-center gap-2"
        >
          <Play className="w-5 h-5 fill-indigo-100 drop-shadow-md" />
          Начать
        </button>
      </main>
    </div>
  );
}
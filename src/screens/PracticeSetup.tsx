import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Wind, ScanEye, Activity } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function PracticeSetup() {
  const { type } = useParams<{ type: string }>(); // 'relief', 'breathing', 'bilateral', 'combined'
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useAppStore();
  
  const [durationStr, setDurationStr] = useState<string>('3'); // minutes
  const anxietyBefore = location.state?.anxietyBefore;

  const isRelief = type === 'relief';

  const handleStart = (practiceType: string) => {
    navigate('/practice/active', {
      state: {
        type: practiceType,
        durationSeconds: parseInt(durationStr) * 60,
        anxietyBefore,
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          {isRelief ? 'Выбор практики' : 'Настройка времени'}
        </h1>
      </header>

      <main className="flex-1 flex flex-col">
        {!isRelief && (
          <div className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 mb-8">
            <h2 className="text-lg font-medium text-neutral-100 mb-6 text-center">Сколько времени есть сейчас?</h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['1', '2', '3', '5'].map(min => (
                <button
                  key={min}
                  onClick={() => setDurationStr(min)}
                  className={`py-4 rounded-2xl border text-lg transition-all ${
                    durationStr === min 
                      ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                      : 'border-white/10 text-slate-500 hover:border-neutral-400'
                  }`}
                >
                  {min} мин
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handleStart(type || 'breathing')}
              className="w-full py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white text-lg font-medium transition-all active:scale-[0.98] border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02] flex justify-center items-center gap-2"
            >
              <Play className="w-5 h-5 fill-indigo-100 drop-shadow-md" />
              Начать
            </button>
          </div>
        )}

        {isRelief && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 p-6 rounded-3xl shadow-sm border border-white/10 flex flex-col gap-6 mb-4">
              <h2 className="text-base text-slate-500 font-medium text-center uppercase tracking-wider text-sm">Выбери, что хочется сделать</h2>
              <button 
                onClick={() => handleStart('breathing')}
                className="flex items-start text-left p-4 rounded-2xl border border-white/10 hover:border-neutral-600 hover:shadow-sm transition-all group bg-transparent"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] mt-1">
                  <Wind className="w-6 h-6 drop-shadow-md text-slate-400" strokeWidth={1.5} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-100 group-hover:text-white">Спокойное дыхание</h3>
                  <p className="text-sm text-slate-500 mt-1">3 минуты. Только дыхательный круг. Помогает немного замедлиться.</p>
                </div>
              </button>

              <button 
                onClick={() => handleStart('bilateral')}
                className="flex items-start text-left p-4 rounded-2xl border border-white/10 hover:border-neutral-600 hover:shadow-sm transition-all group bg-transparent"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] mt-1">
                  <Activity className="w-6 h-6 drop-shadow-md text-slate-400" strokeWidth={1.5} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-100 group-hover:text-white">Визуальное слежение</h3>
                  <p className="text-sm text-slate-500 mt-1">Только движение. Помогает, когда сложно контролировать дыхание.</p>
                </div>
              </button>

              <button 
                onClick={() => handleStart('combined')}
                className="flex items-start text-left p-4 rounded-2xl border border-white/10 hover:border-neutral-600 hover:shadow-sm transition-all group bg-transparent"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-blue-100/80 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] mt-1">
                  <ScanEye className="w-6 h-6 drop-shadow-md text-slate-400" strokeWidth={1.5} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-neutral-100 group-hover:text-white">Переключение внимания</h3>
                  <p className="text-sm text-slate-500 mt-1">Движение и дыхание вместе.</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/practice/setup/synchronized', { state: { anxietyBefore } })}
                className="flex items-start text-left p-4 rounded-2xl border border-white/10 hover:bg-neutral-200 group hover:text-white transition-all bg-white/10 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-indigo-50 flex items-center justify-center shrink-0 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md mt-1">
                  <Activity className="w-6 h-6 drop-shadow-md text-slate-400" strokeWidth={1.5} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white group-hover:text-white transition-colors">Синхронная практика</h3>
                  <p className="text-sm text-slate-500 group-hover:text-slate-500 transition-colors mt-1">Горизонтальное, вертикальное и треугольное слежение в течение 3 минут.</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

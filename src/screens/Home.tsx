import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wind, ScanEye, Calendar, Settings, Activity, BookOpen, Zap } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function Home() {
  const navigate = useNavigate();
  const { courseProgress } = useAppStore();
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);

  const handleStart = () => {
    // Navigating to quick relief options passing the pre-anxiety score
    navigate('/practice/setup/relief', { state: { anxietyBefore: anxietyLevel } });
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full min-h-screen">
      <header className="w-full flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Panic Attack Club</h1>
          <p className="text-sm text-neutral-500 mt-1">Дыхание. Фокус. Движение.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/progress')} className="p-2 text-neutral-500 hover:text-neutral-100 transition-colors" aria-label="Progress">
            <Activity className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 text-neutral-500 hover:text-neutral-100 transition-colors" aria-label="Settings">
            <Settings className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col justify-center gap-6 pb-20">
        <button 
          onClick={() => navigate('/sos')}
          className="flex flex-col text-left bg-red-950/30 p-8 rounded-[2rem] shadow-sm border border-red-900/50 hover:border-red-800/50 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-red-500/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
              <Zap className="w-8 h-8 fill-current" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-red-100">Скорая помощь (SOS)</h3>
              <p className="text-base text-red-200/70 mt-2">Экстренная практика для быстрого снижения тревоги</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/course')}
          className="flex flex-col text-left bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-neutral-700 hover:border-neutral-700 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-900/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-neutral-900/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-neutral-700 text-neutral-500 flex items-center justify-center shrink-0">
              <Calendar className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-neutral-100">Пройти курс</h3>
              <p className="text-base text-neutral-500 mt-2">День {courseProgress.currentDay} из 14</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/instruction')}
          className="flex flex-col text-left bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-neutral-700 hover:border-neutral-700 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-blue-900/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-blue-950/30 text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-neutral-100">Инструкция</h3>
              <p className="text-base text-neutral-500 mt-2">Как работают практики</p>
            </div>
          </div>
        </button>
      </main>

      <p className="text-xs text-center text-neutral-500 mt-auto pb-4 max-w-sm mx-auto">
        Практики предназначены для саморегуляции и не заменяют профессиональную психологическую или медицинскую помощь.
      </p>
    </div>
  );
}

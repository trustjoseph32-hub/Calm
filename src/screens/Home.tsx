import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wind, ScanEye, Calendar, Settings, Activity, BookOpen, Zap, Pill } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { Logo } from '../components/Logo';

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
        <div className="flex items-center gap-3">
          <div className="text-indigo-400">
            <Logo className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-br from-indigo-400 to-indigo-200 bg-clip-text text-transparent">Panic Attack Club</h1>
            <p className="text-sm text-neutral-500 mt-1">Спокойно, без паники</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/progress')} className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all" aria-label="Progress">
            <Activity className="w-5 h-5 drop-shadow-md" strokeWidth={1.5} />
          </button>
          <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all" aria-label="Settings">
            <Settings className="w-5 h-5 drop-shadow-md" strokeWidth={1.5} />
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 text-white flex items-center justify-center shrink-0 border border-red-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(220,38,38,0.4)]">
              <Zap className="w-8 h-8 fill-red-100 drop-shadow-md" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-red-100">Скорая помощь (SOS)</h3>
              <p className="text-base text-red-200/70 mt-2">Экстренная практика для быстрого снижения тревоги</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/course')}
          className="flex flex-col text-left bg-indigo-950/20 p-8 rounded-[2rem] shadow-sm border border-indigo-900/40 hover:border-indigo-800/50 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white flex items-center justify-center shrink-0 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)]">
              <Pill className="w-8 h-8 text-indigo-50 fill-indigo-200/20 drop-shadow-md" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-indigo-100">Пройти курс</h3>
              <p className="text-base text-indigo-200/70 mt-2">День {courseProgress.currentDay} из 14</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/instruction')}
          className="flex flex-col text-left bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-neutral-700 hover:border-neutral-700 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-blue-900/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]">
              <BookOpen className="w-8 h-8 drop-shadow-md" strokeWidth={1.5} />
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

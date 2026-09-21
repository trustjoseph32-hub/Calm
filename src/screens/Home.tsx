import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, BookOpen, Lock, Play, Check } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function Home() {
  const navigate = useNavigate();
  const { courseProgress } = useAppStore();
  const [showSosLockMessage, setShowSosLockMessage] = useState(false);
  
  const hasCompletedDay1 = courseProgress.completedDays.includes(1);

  const handleSosClick = () => {
    if (!hasCompletedDay1) {
      setShowSosLockMessage(true);
      setTimeout(() => setShowSosLockMessage(false), 3000);
      return;
    }
    navigate('/sos');
  };

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 py-4 sm:py-8 w-full h-full min-h-[100svh] relative max-w-6xl mx-auto overflow-hidden">
      
      {/* Background ambient glowing orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full border border-blue-400/20 shadow-[0_0_80px_rgba(56,189,248,0.1)] blur-[2px] opacity-30 flex items-center justify-center">
          <div className="w-[50vw] h-[50vw] rounded-full border border-blue-400/10" />
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showSosLockMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-max bg-slate-900/90 text-slate-200 p-4 rounded-2xl border border-slate-700 shadow-xl z-50 text-center text-sm font-medium"
          >
            Сначала завершите День 1 в курсе, чтобы разблокировать Скорую помощь.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full flex justify-between items-center mb-4 sm:mb-12 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
            {/* Radiating waves */}
            <motion.div
              className="absolute w-full h-full rounded-full border-[1.5px] border-blue-400/60"
              animate={{
                scale: [0.4, 1, 2.5],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.2, 1],
              }}
            />
            <motion.div
              className="absolute w-full h-full rounded-full border-[1.5px] border-cyan-400/50"
              animate={{
                scale: [0.4, 1, 2.5],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: 2,
                times: [0, 0.2, 1],
              }}
            />
            
            {/* Breathing cloudy bubble */}
            <motion.div
              className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full blur-[3px] mix-blend-screen"
              animate={{
                scale: [0.85, 1.15, 0.85],
                opacity: [0.7, 1, 0.7],
                backgroundColor: ['rgba(255,255,255,0.9)', 'rgba(59,130,246,0.9)', 'rgba(255,255,255,0.9)'],
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.9)',
                  '0 0 20px rgba(59,130,246,0.9)',
                  '0 0 20px rgba(255,255,255,0.9)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full blur-[1px] mix-blend-screen"
              animate={{
                scale: [0.9, 1.1, 0.9],
                backgroundColor: ['rgba(255,255,255,1)', 'rgba(103,232,249,0.9)', 'rgba(255,255,255,1)'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-medium tracking-wide text-slate-100 leading-tight">Panic Attack Club</h1>
            <p className="text-[9px] sm:text-xs text-blue-100/40 uppercase tracking-widest mt-0.5">Спокойно, без паники</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/progress')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Progress">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200/70" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col justify-center z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-6 sm:mb-16 relative">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
              Создаём ваш навык спокойствия
            </h2>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto w-full">
          
          {/* SOS Button */}
          <button 
            onClick={handleSosClick}
            className={`relative overflow-hidden flex items-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border transition-all duration-300 group text-left active:scale-[0.98] ${
              hasCompletedDay1 
                ? 'bg-[#1a1114]/80 border-red-900/30 hover:bg-[#201518]/90 hover:border-red-900/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                : 'bg-white/5 border-white/5 opacity-70'
            }`}
          >
            {hasCompletedDay1 && (
              <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-700 ease-in-out pointer-events-none z-0" />
            )}
            <div className="flex items-center gap-4 sm:gap-5 relative z-10">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border border-dashed ${
                hasCompletedDay1
                  ? 'border-red-500/50 text-red-400 bg-red-500/10'
                  : 'border-white/20 text-white/50 bg-white/5'
              }`}>
                {hasCompletedDay1 ? (
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider">SOS</span>
                ) : (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                )}
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-medium mb-0.5 sm:mb-1 ${hasCompletedDay1 ? 'text-white' : 'text-white/70'}`}>
                  {hasCompletedDay1 ? 'SOS' : 'Скорая помощь'}
                </h3>
                <p className={`text-xs sm:text-sm font-light leading-tight ${hasCompletedDay1 ? 'text-red-300/80' : 'text-white/40'}`}>
                  {hasCompletedDay1 ? 'Скорая помощь' : 'Доступно после Дня 1'}
                </p>
                {hasCompletedDay1 && (
                  <p className="text-[10px] sm:text-[11px] text-red-300/50 mt-0.5">когда тревога рядом</p>
                )}
              </div>
            </div>
          </button>

          {/* Course Button */}
          <button 
            onClick={() => navigate('/course')}
            className="flex items-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0a1a38]/80 backdrop-blur-md border border-blue-500/20 hover:bg-[#0d2247]/90 hover:border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-300 group text-left relative overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-700 ease-in-out pointer-events-none z-0" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-cyan-400/5 opacity-50 z-0" />
            <div className="flex items-center gap-4 sm:gap-5 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-0.5 sm:mb-1">Пройти курс</h3>
                <p className="text-xs sm:text-sm text-blue-200/70 font-light leading-tight">14 дней к большей</p>
                <p className="text-xs sm:text-sm text-blue-200/70 font-light leading-tight">устойчивости</p>
              </div>
            </div>
          </button>

          {/* Instruction Button */}
          <button 
            onClick={() => navigate('/instruction')}
            className="flex items-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0c1424]/80 backdrop-blur-md border border-white/5 hover:bg-[#121d33]/90 hover:border-white/10 transition-all duration-300 group text-left relative overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-700 ease-in-out pointer-events-none z-0" />
            <div className="flex items-center gap-4 sm:gap-5 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-transparent border border-white/20 text-white/70 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-0.5 sm:mb-1">Инструкция</h3>
                <p className="text-xs sm:text-sm text-white/50 font-light leading-tight">Как пользоваться</p>
                <p className="text-xs sm:text-sm text-white/50 font-light leading-tight">приложением</p>
              </div>
            </div>
          </button>

        </div>
        
        <p className="text-[10px] sm:text-sm font-light text-center text-slate-500/70 mt-8 md:mt-16 mb-0 max-w-2xl mx-auto px-2">
          Практики предназначены для саморегуляции и не заменяют профессиональную психологическую или медицинскую помощь.
        </p>

      </main>
    </div>
  );
}

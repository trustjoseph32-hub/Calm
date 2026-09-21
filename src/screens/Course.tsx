import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { motion } from 'motion/react';
import { useAppStore } from '../store/AppProvider';
import { COURSE_DAYS_DATA, getExposureDurationSec } from '../data/courseData';

const BackgroundEffect = ({ day }: { day: number }) => {
  if (day === 1) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        
        {/* Night Sky / Stars */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        {/* Mountain Silhouette */}
        <div className="absolute right-0 bottom-0 w-[150%] md:w-full h-[60vh] md:h-[90vh] opacity-80 transform translate-x-[20%] md:translate-x-[10%]">
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="mount1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#050B14" />
              </linearGradient>
              <linearGradient id="mount2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#050B14" />
              </linearGradient>
            </defs>
            <path d="M0,800 L0,500 L150,350 L250,450 L400,200 L550,450 L700,100 L850,400 L1000,250 L1000,800 Z" fill="url(#mount1)" />
            <path d="M100,800 L300,400 L450,550 L650,250 L850,500 L1000,350 L1000,800 L100,800 Z" fill="url(#mount2)" />
            <path d="M400,200 L450,280 L420,320 Z" fill="#475569" opacity="0.4" />
            <path d="M700,100 L750,200 L680,250 Z" fill="#64748b" opacity="0.3" />
            <path d="M650,250 L700,350 L630,400 Z" fill="#64748b" opacity="0.2" />
          </svg>
        </div>
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050B14] to-transparent" />
      </div>
    );
  }
  
  if (day % 2 === 0) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] md:top-[10%] right-[-30%] md:right-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] flex items-center justify-center opacity-60 mix-blend-screen">
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 -rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-90" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[100%] h-[100%] rounded-full border-[0.5px] border-[#38bdf8]/10" />
           <div className="absolute w-[60%] h-[60%] rounded-full bg-[#38bdf8]/10 blur-[50px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute top-[15%] right-[10%] md:right-[20%] w-32 md:w-48 h-32 md:h-48 rounded-full border-[0.5px] border-blue-300/40 bg-gradient-to-br from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_30px_rgba(56,189,248,0.3)]" />
      <div className="absolute top-[35%] md:top-[40%] right-[30%] md:right-[40%] w-48 md:w-64 h-48 md:h-64 rounded-full border-[0.5px] border-blue-300/30 bg-gradient-to-tr from-cyan-400/5 to-transparent backdrop-blur-sm shadow-[inset_0_0_40px_rgba(56,189,248,0.2)]" />
      <div className="absolute bottom-[20%] left-[20%] md:left-[30%] w-24 md:w-32 h-24 md:h-32 rounded-full border-[0.5px] border-cyan-300/40 bg-gradient-to-bl from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]" />
    </div>
  );
};

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, skipWaitTime } = useAppStore();
  const [viewingDay, setViewingDay] = useState(courseProgress.currentDay);

  const lesson = COURSE_DAYS_DATA.find(d => d.day === viewingDay) || COURSE_DAYS_DATA[0];
  const isAvailable = viewingDay <= courseProgress.currentDay;
  const isCompleted = courseProgress.completedDays.includes(viewingDay);

  const handleStartDay = () => {
    if (!isAvailable) return;
    if (viewingDay === 1) {
      navigate('/practice/day1');
    } else if (viewingDay === 2) {
      navigate('/practice/day2');
    } else {
      navigate(`/practice/course-day/${viewingDay}`);
    }
  };

  const exposureMin = (getExposureDurationSec(viewingDay) / 60).toFixed(viewingDay <= 3 ? 0 : 1);

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden font-sans flex flex-col">
      <BackgroundEffect day={viewingDay} />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-6 md:px-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <div className="text-[10px] md:text-xs text-white/60 mb-2 font-medium tracking-wider uppercase">
            День {viewingDay} из 14
          </div>
          <div className="flex gap-1 md:gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum < courseProgress.currentDay;
              const isCurrent = dayNum === courseProgress.currentDay;
              return (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isPast 
                      ? "bg-[#38bdf8] w-4 md:w-6" 
                      : isCurrent 
                        ? "bg-[#38bdf8] w-4 md:w-6 shadow-[0_0_8px_rgba(56,189,248,0.8)]" 
                        : "bg-white/10 w-2 md:w-4"
                  }`}
                />
              );
            })}
          </div>
        </div>
        
        <div className="w-10 flex justify-end">
          <span className="hidden md:block text-xs text-white/50 whitespace-nowrap tracking-wide font-light">
            Осталось {Math.max(0, 14 - courseProgress.completedDays.length)} дней
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        
        <div className="flex-1 flex flex-col justify-end md:justify-center px-4 sm:px-8 pb-8 md:pb-0 pt-4 md:pl-12 lg:pl-24 h-full">
          <motion.div 
            key={viewingDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl w-full"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[#38bdf8] text-xs md:text-sm font-medium tracking-wider uppercase">
                День {lesson.day}
              </span>
              {lesson.periodLabel && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-blue-300/80 text-xs md:text-sm font-medium">
                    {lesson.periodLabel}
                  </span>
                </>
              )}
              <span className="text-white/30">•</span>
              <span className="text-white/60 text-xs md:text-sm">
                {lesson.practiceType === 'A' 
                  ? 'Внимание + дыхание' 
                  : lesson.practiceType === 'B' 
                    ? 'Ритм + опора' 
                    : 'Выбор техники'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-light text-white mb-3 leading-tight tracking-tight">
              {lesson.title}
            </h1>

            <p className="text-white/70 font-light text-sm md:text-base leading-relaxed mb-6 max-w-xl whitespace-pre-line">
              {lesson.focusText}
            </p>

            {/* Sequence overview */}
            <div className="space-y-2 mb-8 max-w-lg text-sm text-white/75 font-light">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/80 shrink-0" />
                <span>Замер ощущения в теле (до и после)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/80 shrink-0" />
                <span>
                  {lesson.practiceType === 'A' 
                    ? '«Внимание + дыхание»: взгляд, вдох и сброс (~4 мин)' 
                    : lesson.practiceType === 'B' 
                      ? '«Ритм + опора»: тэппинг, вдох и голос (~4 мин)' 
                      : 'Практика на выбор (~4 мин)'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/80 shrink-0" />
                <span>Экспозиция: {exposureMin} мин тишины</span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
              <button 
                onClick={handleStartDay}
                disabled={!isAvailable}
                className={`w-full flex items-center justify-center px-8 py-4 rounded-2xl font-medium text-base transition-all duration-300 active:scale-[0.98] ${
                  isAvailable 
                    ? 'bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] text-white shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)]' 
                    : 'bg-white/5 text-white/30 border border-white/10'
                }`}
              >
                {isCompleted ? (
                  <>Повторить практику <CheckCircle2 className="w-5 h-5 ml-2" /></>
                ) : isAvailable ? (
                  <>Начать практику</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Откроется в свой день</>
                )}
              </button>
            </div>

            {/* Pagination Controls / Dev Tools */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10 max-w-md">
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewingDay(Math.max(1, viewingDay - 1))}
                  disabled={viewingDay === 1}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Предыдущий день"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewingDay(Math.min(14, viewingDay + 1))}
                  disabled={viewingDay === 14}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Следующий день"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={skipWaitTime}
                  className="text-xs bg-white/5 text-white/40 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  [Dev] Разблокировать следующий день
                </button>
              )}
            </div>

          </motion.div>
        </div>

        {/* Right balance */}
        <div className="hidden md:flex flex-1 relative pointer-events-none" />

      </main>
    </div>
  );
}

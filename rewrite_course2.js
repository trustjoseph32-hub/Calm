import fs from 'node:fs';

const oldContent = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

const courseDataRegex = /const courseData = \[\s*\{[\s\S]*?\];/;
const courseDataMatch = oldContent.match(courseDataRegex);
const courseDataStr = courseDataMatch ? courseDataMatch[0] : '';

const newContent = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Info, Lock, Volume2, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

${courseDataStr}

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
            {/* Ice highlights */}
            <path d="M400,200 L450,280 L420,320 Z" fill="#475569" opacity="0.4" />
            <path d="M700,100 L750,200 L680,250 Z" fill="#64748b" opacity="0.3" />
            <path d="M650,250 L700,350 L630,400 Z" fill="#64748b" opacity="0.2" />
          </svg>
        </div>
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050B14] to-transparent" />
      </div>
    )
  }
  
  if (day === 2) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        {/* Dot Sphere simulation */}
        <div className="absolute top-[20%] md:top-[10%] right-[-30%] md:right-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] flex items-center justify-center opacity-60 mix-blend-screen">
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 -rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-90" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           
           <div className="absolute w-[100%] h-[100%] rounded-full border-[0.5px] border-[#38bdf8]/10" />
           <div className="absolute w-[60%] h-[60%] rounded-full bg-[#38bdf8]/10 blur-[50px]" />
        </div>
      </div>
    )
  }
  
  if (day === 3) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        
        {/* Bubbles */}
        <div className="absolute top-[15%] right-[10%] md:right-[20%] w-32 md:w-48 h-32 md:h-48 rounded-full border-[0.5px] border-blue-300/40 bg-gradient-to-br from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_30px_rgba(56,189,248,0.3)]" />
        <div className="absolute top-[35%] md:top-[40%] right-[30%] md:right-[40%] w-48 md:w-64 h-48 md:h-64 rounded-full border-[0.5px] border-blue-300/30 bg-gradient-to-tr from-cyan-400/5 to-transparent backdrop-blur-sm shadow-[inset_0_0_40px_rgba(56,189,248,0.2)]" />
        <div className="absolute bottom-[20%] left-[20%] md:left-[30%] w-24 md:w-32 h-24 md:h-32 rounded-full border-[0.5px] border-cyan-300/40 bg-gradient-to-bl from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#38bdf8]/10 opacity-30" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#38bdf8]/20 opacity-40" />
    </div>
  )
}

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, saveCheckin, skipWaitTime } = useAppStore();
  const [viewingDay, setViewingDay] = useState(courseProgress.currentDay);
  
  const [anxiety, setAnxiety] = useState<number>(7);

  const lesson = courseData.find(d => d.day === viewingDay) || courseData[0];
  const isAvailable = viewingDay <= courseProgress.currentDay;
  const isCompleted = courseProgress.completedDays.includes(viewingDay);

  const handleStartDay = () => {
    if (!isAvailable) return;
    
    if (viewingDay === 1 && !isCompleted) {
      saveCheckin({
        date: new Date().toISOString(),
        anxiety: anxiety,
        physical: 5,
        emotional: 5,
        thoughts: 5,
      });
    }

    if (viewingDay === 1) navigate("/practice/day1", { state: { anxietyBefore: anxiety } });
    else if (viewingDay === 2) navigate("/practice/day2");
    else if (viewingDay === 3) navigate("/practice/day3");
    else navigate("/practice/active", { state: { type: "breathing", durationSeconds: 180, returnToCourseDay: viewingDay } });
  };

  const displayTitle = viewingDay === 1 ? "Снизить напряжение" :
                       viewingDay === 2 ? "Переключить внимание" :
                       viewingDay === 3 ? "Мысли — это мысли" : lesson.title;
                       
  const displayDesc = viewingDay === 1 ? "Сегодня мы попробуем простой способ немного снизить телесное возбуждение. Это займёт всего пару минут." :
                      viewingDay === 2 ? "Сегодня потренируем сенсорное переключение. Это помогает быстрее выйти из тревожной петли и вернуть опору здесь и сейчас." :
                      viewingDay === 3 ? "Сегодня научимся немного отступать от тревожных мыслей. Это поможет видеть их яснее и меньше в них увязать." :
                      (lesson.explanation || lesson.session);
                      
  const features = viewingDay === 1 ? [{icon: Clock, label: "≈ 2-3 минуты"}, {icon: Volume2, label: "Аудио-поддержка"}, {icon: Info, label: "Подходит для любого момента дня"}] :
                   viewingDay === 2 ? [{icon: Clock, label: "≈ 5 минут"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Никакого специального оборудования"}] :
                   viewingDay === 3 ? [{icon: Clock, label: "≈ 4 минуты"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Простой и безопасный метод"}] :
                   [{icon: Clock, label: lesson.duration || "≈ 5 минут"}, {icon: Info, label: "Самостоятельная практика"}];

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
                  className={\`h-1 rounded-full transition-all duration-300 \${isPast ? "bg-[#38bdf8] w-4 md:w-6" : isCurrent ? "bg-[#38bdf8] w-4 md:w-6 shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "bg-white/10 w-2 md:w-4"}\`}
                />
              )
            })}
          </div>
        </div>
        
        <div className="w-10 flex justify-end">
          <span className="hidden md:block text-xs text-white/50 whitespace-nowrap tracking-wide font-light">
            Осталось {14 - courseProgress.currentDay} дней
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
            transition={{ duration: 0.5 }}
            className="max-w-3xl w-full"
          >
            <h3 className="text-[#38bdf8] text-sm md:text-base mb-2 font-medium tracking-wide">День {lesson.day}</h3>
            <h1 className="text-4xl md:text-[3.5rem] font-light text-white mb-4 leading-tight tracking-tight">{displayTitle}</h1>
            <p className="text-white/70 font-light text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-md">
              {displayDesc}
            </p>
            
            {/* Mobile-only features */}
            <div className="flex flex-col gap-3 mb-8 md:hidden">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
                  <f.icon className="w-4 h-4 text-[#38bdf8]/70" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-end w-full max-w-[800px]">
              {/* Slider Card */}
              {viewingDay === 1 && !isCompleted && (
                <div className="flex-1 w-full p-6 md:p-8 rounded-[2rem] bg-[#0A1325]/80 border border-blue-500/20 backdrop-blur-xl shadow-2xl">
                  <div className="flex justify-between items-start mb-8">
                    <h4 className="text-white text-base md:text-lg font-medium max-w-[200px]">Как сильно ощущается напряжение сейчас?</h4>
                    <div className="w-12 h-12 rounded-[14px] bg-[#122343] border border-[#38bdf8]/30 flex items-center justify-center text-white text-xl font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                      {anxiety}
                    </div>
                  </div>
                  
                  <div className="relative pt-2 pb-6">
                    <input 
                      type="range" 
                      min="0" max="10" 
                      value={anxiety} 
                      onChange={(e) => setAnxiety(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer relative z-10"
                      style={{
                        background: \`linear-gradient(to right, #38bdf8 \${anxiety * 10}%, #1E293B \${anxiety * 10}%)\`
                      }}
                    />
                    <style>{\`
                      input[type=range]::-webkit-slider-thumb {
                        appearance: none;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: #38bdf8;
                        border: 4px solid #fff;
                        box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
                        cursor: pointer;
                        transition: transform 0.1s;
                      }
                      input[type=range]::-webkit-slider-thumb:active {
                        transform: scale(1.1);
                      }
                    \`}</style>
                    <div className="flex justify-between text-[10px] md:text-xs text-white/40 mt-6 px-1 font-light tracking-wide relative">
                      <div className="flex justify-between w-full">
                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                          <div key={n} className="flex flex-col items-center gap-2">
                            <div className="w-px h-1.5 bg-white/20" />
                            <span>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] md:text-xs text-white/40 mt-4 px-1">
                      <span>0 — спокойно</span>
                      <span>10 — максимально напряженно</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col w-full md:w-[320px] shrink-0 gap-3 pb-2">
                <button 
                  onClick={handleStartDay}
                  disabled={!isAvailable}
                  className={\`w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] font-medium text-lg transition-all duration-300 group active:scale-[0.98] \${
                    isAvailable 
                      ? 'bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] border border-blue-400/30' 
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }\`}
                >
                  {isCompleted ? (
                    <>Практика завершена <CheckCircle2 className="w-6 h-6" /></>
                  ) : isAvailable ? (
                    <>Начать практику <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <><Lock className="w-5 h-5 mr-1" /> Откроется позже</>
                  )}
                </button>
                
                {viewingDay === 1 && !isCompleted && (
                  <p className="text-center text-xs text-white/40 font-light hidden md:block mt-2 tracking-wide">
                    Это займёт около 2-3 минут
                  </p>
                )}
              </div>
            </div>

            {/* Pagination Controls / Dev Tools */}
            <div className="flex items-center justify-between mt-8 md:mt-12 pt-6 border-t border-white/10 max-w-[800px]">
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewingDay(Math.max(1, viewingDay - 1))}
                  disabled={viewingDay === 1}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewingDay(Math.min(14, viewingDay + 1))}
                  disabled={viewingDay === 14}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={skipWaitTime}
                  className="text-xs bg-white/5 text-white/30 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  [Dev] Пропустить 24ч
                </button>
              )}
            </div>

          </motion.div>
        </div>

        {/* Right side for desktop purely visual balance */}
        <div className="hidden md:flex flex-1 relative pointer-events-none" />

      </main>
    </div>
  );
}
`

fs.writeFileSync('src/screens/Course.tsx', newContent);

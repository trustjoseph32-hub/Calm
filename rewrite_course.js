import fs from 'node:fs';

const oldContent = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

// The new component structure to inject
const newComponentStr = `

const BackgroundEffect = ({ day }: { day: number }) => {
  if (day === 1) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        
        {/* Mountain Silhouette */}
        <div className="absolute bottom-0 w-full h-[50vh] opacity-30 mix-blend-screen" style={{
           background: 'linear-gradient(to top, rgba(15,23,42,1), transparent)',
           clipPath: 'polygon(0% 100%, 0% 50%, 15% 40%, 30% 60%, 45% 30%, 65% 55%, 80% 20%, 100% 45%, 100% 100%)'
        }}>
          <div className="w-full h-full bg-blue-900/50" />
        </div>
        <div className="absolute bottom-0 w-full h-[45vh] opacity-50 mix-blend-screen" style={{
           background: 'linear-gradient(to top, rgba(15,23,42,1), transparent)',
           clipPath: 'polygon(0% 100%, 0% 60%, 25% 45%, 40% 65%, 55% 40%, 75% 60%, 90% 30%, 100% 50%, 100% 100%)'
        }}>
          <div className="w-full h-full bg-blue-800/40" />
        </div>
      </div>
    )
  }
  
  if (day === 2) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-[100px]" />
        
        {/* Dot Sphere simulation */}
        <div className="absolute top-[30%] right-[-10%] md:right-[10%] w-[350px] h-[350px] rounded-full border border-blue-500/10 flex items-center justify-center opacity-40">
           <div className="w-[320px] h-[320px] rounded-full border-[0.5px] border-blue-400/20 rotate-45" />
           <div className="absolute w-[320px] h-[320px] rounded-full border-[0.5px] border-blue-400/20 -rotate-45" />
           <div className="absolute w-[320px] h-[320px] rounded-full border-[0.5px] border-blue-400/20 rotate-90" />
           {/* Glow inside */}
           <div className="absolute w-[200px] h-[200px] rounded-full bg-blue-400/10 blur-[40px]" />
        </div>
      </div>
    )
  }
  
  if (day === 3) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        {/* Bubbles */}
        <div className="absolute top-[20%] right-[5%] md:right-[15%] w-32 h-32 rounded-full border border-blue-300/30 bg-blue-900/20 backdrop-blur-md shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]" />
        <div className="absolute top-[40%] right-[20%] md:right-[30%] w-48 h-48 rounded-full border border-blue-300/20 bg-blue-800/10 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]" />
        <div className="absolute bottom-[20%] left-[10%] md:left-[20%] w-24 h-24 rounded-full border border-cyan-300/30 bg-cyan-900/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(6,182,212,0.3)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-blue-500/10 opacity-30" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-blue-400/20 opacity-40" />
    </div>
  )
}

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, saveCheckin } = useAppStore();
  const [viewingDay, setViewingDay] = useState(courseProgress.currentDay);
  
  // Embedded tension slider for Day 1
  const [anxiety, setAnxiety] = useState<number | null>(null);

  const lesson = courseData.find(d => d.day === viewingDay) || courseData[0];
  const isAvailable = viewingDay <= courseProgress.currentDay;
  const isCompleted = courseProgress.completedDays.includes(viewingDay);

  const handleStartDay = () => {
    if (!isAvailable) return;
    
    // If it's day 1, save anxiety before practice
    if (viewingDay === 1 && anxiety !== null) {
      saveCheckin({
        date: new Date().toISOString(),
        anxiety: anxiety,
        physical: 5,
        emotional: 5,
        thoughts: 5,
      });
    }

    if (viewingDay === 1) navigate("/practice/day1");
    else if (viewingDay === 2) navigate("/practice/day2");
    else if (viewingDay === 3) navigate("/practice/day3");
    else navigate("/practice/active", { state: { type: "breathing", durationSeconds: 180, returnToCourseDay: viewingDay } });
  };

  const skipWaitTime = () => {
    console.log('dev skip time');
  };

  // Safe mapping of titles to match the new visual concept text
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
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden font-sans">
      <BackgroundEffect day={viewingDay} />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-6 md:px-8 w-full max-w-7xl mx-auto">
        <button 
          onClick={() => navigate("/")}
          className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-[11px] md:text-xs text-white/60 mb-2">
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
                  className={\`h-1 rounded-full transition-all duration-300 \${isPast ? "bg-blue-400 w-4 md:w-6" : isCurrent ? "bg-blue-400 w-4 md:w-6 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-white/10 w-2 md:w-4"}\`}
                />
              )
            })}
          </div>
        </div>
        
        <div className="w-10 flex justify-end">
          <span className="hidden md:block text-xs text-white/50">
            Осталось {14 - courseProgress.currentDay} дней
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto h-[calc(100svh-100px)]">
        
        <div className="flex-1 flex flex-col justify-end md:justify-center px-6 pb-10 md:pb-0 pt-4 md:pl-16 lg:pl-24">
          <motion.div 
            key={viewingDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md"
          >
            <h3 className="text-blue-100/60 text-sm md:text-base mb-2 font-medium tracking-wide">День {lesson.day}</h3>
            <h1 className="text-3xl md:text-5xl font-light text-white mb-4 leading-tight">{displayTitle}</h1>
            <p className="text-white/70 font-light text-sm md:text-base leading-relaxed mb-8">
              {displayDesc}
            </p>
            
            <div className="flex flex-col gap-3 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-xs md:text-sm">
                  <f.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-200/50" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            {viewingDay === 1 && !isCompleted && (
              <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h4 className="text-white text-sm font-medium mb-6 text-center">Как сильно ощущается напряжение сейчас?</h4>
                <div className="relative pt-6 pb-2">
                  <input 
                    type="range" 
                    min="0" max="10" 
                    value={anxiety ?? 5} 
                    onChange={(e) => setAnxiety(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-4 px-1">
                    <span>0 — спокойно</span>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-100 font-medium text-sm">
                        {anxiety ?? 5}
                      </div>
                    </div>
                    <span>10 — максимальное напряжение</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={handleStartDay}
                disabled={!isAvailable}
                className={\`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 group active:scale-[0.98] \${
                  isAvailable 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-blue-400/30' 
                    : 'bg-white/5 text-white/30 border border-white/10'
                }\`}
              >
                {isCompleted ? (
                  <>Практика завершена <CheckCircle2 className="w-5 h-5 ml-1" /></>
                ) : isAvailable ? (
                  <>Начать практику <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" /></>
                ) : (
                  <><Lock className="w-5 h-5 mr-1" /> Откроется позже</>
                )}
              </button>
            </div>
            
            {viewingDay === 1 && !isCompleted && (
              <p className="text-center sm:text-left text-[11px] text-white/30 mt-4">Это займёт около 2-3 минут</p>
            )}

            {/* Pagination Controls / Dev Tools */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewingDay(Math.max(1, viewingDay - 1))}
                  disabled={viewingDay === 1}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewingDay(Math.min(14, viewingDay + 1))}
                  disabled={viewingDay === 14}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={skipWaitTime}
                  className="text-[10px] bg-white/5 text-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10"
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
`;

const courseDataRegex = /const courseData = \[\s*\{[\s\S]*?\];/;
const match = oldContent.match(courseDataRegex);

if (match) {
  const imports = `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Info, Lock, Volume2, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';
import { AudioPlayer } from '../components/AudioPlayer';
`;
  const finalContent = imports + "\n\n" + match[0] + "\n\n" + newComponentStr;
  fs.writeFileSync('src/screens/Course.tsx', finalContent);
  console.log("Rewrite successful");
} else {
  console.log("Could not match courseData array");
}


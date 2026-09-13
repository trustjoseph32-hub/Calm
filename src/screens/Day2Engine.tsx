import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

type Step = 'intro' | 'pre-check' | 'practice' | 'post-check' | 'summary';

const INTRO_CARDS = [
  {
    title: 'Возврат в реальность',
    text: 'Тревога запирает нас внутри головы. Чтобы разомкнуть эту петлю, нужно подать мозгу сигнал безопасности из внешнего мира.',
  },
  {
    title: 'Сенсорные якоря',
    text: 'Сегодня мы добавим к дыханию сенсорные якоря: поиск объектов глазами и мягкий ритм пальцами (таппинг), который поможет удерживать внимание.',
  }
];

const PRACTICE_DURATION_SEC = 90; // 1.5 minutes

export function Day2Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  const [step, setStep] = useState<Step>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  
  const [preAnxiety, setPreAnxiety] = useState<number>(5);
  const [postAnxiety, setPostAnxiety] = useState<number>(5);

  // Practice State
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PRACTICE_DURATION_SEC);
  const [phase, setPhase] = useState<'visual' | 'physical' | 'tapping'>('visual');
  const [pulse, setPulse] = useState(false);

  // Handle Practice Timer & Phases
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'practice' && isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next > 75) setPhase('visual');
          else if (next > 60) setPhase('physical');
          else setPhase('tapping');
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && step === 'practice') {
      setIsActive(false);
      setStep('post-check');
    }
    return () => clearInterval(interval);
  }, [step, isActive, timeLeft]);

  // Handle Tapping Pulse
  useEffect(() => {
    let pulseInterval: NodeJS.Timeout;
    if (step === 'practice' && isActive && phase === 'tapping') {
      pulseInterval = setInterval(() => {
        setPulse(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40]);
        }
        setTimeout(() => setPulse(false), 200);
      }, 1200); // Pulse every 1.2s
    }
    return () => clearInterval(pulseInterval);
  }, [phase, isActive, step]);

  const handleComplete = () => {
    addSession({
      sessionId: `day2-${Date.now()}`,
      date: new Date().toISOString(),
      practiceType: 'course',
      duration: PRACTICE_DURATION_SEC,
      anxietyBefore: preAnxiety,
      anxietyAfter: postAnxiety,
      anxietyDelta: preAnxiety - postAnxiety,
      status: 'completed',
      completedRounds: 1,
      roundAnswers: [],
      usedGrounding: true,
      reducedMotion: false,
      validForOutcomeStats: true,
      schemaVersion: 2,
      courseDay: 2,
    });
    markCourseDayCompleted(2);
    navigate('/course');
  };

  const handleClose = () => {
    if (true) {
      navigate('/course');
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'visual': return 'Посмотри вокруг. Найди глазами 3 предмета синего цвета.';
      case 'physical': return 'Почувствуй, как твои стопы касаются пола. Ощути этот вес.';
      case 'tapping': return 'Скрести руки на груди и мягко похлопывай себя пальцами в этом спокойном ритме. Продолжай дышать.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 font-medium tracking-wider uppercase">Курс • День 2</span>
        </div>
        <button
          onClick={handleClose}
          className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* INTRO STEP */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col h-full justify-center"
            >
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-2xl font-semibold mb-4 text-white">
                  {INTRO_CARDS[introIndex].title}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {INTRO_CARDS[introIndex].text}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                  {INTRO_CARDS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === introIndex ? 'w-6 bg-white' : 'w-2 bg-neutral-700'
                      }`} 
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (introIndex < INTRO_CARDS.length - 1) {
                      setIntroIndex(prev => prev + 1);
                    } else {
                      setStep('pre-check');
                    }
                  }}
                  className="bg-white text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-neutral-100 transition-colors flex items-center gap-2"
                >
                  Далее
                </button>
              </div>
            </motion.div>
          )}

          {/* PRE-CHECK STEP */}
          {step === 'pre-check' && (
            <motion.div
              key="pre-check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-medium mb-2 text-white">Оцените уровень тревоги</h2>
              <p className="text-slate-400 mb-12">где 1 — полное спокойствие, а 10 — сильная паника</p>
              
              <div className="text-6xl font-light mb-8 tabular-nums">
                {preAnxiety}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={preAnxiety}
                onChange={(e) => setPreAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white mb-12"
              />

              <button
                onClick={() => {
                  setStep('practice');
                  setIsActive(true);
                }}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Начать практику
              </button>
            </motion.div>
          )}

          {/* PRACTICE STEP */}
          {step === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex flex-col items-center justify-center flex-1"
            >
              <div className="text-slate-400 font-mono text-lg mb-8">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>

              <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center mb-8 px-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phase + isActive}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl md:text-3xl font-light text-white text-center leading-relaxed"
                  >
                    {isActive ? getPhaseText() : 'Пауза'}
                  </motion.p>
                </AnimatePresence>

                {/* Tapping pulse visualizer */}
                <AnimatePresence>
                  {phase === 'tapping' && isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-16 relative w-24 h-24 flex items-center justify-center"
                    >
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
                        animate={{ scale: pulse ? 1.5 : 1, opacity: pulse ? 0 : 0.5 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <div className={`w-8 h-8 rounded-full bg-indigo-500/50 transition-transform duration-200 ${pulse ? 'scale-125 bg-indigo-400' : 'scale-100'}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsActive(!isActive)}
                className="mt-8 p-4 rounded-full bg-white/10 text-white hover:bg-neutral-700 transition-colors z-10"
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </motion.div>
          )}

          {/* POST-CHECK STEP */}
          {step === 'post-check' && (
            <motion.div
              key="post-check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col items-center text-center"
            >
              <h2 className="text-2xl font-medium mb-2 text-white">Как вы себя чувствуете сейчас?</h2>
              <p className="text-slate-400 mb-12">Оцените уровень тревоги после практики</p>
              
              <div className="text-6xl font-light mb-8 tabular-nums">
                {postAnxiety}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={postAnxiety}
                onChange={(e) => setPostAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white mb-12"
              />

              <button
                onClick={() => setStep('summary')}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Продолжить
              </button>
            </motion.div>
          )}

          {/* SUMMARY STEP */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Check className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-medium mb-4 text-white">
                Практика завершена
              </h2>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 w-full border border-white/10 text-left">
                <p className="text-slate-300 leading-relaxed mb-4 text-center">
                  {preAnxiety > postAnxiety 
                    ? `Тревога снизилась на ${preAnxiety - postAnxiety} ${preAnxiety - postAnxiety === 1 ? 'балл' : 'балла'}. Отлично!`
                    : 'Уровень не изменился, это абсолютно нормально. Мозг только учится новым реакциям.'
                  }
                </p>
                <div className="h-px w-full bg-neutral-700/50 my-4" />
                <h4 className="text-white font-medium mb-2">Задание на сегодня:</h4>
                <p className="text-slate-400 text-sm">
                  Если почувствуете суету или нарастающую тревогу, не пытайтесь сразу её подавить. Просто найдите глазами 3 любых предмета и назовите их про себя. 
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Завершить День 2
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

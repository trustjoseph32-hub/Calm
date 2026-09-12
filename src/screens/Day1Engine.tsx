import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ArrowRight, ArrowLeft, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

type Step = 'intro' | 'pre-check' | 'stage-intro' | 'practice' | 'post-check' | 'summary' | 'sos-reveal';

const STAGE_INTROS: Record<number, { title: string; text: string }> = {
  1: {
    title: 'Дыхание',
    text: 'Осваиваем физиологический вздох. Два коротких вдоха носом, чтобы расправить легкие, и длинный плавный выдох через рот.'
  },
  2: {
    title: 'Движение глаз',
    text: 'Продолжаем дышать и добавляем слежение глазами за точкой. Это загружает рабочую память и снижает эмоциональный накал.'
  },
  3: {
    title: 'Работа тела',
    text: 'На вдохе сжимаем ладони в кулаки, на выдохе — расслабляем. Это поможет сбросить мышечное напряжение.'
  }
};

const PRACTICE_DURATION_SEC = 180; // 3 minutes in total (3x60)

export function Day1Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  
  const location = useLocation();
  const anxietyBefore = location.state?.anxietyBefore;
  
  const [step, setStep] = useState<Step>(anxietyBefore !== undefined ? 'stage-intro' : 'intro');

  const [preAnxiety, setPreAnxiety] = useState<number>(anxietyBefore ?? 5);

  const [practiceStage, setPracticeStage] = useState(1);
  

  const [postAnxiety, setPostAnxiety] = useState<number>(5);

  // Practice State
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute per stage
  const [phase, setPhase] = useState<'inhale1' | 'inhale2' | 'hold' | 'exhale'>('inhale1');

  // Handle Practice Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'practice' && isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'practice') {
      setIsActive(false);
      if (practiceStage < 3) {
        setPracticeStage(prev => prev + 1);
        setStep('stage-intro');
      } else {
        setStep('post-check');
      }
    }
    return () => clearInterval(interval);
  }, [step, isActive, timeLeft, practiceStage]);

  // Handle Breathing Phases
  useEffect(() => {
    if (step !== 'practice' || !isActive) return;

    let timeout: NodeJS.Timeout;
    if (phase === 'inhale1') {
      timeout = setTimeout(() => setPhase('inhale2'), 2500);
    } else if (phase === 'inhale2') {
      // Haptic feedback for the second short inhale
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
      timeout = setTimeout(() => setPhase('hold'), 1000);
    } else if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('exhale'), 1000);
    } else if (phase === 'exhale') {
      timeout = setTimeout(() => setPhase('inhale1'), 5500);
    }

    return () => clearTimeout(timeout);
  }, [phase, isActive, step]);

  const handleComplete = () => {
    addSession({
      sessionId: `day1-${Date.now()}`,
      date: new Date().toISOString(),
      practiceType: 'course',
      duration: PRACTICE_DURATION_SEC,
      anxietyBefore: preAnxiety,
      anxietyAfter: postAnxiety,
      anxietyDelta: preAnxiety - postAnxiety,
      status: 'completed',
      completedRounds: 1,
      roundAnswers: [],
      usedGrounding: false,
      reducedMotion: false,
      validForOutcomeStats: true,
      schemaVersion: 2,
      courseDay: 1,
    });
    markCourseDayCompleted(1);
    navigate('/course');
  };

  const handleClose = () => {
    if (true) {
      navigate('/course');
    }
  };

  const dotVariants = {
    initial: { x: '-46vw', opacity: 0 },
    inhale1: { x: '46vw', opacity: 1, transition: { duration: 3.5, ease: 'easeInOut' } }, // Total inhale time (2.5 + 1.0)
    inhale2: { x: '46vw', opacity: 1, transition: { duration: 0, ease: 'linear' } }, // No movement during inhale2 trigger
    hold: { x: '46vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } }, // Stay at edge during hold
    exhale: { x: '-46vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } },
  };

  const circleVariants = {
    inhale1: { 
      scale: 0.85, 
      opacity: 0.8,
      transition: { duration: 2.5, ease: 'easeOut' } 
    },
    inhale2: { 
      scale: 1.0, 
      opacity: 1.0,
      transition: { duration: 1.0, ease: 'easeOut' } 
    },
    hold: {
      scale: 1.0,
      opacity: 1.0,
      transition: { duration: 1.0, ease: 'linear' }
    },
    exhale: { 
      scale: 0.6, 
      opacity: 0.2,
      transition: { duration: 5.5, ease: 'easeInOut' } 
    },
  };

  const getPhaseText = (): React.ReactNode => {
    if (practiceStage === 1 || practiceStage === 2) {
      switch (phase) {
        case 'inhale1': return 'Вдох';
        case 'inhale2': 
        case 'hold': return 'До-вдох';
        case 'exhale': return 'Выдох';
        default: return '';
      }
    } else {
      if (phase === 'exhale') return (
        <div className="flex flex-col items-center leading-tight">
          <span>Расслабьтесь</span>
          <span>Выдох</span>
        </div>
      );
      return (
        <div className="flex flex-col items-center leading-tight">
          <span>Напрягитесь</span>
          <span>Вдох</span>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-blue-500/5 blur-[120px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-sm text-blue-200/50 font-medium tracking-wider uppercase">День 1 из 14</span>
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
              className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center py-4"
            >
              <div className="flex-1 flex flex-col justify-center text-center py-2 min-h-0">
                <h1 className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-6 text-white">
                  Базовое упражнение
                </h1>
                <div className="text-slate-300 text-lg leading-relaxed flex flex-col items-center">
                  <p className="mb-2">Сегодня осваиваем «Базовое упражнение».</p>
                  <p className="mb-6">Мы пройдем 3 этапа по 1 минуте:</p>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/10 text-blue-100/80">
                      1. Дыхание
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/10 text-blue-100/80">
                      2. Движение глаз
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/10 text-blue-100/80">
                      3. Сброс напряжения
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 w-full">
                <button
                  onClick={() => setStep('pre-check')}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Далее
                  <ArrowRight className="w-5 h-5" />
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
              className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"
            >
              <h2 className="text-2xl font-medium mb-2 text-white">Оцените уровень тревоги</h2>
              <p className="text-slate-400 mb-4 sm:mb-12">где 1 — полное спокойствие, а 10 — сильная паника</p>
              
              <div className="text-5xl sm:text-6xl font-light mb-6 sm:mb-8 tabular-nums">
                {preAnxiety}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={preAnxiety}
                onChange={(e) => setPreAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-6 sm:mb-12"
              />

              <button
                onClick={() => {
                  setStep('stage-intro');
                }}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Продолжить
              </button>
            </motion.div>
          )}

          {/* STAGE INTRO STEP */}
          {step === 'stage-intro' && (
            <motion.div
              key={`stage-intro-${practiceStage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm flex flex-col h-full justify-center"
            >
              <div className="flex-1 flex flex-col justify-center text-center">
                <span className="text-sm font-medium tracking-wider text-slate-400 uppercase mb-4">
                  Этап {practiceStage} из 3
                </span>
                <h2 className="text-3xl font-medium mb-6 text-white">
                  {STAGE_INTROS[practiceStage].title}
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {STAGE_INTROS[practiceStage].text}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setTimeLeft(60);
                    setStep('practice');
                    setIsActive(true);
                    setPhase('inhale1');
                  }}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Начать этап {practiceStage}
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </motion.div>
          )}

          {/* PRACTICE STEP */}
          {step === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex flex-col items-center justify-between sm:justify-center flex-1 py-4 min-h-0"
            >
              <div className="text-slate-400 font-mono text-lg mb-4 sm:mb-12">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
                {/* Breathing Circle */}
                <motion.div
                  initial="exhale"
                  variants={circleVariants}
                  animate={isActive ? phase : 'exhale'}
                  className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-200/80 blur-[50px] sm:blur-[80px] mix-blend-screen pointer-events-none"
                />

                {/* Moving Target Dot */}
                {practiceStage >= 2 && (
                  <motion.div 
                    initial="initial"
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                    variants={dotVariants}
                    animate={isActive ? phase : 'initial'}
                  />
                )}
                
                {/* Text overlay for breathing */}
                <div className="absolute top-0 w-full text-center text-sm font-medium tracking-wider text-slate-400 uppercase pointer-events-none z-0 mt-4">
                  Этап {practiceStage}: {STAGE_INTROS[practiceStage].title}
                </div>
                <div className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500 flex justify-center items-center">
                   {isActive ? getPhaseText() : 'Пауза'}
                </div>
              </div>

              <button
                onClick={() => setIsActive(!isActive)}
                className="mt-4 sm:mt-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
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
              className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"
            >
              <h2 className="text-2xl font-medium mb-2 text-white">Как вы себя чувствуете сейчас?</h2>
              <p className="text-slate-400 mb-6 sm:mb-12">Оцените уровень тревоги после практики</p>
              
              <div className="text-6xl font-light mb-4 sm:mb-8 tabular-nums">
                {postAnxiety}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={postAnxiety}
                onChange={(e) => setPostAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-6"
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
              className="w-full max-w-sm flex flex-col h-full justify-between sm:justify-center items-center text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Check className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-medium mb-4 text-white">
                Практика завершена
              </h2>

              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full border border-white/10 overflow-y-auto min-h-0">
                <p className="text-lg text-blue-100/80 leading-relaxed">
                  {preAnxiety > postAnxiety 
                    ? `Отлично! Вы только что самостоятельно снизили уровень тревоги на ${preAnxiety - postAnxiety} ${preAnxiety - postAnxiety === 1 ? 'балл' : 'балла'}. Вы способны влиять на свою нервную систему.`
                    : 'Это абсолютно нормально для первого раза. Нервной системе нужно время, чтобы привыкнуть к новым командам. Главное — вы сделали первый шаг.'
                  }
                </p>
              </div>

              <button
                onClick={() => setStep('sos-reveal')}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* SOS REVEAL STEP */}
          {step === 'sos-reveal' && (
            <motion.div
              key="sos-reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                <Play className="w-10 h-10 ml-1" />
              </div>
              
              <h2 className="text-3xl font-medium mb-4 text-white">
                Скорая помощь
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Вы освоили базовый механизм. Теперь на главном экране вам всегда доступна кнопка <strong className="text-white">SOS (Скорая помощь)</strong>.
              </p>
              
              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full border border-white/10 text-left overflow-y-auto min-h-0">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Она объединяет дыхание, движение глаз и заземление для быстрого снятия паники. Используйте её в любой момент, когда тревога становится слишком сильной.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Завершить День 1
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

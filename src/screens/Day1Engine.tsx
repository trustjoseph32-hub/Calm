import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ArrowRight, ArrowLeft, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

type Step = 'intro' | 'pre-check' | 'stage-intro' | 'practice' | 'consolidation-intro' | 'consolidation' | 'post-check' | 'summary' | 'sos-reveal';

const STAGE_INTROS: Record<number, { title: string; text: string }> = {
  1: {
    title: 'Дыхание',
    text: 'Осваиваем физиологический вздох. \nДва коротких вдоха носом, чтобы расправить легкие и длинный плавный выдох через рот.'
  },
  2: {
    title: 'Движение глаз',
    text: 'Следите глазами за движущейся точкой и заводите глаза до "упора" в каждую сторону.\nЭто помогает уводить внимание с вашей тревожности и переносить фокус на упражнение.'
  },
  3: {
    title: 'Работа тела',
    text: 'Добавим к дыханию и движению глазами еще работу с телесным напряжением. На вдохе сжимаете ладони в кулаки, на выдохе расслабляете. Это поможет сбросить мышечное напряжение, а за ним в процессе уменьшить и эмоциональное напряжение.'
  }
};

const PRACTICE_DURATION_SEC = 420; // 3x60 + 240 (consolidation)

export function Day1Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();
  
  const location = useLocation();
  const anxietyBefore = location.state?.anxietyBefore;
  
  const [step, setStep] = useState<Step>(anxietyBefore !== undefined ? 'stage-intro' : 'intro');
  const [preAnxiety, setPreAnxiety] = useState<number>(anxietyBefore ?? 5);
  const [practiceStage, setPracticeStage] = useState(1);
  const [consolidationTimeLeft, setConsolidationTimeLeft] = useState(240); // 4 minutes
  
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
        setStep('consolidation-intro');
      }
    } else if (step === 'consolidation' && isActive && consolidationTimeLeft > 0) {
      interval = setInterval(() => {
        setConsolidationTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (consolidationTimeLeft === 0 && step === 'consolidation') {
      setIsActive(false);
      setStep('post-check');
    }
    return () => clearInterval(interval);
  }, [step, isActive, timeLeft, practiceStage, consolidationTimeLeft]);

  // Handle Breathing Phases
  useEffect(() => {
    if ((step !== 'practice' && step !== 'consolidation') || !isActive) return;
    
    let timeout: NodeJS.Timeout;
    const isPart2Or3 = step === 'consolidation' && consolidationTimeLeft <= 150;

    if (phase === 'inhale1') {
      timeout = setTimeout(() => setPhase('inhale2'), 2500);
    } else if (phase === 'inhale2') {
      if (typeof navigator !== 'undefined' && navigator.vibrate && !isPart2Or3) {
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
    initial: { x: '-42vw', opacity: 0 },
    inhale1: { x: '18vw', opacity: 1, transition: { duration: 2.5, ease: 'linear' } }, 
    inhale2: { x: '42vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } }, 
    hold: { x: '42vw', opacity: 1, transition: { duration: 1.0, ease: 'linear' } },
    exhale: { x: '-42vw', opacity: 1, transition: { duration: 5.5, ease: 'easeInOut' } }
  };

  const circleVariants = {
    exhale: { scale: 0.3, opacity: 0.15, transition: { duration: 5.5, ease: 'easeInOut' } },
    inhale1: { scale: 0.8, opacity: 0.6, transition: { duration: 2.5, ease: 'linear' } },
    inhale2: { scale: 1.3, opacity: 1, transition: { duration: 1.0, ease: 'easeOut' } },
    hold: { scale: 1.3, opacity: 1, transition: { duration: 1.0, ease: 'linear' } }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale1': return 'Вдох';
      case 'inhale2': return 'Довдох';
      case 'hold': return '';
      case 'exhale': return 'Выдох';
    }
  };

  const getSubPhaseText = () => {
    if (practiceStage === 3) {
      switch (phase) {
        case 'inhale1':
        case 'inhale2': 
          return 'Напряжение';
        case 'hold': 
          return '';
        case 'exhale': 
          return 'Расслабление';
      }
    }
    return '';
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a365d_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="px-4 py-6 w-full flex items-center justify-between relative z-10 sm:max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 font-medium tracking-wider uppercase mb-1">День 1</span>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col w-full relative z-10 px-4 sm:max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {/* INTRO STEP */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
            >
              <h1 className="text-3xl font-medium mb-4 text-white text-center">Снизить напряжение</h1>
              <p className="text-slate-400 text-lg leading-relaxed text-center mb-8">
                Сегодня мы начнем с самого быстрого способа вернуть спокойствие — работы с телом.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left">
                <h3 className="font-medium text-white mb-2">Зачем это нужно?</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Когда мы тревожимся, наше дыхание становится частым и поверхностным, посылая в мозг сигнал об опасности. 
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Мы сделаем обратное: <strong className="text-white font-medium">физиологический вздох</strong> напрямую командует нервной системе расслабиться.
                </p>
              </div>

              <div className="mt-auto pb-8">
                <button
                  onClick={() => setStep('pre-check')}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Начать
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
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
            >
              <h2 className="text-2xl font-medium mb-2 text-white text-center">Оцените уровень тревоги</h2>
              <p className="text-slate-400 mb-12 text-center">где 1 — полное спокойствие, а 10 — сильная паника</p>
              
              <div className="text-6xl font-light mb-8 tabular-nums text-center text-white">
                {preAnxiety}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={preAnxiety}
                onChange={(e) => setPreAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400 mb-12"
              />

              <div className="mt-auto pb-8 flex flex-col gap-3">
                <button
                  onClick={() => setStep('stage-intro')}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Далее
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE INTRO STEP */}
          {step === 'stage-intro' && (
            <motion.div
              key={`stage-intro-${practiceStage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-2">Этап {practiceStage} из 3</div>
              <h2 className="text-2xl sm:text-3xl font-medium mb-3 text-white">
                {STAGE_INTROS[practiceStage].title}
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                {STAGE_INTROS[practiceStage].text}
              </p>

              {/* Steps overview */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6">
                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                  
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <div className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full ${practiceStage >= 1 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-white/20'}`} />
                      <span className={practiceStage >= 1 ? 'text-white font-medium' : 'text-slate-500'}>
                        1. Базовое дыхание
                      </span>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full ${practiceStage >= 2 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-white/20'}`} />
                      <span className={practiceStage >= 2 ? 'text-white font-medium' : 'text-slate-500'}>
                        2. Движение глаз
                      </span>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full ${practiceStage >= 3 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-white/20'}`} />
                      <span className={practiceStage >= 3 ? 'text-white font-medium' : 'text-slate-500'}>
                        3. Сброс напряжения
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pb-4 sm:pb-8 w-full">
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
                  <Play className="w-5 h-5 fill-current ml-1" />
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
                <div className="absolute flex flex-col justify-center items-center pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500">
                  {isActive && (
                    <>
                      <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                        {getPhaseText()}
                      </div>
                      {practiceStage === 3 && getSubPhaseText() && (
                        <div className="text-xl font-light tracking-[0.15em] uppercase text-blue-200 mt-2">
                          {getSubPhaseText()}
                        </div>
                      )}
                    </>
                  )}
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

          {/* CONSOLIDATION INTRO STEP */}
          {step === 'consolidation-intro' && (
            <motion.div
              key="consolidation-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-center"
            >
              <h2 className="text-3xl font-medium mb-4 text-white">Теперь попробуйте сами</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                Вы уже знаете последовательность. Сейчас повторим её ещё раз, но подсказок постепенно станет меньше.
              </p>
              <p className="text-slate-400 text-sm mb-8">
                Не нужно выполнять всё идеально. Найдите комфортный для себя ритм.
              </p>
              <div className="mt-auto pb-8 w-full">
                <button
                  onClick={() => {
                    setConsolidationTimeLeft(240);
                    setStep('consolidation');
                    setIsActive(true);
                    setPhase('inhale1');
                  }}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Продолжить
                </button>
              </div>
            </motion.div>
          )}

          {/* CONSOLIDATION STEP */}
          {step === 'consolidation' && (
            <motion.div
              key="consolidation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex flex-col items-center justify-between sm:justify-center flex-1 py-4 min-h-0 relative"
            >
              <AnimatePresence>
                {consolidationTimeLeft <= 150 && consolidationTimeLeft > 140 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-[10%] w-full text-center z-30">
                    <h3 className="text-xl text-white mb-2 font-medium">Теперь продолжайте самостоятельно</h3>
                    <p className="text-slate-400">Не нужно точно попадать в заданный ритм.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {consolidationTimeLeft <= 60 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-4">
                    <h3 className="text-2xl text-white mb-4 font-medium">Теперь просто остановитесь</h3>
                    {consolidationTimeLeft > 52 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 text-lg">Ничего специально не делайте с состоянием.</motion.p>
                    )}
                    {consolidationTimeLeft <= 52 && consolidationTimeLeft > 40 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 text-lg">Просто заметьте, что сейчас ощущается в теле.</motion.p>
                    )}
                    {consolidationTimeLeft <= 40 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 text-lg flex flex-col gap-2">
                        <p>Не нужно расслабляться сильнее.</p>
                        <p>Не нужно ничего исправлять.</p>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 2 }}
                      className="absolute bottom-16 flex flex-col items-center gap-3"
                    >
                      <div className="w-24 h-[1px] bg-white/10 overflow-hidden rounded-full">
                        <div 
                          className="h-full bg-slate-500/50 transition-all duration-1000 ease-linear rounded-full"
                          style={{ width: `${(consolidationTimeLeft / 60) * 100}%` }}
                        />
                      </div>
                      <div className="text-slate-500/50 font-light text-xs tabular-nums tracking-widest">
                        00:{consolidationTimeLeft.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
                {consolidationTimeLeft > 60 && (
                  <motion.div
                    initial="exhale"
                    variants={circleVariants}
                    animate={isActive ? phase : 'exhale'}
                    style={{ opacity: consolidationTimeLeft <= 90 ? 0.2 : 1 }}
                    className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-200/80 blur-[50px] sm:blur-[80px] mix-blend-screen pointer-events-none transition-opacity duration-1000"
                  />
                )}

                {consolidationTimeLeft > 60 && (
                  <motion.div
                    initial="initial"
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: consolidationTimeLeft <= 90 ? 0.2 : 1 }}
                    variants={dotVariants}
                    animate={isActive ? phase : 'initial'}
                  />
                )}

                <AnimatePresence>
                  {consolidationTimeLeft > 150 && (
                    <motion.div exit={{ opacity: 0 }} className="absolute flex flex-col justify-center items-center pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500">
                      {isActive && (
                        <>
                          <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                            {getPhaseText()}
                          </div>
                          <div className="text-xl font-light tracking-[0.15em] uppercase text-blue-200 mt-2">
                            {getSubPhaseText() || ' '}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {consolidationTimeLeft > 60 && (
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="mt-4 sm:mt-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                  >
                    {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* POST-CHECK STEP */}
          {step === 'post-check' && (
            <motion.div
              key="post-check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full"
            >
              <h2 className="text-2xl font-medium mb-2 text-white text-center">Как вы себя чувствуете сейчас?</h2>
              <p className="text-slate-400 mb-12 text-center">Оцените уровень тревожности после практики</p>
              
              <div className="text-6xl font-light mb-8 tabular-nums text-center text-white">
                {postAnxiety}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={postAnxiety}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (newValue !== postAnxiety) {
                    setPostAnxiety(newValue);
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                  }
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mb-12 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              />
              <div className="mt-auto pb-8 w-full">
                <button
                  onClick={() => setStep('summary')}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Продолжить
                </button>
              </div>
            </motion.div>
          )}

          {/* SUMMARY STEP */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full items-center text-center"
            >
              <div className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-10">Итоги практики</div>
              
              <div className="flex items-center justify-center gap-8 mb-12 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 tracking-wider uppercase mb-3">До</span>
                  <span className="text-6xl font-light text-slate-400">{preAnxiety}</span>
                </div>
                <ArrowRight className="w-8 h-8 text-slate-700 mt-6" />
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 tracking-wider uppercase mb-3">После</span>
                  <span className="text-6xl font-light text-white">{postAnxiety}</span>
                </div>
              </div>

              {preAnxiety > postAnxiety ? (
                <>
                  <h2 className="text-2xl font-medium text-white mb-4">Заметьте эту разницу</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Сегодня вы не только попробовали снизить напряжение, но и получили важный опыт: иногда можно просто оставить своё состояние в покое и ничего с ним не делать.
                  </p>
                </>
              ) : preAnxiety === postAnxiety ? (
                <>
                  <h2 className="text-2xl font-medium text-white mb-4">Состояние не изменилось</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Это тоже полезное наблюдение. Задача первого дня — просто познакомиться с навыком и позволить себе некоторое время побыть в покое.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-medium text-white mb-4">Напряжение немного выросло</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Не нужно пытаться исправить этот результат. Просто отметьте его как факт, поблагодарите себя за практику и завершите день.
                  </p>
                </>
              )}

              <div className="mt-auto pb-8 w-full">
                <button
                  onClick={() => setStep('sos-reveal')}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
                >
                  Далее
                </button>
              </div>
            </motion.div>
          )}

          {/* SOS REVEAL STEP */}
          {step === 'sos-reveal' && (
            <motion.div
              key="sos-reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full items-center text-center"
            >
              <div className="w-20 h-20 rounded-full border border-dashed border-red-500/50 bg-red-500/10 text-red-400 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <span className="text-xl font-bold tracking-wider">SOS</span>
              </div>
              
              <h2 className="text-3xl font-medium mb-4 text-white">
                Скорая помощь
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Вы освоили базовый механизм. Теперь на главном экране вам всегда доступна кнопка <strong className="text-white">SOS (Скорая помощь)</strong>.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left w-full">
                <p className="text-slate-400 text-sm leading-relaxed text-center">
                  Теперь вам доступен короткий режим, который можно использовать в момент сильной тревоги, чтобы немного снизить уровень возбуждения и вернуть внимание к происходящему.
                </p>
              </div>

              <div className="mt-auto pb-8 w-full">
                <button
                  onClick={handleComplete}
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
                >
                  Завершить День 1
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

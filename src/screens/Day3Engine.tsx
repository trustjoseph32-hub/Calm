import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

type Step = 'intro' | 'pre-check' | 'practice' | 'post-check' | 'summary';

const INTRO_CARDS = [
  {
    title: 'Разделение с мыслями',
    text: 'Мысли — это просто мысли. При тревоге мозг генерирует пугающие сценарии. Наша цель сегодня — не спорить с ними, а лишить их эмоционального заряда.',
  },
  {
    title: 'Перегрузка рабочей памяти',
    text: 'Мы используем движение глаз. Пока вы следите за шариком, рабочая память мозга перегружается, и у него физически не остается ресурсов на поддержание яркой картинки страха.',
  }
];

const PRACTICE_DURATION_SEC = 120; // 2 minutes

export function Day3Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  const [step, setStep] = useState<Step>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  
  const [preAnxiety, setPreAnxiety] = useState<number>(5);
  const [postAnxiety, setPostAnxiety] = useState<number>(5);

  // Practice State
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PRACTICE_DURATION_SEC);
  const [phase, setPhase] = useState<'left' | 'right'>('left');
  
  // Audio handling
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (isActive && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [isActive, audioContext]);
  
  const playClick = (pan: -1 | 1) => {
    if (!audioContext || audioContext.state !== 'running') return;
    
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panner = audioContext.createStereoPanner();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    panner.pan.value = pan;
    
    osc.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
  };

  // Handle Practice Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'practice' && isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'practice') {
      setIsActive(false);
      setStep('post-check');
    }
    return () => clearInterval(interval);
  }, [step, isActive, timeLeft]);

  // Handle Target Movement (Bilateral stimulation)
  useEffect(() => {
    let moveInterval: NodeJS.Timeout;
    if (step === 'practice' && isActive) {
      // Move every 1.5 seconds (standard EMDR pace)
      moveInterval = setInterval(() => {
        setPhase(p => {
          const next = p === 'left' ? 'right' : 'left';
          playClick(next === 'left' ? -1 : 1);
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(moveInterval);
  }, [step, isActive]);

  const handleComplete = () => {
    addSession({
      sessionId: `day3-${Date.now()}`,
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
      courseDay: 3,
    });
    markCourseDayCompleted(3);
    navigate('/course');
  };

  const handleClose = () => {
    if (true) {
      navigate('/course');
    }
  };

  const dotVariants = {
    left: { x: '-46vw', transition: { duration: 1.5, ease: 'easeInOut' } },
    right: { x: '46vw', transition: { duration: 1.5, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 font-medium tracking-wider uppercase">Курс • День 3</span>
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
                  if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume();
                  }
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

              <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center mb-12">
                {/* Background breathing circle (static/gentle pulse just for atmosphere) */}
                <motion.div
                  className="absolute w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full bg-white/5 blur-3xl mix-blend-screen pointer-events-none"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Moving Target Dot */}
                <motion.div 
                  className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-[0_0_40px_15px_rgba(255,255,255,0.6)] z-10 pointer-events-none"
                  variants={dotVariants}
                  initial="left"
                  animate={isActive ? phase : 'left'}
                />

                <div className="absolute top-0 text-xl font-light text-center text-white/70 px-4 w-full">
                   Вспомните тревожную мысль.<br/>Держите её на фоне, пока глаза непрерывно следят за точкой.
                </div>
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
                <p className="text-slate-300 leading-relaxed text-center">
                  Заметили, как тревожная мысль стала более тусклой и далёкой? Так работает наша биология. Рабочая память не может одновременно ярко визуализировать страх и следить за внешним стимулом.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg"
              >
                Завершить День 3
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

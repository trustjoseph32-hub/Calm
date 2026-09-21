import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';
import { BODY_LOCATIONS, BodyLocation, getBodyLocationInPrepositional } from '../data/courseData';
import { playSoftBeep } from '../lib/audio';

type Step = 
  | 'card1' 
  | 'card2' 
  | 'pre-thought' 
  | 'pre-location' 
  | 'pre-intensity' 
  | 'stage-intro' 
  | 'stage-practice' 
  | 'consolidation-intro' 
  | 'consolidation-practice' 
  | 'exposure-tail' 
  | 'post-thought' 
  | 'post-location' 
  | 'post-intensity' 
  | 'summary' 
  | 'sos-reveal';

const STAGE_INTROS: Record<number, { 
  title: string; 
  subtitle: string; 
  lead?: string; 
  text?: string; 
  bullets?: string[]; 
  action: string 
}> = {
  1: {
    subtitle: 'Внимание + дыхание — Шаг 1 из 3',
    title: 'Дыхание',
    lead: 'Осваиваем физиологический вздох:',
    bullets: [
      'Два вдоха носом (обычный вдох и сразу короткий довдох) и после долгий плавный выдох через рот.'
    ],
    action: 'Начать'
  },
  2: {
    subtitle: 'Внимание + дыхание — Шаг 2 из 3',
    title: 'Движение глаз',
    bullets: [
      'Не поворачивая головы, плавно ведите взгляд за светящейся точкой от края до края экрана.',
      'Старайтесь доводить движение глаз до конца, ощущая небольшое напряжение в мышцах глаз.'
    ],
    text: 'Это действие снижает фиксацию на тревожности.',
    action: 'Начать'
  },
  3: {
    subtitle: 'Внимание + дыхание — Шаг 3 из 3',
    title: 'Добавим телесное напряжение и расслабление',
    lead: 'Соединяем дыхание, движение глаз и сброс напряжения:',
    bullets: [
      'на вдохе мягко сжимайте ладони в кулаки',
      'на выдохе полностью расслабляйте пальцы, сбрасывая мышечный зажим'
    ],
    action: 'Начать'
  }
};

export function Day1Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  const [step, setStep] = useState<Step>('card2');
  
  // Pre-check state
  const [situationText, setSituationText] = useState('');
  const [thoughtTimer, setThoughtTimer] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState<BodyLocation>('Грудь');
  const [customLocation, setCustomLocation] = useState('');
  const [preAnxiety, setPreAnxiety] = useState<number>(6);

  // Learning stages state (1: breath, 2: eyes, 3: hands)
  const [practiceStage, setPracticeStage] = useState(1);
  const [stageTimeLeft, setStageTimeLeft] = useState(45); // 45s per learning stage
  const [isStageActive, setIsStageActive] = useState(false);
  const [phase, setPhase] = useState<'inhale1' | 'inhale2' | 'hold' | 'exhale'>('inhale1');

  // Consolidation practice state (Practice A combined)
  const [consolidationTimeLeft, setConsolidationTimeLeft] = useState(150); // 2.5 min
  const [isConsolidationActive, setIsConsolidationActive] = useState(false);

  // Exposure tail state
  const [exposureTimeLeft, setExposureTimeLeft] = useState(60); // 1 min (60s)

  // Post-check state
  const [postThoughtTimer, setPostThoughtTimer] = useState(6);
  const [postLocation, setPostLocation] = useState<BodyLocation>('Грудь');
  const [isRelocated, setIsRelocated] = useState(false);
  const [postAnxiety, setPostAnxiety] = useState<number>(4);

  // Synchronize postLocation with preLocation initially
  useEffect(() => {
    setPostLocation(selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation);
  }, [selectedLocation, customLocation]);

  // Thought hold timer
  useEffect(() => {
    if (step === 'pre-thought' && thoughtTimer > 0) {
      const t = setTimeout(() => setThoughtTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, thoughtTimer]);

  // Post thought timer
  useEffect(() => {
    if (step === 'post-thought' && postThoughtTimer > 0) {
      const t = setTimeout(() => setPostThoughtTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, postThoughtTimer]);

  // Stage learning practice timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'stage-practice' && isStageActive && stageTimeLeft > 0) {
      interval = setInterval(() => {
        setStageTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (stageTimeLeft === 0 && step === 'stage-practice') {
      setIsStageActive(false);
      if (practiceStage < 3) {
        setPracticeStage(prev => prev + 1);
        setStep('stage-intro');
      } else {
        setStep('consolidation-intro');
      }
    }
    return () => clearInterval(interval);
  }, [step, isStageActive, stageTimeLeft, practiceStage]);

  // Breathing cycle for stages 1-3 & consolidation
  useEffect(() => {
    const isPracticeActive = (step === 'stage-practice' && isStageActive && practiceStage <= 3) || 
                             (step === 'consolidation-practice' && isConsolidationActive);
    if (!isPracticeActive) return;

    let timeout: NodeJS.Timeout;
    const hasMovingDot = (step === 'stage-practice' && (practiceStage === 2 || practiceStage === 3)) ||
                         (step === 'consolidation-practice');

    if (phase === 'inhale1') {
      timeout = setTimeout(() => setPhase('inhale2'), 1800);
    } else if (phase === 'inhale2') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 40]);
      }
      timeout = setTimeout(() => {
        setPhase('exhale');
        if (hasMovingDot) {
          playSoftBeep('right');
        }
      }, 1800);
    } else if (phase === 'exhale') {
      timeout = setTimeout(() => {
        setPhase('inhale1');
        if (hasMovingDot) {
          playSoftBeep('left');
        }
      }, 3600);
    }

    return () => clearTimeout(timeout);
  }, [phase, isStageActive, isConsolidationActive, step, practiceStage]);

  // Consolidation practice timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'consolidation-practice' && isConsolidationActive && consolidationTimeLeft > 0) {
      interval = setInterval(() => {
        setConsolidationTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (consolidationTimeLeft === 0 && step === 'consolidation-practice') {
      setIsConsolidationActive(false);
      setStep('exposure-tail');
    }
    return () => clearInterval(interval);
  }, [step, isConsolidationActive, consolidationTimeLeft]);

  // Exposure tail timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'exposure-tail' && exposureTimeLeft > 0) {
      interval = setInterval(() => {
        setExposureTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (exposureTimeLeft === 0 && step === 'exposure-tail') {
      setStep('post-thought');
    }
    return () => clearInterval(interval);
  }, [step, exposureTimeLeft]);

  const activeBodyAreaText = selectedLocation === 'Другое' && customLocation 
    ? customLocation 
    : (selectedLocation === 'Трудно определить' ? 'тело' : selectedLocation.toLowerCase());

  const handleCompleteDay1 = () => {
    const finalLocation = isRelocated ? postLocation : (selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation);
    addSession({
      sessionId: `day1-${Date.now()}`,
      date: new Date().toISOString(),
      practiceType: 'course',
      practiceCategory: 'A',
      courseDay: 1,
      duration: 360,
      exposureDuration: 60,
      anxietySituation: situationText.trim() || undefined,
      bodyLocationBefore: selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation,
      bodyLocationAfter: finalLocation,
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
    });
    markCourseDayCompleted(1);
    navigate('/course');
  };

  const dotVariants = {
    initial: { x: '-38vw', opacity: 1 },
    inhale: { x: '38vw', opacity: 1, transition: { duration: 3.6, ease: 'easeInOut' } },
    exhale: { x: '-38vw', opacity: 1, transition: { duration: 3.6, ease: 'easeInOut' } }
  };

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    inhale1: { scale: 0.75, opacity: 0.65, transition: { duration: 1.8, ease: 'easeOut' } },
    inhale2: { scale: 1.25, opacity: 0.95, transition: { duration: 1.8, ease: 'easeOut' } },
    exhale: { scale: 0.25, opacity: 0.2, transition: { duration: 3.6, ease: 'easeInOut' } }
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] text-white overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a365d_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="px-4 py-5 w-full flex items-center justify-between relative z-20 sm:max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-[#38bdf8] font-medium tracking-wider uppercase">День 1 из 14</span>
          <span className="text-sm text-white/60">Освоение «Внимание + дыхание»</span>
        </div>
        <button 
          onClick={() => navigate('/course')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col w-full relative z-10 px-4 sm:max-w-xl mx-auto justify-center">
        <AnimatePresence mode="wait">

          {/* INSTRUCTION CARD */}
          {step === 'card2' && (
            <motion.div
              key="card2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-[#38bdf8] text-xs uppercase tracking-widest font-medium mb-2">Инструкция</div>
              <h1 className="text-3xl font-light text-white mb-4">Обучение элементам</h1>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left leading-relaxed text-white/80 text-sm flex flex-col gap-3">
                <p>1. <strong>Дыхание:</strong> физиологический вздох — два вдоха носом и долгий плавный выдох через рот.</p>
                <p>2. <strong>Взгляд:</strong> непрерывное слежение глазами за точкой от края до края.</p>
                <p>3. <strong>Тело:</strong> мягкое сжатие ладоней на вдохе и полный сброс мышечного зажима на выдохе.</p>
                <p>4. <strong>Закрепление:</strong> соединяем все три элемента в общую практику на 2.5 минуты + 1 минута тишины.</p>
              </div>
              <button
                onClick={() => setStep('pre-thought')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 active:scale-[0.99] transition-all"
              >
                Дальше
              </button>
            </motion.div>
          )}

          {/* PRE-CHECK 1: ТРЕВОЖНАЯ СИТУАЦИЯ / МЫСЛЬ */}
          {step === 'pre-thought' && (
            <motion.div
              key="pre-thought"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Шаг 1 из 3 • Ситуация
              </div>

              <h2 className="text-2xl font-light text-white mb-3 leading-snug">
                Вспомните ситуацию или мысль, которая сейчас вызывает у вас тревогу
              </h2>

              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Не нужно специально усиливать тревогу. Просто удерживайте эту ситуацию в уме несколько секунд.
              </p>

              <div className="mb-6 text-left">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider font-medium">Например:</div>
                <ul className="space-y-2.5 text-sm text-white/70">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Важный разговор или звонок по работе</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Дедлайн, экзамен или сложное дело</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Беспокойство о будущем или здоровье</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep('pre-location')}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* PRE-CHECK 2: ЛОКАЛИЗАЦИЯ В ТЕЛЕ */}
          {step === 'pre-location' && (
            <motion.div
              key="pre-location"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Шаг 2 из 3 • Тело</div>
              <h2 className="text-2xl font-light text-white mb-2 leading-snug">
                Где в теле эта тревожность откликается сильнее всего?
              </h2>
              <p className="text-white/60 text-xs mb-5">
                Выберите один основной участок
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {BODY_LOCATIONS.map((loc) => {
                  const isSelected = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-3.5 rounded-2xl border text-sm font-medium transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{loc}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('pre-intensity')}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* PRE-CHECK 3: ИНТЕНСИВНОСТЬ ТРЕВОЖНОСТИ (0-10) */}
          {step === 'pre-intensity' && (
            <motion.div
              key="pre-intensity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Шаг 3 из 3 • Оценка</div>
              <h2 className="text-2xl font-light text-white mb-2">
                Оцените силу тревожности прямо сейчас
              </h2>
              <p className="text-white/60 text-xs mb-8">
                0 — полное спокойствие, 10 — максимальная тревожность
              </p>

              <div className="w-24 h-24 mx-auto rounded-3xl bg-[#0A1325] border border-[#38bdf8]/30 flex items-center justify-center text-5xl font-light text-[#38bdf8] mb-8 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                {preAnxiety}
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={preAnxiety}
                onChange={(e) => setPreAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#38bdf8] mb-10"
              />

              <button
                onClick={() => setStep('stage-intro')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Дальше
              </button>
            </motion.div>
          )}

          {/* STAGE INTRO (1 to 3) */}
          {step === 'stage-intro' && (
            <motion.div
              key={`stage-intro-${practiceStage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                {STAGE_INTROS[practiceStage].subtitle}
              </div>

              <h2 className="text-2xl sm:text-3xl font-light mb-3 text-white leading-snug">
                {STAGE_INTROS[practiceStage].title}
              </h2>

              {STAGE_INTROS[practiceStage].lead && (
                <p className="text-white/60 text-sm leading-relaxed mb-5 whitespace-pre-line">
                  {STAGE_INTROS[practiceStage].lead}
                </p>
              )}

              {STAGE_INTROS[practiceStage].bullets && (
                <div className="mb-6 text-left">
                  <ul className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed">
                    {STAGE_INTROS[practiceStage].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {STAGE_INTROS[practiceStage].text && (
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">
                  {STAGE_INTROS[practiceStage].text}
                </p>
              )}

              <button
                onClick={() => {
                  setStageTimeLeft(45);
                  setStep('stage-practice');
                  setIsStageActive(true);
                  setPhase('inhale1');
                }}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                {STAGE_INTROS[practiceStage].action}
              </button>
            </motion.div>
          )}

          {/* STAGE PRACTICE PLAYER */}
          {step === 'stage-practice' && (
            <motion.div
              key={`stage-practice-${practiceStage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center justify-between flex-1 py-4 min-h-0 relative"
            >
              <div className="flex justify-between w-full max-w-sm items-center text-xs text-white/50 font-mono">
                <span>Элемент {practiceStage} из 3</span>
                <span>00:{stageTimeLeft.toString().padStart(2, '0')}</span>
              </div>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
                {/* Visual circle */}
                <motion.div
                  key={`circle-stage-${practiceStage}`}
                  variants={circleVariants}
                  initial="initial"
                  animate={isStageActive ? phase : 'initial'}
                  className="absolute w-[70vw] h-[70vw] max-w-[420px] max-h-[420px] rounded-full bg-sky-300/40 blur-[50px] mix-blend-screen pointer-events-none"
                />

                {/* Eye dot for stage 2 and 3 */}
                {(practiceStage === 2 || practiceStage === 3) && (
                  <motion.div 
                    key={`dot-stage-${practiceStage}`}
                    className="absolute w-7 h-7 rounded-full bg-white shadow-[0_0_25px_8px_rgba(255,255,255,0.7)] z-20 pointer-events-none"
                    variants={dotVariants}
                    initial="initial"
                    animate={isStageActive ? (phase === 'exhale' ? 'exhale' : 'inhale') : 'initial'}
                  />
                )}

                {/* Prompt text for stages 1-3 */}
                <div className="absolute flex flex-col items-center text-center z-30 pointer-events-none drop-shadow-md">
                  <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                    {phase === 'inhale1' ? 'Вдох' : phase === 'inhale2' ? 'Довдох' : 'Выдох'}
                  </div>
                  {practiceStage === 3 && (
                    <div className="text-sm font-medium tracking-wider uppercase text-blue-200 mt-2">
                      {(phase === 'inhale1' || phase === 'inhale2') ? 'Сжимаем ладони' : 'Расслабляем ладони'}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsStageActive(!isStageActive)}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              >
                {isStageActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </motion.div>
          )}

          {/* CONSOLIDATION INTRO */}
          {step === 'consolidation-intro' && (
            <motion.div
              key="consolidation-intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-left"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Финальный блок Дня 1
              </div>
              <h2 className="text-2xl sm:text-3xl font-light mb-3 text-white leading-snug">
                Основная практика
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Сейчас мы соединяем все элементы практики «Внимание + дыхание» вместе на 2.5 минуты:
              </p>
              <div className="mb-8 text-left">
                <ul className="space-y-2.5 text-sm text-white/70">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Двойной вдох носом + сжатие ладоней</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Длинный выдох ртом + расслабление ладоней</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Взгляд неотрывно следует за точкой, без движения головы</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setConsolidationTimeLeft(150);
                  setStep('consolidation-practice');
                  setIsConsolidationActive(true);
                  setPhase('inhale1');
                }}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Начать сессию
              </button>
            </motion.div>
          )}

          {/* CONSOLIDATION PRACTICE */}
          {step === 'consolidation-practice' && (
            <motion.div
              key="consolidation-practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center justify-between flex-1 py-4 min-h-0 relative"
            >
              <div className="flex justify-between w-full max-w-sm items-center text-xs text-white/50 font-mono">
                <span>Внимание + дыхание • Сессия</span>
                <span>{Math.floor(consolidationTimeLeft / 60)}:{(consolidationTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
                {/* Circle */}
                <motion.div
                  key="consolidation-circle"
                  variants={circleVariants}
                  initial="initial"
                  animate={isConsolidationActive ? phase : 'initial'}
                  className="absolute w-[75vw] h-[75vw] max-w-[450px] max-h-[450px] rounded-full bg-sky-200/50 blur-[60px] mix-blend-screen pointer-events-none"
                />

                {/* Dot */}
                <motion.div 
                  key="consolidation-dot"
                  className="absolute w-7 h-7 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.6)] z-20 pointer-events-none"
                  variants={dotVariants}
                  initial="initial"
                  animate={isConsolidationActive ? (phase === 'exhale' ? 'exhale' : 'inhale') : 'initial'}
                />

                {/* Text */}
                <div className="absolute flex flex-col items-center text-center z-30 pointer-events-none drop-shadow-md">
                  <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                    {phase === 'inhale1' ? 'Вдох' : phase === 'inhale2' ? 'Довдох' : 'Выдох'}
                  </div>
                  <div className="text-xs font-medium tracking-wider uppercase text-blue-200 mt-2">
                    {(phase === 'inhale1' || phase === 'inhale2') ? 'Сжимаем ладони' : 'Расслабляем ладони'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsConsolidationActive(!isConsolidationActive)}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              >
                {isConsolidationActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </motion.div>
          )}

          {/* EXPOSURE TAIL (60 seconds) */}
          {step === 'exposure-tail' && (
            <motion.div
              key="exposure-tail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center items-center"
            >
              <h2 className="text-3xl font-light text-white mb-4">Теперь остановитесь</h2>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-white/80 text-sm leading-relaxed">
                Обратите внимание на ощущения {getBodyLocationInPrepositional(selectedLocation, customLocation)}.
                <br /><br />
                Ничего специально не меняйте. Просто побудьте с этим ощущением.
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                  <circle 
                    cx="72" cy="72" r="60" 
                    stroke="#38bdf8" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * (60 - exposureTimeLeft)) / 60}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute text-3xl font-light font-mono text-white">
                  00:{exposureTimeLeft.toString().padStart(2, '0')}
                </div>
              </div>

              <p className="text-white/40 text-xs tracking-wide">
                Период наблюдения без техники
              </p>
            </motion.div>
          )}

          {/* POST-CHECK 1: ТРЕВОЖНАЯ МЫСЛЬ */}
          {step === 'post-thought' && (
            <motion.div
              key="post-thought"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер</div>
              <h2 className="text-2xl font-light text-white mb-6 leading-snug">
                Снова на несколько секунд вспомните ту же ситуацию или мысль
              </h2>

              <button
                onClick={() => setStep('post-location')}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* POST-CHECK 2: ЛОКАЛИЗАЦИЯ ПОСЛЕ */}
          {step === 'post-location' && (
            <motion.div
              key="post-location"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер • Тело</div>
              <h2 className="text-2xl font-light text-white mb-2 leading-snug">
                Где тревога ощущается сейчас?
              </h2>
              <p className="text-white/60 text-xs mb-6">
                По умолчанию выбран исходный участок
              </p>

              {!isRelocated ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6 text-center">
                  <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Исходный участок</div>
                  <div className="text-2xl font-light text-[#38bdf8] mb-4">
                    {selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation}
                  </div>
                  <button
                    onClick={() => setIsRelocated(true)}
                    className="text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    Внимание переместилось на другой участок
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {BODY_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setPostLocation(loc)}
                      className={`p-3 rounded-2xl border text-sm font-medium transition-all text-left ${
                        postLocation === loc
                          ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-white'
                          : 'bg-white/5 border-white/10 text-white/70'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep('post-intensity')}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* POST-CHECK 3: ИНТЕНСИВНОСТЬ ПОСЛЕ (0-10) */}
          {step === 'post-intensity' && (
            <motion.div
              key="post-intensity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер • Оценка</div>
              <h2 className="text-2xl font-light text-white mb-2">
                Оцените силу тревожности сейчас
              </h2>
              <p className="text-white/60 text-xs mb-8">
                0 — полное спокойствие, 10 — максимальная тревожность
              </p>

              <div className="w-24 h-24 mx-auto rounded-3xl bg-[#0A1325] border border-[#38bdf8]/30 flex items-center justify-center text-5xl font-light text-[#38bdf8] mb-8 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                {postAnxiety}
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={postAnxiety}
                onChange={(e) => setPostAnxiety(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#38bdf8] mb-10"
              />

              <button
                onClick={() => setStep('summary')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Увидеть результат
              </button>
            </motion.div>
          )}

          {/* SUMMARY: НЕЙТРАЛЬНЫЙ ИТОГ */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-[#38bdf8] text-xs font-medium tracking-wider uppercase mb-3">Практика завершена</div>
              
              <div className="text-lg text-white font-medium mb-6">
                {isRelocated ? postLocation : (selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation)}
              </div>

              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-white/40 uppercase mb-1">До практики</span>
                  <span className="text-5xl font-light text-white/60">{preAnxiety}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-white/30" />
                <div className="flex flex-col items-center">
                  <span className="text-xs text-white/40 uppercase mb-1">После практики</span>
                  <span className="text-5xl font-light text-[#38bdf8]">{postAnxiety}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8 text-white/80 text-sm leading-relaxed">
                {postAnxiety < preAnxiety && (
                  <span>Просто заметьте эту разницу.</span>
                )}
                {postAnxiety === preAnxiety && (
                  <span>Сегодня ощущение осталось примерно таким же. Это тоже результат наблюдения.</span>
                )}
                {postAnxiety > preAnxiety && (
                  <span>Сейчас ощущение стало сильнее. Не нужно пытаться исправить этот результат. Просто отметьте его.</span>
                )}
              </div>

              <button
                onClick={() => setStep('sos-reveal')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* SOS REVEAL (Unlocked SOS after Day 1) */}
          {step === 'sos-reveal' && (
            <motion.div
              key="sos-reveal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center items-center"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-red-500/50 bg-red-500/10 text-red-400 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <span className="text-lg font-bold">SOS</span>
              </div>
              
              <h2 className="text-2xl font-light mb-3 text-white">
                Скорая помощь разблокирована
              </h2>

              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Вы освоили базовый механизм. Теперь на главном экране вам всегда доступен быстрый режим саморегуляции на случай сильного приступа тревоги.
              </p>

              <button
                onClick={handleCompleteDay1}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
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

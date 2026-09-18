import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ArrowRight, Play, Pause, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';
import { COURSE_DAYS_DATA, BODY_LOCATIONS, BodyLocation, getExposureDurationSec } from '../data/courseData';

type Step = 
  | 'card1' 
  | 'card2' 
  | 'pre-thought' 
  | 'pre-location' 
  | 'pre-intensity' 
  | 'practice' 
  | 'exposure-tail' 
  | 'post-thought' 
  | 'post-location' 
  | 'post-intensity' 
  | 'summary';

export function CourseDayEngine() {
  const navigate = useNavigate();
  const { day: dayParam } = useParams<{ day: string }>();
  const currentDay = Math.max(1, Math.min(14, parseInt(dayParam || '2', 10)));
  const { addSession, markCourseDayCompleted } = useAppStore();

  const dayData = COURSE_DAYS_DATA.find(d => d.day === currentDay) || COURSE_DAYS_DATA[1];

  const [step, setStep] = useState<Step>('card1');

  // For Day 14: choice between Practice A and Practice B
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<'A' | 'B'>(
    dayData.practiceType === 'choice' ? 'A' : (dayData.practiceType as 'A' | 'B')
  );

  // Pre-check state
  const [situationText, setSituationText] = useState('');
  const [thoughtTimer, setThoughtTimer] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState<BodyLocation>('Грудь');
  const [customLocation, setCustomLocation] = useState('');
  const [preAnxiety, setPreAnxiety] = useState<number>(6);

  // Practice state
  const [practiceTimeLeft, setPracticeTimeLeft] = useState(dayData.practiceDurationSec || 240);
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [showMidpointNotice, setShowMidpointNotice] = useState(false);

  // Practice A animation state
  const [phaseA, setPhaseA] = useState<'inhale1' | 'inhale2' | 'hold' | 'exhale'>('inhale1');

  // Practice B animation state
  const [tappingSide, setTappingSide] = useState<'left' | 'right'>('left');
  const [phaseB, setPhaseB] = useState<'inhale' | 'exhale'>('inhale');

  // Exposure tail state
  const exposureTotalSec = getExposureDurationSec(currentDay);
  const [exposureTimeLeft, setExposureTimeLeft] = useState(exposureTotalSec);

  // Post-check state
  const [postThoughtTimer, setPostThoughtTimer] = useState(6);
  const [postLocation, setPostLocation] = useState<BodyLocation>('Грудь');
  const [isRelocated, setIsRelocated] = useState(false);
  const [postAnxiety, setPostAnxiety] = useState<number>(4);

  // Synchronize postLocation initially
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

  // Practice A breathing cycle
  useEffect(() => {
    if (step !== 'practice' || !isPracticeActive || selectedPracticeCategory !== 'A') return;

    let timeout: NodeJS.Timeout;
    if (phaseA === 'inhale1') {
      timeout = setTimeout(() => setPhaseA('inhale2'), 1700);
    } else if (phaseA === 'inhale2') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 30]);
      }
      timeout = setTimeout(() => setPhaseA('hold'), 1700);
    } else if (phaseA === 'hold') {
      timeout = setTimeout(() => setPhaseA('exhale'), 800);
    } else if (phaseA === 'exhale') {
      timeout = setTimeout(() => setPhaseA('inhale1'), 5000);
    }

    return () => clearTimeout(timeout);
  }, [phaseA, isPracticeActive, step, selectedPracticeCategory]);

  // Practice B cycle: Inhale (4s) -> Long Exhale with Vocalization (6s) + Tapping
  useEffect(() => {
    if (step !== 'practice' || !isPracticeActive || selectedPracticeCategory !== 'B') return;

    let breathTimeout: NodeJS.Timeout;
    if (phaseB === 'inhale') {
      breathTimeout = setTimeout(() => setPhaseB('exhale'), 4000);
    } else {
      breathTimeout = setTimeout(() => setPhaseB('inhale'), 6000);
    }

    return () => clearTimeout(breathTimeout);
  }, [phaseB, isPracticeActive, step, selectedPracticeCategory]);

  // Practice B Tapping pulse
  useEffect(() => {
    if (step !== 'practice' || !isPracticeActive || selectedPracticeCategory !== 'B') return;

    const tapInterval = setInterval(() => {
      setTappingSide(prev => (prev === 'left' ? 'right' : 'left'));
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }, 1100);

    return () => clearInterval(tapInterval);
  }, [isPracticeActive, step, selectedPracticeCategory]);

  // Main practice timer & Midpoint Notice trigger
  const midpointTriggerSec = Math.floor(dayData.practiceDurationSec / 2);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'practice' && isPracticeActive && practiceTimeLeft > 0) {
      interval = setInterval(() => {
        setPracticeTimeLeft(prev => {
          const next = prev - 1;
          if (next <= midpointTriggerSec + 3 && next >= midpointTriggerSec - 3) {
            setShowMidpointNotice(true);
          } else {
            setShowMidpointNotice(false);
          }
          return next;
        });
      }, 1000);
    } else if (practiceTimeLeft === 0 && step === 'practice') {
      setIsPracticeActive(false);
      setExposureTimeLeft(exposureTotalSec);
      setStep('exposure-tail');
    }
    return () => clearInterval(interval);
  }, [step, isPracticeActive, practiceTimeLeft, midpointTriggerSec, exposureTotalSec]);

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

  const handleFinishCourseDay = () => {
    const finalLocation = isRelocated ? postLocation : (selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation);
    addSession({
      sessionId: `day${currentDay}-${Date.now()}`,
      date: new Date().toISOString(),
      practiceType: 'course',
      practiceCategory: selectedPracticeCategory,
      courseDay: currentDay,
      duration: dayData.practiceDurationSec + exposureTotalSec,
      exposureDuration: exposureTotalSec,
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
    markCourseDayCompleted(currentDay);
    navigate('/course');
  };

  const dotVariants = {
    initial: { x: '-40vw', opacity: 0 },
    inhale1: { x: '0vw', opacity: 1, transition: { duration: 1.7, ease: 'linear' } }, 
    inhale2: { x: '40vw', opacity: 1, transition: { duration: 1.7, ease: 'linear' } }, 
    hold: { x: '40vw', opacity: 1, transition: { duration: 0.8, ease: 'linear' } },
    exhale: { x: '-40vw', opacity: 1, transition: { duration: 5.0, ease: 'easeInOut' } }
  };

  const circleVariantsA = {
    exhale: { scale: 0.35, opacity: 0.2, transition: { duration: 5.0, ease: 'easeInOut' } },
    inhale1: { scale: 0.80, opacity: 0.65, transition: { duration: 1.7, ease: 'linear' } },
    inhale2: { scale: 1.25, opacity: 0.95, transition: { duration: 1.7, ease: 'easeOut' } },
    hold: { scale: 1.25, opacity: 0.95, transition: { duration: 0.8, ease: 'linear' } }
  };

  const circleVariantsB = {
    inhale: { scale: 1.15, opacity: 0.8, transition: { duration: 4.0, ease: 'easeInOut' } },
    exhale: { scale: 0.45, opacity: 0.25, transition: { duration: 6.0, ease: 'easeInOut' } }
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] text-white overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a365d_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="px-4 py-5 w-full flex items-center justify-between relative z-20 sm:max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-[#38bdf8] font-medium tracking-wider uppercase">
            День {currentDay} из 14
          </span>
          <span className="text-sm text-white/60">
            {selectedPracticeCategory === 'A' ? 'Практика A: Дыхание + взгляд + тело' : 'Практика B: Ритм + дыхание + голос'}
          </span>
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

          {/* CARD 1: ФОКУС ДНЯ */}
          {step === 'card1' && (
            <motion.div
              key="card1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-[#38bdf8] text-xs uppercase tracking-widest font-medium mb-2">1/2 • Фокус дня</div>
              <h1 className="text-3xl font-light text-white mb-4">{dayData.focusTitle}</h1>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left leading-relaxed text-white/80 text-base">
                {dayData.focusText}
              </div>
              <button
                onClick={() => setStep('card2')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 active:scale-[0.99] transition-all"
              >
                Далее: Инструкция
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* CARD 2: ИНСТРУКЦИЯ К ПРАКТИКЕ */}
          {step === 'card2' && (
            <motion.div
              key="card2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-[#38bdf8] text-xs uppercase tracking-widest font-medium mb-2">2/2 • Инструкция</div>
              <h1 className="text-3xl font-light text-white mb-4">{dayData.instructionTitle}</h1>

              {dayData.practiceType === 'choice' && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedPracticeCategory('A')}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                      selectedPracticeCategory === 'A' 
                        ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    Практика A<br />
                    <span className="text-xs font-normal text-white/60">Взгляд и дыхание</span>
                  </button>
                  <button
                    onClick={() => setSelectedPracticeCategory('B')}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                      selectedPracticeCategory === 'B' 
                        ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    Практика B<br />
                    <span className="text-xs font-normal text-white/60">Тэппинг и голос</span>
                  </button>
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left leading-relaxed text-white/80 text-sm whitespace-pre-wrap">
                {selectedPracticeCategory === 'A' ? (
                  <>
                    <p className="font-medium text-white mb-2">Практика A: Дыхание + взгляд + тело</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                      <li>Двойной вдох носом + легкое сжатие ладоней</li>
                      <li>Долгий выдох ртом + расслабление ладоней</li>
                      <li>Взгляд неотрывно следует за движением точки</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-white mb-2">Практика B: Ритм + дыхание + голос</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                      <li>Руки скрещены на груди, мягкий поочередный тэппинг по плечам</li>
                      <li>Спокойный вдох носом (4 сек)</li>
                      <li>Длинный выдох со звуком «мммм» или «аааа» (6 сек)</li>
                    </ul>
                  </>
                )}
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
                  В конце практики: период наблюдения без техники ({exposureTotalSec / 60} мин).
                </div>
              </div>

              <button
                onClick={() => setStep('pre-thought')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 active:scale-[0.99] transition-all"
              >
                Перейти к замеру
                <ArrowRight className="w-5 h-5" />
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
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Шаг 1 из 3 • Ситуация</div>
              <h2 className="text-2xl font-light text-white mb-3 leading-snug">
                Вспомните ситуацию или мысль, которая сейчас вызывает у вас тревогу
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Не нужно специально усиливать тревогу. Просто удерживайте эту ситуацию в уме несколько секунд.
              </p>

              <div className="mb-8 text-left">
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
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
                <ChevronRight className="w-5 h-5" />
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
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* PRE-CHECK 3: ИНТЕНСИВНОСТЬ 0-10 */}
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
                Насколько сильно это ощущение сейчас?
              </h2>
              <p className="text-white/60 text-xs mb-8">
                0 — почти не ощущается, 10 — максимально сильно
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
                onClick={() => {
                  setStep('practice');
                  setIsPracticeActive(true);
                  if (selectedPracticeCategory === 'A') setPhaseA('inhale1');
                  else setPhaseB('inhale');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Начать практику
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
            </motion.div>
          )}

          {/* MAIN PRACTICE: A or B */}
          {step === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center justify-between flex-1 py-4 min-h-0 relative"
            >
              <div className="flex justify-between w-full max-w-sm items-center text-xs text-white/50 font-mono">
                <span>{selectedPracticeCategory === 'A' ? 'Практика A' : 'Практика B'}</span>
                <span>{Math.floor(practiceTimeLeft / 60)}:{(practiceTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>

              {/* Midpoint notice (shown once for ~6 seconds) */}
              <AnimatePresence>
                {showMidpointNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 z-40 bg-[#0A1325]/95 border border-[#38bdf8]/40 px-5 py-3 rounded-2xl text-xs text-center text-white shadow-xl max-w-xs leading-relaxed"
                  >
                    На несколько секунд заметьте {activeBodyAreaText}. Не оценивайте его. Просто продолжайте упражнение.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
                {/* Practice A Visuals */}
                {selectedPracticeCategory === 'A' && (
                  <>
                    <motion.div
                      variants={circleVariantsA}
                      animate={isPracticeActive ? phaseA : 'exhale'}
                      className="absolute w-[75vw] h-[75vw] max-w-[450px] max-h-[450px] rounded-full bg-sky-200/50 blur-[60px] mix-blend-screen pointer-events-none"
                    />
                    <motion.div 
                      className="absolute w-7 h-7 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.6)] z-20 pointer-events-none"
                      variants={dotVariants}
                      animate={isPracticeActive ? phaseA : 'initial'}
                    />
                    <div className="absolute flex flex-col items-center text-center z-30 pointer-events-none drop-shadow-md">
                      <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                        {phaseA === 'inhale1' ? 'Вдох' : phaseA === 'inhale2' ? 'Довдох' : phaseA === 'hold' ? ' ' : 'Выдох'}
                      </div>
                      <div className="text-xs font-medium tracking-wider uppercase text-blue-200 mt-2">
                        {(phaseA === 'inhale1' || phaseA === 'inhale2') ? 'Сжимаем ладони' : phaseA === 'exhale' ? 'Расслабляем ладони' : ''}
                      </div>
                    </div>
                  </>
                )}

                {/* Practice B Visuals */}
                {selectedPracticeCategory === 'B' && (
                  <>
                    <motion.div
                      variants={circleVariantsB}
                      animate={isPracticeActive ? phaseB : 'exhale'}
                      className="absolute w-[75vw] h-[75vw] max-w-[450px] max-h-[450px] rounded-full bg-blue-300/40 blur-[60px] mix-blend-screen pointer-events-none"
                    />

                    {/* Butterfly tapping indicators */}
                    <div className="flex gap-12 z-20 items-center mb-16">
                      <div className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        tappingSide === 'left' 
                          ? 'border-[#38bdf8] bg-[#38bdf8]/30 scale-110 shadow-[0_0_25px_rgba(56,189,248,0.6)]' 
                          : 'border-white/20 bg-white/5 opacity-50'
                      }`}>
                        <span className="text-xs text-white/80 font-medium">Левое</span>
                        <span className="text-[10px] text-white/50">плечо</span>
                      </div>
                      <div className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        tappingSide === 'right' 
                          ? 'border-[#38bdf8] bg-[#38bdf8]/30 scale-110 shadow-[0_0_25px_rgba(56,189,248,0.6)]' 
                          : 'border-white/20 bg-white/5 opacity-50'
                      }`}>
                        <span className="text-xs text-white/80 font-medium">Правое</span>
                        <span className="text-[10px] text-white/50">плечо</span>
                      </div>
                    </div>

                    <div className="absolute bottom-6 flex flex-col items-center text-center z-30 pointer-events-none drop-shadow-md">
                      <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                        {phaseB === 'inhale' ? 'Вдох носом' : 'Выдох: «мммм»'}
                      </div>
                      <div className="text-xs font-medium tracking-wider text-blue-200 mt-1">
                        {phaseB === 'inhale' ? 'Спокойный вдох' : 'Долгий выдох со звуком'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsPracticeActive(!isPracticeActive)}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              >
                {isPracticeActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </motion.div>
          )}

          {/* EXPOSURE TAIL */}
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
                Снова обратите внимание на {activeBodyAreaText}, которое отмечали в начале.
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
                    strokeDashoffset={377 - (377 * (exposureTotalSec - exposureTimeLeft)) / exposureTotalSec}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute text-3xl font-light font-mono text-white">
                  {Math.floor(exposureTimeLeft / 60)}:{(exposureTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <p className="text-white/40 text-xs tracking-wide">
                Период наблюдения без техники
              </p>
            </motion.div>
          )}

          {/* POST-CHECK 1: РЕАКТИВАЦИЯ МЫСЛИ */}
          {step === 'post-thought' && (
            <motion.div
              key="post-thought"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер</div>
              <h2 className="text-2xl font-light text-white mb-4 leading-snug">
                Снова на несколько секунд вспомните ту же ситуацию или мысль
              </h2>
              {situationText && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-sm mb-6 italic">
                  «{situationText}»
                </div>
              )}
              <div className="text-xs text-white/40 mb-8 font-mono">
                {postThoughtTimer > 0 ? `Фокус: ${postThoughtTimer} сек` : 'Готово'}
              </div>

              <button
                onClick={() => setStep('post-location')}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
                <ChevronRight className="w-5 h-5" />
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
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер</div>
              <h2 className="text-2xl font-light text-white mb-2 leading-snug">
                Где тревога ощущается сейчас?
              </h2>
              <p className="text-white/60 text-xs mb-6">
                По умолчанию выбрано исходное место
              </p>

              {!isRelocated ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6 text-center">
                  <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Текущий участок</div>
                  <div className="text-2xl font-light text-[#38bdf8] mb-4">
                    {selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation}
                  </div>
                  <button
                    onClick={() => setIsRelocated(true)}
                    className="text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    Ощущение переместилось
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
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                Далее
                <ChevronRight className="w-5 h-5" />
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
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">Повторный замер</div>
              <h2 className="text-2xl font-light text-white mb-2">
                Насколько сильно это ощущение сейчас?
              </h2>
              <p className="text-white/60 text-xs mb-8">
                0 — почти не ощущается, 10 — максимально сильно
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
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Увидеть результат
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* SUMMARY: НЕЙТРАЛЬНЫЙ ИТОГ ДНЯ */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-[#38bdf8] text-xs font-medium tracking-wider uppercase mb-3">Итог Дня {currentDay}</div>
              
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
                onClick={handleFinishCourseDay}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Завершить практику
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

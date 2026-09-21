import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { BODY_LOCATIONS, BodyLocation, getBodyLocationInPrepositional } from '../data/courseData';

type Step = 
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
  | 'summary';

const STAGE_INTROS_DAY2: Record<number, { 
  title: string; 
  subtitle: string; 
  lead: string; 
  text?: string; 
  bullets?: string[]; 
  action: string 
}> = {
  1: {
    subtitle: 'Ритм + опора — Шаг 1 из 3',
    title: 'Тактильный ритм (Тэппинг)',
    lead: 'Скрестите руки на груди, положив ладони на плечи (или пальцы под ключицы в технике «объятие бабочки»).',
    text: 'Начните мягко поочередно похлопывать ладонями: левое плечо — правое плечо — левое — правое в спокойном темпе.\n\nБилатеральная стимуляция снижает гиперактивацию миндалевидного тела и возвращает ощущение физической опоры.',
    action: 'Начать'
  },
  2: {
    subtitle: 'Ритм + опора — Шаг 2 из 3',
    title: 'Дыхание со звуком',
    lead: 'Делаем спокойный вдох носом (4 секунды) и долгий плавный выдох через сомкнутые губы с тихим гудением «мммм» или «аааа» (6 секунд).',
    text: 'Почувствуйте мягкую вибрацию в груди и горле. Она стимулирует блуждающий нерв, снижая пульс и уровень гормонов стресса.',
    action: 'Начать'
  },
  3: {
    subtitle: 'Ритм + опора — Шаг 3 из 3',
    title: 'Синхронизация ритма и дыхания',
    lead: 'Соединяем оба элемента вместе:',
    bullets: [
      'продолжайте мягкий поочередный тэппинг по плечам',
      'делайте вдох носом (4 сек) и плавный выдох со звуком «мммм» (6 сек)'
    ],
    text: 'Тело и психика настраиваются на безопасный защитный ритм.',
    action: 'Начать'
  }
};

export function Day2Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  // Immediately starts with the instruction card
  const [step, setStep] = useState<Step>('card2');
  
  // Pre-check state
  const [situationText, setSituationText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<BodyLocation>('Грудь');
  const [customLocation, setCustomLocation] = useState('');
  const [preAnxiety, setPreAnxiety] = useState<number>(6);

  // Learning stages state (1: tapping, 2: vocal breath, 3: sync)
  const [practiceStage, setPracticeStage] = useState(1);
  const [stageTimeLeft, setStageTimeLeft] = useState(45); // 45s per learning stage
  const [isStageActive, setIsStageActive] = useState(false);
  const [phaseB, setPhaseB] = useState<'inhale' | 'exhale'>('inhale');
  const [tappingSide, setTappingSide] = useState<'left' | 'right'>('left');

  // Consolidation practice state (Practice B combined)
  const [consolidationTimeLeft, setConsolidationTimeLeft] = useState(150); // 2.5 min
  const [isConsolidationActive, setIsConsolidationActive] = useState(false);

  // Exposure tail state
  const [exposureTimeLeft, setExposureTimeLeft] = useState(60); // 1 min (60s)

  // Post-check state
  const [postLocation, setPostLocation] = useState<BodyLocation>('Грудь');
  const [isRelocated, setIsRelocated] = useState(false);
  const [postAnxiety, setPostAnxiety] = useState<number>(3);

  // Synchronize postLocation with preLocation initially
  useEffect(() => {
    setPostLocation(selectedLocation === 'Другое' && customLocation ? customLocation : selectedLocation);
  }, [selectedLocation, customLocation]);

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

  // Tapping pulse for stage 1 & stage 3
  useEffect(() => {
    const isTappingActive = (step === 'stage-practice' && isStageActive && (practiceStage === 1 || practiceStage === 3)) ||
                            (step === 'consolidation-practice' && isConsolidationActive);
    if (!isTappingActive) return;

    const tapInterval = setInterval(() => {
      setTappingSide(prev => (prev === 'left' ? 'right' : 'left'));
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }, 1100);
    return () => clearInterval(tapInterval);
  }, [step, isStageActive, practiceStage, isConsolidationActive]);

  // Practice B Breathing cycle: Inhale (4s) -> Exhale with vocalization (6s)
  useEffect(() => {
    const isBreathActive = (step === 'stage-practice' && isStageActive && (practiceStage === 2 || practiceStage === 3)) ||
                           (step === 'consolidation-practice' && isConsolidationActive);
    if (!isBreathActive) return;

    let breathTimeout: NodeJS.Timeout;
    if (phaseB === 'inhale') {
      breathTimeout = setTimeout(() => setPhaseB('exhale'), 4000);
    } else {
      breathTimeout = setTimeout(() => setPhaseB('inhale'), 6000);
    }

    return () => clearTimeout(breathTimeout);
  }, [phaseB, isStageActive, step, practiceStage, isConsolidationActive]);

  // Consolidation practice countdown timer
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

  // Exposure tail timer (1 min)
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

  // Complete session handler
  const handleFinishCourseDay = () => {
    addSession({
      type: 'course',
      practiceType: 'B',
      duration: 300,
      preAnxiety,
      postAnxiety,
      date: new Date().toISOString()
    });
    markCourseDayCompleted(2);
    setStep('summary');
  };

  const circleVariantsB = {
    initial: { scale: 0.5, opacity: 0.25 },
    inhale: { scale: 1.15, opacity: 0.85, transition: { duration: 4.0, ease: 'easeInOut' } },
    exhale: { scale: 0.5, opacity: 0.25, transition: { duration: 6.0, ease: 'easeInOut' } }
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] text-white overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a365d_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="px-4 py-5 w-full flex items-center justify-between relative z-20 sm:max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-[#38bdf8] font-medium tracking-wider uppercase">День 2 из 14</span>
          <span className="text-sm text-white/60">Освоение «Ритм + опора»</span>
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
                <p>1. <strong>Тэппинг:</strong> скрещенные на груди руки, мягкое поочередное похлопывание по плечам в спокойном ритме.</p>
                <p>2. <strong>Дыхание и звук:</strong> плавный вдох носом (4 сек) и долгий выдох через сомкнутые губы с тихим гудением «мммм» (6 сек).</p>
                <p>3. <strong>Синхронизация:</strong> соединяем тактильный ритм тэппинга и звуковой выдох в один непрерывный процесс.</p>
                <p>4. <strong>Закрепление:</strong> общая сессия практики «Ритм + опора» на 2.5 минуты + 1 минута тишины.</p>
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

              <div className="mb-6">
                <input
                  type="text"
                  value={situationText}
                  onChange={(e) => setSituationText(e.target.value)}
                  placeholder="Опишите кратко мысль или ситуацию (необязательно)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38bdf8]/60 transition-colors"
                />
              </div>

              <button
                onClick={() => setStep('pre-location')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
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
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Шаг 2 из 3 • Локализация в теле
              </div>

              <h2 className="text-2xl font-light mb-2 text-white">Где вы ощущаете тревогу или напряжение?</h2>
              <p className="text-sm text-white/60 mb-6">Обратите внимание на физический отклик в теле прямо сейчас.</p>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {BODY_LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`py-3 px-4 rounded-2xl border text-sm transition-all ${
                      selectedLocation === loc
                        ? 'border-[#38bdf8] bg-[#38bdf8]/15 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {selectedLocation === 'Другое' && (
                <input
                  type="text"
                  placeholder="Где именно в теле?"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 mb-6 focus:outline-none focus:border-[#38bdf8]/60 transition-colors"
                />
              )}

              <button
                onClick={() => setStep('pre-intensity')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* PRE-CHECK 3: ИНТЕНСИВНОСТЬ ТРЕВОГИ */}
          {step === 'pre-intensity' && (
            <motion.div
              key="pre-intensity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Шаг 3 из 3 • Оценка состояния
              </div>

              <h2 className="text-2xl font-light mb-2 text-white">Оцените интенсивность напряжения</h2>
              <p className="text-sm text-white/60 mb-6">
                Насколько сильно ощущается напряжение {getBodyLocationInPrepositional(selectedLocation, customLocation)}?
              </p>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                <div className="text-5xl font-extralight text-[#38bdf8] mb-2 font-mono">{preAnxiety}</div>
                <div className="text-xs text-white/40 mb-6">по шкале от 0 до 10</div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={preAnxiety}
                  onChange={(e) => setPreAnxiety(parseInt(e.target.value, 10))}
                  className="w-full accent-[#38bdf8] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-white/40 mt-3 font-mono">
                  <span>0 • Покой</span>
                  <span>5 • Умеренно</span>
                  <span>10 • Сильно</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPracticeStage(1);
                  setStep('stage-intro');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Перейти к обучению
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
                {STAGE_INTROS_DAY2[practiceStage].subtitle}
              </div>

              <h2 className="text-2xl sm:text-3xl font-light mb-3 text-white leading-snug">
                {STAGE_INTROS_DAY2[practiceStage].title}
              </h2>

              <p className="text-white/60 text-sm leading-relaxed mb-5 whitespace-pre-line">
                {STAGE_INTROS_DAY2[practiceStage].lead}
              </p>

              {STAGE_INTROS_DAY2[practiceStage].bullets && (
                <div className="mb-4 text-left">
                  <ul className="space-y-2.5 text-sm text-white/70">
                    {STAGE_INTROS_DAY2[practiceStage].bullets!.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {STAGE_INTROS_DAY2[practiceStage].text && (
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">
                  {STAGE_INTROS_DAY2[practiceStage].text}
                </p>
              )}

              <button
                onClick={() => {
                  setStageTimeLeft(45);
                  setStep('stage-practice');
                  setIsStageActive(true);
                  setPhaseB('inhale');
                }}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                {STAGE_INTROS_DAY2[practiceStage].action}
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

              <div className="relative w-full flex-1 flex items-center justify-center min-h-[320px]">
                {/* Visual breathing circle for stages 2 and 3 */}
                {(practiceStage === 2 || practiceStage === 3) && (
                  <motion.div
                    key={`circle-stage2-${practiceStage}`}
                    variants={circleVariantsB}
                    initial="initial"
                    animate={isStageActive ? phaseB : 'initial'}
                    className="absolute w-[70vw] h-[70vw] max-w-[420px] max-h-[420px] rounded-full bg-cyan-400/20 blur-[50px] mix-blend-screen pointer-events-none"
                  />
                )}

                {/* Alternating tapping balls for stage 1 and 3 */}
                {(practiceStage === 1 || practiceStage === 3) && (
                  <div className="flex flex-col items-center z-20 gap-8">
                    <div className="flex gap-10 items-center justify-center">
                      <div className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        tappingSide === 'left' 
                          ? 'border-[#38bdf8] bg-[#38bdf8]/35 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.7)]' 
                          : 'border-white/20 bg-white/5 opacity-40'
                      }`}>
                        <span className="text-xs text-white font-medium">Левое</span>
                        <span className="text-[10px] text-white/60">плечо</span>
                      </div>
                      <div className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        tappingSide === 'right' 
                          ? 'border-[#38bdf8] bg-[#38bdf8]/35 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.7)]' 
                          : 'border-white/20 bg-white/5 opacity-40'
                      }`}>
                        <span className="text-xs text-white font-medium">Правое</span>
                        <span className="text-[10px] text-white/60">плечо</span>
                      </div>
                    </div>

                    {/* Text guide */}
                    <div className="flex flex-col items-center text-center drop-shadow-md">
                      {practiceStage === 1 && (
                        <div className="text-lg font-light tracking-wide uppercase text-white/80">
                          Поочередный тэппинг по плечам
                        </div>
                      )}
                      {practiceStage === 3 && (
                        <>
                          <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                            {phaseB === 'inhale' ? 'Вдох носом' : 'Выдох: «мммм»'}
                          </div>
                          <div className="text-xs font-medium tracking-wider text-blue-200 mt-2">
                            {phaseB === 'inhale' ? 'Спокойный вдох на 4 счета' : 'Долгий выдох со звуком на 6 счетов'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Prompt text for stage 2 (only breathing + voice) */}
                {practiceStage === 2 && (
                  <div className="absolute flex flex-col items-center text-center z-30 pointer-events-none drop-shadow-md">
                    <div className="text-3xl font-light tracking-[0.2em] uppercase text-white mb-2">
                      {phaseB === 'inhale' ? 'Вдох носом' : 'Выдох: «мммм»'}
                    </div>
                    <div className="text-sm font-medium tracking-wider text-cyan-200">
                      {phaseB === 'inhale' ? 'Спокойный вдох (4 сек)' : 'Долгий выдох с гудением (6 сек)'}
                    </div>
                  </div>
                )}
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
                Финальный блок Дня 2
              </div>
              <h2 className="text-2xl sm:text-3xl font-light mb-3 text-white leading-snug">
                Основная практика
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Сейчас мы соединяем все элементы практики «Ритм + опора» вместе на 2.5 минуты:
              </p>
              <div className="mb-8 text-left">
                <ul className="space-y-2.5 text-sm text-white/70">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Скрещенные руки и размеренный тэппинг по плечам</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Спокойный вдох носом на 4 счета</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                    <span>Длинный выдох со звуком «мммм» на 6 счетов</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setConsolidationTimeLeft(150);
                  setStep('consolidation-practice');
                  setIsConsolidationActive(true);
                  setPhaseB('inhale');
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
                <span>Ритм + опора • Сессия</span>
                <span>{Math.floor(consolidationTimeLeft / 60)}:{(consolidationTimeLeft % 60).toString().padStart(2, '0')}</span>
              </div>

              <div className="relative w-full flex-1 flex items-center justify-center min-h-[320px]">
                {/* Circle */}
                <motion.div
                  key="consolidation-circle-b"
                  variants={circleVariantsB}
                  initial="initial"
                  animate={isConsolidationActive ? phaseB : 'initial'}
                  className="absolute w-[75vw] h-[75vw] max-w-[450px] max-h-[450px] rounded-full bg-sky-400/25 blur-[60px] mix-blend-screen pointer-events-none"
                />

                {/* Tapping indicators + prompt */}
                <div className="flex flex-col items-center z-20 gap-8">
                  <div className="flex gap-10 items-center justify-center">
                    <div className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                      tappingSide === 'left' 
                        ? 'border-[#38bdf8] bg-[#38bdf8]/35 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.7)]' 
                        : 'border-white/20 bg-white/5 opacity-40'
                    }`}>
                      <span className="text-xs text-white font-medium">Левое</span>
                      <span className="text-[10px] text-white/60">плечо</span>
                    </div>
                    <div className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                      tappingSide === 'right' 
                        ? 'border-[#38bdf8] bg-[#38bdf8]/35 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.7)]' 
                        : 'border-white/20 bg-white/5 opacity-40'
                    }`}>
                      <span className="text-xs text-white font-medium">Правое</span>
                      <span className="text-[10px] text-white/60">плечо</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center drop-shadow-md">
                    <div className="text-2xl font-light tracking-[0.2em] uppercase text-white">
                      {phaseB === 'inhale' ? 'Вдох носом' : 'Выдох: «мммм»'}
                    </div>
                    <div className="text-xs font-medium tracking-wider text-blue-200 mt-2">
                      {phaseB === 'inhale' ? 'Спокойный вдох (4 сек)' : 'Долгий выдох со звуком (6 сек)'}
                    </div>
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

          {/* EXPOSURE TAIL (1 MIN) */}
          {step === 'exposure-tail' && (
            <motion.div
              key="exposure-tail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center justify-between flex-1 py-4 min-h-0 text-center"
            >
              <div className="flex justify-between w-full max-w-sm items-center text-xs text-white/50 font-mono">
                <span>Тихое наблюдение</span>
                <span>00:{exposureTimeLeft.toString().padStart(2, '0')}</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center max-w-sm">
                <div className="w-36 h-36 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-8 relative">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-[#38bdf8]/20 blur-md"
                  />
                  <span className="text-3xl font-extralight text-white/80 font-mono">{exposureTimeLeft}</span>
                </div>

                <h3 className="text-2xl font-light mb-3 text-white">Тихое наблюдение</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Опустите руки. Не контролируйте дыхание. Просто направьте тихое внимание внутрь себя и наблюдайте за откликом в теле.
                </p>
              </div>

              <div className="w-full max-w-sm pb-4">
                <button
                  onClick={() => setStep('post-thought')}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors py-2"
                >
                  Пропустить наблюдение
                </button>
              </div>
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
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Проверка после практики • 1 из 3
              </div>

              <h2 className="text-2xl font-light mb-3 text-white">Снова подумайте о той же ситуации</h2>

              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Обратите внимание, как сейчас воспринимается эта мысль или ситуация. Изменилась ли эмоциональная окраска?
              </p>

              <button
                onClick={() => setStep('post-location')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* POST-CHECK 2: ЛОКАЛИЗАЦИЯ */}
          {step === 'post-location' && (
            <motion.div
              key="post-location"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Проверка после практики • 2 из 3
              </div>

              <h2 className="text-2xl font-light mb-2 text-white">Где сейчас ощущается отклик в теле?</h2>
              <p className="text-sm text-white/60 mb-6">Осталось ли напряжение на прежнем месте или сместилось?</p>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {BODY_LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setPostLocation(loc);
                      setIsRelocated(false);
                    }}
                    className={`py-3 px-4 rounded-2xl border text-sm transition-all ${
                      postLocation === loc && !isRelocated
                        ? 'border-[#38bdf8] bg-[#38bdf8]/15 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsRelocated(true);
                  setPostLocation('Полностью ушло');
                }}
                className={`w-full py-3.5 px-4 rounded-2xl border text-sm mb-6 transition-all ${
                  isRelocated
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                ✨ Напряжение полностью ушло
              </button>

              <button
                onClick={() => setStep('post-intensity')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Далее
              </button>
            </motion.div>
          )}

          {/* POST-CHECK 3: ИНТЕНСИВНОСТЬ */}
          {step === 'post-intensity' && (
            <motion.div
              key="post-intensity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Проверка после практики • 3 из 3
              </div>

              <h2 className="text-2xl font-light mb-2 text-white">Оцените текущий уровень напряжения</h2>
              <p className="text-sm text-white/60 mb-6">
                Насколько сильно ощущается тревога или напряжение прямо сейчас?
              </p>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
                <div className="text-5xl font-extralight text-[#38bdf8] mb-2 font-mono">{postAnxiety}</div>
                <div className="text-xs text-white/40 mb-6">по шкале от 0 до 10</div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={postAnxiety}
                  onChange={(e) => setPostAnxiety(parseInt(e.target.value, 10))}
                  className="w-full accent-[#38bdf8] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-white/40 mt-3 font-mono">
                  <span>0 • Покой</span>
                  <span>5 • Умеренно</span>
                  <span>10 • Сильно</span>
                </div>
              </div>

              <button
                onClick={handleFinishCourseDay}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Завершить занятие
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* SUMMARY */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-[#38bdf8] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-light mb-2 text-white">День 2 завершен!</h2>
              <p className="text-white/60 text-sm mb-6">
                Вы успешно освоили и закрепили вторую базовую технику — «Ритм + опора».
              </p>

              {/* Stats Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-sm text-white/60">Изменение напряжения:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white/40">{preAnxiety}/10</span>
                    <span className="text-white/40">→</span>
                    <span className="text-emerald-400 font-medium text-base">{postAnxiety}/10</span>
                    {preAnxiety > postAnxiety && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        -{preAnxiety - postAnxiety}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Ощущения в теле:</span>
                  <span className="text-xs text-white/90 text-right max-w-[180px] truncate">
                    {isRelocated ? 'Полностью ушло' : postLocation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/course')}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-3xl font-medium text-lg transition-all"
              >
                Вернуться к курсу
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

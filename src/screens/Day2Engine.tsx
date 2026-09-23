import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Play, Pause } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { playSoftTap } from '../lib/audio';
import { TappingIllustration } from '../components/TappingIllustration';
import { BODY_LOCATIONS, BodyLocation } from '../data/courseData';

type Step = 
  | 'intro-card'            // Intro & outline of Day 2
  | 'pre-thought'           // Calibration 1: Ситуация
  | 'pre-location'          // Calibration 2: Тело
  | 'pre-intensity'         // Calibration 3: Оценка тревожности (0-10)
  | 'b-stage-intro'         // Explaining each B stage (1: ears, 2: shoulders, 3: sternum, 4: consolidation)
  | 'b-stage-practice'      // Performing B stages
  | 'silence-integration'   // Still observation (1 min)
  | 'post-check'            // Tension after (0-10)
  | 'summary';              // Completion & stats

interface BStageConfig {
  id: number;
  title: string;
  subtitle: string;
  lead?: string;
  bullets?: string[];
  text?: string;
  action: string;
  duration: number; // in seconds
  tapMode: 'ears' | 'shoulders' | 'chest';
  hasBreath: boolean;
  hasVocal: boolean;
}

const B_STAGES: Record<number, BStageConfig> = {
  1: {
    id: 1,
    subtitle: 'Ритм + вибрация • Шаг 1 из 4',
    title: 'Зона ушей',
    lead: 'Подушечками пальцев делайте легкие ритмичные постукивания по хрящу перед ушным каналом (козелку) и мочке уха:',
    bullets: [
      'Частота постукивания: ровно 1 раз в секунду (в такт световому индикатору).',
      'Ощутите, как расслабляется зажим в области челюстей, височных мышц и затылка.',
      'Ровное дыхание: спокойный вдох носом (4 сек) → длинный плавный выдох (6 сек).'
    ],
    action: 'Начать',
    duration: 60, // 1 min
    tapMode: 'ears',
    hasBreath: true,
    hasVocal: false
  },
  2: {
    id: 2,
    subtitle: 'Ритм + вибрация • Шаг 2 из 4',
    title: 'Зона плеч',
    lead: 'Скрестите руки на груди, положив ладони или подушечки пальцев на плечи («прикосновения бабочки»):',
    bullets: [
      'Поочерёдно мягко похлопывайте пальцами: левое плечо ↔ правое плечо в спокойном темпе.',
      'Билатеральная стимуляция гармонизирует работу обоих полушарий и восстанавливает чувство защищенности.',
      'Дышите в такт светового круга: мягкий вдох носом (4 сек) → плавный длинный выдох (6 сек).'
    ],
    action: 'Начать',
    duration: 60, // 1 min
    tapMode: 'shoulders',
    hasBreath: true,
    hasVocal: false
  },
  3: {
    id: 3,
    subtitle: 'Ритм + вибрация • Шаг 3 из 4',
    title: 'Зона верхней части грудины',
    lead: 'Мягко постукивайте пальцами по верхней части грудины (чуть ниже ямки на шее):',
    bullets: [
      'Мягко постукивайте кончиками пальцев или ладонью, ощущая вибрацию внутри грудной клетки.',
      'Почувствуйте, как уходит ощущение сдавленности: спокойный вдох (4 сек) → свободный выдох (6 сек).'
    ],
    action: 'Начать',
    duration: 60, // 1 min
    tapMode: 'chest',
    hasBreath: true,
    hasVocal: false
  },
  4: {
    id: 4,
    subtitle: 'Ритм + вибрация • Шаг 4 из 4',
    title: 'Закрепление: тэппинг + выдох с голосом',
    lead: 'Выберите ту зону, которая сейчас даёт больше тепла и заземления (уши, плечи или грудина):',
    bullets: [
      'Уши (козелок), плечи («бабочка») либо верхняя часть грудины.',
      'Спокойный вдох носом (4 сек) → долгий выдох через сомкнутые губы со звуком «мммм» (6 сек).',
      'Ритмичный мягкий тэппинг передает вибрацию голоса вглубь тела, укореняя спокойствие.'
    ],
    action: 'Начать сессию',
    duration: 75, // 1 min 15 sec
    tapMode: 'shoulders',
    hasBreath: true,
    hasVocal: true
  }
};

export function Day2Engine() {
  const navigate = useNavigate();
  const { addSession, markCourseDayCompleted } = useAppStore();

  const [step, setStep] = useState<Step>('pre-thought');

  // Pre-check state matching Day 1
  const [selectedLocation, setSelectedLocation] = useState<BodyLocation>('Грудь');
  const [preAnxiety, setPreAnxiety] = useState<number>(6);

  // Practice B stages
  const [currentBStage, setCurrentBStage] = useState(1);
  const [bStageTimeLeft, setBStageTimeLeft] = useState(60);
  const [isBStageActive, setIsBStageActive] = useState(false);
  const [tapSide, setTapSide] = useState<'left' | 'right'>('left');
  const [chestTapPulse, setChestTapPulse] = useState(false);
  const [earsTapPulse, setEarsTapPulse] = useState(false);
  const [phaseB, setPhaseB] = useState<'inhale' | 'exhale'>('inhale');
  const [selectedTapModeStage4, setSelectedTapModeStage4] = useState<'ears' | 'shoulders' | 'chest'>('ears');

  // Silence / Integration (1 min)
  const [silenceTimeLeft, setSilenceTimeLeft] = useState(60);
  const [isSilenceActive, setIsSilenceActive] = useState(false);

  // Post-check
  const [postAnxiety, setPostAnxiety] = useState<number>(3);

  // --- Practice B Stages Timers & Loops ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'b-stage-practice' && isBStageActive && bStageTimeLeft > 0) {
      interval = setInterval(() => {
        setBStageTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (bStageTimeLeft === 0 && step === 'b-stage-practice') {
      setIsBStageActive(false);
      if (currentBStage < 4) {
        const nextStage = currentBStage + 1;
        setCurrentBStage(nextStage);
        setBStageTimeLeft(B_STAGES[nextStage].duration);
        setPhaseB('inhale');
        setStep('b-stage-intro');
      } else {
        // Move to silence integration
        setStep('silence-integration');
        setIsSilenceActive(true);
      }
    }
    return () => clearInterval(interval);
  }, [step, isBStageActive, bStageTimeLeft, currentBStage]);

  // Tapping rhythm loop for Practice B
  useEffect(() => {
    if (step !== 'b-stage-practice' || !isBStageActive) return;

    const currentConfig = B_STAGES[currentBStage];
    const activeMode = currentBStage === 4 ? selectedTapModeStage4 : currentConfig.tapMode;

    // Tragus & earlobe activation: precisely 1 tap per second (1000ms = 1 Hz)
    const tapIntervalMs = activeMode === 'ears' ? 1000 : 1050;

    const tapInterval = setInterval(() => {
      if (activeMode === 'shoulders') {
        setTapSide(prev => {
          const next = prev === 'left' ? 'right' : 'left';
          playSoftTap(next);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(22);
          }
          return next;
        });
      } else if (activeMode === 'ears') {
        // Exactly 1 tap per second on tragus and earlobes
        setEarsTapPulse(true);
        setTimeout(() => setEarsTapPulse(false), 240);
        playSoftTap('center');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
      } else {
        // Chest palm or fingertip tap
        setChestTapPulse(true);
        setTimeout(() => setChestTapPulse(false), 240);
        playSoftTap('center');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(26);
        }
      }
    }, tapIntervalMs);

    return () => clearInterval(tapInterval);
  }, [step, isBStageActive, currentBStage, selectedTapModeStage4]);

  // Breathing cycle: smooth Inhale (4s) -> Exhale (6s) without second inhale (без довдоха)
  useEffect(() => {
    if (step !== 'b-stage-practice' || !isBStageActive) return;
    const currentConfig = B_STAGES[currentBStage];
    if (!currentConfig.hasBreath) return;

    let timeout: NodeJS.Timeout;
    if (phaseB === 'inhale') {
      timeout = setTimeout(() => {
        setPhaseB('exhale');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(25);
        }
      }, 4000);
    } else if (phaseB === 'exhale') {
      timeout = setTimeout(() => {
        setPhaseB('inhale');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
      }, 6000);
    }
    return () => clearTimeout(timeout);
  }, [phaseB, isBStageActive, step, currentBStage]);

  // Silence / Integration timer (60s)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'silence-integration' && isSilenceActive && silenceTimeLeft > 0) {
      interval = setInterval(() => {
        setSilenceTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (silenceTimeLeft === 0 && step === 'silence-integration') {
      setIsSilenceActive(false);
      setStep('post-check');
    }
    return () => clearInterval(interval);
  }, [step, isSilenceActive, silenceTimeLeft]);

  const handleFinishDay2 = () => {
    addSession({
      sessionId: `day2-${Date.now()}`,
      date: new Date().toISOString(),
      practiceType: 'course',
      practiceCategory: 'B',
      courseDay: 2,
      duration: 330, // ~5.5 mins total
      exposureDuration: 60,
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
    });
    markCourseDayCompleted(2);
    setStep('summary');
  };

  const circleVariantsB = {
    initial: { scale: 0.35, opacity: 0.2 },
    inhale: { scale: 1.25, opacity: 0.9, transition: { duration: 4.0, ease: 'easeInOut' } },
    exhale: { scale: 0.35, opacity: 0.2, transition: { duration: 6.0, ease: 'easeInOut' } }
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] text-white overflow-hidden flex flex-col items-center">
      {/* Background gradient matching Day 1 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a365d_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Header matching Day 1 */}
      <header className="px-4 py-5 w-full flex items-center justify-between relative z-20 sm:max-w-xl mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-[#38bdf8] font-medium tracking-wider uppercase">День 2 из 14</span>
          <span className="text-sm text-white/60">«Ритм + вибрация»</span>
        </div>
        <button 
          onClick={() => navigate('/course')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area matching Day 1 structure */}
      <main className="flex-1 flex flex-col w-full relative z-10 px-4 sm:max-w-xl mx-auto justify-center">
        <AnimatePresence mode="wait">
          
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
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Шаг 3 из 3 • Оценка
              </div>
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
                onChange={(e) => setPreAnxiety(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#38bdf8] mb-10"
              />

              <button
                onClick={() => {
                  setStep('intro-card');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Дальше
              </button>
            </motion.div>
          )}

          {/* TRANSITION / INSTRUCTION: ДЕНЬ 2 ПЛАН ПРАКТИКИ (МЕЖДУ ШАГОМ 3 И ШАГОМ 1 ИЗ 4) */}
          {step === 'intro-card' && (
            <motion.div
              key="intro-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4"
            >
              <div className="text-[#38bdf8] text-xs uppercase tracking-widest font-medium mb-3">
                Инструкция • День 2
              </div>
              <h2 className="text-2xl font-light text-white mb-4 leading-snug">
                Практика «Ритм + вибрация»
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8 text-left leading-relaxed text-white/80 text-sm flex flex-col gap-3">
                <p className="text-white/60 mb-1">
                  Сегодня осваиваем снятие накопленного напряжения через телесный ритм в трёх ключевых зонах тела и соединяем его с дыханием и голосом:
                </p>
                <p>1. <strong>Уши:</strong> легкие ритмичные постукивания подушечками пальцев для мягкой стимуляции блуждающего нерва (60 сек).</p>
                <p>2. <strong>Плечи:</strong> поочерёдные перекрёстные постукивания пальцами («прикосновения бабочки») для билатеральной регуляции (60 сек).</p>
                <p>3. <strong>Верхняя часть грудины:</strong> мягкие постукивания ладонью чуть ниже ямки на шее для снятия накопленного напряжения (60 сек).</p>
                <p>4. <strong>Закрепление:</strong> выполнение упражнения + выдох со звуком «мммм» (75 сек) и 1 минута тишины.</p>
              </div>
              <button
                onClick={() => {
                  setCurrentBStage(1);
                  setBStageTimeLeft(B_STAGES[1].duration);
                  setStep('b-stage-intro');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 active:scale-[0.99] transition-all"
              >
                Перейти к первому шагу
              </button>
            </motion.div>
          )}

          {/* STEP 3: B STAGE INTRO CARDS (1-4) */}
          {step === 'b-stage-intro' && (
            <motion.div
              key={`b-intro-${currentBStage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-start sm:justify-center max-w-sm mx-auto w-full py-3 text-left overflow-y-auto"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                {B_STAGES[currentBStage].subtitle}
              </div>

              <h2 className="text-2xl sm:text-3xl font-light mb-3 text-white leading-snug">
                {B_STAGES[currentBStage].title}
              </h2>

              {B_STAGES[currentBStage].lead && (
                <p className="text-white/70 text-sm leading-relaxed mb-3 whitespace-pre-line">
                  {B_STAGES[currentBStage].lead}
                </p>
              )}

              {/* Visual illustration for the posture */}
              {currentBStage === 1 && (
                <TappingIllustration mode="ears" />
              )}
              {currentBStage === 2 && (
                <TappingIllustration mode="shoulders" />
              )}
              {currentBStage === 3 && (
                <TappingIllustration mode="chest" />
              )}
              {currentBStage === 4 && (
                <div className="my-2">
                  <div className="flex gap-1.5 mb-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTapModeStage4('ears')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                        selectedTapModeStage4 === 'ears'
                          ? 'bg-sky-500/25 border border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      Уши (козелок)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTapModeStage4('shoulders')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                        selectedTapModeStage4 === 'shoulders'
                          ? 'bg-sky-500/25 border border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      Плечи («бабочка»)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTapModeStage4('chest')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all ${
                        selectedTapModeStage4 === 'chest'
                          ? 'bg-sky-500/25 border border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      Верх грудины
                    </button>
                  </div>
                  <TappingIllustration mode={selectedTapModeStage4} />
                </div>
              )}

              {B_STAGES[currentBStage].bullets && (
                <div className="mb-6 text-left">
                  <ul className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed">
                    {B_STAGES[currentBStage].bullets?.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('b-stage-practice');
                  setIsBStageActive(true);
                  setPhaseB('inhale');
                }}
                className="w-full bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/40 text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                {B_STAGES[currentBStage].action} ({B_STAGES[currentBStage].duration} сек)
              </button>
            </motion.div>
          )}

          {/* STEP 4: B STAGE PRACTICE IN ACTION */}
          {step === 'b-stage-practice' && (
            <motion.div
              key={`b-practice-${currentBStage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center justify-between flex-1 py-4 min-h-0 relative"
            >
              {/* Header Timer matching screenshot */}
              <div className="flex justify-between w-full max-w-sm items-center text-xs text-white/50 font-mono">
                <span>Элемент {currentBStage} из 4</span>
                <span>00:{bStageTimeLeft.toString().padStart(2, '0')}</span>
              </div>

              {/* Central Breathing Aura & Text with Tapping Indicator Circles */}
              <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[320px]">
                
                {/* Visual breathing circle matching Day 1 & SOS aesthetic */}
                <motion.div
                  key={`circle-b-stage-${currentBStage}`}
                  variants={circleVariantsB}
                  initial="initial"
                  animate={isBStageActive ? phaseB : 'initial'}
                  className="absolute w-[75vw] h-[75vw] max-w-[440px] max-h-[440px] rounded-full bg-sky-300/40 blur-[50px] mix-blend-screen pointer-events-none"
                />

                {/* Subtle Concentric Breathing Wave Ring */}
                <motion.div
                  variants={{
                    initial: { scale: 0.45, opacity: 0.15 },
                    inhale: { scale: 1.18, opacity: 0.45, transition: { duration: 4.0, ease: 'easeInOut' } },
                    exhale: { scale: 0.48, opacity: 0.15, transition: { duration: 6.0, ease: 'easeInOut' } }
                  }}
                  initial="initial"
                  animate={isBStageActive ? phaseB : 'initial'}
                  className="absolute w-[66vw] h-[66vw] max-w-[380px] max-h-[380px] rounded-full border border-sky-400/25 pointer-events-none"
                />

                {/* Stage 1 & Ears mode: Two blue circles for left and right ear signalling every second */}
                {(currentBStage === 1 || (currentBStage === 4 && selectedTapModeStage4 === 'ears')) && (
                  <div className="flex gap-8 sm:gap-14 z-20 items-center justify-center mb-6">
                    {/* Left ear */}
                    <motion.div
                      animate={{
                        scale: earsTapPulse ? 1.12 : 0.96,
                        opacity: earsTapPulse ? 1 : 0.6,
                        borderColor: earsTapPulse ? '#38bdf8' : 'rgba(56,189,248,0.3)',
                        backgroundColor: earsTapPulse ? 'rgba(56,189,248,0.25)' : 'rgba(10,19,37,0.7)',
                        boxShadow: earsTapPulse ? '0 0 25px rgba(56,189,248,0.6)' : '0 0 10px rgba(56,189,248,0.1)'
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative backdrop-blur-md"
                    >
                      <span className="text-xs sm:text-sm text-white font-medium">Левое ухо</span>
                      <span className="text-[10px] text-sky-300/80">козелок / мочка</span>
                      {earsTapPulse && (
                        <div className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
                      )}
                    </motion.div>

                    {/* Right ear */}
                    <motion.div
                      animate={{
                        scale: earsTapPulse ? 1.12 : 0.96,
                        opacity: earsTapPulse ? 1 : 0.6,
                        borderColor: earsTapPulse ? '#38bdf8' : 'rgba(56,189,248,0.3)',
                        backgroundColor: earsTapPulse ? 'rgba(56,189,248,0.25)' : 'rgba(10,19,37,0.7)',
                        boxShadow: earsTapPulse ? '0 0 25px rgba(56,189,248,0.6)' : '0 0 10px rgba(56,189,248,0.1)'
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative backdrop-blur-md"
                    >
                      <span className="text-xs sm:text-sm text-white font-medium">Правое ухо</span>
                      <span className="text-[10px] text-sky-300/80">козелок / мочка</span>
                      {earsTapPulse && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Stage 2 & Shoulders mode: Two blue circles for left and right shoulder alternating */}
                {(currentBStage === 2 || (currentBStage === 4 && selectedTapModeStage4 === 'shoulders')) && (
                  <div className="flex gap-8 sm:gap-14 z-20 items-center justify-center mb-6">
                    {/* Left shoulder */}
                    <motion.div
                      animate={{
                        scale: tapSide === 'left' ? 1.12 : 0.95,
                        opacity: tapSide === 'left' ? 1 : 0.5,
                        borderColor: tapSide === 'left' ? '#38bdf8' : 'rgba(56,189,248,0.3)',
                        backgroundColor: tapSide === 'left' ? 'rgba(56,189,248,0.25)' : 'rgba(10,19,37,0.7)',
                        boxShadow: tapSide === 'left' ? '0 0 25px rgba(56,189,248,0.6)' : '0 0 10px rgba(56,189,248,0.1)'
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative backdrop-blur-md"
                    >
                      <span className="text-xs sm:text-sm text-white font-medium">Левое</span>
                      <span className="text-[10px] text-sky-300/80">плечо</span>
                      {tapSide === 'left' && (
                        <div className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
                      )}
                    </motion.div>

                    {/* Right shoulder */}
                    <motion.div
                      animate={{
                        scale: tapSide === 'right' ? 1.12 : 0.95,
                        opacity: tapSide === 'right' ? 1 : 0.5,
                        borderColor: tapSide === 'right' ? '#38bdf8' : 'rgba(56,189,248,0.3)',
                        backgroundColor: tapSide === 'right' ? 'rgba(56,189,248,0.25)' : 'rgba(10,19,37,0.7)',
                        boxShadow: tapSide === 'right' ? '0 0 25px rgba(56,189,248,0.6)' : '0 0 10px rgba(56,189,248,0.1)'
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex flex-col items-center justify-center relative backdrop-blur-md"
                    >
                      <span className="text-xs sm:text-sm text-white font-medium">Правое</span>
                      <span className="text-[10px] text-sky-300/80">плечо</span>
                      {tapSide === 'right' && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Stage 3 & Chest mode: Upper Sternum tapping circle */}
                {(currentBStage === 3 || (currentBStage === 4 && selectedTapModeStage4 === 'chest')) && (
                  <div className="flex z-20 items-center justify-center mb-6">
                    <motion.div
                      animate={{
                        scale: chestTapPulse ? 1.1 : 0.96,
                        opacity: chestTapPulse ? 1 : 0.6,
                        borderColor: chestTapPulse ? '#38bdf8' : 'rgba(56,189,248,0.3)',
                        backgroundColor: chestTapPulse ? 'rgba(56,189,248,0.25)' : 'rgba(10,19,37,0.7)',
                        boxShadow: chestTapPulse ? '0 0 25px rgba(56,189,248,0.6)' : '0 0 10px rgba(56,189,248,0.1)'
                      }}
                      transition={{ duration: 0.18 }}
                      className="w-22 h-22 sm:w-26 sm:h-26 rounded-full border-2 flex flex-col items-center justify-center relative backdrop-blur-md"
                    >
                      <span className="text-lg mb-0.5">✋</span>
                      <span className="text-xs sm:text-sm text-white font-medium">Верх грудины</span>
                      <span className="text-[10px] text-sky-300/80">центр груди</span>
                      {chestTapPulse && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Centered Breathing Prompt with exact mathematical horizontal centering */}
                <div className="flex flex-col items-center justify-center text-center z-30 drop-shadow-md select-none">
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 text-3xl sm:text-4xl font-light uppercase text-white">
                    {(phaseB === 'inhale' ? ['В', 'Д', 'О', 'Х'] : ['В', 'Ы', 'Д', 'О', 'Х']).map((char, idx) => (
                      <span key={idx} className="w-7 sm:w-9 text-center flex items-center justify-center">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom controls: minimal switcher for stage 4 + Play/Pause button matching screenshot */}
              <div className="flex flex-col items-center gap-3 z-30">
                {currentBStage === 4 && (
                  <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setSelectedTapModeStage4('ears')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        selectedTapModeStage4 === 'ears'
                          ? 'bg-[#38bdf8] text-[#050B14]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      По ушам
                    </button>
                    <button
                      onClick={() => setSelectedTapModeStage4('shoulders')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        selectedTapModeStage4 === 'shoulders'
                          ? 'bg-[#38bdf8] text-[#050B14]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      По плечам
                    </button>
                    <button
                      onClick={() => setSelectedTapModeStage4('chest')}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        selectedTapModeStage4 === 'chest'
                          ? 'bg-[#38bdf8] text-[#050B14]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      По грудине
                    </button>
                  </div>
                )}

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={() => setIsBStageActive(!isBStageActive)}
                  className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 shadow-lg border border-white/10"
                  aria-label={isBStageActive ? 'Пауза' : 'Продолжить'}
                >
                  {isBStageActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SILENCE / STILL OBSERVATION (1 min) */}
          {step === 'silence-integration' && (
            <motion.div
              key="silence-integration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3 font-mono">
                Фаза тишины и заземления
              </div>

              {/* Glowing countdown circle */}
              <div className="relative w-44 h-44 rounded-full border border-sky-400/30 flex items-center justify-center mb-6 bg-sky-950/20 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-sky-400/10"
                />
                <span className="text-5xl font-light text-sky-200 font-mono">
                  {silenceTimeLeft}
                </span>
              </div>

              <h2 className="text-xl font-light text-white mb-2">Остановите техники</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Опустите руки. Отпустите контроль над дыханием. Пусть тело дышит само, наблюдайте за телесным откликом.
              </p>

              <button
                onClick={() => {
                  setIsSilenceActive(false);
                  setStep('post-check');
                }}
                className="text-xs text-white/40 hover:text-white/80 uppercase tracking-widest py-2 transition-colors"
              >
                Пропустить ожидание →
              </button>
            </motion.div>
          )}

          {/* STEP 6: POST-CHECK */}
          {step === 'post-check' && (
            <motion.div
              key="post-check"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
                Итоги занятия
              </div>
              <h2 className="text-2xl font-light text-white mb-2">
                Оцените уровень напряжения сейчас
              </h2>
              <p className="text-white/60 text-xs mb-8">
                0 — полное спокойствие, 10 — максимальное напряжение
              </p>

              <div className="w-24 h-24 mx-auto rounded-3xl bg-[#0A1325] border border-[#38bdf8]/30 flex items-center justify-center text-5xl font-light text-[#38bdf8] mb-8 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                {postAnxiety}
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={postAnxiety}
                onChange={(e) => setPostAnxiety(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#38bdf8] mb-10"
              />

              <button
                onClick={handleFinishDay2}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
              >
                Увидеть результат
              </button>
            </motion.div>
          )}

          {/* STEP 7: SUMMARY */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 text-center"
            >
              <div className="text-[#38bdf8] text-xs font-medium tracking-wider uppercase mb-3">
                День 2 завершён
              </div>
              
              <div className="text-lg text-white font-medium mb-6">
                «Ритм + вибрация» освоена
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
                  <span>Вы освоили телесный ритм (тэппинг в трёх зонах + вокализированный выдох). Заметьте возникшее чувство заземления и опоры.</span>
                )}
                {postAnxiety === preAnxiety && (
                  <span>Ощущение в теле осталось на том же уровне. Это естественный этап знакомства с новым тактильным ритмом.</span>
                )}
                {postAnxiety > preAnxiety && (
                  <span>Тонус тела сейчас повышен. Не форсируйте расслабление — нервная система просто калибрует новый телесный опыт.</span>
                )}
              </div>

              <button
                onClick={() => navigate('/course')}
                className="w-full bg-gradient-to-r from-blue-600 to-[#38bdf8] text-white py-4 rounded-3xl font-medium text-lg flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:opacity-95 transition-all"
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

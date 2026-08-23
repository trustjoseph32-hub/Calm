import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { PracticeSession } from '../types';

type SessionState = 'countdown' | 'active' | 'paused' | 'grounding' | 'complete' | 'checkout';

export function PracticeEngine() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, addSession, markCourseDayCompleted } = useAppStore();
  
  const { type, durationSeconds, anxietyBefore, courseDay } = location.state || { 
    type: 'combined', 
    durationSeconds: 180, 
    anxietyBefore: 5,
    courseDay: undefined
  };

  const [sessionState, setSessionState] = useState<SessionState>('countdown');
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [countdown, setCountdown] = useState(3);
  const [showControls, setShowControls] = useState(true);
  const [anxietyAfter, setAnxietyAfter] = useState<number>(5);
  
  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);

  // Interaction timer for hiding controls
  const controlsTimeoutRef = useRef<number>();

  useEffect(() => {
    if (sessionState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setSessionState('active');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionState]);

  useEffect(() => {
    if (sessionState === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            setSessionState('complete');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionState, timeLeft]);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (sessionState === 'active') setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    if (sessionState === 'active') {
      resetControlsTimeout();
    } else {
      setShowControls(true);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [sessionState]);

  const handleFinish = () => {
    const session: PracticeSession = {
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      practiceType: type,
      duration: durationSeconds - timeLeft,
      anxietyBefore,
      anxietyAfter,
      anxietyDelta: anxietyAfter - anxietyBefore,
      completed: sessionState === 'checkout',
      stoppedEarly: timeLeft > 0 && sessionState !== 'checkout',
      discomfortTriggered: sessionState === 'grounding',
    };
    addSession(session);
    
    if (type === 'course' && courseDay && sessionState === 'checkout') {
      markCourseDayCompleted(courseDay);
    }
    
    navigate('/');
  };
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="flex-1 w-full bg-neutral-900 text-white relative overflow-hidden flex flex-col"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Background for normal practice */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />

      {/* Main Practice Canvas */}
      { (sessionState === 'active' || sessionState === 'paused' || sessionState === 'complete') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <PracticeCanvas 
            type={type} 
            isActive={sessionState === 'active'} 
            settings={settings}
          />
        </div>
      )}

      {/* Countdown overlay */}
      <AnimatePresence>
        {sessionState === 'countdown' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-8xl font-light text-white mb-8"
            >
              {countdown}
            </motion.div>
            <p className="text-xl text-neutral-500 font-medium">
              {type === 'breathing' ? 'Дыши комфортно в ритме круга' : 'Смотри на движущийся объект и позволяй глазам следовать за ним'}
            </p>
            {type === 'combined' && (
              <p className="text-neutral-500 mt-2">Не заставляй себя дышать глубже, чем комфортно</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete -> Checkout transition */}
      <AnimatePresence>
        {sessionState === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-4">Остановись на несколько секунд.</h2>
            <p className="text-xl text-neutral-500 mb-12">Заметь, что происходит в теле.</p>
            <button
              onClick={() => setSessionState('checkout')}
              className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors pointer-events-auto"
            >
              Продолжить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Screen */}
      <AnimatePresence>
        {sessionState === 'checkout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900 text-white px-6 text-center"
          >
            <h2 className="text-2xl font-medium mb-8">Какой уровень напряжения сейчас?</h2>
            
            <div className="w-full max-w-md px-4 mb-12">
              <div className="flex justify-between text-neutral-500 text-sm font-medium mb-4">
                <span>0 — спокойно</span>
                <span>10 — напряжение</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={anxietyAfter}
                onChange={(e) => setAnxietyAfter(Number(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
              />
              <div className="text-5xl font-light text-neutral-100 mt-8">
                {anxietyAfter}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-12 bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 w-full max-w-xs">
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium">Изменение состояния</p>
              <div className="flex items-center gap-4 text-xl">
                <span className="text-neutral-500">До: {anxietyBefore}</span>
                <ArrowRight className="w-5 h-5 text-neutral-500" />
                <span className="font-medium">После: {anxietyAfter}</span>
              </div>
              <div className="mt-2 text-3xl font-light">
                {anxietyAfter - anxietyBefore > 0 ? '+' : ''}{anxietyAfter - anxietyBefore}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full max-w-xs py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors pointer-events-auto shadow-md"
            >
              Завершить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grounding Screen */}
      <AnimatePresence>
        {sessionState === 'grounding' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900 px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-8">Остановись. Посмотри вокруг.</h2>
            
            <div className="max-w-md w-full mb-12 min-h-[120px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={groundingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl text-neutral-500 leading-relaxed font-light"
                >
                  {groundingStep === 0 && 'Назови 5 вещей, которые видишь.'}
                  {groundingStep === 1 && 'Заметь 4 ощущения в теле.'}
                  {groundingStep === 2 && 'Найди 3 звука вокруг.'}
                  {groundingStep === 3 && 'Почувствуй опору под ногами или под телом.'}
                  {groundingStep === 4 && 'Сделай несколько обычных, комфортных вдохов и выдохов.'}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              {groundingStep < 4 ? (
                <button
                  onClick={() => setGroundingStep(s => s + 1)}
                  className="w-full py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors pointer-events-auto"
                >
                  Дальше
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="w-full py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors pointer-events-auto"
                >
                  Завершить
                </button>
              )}
              <button
                onClick={() => setSessionState('checkout')}
                className="w-full py-4 bg-transparent border border-neutral-700 text-neutral-500 rounded-full font-medium text-lg hover:bg-neutral-700 transition-colors pointer-events-auto mt-4"
              >
                Мне лучше
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* HUD Controls */}
      <AnimatePresence>
        {showControls && (sessionState === 'active' || sessionState === 'paused') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-6"
          >
            <div className="flex justify-between items-start pointer-events-auto">
              <button 
                onClick={() => setSessionState('checkout')}
                className="p-3 bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 backdrop-blur-md rounded-full text-neutral-500 transition-colors"
                aria-label="Stop"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-neutral-800/50 border border-neutral-700 backdrop-blur-md px-4 py-2 rounded-full font-mono text-xl tracking-widest text-neutral-500">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex justify-between items-end pointer-events-auto">
              <button 
                onClick={() => setSessionState('grounding')}
                className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-700/80 backdrop-blur-md rounded-full text-neutral-500 transition-colors text-sm font-medium"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Мне некомфортно</span>
              </button>

              <button 
                onClick={() => setSessionState(s => s === 'active' ? 'paused' : 'active')}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-200 transition-colors shadow-lg"
                aria-label={sessionState === 'active' ? 'Pause' : 'Play'}
              >
                {sessionState === 'active' ? <Pause className="w-8 h-8 fill-neutral-900" /> : <Play className="w-8 h-8 fill-neutral-900 translate-x-0.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inner Practice Component handling the visual rendering
function PracticeCanvas({ type, isActive, settings }: { type: string, isActive: boolean, settings: any }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  
  // Breathing cycle
  useEffect(() => {
    if (!isActive || (type !== 'breathing' && type !== 'combined' && type !== 'course')) return;
    
    let timer: number;
    const cycle = () => {
      setPhase(p => p === 'in' ? 'out' : 'in');
    };

    const duration = settings.breathingIn * 1000;
    timer = window.setTimeout(cycle, duration);
    
    return () => clearTimeout(timer);
  }, [isActive, phase, type, settings.breathingIn, settings.breathingOut]);

  const showBreathing = type === 'breathing' || type === 'combined' || type === 'course';
  const showBilateral = type === 'bilateral' || type === 'combined' || type === 'course';

  // Bilateral settings translation
  const getSpeedSeconds = () => {
    switch (settings.bilateralSpeed) {
      case 'slow': return 2.5;
      case 'fast': return 1.0;
      default: return 1.5;
    }
  };

  const getAmplitudeWidth = () => {
    switch (settings.bilateralAmplitude) {
      case 'narrow': return '60vw';
      case 'wide': return '90vw';
      default: return '80vw';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Breathing Circle */}
      {showBreathing && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{
            scale: phase === 'in' ? 1 : 0.6,
            opacity: phase === 'in' ? 0.7 : 0.2,
          }}
          transition={{
            duration: settings.breathingIn,
            ease: "easeInOut"
          }}
          className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen"
        />
      )}

      {/* Text overlay for breathing */}
      {showBreathing && settings.showText && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 1 }}
          className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white/70"
        >
          {phase === 'in' ? 'Вдох' : 'Выдох'}
        </motion.div>
      )}

      {/* Bilateral Orb */}
      {showBilateral && !settings.reducedMotion && (
        <div className="absolute w-full h-1 flex items-center justify-center opacity-30">
          {/* Subtle track line */}
          <div className="w-[80vw] h-[1px] bg-black/10 rounded-full" />
        </div>
      )}

      {showBilateral && (
        settings.reducedMotion ? (
          /* Reduced Motion: fading sides */
          <div className="absolute inset-0 flex justify-between">
            <motion.div 
              animate={{ opacity: isActive ? [0.1, 0.4, 0.1] : 0.1 }}
              transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent blur-2xl"
            />
            <motion.div 
              animate={{ opacity: isActive ? [0.1, 0.1, 0.4, 0.1] : 0.1 }}
              transition={{ duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent blur-2xl"
            />
          </div>
        ) : (
          /* Normal Motion: moving orb */
          <motion.div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]"
            animate={isActive ? {
              x: [`-${parseInt(getAmplitudeWidth())/2}vw`, `${parseInt(getAmplitudeWidth())/2}vw`, `-${parseInt(getAmplitudeWidth())/2}vw`]
            } : { x: 0 }}
            transition={isActive ? {
              duration: getSpeedSeconds() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : { duration: 0.5 }}
          />
        )
      )}
    </div>
  );
}

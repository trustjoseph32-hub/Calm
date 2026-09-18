import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { PracticeSession, SessionStatus } from '../types';
import { BilateralAudioEngine } from '../lib/audio';

type EngineState = 
  | 'SOS_INTERCEPT'
  | 'INTRO'
  | 'ACTIVE_ROUND'
  | 'SOS_PAUSE'
  | 'SOS_OUTRO'
  | 'EVALUATION'
  | 'EVAL_EASIER'
  | 'EVAL_SAME'
  | 'GROUNDING'
  | 'SAFE_CLOSING'
  | 'CHECKOUT'
  | 'PAUSED';


const EyeAnimation = ({ axis }: { axis: 'horizontal' | 'vertical' | 'diagonal' }) => {
  const pupilVariants = {
    horizontal: { x: [-18, 18, -18], y: 0 },
    vertical: { x: 0, y: [-12, 12, -12] },
    diagonal: { x: [-14, 14, -14], y: [-10, 10, -10] }
  };
  
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-8 mt-6">
      {[1, 2].map((i) => (
        <div key={i} className="w-16 h-8 sm:w-20 sm:h-10 bg-neutral-100 rounded-[50%] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.1)] relative overflow-hidden border-t-[3px] border-neutral-500">
           <motion.div 
             animate={axis} 
             variants={pupilVariants} 
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-neutral-900 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] relative"
           >
              {/* Pupil */}
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
              {/* Catchlight */}
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-sky-200/80 rounded-full absolute top-1.5 right-1.5 sm:top-2 sm:right-2 blur-[0.5px]" />
           </motion.div>
           {/* Eyelid shadow overlay */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export function SynchronizedEngine() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, addSession, courseProgress, updateCourseTodayState } = useAppStore();
  
  const stateData = location.state || {};
  const isSOS = stateData.isSOS || false;
  const courseDay = stateData.courseDay;
  const anxietyBefore = stateData.anxietyBefore;
  
  // Audio
  const audioRef = useRef(new BilateralAudioEngine());
  
  // State machine
  const [engineState, setEngineState] = useState<EngineState>(() => {
    if (isSOS && anxietyBefore !== undefined && anxietyBefore >= 8) {
      return 'SOS_INTERCEPT';
    }
    return 'INTRO';
  });
  
  const [prevState, setPrevState] = useState<EngineState | null>(null);
  
  // Session tracking
  const [sessionData, setSessionData] = useState<Partial<PracticeSession>>({
    practiceType: stateData.type || 'synchronized',
    anxietyBefore: anxietyBefore,
    duration: 0,
    completedRounds: 0,
    roundAnswers: [],
    usedGrounding: false,
    reducedMotion: settings.reducedMotion || settings.syncReducedMotion || stateData.type === 'breathing',
    isSOS,
    courseDay
  });
  
  // Dynamic settings for current session
  const [currentSpeed, setCurrentSpeed] = useState(settings.bilateralSpeed);
  const [onlyBreathing, setOnlyBreathing] = useState(stateData.type === 'breathing');
  const [anxietyAfter, setAnxietyAfter] = useState(anxietyBefore || 5);
  
  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingAfterWorse = useRef(false);
  
  // Time tracking
  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(0);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds round
  const [totalTime, setTotalTime] = useState(0);
  
  // Animation state
  const [xOffset, setXOffset] = useState(0);
  const [circleScale, setCircleScale] = useState(1);
  const [isExpanding, setIsExpanding] = useState(true);
  const [isSecondInhale, setIsSecondInhale] = useState(false);
  const [yOffset, setYOffset] = useState(0);

  // SOS state
  const [roundIndex, setRoundIndex] = useState(0);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(10);
  const [sosConfig] = useState(() => [
    { axis: 'horizontal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: 1 },
    { axis: 'vertical', dirX: 1, dirY: -1 }, // Always -1 so inhale (sineProgress -1 to 1) translates to bottom(1) to top(-1)
    { axis: 'diagonal', dirX: Math.random() > 0.5 ? 1 : -1, dirY: -1 } // Always -1 for vertical component to match bottom-to-top inhale
  ]);
  
  const animationRef = useRef<number>();
  const isPaused = engineState === 'PAUSED';
  const isActive = engineState === 'ACTIVE_ROUND' && !isPaused;

  const reducedMotion = sessionData.reducedMotion || onlyBreathing;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audioRef.current.destroy();
    };
  }, []);
  
  // Audio initialization
  useEffect(() => {
    if (isActive) {
      audioRef.current.init(settings.syncVolume, settings.syncAmbientSound, settings.syncBilateralVolume);
    } else {
      audioRef.current.stopAll();
    }
  }, [isActive, settings.syncAmbientSound, settings.syncVolume, settings.syncBilateralVolume]);

  const handleRoundComplete = useCallback(() => {
    setSessionData(prev => ({ ...prev, completedRounds: (prev.completedRounds || 0) + 1 }));
    audioRef.current.stopAll();
    
    // Update total time
    const roundDuration = Math.floor((Date.now() - roundStartTimeRef.current) / 1000);
    setTotalTime(t => t + roundDuration);

    if (isSOS) {
      if (roundIndex < 2) {
        setPauseTimeLeft(10);
        setEngineState('SOS_PAUSE');
      } else {
        setEngineState('SOS_OUTRO');
      }
    } else {
      setEngineState('EVALUATION');
    }
  }, [isSOS, roundIndex, totalTime, anxietyBefore, sessionData, addSession, navigate]);

  // Main animation loop
  useEffect(() => {
    if (!isActive) return;
    
    roundStartTimeRef.current = Date.now();
    let lastAudioToneTime = 0;
    
    let lastFrameTime = Date.now();
    let phase = 0; // 0 to 1 for a full cycle (inhale + exhale)
    
    const ROUND_DURATION = isSOS ? 60 : 20;
    const ROUND_DURATION_MS = ROUND_DURATION * 1000;
    
    const animate = () => {
      const now = Date.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      const elapsed = now - roundStartTimeRef.current;
      
      // Update time left
      const remaining = Math.max(0, ROUND_DURATION - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        handleRoundComplete();
        return;
      }
      
      // Interpolate duration from 3s to 2.5s based on round progress
      const roundProgress = Math.min(1, elapsed / ROUND_DURATION_MS); 
      const currentHalfDuration = 3000 - (roundProgress * 500); // 3s down to 2.5s
      const currentFullDuration = currentHalfDuration * 2;
      
      // Update phase seamlessly based on delta time
      phase += dt / currentFullDuration;
      if (phase >= 1) phase -= 1;
      
      const expanding = phase < 0.5;
      setIsExpanding(expanding);
      
      // Breathing cycle animation
      let mappedProgress = 0;
      let circleMappedProgress = 0;
      
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        // Ball movement mappedProgress (Smooth for ball in both cases)
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        
        if (isSOS) {
          // 50% time for first inhale, 50% time for second inhale (довдох)
          if (progress < 0.50) {
            // First inhale (0 to 50% of time, grows to ~50% of max expansion)
            const localProgress = progress / 0.50;
            circleMappedProgress = 0.50 * Math.sin(localProgress * (Math.PI / 2));
            setIsSecondInhale(false);
          } else {
            // Second inhale (50% to 100% of time). Grows from 50% to 100%
            const localProgress = (progress - 0.50) / 0.50;
            // Smooth ease-in-out ensures the circle accelerates from the pause and decelerates perfectly in sync with the ball at the end
            const easeInOut = 0.5 * (1 - Math.cos(Math.PI * localProgress));
            circleMappedProgress = 0.50 + 0.50 * easeInOut;
            setIsSecondInhale(true);
          }
        } else {
          // Standard smooth breathing
          circleMappedProgress = mappedProgress;
        }
        setCircleScale(1 + circleMappedProgress * 0.5);
      } else {
        // Exhale
        const progress = (phase - 0.5) * 2; // 0 to 1
        // Smooth ease in/out for exhale
        mappedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        circleMappedProgress = mappedProgress;
        
        // Reverse for exhale
        setCircleScale(1.5 - circleMappedProgress * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        let sineProgress = 0;
        if (expanding) {
          // The ball ALWAYS uses the smooth mappedProgress, never the jerky circle one
          sineProgress = -1 + mappedProgress * 2;
        } else {
          sineProgress = 1 - mappedProgress * 2;
        }
        
        let newX = 0;
        let newY = 0;
        
        if (isSOS) {
          const config = sosConfig[roundIndex] || sosConfig[0];
          if (config.axis === 'horizontal') {
            newX = sineProgress * config.dirX;
          } else if (config.axis === 'vertical') {
            newY = sineProgress * config.dirY;
          } else if (config.axis === 'diagonal') {
            newX = sineProgress * config.dirX;
            newY = sineProgress * config.dirY;
          }
        } else {
          newX = sineProgress;
        }

        setXOffset(newX);
        setYOffset(newY);
        
        // Pan ambient noise along with horizontal ball movement
        audioRef.current.setNoisePan(newX);

        // Audio tone playing at extremes (use raw sineProgress since EMDR relies on left/right oscillation)
        if (settings.syncBilateralAudio) {
          if (Math.abs(sineProgress) > 0.95 && now - lastAudioToneTime > currentHalfDuration * 0.8) {
            audioRef.current.playTone(sineProgress > 0 ? 'right' : 'left');
            lastAudioToneTime = now;
          }
        }
      } else {
        setXOffset(0);
        setYOffset(0);
        audioRef.current.setNoisePan(0);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, reducedMotion, currentSpeed, settings, isSOS, roundIndex, sosConfig, handleRoundComplete]);


  const startRound = () => {
    setTimeLeft(isSOS ? 60 : 20);
    setEngineState('ACTIVE_ROUND');
  };

  // SOS Pause Countdown Effect
  useEffect(() => {
    let interval: number;
    if (engineState === 'SOS_PAUSE') {
      interval = window.setInterval(() => {
        setPauseTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [engineState]);

  useEffect(() => {
    if (engineState === 'SOS_PAUSE' && pauseTimeLeft <= 0) {
      setRoundIndex(r => r + 1);
      startRound();
    }
  }, [engineState, pauseTimeLeft]);

  const pause = () => {
    setPrevState(engineState);
    setEngineState('PAUSED');
  };

  const resume = () => {
    if (prevState) {
      setEngineState(prevState);
      setPrevState(null);
    }
  };

  const handleEvaluation = (answer: 'easier' | 'same' | 'harder') => {
    setSessionData(prev => ({
      ...prev,
      roundAnswers: [...(prev.roundAnswers || []), answer]
    }));
    
    if (answer === 'easier') {
      setEngineState('EVAL_EASIER');
    } else if (answer === 'same') {
      setEngineState('EVAL_SAME');
    } else {
      // Harder
      setSessionData(prev => ({ ...prev, interruptionReason: 'Got harder' }));
      groundingAfterWorse.current = true;
      setEngineState('GROUNDING');
      setGroundingStep(0);
    }
  };

  const initiateSafeClosing = () => {
    setEngineState('SAFE_CLOSING');
  };

  const finishSession = () => {
    if (anxietyBefore !== null && anxietyBefore !== undefined) {
      setEngineState('CHECKOUT');
    } else {
      saveAndExit(null);
    }
  };
  
  const saveAndExit = (finalScore: number | null) => {
    const finalDuration = totalTime + Math.floor((Date.now() - startTimeRef.current) / 1000);
    const isFullValid = anxietyBefore !== null && anxietyBefore !== undefined && finalScore !== null;
    
    addSession({
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      endTime: new Date().toISOString(),
      practiceType: sessionData.practiceType as any,
      duration: finalDuration,
      anxietyBefore: sessionData.anxietyBefore,
      anxietyAfter: finalScore !== null ? finalScore : undefined,
      anxietyDelta: isFullValid ? finalScore - sessionData.anxietyBefore! : undefined,
      status: 'closed_safely',
      completedRounds: sessionData.completedRounds || 0,
      roundAnswers: sessionData.roundAnswers || [],
      usedGrounding: sessionData.usedGrounding || false,
      interruptionReason: sessionData.interruptionReason,
      reducedMotion: sessionData.reducedMotion || false,
      validForOutcomeStats: isFullValid,
      schemaVersion: 2,
      isSOS,
      courseDay
    });
    
    if (courseDay) {
       updateCourseTodayState({ practiceStatus: 'completed' });
    }
    navigate('/');
  };

  const getDeltaText = () => {
    if (anxietyBefore === null || anxietyBefore === undefined) return '';
    const diff = anxietyAfter - anxietyBefore;
    if (diff < -1) return `Напряжение снизилось на ${Math.abs(diff)} пункта`;
    if (diff === -1) return `Напряжение снизилось на 1 пункт`;
    if (diff === 0) return `Состояние почти не изменилось`;
    if (diff === 1) return `Напряжение усилилось на 1 пункт`;
    return `Напряжение усилилось на ${diff} пункта`;
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-neutral-100 min-h-screen relative overflow-hidden">
      
      {/* Controls Overlay */}
      {engineState !== 'SAFE_CLOSING' && (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
          {engineState === 'ACTIVE_ROUND' && (
            <div className="bg-transparent/80 px-4 py-2 rounded-full border border-white/10 font-medium font-mono text-sm">
              0:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            {isActive && (
              <button 
                onClick={() => { audioRef.current?.stopAll(); setEngineState('SOS_OUTRO'); }} 
                className="px-6 py-2 bg-transparent/80 text-slate-300 text-sm font-medium rounded-full border border-white/10 hover:bg-white/10 transition-colors"
              >
                Завершить
              </button>
            )}
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {engineState === 'SOS_INTERCEPT' && (
            <motion.div key="sos_intercept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md text-center space-y-8">
              <h2 className="text-2xl font-medium">Высокое напряжение</h2>
              <p className="text-slate-400">Похоже, сейчас вам очень тяжело. Давать глазам быструю нагрузку может быть некомфортно.</p>
              <div className="space-y-4">
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Сделать мягкое заземление (Grounding)</button>
                <button onClick={startRound} className="w-full py-4 bg-white/10 rounded-full font-medium text-slate-400">Всё равно перейти к дыханию</button>
              </div>
            </motion.div>
          )}

          {engineState === 'SOS_PAUSE' && (
            <motion.div key="sos_pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отдых</h2>
              <div className="text-slate-400">
                <p>Сделай глубокий вдох и медленный выдох.</p>
                <p className="mt-2">Готовимся к следующему этапу (движение {sosConfig[roundIndex + 1]?.axis === 'horizontal' ? 'горизонтальное' : sosConfig[roundIndex + 1]?.axis === 'vertical' ? 'вертикальное' : 'диагональное'}).</p>
              </div>
              <EyeAnimation axis={sosConfig[roundIndex + 1]?.axis || 'horizontal'} />
              <div className="text-8xl font-light text-neutral-100 mt-8">{pauseTimeLeft}</div>
            </motion.div>
          )}
          
          {engineState === 'INTRO' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">{isSOS ? 'Скорая помощь' : 'Практика'}</h2>
              <div className="text-slate-400">
                <p>Дыши мягко и без усилия.</p>
                <p className="mt-2">Следи за точкой только в комфортной амплитуде.</p>
              </div>
              <button onClick={startRound} className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg active:scale-95 transition-transform border border-indigo-300/40">
                <Play className="w-8 h-8 fill-current text-white ml-1 drop-shadow-md" />
              </button>
            </motion.div>
          )}

          {engineState === 'ACTIVE_ROUND' && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
              


              {/* Breathing Circle */}
              <div 
                className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-200/80 blur-[60px] sm:blur-[100px] mix-blend-screen pointer-events-none"
                style={{
                  transform: `scale(${(circleScale - 1) * 0.8 + 0.6})`,
                  opacity: (circleScale - 1) * 1 + 0.2,
                  transition: 'transform 0.05s linear, opacity 0.05s linear'
                }}
              />
              
              {/* Text overlay for breathing */}
              {settings.showText && (
                <div className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500">
                  {isExpanding ? (isSOS && isSecondInhale ? 'Довдох' : 'Вдох') : 'Выдох'}
                </div>
              )}

              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 46vw), calc(${yOffset} * 46vh))`,
                  transition: 'transform 0.05s linear'
                }}
              />
            </motion.div>
          )}

          {engineState === 'EVALUATION' && (
            <motion.div key="eval" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xs w-full text-center space-y-6">
              <h2 className="text-2xl font-medium">Что изменилось?</h2>
              <div className="space-y-3">
                <button onClick={() => handleEvaluation('easier')} className="w-full py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Легче</button>
                <button onClick={() => handleEvaluation('same')} className="w-full py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Без изменений</button>
                <button onClick={() => handleEvaluation('harder')} className="w-full py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Тяжелее</button>
              </div>
            </motion.div>
          )}

          {engineState === 'EVAL_EASIER' && (
            <motion.div key="eval_easier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs w-full text-center space-y-6">
              <p className="text-lg text-slate-300">Можно завершить или сделать ещё один короткий раунд</p>
              <div className="space-y-3">
                <button onClick={startRound} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Ещё один раунд</button>
                <button onClick={initiateSafeClosing} className="w-full py-4 bg-white/10 rounded-full font-medium">Завершить</button>
              </div>
            </motion.div>
          )}

          {engineState === 'EVAL_SAME' && (
            <motion.div key="eval_same" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center space-y-6">
              <p className="text-lg text-slate-300">Можно попробовать более медленный ритм или перейти к другой практике</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setCurrentSpeed('slow'); startRound(); }} className="py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Медленнее</button>
                <button onClick={() => { setOnlyBreathing(true); startRound(); }} className="py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Только дыхание</button>
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Grounding</button>
                <button onClick={initiateSafeClosing} className="py-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-neutral-700 transition-colors">Завершить</button>
              </div>
            </motion.div>
          )}

          {engineState === 'GROUNDING' && (
            <motion.div key="grounding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center space-y-8">
              {groundingAfterWorse.current && groundingStep === 0 && (
                <div className="bg-orange-900/20 text-orange-400 p-4 rounded-xl text-sm border border-orange-900/30 mb-8">
                  Остановим движение и вернём внимание к тому, что находится вокруг
                </div>
              )}
              
              <div className="text-2xl font-medium leading-relaxed min-h-[120px] flex items-center justify-center">
                {groundingStep === 0 && "Назови про себя 5 вещей, которые видишь"}
                {groundingStep === 1 && "Заметь 4 ощущения в теле (например, касание одежды)"}
                {groundingStep === 2 && "Найди 3 звука вокруг"}
                {groundingStep === 3 && "Почувствуй опору под ногами или под телом"}
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setSessionData(prev => ({ ...prev, usedGrounding: true }));
                    groundingAfterWorse.current = false;
                    setEngineState('EVAL_SAME'); // Show post-grounding options early
                  }} 
                  className="w-full py-4 bg-emerald-600 rounded-full font-medium"
                >
                  Мне уже лучше
                </button>
                {groundingStep < 3 && (
                  <button 
                    onClick={() => {
                      setGroundingStep(s => s + 1);
                    }} 
                    className="w-full py-4 bg-white/10 rounded-full font-medium border border-white/10"
                  >
                    Следующий шаг
                  </button>
                )}
                {groundingStep === 3 && (
                  <button 
                    onClick={() => {
                      setSessionData(prev => ({ ...prev, usedGrounding: true }));
                      groundingAfterWorse.current = false;
                      setEngineState('EVAL_SAME'); 
                    }} 
                    className="w-full py-4 bg-white/10 rounded-full font-medium border border-white/10"
                  >
                    Закончить заземление
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {engineState === 'SAFE_CLOSING' && (
            <motion.div key="closing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm w-full text-center space-y-8">
              <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <h2 className="text-2xl font-medium">Практика закончена</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Сделай несколько обычных комфортных вдохов и выдохов. Почувствуй опору под ногами или под телом. Посмотри вокруг и назови про себя три предмета, которые видишь.
              </p>
              <button onClick={finishSession} className="w-full py-4 mt-8 bg-white/10 rounded-full font-medium text-white border border-white/10 hover:bg-neutral-700 transition-colors">
                Завершить
              </button>
            </motion.div>
          )}
          
                    {engineState === 'SOS_OUTRO' && (
            <motion.div key="sos_outro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4 text-center">
              <h2 className="text-2xl font-medium text-white mb-6">Скорая помощь завершена</h2>
              <div className="text-lg font-light text-slate-300 leading-relaxed space-y-6 mb-12">
                <p>Сделайте спокойный глубокий вдох и медленный выдох.</p>
                <p>Вы можете возвращаться к этой практике столько раз в день, сколько потребуется вашему состоянию.</p>
              </div>
              <div className="mt-auto pb-8 w-full">
                <button
                  onClick={() => saveAndExit(null)}
                  className="w-full bg-white text-slate-900 py-4 rounded-3xl font-medium hover:bg-slate-100 transition-colors text-lg"
                >
                  Завершить практику
                </button>
              </div>
            </motion.div>
          )}

          {engineState === 'CHECKOUT' && (
            <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full px-4">
              <h2 className="text-2xl font-medium mb-2 text-white text-center">Как вы себя чувствуете сейчас?</h2>
              <p className="text-slate-400 mb-12 text-center">Оцените уровень тревожности после практики</p>
              
              <div className="text-6xl font-light mb-8 tabular-nums text-center text-white">
                {anxietyAfter}
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={anxietyAfter} 
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (newValue !== anxietyAfter) {
                    setAnxietyAfter(newValue);
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                  }
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mb-12 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              />
              <div className="mt-auto pb-8 w-full">
                <button 
                  onClick={() => setEngineState('SOS_SUMMARY')} 
                  className="w-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white py-4 rounded-3xl font-medium transition-all text-lg flex items-center justify-center gap-2"
                >
                  Продолжить
                </button>
              </div>
            </motion.div>
          )}

          {engineState === 'PAUSED' && (
            <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs w-full text-center space-y-6">
              <h2 className="text-2xl font-medium">Пауза</h2>
              <div className="space-y-3">
                <button onClick={resume} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Продолжить</button>
                <button onClick={initiateSafeClosing} className="w-full py-4 bg-white/10 rounded-full font-medium">Завершить практику</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

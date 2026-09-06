import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, X, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { PracticeSession, SessionStatus } from '../types';
import { BilateralAudioEngine } from '../lib/audio';

type EngineState = 
  | 'SOS_INTERCEPT'
  | 'INTRO'
  | 'ACTIVE_ROUND'
  | 'SOS_PAUSE'
  | 'EVALUATION'
  | 'EVAL_EASIER'
  | 'EVAL_SAME'
  | 'GROUNDING'
  | 'SAFE_CLOSING'
  | 'CHECKOUT'
  | 'PAUSED';

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
        if (anxietyBefore !== null && anxietyBefore !== undefined) {
          setEngineState('CHECKOUT');
        } else {
          // Finish directly
          const finalDuration = totalTime + roundDuration;
          addSession({
            sessionId: Date.now().toString(),
            date: new Date().toISOString(),
            endTime: new Date().toISOString(),
            practiceType: sessionData.practiceType as any,
            duration: finalDuration,
            anxietyBefore: sessionData.anxietyBefore,
            status: 'completed',
            completedRounds: (sessionData.completedRounds || 0) + 1,
            roundAnswers: sessionData.roundAnswers || [],
            usedGrounding: sessionData.usedGrounding || false,
            reducedMotion: sessionData.reducedMotion || false,
            validForOutcomeStats: false,
            schemaVersion: 2,
            isSOS: isSOS,
            courseDay: sessionData.courseDay
          });
          navigate('/', { replace: true });
        }
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
      if (expanding) {
        const progress = phase * 2; // 0 to 1
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1 + ease * 0.5);
      } else {
        const progress = (phase - 0.5) * 2; // 0 to 1
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
        setCircleScale(1.5 - ease * 0.5);
      }
      
      // Bilateral Movement
      if (!reducedMotion) {
        const sineProgress = -Math.cos(phase * Math.PI * 2);
        
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
            <div className="bg-neutral-900/80 px-4 py-2 rounded-full border border-neutral-700 font-medium font-mono text-sm">
              0:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            {isActive && (
              <button onClick={pause} className="p-3 bg-neutral-900/80 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors" aria-label="Пауза">
                <Pause className="w-5 h-5 text-neutral-300" />
              </button>
            )}
            <button onClick={() => {
              setSessionData(prev => ({ ...prev, interruptionReason: 'User clicked discomfort' }));
              setEngineState('GROUNDING');
              setGroundingStep(0);
            }} className="px-4 py-2 bg-red-900/30 text-red-400 text-sm font-medium rounded-full border border-red-900/50 hover:bg-red-900/50 transition-colors">
              Мне некомфортно
            </button>
            <button onClick={pause} className="p-3 bg-neutral-900/80 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors" aria-label="Закрыть">
              <X className="w-5 h-5 text-neutral-300" />
            </button>
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {engineState === 'SOS_INTERCEPT' && (
            <motion.div key="sos_intercept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md text-center space-y-8">
              <h2 className="text-2xl font-medium">Высокое напряжение</h2>
              <p className="text-neutral-400">Похоже, сейчас вам очень тяжело. Давать глазам быструю нагрузку может быть некомфортно.</p>
              <div className="space-y-4">
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Сделать мягкое заземление (Grounding)</button>
                <button onClick={startRound} className="w-full py-4 bg-neutral-800 rounded-full font-medium text-neutral-400">Всё равно перейти к дыханию</button>
              </div>
            </motion.div>
          )}

          {engineState === 'SOS_PAUSE' && (
            <motion.div key="sos_pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отдых</h2>
              <div className="text-neutral-400">
                <p>Сделай глубокий вдох и медленный выдох.</p>
                <p className="mt-2">Готовимся к следующему этапу.</p>
              </div>
              <div className="text-8xl font-light text-neutral-100 mt-8">{pauseTimeLeft}</div>
            </motion.div>
          )}
          
          {engineState === 'INTRO' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">{isSOS ? 'Скорая помощь' : 'Практика'}</h2>
              <div className="text-neutral-400">
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
                className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen pointer-events-none"
                style={{
                  transform: `scale(${(circleScale - 1) * 0.8 + 0.6})`,
                  opacity: (circleScale - 1) * 1 + 0.2,
                  transition: 'transform 0.05s linear, opacity 0.05s linear'
                }}
              />
              
              {/* Text overlay for breathing */}
              {settings.showText && (
                <div className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white/70 pointer-events-none z-0 transition-opacity duration-500">
                  {isExpanding ? 'Вдох' : 'Выдох'}
                </div>
              )}

              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 40vw), calc(${yOffset} * 38vh))`,
                  transition: 'transform 0.05s linear'
                }}
              />
            </motion.div>
          )}

          {engineState === 'EVALUATION' && (
            <motion.div key="eval" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xs w-full text-center space-y-6">
              <h2 className="text-2xl font-medium">Что изменилось?</h2>
              <div className="space-y-3">
                <button onClick={() => handleEvaluation('easier')} className="w-full py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Легче</button>
                <button onClick={() => handleEvaluation('same')} className="w-full py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Без изменений</button>
                <button onClick={() => handleEvaluation('harder')} className="w-full py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Тяжелее</button>
              </div>
            </motion.div>
          )}

          {engineState === 'EVAL_EASIER' && (
            <motion.div key="eval_easier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs w-full text-center space-y-6">
              <p className="text-lg text-neutral-300">Можно завершить или сделать ещё один короткий раунд</p>
              <div className="space-y-3">
                <button onClick={startRound} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Ещё один раунд</button>
                <button onClick={initiateSafeClosing} className="w-full py-4 bg-neutral-800 rounded-full font-medium">Завершить</button>
              </div>
            </motion.div>
          )}

          {engineState === 'EVAL_SAME' && (
            <motion.div key="eval_same" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center space-y-6">
              <p className="text-lg text-neutral-300">Можно попробовать более медленный ритм или перейти к другой практике</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setCurrentSpeed('slow'); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Медленнее</button>
                <button onClick={() => { setOnlyBreathing(true); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Только дыхание</button>
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Grounding</button>
                <button onClick={initiateSafeClosing} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Завершить</button>
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
                    className="w-full py-4 bg-neutral-800 rounded-full font-medium border border-neutral-700"
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
                    className="w-full py-4 bg-neutral-800 rounded-full font-medium border border-neutral-700"
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
              <p className="text-neutral-400 leading-relaxed text-lg">
                Сделай несколько обычных комфортных вдохов и выдохов. Почувствуй опору под ногами или под телом. Посмотри вокруг и назови про себя три предмета, которые видишь.
              </p>
              <button onClick={finishSession} className="w-full py-4 mt-8 bg-neutral-800 rounded-full font-medium text-white border border-neutral-700 hover:bg-neutral-700 transition-colors">
                Завершить
              </button>
            </motion.div>
          )}
          
          {engineState === 'CHECKOUT' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm w-full text-center space-y-8">
              <h2 className="text-2xl font-medium">Оценка состояния</h2>
              <p className="text-neutral-400">Насколько сильное напряжение сейчас?</p>
              
              <div className="px-2 pb-8">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={anxietyAfter} 
                  onChange={(e) => setAnxietyAfter(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
                  <span>0</span>
                  <span>10</span>
                </div>
                <div className="text-4xl font-light mt-6 mb-4">{anxietyAfter}</div>
                <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 text-neutral-300 text-sm">
                  {getDeltaText()}
                </div>
              </div>
              
              <button onClick={() => saveAndExit(anxietyAfter)} className="w-full py-4 bg-indigo-600 rounded-full font-medium text-white hover:bg-indigo-700 transition-colors">
                Сохранить и выйти
              </button>
            </motion.div>
          )}

          {engineState === 'PAUSED' && (
            <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs w-full text-center space-y-6">
              <h2 className="text-2xl font-medium">Пауза</h2>
              <div className="space-y-3">
                <button onClick={resume} className="w-full py-4 bg-indigo-600 rounded-full font-medium">Продолжить</button>
                <button onClick={initiateSafeClosing} className="w-full py-4 bg-neutral-800 rounded-full font-medium">Завершить практику</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

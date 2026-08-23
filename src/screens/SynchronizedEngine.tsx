import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { PracticeSession } from '../types';
import { BilateralAudioEngine } from '../lib/audio';

type SyncState = 
  | 'INTRO'
  | 'COUNTDOWN_HORIZONTAL'
  | 'HORIZONTAL_ACTIVE'
  | 'PAUSE_1'
  | 'COUNTDOWN_VERTICAL'
  | 'VERTICAL_ACTIVE'
  | 'PAUSE_2'
  | 'COUNTDOWN_TRIANGLE'
  | 'TRIANGLE_ACTIVE'
  | 'PAUSE_3'
  | 'COUNTDOWN_DIAGONAL'
  | 'DIAGONAL_ACTIVE'
  | 'PAUSE_4'
  | 'COUNTDOWN_INFINITY'
  | 'INFINITY_ACTIVE'
  | 'PAUSE_5'
  | 'FINAL_REST'
  | 'CHECKOUT'
  | 'GROUNDING'
  | 'PAUSED';

export function SynchronizedEngine() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, addSession } = useAppStore();
  
  const anxietyBefore = location.state?.anxietyBefore ?? 5;
  const isSOS = location.state?.isSOS ?? false;
  const phaseDurationMs = isSOS ? 60000 : 90000;
  
  const [state, setState] = useState<SyncState>('INTRO');
  const [prevState, setPrevState] = useState<SyncState>('INTRO');
  
  const [countdown, setCountdown] = useState(3);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(10);
  
  const [breathPhase, setBreathPhase] = useState<'in'|'out'>('in');
  const breathPhaseRef = useRef<'in'|'out'>('in');
  const [phaseProgress, setPhaseProgress] = useState(0); 
  const phaseProgressRef = useRef(0);

  const [anxietyAfter, setAnxietyAfter] = useState<number>(5);
  const [groundingStep, setGroundingStep] = useState(0);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const audioRef = useRef<BilateralAudioEngine>(new BilateralAudioEngine());
  
  const activeTimeMsRef = useRef(0);
  const triangleSideRef = useRef(0);

  const randomDirectionsRef = useRef({
    horizontal: Math.random() > 0.5,
    diagonal: Math.random() > 0.5,
    infinity: Math.random() > 0.5,
  });

  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number>();

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      const activeStates = ['HORIZONTAL_ACTIVE', 'VERTICAL_ACTIVE', 'TRIANGLE_ACTIVE', 'DIAGONAL_ACTIVE', 'INFINITY_ACTIVE'];
      if (activeStates.includes(state)) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [state]);

  const initAudio = () => {
    if (settings.syncBilateralAudio || settings.syncBackgroundNoise !== 'none') {
      audioRef.current.init(settings.syncVolume, settings.syncBackgroundNoise);
    }
  };

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    let active = false;
    let durationMs = 1000;
    if (state === 'HORIZONTAL_ACTIVE' || state === 'VERTICAL_ACTIVE' || state === 'TRIANGLE_ACTIVE' || state === 'DIAGONAL_ACTIVE' || state === 'INFINITY_ACTIVE') {
      active = true;
      let baseDurationMs = settings.syncInhaleDuration * 1000;
      const progress = Math.min(1, activeTimeMsRef.current / phaseDurationMs);
      const speedMultiplier = 1 + (0.2 * progress);
      durationMs = baseDurationMs / speedMultiplier;
    }

    if (active) {
      activeTimeMsRef.current += deltaTime;
      
      let nextProgress = phaseProgressRef.current + deltaTime / durationMs;
      if (nextProgress >= 1) {
        nextProgress = nextProgress % 1; // smoother wrap around
        
        // Determine next phase to use for logic here
        const nextPhase = breathPhaseRef.current === 'in' ? 'out' : 'in';
        const prevSide = triangleSideRef.current;
        
        if (state === 'TRIANGLE_ACTIVE') {
           triangleSideRef.current = (triangleSideRef.current + 1) % 3;
        }

        if (settings.syncBilateralAudio) {
           if (state === 'HORIZONTAL_ACTIVE' || state === 'DIAGONAL_ACTIVE' || state === 'INFINITY_ACTIVE') {
             let pan = nextPhase === 'in' ? -1 : 1;
             if (state === 'HORIZONTAL_ACTIVE' && randomDirectionsRef.current.horizontal) pan *= -1;
             if (state === 'DIAGONAL_ACTIVE' && randomDirectionsRef.current.diagonal) pan *= -1;
             if (state === 'INFINITY_ACTIVE' && randomDirectionsRef.current.infinity) pan *= -1;
             audioRef.current.playTone(pan);
           } else if (state === 'VERTICAL_ACTIVE') {
             audioRef.current.playTone(0);
           } else if (state === 'TRIANGLE_ACTIVE') {
             let pan = 0;
             if (prevSide === 0) pan = -1; // Starts at V0 (left)
             else if (prevSide === 1) pan = 0; // Starts at V1 (center)
             else if (prevSide === 2) pan = 1; // Starts at V2 (right)
             audioRef.current.playTone(pan);
           }
        }

        if (nextPhase === 'in') { // meaning we just finished 'out'
          if (activeTimeMsRef.current >= phaseDurationMs) {
             setTimeout(() => {
               if (state === 'HORIZONTAL_ACTIVE') setState('PAUSE_1');
               if (state === 'VERTICAL_ACTIVE') setState('PAUSE_2');
               if (state === 'TRIANGLE_ACTIVE') setState('PAUSE_3');
               if (state === 'DIAGONAL_ACTIVE') setState('PAUSE_4');
               if (state === 'INFINITY_ACTIVE') setState('PAUSE_5');
             }, 0);
          }
        }
        
        breathPhaseRef.current = nextPhase;
        setBreathPhase(nextPhase);
      }
      
      phaseProgressRef.current = nextProgress;
      setPhaseProgress(nextProgress);
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [state, settings, phaseDurationMs]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  useEffect(() => {
    if (state.startsWith('COUNTDOWN')) {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            if (state === 'COUNTDOWN_HORIZONTAL') setState('HORIZONTAL_ACTIVE');
            if (state === 'COUNTDOWN_VERTICAL') setState('VERTICAL_ACTIVE');
            if (state === 'COUNTDOWN_TRIANGLE') setState('TRIANGLE_ACTIVE');
            if (state === 'COUNTDOWN_DIAGONAL') setState('DIAGONAL_ACTIVE');
            if (state === 'COUNTDOWN_INFINITY') setState('INFINITY_ACTIVE');
            
            activeTimeMsRef.current = 0;
            triangleSideRef.current = 0;
            breathPhaseRef.current = 'in';
            phaseProgressRef.current = 0;
            setBreathPhase('in');
            setPhaseProgress(0);
            return 3;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'PAUSE_1' || state === 'PAUSE_2' || state === 'PAUSE_3' || state === 'PAUSE_4' || state === 'PAUSE_5') {
      setPauseTimeLeft(10);
      const timer = setInterval(() => {
        setPauseTimeLeft(c => {
          if (c <= 1) {
            clearInterval(timer);
            if (state === 'PAUSE_1') setState('COUNTDOWN_VERTICAL');
            if (state === 'PAUSE_2') { if (isSOS) setState('COUNTDOWN_DIAGONAL'); else setState('COUNTDOWN_TRIANGLE'); }
            if (state === 'PAUSE_3') setState('COUNTDOWN_DIAGONAL');
            if (state === 'PAUSE_4') setState('COUNTDOWN_INFINITY');
            if (state === 'PAUSE_5') setState('FINAL_REST');
            return 10;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'FINAL_REST') {
      const timer = setTimeout(() => {
        setState('CHECKOUT');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const activeStates = [
          'HORIZONTAL_ACTIVE', 'VERTICAL_ACTIVE', 'TRIANGLE_ACTIVE', 'DIAGONAL_ACTIVE', 'INFINITY_ACTIVE',
          'COUNTDOWN_HORIZONTAL', 'COUNTDOWN_VERTICAL', 'COUNTDOWN_TRIANGLE', 'COUNTDOWN_DIAGONAL', 'COUNTDOWN_INFINITY',
          'PAUSE_1', 'PAUSE_2', 'PAUSE_3', 'PAUSE_4', 'PAUSE_5'
        ];
        if (activeStates.includes(state)) {
          setPrevState(state);
          setState('PAUSED');
          audioRef.current.stopAll();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [state]);

  const handleFinish = () => {
    addSession({
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      practiceType: 'synchronized',
      duration: 180, 
      anxietyBefore,
      anxietyAfter,
      anxietyDelta: anxietyAfter - anxietyBefore,
      inhaleDuration: settings.syncInhaleDuration,
      exhaleDuration: settings.syncExhaleDuration,
      bilateralAudioEnabled: settings.syncBilateralAudio,
      volume: settings.syncVolume,
      completed: true,
      stoppedEarly: false,
      discomfortTriggered: false,
      feedback: [
        anxietyAfter < anxietyBefore ? 'Заметно улучшение. Отличная работа.' : 
        anxietyAfter === anxietyBefore ? 'Иногда состояние меняется не сразу. Это нормально.' :
        'Возможно, практика подняла сложные чувства. Позаботься о себе.'
      ]
    });
    audioRef.current.destroy();
    navigate('/');
  };

  const [timeLeft, setTimeLeft] = useState(60);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const active = state === 'HORIZONTAL_ACTIVE' || state === 'VERTICAL_ACTIVE' || state === 'TRIANGLE_ACTIVE' || state === 'DIAGONAL_ACTIVE' || state === 'INFINITY_ACTIVE';

  useEffect(() => {
    const totalSeconds = Math.floor(phaseDurationMs / 1000);
    if (active) {
      const timer = setInterval(() => {
        setTimeLeft(Math.max(0, totalSeconds - Math.floor(activeTimeMsRef.current / 1000)));
      }, 500);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(totalSeconds);
    }
  }, [active, phaseDurationMs]);

  const showBreathing = active && settings.syncBreathingCircle;
  const isVertical = state === 'VERTICAL_ACTIVE';
  const isTriangle = state === 'TRIANGLE_ACTIVE';
  
  const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2;
  const breathProgress = easeInOutSine(phaseProgress);
  const visualProgress = state === 'INFINITY_ACTIVE' ? phaseProgress : easeInOutSine(phaseProgress);
  
  let xOffset = 0;
  let yOffset = 0;
  let amplitude = 40; 
  if (settings.syncVisualAmplitude === 'narrow') amplitude = 30;
  if (settings.syncVisualAmplitude === 'wide') amplitude = 45;

  if (state === 'HORIZONTAL_ACTIVE') {
    if (breathPhase === 'in') xOffset = -amplitude + (amplitude * 2 * visualProgress);
    else xOffset = amplitude - (amplitude * 2 * visualProgress);
  }
  else if (state === 'VERTICAL_ACTIVE') {
    if (breathPhase === 'in') yOffset = amplitude - (amplitude * 2 * visualProgress);
    else yOffset = -amplitude + (amplitude * 2 * visualProgress);
  }
  else if (state === 'TRIANGLE_ACTIVE') {
    const yAmp = amplitude * 0.8; 
    const V0 = { x: -amplitude, y: yAmp }; 
    const V1 = { x: 0, y: -yAmp };         
    const V2 = { x: amplitude, y: yAmp };  

    let start = V0, end = V1;
    if (triangleSideRef.current === 0) { start = V0; end = V1; }
    if (triangleSideRef.current === 1) { start = V1; end = V2; }
    if (triangleSideRef.current === 2) { start = V2; end = V0; }

    xOffset = start.x + (end.x - start.x) * visualProgress;
    yOffset = start.y + (end.y - start.y) * visualProgress;
  }
  else if (state === 'DIAGONAL_ACTIVE') {
    if (breathPhase === 'in') {
      xOffset = -amplitude + (amplitude * 2 * visualProgress);
      yOffset = amplitude - (amplitude * 2 * visualProgress);
    } else {
      xOffset = amplitude - (amplitude * 2 * visualProgress);
      yOffset = -amplitude + (amplitude * 2 * visualProgress);
    }
  }
  else if (state === 'INFINITY_ACTIVE') {
    const t = (breathPhase === 'in' ? visualProgress : 1 + visualProgress) * Math.PI;
    xOffset = amplitude * Math.sin(t);
    yOffset = amplitude * 0.5 * Math.sin(2 * t);
  }
  
  if (state === 'HORIZONTAL_ACTIVE' && randomDirectionsRef.current.horizontal) xOffset *= -1;
  if (state === 'DIAGONAL_ACTIVE' && randomDirectionsRef.current.diagonal) xOffset *= -1;
  if (state === 'INFINITY_ACTIVE' && randomDirectionsRef.current.infinity) xOffset *= -1;
  
  useEffect(() => {
    if (active && settings.syncBackgroundNoise !== 'none') {
      audioRef.current.setNoisePan(xOffset / amplitude);
      audioRef.current.setNoiseVolumeMod(yOffset / amplitude);
    }
  }, [xOffset, yOffset, amplitude, active, settings.syncBackgroundNoise]);

  const opacityLeft = state === 'HORIZONTAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset < 0 ? 0.4 : 0.1) : 0;
  const opacityRight = state === 'HORIZONTAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset > 0 ? 0.4 : 0.1) : 0;
  const opacityTop = isVertical && settings.syncReducedMotion 
    ? (yOffset < 0 ? 0.4 : 0.1) : 0;
  const opacityBottom = isVertical && settings.syncReducedMotion 
    ? (yOffset > 0 ? 0.4 : 0.1) : 0;
    
  const opacityTriTop = isTriangle && settings.syncReducedMotion
    ? (yOffset < 0 ? 0.4 : 0.1) : 0;
  const opacityTriRight = isTriangle && settings.syncReducedMotion
    ? (xOffset > 0 && yOffset > 0 ? 0.4 : 0.1) : 0;
  const opacityTriLeft = isTriangle && settings.syncReducedMotion
    ? (xOffset < 0 && yOffset > 0 ? 0.4 : 0.1) : 0;

  const opacityDiagBotLeft = state === 'DIAGONAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset < 0 && yOffset > 0 ? 0.4 : 0.1) : 0;
  const opacityDiagTopRight = state === 'DIAGONAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset > 0 && yOffset < 0 ? 0.4 : 0.1) : 0;

  const opacityDiagBotRight = state === 'DIAGONAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset > 0 && yOffset > 0 ? 0.4 : 0.1) : 0;
  const opacityDiagTopLeft = state === 'DIAGONAL_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset < 0 && yOffset < 0 ? 0.4 : 0.1) : 0;

  const opacityInfLeft = state === 'INFINITY_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset < 0 ? 0.4 : 0.1) : 0;
  const opacityInfRight = state === 'INFINITY_ACTIVE' && settings.syncReducedMotion 
    ? (xOffset > 0 ? 0.4 : 0.1) : 0;

  return (
    <div 
      className="flex-1 w-full bg-neutral-900 text-white relative overflow-hidden flex flex-col"
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />

      {/* PRACTICE CANVAS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Breathing Circle */}
        {showBreathing && (
          <div
            className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen transition-opacity duration-500"
            style={{
              opacity: breathPhase === 'in' ? 0.2 + (breathProgress * 0.5) : 0.7 - (breathProgress * 0.5),
              transform: `scale(${breathPhase === 'in' ? 0.72 + (breathProgress * 0.28) : 1.0 - (breathProgress * 0.28)})`
            }}
          />
        )}

        {/* Breathing Text */}
        <AnimatePresence>
          {showBreathing && settings.syncShowText && (
            <motion.div
              key={breathPhase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white/70"
            >
              {breathPhase === 'in' ? 'Вдох' : 'Выдох'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orb */}
        {active && !settings.syncReducedMotion && (
          <div
            className="absolute rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]"
            style={{
              width: settings.syncOrbSize === 'small' ? '1.5rem' : settings.syncOrbSize === 'large' ? '3rem' : '2rem',
              height: settings.syncOrbSize === 'small' ? '1.5rem' : settings.syncOrbSize === 'large' ? '3rem' : '2rem',
              transform: `translate(${xOffset}vw, ${yOffset}vh)`,
            }}
          />
        )}

        {/* Reduced Motion */}
        {active && settings.syncReducedMotion && (
          <div className="absolute inset-0">
             {state === 'HORIZONTAL_ACTIVE' && (
               <>
                 <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityLeft}} />
                 <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityRight}} />
               </>
             )}
             {isVertical && (
               <>
                 <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityTop}} />
                 <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityBottom}} />
               </>
             )}
             {isTriangle && (
               <>
                 <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityTriTop}} />
                 <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityTriRight}} />
                 <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityTriLeft}} />
               </>
             )}
             {state === 'DIAGONAL_ACTIVE' && !randomDirectionsRef.current.diagonal && (
               <>
                 <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityDiagBotLeft}} />
                 <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityDiagTopRight}} />
               </>
             )}
             {state === 'DIAGONAL_ACTIVE' && randomDirectionsRef.current.diagonal && (
               <>
                 <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityDiagBotRight}} />
                 <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityDiagTopLeft}} />
               </>
             )}
             {state === 'INFINITY_ACTIVE' && (
               <>
                 <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityInfLeft}} />
                 <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent blur-2xl transition-opacity duration-300" style={{opacity: opacityInfRight}} />
               </>
             )}
          </div>
        )}
      </div>

      {/* OVERLAYS */}
      <AnimatePresence>
        {state === 'INTRO' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-8">Следи глазами за движущейся точкой.</h2>
            <p className="text-xl text-neutral-500 mb-4">Голову по возможности оставляй неподвижной.</p>
            <p className="text-xl text-neutral-500 mb-12">Дыши комфортно в ритме анимации.</p>
            <button
              onClick={() => {
                initAudio();
                setState('COUNTDOWN_HORIZONTAL');
              }}
              className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors pointer-events-auto"
            >
              Начать
            </button>
          </motion.div>
        )}

        {state.startsWith('COUNTDOWN') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm px-6 text-center"
          >
            {state === 'COUNTDOWN_VERTICAL' && (
              <p className="text-2xl text-neutral-500 mb-8">Теперь направление изменится.<br/>Следи глазами вверх и вниз.</p>
            )}
            {state === 'COUNTDOWN_TRIANGLE' && (
              <p className="text-2xl text-neutral-500 mb-8">Теперь точка будет двигаться по треугольнику.<br/>Каждая сторона — это один вдох или выдох.</p>
            )}
            {state === 'COUNTDOWN_DIAGONAL' && (
              <p className="text-2xl text-neutral-500 mb-8">Теперь точка будет двигаться по диагонали.<br/>Из угла в угол.</p>
            )}
            {state === 'COUNTDOWN_INFINITY' && (
              <p className="text-2xl text-neutral-500 mb-8">Теперь точка будет описывать перевернутую восьмерку.<br/>Следи за ней плавным взглядом.</p>
            )}
            <motion.div
              key={countdown}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-8xl font-light text-neutral-100"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}

        {state.startsWith('PAUSE_') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/95 px-6 text-center"
          >
            <h1 className="text-4xl font-medium tracking-widest text-neutral-500 mb-8">ПАУЗА</h1>
            <p className="text-2xl text-neutral-500 mb-4">Мы сейчас продолжим</p>
            <p className="text-xl text-neutral-500 mb-12">
              Дыши в своем ритме
            </p>
            <div className="text-6xl font-light text-neutral-100">{pauseTimeLeft}</div>
          </motion.div>
        )}

        {state === 'PAUSED' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/95 px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-12">Пауза</h2>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => { audioRef.current.resume(); setState(prevState); }} className="w-full py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200">
                Продолжить
              </button>
              <button onClick={() => setState('CHECKOUT')} className="w-full py-4 bg-transparent text-neutral-500 rounded-full font-medium text-lg border border-neutral-700">
                Завершить
              </button>
            </div>
          </motion.div>
        )}

        {state === 'FINAL_REST' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900/90 backdrop-blur-sm px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-4">Остановись на несколько секунд.</h2>
            <p className="text-xl text-neutral-500">Ничего не нужно делать.</p>
          </motion.div>
        )}

        {state === 'CHECKOUT' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
              <div className="text-5xl font-light text-neutral-100 mt-8">{anxietyAfter}</div>
            </div>

            <button
              onClick={() => setState('COMPLETE')}
              className="w-full max-w-xs py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors shadow-md"
            >
              Далее
            </button>
          </motion.div>
        )}

        {state === 'COMPLETE' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900 text-white px-6 text-center"
          >
            <div className="flex flex-col items-center gap-2 mb-8 bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 w-full max-w-xs">
              <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium">Изменение состояния</p>
              <div className="flex items-center gap-4 text-xl mt-4">
                <span className="text-neutral-500">До: {anxietyBefore}</span>
                <ArrowRight className="w-5 h-5 text-neutral-500" />
                <span className="font-medium">После: {anxietyAfter}</span>
              </div>
              <div className="mt-6 text-4xl font-light">
                {anxietyAfter - anxietyBefore > 0 ? '+' : ''}{anxietyAfter - anxietyBefore}
              </div>
            </div>

            <p className="text-neutral-500 mb-12 px-4 max-w-xs text-center">
              {anxietyAfter < anxietyBefore && 'Заметно улучшение. Отличная работа.'}
              {anxietyAfter === anxietyBefore && 'Иногда состояние меняется не сразу. Это нормально.'}
              {anxietyAfter > anxietyBefore && 'Возможно, практика подняла сложные чувства. Позаботься о себе.'}
            </p>

            <button
              onClick={handleFinish}
              className="w-full max-w-xs py-4 bg-white text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors shadow-md"
            >
              Завершить
            </button>
          </motion.div>
        )}

        {state === 'GROUNDING' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-900 px-6 text-center"
          >
            <h2 className="text-3xl font-light mb-8">Остановись.<br/>Посмотри вокруг.</h2>
            
            <div className="max-w-md w-full mb-12 min-h-[120px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={groundingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl text-neutral-500 leading-relaxed font-light"
                >
                  {groundingStep === 0 && 'Найди глазами 5 предметов вокруг.'}
                  {groundingStep === 1 && 'Почувствуй поверхность под ногами или телом.'}
                  {groundingStep === 2 && 'Найди 3 звука вокруг.'}
                  {groundingStep === 3 && 'Обрати внимание на температуру воздуха.'}
                  {groundingStep === 4 && 'Дыши так, как тебе удобно.'}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              {groundingStep < 4 ? (
                <button
                  onClick={() => setGroundingStep(s => s + 1)}
                  className="w-full py-4 bg-white text-neutral-900 rounded-full font-medium text-lg"
                >
                  Дальше
                </button>
              ) : (
                <button
                  onClick={() => setState('CHECKOUT')}
                  className="w-full py-4 bg-white text-neutral-900 rounded-full font-medium text-lg"
                >
                  Завершить
                </button>
              )}
              <button
                onClick={() => setState('CHECKOUT')}
                className="w-full py-4 bg-transparent border border-neutral-700 text-neutral-500 rounded-full font-medium text-lg mt-4"
              >
                Мне лучше
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      <AnimatePresence>
        {showControls && active && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-6"
          >
            <div className="flex justify-between items-start pointer-events-auto">
              <button 
                onClick={() => { setPrevState(state); setState('PAUSED'); audioRef.current.stopAll(); }}
                className="p-3 bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 backdrop-blur-md rounded-full text-neutral-500 hover:text-white transition-colors"
              >
                <Pause className="w-6 h-6 fill-current" />
              </button>
              <div className="bg-neutral-800/50 border border-neutral-700 backdrop-blur-md px-4 py-2 rounded-full font-mono text-xl tracking-widest text-neutral-500">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex justify-between items-end pointer-events-auto">
              <button 
                onClick={() => { audioRef.current.stopAll(); setState('GROUNDING'); }}
                className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-700/80 backdrop-blur-md rounded-full text-neutral-500 hover:text-white transition-colors text-sm font-medium"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Мне некомфортно</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

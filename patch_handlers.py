import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """  const handleRoundComplete = () => {
    setEngineState('EVALUATION');
    setSessionData(prev => ({ ...prev, completedRounds: (prev.completedRounds || 0) + 1 }));
    audioRef.current.stopAll();
    
    // Update total time
    const roundDuration = Math.floor((Date.now() - roundStartTimeRef.current) / 1000);
    setTotalTime(t => t + roundDuration);
  };

  const startRound = () => {
    setTimeLeft(20);
    setEngineState('ACTIVE_ROUND');
  };"""

replacement = """  const handleRoundComplete = useCallback(() => {
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
  }, [engineState, pauseTimeLeft]);"""

content = content.replace(target, replacement)
with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

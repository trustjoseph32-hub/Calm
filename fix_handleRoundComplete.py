with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

import re

# We will completely replace handleRoundComplete to ensure safety.
target_func = r"const handleRoundComplete = useCallback\(\(\) => \{.*?\}, \[isSOS, roundIndex, totalTime, anxietyBefore, sessionData, addSession, navigate\]\);"

new_func = """const handleRoundComplete = useCallback(() => {
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
  }, [isSOS, roundIndex, totalTime, anxietyBefore, sessionData, addSession, navigate]);"""

content = re.sub(target_func, new_func, content, flags=re.MULTILINE | re.DOTALL)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)
print("Fixed handleRoundComplete")

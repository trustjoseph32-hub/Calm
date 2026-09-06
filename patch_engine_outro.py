with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

import re

# 1. Add SOS_OUTRO to EngineState
content = content.replace("  | 'SOS_PAUSE'", "  | 'SOS_PAUSE'\n  | 'SOS_OUTRO'")

# 2. Modify handleRoundComplete to go to SOS_OUTRO instead of CHECKOUT
old_handle_round = """    if (isSOS) {
      if (roundIndex < 2) {
        setPauseTimeLeft(10);
        setEngineState('SOS_PAUSE');
      } else {
        if (anxietyBefore !== null && anxietyBefore !== undefined) {
          setEngineState('CHECKOUT');
        } else {"""
        
new_handle_round = """    if (isSOS) {
      if (roundIndex < 2) {
        setPauseTimeLeft(10);
        setEngineState('SOS_PAUSE');
      } else {
        setEngineState('SOS_OUTRO');
      }
      return;
    }"""
content = content.replace(old_handle_round, new_handle_round)

# Also handle if anxietyBefore is null. We probably need a button in SOS_OUTRO that proceeds to CHECKOUT or Finishes.

# 3. Add the SOS_OUTRO render block
outro_render = """          {engineState === 'SOS_OUTRO' && (
            <motion.div key="sos_outro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отлично.</h2>
              <div className="text-neutral-400">
                <p>А теперь давайте немного заземлимся.</p>
                <p className="mt-4 text-neutral-200 font-medium">Найдите сейчас 5 предметов, которые видите вокруг себя, и назовите их про себя.</p>
              </div>
              <button 
                onClick={() => {
                  if (anxietyBefore !== null && anxietyBefore !== undefined) {
                    setEngineState('CHECKOUT');
                  } else {
                    const finalDuration = totalTime;
                    addSession({
                      sessionId: Date.now().toString(),
                      date: new Date().toISOString(),
                      endTime: new Date().toISOString(),
                      practiceType: sessionData.practiceType as any,
                      duration: finalDuration,
                      anxietyBefore: sessionData.anxietyBefore,
                      status: 'completed',
                      completedRounds: (sessionData.completedRounds || 0),
                      roundAnswers: sessionData.roundAnswers || [],
                      usedGrounding: sessionData.usedGrounding || false,
                      reducedMotion: sessionData.reducedMotion || false,
                      validForOutcomeStats: false,
                      schemaVersion: 2,
                      isSOS: isSOS,
                      courseDay: sessionData.courseDay
                    });
                    
                    if (courseDay) {
                      updateCourseTodayState('completed');
                      navigate('/course');
                    } else {
                      navigate('/');
                    }
                  }
                }}
                className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
              >
                Готово, я назвал(а)
              </button>
            </motion.div>
          )}"""

content = content.replace("{engineState === 'CHECKOUT' && (", outro_render + "\n\n          {engineState === 'CHECKOUT' && (")

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

print("Outro screen added")

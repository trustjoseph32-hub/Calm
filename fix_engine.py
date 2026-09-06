import re

with open('src/screens/PracticeEngine.tsx', 'r') as f:
    content = f.read()

target = """    const session: PracticeSession = {
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      endTime: new Date().toISOString(),
      practiceType: type,
      duration: durationSeconds - timeLeft,
      anxietyBefore,
      anxietyAfter,
      anxietyDelta: anxietyAfter - anxietyBefore,
      status: 'closed_safely',
      completedRounds: 0,
      roundAnswers: [],
      usedGrounding: false,
      reducedMotion: false,
      validForOutcomeStats: true,
      schemaVersion: 2
    };"""

replacement = """    const session: PracticeSession = {
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      endTime: new Date().toISOString(),
      practiceType: type,
      duration: durationSeconds - timeLeft,
      anxietyBefore,
      anxietyAfter,
      anxietyDelta: anxietyAfter - anxietyBefore,
      status: 'closed_safely',
      completedRounds: 0,
      roundAnswers: [],
      usedGrounding: false,
      reducedMotion: false,
      validForOutcomeStats: true,
      schemaVersion: 2,
      isSOS,
      courseDay
    };"""

content = content.replace(target, replacement)

with open('src/screens/PracticeEngine.tsx', 'w') as f:
    f.write(content)

const fs = require('fs');
let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');

const targetStr = `    const session: PracticeSession = {
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
    };`;

const replacement = `    const session: PracticeSession = {
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
    };`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/screens/PracticeEngine.tsx', code);
console.log("Patched PracticeEngine");

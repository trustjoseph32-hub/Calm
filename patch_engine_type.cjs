const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

const oldState = `  const [sessionData, setSessionData] = useState<Partial<PracticeSession>>({
    practiceType: stateData.type || 'synchronized',
    anxietyBefore: anxietyBefore,
    duration: 0,
    completedRounds: 0,
    roundAnswers: [],
    usedGrounding: false,
    reducedMotion: settings.reducedMotion || settings.syncReducedMotion,
    isSOS,
    courseDay
  });
  
  // Dynamic settings for current session
  const [currentSpeed, setCurrentSpeed] = useState(settings.bilateralSpeed);
  const [onlyBreathing, setOnlyBreathing] = useState(false);`;

const newState = `  const [sessionData, setSessionData] = useState<Partial<PracticeSession>>({
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
  const [onlyBreathing, setOnlyBreathing] = useState(stateData.type === 'breathing');`;

code = code.replace(oldState, newState);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);
console.log("Patched Engine Type");

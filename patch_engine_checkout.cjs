const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

const typeOld = `type EngineState = 
  | 'SOS_INTERCEPT'
  | 'INTRO'
  | 'ACTIVE_ROUND'
  | 'EVALUATION'
  | 'EVAL_EASIER'
  | 'EVAL_SAME'
  | 'GROUNDING'
  | 'SAFE_CLOSING'
  | 'PAUSED';`;

const typeNew = `type EngineState = 
  | 'SOS_INTERCEPT'
  | 'INTRO'
  | 'ACTIVE_ROUND'
  | 'EVALUATION'
  | 'EVAL_EASIER'
  | 'EVAL_SAME'
  | 'GROUNDING'
  | 'SAFE_CLOSING'
  | 'CHECKOUT'
  | 'PAUSED';`;

code = code.replace(typeOld, typeNew);

const varsOld = `  // Dynamic settings for current session
  const [currentSpeed, setCurrentSpeed] = useState(settings.bilateralSpeed);
  const [onlyBreathing, setOnlyBreathing] = useState(false);`;

const varsNew = `  // Dynamic settings for current session
  const [currentSpeed, setCurrentSpeed] = useState(settings.bilateralSpeed);
  const [onlyBreathing, setOnlyBreathing] = useState(false);
  const [anxietyAfter, setAnxietyAfter] = useState(anxietyBefore || 5);`;

code = code.replace(varsOld, varsNew);

const finishOld = `  const finishSession = () => {
    const finalDuration = totalTime + Math.floor((Date.now() - startTimeRef.current) / 1000); // approximate total time
    
    // Ask for final anxiety if not evaluating right now and we had a pre-score
    // Since we don't have a post-score screen built into Engine yet, let's navigate to a checkout or just save it.
    // The requirement says we shouldn't prompt for postScore if they exited safely unless it's a full completion.
    // Wait, the standard checkin is before/after. Let's just save and navigate.
    
    const isFullValid = anxietyBefore !== null && anxietyBefore !== undefined;
    
    addSession({
      sessionId: Date.now().toString(),
      date: new Date().toISOString(),
      endTime: new Date().toISOString(),
      practiceType: sessionData.practiceType as any,
      duration: finalDuration,
      anxietyBefore: sessionData.anxietyBefore,
      status: 'closed_safely',
      completedRounds: sessionData.completedRounds || 0,
      roundAnswers: sessionData.roundAnswers || [],
      usedGrounding: sessionData.usedGrounding || false,
      interruptionReason: sessionData.interruptionReason,
      reducedMotion: sessionData.reducedMotion || false,
      validForOutcomeStats: false, // We need anxietyAfter for this to be true, which we don't collect here in MVP simplification, or we should collect it.
      schemaVersion: 2,
      isSOS,
      courseDay
    });
    
    if (courseDay) {
       updateCourseTodayState({ practiceStatus: 'completed' });
    }
    navigate('/');
  };`;

const finishNew = `  const finishSession = () => {
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
    if (diff < -1) return \`Напряжение снизилось на \${Math.abs(diff)} пункта\`;
    if (diff === -1) return \`Напряжение снизилось на 1 пункт\`;
    if (diff === 0) return \`Состояние почти не изменилось\`;
    if (diff === 1) return \`Напряжение усилилось на 1 пункт\`;
    return \`Напряжение усилилось на \${diff} пункта\`;
  };`;

code = code.replace(finishOld, finishNew);

const uiClosingOld = `          {engineState === 'SAFE_CLOSING' && (
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

          {engineState === 'PAUSED' && (`;

const uiClosingNew = `          {engineState === 'SAFE_CLOSING' && (
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

          {engineState === 'PAUSED' && (`;

code = code.replace(uiClosingOld, uiClosingNew);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);
console.log("Patched Engine Checkout");

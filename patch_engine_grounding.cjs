const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedEngine.tsx', 'utf8');

const groundingOld = `              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setSessionData(prev => ({ ...prev, usedGrounding: true }));
                    if (groundingStep < 3) {
                      setGroundingStep(s => s + 1);
                    } else {
                      if (groundingAfterWorse.current) {
                        groundingAfterWorse.current = false;
                        setEngineState('EVAL_SAME'); // Show post-grounding options
                      } else {
                        setEngineState('EVAL_SAME'); // Allows finishing or choosing breathing
                      }
                    }
                  }} 
                  className="w-full py-4 bg-indigo-600 rounded-full font-medium"
                >
                  Мне уже лучше
                </button>
              </div>`;

const groundingNew = `              <div className="space-y-4">
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
              </div>`;

code = code.replace(groundingOld, groundingNew);

// Also fix the evaluation text to perfectly match the requirements
const evalSameOld = `<p className="text-lg text-neutral-300">Можно попробовать более медленный ритм или перейти к другой практике</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setCurrentSpeed('slow'); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700">Медленнее</button>
                <button onClick={() => { setOnlyBreathing(true); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700">Только дыхание</button>
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700">Grounding</button>
                <button onClick={initiateSafeClosing} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700">Завершить</button>
              </div>`;
              
const evalSameNew = `<p className="text-lg text-neutral-300">Можно попробовать более медленный ритм или перейти к другой практике</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setCurrentSpeed('slow'); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Медленнее</button>
                <button onClick={() => { setOnlyBreathing(true); startRound(); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Только дыхание</button>
                <button onClick={() => { setEngineState('GROUNDING'); setGroundingStep(0); }} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Grounding</button>
                <button onClick={initiateSafeClosing} className="py-4 bg-neutral-800 rounded-2xl border border-neutral-700 hover:bg-neutral-700 transition-colors">Завершить</button>
              </div>`;

code = code.replace(evalSameOld, evalSameNew);

fs.writeFileSync('src/screens/SynchronizedEngine.tsx', code);
console.log("Patched Engine Grounding");

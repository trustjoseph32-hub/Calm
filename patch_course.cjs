const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

// Add AudioPlayer import
if (!code.includes("AudioPlayer")) {
  code = code.replace(
    "import { useAppStore } from '../store/AppProvider';",
    "import { useAppStore } from '../store/AppProvider';\nimport { AudioPlayer } from '../components/AudioPlayer';"
  );
}

const targetOld = `                  ) : (
                    <button
                      onClick={() => handleStartDay(lesson.day)}
                      className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] \${
                        isCompleted 
                          ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
                      }\`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Протокол пройден' : 'Начать по протоколу'}
                    </button>
                  )}`;

const targetNew = `                  ) : lesson.day === 2 ? (
                    <div className="w-full flex flex-col gap-3">
                      <AudioPlayer 
                        src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" 
                        title="Аудио-сессия: Длинный выдох" 
                        onComplete={() => markCourseDayCompleted(2)} 
                      />
                      {isCompleted && (
                         <div className="flex items-center justify-center gap-2 text-sm text-green-400 font-medium bg-green-900/10 py-2.5 rounded-xl border border-green-900/30">
                            <CheckCircle2 className="w-4 h-4" /> Сессия прослушана
                         </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartDay(lesson.day)}
                      className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] \${
                        isCompleted 
                          ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
                      }\`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Протокол пройден' : 'Начать по протоколу'}
                    </button>
                  )}`;

if (code.includes(targetOld)) {
  code = code.replace(targetOld, targetNew);
  fs.writeFileSync('src/screens/Course.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Target not found");
}

const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const useAppStoreRegex = /const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay } = useAppStore\(\);/;
code = code.replace(
  useAppStoreRegex,
  "const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime } = useAppStore();\n\n" +
  "  const isSameDay = (d1: Date, d2: Date) => {\n" +
  "    return d1.getFullYear() === d2.getFullYear() &&\n" +
  "           d1.getMonth() === d2.getMonth() &&\n" +
  "           d1.getDate() === d2.getDate();\n" +
  "  };\n\n" +
  "  const isLockedByTime = (day: number) => {\n" +
  "    if (day !== courseProgress.currentDay || courseProgress.currentDay === 1) return false;\n" +
  "    if (!courseProgress.lastCompletedDate) return false;\n" +
  "    return isSameDay(new Date(), new Date(courseProgress.lastCompletedDate));\n" +
  "  };"
);

const buttonReplaceRegex = /\{\s*isAvailable \? \([\s\S]*?\{isCompleted \? 'Протокол пройден' : 'Начать по протоколу'\}\s*<\/button>\s*<button/;

const newButtons = `{isAvailable ? (
                <div className="flex flex-col sm:flex-row gap-3 mt-4 border-t border-neutral-700/50 pt-4">
                  {isLockedByTime(lesson.day) ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 bg-neutral-800/80 border border-neutral-700/50 rounded-xl text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium text-sm">Откроется завтра</span>
                      </div>
                      <span className="text-xs text-neutral-500 text-center">Дайте нервной системе время на усвоение</span>
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
                  )}
                  <button`;

code = code.replace(buttonReplaceRegex, newButtons);

const headerReplaceRegex = /<p className="text-neutral-500 ml-2">\s*Ежедневные практики по 5–10 минут для формирования навыка саморегуляции.\s*<\/p>\s*<\/header>/;
const newHeader = `<p className="text-neutral-500 ml-2">
          Ежедневные практики по 5–10 минут для формирования навыка саморегуляции.
        </p>
        
        {/* DEV ONLY: Skip time button */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={skipWaitTime}
            className="mt-4 self-start text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-md hover:bg-neutral-700"
          >
            [Test] Пропустить 24 часа
          </button>
        )}
      </header>`;

code = code.replace(headerReplaceRegex, newHeader);

fs.writeFileSync('src/screens/Course.tsx', code);

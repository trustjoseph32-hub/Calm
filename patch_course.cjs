const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

// Update imports if needed (we already have CheckCircle2)
// Add toggleCourseFocusDay to useAppStore destructing
code = code.replace(
  'const { courseProgress, markCourseDayCompleted } = useAppStore();',
  'const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay } = useAppStore();'
);

// Update render logic inside map
code = code.replace(
  'const isCompleted = courseProgress.completedDays.includes(lesson.day);',
  `const isCompleted = courseProgress.completedDays.includes(lesson.day);
          const isFocusCompleted = courseProgress.completedFocusDays?.includes(lesson.day);`
);

// Replace button section
const oldButtonSection = `{isAvailable ? (
                <button
                  onClick={() => handleStartDay(lesson.day)}
                  className={\`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-transform active:scale-[0.98] \${
                    isCompleted 
                      ? 'bg-neutral-700 text-neutral-500 hover:bg-neutral-700' 
                      : 'bg-white text-neutral-900 hover:bg-neutral-200'
                  }\`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isCompleted ? 'Пройдено (повторить)' : 'Начать'}
                </button>
              ) : (`;

const newButtonSection = `{isAvailable ? (
                <div className="flex flex-col sm:flex-row gap-3 mt-4 border-t border-neutral-700/50 pt-4">
                  <button
                    onClick={() => handleStartDay(lesson.day)}
                    className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] \${
                      isCompleted 
                        ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                        : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
                    }\`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    {isCompleted ? 'Сессия пройдена' : 'Начать сессию'}
                  </button>
                  <button
                    onClick={() => toggleCourseFocusDay(lesson.day)}
                    className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] border \${
                      isFocusCompleted 
                        ? 'bg-green-900/20 text-green-400 border-green-900/50 hover:bg-green-900/30' 
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                    }\`}
                  >
                    <CheckCircle2 className={\`w-4 h-4 \${isFocusCompleted ? 'text-green-400' : 'text-neutral-500'}\`} />
                    {isFocusCompleted ? 'Фокус выполнен' : 'Отметить фокус'}
                  </button>
                </div>
              ) : (`;

code = code.replace(oldButtonSection, newButtonSection);

fs.writeFileSync('src/screens/Course.tsx', code);

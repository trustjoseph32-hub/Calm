const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const targetStr = `              {/* Day completion */}
              <div className="pt-4">`;

const replacement = `              {todayLesson.focus && (
                <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                  <h3 className="font-medium text-neutral-200 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    Фокус дня
                  </h3>
                  <div className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                    {todayLesson.focus}
                  </div>
                </div>
              )}

              {todayLesson.explanation && (
                <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                  <h3 className="font-medium text-neutral-200 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" />
                    Для чего это нужно:
                  </h3>
                  <div className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                    {todayLesson.explanation}
                  </div>
                </div>
              )}

              {/* Day completion */}
              <div className="pt-4">`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course Today");

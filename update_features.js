import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

// Update features array
const oldFeaturesArray = `  const features = viewingDay === 1 ? [{icon: Clock, label: "≈ 2-3 минуты"}, {icon: Volume2, label: "Аудио-поддержка"}, {icon: Info, label: "Подходит для любого момента дня"}] :
                   viewingDay === 2 ? [{icon: Clock, label: "≈ 5 минут"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Никакого специального оборудования"}] :
                   viewingDay === 3 ? [{icon: Clock, label: "≈ 4 минуты"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Простой и безопасный метод"}] :
                   [{icon: Clock, label: lesson.duration || "≈ 5 минут"}, {icon: Info, label: "Самостоятельная практика"}];`;

const newFeaturesArray = `  const features = viewingDay === 1 ? [{icon: Clock, label: "≈ 3 минуты"}] :
                   viewingDay === 2 ? [{icon: Clock, label: "≈ 5 минут"}, {icon: Volume2, label: "Аудио-практика"}] :
                   viewingDay === 3 ? [{icon: Clock, label: "≈ 4 минуты"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Простой и безопасный метод"}] :
                   [{icon: Clock, label: lesson.duration || "≈ 5 минут"}, {icon: Info, label: "Самостоятельная практика"}];`;

content = content.replace(oldFeaturesArray, newFeaturesArray);

// Update render block
const oldRender = `{/* Mobile-only features */}
            {viewingDay !== 1 && (
              <div className="flex flex-col gap-3 mb-8 md:hidden">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
                    <f.icon className="w-4 h-4 text-[#38bdf8]/70" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            )}`;

const newRender = `{/* Mobile-only features */}
            <div className="flex flex-col gap-3 mb-8 md:hidden">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
                  <f.icon className="w-4 h-4 text-[#38bdf8]/70" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('src/screens/Course.tsx', content);

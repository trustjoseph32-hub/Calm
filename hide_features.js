import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

const oldFeaturesRender = `{/* Mobile-only features */}
            <div className="flex flex-col gap-3 mb-8 md:hidden">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
                  <f.icon className="w-4 h-4 text-[#38bdf8]/70" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>`;

const newFeaturesRender = `{/* Mobile-only features */}
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

content = content.replace(oldFeaturesRender, newFeaturesRender);

// Let's also adjust mb-8 to mb-6 md:hidden maybe? No, if we just hide it for Day 1, it's fine.

fs.writeFileSync('src/screens/Course.tsx', content);

const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

// 1. Add Moon icon
code = code.replace(
  'import { ArrowLeft, Play',
  'import { ArrowLeft, Play, Moon'
);

// 2. Replace Day 1
const day1Regex = /\{\s*day:\s*1,[\s\S]*?explanation:\s*'.*?'\s*\}/;
const newDay1 = `{
    day: 1,
    title: 'Стартовая точка.',
    duration: '5 мин',
    content: '1. Честно оцените свое состояние по 4 базовым критериям (Тревожность, Физическое напряжение, Эмоциональный фон, Мысли), чтобы мы могли отслеживать прогресс. Для этого нажмите кнопку Оценка состояния.\\n\\n2. Пройдите пробную сессию для того чтобы понять принцип работы этого упражнения. Все подсказки будут на экране во время упражнения.\\nЧтобы начать упражнение нажмите кнопку Сессия\\n\\n3. Оцените свое состояние в конце дня по 4 базовым критериям. Для этого нажмите кнопку Вечерний итог.',
    actions: [
      { id: 'checkin', label: 'Оценка состояния', icon: 'Activity', type: 'checkin' },
      { id: 'session', label: 'Сессия', icon: 'Play', type: 'practice' },
      { id: 'evening_checkin', label: 'Вечерний итог', icon: 'Moon', type: 'checkin_evening' }
    ]
  }`;

code = code.replace(day1Regex, newDay1);

// 3. Update Text Rendering
const textRenderingOld = `<div className="text-sm text-neutral-400 mb-6 space-y-6">
                <div className="space-y-2">
                  <div className="font-medium text-neutral-200">Сессия по протоколу:</div>
                  <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                    {lesson.session}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-neutral-200">Фокус дня:</div>
                  <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                    {lesson.focus}
                  </div>
                </div>
                
                {lesson.explanation && (
                  <div className="mt-4 pt-4 border-t border-neutral-700/50">
                    <p className="text-neutral-500 italic text-sm leading-relaxed">
                      <span className="font-medium text-neutral-400 not-italic">Для чего это нужно:</span> {lesson.explanation}
                    </p>
                  </div>
                )}
              </div>`;

const textRenderingNew = `              <div className="text-sm text-neutral-400 mb-6">
                {lesson.content ? (
                  <div className="whitespace-pre-wrap text-neutral-400 leading-relaxed text-base">
                    {lesson.content}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="font-medium text-neutral-200">Сессия по протоколу:</div>
                      <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                        {lesson.session}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-neutral-200">Фокус дня:</div>
                      <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                        {lesson.focus}
                      </div>
                    </div>
                    
                    {lesson.explanation && (
                      <div className="mt-4 pt-4 border-t border-neutral-700/50">
                        <p className="text-neutral-500 italic text-sm leading-relaxed">
                          <span className="font-medium text-neutral-400 not-italic">Для чего это нужно:</span> {lesson.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>`;

code = code.replace(textRenderingOld, textRenderingNew);

// 4. Create Icon map for dynamic actions
const actionIconsRender = `
                  const renderActionIcon = (iconName: string, isCompleted: boolean) => {
                    const iconClasses = "w-4 h-4 fill-current";
                    if (isCompleted) return <CheckCircle2 className={iconClasses} />;
                    switch (iconName) {
                      case 'Activity': return <Activity className={iconClasses} />;
                      case 'Play': return <Play className={iconClasses} />;
                      case 'Moon': return <Moon className={iconClasses} />;
                      default: return <CheckCircle2 className={iconClasses} />;
                    }
                  };
`;

// Find where to insert action logic
// Inside `isAvailable ? (`
const buttonBlockStart = `{isAvailable ? (
                <div className={\`flex flex-col gap-3 mt-4 border-t border-neutral-700/50 pt-4 \${lesson.day === 2 ? '' : 'sm:flex-row'}\`}>`;

const buttonBlockNew = `{isAvailable ? (
                <div className={\`flex flex-col gap-3 mt-4 border-t border-neutral-700/50 pt-4 \${lesson.day === 2 || lesson.actions ? 'sm:flex-col' : 'sm:flex-row'}\`}>
                  {isLockedByTime(lesson.day) ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 bg-neutral-800/80 border border-neutral-700/50 rounded-xl text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium text-sm">Откроется завтра</span>
                      </div>
                      <span className="text-xs text-neutral-500 text-center">Дайте нервной системе время на усвоение</span>
                    </div>
                  ) : lesson.actions ? (
                    <>
                      {lesson.actions.map((act, idx) => {
                         // Very naive completion tracking for actions:
                         // We can consider checking complete if isCompleted is true,
                         // but ideally each action tracks itself. For MVP, if it's checkin or evening_checkin,
                         // we can just allow them to press it anytime. If it's a practice, we start practice.
                         const IconComp = act.icon === 'Play' ? Play : act.icon === 'Moon' ? Moon : Activity;
                         return (
                           <button
                             key={act.id}
                             onClick={() => {
                               if (act.type === 'checkin' || act.type === 'checkin_evening') {
                                 navigate('/checkin');
                               } else {
                                 handleStartDay(lesson.day);
                               }
                             }}
                             className={\`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-sm transition-all border active:scale-[0.98] \${
                               isCompleted 
                                 ? 'bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-300 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]' 
                                 : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]'
                             }\`}
                           >
                             <IconComp className="w-5 h-5 drop-shadow-md" />
                             {act.label}
                           </button>
                         )
                      })}
                    </>
                  ) : lesson.day === 2 ? (`;

const replaceTarget = `{isAvailable ? (
                <div className={\`flex flex-col gap-3 mt-4 border-t border-neutral-700/50 pt-4 \${lesson.day === 2 ? '' : 'sm:flex-row'}\`}>
                  {isLockedByTime(lesson.day) ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 bg-neutral-800/80 border border-neutral-700/50 rounded-xl text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span className="font-medium text-sm">Откроется завтра</span>
                      </div>
                      <span className="text-xs text-neutral-500 text-center">Дайте нервной системе время на усвоение</span>
                    </div>
                  ) : lesson.day === 2 ? (`

code = code.replace(replaceTarget, buttonBlockNew);

// Remove the old Day 1 check logic from the else block since it's now handled by `lesson.actions`
const oldDay1Check = `) : lesson.day === 1 ? (
                    <button
                      onClick={() => navigate('/checkin')}
                      className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all border active:scale-[0.98] \${
                        isCompleted 
                          ? 'bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-300 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]' 
                          : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]'
                      }\`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Activity className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Состояние записано' : 'Оценить состояние'}
                    </button>
                  ) : (`;

const newDay1Check = `) : (`;
code = code.replace(oldDay1Check, newDay1Check);

fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course.tsx with new actions model");

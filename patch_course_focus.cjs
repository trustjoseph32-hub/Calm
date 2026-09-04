const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

// 1. Add focus and explanation to Day 1
const day1Regex = /\{\s*day:\s*1,[\s\S]*?actions:\s*\[[\s\S]*?\]\s*\}/;
const newDay1 = `{
    day: 1,
    title: 'Стартовая точка.',
    duration: '5 мин',
    content: '1. Честно оцените свое состояние по 4 базовым критериям (Тревожность, Физическое напряжение, Эмоциональный фон, Мысли), чтобы мы могли отслеживать прогресс. Для этого нажмите кнопку Оценка состояния.\\n\\n2. Пройдите пробную сессию для того чтобы понять принцип работы этого упражнения. Все подсказки будут на экране во время упражнения.\\nЧтобы начать упражнение нажмите кнопку Сессия\\n\\n3. Оцените свое состояние в конце дня по 4 базовым критериям. Для этого нажмите кнопку Вечерний итог.',
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',
    actions: [
      { id: 'checkin', label: 'Оценка состояния', icon: 'Activity', type: 'checkin' },
      { id: 'session', label: 'Сессия', icon: 'Play', type: 'practice' },
      { id: 'evening_checkin', label: 'Вечерний итог', icon: 'Moon', type: 'checkin_evening' }
    ]
  }`;
code = code.replace(day1Regex, newDay1);

// 2. Update render logic to show focus and explanation regardless of content vs session
const oldRenderLogic = `              <div className="text-sm text-neutral-400 mb-6">
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

const newRenderLogic = `              <div className="text-sm text-neutral-400 mb-6 space-y-6">
                {lesson.content ? (
                  <div className="whitespace-pre-wrap text-neutral-400 leading-relaxed text-base">
                    {lesson.content}
                  </div>
                ) : lesson.session ? (
                  <div className="space-y-2">
                    <div className="font-medium text-neutral-200">Сессия по протоколу:</div>
                    <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed">
                      {lesson.session}
                    </div>
                  </div>
                ) : null}
                
                {lesson.focus && (
                  <div className="space-y-2">
                    <div className="font-medium text-neutral-200">Фокус дня:</div>
                    <div className="whitespace-pre-wrap pl-3 border-l-2 border-neutral-700/60 text-neutral-400 leading-relaxed text-base">
                      {lesson.focus}
                    </div>
                  </div>
                )}
                
                {lesson.explanation && (
                  <div className="mt-4 pt-4 border-t border-neutral-700/50">
                    <p className="text-neutral-500 italic text-sm leading-relaxed text-base">
                      <span className="font-medium text-neutral-400 not-italic">Для чего это нужно:</span> {lesson.explanation}
                    </p>
                  </div>
                )}
              </div>`;
code = code.replace(oldRenderLogic, newRenderLogic);

fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course.tsx to include focus and explanation in all modes");

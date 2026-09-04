const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const targetOld = `    title: 'Заметить состояние', 
    duration: '3 мин', 
    session: '1. Наблюдайте за движущимся шариком, позволяя мыслям приходить и уходить.\\n2. Раз в минуту делайте "двойной вдох" (два коротких вдоха носом) и один длинный выдох ртом.\\n3. В остальное время дышите в своем естественном ритме.', 
    focus: 'Три раза за сегодняшний день мысленно спросите себя:\\n\\n• «На сколько баллов от 0 до 10 я сейчас напряжен?»\\n• Просто назовите цифру.\\n• Не пытайтесь ничего изменить или расслабиться.', 
    explanation: 'Сессия дает мозгу передышку (двойной вдох сбрасывает CO2), а шкала тревоги учит не убегать от страха, а легализовать его.'`;

const targetNew = `    title: 'Замечаем и описываем состояние', 
    duration: '1 мин', 
    session: 'Стартовая точка.\\n\\nЧестно оцените свое состояние по 4 базовым критериям (Тревожность, Физическое напряжение, Эмоциональный фон, Мысли), чтобы мы могли отслеживать прогресс.\\n\\nРекомендуем заполнять этот чек-ин один раз в день — вечером, чтобы подвести итоги.', 
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.', 
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.'`;

if (code.includes(targetOld)) {
  code = code.replace(targetOld, targetNew);
  console.log("Replaced day 1 content");
} else {
  console.log("Could not find day 1 content");
}

// Modify the button action for Day 1
// We need navigate
if (!code.includes("const navigate = useNavigate();")) {
  console.log("Adding navigate");
}

const buttonTargetOld = `                  ) : lesson.day === 2 ? (
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

const buttonTargetNew = `                  ) : lesson.day === 2 ? (
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
                  ) : lesson.day === 1 ? (
                    <button
                      onClick={() => navigate('/checkin')}
                      className={\`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] \${
                        isCompleted 
                          ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
                      }\`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Activity className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Состояние записано' : 'Оценить состояние'}
                    </button>
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

if (code.includes(buttonTargetOld)) {
  code = code.replace(buttonTargetOld, buttonTargetNew);
  console.log("Replaced day 1 button logic");
} else {
  console.log("Could not find button block");
}

fs.writeFileSync('src/screens/Course.tsx', code);

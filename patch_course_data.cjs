const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const courseDataRegex = /const courseData: CourseLesson\[\] = \[[\s\S]*?\];/;

const newCourseData = `const courseData: CourseLesson[] = [
  { 
    day: 1,
    focusTitle: "Управление практикой",
    focusIcon: "Eye", 
    title: 'Знакомство с Calm Motion', 
    duration: '2 мин', 
    session: '1. Научитесь управлять практикой: ставить на паузу, безопасно завершать.\n2. Попробуйте нажать кнопку «Мне некомфортно», чтобы увидеть, как приложение предложит заземление (grounding).\n3. Если движение глаз вызывает дискомфорт, включите «Только дыхание».\n4. Практика включает один очень короткий раунд ритмического движения (не более 20 секунд).', 
    focus: 'Безопасное завершение:\\n\\n• Любая практика в приложении завершается этапом стабилизации.\\n• Это помогает вернуться в момент «здесь и сейчас».\\n• Не пропускайте этот шаг, даже если вам комфортно.', 
    explanation: 'Оценка помогает заметить изменения в состоянии и понять, какие практики подходят вам лучше. Мы учимся управлять инструментами, прежде чем переходить к более длительным сессиям.' 
  },
  { 
    day: 2,
    focusTitle: "Опора и ресурс",
    focusIcon: "Footprints", 
    title: 'Стабилизация', 
    duration: '3 мин', 
    session: '1. Сегодняшняя сессия направлена только на мягкое дыхание и поиск физической опоры.\n2. Дышите плавно, в комфортном ритме. Если заданный ритм не подходит — дышите в своем.\n3. В этой сессии нет движения глаз. Сосредоточьтесь на телесном комфорте.', 
    focus: 'Безопасное место (по желанию):\\n\\n• Представьте место, где вам спокойно и безопасно.\\n• Это может быть реальное место из прошлого или воображаемое.\\n• Сфокусируйтесь на том, какие цвета там преобладают, какие звуки вы могли бы там слышать.', 
    explanation: 'Сначала важно выстроить ощущение безопасности и опоры. Ритмическое дыхание и визуализация помогают снизить базовый уровень напряжения.' 
  },
  { 
    day: 3,
    focusTitle: "Ритмическое движение",
    focusIcon: "Activity", 
    title: 'Добавление движения', 
    duration: '3 мин', 
    session: '1. Сегодня мы подключаем короткие раунды горизонтального движения.\n2. Следите за шариком только в комфортной амплитуде. Не напрягайте глаза.\n3. После каждого раунда отмечайте, как изменилось ваше состояние.\n4. Если становится тяжелее, приложение предложит grounding.', 
    focus: 'Связь тела и внимания:\\n\\n• Обратите внимание, как ритмичное движение помогает переключать фокус с мыслей на происходящее на экране.\\n• Помните, что вы можете остановить движение в любой момент.', 
    explanation: 'Ритмическое движение может помогать переключать внимание и снижать субъективное напряжение у некоторых людей.' 
  },
  { 
    day: 4,
    focusTitle: "Сенсорная опора",
    focusIcon: "Ear", 
    title: 'Звук и дыхание', 
    duration: '4 мин', 
    session: '1. Выполните практику с фокусом на звуковое сопровождение.\n2. Если у вас есть наушники, вы можете включить билатеральный звук для дополнительного ритма.\n3. Дышите плавно, позволяя мыслям просто приходить и уходить.', 
    focus: 'Правило 5-4-3-2-1:\\n\\n• Если вы почувствовали отрыв от реальности, назовите:\\n5 вещей, которые видите\\n4 ощущения в теле\\n3 звука вокруг\\n2 запаха\\n1 вещь, которую можно попробовать на вкус.', 
    explanation: 'Протяжный выдох помогает направить внимание на телесную релаксацию. Некоторым людям это помогает снизить возбуждение и вернуть ощущение опоры.' 
  },
  { 
    day: 5,
    focusTitle: "Наблюдение за собой",
    focusIcon: "Heart", 
    title: 'Синхронизация', 
    duration: '4 мин', 
    session: '1. Выполните несколько раундов синхронной практики.\n2. Фокусируйтесь на том, как меняется ваше дыхание во время движения.\n3. Отвечайте на вопросы после каждого раунда честно.', 
    focus: 'Заземление через стопы:\\n\\n• Сидя или стоя, обратите внимание на то, как ваши стопы касаются пола.\\n• Почувствуйте текстуру поверхности.\\n• Ощутите, как пол надежно поддерживает ваш вес.', 
    explanation: 'Регулярная практика помогает нервной системе привыкать к безопасным способам переключения внимания в моменты дискомфорта.' 
  },
  { 
    day: 6,
    focusTitle: "Сброс напряжения",
    focusIcon: "Wind", 
    title: 'Дыхание и расслабление', 
    duration: '5 мин', 
    session: '1. Во время сессии обращайте внимание на мышечные зажимы.\n2. На каждом выдохе старайтесь расслабить плечи и челюсть.\n3. Если чувствуете напряжение — используйте паузы между раундами для мягкого растяжения.', 
    focus: 'Сканирование тела:\\n\\n• Пройдите вниманием от макушки до пальцев ног.\\n• Просто отмечайте напряженные участки, не пытаясь их немедленно расслабить.\\n• Признание напряжения — первый шаг к его отпусканию.', 
    explanation: 'Снятие физического напряжения отправляет в мозг сигнал о том, что непосредственной опасности сейчас нет.' 
  },
  { 
    day: 7,
    focusTitle: "Интеграция",
    focusIcon: "Sun", 
    title: 'Закрепление навыков', 
    duration: '5 мин', 
    session: '1. Сегодняшняя практика закрепляет все, что вы узнали за неделю.\n2. Используйте те настройки скорости и звука, которые оказались для вас наиболее комфортными.\n3. Помните: вы всегда можете включить "Только дыхание".', 
    focus: 'Ваш набор саморегуляции:\\n\\n• Вспомните, что помогало вам на этой неделе больше всего.\\n• Дыхание? Заземление? Ритмичное движение?\\n• Знание своих эффективных инструментов придает уверенности.', 
    explanation: 'Регулярная оценка состояния и использование подходящих именно вам практик — ключ к стабильной саморегуляции.' 
  }
];`;

code = code.replace(courseDataRegex, newCourseData);

// Fix Course day advancement logic
const markCompletedOld = `    // After evening check-in
    // Now let's try to simulate checking if the day is fully done.
    // Wait, the original logic had markCourseDayCompleted to advance. Let's do that for now.`;
const markCompletedNew = `    // After evening check-in
    // We update the state to evening checkin completed
    updateCourseTodayState({ eveningCheckinCompleted: true });`;
code = code.replace(markCompletedOld, markCompletedNew);

// Add "Завершить день" button logic if they did the evening checkin
// Also handle the user returning to course page and clicking day completion
const renderTodayOld = `          <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Star className="w-8 h-8 text-neutral-700 opacity-30" />
            </div>
            
            <span className="text-sm font-medium text-indigo-400 mb-2 block">Сегодня</span>
            <h2 className="text-2xl font-medium text-neutral-100 mb-6">{todayLesson.title}</h2>
            
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    <ActivitySquare className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h3 className="font-medium text-neutral-200">1. Оценка состояния</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11">Зафиксируйте свое состояние перед практикой.</p>
                <button 
                  onClick={() => navigate('/checkin')}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl transition-colors border border-neutral-700 ml-11"
                >
                  Оценка состояния
                </button>
              </div>

              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Play className="w-4 h-4 text-indigo-400 ml-0.5" />
                  </div>
                  <h3 className="font-medium text-neutral-200">2. Практика</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11 line-clamp-2">{todayLesson.session}</p>
                <button 
                  onClick={handleStartSession}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium rounded-xl transition-transform active:scale-[0.98] shadow-md ml-11"
                >
                  Сессия
                </button>
              </div>

              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    <Moon className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h3 className="font-medium text-neutral-200">3. Вечерний итог</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11">Оцените состояние вечером для фиксации прогресса.</p>
                <button 
                  onClick={() => navigate('/checkin')}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl transition-colors border border-neutral-700 ml-11"
                >
                  Вечерний итог
                </button>
              </div>
            </div>
          </div>`;

const renderTodayNew = `          <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Star className="w-8 h-8 text-neutral-700 opacity-30" />
            </div>
            
            <span className="text-sm font-medium text-indigo-400 mb-2 block">Сегодня</span>
            <h2 className="text-2xl font-medium text-neutral-100 mb-6">{todayLesson.title}</h2>
            
            {courseProgress.todayState?.practiceStatus === 'completed' && (
              <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-900/30 rounded-2xl flex items-start gap-3">
                 <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                 <div>
                    <p className="text-sm text-emerald-200 font-medium">Практика завершена</p>
                    <p className="text-xs text-emerald-300/70 mt-1">Отличная работа! Не забудьте подвести вечерний итог.</p>
                 </div>
              </div>
            )}
            
            {courseProgress.todayState?.practiceStatus === 'stopped' && (
              <div className="mb-6 p-4 bg-neutral-900/50 border border-neutral-700 rounded-2xl flex items-start gap-3">
                 <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                 <div>
                    <p className="text-sm text-neutral-200 font-medium">Основная сессия остановлена</p>
                    <p className="text-xs text-neutral-400 mt-1">Можно вернуться к ней позже или завершить день без неё.</p>
                 </div>
              </div>
            )}

            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    <ActivitySquare className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h3 className="font-medium text-neutral-200">1. Оценка состояния</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11">Зафиксируйте свое состояние перед практикой.</p>
                <button 
                  onClick={() => navigate('/checkin')}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl transition-colors border border-neutral-700 ml-11"
                >
                  Оценка состояния
                </button>
              </div>

              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50 opacity-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Play className="w-4 h-4 text-indigo-400 ml-0.5" />
                  </div>
                  <h3 className="font-medium text-neutral-200">2. Практика</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11 line-clamp-3 whitespace-pre-line">{todayLesson.session}</p>
                <button 
                  onClick={handleStartSession}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-medium rounded-xl transition-transform active:scale-[0.98] shadow-md ml-11 mb-2"
                >
                  {courseProgress.todayState?.practiceStatus === 'completed' ? 'Пройти еще раз' : 'Сессия'}
                </button>
              </div>

              <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                    <Moon className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h3 className="font-medium text-neutral-200">3. Вечерний итог</h3>
                </div>
                <p className="text-sm text-neutral-400 mb-4 pl-11">Оцените состояние вечером для фиксации прогресса.</p>
                <button 
                  onClick={() => {
                    navigate('/checkin');
                    updateCourseTodayState({ eveningCheckinCompleted: true });
                  }}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl transition-colors border border-neutral-700 ml-11"
                >
                  Вечерний итог
                </button>
              </div>
              
              {/* Day completion */}
              <div className="pt-4">
                 <button 
                    onClick={() => {
                      markCourseDayCompleted(courseProgress.currentDay);
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-colors shadow-lg"
                 >
                    Завершить день
                 </button>
              </div>
            </div>
          </div>`;

code = code.replace(renderTodayOld, renderTodayNew);
fs.writeFileSync('src/screens/Course.tsx', code);
console.log("Patched Course.tsx");

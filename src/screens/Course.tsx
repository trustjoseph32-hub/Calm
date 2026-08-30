import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, Lock } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

const courseData = [
  { 
    day: 1, 
    title: 'Заметить состояние', 
    duration: '3 мин', 
    session: '1. Наблюдайте за движущимся шариком, позволяя мыслям приходить и уходить.\n2. Раз в минуту делайте "двойной вдох" (два коротких вдоха носом) и один длинный выдох ртом.\n3. В остальное время дышите в своем естественном ритме.', 
    focus: 'Три раза за сегодняшний день мысленно спросите себя:\n\n• «На сколько баллов от 0 до 10 я сейчас напряжен?»\n• Просто назовите цифру.\n• Не пытайтесь ничего изменить или расслабиться.', 
    explanation: 'Сессия дает мозгу передышку (двойной вдох сбрасывает CO2), а шкала тревоги учит не убегать от страха, а легализовать его.' 
  },
  { 
    day: 2, 
    title: 'Длинный выдох', 
    duration: '5 мин', 
    session: '1. Дышите строго синхронно с анимацией круга.\n2. Делайте вдох на расширение и удлиненный выдох на сужение.\n3. Глазами непрерывно следите за движением шарика по экрану.', 
    focus: 'Практика "Гудение" (вибрация в горле):\n\n• Оказавшись в уединении, сделайте глубокий вдох.\n• На выдохе издавайте низкий звук «Мммм».\n• Почувствуйте вибрацию в груди и горле.\n• Повторите 5 раз.', 
    explanation: 'Сессия включает парасимпатическую систему торможения, а вибрация голосовых связок напрямую массирует блуждающий нерв, посылая мозгу сигнал безопасности.' 
  },
  { 
    day: 3, 
    title: 'Заземление', 
    duration: '3 мин', 
    session: '1. Расслабьте плечи и челюсть.\n2. Следите взглядом за диагональным движением шарика.\n3. Дышите спокойно, не пытаясь контролировать ритм.', 
    focus: 'Правило "3х3". Один раз за день, когда почувствуете суету, остановитесь и сделайте следующее:\n\n1. Назовите 3 вещи, которые вы сейчас видите.\n2. Назовите 3 звука, которые слышите.\n3. Пошевелите 3 частями тела (пальцами ног, плечами, шеей).', 
    explanation: 'Движение глаз перерабатывает эмоции, а правило 3х3 экстренно возвращает вас из пугающего будущего в безопасное настоящее.' 
  },
  { 
    day: 4, 
    title: 'Мышечное освобождение', 
    duration: '4 мин', 
    session: '1. Следите за шариком, который двигается по плавной траектории "Восьмерка".\n2. Дышите свободно.\n3. Каждые 30 секунд добавляйте "физиологический вздох": два резких вдоха носом и расслабляющий выдох ртом.', 
    focus: 'Массаж ушей для активации блуждающего нерва:\n\n• Большим и указательным пальцами мягко разомните ушные раковины.\n• Уделите особое внимание впадинке в самом центре уха.\n• Делайте это 1-2 минуты.', 
    explanation: 'Восьмерка и двойной вдох сбрасывают излишки углекислого газа, снижая панику, а массаж ушной раковины механически активирует ветвь блуждающего нерва.' 
  },
  { 
    day: 5, 
    title: 'Расцепление с мыслью', 
    duration: '5 мин', 
    session: '1. Запустите горизонтальное слежение.\n2. Вспомните тревожащую мысль и мысленно «положите» её на шарик.\n3. Наблюдайте, как мысль катается влево-вправо, теряя свой эмоциональный заряд.', 
    focus: 'Якорь «У меня есть мысль». Смените формулировки в голове:\n\n• Вместо: «Я провалю этот проект»\n• Скажите вслух: «У меня появилась мысль, что я провалю проект».\n• Заметьте, как снижается градус тревоги.', 
    explanation: 'Сессия снижает заряд конкретной мысли, а якорь учит видеть в мыслях просто текст, а не реальную угрозу.' 
  },
  { 
    day: 6, 
    title: 'Опора на землю', 
    duration: '4 мин', 
    session: '1. Дышите синхронно с кругом ("Квадратное дыхание": вдох, задержка, выдох, задержка).\n2. Одновременно следите за движущимся объектом.\n3. Старайтесь не отрывать взгляд.', 
    focus: 'Упражнение Розенберга:\n\n1. Сцепите руки на затылке.\n2. Не поворачивая головы, скосите глаза максимально вправо до легкого натяжения.\n3. Держите взгляд так, пока не сглотнете или не зевнете.\n4. Повторите то же самое влево.', 
    explanation: 'Квадратное дыхание выравнивает пульс, а глазодвигательное упражнение со сцепленными руками физиологически высвобождает блуждающий нерв у основания черепа.' 
  },
  { 
    day: 7, 
    title: 'Остановка катастрофизации', 
    duration: '5 мин', 
    session: '1. Начните практику с трех двойных вдохов носом и глубоких выдохов ртом.\n2. Затем перейдите на обычное спокойное дыхание.\n3. Непрерывно следите за шариком.', 
    focus: 'Практика "Стоп-слово":\n\n• Заметив, что вы разгоняете негативный сценарий будущего в голове, скажите себе четкое «СТОП» (можно вслух).\n• Сразу после этого переведите взгляд на любой яркий предмет в комнате и рассмотрите его детали.', 
    explanation: 'Двойные вдохи быстро расправляют альвеолы легких, успокаивая нервную систему, а «Стоп-слово» прерывает токсичный внутренний диалог.' 
  },
  { 
    day: 8, 
    title: 'Сенсорный якорь', 
    duration: '5 мин', 
    session: '1. Запустите траекторию "Бесконечность".\n2. Сфокусируйтесь на том, чтобы каждый выдох был немного длиннее вдоха.\n3. Позвольте глазам плавно скользить за объектом.', 
    focus: 'Рефлекс ныряльщика:\n\n• Когда почувствуете резкий скачок напряжения или панику, плесните в лицо ледяной водой.\n• Альтернатива: приложите холодное мокрое полотенце к щекам и глазам на 30 секунд.', 
    explanation: 'Холод на лице активирует «рефлекс ныряльщика», мгновенно замедляя пульс через блуждающий нерв в моменты острых скачков тревоги.' 
  },
  { 
    day: 9, 
    title: 'Точка покоя', 
    duration: '3 мин', 
    session: '1. Это быстрая сессия для сбивания острой паники.\n2. Следите за очень быстрым движением шарика по горизонтали.\n3. Дыхание свободное, моргайте по мере необходимости.', 
    focus: 'Стимуляция гортани:\n\n• Во время вечерней чистки зубов наберите воду в рот.\n• Активно пополощите горло в течение минуты.\n• В идеале — чтобы это спровоцировало легкое слезотечение.', 
    explanation: 'Быстрое движение глаз сбивает острый стресс, а активное полоскание стимулирует мышцы гортани, которые напрямую иннервируются блуждающим нервом.' 
  },
  { 
    day: 10, 
    title: 'Сборка протокола', 
    duration: '5 мин', 
    session: '1. Практика жестко синхронизирована с ритмом.\n2. Дышите строго вместе с кругом (вдох на расширение, выдох на сужение).\n3. Глаза не отрываются от шарика.', 
    focus: 'Личная SOS-аптечка:\n\n1. Откройте заметки в телефоне.\n2. Запишите 2 действия, которые сработали для вас лучше всего за эти дни (например: "1. Ледяная вода. 2. Упражнение Розенберга").\n3. Держите этот список под рукой.', 
    explanation: 'Сессия закрепляет навык синхронизации, а личная аптечка дает четкий план действий — мозг успокаивается, когда знает, что делать при панике.' 
  },
  { 
    day: 11, 
    title: 'Расширение контейнера', 
    duration: '6 мин', 
    session: '1. Длительная сессия тренировки выносливости внимания.\n2. Следите за шариком на протяжении всего времени.\n3. Каждый раз, когда ловите себя на том, что отвлеклись на мысли — делайте один "двойной вдох" и возвращайте взгляд на экран.', 
    focus: 'Информационный детокс:\n\n• Сегодня полностью откажитесь от думскроллинга и чтения новостей.\n• Отложите социальные сети минимум за 2 часа до сна.\n• Проследите за своим состоянием утром.', 
    explanation: 'Долгая сессия тренирует выносливость (двойной вдох возвращает фокус), а детокс снижает базовый уровень кортизола перед сном.' 
  },
  { 
    day: 12, 
    title: 'Тренировка с микро-триггером', 
    duration: '5 мин', 
    session: '1. ПРЕДЫГРА: Вспомните мелкую неприятную ситуацию (на 3-4 балла тревоги из 10).\n2. ПРАКТИКА: Запустите горизонтальное слежение.\n3. Следите за шариком, пока воспоминание не поблекнет и тело не расслабится.', 
    focus: 'Пауза перед реакцией:\n\n• Если сегодня вас что-то разозлит или испугает — не реагируйте сразу.\n• Сделайте ровно один длинный вдох и длинный выдох.\n• Только после этого отвечайте или действуйте.', 
    explanation: 'Сессия доказывает мозгу, что вы можете справиться с напряжением, а пауза перед реакцией ломает автоматический паттерн паники.' 
  },
  { 
    day: 13, 
    title: 'Возврат к себе', 
    duration: '5 мин', 
    session: '1. Начните сессию с 5 циклов "двойного вдоха" и долгого выдоха.\n2. Затем перейдите в заданный ритм: выдох будет длиннее вдоха.\n3. Поддерживайте фокус на движущемся шарике.', 
    focus: 'Мягкий живот:\n\n• Положите руку на пупок.\n• Сделайте вдох так, чтобы живот надулся, и медленно сдуйте его.\n• Постарайтесь держать мышцы живота расслабленными на протяжении всего дня.', 
    explanation: 'Двойной вдох на старте успокаивает физиологию, а расслабление мышц пресса дает блуждающему нерву пространство для нормальной работы (он проходит через диафрагму).' 
  },
  { 
    day: 14, 
    title: 'Интеграция', 
    duration: '7 мин', 
    session: '1. Финальная длинная сессия без жестких привязок.\n2. Дышите свободно, в комфортном для вас ритме.\n3. Мысленно просканируйте тело на наличие остаточного напряжения и отпустите его.', 
    focus: 'Присвоение силы:\n\n1. Напишите себе сообщение-напоминание.\n2. Поставьте его на обои телефона или стикер на зеркало.\n3. Текст: «Тревога бывает, но я знаю, что с ней делать».', 
    explanation: 'Финальная сессия формирует новые нейронные связи покоя, а напоминание становится постоянным оберегом вашей устойчивости.' 
  }
];

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime } = useAppStore();

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isLockedByTime = (day: number) => {
    if (day !== courseProgress.currentDay || courseProgress.currentDay === 1) return false;
    if (!courseProgress.lastCompletedDate) return false;
    return isSameDay(new Date(), new Date(courseProgress.lastCompletedDate));
  };

  const handleStartDay = (day: number) => {
    // For MVP, we will simulate the day completion just by opening the practice
    // and passing a flag to return to course and mark as completed.
    // Ideally we would have custom screens for each day's logic, but this fulfills the MVP structure.
    
    // Using a basic combined practice for course days for now.
    navigate('/practice/active', {
      state: {
        type: [2, 6, 10, 13].includes(day) ? 'synchronized' : 'course',
        durationSeconds: 180, // 3 mins default
        anxietyBefore: 5,
        courseDay: day
      }
    });
    
    // We can just mark it completed here for the prototype so the UI unlocks
    // In a full app, this happens in PracticeEngine on completion
    if (day === courseProgress.currentDay) {
       // markCourseDayCompleted(day);
    }
  };

  const isDev = import.meta.env.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');
  const visibleCourseData = isDev 
    ? courseData 
    : courseData.filter(lesson => lesson.day <= courseProgress.currentDay);

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
      <header className="flex flex-col mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-neutral-500 hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium ml-2 text-neutral-100">
            14 дней спокойствия
          </h1>
        </div>
        <p className="text-neutral-500 ml-2">
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
      </header>

      <main className="flex-1 flex flex-col gap-4 pb-12">
        {visibleCourseData.map((lesson) => {
          const isCompleted = courseProgress.completedDays.includes(lesson.day);
          const isFocusCompleted = courseProgress.completedFocusDays?.includes(lesson.day);
          const isAvailable = lesson.day <= courseProgress.currentDay;
          const isCurrent = lesson.day === courseProgress.currentDay;

          return (
            <div 
              key={lesson.day}
              className={`relative bg-neutral-800 p-5 rounded-3xl border transition-all ${
                isCurrent 
                  ? 'border-neutral-800 shadow-md' 
                  : isAvailable 
                    ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                    : 'border-neutral-700 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium uppercase tracking-wider ${isCurrent ? 'text-neutral-100' : 'text-neutral-500'}`}>
                  День {lesson.day}
                </span>
                <span className="text-xs text-neutral-500 font-medium bg-neutral-900 px-2 py-1 rounded-md">
                  {lesson.duration}
                </span>
              </div>
              <h3 className={`text-lg font-medium mb-2 ${!isAvailable && 'text-neutral-500'}`}>
                {lesson.title}
              </h3>
              <div className="text-sm text-neutral-400 mb-6 space-y-6">
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

              {isAvailable ? (
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
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] ${
                        isCompleted 
                          ? 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700/80' 
                          : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Протокол пройден' : 'Начать по протоколу'}
                    </button>
                  )}
                  <button
                    onClick={() => toggleCourseFocusDay(lesson.day)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-transform active:scale-[0.98] border ${
                      isFocusCompleted 
                        ? 'bg-green-900/20 text-green-400 border-green-900/50 hover:bg-green-900/30' 
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isFocusCompleted ? 'text-green-400' : 'text-neutral-500'}`} />
                    {isFocusCompleted ? 'Фокус выполнен' : 'Отметить фокус'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Недоступно</span>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Moon, CheckCircle2, CheckCircle, Info, Lock, Activity, Mic, Eye, Headphones, Anchor, Smile, Octagon, Droplets, Coffee, BriefcaseMedical, PhoneOff, Pause, Circle, ShieldCheck, Search } from "lucide-react";
import { useAppStore } from '../store/AppProvider';
import { AudioPlayer } from '../components/AudioPlayer';

const courseData = [
  {
    day: 1,
    title: 'Стартовая точка.',
    duration: '5 мин',
    content: '1. Честно оцените свое состояние по 4 базовым критериям (Тревожность, Физическое напряжение, Эмоциональный фон, Мысли), чтобы мы могли отслеживать прогресс. Для этого нажмите кнопку Оценка состояния.\n\n2. Пройдите пробную сессию для того чтобы понять принцип работы этого упражнения. Все подсказки будут на экране во время упражнения.\nЧтобы начать упражнение нажмите кнопку Сессия\n\n3. Оцените свое состояние в конце дня по 4 базовым критериям. Для этого нажмите кнопку Вечерний итог.',
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',
    actions: [
      { id: 'checkin', label: 'Оценка состояния', icon: 'Activity', type: 'checkin' },
      { id: 'session', label: 'Сессия', icon: 'Play', type: 'practice' },
      { id: 'evening_checkin', label: 'Вечерний итог', icon: 'Moon', type: 'checkin_evening' }
    ]
  },
  { 
    day: 2,
    focusTitle: "Гудение",
    focusIcon: "Mic", 
    title: 'Длинный выдох', 
    duration: '5 мин', 
    session: '1. Дышите строго синхронно с анимацией круга.\n2. Делайте вдох на расширение и удлиненный выдох на сужение.\n3. Глазами непрерывно следите за движением шарика по экрану.', 
    focus: 'Практика "Гудение" (вибрация в горле):\n\n• Оказавшись в уединении, сделайте глубокий вдох.\n• На выдохе издавайте низкий звук «Мммм».\n• Почувствуйте вибрацию в груди и горле.\n• Повторите 5 раз.', 
    explanation: 'Сессия включает парасимпатическую систему торможения, а вибрация голосовых связок напрямую массирует блуждающий нерв, посылая мозгу сигнал безопасности.' 
  },
  { 
    day: 3,
    focusTitle: "Правило 3х3",
    focusIcon: "Eye", 
    title: 'Заземление', 
    duration: '3 мин', 
    session: '1. Расслабьте плечи и челюсть.\n2. Следите взглядом за диагональным движением шарика.\n3. Дышите спокойно, не пытаясь контролировать ритм.', 
    focus: 'Правило "3х3". Один раз за день, когда почувствуете суету, остановитесь и сделайте следующее:\n\n1. Назовите 3 вещи, которые вы сейчас видите.\n2. Назовите 3 звука, которые слышите.\n3. Пошевелите 3 частями тела (пальцами ног, плечами, шеей).', 
    explanation: 'Движение глаз перерабатывает эмоции, а правило 3х3 экстренно возвращает вас из пугающего будущего в безопасное настоящее.' 
  },
  { 
    day: 4,
    focusTitle: "Массаж ушей",
    focusIcon: "Headphones", 
    title: 'Мышечное освобождение', 
    duration: '4 мин', 
    session: '1. Следите за шариком, который двигается по плавной траектории "Восьмерка".\n2. Дышите свободно.\n3. Каждые 30 секунд добавляйте "физиологический вздох": два резких вдоха носом и расслабляющий выдох ртом.', 
    focus: 'Массаж ушей для активации блуждающего нерва:\n\n• Большим и указательным пальцами мягко разомните ушные раковины.\n• Уделите особое внимание впадинке в самом центре уха.\n• Делайте это 1-2 минуты.', 
    explanation: 'Восьмерка и двойной вдох сбрасывают излишки углекислого газа, снижая панику, а массаж ушной раковины механически активирует ветвь блуждающего нерва.' 
  },
  { 
    day: 5,
    focusTitle: "Якорь мысли",
    focusIcon: "Anchor", 
    title: 'Расцепление с мыслью', 
    duration: '5 мин', 
    session: '1. Запустите горизонтальное слежение.\n2. Вспомните тревожащую мысль и мысленно «положите» её на шарик.\n3. Наблюдайте, как мысль катается влево-вправо, теряя свой эмоциональный заряд.', 
    focus: 'Якорь «У меня есть мысль». Смените формулировки в голове:\n\n• Вместо: «Я провалю этот проект»\n• Скажите вслух: «У меня появилась мысль, что я провалю проект».\n• Заметьте, как снижается градус тревоги.', 
    explanation: 'Сессия снижает заряд конкретной мысли, а якорь учит видеть в мыслях просто текст, а не реальную угрозу.' 
  },
  { 
    day: 6,
    focusTitle: "Метод Розенберга",
    focusIcon: "Smile", 
    title: 'Опора на землю', 
    duration: '4 мин', 
    session: '1. Дышите синхронно с кругом ("Квадратное дыхание": вдох, задержка, выдох, задержка).\n2. Одновременно следите за движущимся объектом.\n3. Старайтесь не отрывать взгляд.', 
    focus: 'Упражнение Розенберга:\n\n1. Сцепите руки на затылке.\n2. Не поворачивая головы, скосите глаза максимально вправо до легкого натяжения.\n3. Держите взгляд так, пока не сглотнете или не зевнете.\n4. Повторите то же самое влево.', 
    explanation: 'Квадратное дыхание выравнивает пульс, а глазодвигательное упражнение со сцепленными руками физиологически высвобождает блуждающий нерв у основания черепа.' 
  },
  { 
    day: 7,
    focusTitle: "Стоп-слово",
    focusIcon: "Octagon", 
    title: 'Остановка катастрофизации', 
    duration: '5 мин', 
    session: '1. Начните практику с трех двойных вдохов носом и глубоких выдохов ртом.\n2. Затем перейдите на обычное спокойное дыхание.\n3. Непрерывно следите за шариком.', 
    focus: 'Практика "Стоп-слово":\n\n• Заметив, что вы разгоняете негативный сценарий будущего в голове, скажите себе четкое «СТОП» (можно вслух).\n• Сразу после этого переведите взгляд на любой яркий предмет в комнате и рассмотрите его детали.', 
    explanation: 'Двойные вдохи быстро расправляют альвеолы легких, успокаивая нервную систему, а «Стоп-слово» прерывает токсичный внутренний диалог.' 
  },
  { 
    day: 8,
    focusTitle: "Рефлекс ныряльщика",
    focusIcon: "Droplets", 
    title: 'Сенсорный якорь', 
    duration: '5 мин', 
    session: '1. Запустите траекторию "Бесконечность".\n2. Сфокусируйтесь на том, чтобы каждый выдох был немного длиннее вдоха.\n3. Позвольте глазам плавно скользить за объектом.', 
    focus: 'Рефлекс ныряльщика:\n\n• Когда почувствуете резкий скачок напряжения или панику, плесните в лицо ледяной водой.\n• Альтернатива: приложите холодное мокрое полотенце к щекам и глазам на 30 секунд.', 
    explanation: 'Холод на лице активирует «рефлекс ныряльщика», мгновенно замедляя пульс через блуждающий нерв в моменты острых скачков тревоги.' 
  },
  { 
    day: 9,
    focusTitle: "Стимуляция гортани",
    focusIcon: "Coffee", 
    title: 'Точка покоя', 
    duration: '3 мин', 
    session: '1. Это быстрая сессия для сбивания острой паники.\n2. Следите за очень быстрым движением шарика по горизонтали.\n3. Дыхание свободное, моргайте по мере необходимости.', 
    focus: 'Стимуляция гортани:\n\n• Во время вечерней чистки зубов наберите воду в рот.\n• Активно пополощите горло в течение минуты.\n• В идеале — чтобы это спровоцировало легкое слезотечение.', 
    explanation: 'Быстрое движение глаз сбивает острый стресс, а активное полоскание стимулирует мышцы гортани, которые напрямую иннервируются блуждающим нервом.' 
  },
  { 
    day: 10,
    focusTitle: "SOS-аптечка",
    focusIcon: "BriefcaseMedical", 
    title: 'Сборка протокола', 
    duration: '5 мин', 
    session: '1. Практика жестко синхронизирована с ритмом.\n2. Дышите строго вместе с кругом (вдох на расширение, выдох на сужение).\n3. Глаза не отрываются от шарика.', 
    focus: 'Личная SOS-аптечка:\n\n1. Откройте заметки в телефоне.\n2. Запишите 2 действия, которые сработали для вас лучше всего за эти дни (например: "1. Ледяная вода. 2. Упражнение Розенберга").\n3. Держите этот список под рукой.', 
    explanation: 'Сессия закрепляет навык синхронизации, а личная аптечка дает четкий план действий — мозг успокаивается, когда знает, что делать при панике.' 
  },
  { 
    day: 11,
    focusTitle: "Инфо-детокс",
    focusIcon: "PhoneOff", 
    title: 'Расширение контейнера', 
    duration: '6 мин', 
    session: '1. Длительная сессия тренировки выносливости внимания.\n2. Следите за шариком на протяжении всего времени.\n3. Каждый раз, когда ловите себя на том, что отвлеклись на мысли — делайте один "двойной вдох" и возвращайте взгляд на экран.', 
    focus: 'Информационный детокс:\n\n• Сегодня полностью откажитесь от думскроллинга и чтения новостей.\n• Отложите социальные сети минимум за 2 часа до сна.\n• Проследите за своим состоянием утром.', 
    explanation: 'Долгая сессия тренирует выносливость (двойной вдох возвращает фокус), а детокс снижает базовый уровень кортизола перед сном.' 
  },
  { 
    day: 12,
    focusTitle: "Пауза",
    focusIcon: "Pause", 
    title: 'Тренировка с микро-триггером', 
    duration: '5 мин', 
    session: '1. ПРЕДЫГРА: Вспомните мелкую неприятную ситуацию (на 3-4 балла тревоги из 10).\n2. ПРАКТИКА: Запустите горизонтальное слежение.\n3. Следите за шариком, пока воспоминание не поблекнет и тело не расслабится.', 
    focus: 'Пауза перед реакцией:\n\n• Если сегодня вас что-то разозлит или испугает — не реагируйте сразу.\n• Сделайте ровно один длинный вдох и длинный выдох.\n• Только после этого отвечайте или действуйте.', 
    explanation: 'Сессия доказывает мозгу, что вы можете справиться с напряжением, а пауза перед реакцией ломает автоматический паттерн паники.' 
  },
  { 
    day: 13,
    focusTitle: "Мягкий живот",
    focusIcon: "Circle", 
    title: 'Возврат к себе', 
    duration: '5 мин', 
    session: '1. Начните сессию с 5 циклов "двойного вдоха" и долгого выдоха.\n2. Затем перейдите в заданный ритм: выдох будет длиннее вдоха.\n3. Поддерживайте фокус на движущемся шарике.', 
    focus: 'Мягкий живот:\n\n• Положите руку на пупок.\n• Сделайте вдох так, чтобы живот надулся, и медленно сдуйте его.\n• Постарайтесь держать мышцы живота расслабленными на протяжении всего дня.', 
    explanation: 'Двойной вдох на старте успокаивает физиологию, а расслабление мышц пресса дает блуждающему нерву пространство для нормальной работы (он проходит через диафрагму).' 
  },
  { 
    day: 14,
    focusTitle: "Присвоение силы",
    focusIcon: "ShieldCheck", 
    title: 'Интеграция', 
    duration: '7 мин', 
    session: '1. Финальная длинная сессия без жестких привязок.\n2. Дышите свободно, в комфортном для вас ритме.\n3. Мысленно просканируйте тело на наличие остаточного напряжения и отпустите его.', 
    focus: 'Присвоение силы:\n\n1. Напишите себе сообщение-напоминание.\n2. Поставьте его на обои телефона или стикер на зеркало.\n3. Текст: «Тревога бывает, но я знаю, что с ней делать».', 
    explanation: 'Финальная сессия формирует новые нейронные связи покоя, а напоминание становится постоянным оберегом вашей устойчивости.' 
  }
];

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();

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

    // Map icon strings back to actual Lucide components
  const getIconComponent = (iconName: string) => {
    const components: Record<string, React.ReactNode> = {
      Activity: <Activity className="w-5 h-5 text-indigo-400" />,
      Mic: <Mic className="w-5 h-5 text-indigo-400" />,
      Eye: <Eye className="w-5 h-5 text-indigo-400" />,
      Headphones: <Headphones className="w-5 h-5 text-indigo-400" />,
      Anchor: <Anchor className="w-5 h-5 text-indigo-400" />,
      Smile: <Smile className="w-5 h-5 text-indigo-400" />,
      Octagon: <Octagon className="w-5 h-5 text-indigo-400" />,
      Droplets: <Droplets className="w-5 h-5 text-indigo-400" />,
      Coffee: <Coffee className="w-5 h-5 text-indigo-400" />,
      BriefcaseMedical: <BriefcaseMedical className="w-5 h-5 text-indigo-400" />,
      PhoneOff: <PhoneOff className="w-5 h-5 text-indigo-400" />,
      Pause: <Pause className="w-5 h-5 text-indigo-400" />,
      Circle: <Circle className="w-5 h-5 text-indigo-400" />,
      ShieldCheck: <ShieldCheck className="w-5 h-5 text-indigo-400" />
    };
    return components[iconName] || <Search className="w-5 h-5 text-indigo-400" />;
  };

  const isDev = (typeof process !== "undefined" && process.env.NODE_ENV === "development") || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');
  const visibleCourseData = isDev 
    ? courseData 
    : courseData.filter(lesson => lesson.day <= courseProgress.currentDay + 1);
    
    // Только самые мощные техники попадают в постоянный Арсенал
  const ARTIFACT_DAYS = [2, 3, 6, 8, 10, 13];
  const completedFocusItems = courseData.filter(lesson => 
    courseProgress.completedFocusDays?.includes(lesson.day) && ARTIFACT_DAYS.includes(lesson.day)
  );

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

      
      {completedFocusItems.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-100 ml-2">Мой арсенал</h2>
            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">{completedFocusItems.length} освоено</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x pl-2 -ml-2 pr-4 scrollbar-hide">
            {completedFocusItems.map((item) => (
              <div key={item.day} className="flex-shrink-0 w-40 bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/50 snap-start flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  {getIconComponent(item.focusIcon || 'Search')}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-200 leading-tight">{item.focusTitle}</h4>
                  <p className="text-xs text-neutral-500 mt-1">День {item.day}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="flex-1 flex flex-col gap-4 pb-12">
        {visibleCourseData.map((lesson) => {
          const isCompleted = courseProgress.completedDays.includes(lesson.day);
          const isFocusCompleted = courseProgress.completedFocusDays?.includes(lesson.day);
          const isAvailable = lesson.day <= courseProgress.currentDay;
          const isCurrent = lesson.day === courseProgress.currentDay;

          const isFogOfWar = !isDev && lesson.day > courseProgress.currentDay;

          if (isFogOfWar) {
            return (
              <div 
                key={lesson.day}
                className="relative bg-neutral-800/30 p-5 rounded-3xl border border-dashed border-neutral-700/50 flex flex-col items-center justify-center min-h-[140px] gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 flex items-center justify-center border border-neutral-600/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)]">
                  <Lock className="w-5 h-5 drop-shadow-md text-neutral-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-neutral-400 font-medium text-sm tracking-wide uppercase mb-1">День {lesson.day}</h3>
                  <p className="text-neutral-500 text-xs">Откроется после завершения текущего дня</p>
                </div>
              </div>
            );
          }

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
              </div>

              {isAvailable ? (
                <div className={`flex flex-col gap-3 mt-4 border-t border-neutral-700/50 pt-4 ${lesson.day === 2 || lesson.actions ? 'sm:flex-col' : 'sm:flex-row'}`}>
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
                             className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-sm transition-all border active:scale-[0.98] ${
                               isCompleted 
                                 ? 'bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-300 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]' 
                                 : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]'
                             }`}
                           >
                             <IconComp className="w-5 h-5 drop-shadow-md" />
                             {act.label}
                           </button>
                         )
                      })}
                    </>
                  ) : lesson.day === 2 ? (
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
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all border active:scale-[0.98] ${
                        isCompleted 
                          ? 'bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-300 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]' 
                          : 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {isCompleted ? 'Протокол пройден' : 'Начать по протоколу'}
                    </button>
                  )}
                  <button
                    onClick={() => toggleCourseFocusDay(lesson.day)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] border ${
                      isFocusCompleted 
                        ? 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-emerald-50 border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)] drop-shadow-md' 
                        : 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 text-neutral-400 border-neutral-600/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02]'
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

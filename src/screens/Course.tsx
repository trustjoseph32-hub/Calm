import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Info, Lock, Volume2, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

const courseData = [
  {
    day: 1,
    title: 'Старт',
    duration: '5 мин',
    slides: [
      'В первый день мы знакомимся с базовым упражнением для саморегуляции.\nОсваиваем движение глаз, добавим дыхание и мышечный сброс.',
      'Замерим уровень вашей тревоги "До и После" упражнения, чтобы психика получила подтверждение что вы можете управлять своим состоянием.',
      <span key="explanation"><span className="font-medium text-blue-100/80 block mb-2">Для чего мы это делаем:</span>Когда мы переводим тревогу в конкретные цифры, мозг начинает воспринимать ее как решаемую задачу, а не глобальную угрозу.</span>,
      'Если готовы, нажмите\nНачать обучающую сессию'
    ],
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',
    actions: [
      { id: 'session', label: 'Начать обучающую сессию', icon: 'Play', type: 'practice' }
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

const BackgroundEffect = ({ day }: { day: number }) => {
  if (day === 1) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        
        {/* Night Sky / Stars */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        {/* Mountain Silhouette */}
        <div className="absolute right-0 bottom-0 w-[150%] md:w-full h-[60vh] md:h-[90vh] opacity-80 transform translate-x-[20%] md:translate-x-[10%]">
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="mount1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#050B14" />
              </linearGradient>
              <linearGradient id="mount2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#050B14" />
              </linearGradient>
            </defs>
            <path d="M0,800 L0,500 L150,350 L250,450 L400,200 L550,450 L700,100 L850,400 L1000,250 L1000,800 Z" fill="url(#mount1)" />
            <path d="M100,800 L300,400 L450,550 L650,250 L850,500 L1000,350 L1000,800 L100,800 Z" fill="url(#mount2)" />
            {/* Ice highlights */}
            <path d="M400,200 L450,280 L420,320 Z" fill="#475569" opacity="0.4" />
            <path d="M700,100 L750,200 L680,250 Z" fill="#64748b" opacity="0.3" />
            <path d="M650,250 L700,350 L630,400 Z" fill="#64748b" opacity="0.2" />
          </svg>
        </div>
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050B14] to-transparent" />
      </div>
    )
  }
  
  if (day === 2) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        {/* Dot Sphere simulation */}
        <div className="absolute top-[20%] md:top-[10%] right-[-30%] md:right-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] flex items-center justify-center opacity-60 mix-blend-screen">
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 -rotate-45" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30 rotate-90" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           <div className="absolute w-[80%] h-[80%] rounded-full border border-[#38bdf8]/30" style={{ borderStyle: 'dashed', borderWidth: '2px' }} />
           
           <div className="absolute w-[100%] h-[100%] rounded-full border-[0.5px] border-[#38bdf8]/10" />
           <div className="absolute w-[60%] h-[60%] rounded-full bg-[#38bdf8]/10 blur-[50px]" />
        </div>
      </div>
    )
  }
  
  if (day === 3) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        
        {/* Bubbles */}
        <div className="absolute top-[15%] right-[10%] md:right-[20%] w-32 md:w-48 h-32 md:h-48 rounded-full border-[0.5px] border-blue-300/40 bg-gradient-to-br from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_30px_rgba(56,189,248,0.3)]" />
        <div className="absolute top-[35%] md:top-[40%] right-[30%] md:right-[40%] w-48 md:w-64 h-48 md:h-64 rounded-full border-[0.5px] border-blue-300/30 bg-gradient-to-tr from-cyan-400/5 to-transparent backdrop-blur-sm shadow-[inset_0_0_40px_rgba(56,189,248,0.2)]" />
        <div className="absolute bottom-[20%] left-[20%] md:left-[30%] w-24 md:w-32 h-24 md:h-32 rounded-full border-[0.5px] border-cyan-300/40 bg-gradient-to-bl from-[#38bdf8]/10 to-transparent backdrop-blur-md shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#38bdf8]/10 opacity-30" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#38bdf8]/20 opacity-40" />
    </div>
  )
}

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, saveCheckin, skipWaitTime } = useAppStore();
  const [viewingDay, setViewingDay] = useState(courseProgress.currentDay);
  
  const [anxiety, setAnxiety] = useState<number>(7);

  const lesson = courseData.find(d => d.day === viewingDay) || courseData[0];
  const isAvailable = viewingDay <= courseProgress.currentDay;
  const isCompleted = courseProgress.completedDays.includes(viewingDay);

  const handleStartDay = () => {
    if (!isAvailable) return;
    
    if (viewingDay === 1 && !isCompleted) {
      saveCheckin({
        date: new Date().toISOString(),
        anxiety: anxiety,
        physical: 5,
        emotional: 5,
        thoughts: 5,
      });
    }

    if (viewingDay === 1) navigate("/practice/day1", { state: { anxietyBefore: anxiety } });
    else if (viewingDay === 2) navigate("/practice/day2");
    else if (viewingDay === 3) navigate("/practice/day3");
    else navigate("/practice/active", { state: { type: "breathing", durationSeconds: 180, returnToCourseDay: viewingDay } });
  };

  const displayTitle = viewingDay === 1 ? "Снизить напряжение" :
                       viewingDay === 2 ? "Переключить внимание" :
                       viewingDay === 3 ? "Мысли — это мысли" : lesson.title;
                       
  const displayDesc = viewingDay === 1 ? "Сегодня мы попробуем простой способ немного снизить телесное возбуждение. Это займёт всего пару минут." :
                      viewingDay === 2 ? "Сегодня потренируем сенсорное переключение. Это помогает быстрее выйти из тревожной петли и вернуть опору здесь и сейчас." :
                      viewingDay === 3 ? "Сегодня научимся немного отступать от тревожных мыслей. Это поможет видеть их яснее и меньше в них увязать." :
                      (lesson.explanation || lesson.session);
                      
  const features = viewingDay === 1 ? [{icon: Clock, label: "≈ 2-3 минуты"}, {icon: Volume2, label: "Аудио-поддержка"}, {icon: Info, label: "Подходит для любого момента дня"}] :
                   viewingDay === 2 ? [{icon: Clock, label: "≈ 5 минут"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Никакого специального оборудования"}] :
                   viewingDay === 3 ? [{icon: Clock, label: "≈ 4 минуты"}, {icon: Volume2, label: "Аудио-практика"}, {icon: Info, label: "Простой и безопасный метод"}] :
                   [{icon: Clock, label: lesson.duration || "≈ 5 минут"}, {icon: Info, label: "Самостоятельная практика"}];

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden font-sans flex flex-col">
      <BackgroundEffect day={viewingDay} />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-6 md:px-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <div className="text-[10px] md:text-xs text-white/60 mb-2 font-medium tracking-wider uppercase">
            День {viewingDay} из 14
          </div>
          <div className="flex gap-1 md:gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum < courseProgress.currentDay;
              const isCurrent = dayNum === courseProgress.currentDay;
              return (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${isPast ? "bg-[#38bdf8] w-4 md:w-6" : isCurrent ? "bg-[#38bdf8] w-4 md:w-6 shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "bg-white/10 w-2 md:w-4"}`}
                />
              )
            })}
          </div>
        </div>
        
        <div className="w-10 flex justify-end">
          <span className="hidden md:block text-xs text-white/50 whitespace-nowrap tracking-wide font-light">
            Осталось {14 - courseProgress.currentDay} дней
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        
        <div className="flex-1 flex flex-col justify-end md:justify-center px-4 sm:px-8 pb-8 md:pb-0 pt-4 md:pl-12 lg:pl-24 h-full">
          <motion.div 
            key={viewingDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl w-full"
          >
            <h3 className="text-[#38bdf8] text-sm md:text-base mb-2 font-medium tracking-wide">День {lesson.day}</h3>
            <h1 className="text-4xl md:text-[3.5rem] font-light text-white mb-4 leading-tight tracking-tight">{displayTitle}</h1>
            <p className="text-white/70 font-light text-sm md:text-lg leading-relaxed mb-4 md:mb-10 max-w-md">
              {displayDesc}
            </p>
            
            {/* Mobile-only features */}
            {viewingDay !== 1 && (
              <div className="flex flex-col gap-3 mb-8 md:hidden">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 text-xs">
                    <f.icon className="w-4 h-4 text-[#38bdf8]/70" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 items-end w-full max-w-[800px]">
              {/* Slider Card */}
              {viewingDay === 1 && !isCompleted && (
                <div className="flex-1 w-full p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0A1325]/80 border border-blue-500/20 backdrop-blur-xl shadow-2xl">
                  <div className="flex justify-between items-start mb-4 md:mb-8">
                    <h4 className="text-white text-base md:text-lg font-medium max-w-[200px]">Как сильно ощущается напряжение сейчас?</h4>
                    <div className="w-12 h-12 rounded-[14px] bg-[#122343] border border-[#38bdf8]/30 flex items-center justify-center text-white text-xl font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                      {anxiety}
                    </div>
                  </div>
                  
                  <div className="relative pt-2 pb-4 md:pb-6">
                    <input 
                      type="range" 
                      min="0" max="10" 
                      value={anxiety} 
                      onChange={(e) => setAnxiety(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer relative z-10"
                      style={{
                        background: `linear-gradient(to right, #38bdf8 ${anxiety * 10}%, #1E293B ${anxiety * 10}%)`
                      }}
                    />
                    <style>{`
                      input[type=range]::-webkit-slider-thumb {
                        appearance: none;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: #38bdf8;
                        border: 4px solid #fff;
                        box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
                        cursor: pointer;
                        transition: transform 0.1s;
                      }
                      input[type=range]::-webkit-slider-thumb:active {
                        transform: scale(1.1);
                      }
                    `}</style>
                    <div className="flex justify-between text-[10px] md:text-xs text-white/40 mt-6 px-1 font-light tracking-wide relative">
                      <div className="flex justify-between w-full">
                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                          <div key={n} className="flex flex-col items-center gap-2">
                            <div className="w-px h-1.5 bg-white/20" />
                            <span>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] md:text-xs text-white/40 mt-4 px-1">
                      <span>0 — спокойно</span>
                      <span>10 — максимально напряженно</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col w-full md:w-[320px] shrink-0 gap-3 pb-2">
                <button 
                  onClick={handleStartDay}
                  disabled={!isAvailable}
                  className={`w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] font-medium text-lg transition-all duration-300 group active:scale-[0.98] ${
                    isAvailable 
                      ? 'bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] border border-blue-400/30' 
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <>Практика завершена <CheckCircle2 className="w-6 h-6" /></>
                  ) : isAvailable ? (
                    <>Начать практику <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <><Lock className="w-5 h-5 mr-1" /> Откроется позже</>
                  )}
                </button>
                
                {viewingDay === 1 && !isCompleted && (
                  <p className="text-center text-xs text-white/40 font-light hidden md:block mt-2 tracking-wide">
                    Это займёт около 2-3 минут
                  </p>
                )}
              </div>
            </div>

            {/* Pagination Controls / Dev Tools */}
            <div className="flex items-center justify-between mt-8 md:mt-12 pt-6 border-t border-white/10 max-w-[800px]">
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewingDay(Math.max(1, viewingDay - 1))}
                  disabled={viewingDay === 1}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewingDay(Math.min(14, viewingDay + 1))}
                  disabled={viewingDay === 14}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={skipWaitTime}
                  className="text-xs bg-white/5 text-white/30 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  [Dev] Пропустить 24ч
                </button>
              )}
            </div>

          </motion.div>
        </div>

        {/* Right side for desktop purely visual balance */}
        <div className="hidden md:flex flex-1 relative pointer-events-none" />

      </main>
    </div>
  );
}

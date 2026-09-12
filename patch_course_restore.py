import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# Restore imports
content = content.replace(
    "import { Brain, Heart, Wind, Moon, Sun, Activity, Smile, ArrowLeft, Headphones, Eye, Anchor, Octagon, Droplets, Coffee, BriefcaseMedical, PhoneOff, Pause, Circle, ShieldCheck, Play, Lock, Sparkles, MessageSquare, AlertTriangle, Waves, Shield, Map, Smartphone, Target, HelpCircle, Clock, EyeOff, CheckCircle } from 'lucide-react';",
    "import { Brain, Heart, Wind, Moon, Sun, Activity, Smile, ArrowLeft, Headphones, Eye, Anchor, Octagon, Droplets, Coffee, BriefcaseMedical, PhoneOff, Pause, Circle, ShieldCheck, Play, Lock, Sparkles } from 'lucide-react';"
)
content = content.replace("import { DayRoute } from '../types';\n", "")

# Restore courseData
old_data = """const getCourseData = (pattern: 'body' | 'worry' | 'mixed' | null) => {
  const universal = [
    { day: 1, focusTitle: "Основа", focusIcon: "Circle", title: 'Влиять', duration: '2-3 мин' },
    { day: 2, focusTitle: "Внимание", focusIcon: "Eye", title: 'Вернуться наружу', duration: '1-2 мин' },
    { day: 3, focusTitle: "Мысли", focusIcon: "MessageSquare", title: 'Отделиться от мысли', duration: '2-3 мин' },
    { day: 4, focusTitle: "Тело", focusIcon: "Activity", title: 'Остаться с ощущением', duration: '2-3 мин' },
    { day: 5, focusTitle: "Итог", focusIcon: "Target", title: 'Мой паттерн', duration: '2 мин' }
  ];
  
  const body = [
    { day: 6, focusTitle: "Страх", focusIcon: "AlertTriangle", title: 'Чего я боюсь', duration: '3 мин' },
    { day: 7, focusTitle: "Проверка", focusIcon: "Activity", title: 'Первая проверка', duration: '3 мин' },
    { day: 8, focusTitle: "Волна", focusIcon: "Waves", title: 'Не убирать волну', duration: '3 мин' },
    { day: 9, focusTitle: "Защита", focusIcon: "Shield", title: 'Отложить защиту', duration: '2 мин' },
    { day: 10, focusTitle: "Прогноз", focusIcon: "Eye", title: 'Проверить прогноз', duration: '3 мин' },
    { day: 11, focusTitle: "Пауза", focusIcon: "Pause", title: 'Не спешить', duration: '2 мин' },
    { day: 12, focusTitle: "Реальность", focusIcon: "Map", title: 'В реальной ситуации', duration: '5 мин' },
    { day: 13, focusTitle: "Самостоятельно", focusIcon: "Smartphone", title: 'Без приложения', duration: '5 мин' }
  ];
  
  const worry = [
    { day: 6, focusTitle: "Выбор", focusIcon: "Target", title: 'Задача или worry', duration: '3 мин' },
    { day: 7, focusTitle: "Фокус", focusIcon: "Eye", title: 'Управлять вниманием', duration: '6-8 мин' },
    { day: 8, focusTitle: "Пауза", focusIcon: "Pause", title: 'Не сейчас', duration: '2 мин' },
    { day: 9, focusTitle: "Неизвестность", focusIcon: "HelpCircle", title: 'Проблема или неопределённость', duration: '2 мин' },
    { day: 10, focusTitle: "Проверка", focusIcon: "Clock", title: 'Не проверять сразу', duration: '2 мин' },
    { day: 11, focusTitle: "Вопрос", focusIcon: "MessageSquare", title: 'Оставить вопрос открытым', duration: '3 мин' },
    { day: 12, focusTitle: "Внимание", focusIcon: "Activity", title: 'Внимание без борьбы', duration: '8-10 мин' },
    { day: 13, focusTitle: "Ответ", focusIcon: "EyeOff", title: 'Не искать ответ', duration: '3 мин' }
  ];
  
  const middle = pattern === 'worry' ? worry : body;
  
  return [
    ...universal,
    ...middle,
    { day: 14, focusTitle: "Выбор", focusIcon: "CheckCircle", title: 'Выбор', duration: '2 мин' }
  ];
};"""

original_course_data = """const courseData = [
  {
    day: 1,
    title: 'Старт',
    duration: '5 мин',
    slides: [
      'В первый день мы знакомимся с базовым упражнением для саморегуляции.\\nОсваиваем движение глаз, добавим дыхание и мышечный сброс.',
      'Замерим уровень вашей тревоги "До и После" упражнения, чтобы психика получила подтверждение что вы можете управлять своим состоянием.'
    ]
  },
  { 
    day: 2,
    focusTitle: "Гудение",
    focusIcon: "Mic", 
    title: 'Длинный выдох', 
    duration: '5 мин', 
    session: '1. Дышите строго синхронно с анимацией круга.\\n2. Делайте вдох на расширение и удлиненный выдох на сужение.\\n3. Глазами непрерывно следите за движением шарика по экрану.' 
  },
  { 
    day: 3,
    focusTitle: "Правило 3х3",
    focusIcon: "Eye", 
    title: 'Заземление', 
    duration: '3 мин', 
    session: '1. Расслабьте плечи и челюсть.\\n2. Следите взглядом за диагональным движением шарика.\\n3. Дышите спокойно, не пытаясь контролировать ритм.' 
  },
  { 
    day: 4,
    focusTitle: "Массаж ушей",
    focusIcon: "Headphones", 
    title: 'Мышечное освобождение', 
    duration: '4 мин', 
    session: '1. Следите за шариком, который двигается по плавной траектории "Восьмерка".\\n2. Дышите свободно.\\n3. Каждые 30 секунд добавляйте "физиологический вздох": два резких вдоха носом и расслабляющий выдох ртом.' 
  },
  { 
    day: 5,
    focusTitle: "Якорь мысли",
    focusIcon: "Anchor", 
    title: 'Расцепление с мыслью', 
    duration: '5 мин', 
    session: '1. Запустите горизонтальное слежение.\\n2. Вспомните тревожащую мысль и мысленно «положите» её на шарик.\\n3. Наблюдайте, как мысль катается влево-вправо, теряя свой эмоциональный заряд.' 
  },
  { 
    day: 6,
    focusTitle: "Метод Розенберга",
    focusIcon: "Smile", 
    title: 'Опора на землю', 
    duration: '4 мин', 
    session: '1. Дышите синхронно с кругом ("Квадратное дыхание": вдох, задержка, выдох, задержка).\\n2. Одновременно следите за движущимся объектом.\\n3. Старайтесь не отрывать взгляд.' 
  },
  { 
    day: 7,
    focusTitle: "Стоп-слово",
    focusIcon: "Octagon", 
    title: 'Остановка катастрофизации', 
    duration: '5 мин', 
    session: '1. Начните практику с трех двойных вдохов носом и глубоких выдохов ртом.\\n2. Затем перейдите на обычное спокойное дыхание.\\n3. Непрерывно следите за шариком.' 
  },
  { 
    day: 8,
    focusTitle: "Рефлекс ныряльщика",
    focusIcon: "Droplets", 
    title: 'Сенсорный якорь', 
    duration: '5 мин', 
    session: '1. Запустите траекторию "Бесконечность".\\n2. Сфокусируйтесь на том, чтобы каждый выдох был немного длиннее вдоха.\\n3. Позвольте глазам плавно скользить за объектом.' 
  },
  { 
    day: 9,
    focusTitle: "Стимуляция гортани",
    focusIcon: "Coffee", 
    title: 'Точка покоя', 
    duration: '3 мин', 
    session: '1. Это быстрая сессия для сбивания острой паники.\\n2. Следите за очень быстрым движением шарика по горизонтали.\\n3. Дыхание свободное, моргайте по мере необходимости.' 
  },
  { 
    day: 10,
    focusTitle: "SOS-аптечка",
    focusIcon: "BriefcaseMedical", 
    title: 'Сборка протокола', 
    duration: '5 мин', 
    session: '1. Практика жестко синхронизирована с ритмом.\\n2. Дышите строго вместе с кругом (вдох на расширение, выдох на сужение).\\n3. Глаза не отрываются от шарика.' 
  },
  { 
    day: 11,
    focusTitle: "Инфо-детокс",
    focusIcon: "PhoneOff", 
    title: 'Расширение контейнера', 
    duration: '6 мин', 
    session: '1. Длительная сессия тренировки выносливости внимания.\\n2. Следите за шариком на протяжении всего времени.\\n3. Каждый раз, когда ловите себя на том, что отвлеклись на мысли — делайте один "двойной вдох" и возвращайте взгляд на экран.' 
  },
  { 
    day: 12,
    focusTitle: "Пауза",
    focusIcon: "Pause", 
    title: 'Тренировка с микро-триггером', 
    duration: '5 мин', 
    session: '1. ПРЕДЫГРА: Вспомните мелкую неприятную ситуацию (на 3-4 балла тревоги из 10).\\n2. ПРАКТИКА: Запустите горизонтальное слежение.\\n3. Следите за шариком, пока воспоминание не поблекнет и тело не расслабится.' 
  },
  { 
    day: 13,
    focusTitle: "Мягкий живот",
    focusIcon: "Circle", 
    title: 'Возврат к себе', 
    duration: '5 мин', 
    session: '1. Начните сессию с 5 циклов "двойного вдоха" и долгого выдоха.\\n2. Затем перейдите в заданный ритм: выдох будет длиннее вдоха.\\n3. Поддерживайте фокус на движущемся шарике.' 
  },
  { 
    day: 14,
    focusTitle: "Присвоение силы",
    focusIcon: "ShieldCheck", 
    title: 'Интеграция', 
    duration: '7 мин', 
    session: '1. Финальная длинная сессия без жестких привязок.\\n2. Дышите свободно, в комфортном для вас ритме.\\n3. Мысленно просканируйте тело на наличие остаточного напряжения и отпустите его.' 
  }
];"""
content = content.replace(old_data, original_course_data)

# Restore useAppStore
content = content.replace(
    "const { courseProgress, courseProfile, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();\n  const courseData = getCourseData(courseProfile?.anxietyPattern || null);",
    "const { courseProgress, markCourseDayCompleted, toggleCourseFocusDay, skipWaitTime, updateCourseTodayState } = useAppStore();"
)

# Restore handleStartDay
new_handle = """  const handleStartDay = (day: number) => {
    navigate(`/course/run/${day}`);
  };"""
old_handle = """  const handleStartDay = (day: number) => {
    if (day === 1) {
      navigate('/practice/day1');
    } else {
      navigate('/practice/active', { state: { type: 'combined', courseDay: day } });
    }
  };"""
content = content.replace(new_handle, old_handle)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)

print("Restored Course.tsx")

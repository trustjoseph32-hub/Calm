export type CoursePeriod = 
  | 'learning'      // День 1: механика A и B без тревожной мишени
  | 'baseline'      // День 2: закрепление на текущем состоянии
  | 'light_target'  // Дни 3–5: впервые легкая тревожная ситуация + тело + интенсивность
  | 'stable_target' // Дни 6–9: стабильная связка триггер + тело + A/B, 2-й вариант тэппинга для B
  | 'deep_autonomy' // Дни 10–13: меньше подсказок, умеренные триггеры, 2–3 мин без регулирования
  | 'integration';  // День 14: самостоятельный выбор и прохождение цикла

export interface CourseDayInfo {
  day: number;
  practiceType: 'A' | 'B' | 'choice';
  period: CoursePeriod;
  periodLabel: string;
  title: string;
  focusTitle: string;
  focusText: string;
  instructionTitle: string;
  instructionText: string;
  practiceDurationSec: number;
  exposureDurationSec: number;
}

export const BODY_LOCATIONS = [
  'Грудь',
  'Горло',
  'Живот',
  'Голова',
  'Плечи',
  'Спина',
  'В руках или ногах',
  'Трудно определить'
] as const;

export type BodyLocation = typeof BODY_LOCATIONS[number] | string;

export function getBodyLocationInPrepositional(location: string, custom?: string): string {
  const loc = (location === 'Другое' && custom) ? custom.trim() : location;
  switch (loc) {
    case 'Грудь':
      return 'в груди';
    case 'Горло':
      return 'в горле';
    case 'Живот':
      return 'в животе';
    case 'Голова':
      return 'в голове';
    case 'Плечи':
      return 'в плечах';
    case 'Спина':
      return 'в спине';
    case 'В руках или ногах':
      return 'в руках или ногах';
    case 'Трудно определить':
      return 'в теле';
    default: {
      const lower = loc.toLowerCase().trim();
      if (lower.startsWith('в ') || lower.startsWith('во ')) {
        return lower;
      }
      return `в ${lower}`;
    }
  }
}

export function getExposureDurationSec(day: number): number {
  if (day === 1 || day === 2) return 60; // 1 минута
  if (day === 3) return 60; // 1 минута
  if (day <= 5) return 90; // Дни 4–5: 1.5 минуты
  if (day <= 7) return 90; // Дни 6–7: 1.5 минуты
  if (day <= 9) return 120; // Дни 8–9: 2 минуты
  if (day === 10) return 120; // День 10: 2 минуты
  if (day <= 12) return 150; // Дни 11–12: 2.5 минуты
  return 180; // Дни 13–14: 3 минуты
}

export const COURSE_DAYS_DATA: CourseDayInfo[] = [
  {
    day: 1,
    practiceType: 'A',
    period: 'learning',
    periodLabel: 'Этап 1 • Первая техника',
    title: 'Внимание + дыхание',
    focusTitle: 'Освоение первой практики',
    focusText: 'Сегодня осваиваем технику «Внимание + дыхание».\nСоединяем физиологический вздох, движение глаз и сброс напряжения.',
    instructionTitle: 'План занятия',
    instructionText: '1. Дыхание: физиологический вздох (двойной вдох и долгий выдох).\n2. Взгляд: непрерывное слежение за точкой.\n3. Тело: сжатие и расслабление ладоней.\n4. Закрепление: общая сессия на 2.5 минуты + 1 минута тишины.',
    practiceDurationSec: 300,
    exposureDurationSec: 60,
  },
  {
    day: 2,
    practiceType: 'B',
    period: 'learning',
    periodLabel: '',
    title: 'Ритм + вибрация',
    focusTitle: 'Освоение второй практики: 3 зоны тэппинга',
    focusText: 'Сегодня осваиваем соматическую технику «Ритм + вибрация» в трёх ключевых зонах тела (уши, плечи, грудина) и соединяем её с глубоким вокализированным выдохом.',
    instructionTitle: 'План занятия',
    instructionText: '1. Уши: легкие ритмичные постукивания подушечками пальцев для мягкой стимуляции блуждающего нерва (60 сек).\n2. Плечи: поочерёдные перекрёстные постукивания пальцами («прикосновения бабочки») для билатеральной регуляции (60 сек).\n3. Верхняя часть грудины: мягкие постукивания ладонью чуть ниже ямки на шее для снятия накопленного напряжения (60 сек).\n4. Закрепление: все 3 части последовательно одним прогоном + выдох со звуком «мммм» (210 сек) и 1 минута тишины.',
    practiceDurationSec: 390,
    exposureDurationSec: 60,
  },
  {
    day: 3,
    practiceType: 'A',
    period: 'light_target',
    periodLabel: 'Этап 2 • Первый легкий триггер',
    title: 'Внимание + дыхание',
    focusTitle: 'Первый опыт с легкой ситуацией',
    focusText: 'Сегодня впервые соединяем технику с мыслью. Выберите легкую ситуацию (на 3–5 из 10) — бытовой вопрос, мелкое дело или недавний разговор.',
    instructionTitle: 'Как выполнять практику',
    instructionText: '1. Удерживаем в уме легкую ситуацию и находим отклик в теле.\n2. Двойной вдох носом + сжатие кулаков.\n3. Долгий выдох через рот + расслабление ладоней.\n4. Непрерывное слежение взглядом за точкой.',
    practiceDurationSec: 240,
    exposureDurationSec: 60,
  },
  {
    day: 4,
    practiceType: 'B',
    period: 'light_target',
    periodLabel: 'Этап 2 • Первый легкий триггер',
    title: 'Ритм + вибрация',
    focusTitle: 'Легкая ситуация и ритм',
    focusText: 'Продолжаем работать с умеренным триггером (3–5 из 10). Заметьте, как тело реагирует на ритмичный тэппинг и длинный выдох.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Попеременный тэппинг по плечам, свободный спокойный вдох и долгий выдох с гудением. Время наблюдения в тишине — 1.5 минуты.',
    practiceDurationSec: 240,
    exposureDurationSec: 90,
  },
  {
    day: 5,
    practiceType: 'A',
    period: 'light_target',
    periodLabel: 'Этап 2 • Первый легкий триггер',
    title: 'Внимание + дыхание',
    focusTitle: 'Уверенное распознавание отклика',
    focusText: 'Закрепляем первый этап: легкий триггер, поиск зажима в теле и переключение внимания через дыхание и движение глаз.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Зафиксируйте ощущение в теле до начала практики. Двойной вдох — выдох, движение взгляда и ладони. 1.5 минуты тишины после.',
    practiceDurationSec: 240,
    exposureDurationSec: 90,
  },
  {
    day: 6,
    practiceType: 'B',
    period: 'stable_target',
    periodLabel: 'Этап 3 • Стабильная связка и вариации',
    title: 'Ритм + вибрация',
    focusTitle: 'Новый вариант: прикосновение к груди',
    focusText: 'Сегодня в практике «Ритм + вибрация» можно попробовать второй вариант: скрестить ладони на верхней части груди (ключицах) — «объятие бабочки».',
    instructionTitle: 'Варианты тэппинга',
    instructionText: 'Выберите, что комфортнее: похлопывание по плечам или по верхней части груди под ключицами. Вдох носом + выдох со звуком.',
    practiceDurationSec: 240,
    exposureDurationSec: 90,
  },
  {
    day: 7,
    practiceType: 'A',
    period: 'stable_target',
    periodLabel: 'Этап 3 • Стабильная связка и вариации',
    title: 'Внимание + дыхание',
    focusTitle: 'Экватор курса: стабильная связка',
    focusText: 'Половина пути. Тело уже быстро вспоминает алгоритм. Триггер больше не захватывает целиком — он становится просто физическим ощущением.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Фиксация триггера и тела ➔ сессия движения глаз и физиологического вздоха ➔ тихий период наблюдения (1.5 мин).',
    practiceDurationSec: 240,
    exposureDurationSec: 90,
  },
  {
    day: 8,
    practiceType: 'B',
    period: 'stable_target',
    periodLabel: 'Этап 3 • Стабильная связка и вариации',
    title: 'Ритм + вибрация',
    focusTitle: 'Свободный выбор тэппинга',
    focusText: 'Используйте удобный вариант прикосновения (плечи или верх груди). Период наблюдения без техники сегодня увеличивается до 2 минут.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Ритмичное похлопывание в удобной зоне (плечи или ключицы), спокойный вдох и длинный вокализированный выдох.',
    practiceDurationSec: 240,
    exposureDurationSec: 120,
  },
  {
    day: 9,
    practiceType: 'A',
    period: 'stable_target',
    periodLabel: 'Этап 3 • Стабильная связка и вариации',
    title: 'Внимание + дыхание',
    focusTitle: 'Снижение остроты триггера',
    focusText: 'Заметьте: когда внимание занято движением глаз и дыханием, мысль теряет напряжение. 2 минуты спокойного наблюдения в конце.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Взгляд за точкой, двойной вдох с напряжением ладоней, долгий плавный выдох со сбросом напряжения. 2 минуты наблюдения.',
    practiceDurationSec: 240,
    exposureDurationSec: 120,
  },
  {
    day: 10,
    practiceType: 'B',
    period: 'deep_autonomy',
    periodLabel: 'Этап 4 • Глубокое наблюдение и автономия',
    title: 'Ритм + вибрация',
    focusTitle: 'Глубокое наблюдение (2 минуты)',
    focusText: 'Переходим к этапу автономии. Меньше внешних подсказок. Можно взять более заметную тревожную мысль. 2 минуты тишины в конце.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Тэппинг (плечи или грудь) + вокализированный выдох. В конце — 2 минуты безоценочного наблюдения за телом.',
    practiceDurationSec: 240,
    exposureDurationSec: 120,
  },
  {
    day: 11,
    practiceType: 'A',
    period: 'deep_autonomy',
    periodLabel: 'Этап 4 • Глубокое наблюдение и автономия',
    title: 'Внимание + дыхание',
    focusTitle: 'Автономия внимания (2.5 минуты)',
    focusText: 'Минимум подсказок. Вы сами ведете цикл. Период тихого наблюдения после упражнения увеличивается до 2.5 минут.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Синхронизируйте вдох, кулаки и движение глаз. В тихой фазе после практики оставайтесь с телом 2.5 минуты.',
    practiceDurationSec: 240,
    exposureDurationSec: 150,
  },
  {
    day: 12,
    practiceType: 'B',
    period: 'deep_autonomy',
    periodLabel: 'Этап 4 • Глубокое наблюдение и автономия',
    title: 'Ритм + вибрация',
    focusTitle: 'Спокойное присутствие (2.5 минуты)',
    focusText: 'Тело само удерживает ритм. Вы не боретесь с тревогой, а даете ей пройти через тело. Наблюдение в конце — 2.5 минуты.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Тэппинг в удобном ритме + выдох с тихим гудением. Затем 2.5 минуты тишины.',
    practiceDurationSec: 240,
    exposureDurationSec: 150,
  },
  {
    day: 13,
    practiceType: 'A',
    period: 'deep_autonomy',
    periodLabel: 'Этап 4 • Глубокое наблюдение и автономия',
    title: 'Внимание + дыхание',
    focusTitle: 'Закрепление автономии (3 минуты)',
    focusText: 'Предпоследний день. Полная устойчивость: удерживаем умеренный триггер, проходим практику и 3 минуты остаемся в тихом наблюдении без техники.',
    instructionTitle: 'Как выполнять практику',
    instructionText: 'Самостоятельное выполнение: двойной вдох, движение глаз, расслабление ладоней. Финальная тихая экспозиция — 3 минуты.',
    practiceDurationSec: 240,
    exposureDurationSec: 180,
  },
  {
    day: 14,
    practiceType: 'choice',
    period: 'integration',
    periodLabel: 'Этап 5 • Личный выбор и интеграция',
    title: 'Финальный день: Интеграция',
    focusTitle: 'Ваш самостоятельный выбор',
    focusText: 'Финальный день курса. Выберите ту практику, которая вам ближе: «Внимание + дыхание» или «Ритм + вибрация». Пройдите полный самостоятельный цикл.',
    instructionTitle: 'Выбор техники',
    instructionText: 'Выберите практику: «Внимание + дыхание» (дыхание + взгляд + кулаки) или «Ритм + вибрация» (тэппинг + выдох + голос). Зафиксируйте ощущение до и после.',
    practiceDurationSec: 240,
    exposureDurationSec: 180,
  },
];

import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

# 1. Update SlideRenderer types and the paragraph element
target_sliderenderer = """const SlideRenderer = ({ slides, actions, handleAction }: { slides: string[], actions: any[], handleAction: (id: string) => void }) => {"""
replacement_sliderenderer = """const SlideRenderer = ({ slides, actions, handleAction }: { slides: React.ReactNode[], actions: any[], handleAction: (id: string) => void }) => {"""
content = content.replace(target_sliderenderer, replacement_sliderenderer)

target_p = """<p className="text-neutral-300 text-base leading-relaxed pointer-events-none">"""
replacement_p = """<p className="text-neutral-300 text-base leading-relaxed pointer-events-none whitespace-pre-wrap">"""
content = content.replace(target_p, replacement_p)

# 2. Hide focus and explanation if slides exist
target_focus = """{lesson.focus && ("""
replacement_focus = """{lesson.focus && !lesson.slides && ("""
content = content.replace(target_focus, replacement_focus)

target_explanation = """{lesson.explanation && ("""
replacement_explanation = """{lesson.explanation && !lesson.slides && ("""
content = content.replace(target_explanation, replacement_explanation)

# 3. Update courseData day 1 slides
target_day1 = """    slides: [
      'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.',
      'Также мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.',
      'Нажмите "Начать обучающую сессию", чтобы запустить процесс сборки.'
    ],
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',"""

replacement_day1 = """    slides: [
      'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.',
      'Также мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.',
      <span key="focus"><span className="font-medium text-neutral-200">Фокус дня:</span>\\nЗамечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.</span>,
      <span key="explanation"><span className="font-medium text-neutral-200">Для чего это нужно:</span>\\nИзмерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.</span>,
      'Нажмите "Начать обучающую сессию", чтобы запустить процесс сборки.'
    ],
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',"""

content = content.replace(target_day1, replacement_day1)

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)
print("Changes applied!")

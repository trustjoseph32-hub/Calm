import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """  {
    day: 1,
    title: 'Стартовая точка.',
    duration: '5 мин',
    content: 'В первый день мы последовательно соберем базовый протокол саморегуляции: шаг за шагом освоим движение глаз, добавим дыхание, а затем — мышечный сброс.\\n\\nТакже мы сделаем замер уровня тревоги "До и После", чтобы ваш мозг получил физиологическое подтверждение того, что вы можете этим управлять.\\n\\nНажмите "Начать обучающую сессию", чтобы запустить процесс сборки.',
    focus: 'Замечать свои ощущения безоценочно. Мы не пытаемся их изменить прямо сейчас, мы просто их фиксируем.',
    explanation: 'Измерение — первый шаг к контролю. Когда мы переводим смутную тревогу в конкретные цифры, мозг начинает воспринимать её как решаемую задачу, а не как всепоглощающую угрозу.',
    actions: [
      { id: 'session', label: 'Начать обучающую сессию', icon: 'Play', type: 'practice' }
    ]
  },"""

# Instead of passing text directly to 'content', we will change it to an array of slides for day 1.
# But wait, Course.tsx expects 'content' to be a string right now!
# Let's see how 'content' is rendered.

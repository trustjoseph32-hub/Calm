import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, Lock } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

const courseData = [
  { day: 1, title: 'Заметить состояние', duration: '3 мин', description: 'Научись замечать своё состояние без попытки немедленно его изменить.' },
  { day: 2, title: 'Длинный выдох', duration: '5 мин', description: 'Спокойное дыхание с немного более длинным выдохом.' },
  { day: 3, title: 'Заземление', duration: '3 мин', description: 'Практика 5–4–3–2–1 для возврата внимания в настоящее.' },
  { day: 4, title: 'Визуальное движение', duration: '4 мин', description: 'Короткие сеты слежения за объектом для снижения напряжения.' },
  { day: 5, title: 'Тело', duration: '5 мин', description: 'Мягкий body scan и дыхание.' },
  { day: 6, title: 'Тревожная мысль', duration: '4 мин', description: 'Факт или прогноз? Плюс движение и дыхание.' },
  { day: 7, title: 'Маленький шаг', duration: '5 мин', description: 'Подготовка к безопасной ситуации.' },
  { day: 8, title: 'Объединение', duration: '5 мин', description: 'Полная комбинированная практика.' },
  { day: 9, title: 'Что помогает мне', duration: '3 мин', description: 'Анализ того, какие практики работают лучше всего.' },
  { day: 10, title: 'Мой протокол', duration: '5 мин', description: 'Собственная последовательность для успокоения.' },
];

export function Course() {
  const navigate = useNavigate();
  const { courseProgress, markCourseDayCompleted } = useAppStore();

  const handleStartDay = (day: number) => {
    // For MVP, we will simulate the day completion just by opening the practice
    // and passing a flag to return to course and mark as completed.
    // Ideally we would have custom screens for each day's logic, but this fulfills the MVP structure.
    
    // Using a basic combined practice for course days for now.
    navigate('/practice/active', {
      state: {
        type: 'course',
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
            10 дней спокойствия
          </h1>
        </div>
        <p className="text-neutral-500 ml-2">
          Ежедневные практики по 5–10 минут для формирования навыка саморегуляции.
        </p>
      </header>

      <main className="flex-1 flex flex-col gap-4 pb-12">
        {courseData.map((lesson) => {
          const isCompleted = courseProgress.completedDays.includes(lesson.day);
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
              <p className="text-sm text-neutral-500 mb-6">
                {lesson.description}
              </p>

              {isAvailable ? (
                <button
                  onClick={() => handleStartDay(lesson.day)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-transform active:scale-[0.98] ${
                    isCompleted 
                      ? 'bg-neutral-700 text-neutral-500 hover:bg-neutral-700' 
                      : 'bg-white text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isCompleted ? 'Пройдено (повторить)' : 'Начать'}
                </button>
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

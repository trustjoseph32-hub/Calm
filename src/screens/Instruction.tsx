import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Wind, Activity, ScanEye, ListOrdered } from 'lucide-react';

export function Instruction() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full min-h-screen bg-neutral-900">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-neutral-100">
          Инструкция
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-6 pb-12">
        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center mb-6 border border-blue-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(59,130,246,0.4)] text-blue-50 drop-shadow-md">
            <BookOpen className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-medium text-neutral-100 mb-4">
            Как пользоваться приложением
          </h2>
          <p className="text-neutral-500 mb-4 leading-relaxed">
            Calm Motion объединяет дыхательные упражнения и билатеральную стимуляцию (основанную на принципах EMDR) для быстрого снижения тревоги и стресса.
          </p>
        </section>

        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 flex items-center justify-center mb-6 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] text-indigo-50 drop-shadow-md">
            <ListOrdered className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-neutral-100 mb-6">
            Последовательность действий
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">1</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">Обратить внимание на свои мысли во время тревожности.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">2</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">Оценить по шкале от 0 до 10 интенсивность проявления реакции от мыслей.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">3</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">Обратить внимание на телесный отклик тревожности. На его локализацию (голова, горло, грудь, верх живота, низ живота).</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">4</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">Оценить по шкале от 0 до 10 интенсивность проявления телесной реакции.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">5</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">
                Перейти к самому упражнению. Вам нужно будет делать вдох-выдох синхронно с движением глаз и напряжением и расслаблением частей тела. Все необходимые от вас действия суфлируются в виде текстовых подсказок на экране приложения.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium shrink-0">6</div>
              <p className="text-neutral-500 pt-1 leading-relaxed">
                После выполнения упражнений еще раз обратите внимание на интенсивность тревожных мыслей и телесных ощущений и оцените эту интенсивность. Отметьте изменения.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md">
            <Wind className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-neutral-100 mb-4">
            Дыхательные практики
          </h2>
          <p className="text-neutral-500 mb-4 leading-relaxed">
            Следуйте за расширяющимся и сужающимся кругом на экране. Вдох происходит во время расширения, выдох — во время сужения. Регулярное и ритмичное дыхание активирует парасимпатическую нервную систему, помогая телу расслабиться.
          </p>
        </section>

        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md">
            <ScanEye className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-neutral-100 mb-4">
            Движение глаз (EMDR)
          </h2>
          <p className="text-neutral-500 mb-4 leading-relaxed">
            В синхронной практике следите взглядом за движущимся шариком. Старайтесь не двигать головой, используйте только глаза. Это движение (из стороны в сторону) помогает мозгу переработать стрессовую информацию и снизить эмоциональный заряд тревожных мыслей.
          </p>
        </section>

        <section className="bg-neutral-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 flex items-center justify-center mb-6 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] text-neutral-200 drop-shadow-md">
            <Activity className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-medium text-neutral-100 mb-4">
            Билатеральный звук
          </h2>
          <p className="text-neutral-500 mb-4 leading-relaxed">
            Звук, который попеременно звучит в левом и правом ухе. Для правильного эффекта <strong>обязательно используйте наушники</strong>. В настройках практики вы также можете добавить фоновый шум (ветер, дождь, море) для большего погружения и успокоения.
          </p>
        </section>
      </main>
    </div>
  );
}

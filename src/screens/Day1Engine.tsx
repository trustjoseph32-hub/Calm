import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/AppProvider';

type Step = 
  | 'PRE_THOUGHT'
  | 'PRE_WATER'
  | 'PRE_ASSESS'
  | 'TUTORIAL_EYES_INTRO'
  | 'TUTORIAL_EYES_ACTIVE'
  | 'TUTORIAL_EYES_CHECK'
  | 'TUTORIAL_BREATH_INTRO'
  | 'TUTORIAL_BREATH_ACTIVE'
  | 'TUTORIAL_BREATH_CHECK'
  | 'TUTORIAL_TENSION_INTRO'
  | 'TUTORIAL_TENSION_ACTIVE'
  | 'TUTORIAL_TENSION_CHECK'
  | 'POST_ASSESS'
  | 'OUTRO';

export function Day1Engine() {
  const navigate = useNavigate();
  const { markCourseDayCompleted } = useAppStore();
  const [step, setStep] = useState<Step>('PRE_THOUGHT');
  const [thought, setThought] = useState('');
  const [anxietyBefore, setAnxietyBefore] = useState<number>(5);
  const [anxietyAfter, setAnxietyAfter] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'TUTORIAL_EYES_ACTIVE' || step === 'TUTORIAL_BREATH_ACTIVE' || step === 'TUTORIAL_TENSION_ACTIVE') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        if (step === 'TUTORIAL_EYES_ACTIVE') setStep('TUTORIAL_EYES_CHECK');
        if (step === 'TUTORIAL_BREATH_ACTIVE') setStep('TUTORIAL_BREATH_CHECK');
        if (step === 'TUTORIAL_TENSION_ACTIVE') setStep('TUTORIAL_TENSION_CHECK');
      }
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const startActivePhase = (nextStep: Step) => {
    setTimeLeft(30);
    setStep(nextStep);
  };

  const finishDay1 = () => {
    markCourseDayCompleted(1);
    navigate('/course');
  };

  const renderActiveSession = (mode: 'eyes' | 'breath' | 'tension') => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden bg-neutral-950">
        <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
          <div className="bg-neutral-800/80 backdrop-blur-md px-6 py-2 rounded-full font-medium text-neutral-300">
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
        
        {/* Breathing Circle Background */}
        {(mode === 'breath' || mode === 'tension') && (
          <>
            <motion.div
              className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen pointer-events-none"
              animate={{
                scale: [0.6, 1.4, 1.4, 0.6, 0.6],
                opacity: [0.2, 0.8, 0.8, 0.2, 0.2]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.5, 0.9, 1]
              }}
            />
            {mode === 'tension' && (
              <motion.div 
                className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
                animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0, 0], scale: [0.95, 1, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
                }}
              >
                НАПРЯЧЬСЯ
              </motion.div>
            )}
          </>
        )}

        {/* Inhale/Exhale Text for Breath mode */}
        {mode === 'breath' && (
          <>
            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [0, 1, 1, 0, 0, 0, 0, 0, 0], scale: [0.95, 1, 1, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
              }}
            >
              ВДОХ
            </motion.div>
            <motion.div 
              className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
              animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0], scale: [0.95, 0.95, 0.95, 0.95, 0.95, 1, 1, 0.95, 0.95] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
              }}
            >
              ВЫДОХ
            </motion.div>
          </>
        )}

        {/* Relax Text for tension mode */}
        {mode === 'tension' && (
          <motion.div 
            className="absolute z-10 text-white/70 text-2xl font-light tracking-[0.2em] uppercase text-center pointer-events-none"
            animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0], scale: [0.95, 0.95, 0.95, 0.95, 0.95, 1, 1, 0.95, 0.95] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.05, 0.4, 0.45, 0.5, 0.55, 0.9, 0.95, 1]
            }}
          >
            РАССЛАБИТЬСЯ
          </motion.div>
        )}

        {/* EMDR Ball */}
        <motion.div
          className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-20 pointer-events-none"
          animate={{ x: ["-40vw", "40vw", "40vw", "-40vw", "-40vw"] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.4, 0.5, 0.9, 1]
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full h-[100dvh]">
      <AnimatePresence mode="wait">
        
        {step === 'PRE_THOUGHT' && (
          <motion.div key="pre_thought" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8">
            <h2 className="text-2xl font-medium text-white text-center">Выгрузка мыслей</h2>
            <p className="text-neutral-400 text-center">Запишите ровно одну мысль, которая сейчас тревожит вас больше всего. Мы "закроем" её в этом поле, чтобы она не мешала практике.</p>
            <textarea 
              value={thought}
              onChange={e => setThought(e.target.value)}
              placeholder="Меня пугает, что..."
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 min-h-[120px]"
            />
            <button 
              disabled={!thought.trim()}
              onClick={() => setStep('PRE_WATER')}
              className="w-full py-4 mt-4 bg-indigo-600 disabled:opacity-50 disabled:bg-neutral-800 rounded-full font-medium"
            >
              Сохранить и отложить
            </button>
          </motion.div>
        )}

        {step === 'PRE_WATER' && (
          <motion.div key="pre_water" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <p className="text-neutral-400">Перед тем как мы начнем, сходите в ванную и умойте лицо ледяной водой (или приложите холодное полотенце).</p>
            <p className="text-neutral-400">Это активирует нужное состояние на физиологическом уровне.</p>
            <button 
              onClick={() => setStep('PRE_ASSESS')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Я сделал(а), идем дальше
            </button>
          </motion.div>
        )}

        {step === 'PRE_ASSESS' && (
          <motion.div key="pre_assess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Текущий уровень тревоги</h2>
            <p className="text-neutral-400">Оцените своё напряжение прямо сейчас от 1 до 10.</p>
            <div className="text-6xl font-light text-indigo-400 my-4">{anxietyBefore}</div>
            <input 
              type="range" min="1" max="10" value={anxietyBefore}
              onChange={e => setAnxietyBefore(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-neutral-500 text-sm">
              <span>Спокоен</span>
              <span>Паника</span>
            </div>
            <button 
              onClick={() => setStep('TUTORIAL_EYES_INTRO')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Перейти к практике
            </button>
          </motion.div>
        )}

        {step === 'TUTORIAL_EYES_INTRO' && (
          <motion.div key="tut_eyes_intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Этап 1: Движение глаз</h2>
            <p className="text-neutral-400">На этом этапе просто непрерывно следите глазами за двигающимся шариком. Это запустит процесс первичный переработки напряжения вашей нервной системы.</p>
            <button 
              onClick={() => startActivePhase('TUTORIAL_EYES_ACTIVE')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Начать (30 сек)
            </button>
          </motion.div>
        )}

        {step === 'TUTORIAL_EYES_ACTIVE' && (
          <motion.div key="tut_eyes_active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-neutral-950">
            {renderActiveSession('eyes')}
          </motion.div>
        )}

        {step === 'TUTORIAL_EYES_CHECK' && (
          <motion.div key="tut_eyes_check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Получилось удержать фокус?</h2>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => startActivePhase('TUTORIAL_EYES_ACTIVE')}
                className="flex-1 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl font-medium"
              >
                Повторить этап
              </button>
              <button 
                onClick={() => setStep('TUTORIAL_BREATH_INTRO')}
                className="flex-1 py-4 bg-indigo-600 rounded-2xl font-medium"
              >
                Да, идем дальше
              </button>
            </div>
          </motion.div>
        )}

        {step === 'TUTORIAL_BREATH_INTRO' && (
          <motion.div key="tut_breath_intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Этап 2: Добавляем дыхание</h2>
            <p className="text-neutral-400">Теперь продолжаем следить за шариком, но добавляем дыхание. Вдыхайте, когда фон расширяется, и выдыхайте, когда он сужается.</p>
            <button 
              onClick={() => startActivePhase('TUTORIAL_BREATH_ACTIVE')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Попробовать (30 сек)
            </button>
          </motion.div>
        )}

        {step === 'TUTORIAL_BREATH_ACTIVE' && (
          <motion.div key="tut_breath_active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-neutral-950">
            {renderActiveSession('breath')}
          </motion.div>
        )}

        {step === 'TUTORIAL_BREATH_CHECK' && (
          <motion.div key="tut_breath_check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Синхронизировались?</h2>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => startActivePhase('TUTORIAL_BREATH_ACTIVE')}
                className="flex-1 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl font-medium"
              >
                Повторить этап
              </button>
              <button 
                onClick={() => setStep('TUTORIAL_TENSION_INTRO')}
                className="flex-1 py-4 bg-indigo-600 rounded-2xl font-medium"
              >
                Да, отлично
              </button>
            </div>
          </motion.div>
        )}

        {step === 'TUTORIAL_TENSION_INTRO' && (
          <motion.div key="tut_tension_intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Этап 3: Полная сборка</h2>
            <p className="text-neutral-400">Следите за шариком, дышите с кругом. <br/>И теперь <span className="text-neutral-200 font-medium">на вдохе сильно сжимайте кулаки и напрягайте плечи</span>, а <span className="text-neutral-200 font-medium">на выдохе полностью их разжимайте и расслабляйте</span>.</p>
            <button 
              onClick={() => startActivePhase('TUTORIAL_TENSION_ACTIVE')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Собрать всё вместе (30 сек)
            </button>
          </motion.div>
        )}

        {step === 'TUTORIAL_TENSION_ACTIVE' && (
          <motion.div key="tut_tension_active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-neutral-950">
            {renderActiveSession('tension')}
          </motion.div>
        )}

        {step === 'TUTORIAL_TENSION_CHECK' && (
          <motion.div key="tut_tension_check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Превосходно.</h2>
            <p className="text-neutral-400">Вы освоили полную сборку. Вы можете вернуться к этому упражнению в любой момент.</p>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => startActivePhase('TUTORIAL_TENSION_ACTIVE')}
                className="flex-1 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl font-medium"
              >
                Повторить
              </button>
              <button 
                onClick={() => setStep('POST_ASSESS')}
                className="flex-1 py-4 bg-indigo-600 rounded-2xl font-medium"
              >
                Идем к итогам
              </button>
            </div>
          </motion.div>
        )}

        {step === 'POST_ASSESS' && (
          <motion.div key="post_assess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-2xl font-medium text-white">Уровень тревоги сейчас</h2>
            <p className="text-neutral-400">Оцените своё напряжение после практики.</p>
            <div className="text-6xl font-light text-indigo-400 my-4">{anxietyAfter}</div>
            <input 
              type="range" min="1" max="10" value={anxietyAfter}
              onChange={e => setAnxietyAfter(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-neutral-500 text-sm">
              <span>Спокоен</span>
              <span>Паника</span>
            </div>
            <button 
              onClick={() => setStep('OUTRO')}
              className="w-full py-4 mt-8 bg-indigo-600 rounded-full font-medium"
            >
              Завершить День 1
            </button>
          </motion.div>
        )}

        {step === 'OUTRO' && (
          <motion.div key="outro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center w-full max-w-sm gap-8 text-center">
            <h2 className="text-3xl font-medium text-white mb-4">День 1 пройден!</h2>
            <div className="bg-neutral-800/50 p-6 rounded-[2rem] border border-neutral-700">
              <p className="text-neutral-400 mb-6">Ваша тревога изменилась с:</p>
              <div className="flex justify-center items-center gap-6">
                <span className="text-5xl text-neutral-500 font-light">{anxietyBefore}</span>
                <span className="text-3xl text-indigo-500">→</span>
                <span className="text-6xl text-white font-medium">{anxietyAfter}</span>
              </div>
            </div>
            <p className="text-neutral-400">
              {anxietyAfter < anxietyBefore 
                ? "Отличный результат. Вы только что доказали своему мозгу, что можете управлять состоянием." 
                : "Всё в порядке. Нервной системе нужно время, чтобы привыкнуть к новым сигналам безопасности."}
            </p>
            <button 
              onClick={finishDay1}
              className="w-full py-4 mt-8 rounded-full font-medium text-lg bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Завершить
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

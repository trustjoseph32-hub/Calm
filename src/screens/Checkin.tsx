import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/AppProvider';
import { ArrowLeft, Activity, Heart, BrainCircuit, ActivitySquare } from 'lucide-react';
import { motion } from 'motion/react';

export function Checkin() {
  const navigate = useNavigate();
  const { saveCheckin, markCourseDayCompleted, courseProgress } = useAppStore();

  const [anxiety, setAnxiety] = useState(5);
  const [physical, setPhysical] = useState(5);
  const [emotional, setEmotional] = useState(5);
  const [thoughts, setThoughts] = useState(5);

  const handleSubmit = () => {
    saveCheckin({
      date: new Date().toISOString(),
      anxiety,
      physical,
      emotional,
      thoughts,
    });

    // If they are on Day 1, this acts as the Day 1 practice completion.
    // Let's just always try to mark Day 1 if they haven't yet, or we can let Course.tsx handle it.
    // Actually, it's safer to just mark Day 1 completed if it's currently Day 1.
    if (courseProgress.currentDay === 1 && !courseProgress.completedDays.includes(1)) {
      markCourseDayCompleted(1);
    }

    // Go back to the course page
    navigate(-1);
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 min-h-screen text-neutral-100">
      <header className="flex items-center gap-4 p-4 border-b border-neutral-800">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 text-neutral-200 flex items-center justify-center shrink-0 border border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 drop-shadow-md" />
        </button>
        <h1 className="text-xl font-medium">Оценка состояния</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Как вы себя чувствуете?</h2>
          <p className="text-neutral-400">
            Замечать свои ощущения безоценочно — первый шаг к спокойствию. 
            Оцените свое состояние по 4 критериям (от 0 до 10).
          </p>
        </div>

        <div className="space-y-10">
          <SliderField 
            icon={<Activity className="w-5 h-5 drop-shadow-md text-indigo-50" />}
            color="indigo"
            title="Тревожность"
            description="От полного спокойствия (0) до паники (10)"
            value={anxiety} 
            setValue={setAnxiety} 
          />
          <SliderField 
            icon={<ActivitySquare className="w-5 h-5 drop-shadow-md text-orange-50" />}
            color="orange"
            title="Физическое напряжение"
            description="От расслабленности (0) до скованности в теле (10)"
            value={physical} 
            setValue={setPhysical} 
          />
          <SliderField 
            icon={<Heart className="w-5 h-5 drop-shadow-md text-pink-50" />}
            color="pink"
            title="Эмоциональный фон"
            description="От подавленного (0) до радостного (10)"
            value={emotional} 
            setValue={setEmotional} 
          />
          <SliderField 
            icon={<BrainCircuit className="w-5 h-5 drop-shadow-md text-emerald-50" />}
            color="emerald"
            title="Навязчивые мысли"
            description="От ясной головы (0) до мысленной «жвачки» (10)"
            value={thoughts} 
            setValue={setThoughts} 
          />
        </div>

        <div className="mt-12 mb-8">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white font-medium transition-all active:scale-[0.98] border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md hover:scale-[1.02]"
          >
            Сохранить состояние
          </button>
        </div>
      </main>
    </div>
  );
}

function SliderField({ icon, color, title, description, value, setValue }: { 
  icon: React.ReactNode, color: 'indigo'|'orange'|'pink'|'emerald', title: string, description: string, value: number, setValue: (v: number) => void 
}) {
  const getGradients = () => {
    switch(color) {
      case 'indigo': return 'from-indigo-400 via-indigo-600 to-indigo-800 border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)]';
      case 'orange': return 'from-orange-400 via-orange-500 to-orange-700 border-orange-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(249,115,22,0.4)]';
      case 'pink': return 'from-pink-400 via-pink-600 to-pink-800 border-pink-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(236,72,153,0.4)]';
      case 'emerald': return 'from-emerald-400 via-emerald-600 to-emerald-800 border-emerald-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(16,185,129,0.4)]';
      default: return 'from-neutral-500 via-neutral-600 to-neutral-800 border-neutral-400/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-4px_6px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={`mt-1 w-10 h-10 rounded-full bg-gradient-to-b flex items-center justify-center shrink-0 border ${getGradients()}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg text-neutral-200 flex items-center gap-2">
            {title} 
            <span className="text-indigo-400 font-semibold bg-indigo-900/30 px-2 py-0.5 rounded-md text-sm">{value}</span>
          </h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="px-2">
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className={`w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-gray-100 [&::-moz-range-thumb]:to-gray-300 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/50 [&::-moz-range-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)]`}
        />
        <div className="flex justify-between text-xs text-neutral-600 mt-2 font-medium">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}

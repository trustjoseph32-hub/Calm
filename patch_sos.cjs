const fs = require('fs');
let code = fs.readFileSync('src/screens/SosInstruction.tsx', 'utf8');

const importOld = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Waves, CloudRain, Wind } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';`;

const importNew = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Waves, CloudRain, Wind } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';`;

code = code.replace(importOld, importNew);

const logicOld = `export function SosInstruction() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppStore();

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
        anxietyBefore: 10,
      }
    });
  };`;

const logicNew = `export function SosInstruction() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppStore();
  const [anxietyBefore, setAnxietyBefore] = useState<number | null>(null);

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
        anxietyBefore: anxietyBefore,
      }
    });
  };`;

code = code.replace(logicOld, logicNew);

const uiOld = `        <div className="flex gap-6 items-start">
          <div className="text-4xl font-light text-neutral-500">1</div>
          <p className="text-2xl font-medium text-neutral-100 leading-tight">
            Дышите вместе с расширяющимся кругом.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          <div className="text-4xl font-light text-neutral-500">2</div>
          <p className="text-2xl font-medium text-neutral-100 leading-tight">
            Следите за шариком на экране.
          </p>
        </div>

        <div className="mt-8 space-y-6">`;

const uiNew = `        <div className="mb-4 bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <h2 className="text-lg font-medium text-neutral-200 mb-2">Насколько сильное напряжение сейчас?</h2>
          <p className="text-sm text-neutral-400 mb-6">Оцените по шкале от 0 (спокойно) до 10 (максимально сильное напряжение).</p>
          <div className="px-2">
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={anxietyBefore === null ? 5 : anxietyBefore} 
              onChange={(e) => setAnxietyBefore(Number(e.target.value))}
              className={\`w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-gray-100 [&::-webkit-slider-thumb]:to-gray-300 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] \${anxietyBefore === null ? 'bg-neutral-800' : 'bg-red-900/50'}\`}
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
              <span>0</span>
              <span>10</span>
            </div>
            {anxietyBefore === null && (
               <p className="text-red-400/80 text-xs text-center mt-4">Укажите значение, чтобы статистика была точной. Или можете начать без оценки.</p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-6">`;

code = code.replace(uiOld, uiNew);

// Replace syncBackgroundNoise references with syncAmbientSound
code = code.split('syncBackgroundNoise').join('syncAmbientSound');

fs.writeFileSync('src/screens/SosInstruction.tsx', code);
console.log("Patched SosInstruction.tsx");

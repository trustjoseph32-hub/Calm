const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedSetup.tsx', 'utf8');

// Replace structure text
const structureOld = `        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Структура практики</h2>
            <p className="text-sm text-neutral-500">Практика состоит из 5 фаз по 1.5 минуты с короткими паузами.</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-neutral-500">
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 1: Горизонтальное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-400"></div> Фаза 2: Вертикальное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 3: Треугольное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-400"></div> Фаза 4: Диагональное слежение</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-800"></div> Фаза 5: Слежение восьмеркой</div>
          </div>
        </section>`;

const structureNew = `        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Структура практики</h2>
            <p className="text-sm text-neutral-500">Практика состоит из коротких раундов по 20-30 секунд.</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-neutral-500">
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-700"></div> После каждого раунда — вопрос о самочувствии</div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-neutral-700"></div> Если станет хуже, мы предложим мягкое заземление</div>
          </div>
        </section>`;
code = code.replace(structureOld, structureNew);

// Replace sound settings
const soundOld = `        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Звук</h2>
          </div>
          
          <div className="flex gap-3">
             <button
                onClick={() => updateSettings({ syncBilateralAudio: false })}
                className={\`flex-1 py-3 rounded-2xl border text-sm transition-all \${
                  !settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }\`}
              >
                Без звука
              </button>
              <button
                onClick={() => updateSettings({ syncBilateralAudio: true })}
                className={\`flex-1 py-3 rounded-2xl border text-sm transition-all \${
                  settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }\`}
              >
                Билатеральный звук
              </button>
          </div>

          {(settings.syncBilateralAudio || settings.syncAmbientSound !== 'none') && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 mt-4">
               {settings.syncBilateralAudio && (
                 <div className="flex items-start gap-2 bg-neutral-900 p-3 rounded-xl text-sm text-neutral-500">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
                    <p>Для правильного эффекта используй наушники.</p>
                  </div>
               )}
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Громкость звука</span>
                    <span className="text-neutral-100 font-medium">{settings.syncVolume}%</span>
                 </div>
                 <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.syncVolume}
                    onChange={(e) => updateSettings({ syncVolume: Number(e.target.value) })}
                    className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
               </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-neutral-400">Фоновый шум</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'none' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'none'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                Выкл
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'wind' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'wind'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <Wind className="w-4 h-4" /> Ветер
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'rain' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'rain'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <CloudRain className="w-4 h-4" /> Дождь
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'sea' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'sea'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <Waves className="w-4 h-4" /> Море
              </button>
            </div>
          </div>
        </section>`;

const soundNew = `        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Билатеральный звук</h2>
          </div>
          
          <div className="flex gap-3">
             <button
                onClick={() => updateSettings({ syncBilateralAudio: false })}
                className={\`flex-1 py-3 rounded-2xl border text-sm transition-all \${
                  !settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }\`}
              >
                Выключен
              </button>
              <button
                onClick={() => updateSettings({ syncBilateralAudio: true })}
                className={\`flex-1 py-3 rounded-2xl border text-sm transition-all \${
                  settings.syncBilateralAudio 
                    ? 'bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] drop-shadow-md' 
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }\`}
              >
                Включён
              </button>
          </div>

          {settings.syncBilateralAudio && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 mt-4">
               <div className="flex items-start gap-2 bg-neutral-900 p-3 rounded-xl text-sm text-neutral-500">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
                  <p>Для правильного эффекта используй наушники.</p>
                </div>
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Громкость звука</span>
                    <span className="text-neutral-100 font-medium">{settings.syncBilateralVolume !== undefined ? Math.round(settings.syncBilateralVolume * 100) : 50}%</span>
                 </div>
                 <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.syncBilateralVolume !== undefined ? Math.round(settings.syncBilateralVolume * 100) : 50}
                    onChange={(e) => updateSettings({ syncBilateralVolume: Number(e.target.value) / 100 })}
                    className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
               </div>
            </div>
          )}
        </section>

        <section className="bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-700 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-neutral-100">Фоновый звук</h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'none' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'none'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                Тишина
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'wind' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'wind'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <Wind className="w-4 h-4" /> Ветер
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'rain' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'rain'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <CloudRain className="w-4 h-4" /> Дождь
              </button>
              <button
                onClick={() => updateSettings({ syncAmbientSound: 'sea' })}
                className={\`py-3 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 \${
                  settings.syncAmbientSound === 'sea'
                    ? 'border-neutral-400 text-neutral-200 bg-neutral-700'
                    : 'border-neutral-700 text-neutral-500 hover:border-neutral-500'
                }\`}
              >
                <Waves className="w-4 h-4" /> Море
              </button>
            </div>
          </div>
          
          {settings.syncAmbientSound !== 'none' && (
               <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200 mt-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Громкость фона</span>
                    <span className="text-neutral-100 font-medium">{settings.syncVolume !== undefined ? Math.round(settings.syncVolume * 100) : 50}%</span>
                 </div>
                 <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.syncVolume !== undefined ? Math.round(settings.syncVolume * 100) : 50}
                    onChange={(e) => updateSettings({ syncVolume: Number(e.target.value) / 100 })}
                    className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
               </div>
          )}
        </section>`;
code = code.replace(soundOld, soundNew);
fs.writeFileSync('src/screens/SynchronizedSetup.tsx', code);
console.log("Patched SynchronizedSetup.tsx");

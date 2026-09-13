import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Waves, CloudRain, Wind, VolumeX } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export function SosInstruction() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppStore();

  const handleStart = () => {
    navigate('/practice/active', {
      state: {
        type: 'synchronized',
        isSOS: true,
      }
    });
  };

  return (
    <div className="flex-1 w-full min-h-[100svh] relative bg-[#050B14] overflow-hidden font-sans flex flex-col">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        
        {/* Night Sky / Stars */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050B14] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col flex-1 px-4 py-4 sm:py-6 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <header className="flex flex-col mb-4 shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-[10px] md:text-xs text-[#38BDF8] mb-1 sm:mb-2 font-medium tracking-wider uppercase">
            Экстренная помощь
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight">
            Снижаем напряжение
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5 mb-4">
            {/* Step 1 */}
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] font-medium shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.15)] bg-[#38BDF8]/10 text-xs sm:text-sm mt-0.5">1</div>
              <p className="text-white/90 font-normal text-[15px] sm:text-[17px] leading-relaxed">
                Дышите вместе с расширяющимся кругом двойным вдохом носом (Вдох-доВдох) и выдохом ртом.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] font-medium shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.15)] bg-[#38BDF8]/10 text-xs sm:text-sm mt-0.5">2</div>
              <div className="flex flex-col gap-3 w-full">
                <p className="text-white/90 font-normal text-[15px] sm:text-[17px] leading-relaxed">
                  Направляйте взгляд вместе с шариком до самого конца и до небольшого ощущения напряжения в мышцах глаз в крайних точках.
                </p>
                
                {/* Modern Flat Eyes Animation */}
                <div className="flex justify-start w-full opacity-60">
                  <div className="flex gap-3">
                    {/* Left Eye */}
                    <div className="w-10 h-5 sm:w-12 sm:h-6 border border-white/20 rounded-[50%] flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ x: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#38BDF8]/70 flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#050B14] rounded-full" />
                      </motion.div>
                    </div>
                    {/* Right Eye */}
                    <div className="w-10 h-5 sm:w-12 sm:h-6 border border-white/20 rounded-[50%] flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ x: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#38BDF8]/70 flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#050B14] rounded-full" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] font-medium shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.15)] bg-[#38BDF8]/10 text-xs sm:text-sm mt-0.5">3</div>
              <p className="text-white/90 font-normal text-[15px] sm:text-[17px] leading-relaxed">
                На вдохе зажимайте ладони в кулаки, на выдохе расслабляйте.
              </p>
            </div>
          </div>

          <div className="mt-auto shrink-0 pt-2 sm:pt-4">
            {/* Audio Settings */}
            <div className="mb-4 sm:mb-6">
              <div className="text-[10px] md:text-xs text-white/60 mb-2 sm:mb-3 font-medium tracking-wider uppercase">
                Звуковое сопровождение
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => updateSettings({ syncAmbientSound: 'none', syncBilateralAudio: false })}
                  className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all border flex justify-center items-center gap-2 ${
                    settings.syncAmbientSound === 'none' && !settings.syncBilateralAudio
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Тишина
                </button>
                <button
                  onClick={() => updateSettings({ syncAmbientSound: 'wind', syncBilateralAudio: true })}
                  className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all border flex justify-center items-center gap-2 ${
                    settings.syncAmbientSound === 'wind'
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Ветер
                </button>
                <button
                  onClick={() => updateSettings({ syncAmbientSound: 'rain', syncBilateralAudio: true })}
                  className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all border flex justify-center items-center gap-2 ${
                    settings.syncAmbientSound === 'rain'
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Дождь
                </button>
                <button
                  onClick={() => updateSettings({ syncAmbientSound: 'sea', syncBilateralAudio: true })}
                  className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all border flex justify-center items-center gap-2 ${
                    settings.syncAmbientSound === 'sea'
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Море
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full flex items-center justify-center px-6 py-4 rounded-[1.25rem] font-medium text-base sm:text-lg transition-all duration-300 group active:scale-[0.98] bg-gradient-to-r from-[#1E40AF] to-[#38BDF8] text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)]"
            >
              Начать практику
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}


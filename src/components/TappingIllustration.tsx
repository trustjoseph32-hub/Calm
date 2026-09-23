import React from 'react';
import { motion } from 'motion/react';

interface TappingIllustrationProps {
  mode: 'ears' | 'shoulders' | 'chest';
  animated?: boolean;
}

export const TappingIllustration: React.FC<TappingIllustrationProps> = ({ 
  mode, 
  animated = true 
}) => {
  if (mode === 'ears') {
    return (
      <div className="w-full max-w-[340px] mx-auto my-3 flex flex-col items-center">
        {/* Чистая фотография без лишних рамок с точным анатомическим ориентиром на козелок */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
          <img 
            src="/ear_tapping.webp?v=7" 
            alt="Анатомическое расположение козелка уха"
            className="w-full h-auto object-cover block"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.src.endsWith('ear_tapping.jpg?v=7')) {
                img.src = '/ear_tapping.jpg?v=7';
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (mode === 'chest') {
    return (
      <div className="w-full max-w-[340px] mx-auto my-3 p-3 bg-gradient-to-b from-[#091528]/95 via-[#060e1c]/95 to-[#030712] border border-sky-500/25 rounded-3xl flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(56,189,248,0.1)]">
        <div className="w-full flex justify-between items-center px-1 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Техника: верх грудины
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            Ниже ямки на шее
          </span>
        </div>

        {/* Realistic Photograph Container */}
        <div className="relative w-full aspect-[16/10] max-h-[220px] rounded-2xl overflow-hidden border border-sky-500/20 bg-[#020611]">
          <img 
            src="/chest_hand.webp?v=2" 
            alt="Положение ладони на уровне верхней части груди"
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.03]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to jpg if webp fails
              const img = e.currentTarget as HTMLImageElement;
              if (!img.src.includes('chest_hand.jpg')) {
                img.src = '/chest_hand.jpg?v=2';
              }
            }}
          />

          {/* Dark luxury vignette overlay blending with the app theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/30 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-sky-500/20 rounded-2xl pointer-events-none" />

          {/* Central Heart/Sternum Gentle Rhythmic Pulse */}
          {animated && (
            <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div 
                className="w-16 h-16 rounded-full border-2 border-sky-400/60 bg-sky-400/15 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.9, 0.25, 0.9] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8] border border-white/60" />
            </div>
          )}

          {/* Bottom badge */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex justify-center">
            <div className="bg-[#050B14]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/30 text-[11px] text-white/90 shadow-lg text-center font-medium">
              Верхняя часть грудины • Чуть ниже ямки на шее
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mode === 'shoulders' («Объятие бабочки» / Butterfly Hug)
  return (
    <div className="w-full max-w-[340px] mx-auto my-3 p-3 bg-gradient-to-b from-[#091528]/95 via-[#060e1c]/95 to-[#030712] border border-sky-500/25 rounded-3xl flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(56,189,248,0.12)]">
      <div className="w-full flex justify-between items-center px-1 mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Положение «Объятие бабочки»
        </span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          EMDR-техника
        </span>
      </div>

      {/* Realistic Front-Facing Photograph Container */}
      <div className="relative w-full aspect-[16/10] max-h-[220px] rounded-2xl overflow-hidden border border-sky-500/20 bg-[#020611]">
        <img 
          src="/butterfly_hug_front.webp" 
          alt="Техника «Объятие бабочки» (вид спереди: скрещенные на груди руки с ладонями на плечах)"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to jpg
            const img = e.currentTarget as HTMLImageElement;
            if (!img.src.endsWith('butterfly_hug_front.jpg')) {
              img.src = '/butterfly_hug_front.jpg';
            }
          }}
        />

        {/* Ambient Dark Vignette & Edge Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/30 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-sky-500/20 rounded-2xl pointer-events-none" />

        {/* Interactive Alternating Bilateral Tapping Markers on Shoulders (Left ↔ Right) */}
        {animated && (
          <>
            {/* Tap Point 1: Left Shoulder (Viewer's left) */}
            <div className="absolute top-[46%] left-[26%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div 
                className="w-12 h-12 rounded-full border-2 border-sky-400 bg-sky-400/20 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
                initial={{ scale: 0.7, opacity: 0.95 }}
                animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.95, 0.1, 0.95] }}
                transition={{ repeat: Infinity, duration: 2.2, times: [0, 0.45, 1], ease: "easeOut" }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sky-500 text-[11px] font-bold text-white flex items-center justify-center shadow-lg border border-white/50">
                1
              </div>
            </div>

            {/* Tap Point 2: Right Shoulder (Viewer's right, offset by 1.1s) */}
            <div className="absolute top-[46%] right-[26%] translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div 
                className="w-12 h-12 rounded-full border-2 border-sky-400 bg-sky-400/20 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
                initial={{ scale: 0.7, opacity: 0.95 }}
                animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.95, 0.1, 0.95] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: 1.1, times: [0, 0.45, 1], ease: "easeOut" }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sky-500 text-[11px] font-bold text-white flex items-center justify-center shadow-lg border border-white/50">
                2
              </div>
            </div>
          </>
        )}

        {/* Bottom subtle indicator badge */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex justify-center">
          <div className="bg-[#050B14]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/30 text-[11px] text-white/90 shadow-lg text-center font-medium">
            Вид спереди • Ладони лежат на плечах
          </div>
        </div>
      </div>
    </div>
  );
};

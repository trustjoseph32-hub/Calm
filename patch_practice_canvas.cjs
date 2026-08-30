const fs = require('fs');
let code = fs.readFileSync('src/screens/PracticeEngine.tsx', 'utf8');

const newPracticeCanvas = `// Inner Practice Component handling the visual rendering
function PracticeCanvas({ type, isActive, settings }: { type: string, isActive: boolean, settings: any }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  
  const isSynchronized = type === 'synchronized';
  const showBreathing = type === 'breathing' || type === 'combined' || type === 'course' || isSynchronized;
  const showBilateral = type === 'bilateral' || type === 'combined' || type === 'course' || isSynchronized;

  const currentDurationIn = isSynchronized ? (settings.syncInhaleDuration || settings.breathingIn) : settings.breathingIn;
  const currentDurationOut = isSynchronized ? (settings.syncExhaleDuration || settings.breathingOut) : settings.breathingOut;
  const phaseDuration = phase === 'in' ? currentDurationIn : currentDurationOut;

  // Breathing cycle
  useEffect(() => {
    if (!isActive || !showBreathing) return;
    
    let timer: number;
    const cycle = () => {
      setPhase(p => p === 'in' ? 'out' : 'in');
    };
    
    const duration = (phase === 'in' ? currentDurationIn : currentDurationOut) * 1000;
    timer = window.setTimeout(cycle, duration);
    
    return () => clearTimeout(timer);
  }, [isActive, phase, showBreathing, currentDurationIn, currentDurationOut]);

  // Bilateral settings translation
  const getSpeedSeconds = () => {
    switch (settings.bilateralSpeed) {
      case 'slow': return 2.5;
      case 'fast': return 1.0;
      default: return 1.5;
    }
  };

  const getAmplitudeWidth = () => {
    switch (settings.bilateralAmplitude) {
      case 'narrow': return '60vw';
      case 'wide': return '90vw';
      default: return '80vw';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Breathing Circle */}
      {showBreathing && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{
            scale: phase === 'in' ? 1 : 0.6,
            opacity: phase === 'in' ? 0.7 : 0.2,
          }}
          transition={{
            duration: phaseDuration,
            ease: "easeInOut"
          }}
          className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-white blur-2xl sm:blur-3xl mix-blend-screen"
        />
      )}

      {/* Text overlay for breathing */}
      {showBreathing && settings.showText && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 1 }}
          className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white/70"
        >
          {phase === 'in' ? 'Вдох' : 'Выдох'}
        </motion.div>
      )}

      {/* Bilateral Orb */}
      {showBilateral && !settings.reducedMotion && (
        <div className="absolute w-full h-1 flex items-center justify-center opacity-30">
          {/* Subtle track line */}
          <div className="w-[80vw] h-[1px] bg-black/10 rounded-full" />
        </div>
      )}

      {showBilateral && (
        settings.reducedMotion ? (
          /* Reduced Motion: fading sides */
          <div className="absolute inset-0 flex justify-between">
            <motion.div 
              animate={{ opacity: isActive ? (isSynchronized ? (phase === 'in' ? 0.4 : 0.1) : [0.1, 0.4, 0.1]) : 0.1 }}
              transition={isSynchronized ? { duration: phaseDuration, ease: "easeInOut" } : { duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/3 h-full bg-gradient-to-r from-white/20 to-transparent blur-2xl"
            />
            <motion.div 
              animate={{ opacity: isActive ? (isSynchronized ? (phase === 'out' ? 0.4 : 0.1) : [0.1, 0.1, 0.4, 0.1]) : 0.1 }}
              transition={isSynchronized ? { duration: phaseDuration, ease: "easeInOut" } : { duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/3 h-full bg-gradient-to-l from-white/20 to-transparent blur-2xl"
            />
          </div>
        ) : (
          /* Normal Motion: moving orb */
          <motion.div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]"
            initial={{ x: isSynchronized ? \`-\${parseInt(getAmplitudeWidth())/2}vw\` : 0 }}
            animate={isActive ? {
              x: isSynchronized 
                ? (phase === 'in' ? \`\${parseInt(getAmplitudeWidth())/2}vw\` : \`-\${parseInt(getAmplitudeWidth())/2}vw\`)
                : [\`-\${parseInt(getAmplitudeWidth())/2}vw\`, \`\${parseInt(getAmplitudeWidth())/2}vw\`, \`-\${parseInt(getAmplitudeWidth())/2}vw\`]
            } : { x: 0 }}
            transition={isActive ? (
              isSynchronized 
                ? { duration: phaseDuration, ease: "easeInOut" }
                : { duration: getSpeedSeconds() * 2, repeat: Infinity, ease: "easeInOut" }
            ) : { duration: 0.5 }}
          />
        )
      )}
    </div>
  );
}
`;

const regex = /\/\/ Inner Practice Component handling the visual rendering\s*function PracticeCanvas\(\{ type, isActive, settings \}: \{ type: string, isActive: boolean, settings: any \}\) \{[\s\S]*\}\s*$/;
code = code.replace(regex, newPracticeCanvas);

fs.writeFileSync('src/screens/PracticeEngine.tsx', code);

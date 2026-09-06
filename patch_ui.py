import re

with open('src/screens/SynchronizedEngine.tsx', 'r') as f:
    content = f.read()

target = """    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, reducedMotion, currentSpeed, settings]);"""

replacement = """    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, reducedMotion, currentSpeed, settings, isSOS, roundIndex, sosConfig, handleRoundComplete]);"""

content = content.replace(target, replacement)

target2 = """              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 40vw), 0px)`,
                  transition: 'transform 0.05s linear'
                }}
              />"""

replacement2 = """              {/* Target */}
              <div 
                className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.4)] z-10 pointer-events-none"
                style={{
                  transform: `translate(calc(${xOffset} * 40vw), calc(${yOffset} * 20vh))`,
                  transition: 'transform 0.05s linear'
                }}
              />"""

content = content.replace(target2, replacement2)

target3 = """          {engineState === 'INTRO' && ("""
replacement3 = """          {engineState === 'SOS_PAUSE' && (
            <motion.div key="sos_pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 max-w-sm">
              <h2 className="text-2xl font-medium">Отдых</h2>
              <div className="text-neutral-400">
                <p>Сделай глубокий вдох и медленный выдох.</p>
                <p className="mt-2">Готовимся к следующему этапу.</p>
              </div>
              <div className="text-8xl font-light text-neutral-100 mt-8">{pauseTimeLeft}</div>
            </motion.div>
          )}
          
          {engineState === 'INTRO' && ("""

content = content.replace(target3, replacement3)

with open('src/screens/SynchronizedEngine.tsx', 'w') as f:
    f.write(content)

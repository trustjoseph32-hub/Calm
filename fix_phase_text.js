import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

const oldText = `  const getPhaseText = () => {
    if (practiceStage === 1 || practiceStage === 2) {
      switch (phase) {
        case 'inhale1': return 'Вдох';
        case 'inhale2': 
        case 'hold': return 'До-вдох';
        case 'exhale': return 'Выдох';
        default: return '';
      }
    } else {
      if (phase === 'exhale') return 'Расслабьте ладони. Выдох';
      return 'Сжимайте кулаки. Вдох';
    }
  };`;

const newText = `  const getPhaseText = (): React.ReactNode => {
    if (practiceStage === 1 || practiceStage === 2) {
      switch (phase) {
        case 'inhale1': return 'Вдох';
        case 'inhale2': 
        case 'hold': return 'До-вдох';
        case 'exhale': return 'Выдох';
        default: return '';
      }
    } else {
      if (phase === 'exhale') return (
        <div className="flex flex-col items-center leading-tight">
          <span>Расслабьтесь</span>
          <span>Выдох</span>
        </div>
      );
      return (
        <div className="flex flex-col items-center leading-tight">
          <span>Напрягитесь</span>
          <span>Вдох</span>
        </div>
      );
    }
  };`;

content = content.replace(oldText, newText);

const oldDiv = `<div className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500">
                   {isActive ? getPhaseText() : 'Пауза'}
                </div>`;

const newDiv = `<div className="absolute text-2xl font-light tracking-[0.2em] uppercase text-white pointer-events-none z-20 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] transition-opacity duration-500 flex justify-center items-center">
                   {isActive ? getPhaseText() : 'Пауза'}
                </div>`;

content = content.replace(oldDiv, newDiv);

fs.writeFileSync('src/screens/Day1Engine.tsx', content);

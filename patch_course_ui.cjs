const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

// 1. Add Icon mapping components inside Course component
const iconMappingInjection = `  // Map icon strings back to actual Lucide components
  const getIconComponent = (iconName: string) => {
    const components: Record<string, React.ReactNode> = {
      Activity: <Activity className="w-5 h-5 text-indigo-400" />,
      Mic: <Mic className="w-5 h-5 text-indigo-400" />,
      Eye: <Eye className="w-5 h-5 text-indigo-400" />,
      Headphones: <Headphones className="w-5 h-5 text-indigo-400" />,
      Anchor: <Anchor className="w-5 h-5 text-indigo-400" />,
      Smile: <Smile className="w-5 h-5 text-indigo-400" />,
      Octagon: <Octagon className="w-5 h-5 text-indigo-400" />,
      Droplets: <Droplets className="w-5 h-5 text-indigo-400" />,
      Coffee: <Coffee className="w-5 h-5 text-indigo-400" />,
      BriefcaseMedical: <BriefcaseMedical className="w-5 h-5 text-indigo-400" />,
      SmartphoneOff: <SmartphoneOff className="w-5 h-5 text-indigo-400" />,
      Pause: <Pause className="w-5 h-5 text-indigo-400" />,
      Circle: <Circle className="w-5 h-5 text-indigo-400" />,
      ShieldCheck: <ShieldCheck className="w-5 h-5 text-indigo-400" />
    };
    return components[iconName] || <Search className="w-5 h-5 text-indigo-400" />;
  };

`;

code = code.replace(
  'const isDev = import.meta.env.DEV || (typeof process !== \'undefined\' && process.env.NODE_ENV === \'development\');',
  iconMappingInjection + '  const isDev = import.meta.env.DEV || (typeof process !== \'undefined\' && process.env.NODE_ENV === \'development\');'
);

// 2. Change visibleCourseData logic to include +1 for fog of war
const visibleCourseReplace = /const visibleCourseData = isDev[\s\S]*?: courseData.filter\(lesson => lesson\.day <= courseProgress\.currentDay\);/;
const visibleCourseNew = `const visibleCourseData = isDev 
    ? courseData 
    : courseData.filter(lesson => lesson.day <= courseProgress.currentDay + 1);
    
  const completedFocusItems = courseData.filter(lesson => courseProgress.completedFocusDays?.includes(lesson.day));`;
  
code = code.replace(visibleCourseReplace, visibleCourseNew);


// 3. Inject Arsenal (My Toolkit) right after header
const arsenalHTML = `
      {completedFocusItems.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-100 ml-2">Мой арсенал</h2>
            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">{completedFocusItems.length} освоено</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x pl-2 -ml-2 pr-4 scrollbar-hide">
            {completedFocusItems.map((item) => (
              <div key={item.day} className="flex-shrink-0 w-40 bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/50 snap-start flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  {getIconComponent(item.focusIcon || 'Search')}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-200 leading-tight">{item.focusTitle}</h4>
                  <p className="text-xs text-neutral-500 mt-1">День {item.day}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="flex-1 flex flex-col gap-4 pb-12">`;

code = code.replace('<main className="flex-1 flex flex-col gap-4 pb-12">', arsenalHTML);


// 4. Fog of war rendering logic inside map
const mapStartReplace = /return \(\s*<div\s*key=\{lesson.day\}\s*className=\{\`relative bg-neutral-800 p-5 rounded-3xl border transition-all \$\{[\s\S]*?\}\`\}\s*>/;

// We need to match the whole map return block, which is tricky with regex. Let's do it by targeted string replacement.
// Let's replace the top of the map item.
const mapTopStr = `          return (
            <div 
              key={lesson.day}
              className={\`relative bg-neutral-800 p-5 rounded-3xl border transition-all \${
                isCurrent 
                  ? 'border-neutral-800 shadow-md' 
                  : isAvailable 
                    ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                    : 'border-neutral-700 opacity-60'
              }\`}
            >`;

const mapTopNew = `          const isFogOfWar = !isDev && lesson.day > courseProgress.currentDay;

          if (isFogOfWar) {
            return (
              <div 
                key={lesson.day}
                className="relative bg-neutral-800/30 p-5 rounded-3xl border border-dashed border-neutral-700/50 flex flex-col items-center justify-center min-h-[140px] gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <Lock className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-neutral-400 font-medium text-sm tracking-wide uppercase mb-1">День {lesson.day}</h3>
                  <p className="text-neutral-500 text-xs">Откроется после завершения текущего дня</p>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={lesson.day}
              className={\`relative bg-neutral-800 p-5 rounded-3xl border transition-all \${
                isCurrent 
                  ? 'border-neutral-800 shadow-md' 
                  : isAvailable 
                    ? 'border-neutral-700 hover:border-neutral-600 shadow-sm' 
                    : 'border-neutral-700 opacity-60'
              }\`}
            >`;

code = code.replace(mapTopStr, mapTopNew);

fs.writeFileSync('src/screens/Course.tsx', code);

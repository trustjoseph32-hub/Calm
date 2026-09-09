import re

with open('src/screens/Course.tsx', 'r') as f:
    content = f.read()

target = """const SlideRenderer = ({ slides, actions, handleAction }: { slides: string[], actions: any[], handleAction: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  return (
    <div className="space-y-6">
      <div className="relative min-h-[120px] bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center justify-center text-center">
        <p className="text-neutral-300 text-base leading-relaxed">
          {slides[currentSlide]}
        </p>
      </div>"""

replacement = """const SlideRenderer = ({ slides, actions, handleAction }: { slides: string[], actions: any[], handleAction: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative min-h-[120px] bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center justify-center text-center select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <p className="text-neutral-300 text-base leading-relaxed pointer-events-none">
          {slides[currentSlide]}
        </p>
      </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced touch logic")
else:
    print("Could not find target touch logic")

target_buttons = """      <div className="flex gap-4">
        {currentSlide > 0 && (
          <button 
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="flex-1 py-3 rounded-xl font-medium text-neutral-400 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          >
            Назад
          </button>
        )}
        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="flex-1 py-3 rounded-xl font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            Далее
          </button>
        ) : ("""

replacement_buttons = """      <div className="flex gap-4 w-full">
        {currentSlide > 0 && (
          <button 
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="hidden sm:block flex-1 py-3 rounded-xl font-medium text-neutral-400 bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
          >
            Назад
          </button>
        )}
        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="hidden sm:block flex-1 py-3 rounded-xl font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors"
          >
            Далее
          </button>
        ) : ("""

if target_buttons in content:
    content = content.replace(target_buttons, replacement_buttons)
    print("Replaced buttons classes")
else:
    print("Could not find target buttons logic")

with open('src/screens/Course.tsx', 'w') as f:
    f.write(content)


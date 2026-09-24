import React from 'react';

interface TappingIllustrationProps {
  mode: 'ears' | 'shoulders' | 'chest';
  animated?: boolean;
}

export const TappingIllustration: React.FC<TappingIllustrationProps> = ({ 
  mode 
}) => {
  if (mode === 'ears') {
    return (
      <div className="w-full max-w-[340px] mx-auto my-2.5 flex flex-col items-center">
        {/* Чистая фотография без рамок с естественными закругленными краями */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
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
      <div className="w-full max-w-[340px] mx-auto my-2.5 flex flex-col items-center">
        {/* Чистая фотография без рамок с естественными закругленными краями */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="/chest_hand.webp?v=2" 
            alt="Положение ладони на уровне верхней части груди"
            className="w-full h-auto object-cover block"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.src.includes('chest_hand.jpg')) {
                img.src = '/chest_hand.jpg?v=2';
              }
            }}
          />
        </div>
      </div>
    );
  }

  // mode === 'shoulders' («Объятие бабочки»)
  return (
    <div className="w-full max-w-[340px] mx-auto my-2.5 flex flex-col items-center">
      {/* Чистая фотография без рамок с естественными закругленными краями */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="/butterfly_hug_front.webp" 
          alt="Положение «Объятие бабочки» (ладони на плечах)"
          className="w-full h-auto object-cover block"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (!img.src.endsWith('butterfly_hug_front.jpg')) {
              img.src = '/butterfly_hug_front.jpg';
            }
          }}
        />
      </div>
    </div>
  );
};

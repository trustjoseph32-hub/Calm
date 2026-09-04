import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioPlayerProps {
  src: string;
  onComplete: () => void;
  title?: string;
}

export function AudioPlayer({ src, onComplete, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
      
      // Complete at 90% or higher
      if (audio.currentTime / audio.duration >= 0.9 && !hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [src, hasCompleted, onComplete]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 flex flex-col items-center gap-6 relative overflow-hidden">
      {/* Background Ripple Animation */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.5, 2] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-indigo-500/30"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-4 w-full">
        {title && <h4 className="text-sm font-medium text-neutral-300 mb-2">{title}</h4>}
        
        {/* Play Button with Metallic Effect */}
        <button
          onClick={togglePlay}
          className="relative w-16 h-16 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-indigo-800 text-white flex items-center justify-center shrink-0 border border-indigo-300/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_6px_rgba(0,0,0,0.5),0_6px_12px_rgba(79,70,229,0.4)] transition-transform active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-indigo-100 drop-shadow-md" strokeWidth={1.5} />
          ) : (
            <Play className="w-6 h-6 fill-indigo-100 drop-shadow-md ml-1" strokeWidth={1.5} />
          )}
        </button>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3 text-xs text-neutral-500 font-medium">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div className="relative flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
            <input 
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

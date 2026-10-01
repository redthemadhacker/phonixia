import React, { useState } from 'react';
import { PhonicsPictureClue, getPictureClue } from '../utils/phonicsPictures';
import { sounds } from '../utils/audio';
import { Sparkles, Volume2, Maximize2, X, Heart, Star } from 'lucide-react';

interface CutePicturePromptProps {
  targetSound?: string;
  word?: string;
  instruction?: string;
  soundCue?: string;
  builderTarget?: string;
  stageNumber?: number;
  landId?: string;
  isSimplerLevel?: boolean;
  className?: string;
}

export const CutePicturePrompt: React.FC<CutePicturePromptProps> = ({
  targetSound,
  word,
  instruction,
  soundCue,
  builderTarget,
  stageNumber = 1,
  landId = 'sound-shallows',
  isSimplerLevel = true,
  className = '',
}) => {
  const clue: PhonicsPictureClue = getPictureClue({
    targetSound,
    word,
    instruction,
    soundCue,
    builderTarget,
    stageNumber,
    landId,
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  const handleTapPicture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsAnimating(true);
    setSparkleCount((c) => c + 1);

    sounds.playCollect();
    sounds.speak(clue.spokenHint);

    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // Determine CSS animation style for cute emoji
  const getAnimationClass = () => {
    if (isAnimating) return 'scale-125 rotate-12 transition-transform duration-300';
    switch (clue.animation) {
      case 'tail-wag':
        return 'animate-bounce-gentle';
      case 'wiggle':
        return 'hover:rotate-12 transition-transform';
      case 'hop':
        return 'animate-bounce';
      case 'spin-slow':
        return 'animate-spin-slow';
      case 'pulse-gentle':
        return 'animate-pulse';
      case 'float':
        return 'animate-bounce-gentle';
      default:
        return 'animate-bounce-gentle';
    }
  };

  return (
    <>
      <div className={`inline-flex flex-col sm:flex-row items-center gap-2 ${className}`}>
        {/* The Cute Interactive Picture Card Button */}
        <button
          type="button"
          onClick={handleTapPicture}
          title={`Tap to see and hear cute ${clue.word}!`}
          className={`group relative flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r ${clue.gradient} border-2 ${clue.borderColor} shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95 transition-all select-none hover:shadow-[0_0_28px_rgba(245,158,11,0.8)]`}
        >
          {/* Glowing Animated Emoji Badge */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950/80 border border-white/40 shadow-inner">
            <span
              className={`text-2xl sm:text-3xl filter drop-shadow select-none ${getAnimationClass()}`}
            >
              {clue.emoji}
            </span>
            {isAnimating && (
              <span className="absolute -top-1 -right-1 text-xs animate-ping">
                ✨
              </span>
            )}
          </div>

          {/* Read-Aloud Prompt Trigger (No written hint words displayed) */}
          <div className="flex items-center gap-1.5 px-1">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/70 border border-white/30 text-amber-300 font-bold text-xs shadow-inner">
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">Read Aloud</span>
            </div>
          </div>
          {/* Expand Fullscreen Button */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowLargeModal(true);
              sounds.playCollect();
            }}
            title="Open Large Picture Card"
            className="ml-1 p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white cursor-pointer transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* EXPANDED FULLSCREEN TACTILE PICTURE CARD MODAL FOR YOUNG CHILDREN */}
      {showLargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
          <div
            className={`relative w-full max-w-sm sm:max-w-md bg-gradient-to-b ${clue.gradient} rounded-3xl p-6 border-4 ${clue.borderColor} shadow-[0_0_50px_rgba(245,158,11,0.8)] text-center text-white space-y-4`}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLargeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/30 text-xs font-black tracking-widest uppercase">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Sound Clue</span>
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </div>

            {/* Giant Animated Character / Object */}
            <div
              onClick={() => handleTapPicture()}
              className="w-36 h-36 mx-auto rounded-3xl bg-slate-950/80 border-2 border-white/40 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <span className={`text-7xl filter drop-shadow ${getAnimationClass()}`}>
                {clue.emoji}
              </span>
            </div>

            {/* Picture Read-Aloud Clue (No written answer words) */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-black text-amber-200 bg-black/40 inline-block px-4 py-1.5 rounded-2xl border border-amber-400/40">
                Tap Emoji or Button to Listen!
              </p>
            </div>

            {/* Tap to Speak / Play Again */}
            <button
              type="button"
              onClick={() => handleTapPicture()}
              className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border-2 border-amber-400 text-amber-300 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Tap to Hear Sound!</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

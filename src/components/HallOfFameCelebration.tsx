import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Crown, CheckCircle2, Star, Camera, Sparkles, Award } from 'lucide-react';

interface HallOfFameCelebrationProps {
  onDismiss: () => void;
  isReplay?: boolean;
}

export const HallOfFameCelebration: React.FC<HallOfFameCelebrationProps> = ({ onDismiss, isReplay = false }) => {
  const { activeExplorer } = useGame();

  const [step, setStep] = useState<number>(0);
  const [walkProgress, setWalkProgress] = useState<number>(0);
  const [photoFlash, setPhotoFlash] = useState(false);

  useEffect(() => {
    sounds.playFanfare();
    sounds.speak(
      `All hail ${activeExplorer.name}! The Shadow King has fallen! The Golden Phonix is rescued! Approach for your coronation!`,
      0.95,
      1.1
    );

    const walkTimer = setInterval(() => {
      setWalkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(walkTimer);
          setTimeout(() => setStep(1), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    return () => clearInterval(walkTimer);
  }, [activeExplorer.name]);

  useEffect(() => {
    if (step === 1) {
      sounds.playSuccess();
      confetti({ particleCount: 65, spread: 80, origin: { y: 0.5 } });
      sounds.speak(`By the power of the Golden Phonix, ${activeExplorer.name} is crowned Eternal Flamekeeper!`);

      const photoTimer = setTimeout(() => {
        setStep(2);
      }, 3200);
      return () => clearTimeout(photoTimer);
    }
  }, [step, activeExplorer.name]);

  useEffect(() => {
    if (step === 2) {
      setPhotoFlash(true);
      sounds.playCollect();

      try {
        const wallKey = 'phonixia_wall_of_fame';
        const currentWall = JSON.parse(localStorage.getItem(wallKey) || '[]');
        const entry = {
          explorerName: activeExplorer.name,
          date: new Date().toLocaleDateString(),
          stars: activeExplorer.totalStars,
          customization: activeExplorer.customization,
        };
        localStorage.setItem(wallKey, JSON.stringify([entry, ...currentWall.slice(0, 15)]));
      } catch {}

      const flashTimer = setTimeout(() => {
        setPhotoFlash(false);
        setStep(3);
      }, 700);
      return () => clearTimeout(flashTimer);
    }
  }, [step, activeExplorer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md select-none overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-radial from-amber-500/20 via-slate-950 to-slate-950 pointer-events-none" />

      {photoFlash && (
        <div className="absolute inset-0 z-60 bg-white transition-opacity duration-300 pointer-events-none" />
      )}

      {step === 0 && (
        <div className="relative w-full max-w-2xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_80px_rgba(245,158,11,0.5)]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono font-black text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Grand Coronation Aisle</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-200 font-display">
            The Citizens of Phonixia Cheer for {activeExplorer.name}!
          </h2>

          <div className="relative h-64 bg-gradient-to-b from-purple-950 via-slate-950 to-stone-900 rounded-2xl border-2 border-amber-500/40 overflow-hidden flex flex-col justify-end">
            <div className="absolute top-4 inset-x-0 flex justify-between px-8 text-2xl opacity-75">
              <span className="animate-bounce">👑</span>
              <span>🏛️</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🎉</span>
              <span>🏛️</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🔥</span>
            </div>

            <div className="absolute inset-x-12 bottom-0 h-32 bg-gradient-to-t from-rose-700 via-rose-800 to-rose-900 border-x-4 border-amber-400 shadow-2xl" />

            <div
              style={{
                left: `${18 + walkProgress * 0.64}%`,
                bottom: '24px',
              }}
              className="absolute z-20 transition-all duration-100 flex flex-col items-center -translate-x-1/2"
            >
              <div className="text-[10px] font-black text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-400 mb-1">
                {activeExplorer.name}
              </div>
              <AvatarRenderer
                customization={activeExplorer.customization}
                size={70}
                isWalking={true}
                walkCycle={walkProgress}
              />
            </div>

            <div className="absolute right-6 bottom-8 z-10 flex flex-col items-center">
              <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">🪑</span>
              <span className="text-[9px] font-bold text-amber-300 uppercase">Flame Throne</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-bold animate-pulse">
            Walking to the Royal Altar of Flamekeepers...
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="relative w-full max-w-xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-[0_0_80px_rgba(245,158,11,0.6)] animate-scale-up">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono font-black text-xs uppercase tracking-widest">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>The Coronation</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>

          <div className="relative mx-auto w-36 h-36 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)]">
            <AvatarRenderer customization={activeExplorer.customization} size={90} />
            <div className="absolute -top-3 text-4xl animate-bounce filter drop-shadow-[0_0_15px_rgba(245,158,11,1)]">
              👑
            </div>
          </div>

          <h1 className="text-2xl font-black text-amber-300 font-display">
            A New Sovereign of Words!
          </h1>
          <p className="text-xs text-amber-100 font-bold max-w-md mx-auto">
            The Royal Scepter has crowned {activeExplorer.name}! Rescuer of the Golden Phonix!
          </p>

          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-mono">
            <Camera className="w-4 h-4 animate-pulse" />
            <span>Snapping Wall of Fame Photograph...</span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/90 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_80px_rgba(245,158,11,0.5)] animate-scale-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 font-mono font-black text-xs uppercase tracking-widest shadow-md">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Wall of Fame Photograph</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>

          <div className="relative mx-auto w-44 h-44 rounded-2xl bg-slate-950 border-4 border-amber-300 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.6)] rotate-1">
            <AvatarRenderer customization={activeExplorer.customization} size={110} facing="down" showPet={true} />
            <div className="absolute top-1 right-2 text-2xl">👑</div>
            <div className="absolute bottom-1 inset-x-0 bg-black/85 py-1 text-[9px] font-mono font-bold text-amber-300 border-t border-amber-500/50">
              WALL OF FAME · {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300 font-display uppercase tracking-wider">
              {activeExplorer.name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-200">
              Rescuer of the Golden Phonix &amp; Eternal Flamekeeper
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
              {isReplay
                ? 'Your historic coronation photograph is permanently displayed on the Wall of Fame!'
                : 'Your victory photograph has been mounted on the Wall of Fame in the Home Hut! Rewatch this ceremony anytime from the Legends tab!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/90 border border-amber-500/40">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Stars</span>
              <div className="flex items-center gap-1 text-sm font-black text-amber-400 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{activeExplorer.totalStars}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Realms Cleared</span>
              <div className="flex items-center gap-1 text-sm font-black text-teal-400 font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>5 / 5</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Coronation</span>
              <span className="text-xs font-black text-rose-400 font-mono">CROWNED</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playSuccess();
                onDismiss();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102 active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>{isReplay ? 'Close Wall of Fame Ceremony' : 'Continue Your Legend in Phonixia'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
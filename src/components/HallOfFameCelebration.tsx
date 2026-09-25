import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { Trophy, Star, Sparkles, Crown, CheckCircle2, Award, Flame } from 'lucide-react';

interface HallOfFameCelebrationProps {
  onDismiss: () => void;
}

export const HallOfFameCelebration: React.FC<HallOfFameCelebrationProps> = ({ onDismiss }) => {
  const { activeExplorer } = useGame();

  useEffect(() => {
    sounds.playFanfare();
    sounds.speak(
      `Hear ye, hear ye! All five realms conquered! All hail ${activeExplorer.name}, inducted into the Phonixia Hall of Fame!`,
      0.95,
      1.15
    );
  }, [activeExplorer.name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      {/* Decorative Golden Particle Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-amber-950/90 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.5)] animate-scale-up overflow-hidden">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 font-mono font-black text-xs uppercase tracking-widest shadow-md">
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Hall of Fame Inductee</span>
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>

        {/* Grand Avatar Showcase */}
        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-950/90 border-4 border-amber-400 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.6)]">
          <AvatarRenderer customization={activeExplorer.customization} size={110} facing="down" showPet={true} />
          <div className="absolute top-1 right-2 text-2xl animate-bounce">👑</div>
        </div>

        {/* Honor Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-amber-300 font-display uppercase tracking-wider drop-shadow-md">
            {activeExplorer.name}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-amber-200">
            Grand Scholar of the Phoenix Citadel
          </p>
          <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
            By mastering all 250 challenges across Sound Shallows, Builders Guild, Tricky Trails, Whispering Peaks, and Lexicon Empire, your name is permanently inscribed in the Annals of Phonixia!
          </p>
        </div>

        {/* Milestone Stats Grid */}
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
            <span className="text-[10px] text-slate-400 font-bold uppercase">Rank</span>
            <div className="flex items-center gap-1 text-sm font-black text-rose-400 font-mono">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              <span>Level 50</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playSuccess();
              onDismiss();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Enter the World as a Hall of Fame Scholar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
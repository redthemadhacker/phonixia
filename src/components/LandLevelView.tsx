import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PHONIXIA_LANDS } from '../data/curriculumData';
import { LandId } from '../types/character';
import { sounds } from '../utils/audio';
import { ArrowLeft, Star, Play, Trophy, CheckCircle2, Award } from 'lucide-react';

interface LandLevelViewProps {
  landId: LandId;
  onBackToWorld: () => void;
}

export const LandLevelView: React.FC<LandLevelViewProps> = ({ landId, onBackToWorld }) => {
  const { activeExplorer, updateExplorerScore, awardCurrency } = useGame();

  const land = PHONIXIA_LANDS.find((l) => l.id === landId) || PHONIXIA_LANDS[0];
  const landProgress = activeExplorer.landScores[landId] || { completedGamesCount: 0, stars: 0, unlocked: true };

  const [activeGameIndex, setActiveGameIndex] = useState<number | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const handleCompleteGame = (levelIndex: number) => {
    sounds.playFanfare();
    updateExplorerScore(landId, 1, 3);
    awardCurrency(10, 1);
    setCelebrationMessage(`Level ${levelIndex + 1} Completed! +3 Stars & +10 Coins!`);
    setTimeout(() => {
      setActiveGameIndex(null);
      setCelebrationMessage(null);
    }, 2000);
  };

  return (
    <div className="relative w-full max-w-[1400px] min-h-[85vh] mx-auto rounded-3xl overflow-hidden border-4 border-amber-500/50 shadow-2xl bg-slate-950 flex flex-col p-4 sm:p-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-amber-500/30">
        <button
          onClick={() => {
            sounds.playStep();
            onBackToWorld();
          }}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border-2 border-amber-400/70 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to World Map</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-amber-300 font-display tracking-wide uppercase">
            {land.name}
          </h1>
          <p className="text-xs text-slate-300">
            {land.description || 'Explore phonic challenges and master reading skills!'}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-bold text-amber-300 bg-slate-900 px-4 py-2 rounded-2xl border border-amber-500/40 shadow-inner">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{landProgress.stars} Stars</span>
          </span>
          <span>·</span>
          <span>{landProgress.completedGamesCount}/50 Games</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-6 flex flex-col justify-center items-center">
        {celebrationMessage ? (
          <div className="p-8 rounded-3xl bg-amber-500/20 border-4 border-amber-400 text-center space-y-4 animate-scale-up shadow-[0_0_50px_rgba(245,158,11,0.5)]">
            <Trophy className="w-16 h-16 mx-auto text-amber-400 animate-bounce" />
            <h2 className="text-2xl font-black text-amber-300 font-display uppercase">Fantastic Job!</h2>
            <p className="text-base font-bold text-slate-100">{celebrationMessage}</p>
          </div>
        ) : activeGameIndex !== null ? (
          <div className="w-full max-w-2xl bg-slate-900/95 border-2 border-amber-400 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-scale-up">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/40">
              Level {activeGameIndex + 1} Challenge
            </div>
            <h2 className="text-2xl font-black text-slate-100 font-display">
              {land.levels[activeGameIndex]?.title || `Game Challenge ${activeGameIndex + 1}`}
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Skill Focus: <b className="text-amber-400">{land.levels[activeGameIndex]?.skillFocus || 'Phonics Mastery'}</b>
            </p>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-sm">
              🎮 Interactive reading activity active! Tap below when you complete the reading challenge.
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveGameIndex(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Quit Level
              </button>
              <button
                onClick={() => handleCompleteGame(activeGameIndex)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Complete & Claim Rewards</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 text-center mb-2">
              Select a Realm Level to Play
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {land.levels.map((lvl, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sounds.playStep();
                    setActiveGameIndex(idx);
                  }}
                  className="p-5 rounded-2xl bg-slate-900/90 border-2 border-slate-800 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono font-black text-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100 font-display group-hover:text-amber-300 transition-colors">
                        {lvl.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Focus: <span className="text-slate-300 font-medium">{lvl.skillFocus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform border border-slate-800">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-amber-500/30 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Award className="w-4 h-4 text-amber-400" />
        <span>Completing levels awards 3 Stars and 10 Coins to active explorer: <b className="text-amber-300">{activeExplorer.name}</b></span>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ALL_MINIGAMES, MinigameItem } from '../data/minigamesData';
import { ArrowLeft, Play, Sparkles, Volume2, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

interface ShellshoreArcadeProps {
  onBackToWorld: () => void;
}

export const ShellshoreArcade: React.FC<ShellshoreArcadeProps> = ({ onBackToWorld }) => {
  const { activeExplorer, recordMinigameScore } = useGame();
  
  // Filter for Shellshore Arcade games (12 games)
  const arcadeGames = ALL_MINIGAMES.filter(g => g.hub === 'shellshore-arcade');

  const [activeGame, setActiveGame] = useState<MinigameItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const handleLaunchGame = (game: MinigameItem) => {
    sounds.playStep();
    setActiveGame(game);
    setSelectedOption(null);
    setHasChecked(false);
    setIsCorrect(false);
    sounds.speak(game.prompt);
  };

  const handleCheckAnswer = () => {
    if (!activeGame || !selectedOption || hasChecked) return;

    const correct = selectedOption.toLowerCase() === activeGame.correctAnswer.toLowerCase();
    setHasChecked(true);
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      confetti({ particleCount: 40, spread: 60 });
      setScore(prev => prev + activeGame.scoreReward);
      recordMinigameScore('pearlDiver', score + activeGame.scoreReward);
    } else {
      sounds.playError();
    }
  };

  const handleNextGame = () => {
    if (!activeGame) return;
    const currentIndex = arcadeGames.findIndex(g => g.id === activeGame.id);
    const nextGame = arcadeGames[(currentIndex + 1) % arcadeGames.length];
    handleLaunchGame(nextGame);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Arcade HUD Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-slate-900 border-2 border-sky-400/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToWorld}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>World Map</span>
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Seaside Boardwalk Arcade · 12 Cabinets
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-display">
              Shellshore Arcade
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Session Tokens: {score}</span>
          </div>
          <div className="text-xs text-slate-300">
            Explorer: <b className="text-amber-400">{activeExplorer.name}</b>
          </div>
        </div>
      </div>

      {/* Main Grid: 12 Arcade Cabinets */}
      {!activeGame ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {arcadeGames.map((game, index) => (
            <div
              key={game.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-400/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/30">
                    Cabinet {index + 1} of 12
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 font-game mb-1.5">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {game.prompt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold">
                  +{game.scoreReward} tokens
                </span>
                <button
                  onClick={() => handleLaunchGame(game)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Insert Token</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Cabinet Arena */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-sky-400/50 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Arcade</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => sounds.speak(activeGame.prompt)}
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat Voice</span>
              </button>
              <span className="text-xs font-mono text-amber-400 font-bold">
                +{activeGame.scoreReward} tokens
              </span>
            </div>
          </div>

          {/* Prompt Banner */}
          <div className="text-center space-y-2 py-4">
            <div className="text-4xl animate-bounce-gentle">{activeGame.icon}</div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-display">
              {activeGame.prompt}
            </h2>
          </div>

          {/* Interactive Answer Options */}
          <div className="grid grid-cols-2 gap-3.5 max-w-lg mx-auto">
            {activeGame.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let style = 'bg-slate-800 border-slate-700 hover:border-sky-400/60 text-slate-200';

              if (hasChecked) {
                if (option.toLowerCase() === activeGame.correctAnswer.toLowerCase()) {
                  style = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-600/30 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-800/40 border-slate-800 text-slate-600';
                }
              } else if (isSelected) {
                style = 'bg-sky-500/20 border-sky-400 text-sky-200 scale-102';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (hasChecked) return;
                    sounds.playStep();
                    setSelectedOption(option);
                  }}
                  disabled={hasChecked}
                  className={`p-4 rounded-2xl border-2 font-bold text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${style}`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {hasChecked && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider">
                  {isCorrect ? 'Rule Mastered!' : 'Boardwalk Wisdom'}
                </div>
                <div className="text-xs leading-relaxed text-slate-300">
                  {activeGame.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {!hasChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-40 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setHasChecked(false);
                    setSelectedOption(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleNextGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <span>Next Arcade Cabinet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

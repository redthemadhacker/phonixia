import React, { useState } from 'react';
import { GameChallenge } from '../types/curriculum';
import { LandId } from '../types/character';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle, Star } from 'lucide-react';

interface GameEngineProps {
  challenge: GameChallenge;
  landId: LandId;
  levelNumber: number;
  onComplete: (starsEarned: number, score: number) => void;
  onClose: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  challenge,
  landId,
  levelNumber,
  onComplete,
  onClose
}) => {
  const { recordGameCompletion, activeExplorer } = useGame();

  // Word builder state
  const [selectedLetterSequence, setSelectedLetterSequence] = useState<string[]>([]);
  // Single selection state for other modes
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Play spoken sound on mount or click
  const handlePlayAudio = (slow: boolean = false) => {
    if (slow) {
      sounds.speakPhonicsSlow(challenge.spokenAudioText || challenge.targetSoundOrWord);
    } else {
      sounds.speak(challenge.spokenAudioText || challenge.targetSoundOrWord);
    }
  };

  // Word builder tile toggle
  const handleTileClick = (letter: string) => {
    if (hasSubmitted) return;
    sounds.playStep();
    setSelectedLetterSequence(prev => [...prev, letter]);
  };

  const handleTileRemove = (idx: number) => {
    if (hasSubmitted) return;
    sounds.playStep();
    setSelectedLetterSequence(prev => prev.filter((_, i) => i !== idx));
  };

  const handleResetBuilder = () => {
    if (hasSubmitted) return;
    sounds.playStep();
    setSelectedLetterSequence([]);
  };

  // Check answer
  const handleSubmit = () => {
    if (hasSubmitted) return;
    setAttempts(prev => prev + 1);

    let correct = false;

    if (challenge.type === 'WORD_BUILDER' || Array.isArray(challenge.correctAnswer)) {
      const builtString = selectedLetterSequence.join('').toLowerCase();
      const expected = Array.isArray(challenge.correctAnswer)
        ? challenge.correctAnswer.join('').toLowerCase()
        : challenge.correctAnswer.toLowerCase();
      correct = builtString === expected;
    } else {
      if (!selectedOption) return;
      correct = selectedOption.toLowerCase() === (challenge.correctAnswer as string).toLowerCase();
    }

    setHasSubmitted(true);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Calculate star score (3 stars on 1st attempt, 2 stars on 2nd, 1 star thereafter)
      const starsEarned = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      const score = starsEarned * 100;

      recordGameCompletion(landId, levelNumber, challenge.gameNumber, starsEarned, score, true);
    } else {
      sounds.playError();
      recordGameCompletion(landId, levelNumber, challenge.gameNumber, 1, 30, false);
    }
  };

  const handleNext = () => {
    const starsEarned = isCorrect ? (attempts <= 1 ? 3 : 2) : 1;
    onComplete(starsEarned, starsEarned * 100);
  };

  const handleRetry = () => {
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setSelectedLetterSequence([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header HUD */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
              #{challenge.gameNumber}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-game">
                {challenge.title}
              </h3>
              <p className="text-[11px] text-amber-400">
                Difficulty Level {challenge.difficultyRating} of 5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayAudio(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Listen</span>
            </button>
            <button
              onClick={() => handlePlayAudio(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs font-medium cursor-pointer"
              title="Speak sound slowly"
            >
              🐢 Slow
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Phonics Rule Tip Bar */}
        <div className="px-6 py-2 bg-amber-950/20 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-200/90">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span><b>Phonics Rule:</b> {challenge.phonicsRuleTip}</span>
        </div>

        {/* Challenge Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center space-y-6">
          {/* Main Question / Prompt */}
          <div className="text-center space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-display">
              {challenge.prompt}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Target: <b className="text-amber-300">{challenge.targetSoundOrWord}</b></span>
            </div>
          </div>

          {/* Interactive Mode 1: WORD BUILDER (Letter Blocks Assembler) */}
          {(challenge.type === 'WORD_BUILDER' || Array.isArray(challenge.correctAnswer)) ? (
            <div className="space-y-5">
              {/* Assembled Word Tray */}
              <div className="min-h-16 p-3 bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/50 flex items-center justify-center gap-2">
                {selectedLetterSequence.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">
                    Tap the letter blocks below in order to spell the word
                  </span>
                ) : (
                  selectedLetterSequence.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTileRemove(idx)}
                      disabled={hasSubmitted}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black text-xl shadow-md border-b-4 border-amber-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {letter}
                    </button>
                  ))
                )}
              </div>

              {/* Action Buttons: Reset & Letter Block Pool */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Available Letter Blocks:</span>
                {selectedLetterSequence.length > 0 && !hasSubmitted && (
                  <button
                    onClick={handleResetBuilder}
                    className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Blocks
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {challenge.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleTileClick(opt)}
                    disabled={hasSubmitted}
                    className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-xl shadow-lg border border-slate-700 hover:border-amber-400/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Interactive Mode 2: Multi-Option Phonics Tiles */
            <div className="grid grid-cols-2 gap-3.5 max-w-lg mx-auto w-full">
              {challenge.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let btnStyle = 'bg-slate-800 border-slate-700 hover:border-amber-400/60 text-slate-200';

                if (hasSubmitted) {
                  if (option.toLowerCase() === (challenge.correctAnswer as string).toLowerCase()) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md scale-102';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasSubmitted) return;
                      setSelectedOption(option);
                      sounds.playStep();
                    }}
                    disabled={hasSubmitted}
                    className={`p-4 rounded-2xl border-2 text-center text-base sm:text-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${btnStyle}`}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback & Phonics Explanation Banner */}
          {showExplanation && (
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
                  {isCorrect ? 'Correct! Phonics Mastered' : 'Not Quite - Learn the Pattern'}
                </div>
                <div className="text-xs leading-relaxed text-slate-300">
                  {challenge.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Explorer: <b>{activeExplorer.name}</b></span>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              +15 Coins
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!hasSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={
                  (challenge.type === 'WORD_BUILDER' || Array.isArray(challenge.correctAnswer))
                    ? selectedLetterSequence.length === 0
                    : !selectedOption
                }
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : isCorrect ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Next Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
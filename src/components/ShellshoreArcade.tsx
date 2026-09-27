import React, { useState, useEffect, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { ALL_50_MINIGAMES, MinigameDefinition } from '../data/minigamesCurriculum';
import { 
  ArrowLeft, ArrowRight, Volume2, RotateCcw, Flame, CheckCircle2, 
  Coins, Sparkles, Star, Play, ChevronsUp, Gamepad2, Zap
} from 'lucide-react';
import shellshoreBg from '../../shellshore.jpeg';

interface ShellshoreArcadeProps {
  onBackToWorld: () => void;
}

export const ShellshoreArcade: React.FC<ShellshoreArcadeProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);

  // Shellshore Arcade houses Games 26 through 50 (Early Middle through Early High School)
  const arcadeGames = React.useMemo(() => {
    return ALL_50_MINIGAMES.filter(g => g.hub === 'shellshore-arcade');
  }, []);

  const [activeGame, setActiveGame] = useState<MinigameDefinition | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [playerCabinetNum, setPlayerCabinetNum] = useState<number>(26);
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isWalkingToCabinet, setIsWalkingToCabinet] = useState<boolean>(false);

  // Interactive Character & Tool Animation states in Arcade Modal
  const [playerCol, setPlayerCol] = useState<number>(0);
  const [isActing, setIsActing] = useState<boolean>(false);
  const [actionEffect, setActionEffect] = useState<{ col: number; text: string; icon: string } | null>(null);

  const launchCabinet = useCallback((game: MinigameDefinition) => {
    setPlayerCabinetNum(game.gameNum);
    setIsWalkingToCabinet(true);
    sounds.playStep();

    setTimeout(() => {
      setIsWalkingToCabinet(false);
      setActiveGame(game);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setPlayerCol(0);
      setIsActing(false);
      setActionEffect(null);
      sounds.playJump();
      sounds.speak(game.spokenAudioCue || game.howToPlay);
    }, 280);
  }, []);

  const triggerCabinetJump = useCallback((gameTarget?: MinigameDefinition) => {
    if (isJumping) return;
    setIsJumping(true);
    sounds.playJump();

    const targetGame = gameTarget || arcadeGames.find(g => g.gameNum === playerCabinetNum) || arcadeGames[0];

    const startTime = performance.now();
    const jumpDuration = 400;
    const maxDisplacement = 35;

    const animateJump = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / jumpDuration, 1);
      const height = Math.sin(progress * Math.PI) * maxDisplacement;
      setJumpOffset(height);

      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        setJumpOffset(0);
        setIsJumping(false);
        launchCabinet(targetGame);
      }
    };

    requestAnimationFrame(animateJump);
  }, [isJumping, arcadeGames, playerCabinetNum, launchCabinet]);

  const handleChoice = (opt: string) => {
    if (!activeGame || isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const win = opt.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      sounds.playSuccess();
      awardCurrency(10, 2);
      setStreak(s => s + 1);
    } else {
      sounds.playError();
      sounds.speak('Try again!');
    }
  };

  // Arcade Tool Action (Arcade Laser, Crystal Smasher, Target Blaster, Sonic Net)
  const executeArcadeAction = useCallback((targetCol: number) => {
    if (!activeGame || isAnswered || isActing) return;

    setPlayerCol(targetCol);
    setIsActing(true);

    let effectText = 'ZAP!';
    let effectIcon = '⚡';

    if (activeGame.mechanicType === 'whack') {
      effectText = 'SMASH!';
      effectIcon = '🔨💥';
      sounds.playJump();
    } else if (activeGame.mechanicType === 'basket-catch') {
      effectText = 'CAPTURED!';
      effectIcon = '🕸️✨';
      sounds.playWhoosh();
    } else if (activeGame.mechanicType === 'slingshot' || activeGame.mechanicType === 'target-blast') {
      effectText = 'BLAST!';
      effectIcon = '⚡🎯';
      sounds.playLaser();
    } else {
      effectText = 'LOCKED!';
      effectIcon = '💎✨';
      sounds.playCollect();
    }

    setActionEffect({ col: targetCol, text: effectText, icon: effectIcon });

    setTimeout(() => {
      const selectedChoice = activeGame.options[targetCol];
      handleChoice(selectedChoice);
    }, 280);

    setTimeout(() => {
      setIsActing(false);
      setActionEffect(null);
    }, 550);
  }, [activeGame, isAnswered, isActing]);

  // Keyboard navigation inside arcade modal
  useEffect(() => {
    if (!activeGame || isAnswered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPlayerCol(c => Math.max(0, c - 1));
        sounds.playStep();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setPlayerCol(c => Math.min(activeGame.options.length - 1, c + 1));
        sounds.playStep();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        executeArcadeAction(playerCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isAnswered, playerCol, executeArcadeAction]);

  const handleNextGameInContinuousLoop = () => {
    if (!activeGame) return;
    const nextNum = activeGame.gameNum < 50 ? activeGame.gameNum + 1 : 26;
    const nextGame = arcadeGames.find(g => g.gameNum === nextNum) || arcadeGames[0];
    launchCabinet(nextGame);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGame) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'tab' || k === 'enter') {
        e.preventDefault();
        triggerCabinetJump();
      } else if (k === 'arrowright' || k === 'd') {
        setPlayerCabinetNum((prev) => Math.min(50, prev + 1));
      } else if (k === 'arrowleft' || k === 'a') {
        setPlayerCabinetNum((prev) => Math.max(26, prev - 1));
      } else if (k === 'arrowdown' || k === 's') {
        setPlayerCabinetNum((prev) => Math.min(50, prev + 5));
      } else if (k === 'arrowup' || k === 'w') {
        setPlayerCabinetNum((prev) => Math.max(26, prev - 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, triggerCabinetJump]);

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Retro Synthwave Neon Arcade Marquee Header */}
      <div className="p-2.5 sm:p-3 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 border-b-2 border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.5)] flex items-center justify-between z-30">
        <button
          onClick={onBackToWorld}
          className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-fuchsia-300 border border-fuchsia-400 font-black text-xs sm:text-sm cursor-pointer shadow-[0_0_12px_rgba(217,70,239,0.4)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Exit Arcade</span>
        </button>

        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-mono font-black text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span className="animate-pulse">⚡</span>
            <span>SHELLSHORE RETRO ARCADE</span>
            <span className="animate-pulse">⚡</span>
          </div>
          <h1 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300 font-display">
            Grand Arcade · 25 High-Score Mini-Cabinets
            Middle & High School Greek & Latin Roots · Etymology Vault
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-black/80 px-3 py-1 rounded-xl border border-amber-400/50 shadow-inner">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{activeExplorer.coins} Credits</span>
        </div>
      </div>

      {/* Main Arcade Boardwalk Canvas with shellshore.jpeg background */}
      <div className="relative flex-1 w-full overflow-hidden select-none">
        
        {/* Real Shellshore Background Artwork */}
        <img
          src={shellshoreBg}
          alt="Shellshore Arcade Background Artwork"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-90 z-0"
        />

        {/* Neon Synthwave Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-transparent to-purple-950/60 pointer-events-none z-0" />
        
        {/* Glowing Neon Connecting Cable Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <polyline
            points={arcadeGames.map((_, idx) => {
              const row = Math.floor(idx / 5);
              const col = idx % 5;
              const xNorm = row % 2 === 0 ? col : 4 - col;
              const x = 12 + xNorm * 19;
              const y = 14 + row * 18;
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke="#d946ef"
            strokeWidth="3.5"
            strokeDasharray="8 5"
            className="animate-pulse"
            opacity="0.75"
          />
        </svg>

        {/* 25 Retro 3D Arcade Cabinets */}
        {arcadeGames.map((game, idx) => {
          const row = Math.floor(idx / 5);
          const col = idx % 5;
          const xNorm = row % 2 === 0 ? col : 4 - col;
          const x = 12 + xNorm * 19;
          const y = 14 + row * 18;
          const isHovered = hoveredNode === game.gameNum;
          const isCurrentCabinet = playerCabinetNum === game.gameNum;

          return (
            <div
              key={game.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredNode(game.gameNum)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                setPlayerCabinetNum(game.gameNum);
                triggerCabinetJump(game);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Cabinet Entity */}
              <div
                className={`relative w-12 h-14 sm:w-16 sm:h-20 rounded-2xl p-1 flex flex-col items-center justify-between border-2 transition-all duration-200 ${
                  isCurrentCabinet
                    ? 'bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-purple-800 border-white ring-4 ring-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.9)] scale-115'
                    : isHovered
                    ? 'bg-gradient-to-b from-purple-800 to-slate-900 border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.7)] scale-110'
                    : 'bg-slate-950/85 border-fuchsia-500/70 shadow-lg'
                }`}
              >
                <div className="w-full flex items-center justify-between px-1">
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-cyan-300">
                    #{game.gameNum}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <span className="text-xl sm:text-3xl filter drop-shadow">
                  {game.themeIcon}
                </span>
              </div>

              {/* Player Avatar standing on cabinet */}
              {isCurrentCabinet && (
                <div
                  style={{
                    transform: `translate(-50%, calc(-100% - ${jumpOffset}px))`,
                  }}
                  className="absolute top-0 left-1/2 z-35 pointer-events-none transition-transform flex flex-col items-center"
                >
                  <AvatarRenderer customization={activeExplorer.customization} size={42} showPet={true} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar Controls */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-purple-900/60 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-purple-950 border border-fuchsia-500/60 rounded-xl text-fuchsia-200 text-xs font-bold flex items-center gap-1.5">
            <span className="text-cyan-400">🕹️</span>
            <span>Cabinet #{playerCabinetNum}: {arcadeGames[playerCabinetNum - 26]?.name}</span>
          </div>
        </div>

        <button
          onClick={() => triggerCabinetJump()}
          className="h-10 sm:h-12 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.7)] cursor-pointer active:scale-95"
        >
          <ChevronsUp className="w-5 h-5 stroke-[3]" />
          <span>JUMP TO OPEN (SPACE)</span>
        </button>
      </div>

      {/* ACTIVE ARCADE CABINET MINIGAME MODAL */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-3xl bg-slate-900 border-3 border-fuchsia-500 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(217,70,239,0.6)] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeGame.themeIcon}</span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-fuchsia-300 uppercase tracking-wide">
                    {activeGame.name}
                  </h2>
                  <p className="text-xs text-cyan-300 font-medium">
                    Cabinet #{activeGame.gameNum} · {activeGame.skillCategory}
                    {activeGame.skillCategory} · {activeGame.gradeLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sounds.speak(activeGame.spokenAudioCue || activeGame.howToPlay)}
                  className="p-2 rounded-xl bg-purple-500/20 text-fuchsia-300 hover:bg-purple-500/40 cursor-pointer"
                  title="Hear instruction again"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 bg-slate-950/90 border border-fuchsia-500/40 rounded-2xl text-center space-y-1">
              <p className="text-sm sm:text-base font-black text-fuchsia-100">
                {activeGame.howToPlay}
              </p>
              <span className="text-xs font-mono font-bold text-cyan-300 block">
                Target Concept: {activeGame.targetSoundOrWord}
              </span>
            </div>

            {/* Real Interactive Arcade Arena: Moving Player + Themed Action Tools */}
            <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 rounded-2xl border-2 border-fuchsia-500/50 overflow-hidden flex flex-col justify-between p-3 select-none">
              
              {/* 4 Interactive Answer Stations with Animated Targets */}
              <div className="w-full flex items-center justify-around gap-2 z-20">
                {activeGame.options.map((option, idx) => {
                  const isPlayerStandingHere = playerCol === idx;
                  const isSelected = selectedOption === option;
                  const isCorrectChoice = isAnswered && option.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();

                  return (
                    <div
                      key={idx}
                      onClick={() => executeArcadeAction(idx)}
                      className={`flex-1 p-2 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                        isAnswered
                          ? isCorrect && isCorrectChoice
                            ? 'bg-emerald-600/90 border-white text-white shadow-[0_0_25px_rgba(16,185,129,1)] scale-105'
                            : isSelected && !isCorrect
                            ? 'bg-rose-900/90 border-rose-400 text-rose-200 animate-shake'
                          ? isCorrectChoice
                            ? 'bg-emerald-600/90 border-white text-white shadow-[0_0_25px_rgba(16,185,129,1)] scale-105'
                            : isSelected
                            ? 'bg-rose-900/90 border-rose-400 text-rose-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-600 opacity-40'
                          : isPlayerStandingHere
                          ? 'bg-fuchsia-950/90 border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-105'
                          : 'bg-slate-950/85 border-fuchsia-500/60 hover:border-cyan-300 text-slate-100 shadow-md'
                      }`}
                    >
                      {/* Live Target Icon */}
                      <span className="text-2xl sm:text-3xl animate-bounce pointer-events-none mb-1">
                        {activeGame.themeIcon}
                      </span>

                      {/* Answer Word / Meaning */}
                      <span className="text-sm sm:text-base font-black font-display tracking-wide block my-1">
                        {option}
                      </span>

                      {/* Tool Action Hint Badge */}
                      <span className="text-[9px] text-cyan-300 font-mono font-bold tracking-wider uppercase bg-black/50 px-2 py-0.5 rounded-full mt-1">
                        {isPlayerStandingHere ? '👉 STANDING HERE' : `STATION #${idx + 1}`}
                      </span>

                      {/* Action Impact Popup */}
                      {actionEffect && actionEffect.col === idx && (
                        <div className="absolute -top-3 z-30 px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs shadow-xl animate-ping flex items-center gap-1">
                          <span>{actionEffect.icon}</span>
                          <span>{actionEffect.text}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Free Moving Player Character at current station with Arcade Tool */}
              <div className="relative w-full h-24 flex items-end">
                <div
                  style={{
                    left: `${(playerCol * 25) + 12.5}%`,
                    transform: 'translateX(-50%)',
                    transition: 'left 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                  className="absolute bottom-1 flex flex-col items-center pointer-events-none"
                >
                  <div className="relative">
                    <AvatarRenderer customization={activeExplorer.customization} size={46} showPet={false} />
                    
                    {/* The Themed Arcade Tool (Arcade Blaster, Laser, Smasher) */}
                    <div
                      style={{
                        transform: isActing ? 'rotate(45deg) scale(1.2)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease-out'
                      }}
                      className="absolute -top-1 -right-3 text-2xl filter drop-shadow"
                    >
                      {activeGame.mechanicType === 'whack' ? '🔨' : activeGame.mechanicType === 'basket-catch' ? '🕸️' : '⚡'}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black text-cyan-300 mt-1 bg-slate-950/80 px-2 rounded-full border border-cyan-400/40">
                    {activeExplorer.name}
                  </span>
                </div>
              </div>
            </div>

            {/* In-Game Action Bar & Touch Controls (Move L/R & Strike) */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-950/90 rounded-2xl border border-fuchsia-500/40">
              <button
                type="button"
                onClick={() => {
                  setPlayerCol(c => Math.max(0, c - 1));
                  sounds.playStep();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Move Left</span>
              </button>

              <button
                type="button"
                onClick={() => executeArcadeAction(playerCol)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.7)] cursor-pointer active:scale-95 hover:brightness-110"
              >
                <span>
                  {activeGame.mechanicType === 'whack'
                    ? '🔨 SMASH TARGET (SPACE)'
                    : activeGame.mechanicType === 'basket-catch'
                    ? '🕸️ CAPTURE TARGET (SPACE)'
                    : '⚡ ARCADE BLAST (SPACE)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlayerCol(c => Math.min(activeGame.options.length - 1, c + 1));
                  sounds.playStep();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Move Right</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Result banner */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border text-center space-y-2 animate-scale-up ${
                isCorrect ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200' : 'bg-rose-950/95 border-rose-400 text-rose-200'
              }`}>
                <div className="text-sm sm:text-base font-black uppercase">
                  {isCorrect ? '⭐ Correct Etymology Synthesis!' : '❌ Not Quite Right!'}
                </div>
                {isCorrect ? (
                  <p className="text-xs sm:text-sm font-medium text-slate-200">
                    {activeGame.explanation}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-rose-300">
                    Try again! Think carefully and make your choice!
                  </p>
                )}

              <button
                type="button"
                onClick={() => executeArcadeAction(playerCol)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.7)] cursor-pointer active:scale-95 hover:brightness-110"
              >
                <span>
                  {activeGame.mechanicType === 'whack'
                    ? '🔨 SMASH TARGET (SPACE)'
                    : activeGame.mechanicType === 'basket-catch'
                    ? '🕸️ CAPTURE TARGET (SPACE)'
                    : '⚡ ARCADE BLAST (SPACE)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlayerCol(c => Math.min(activeGame.options.length - 1, c + 1));
                  sounds.playStep();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Move Right</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Result banner */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border text-center space-y-2 animate-scale-up ${
                isCorrect ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200' : 'bg-rose-950/95 border-rose-400 text-rose-200'
              }`}>
                <div className="text-sm sm:text-base font-black uppercase">
                  {isCorrect ? '⭐ Correct Etymology Synthesis!' : '❌ Incorrect Selection!'}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-200">
                  {activeGame.explanation}
                </p>

                <div className="flex items-center justify-center gap-3 pt-1">
                  {!isCorrect ? (
                    <button
                      onClick={() => {
                        setIsAnswered(false);
                        setSelectedOption(null);
                        sounds.speak(activeGame.spokenAudioCue);
                      }}
                      className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextGameInContinuousLoop}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 cursor-pointer"
                    >
                      <span>Next Cabinet ➔</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

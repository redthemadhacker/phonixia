import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { ALL_50_MINIGAMES, MinigameDefinition } from '../data/minigamesCurriculum';
import { CutePicturePrompt } from './CutePicturePrompt';
import { getMinigameVisuals } from '../utils/minigameVisuals';
import { 
  ArrowLeft, Volume2, Coins, ChevronsUp, Star, Sparkles
} from 'lucide-react';
import islesBg from '../../isles.jpeg';

interface IslesOfPlayProps {
  onClose?: () => void;
  onBackToWorld?: () => void;
  onOpenCelebration?: () => void;
  onOpenParentPortal?: () => void;
}

export const IslesOfPlay: React.FC<IslesOfPlayProps> = ({ onClose, onBackToWorld }) => {
  const handleExit = () => {
    if (onClose) onClose();
    else if (onBackToWorld) onBackToWorld();
  };
  const { activeExplorer, awardCurrency } = useGame();
  const _companionGuide = getCompanionGuide(activeExplorer);

  // Isles of Play houses Games 1 through 25 (Preschool through Late Elementary)
  const islesGames = useMemo(() => {
    return ALL_50_MINIGAMES.filter((g) => g.hub === 'isles-of-play');
  }, []);

  const [activeGame, setActiveGame] = useState<MinigameDefinition | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [_streak, setStreak] = useState(0);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [playerStallNum, setPlayerStallNum] = useState<number>(1);
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isWalkingToStall, setIsWalkingToStall] = useState<boolean>(false);
  const [boardwalkFacing, setBoardwalkFacing] = useState<'left' | 'right'>('right');

  // Interactive Character & Tool Animation states in Minigame Arena
  const [playerCol, setPlayerCol] = useState<number>(0);
  const [isActing, setIsActing] = useState<boolean>(false);
  const [stationFacing, setStationFacing] = useState<'left' | 'right'>('right');
  const [isStationMoving, setIsStationMoving] = useState<boolean>(false);
  const [actionEffect, setActionEffect] = useState<{ col: number; text: string; icon: string } | null>(null);
  const [clawDropping, setClawDropping] = useState<boolean>(false);

  const launchStall = useCallback((game: MinigameDefinition) => {
    setPlayerStallNum(game.gameNum);
    setIsWalkingToStall(true);
    sounds.playStep();

    setTimeout(() => {
      setIsWalkingToStall(false);
      setActiveGame(game);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setPlayerCol(0);
      setIsActing(false);
      setActionEffect(null);
      setClawDropping(false);
      sounds.playJump();
      sounds.speak(game.spokenAudioCue || game.howToPlay);
    }, 250);
  }, []);

  const triggerStallJump = useCallback((gameTarget?: MinigameDefinition) => {
    if (isJumping) return;
    setIsJumping(true);
    sounds.playJump();

    const targetGame = gameTarget || islesGames.find((g) => g.gameNum === playerStallNum) || islesGames[0];

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
        launchStall(targetGame);
      }
    };

    requestAnimationFrame(animateJump);
  }, [isJumping, islesGames, playerStallNum, launchStall]);

  const handleChoice = useCallback((opt: string) => {
    if (!activeGame || isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const win = opt.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      sounds.playSuccess();
      awardCurrency(10, 2);
      setStreak((s) => s + 1);
    } else {
      sounds.playError();
      sounds.speak('Try again!');
    }
  }, [activeGame, isAnswered, awardCurrency]);

  const activeVisuals = useMemo(() => {
    if (!activeGame) return null;
    return getMinigameVisuals(activeGame);
  }, [activeGame]);

  const executeMinigameAction = useCallback((targetCol: number) => {
    if (!activeGame || isAnswered || isActing || !activeVisuals) return;

    setPlayerCol(targetCol);
    setIsActing(true);

    if (activeVisuals.mechanicCategory === 'claw') {
      setClawDropping(true);
      sounds.playMinecart();
    } else if (activeVisuals.soundType === 'splash') {
      sounds.playSplash();
    } else if (activeVisuals.soundType === 'slingshot') {
      sounds.playWhoosh();
    } else if (activeVisuals.soundType === 'whack') {
      sounds.playHammer();
    } else if (activeVisuals.soundType === 'drum') {
      sounds.playCollect();
    } else if (activeVisuals.soundType === 'laser') {
      sounds.playLaser();
    } else {
      sounds.playCollect();
    }

    setActionEffect({
      col: targetCol,
      text: activeVisuals.actionEffectText,
      icon: activeVisuals.actionEffectIcon
    });

    setTimeout(() => {
      const selectedChoice = activeGame.options[targetCol];
      handleChoice(selectedChoice);
    }, 320);

    setTimeout(() => {
      setIsActing(false);
      setClawDropping(false);
      setActionEffect(null);
    }, 600);
  }, [activeGame, isAnswered, isActing, activeVisuals, handleChoice]);

  // Keyboard navigation inside minigame modal
  useEffect(() => {
    if (!activeGame || isAnswered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPlayerCol((c) => Math.max(0, c - 1));
        setStationFacing('left');
        setIsStationMoving(true);
        sounds.playStep();
        setTimeout(() => setIsStationMoving(false), 220);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setPlayerCol((c) => Math.min(activeGame.options.length - 1, c + 1));
        setStationFacing('right');
        setIsStationMoving(true);
        sounds.playStep();
        setTimeout(() => setIsStationMoving(false), 220);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        executeMinigameAction(playerCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isAnswered, playerCol, executeMinigameAction]);

  // Map keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (activeGame) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'tab' || k === 'enter') {
        e.preventDefault();
        triggerStallJump();
      } else if (k === 'arrowright' || k === 'd') {
        setPlayerStallNum((prev) => Math.min(25, prev + 1));
        setBoardwalkFacing('right');
        setIsWalkingToStall(true);
        sounds.playStep();
        setTimeout(() => setIsWalkingToStall(false), 200);
      } else if (k === 'arrowleft' || k === 'a') {
        setPlayerStallNum((prev) => Math.max(1, prev - 1));
        setBoardwalkFacing('left');
        setIsWalkingToStall(true);
        sounds.playStep();
        setTimeout(() => setIsWalkingToStall(false), 200);
      } else if (k === 'arrowdown' || k === 's') {
        setPlayerStallNum((prev) => Math.min(25, prev + 5));
        setIsWalkingToStall(true);
        sounds.playStep();
        setTimeout(() => setIsWalkingToStall(false), 200);
      } else if (k === 'arrowup' || k === 'w') {
        setPlayerStallNum((prev) => Math.max(1, prev - 5));
        setIsWalkingToStall(true);
        sounds.playStep();
        setTimeout(() => setIsWalkingToStall(false), 200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, triggerStallJump]);

  const handleNextGame = () => {
    if (!activeGame) return;
    const nextNum = activeGame.gameNum < 25 ? activeGame.gameNum + 1 : 1;
    const nextGame = islesGames.find((g) => g.gameNum === nextNum) || islesGames[0];
    launchStall(nextGame);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Tropical Island Header Bar */}
      <div className="p-2.5 sm:p-3 bg-gradient-to-r from-teal-950 via-emerald-950 to-cyan-950 border-b-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-between z-30">
        <button
          onClick={handleExit}
          className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-emerald-300 border border-emerald-400 font-black text-xs sm:text-sm cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Exit to World Map</span>
        </button>

        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-mono font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            <span>TROPICAL ISLES OF PLAY</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
          </div>
          <h1 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-teal-200 font-display">
            25 Carnival Game Stalls · Preschool to Elementary Phonics Mastery
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-black/80 px-3 py-1 rounded-xl border border-amber-400/50 shadow-inner">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{activeExplorer.coins} Coins</span>
        </div>
      </div>

      {/* Main Isles Boardwalk Canvas with isles.jpeg background */}
      <div className="relative flex-1 w-full overflow-hidden select-none">
        <img
          src={islesBg}
          alt="Isles of Play Tropical Background"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-90 z-0"
        />

        {/* Ambient Lagoon Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 via-transparent to-cyan-950/50 pointer-events-none z-0" />

        {/* Tropical Stepping Stone Trail SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <polyline
            points={islesGames.map((_, idx) => {
              const row = Math.floor(idx / 5);
              const col = idx % 5;
              const xNorm = row % 2 === 0 ? col : 4 - col;
              const x = 12 + xNorm * 19;
              const y = 14 + row * 18;
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeDasharray="8 5"
            className="animate-pulse"
            opacity="0.8"
          />
        </svg>

        {/* 25 Tropical Game Stalls */}
        {islesGames.map((game, idx) => {
          const row = Math.floor(idx / 5);
          const col = idx % 5;
          const xNorm = row % 2 === 0 ? col : 4 - col;
          const x = 12 + xNorm * 19;
          const y = 14 + row * 18;
          const isHovered = hoveredNode === game.gameNum;
          const isCurrentStall = playerStallNum === game.gameNum;

          return (
            <div
              key={game.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredNode(game.gameNum)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                setPlayerStallNum(game.gameNum);
                triggerStallJump(game);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Stall Entity */}
              <div
                className={`relative w-12 h-14 sm:w-16 sm:h-20 rounded-2xl p-1 flex flex-col items-center justify-between border-2 transition-all duration-200 ${
                  isCurrentStall
                    ? 'bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-800 border-white ring-4 ring-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-115'
                    : isHovered
                    ? 'bg-gradient-to-b from-teal-800 to-slate-900 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.7)] scale-110'
                    : 'bg-slate-950/85 border-emerald-500/70 shadow-lg'
                }`}
              >
                <div className="w-full flex items-center justify-between px-1">
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-300">
                    #{game.gameNum}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <span className="text-xl sm:text-3xl filter drop-shadow">
                  {game.themeIcon}
                </span>
              </div>

              {/* Player Avatar standing on current stall */}
              {isCurrentStall && (
                <div
                  style={{
                    transform: `translate(-50%, calc(-100% - ${jumpOffset}px))`,
                  }}
                  className="absolute top-0 left-1/2 z-35 pointer-events-none transition-transform flex flex-col items-center"
                >
                  <AvatarRenderer
                    customization={activeExplorer.customization}
                    size={44}
                    isWalking={isWalkingToStall}
                    isJumping={jumpOffset > 2}
                    facing={boardwalkFacing}
                    showPet={true}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar Controls */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-emerald-900/60 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-teal-950 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="text-amber-400">🌴</span>
            <span>Stall #{playerStallNum}: {islesGames.find((g) => g.gameNum === playerStallNum)?.name}</span>
          </div>
        </div>

        <button
          onClick={() => triggerStallJump()}
          className="h-10 sm:h-12 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.7)] cursor-pointer active:scale-95"
        >
          <ChevronsUp className="w-5 h-5 stroke-[3]" />
          <span>JUMP TO PLAY (SPACE)</span>
        </button>
      </div>

      {/* ACTIVE ISLES OF PLAY MINIGAME MODAL */}
      {activeGame && activeVisuals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-3xl bg-slate-900 border-3 border-emerald-400 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(16,185,129,0.6)] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeGame.themeIcon}</span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-emerald-300 uppercase tracking-wide">
                    {activeGame.name}
                  </h2>
                  <p className="text-xs text-teal-300 font-medium">
                    Stall #{activeGame.gameNum} · {activeGame.skillCategory} · {activeVisuals.toolName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sounds.speak(activeGame.spokenAudioCue || activeGame.howToPlay)}
                  className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 cursor-pointer"
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
            <div className="p-3 bg-slate-950/90 border border-emerald-500/40 rounded-2xl text-center space-y-2">
              <p className="text-sm sm:text-base font-black text-emerald-100">
                {activeGame.howToPlay}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <CutePicturePrompt
                  targetSound={activeGame.targetSoundOrWord}
                  instruction={activeGame.howToPlay}
                  soundCue={activeGame.spokenAudioCue}
                  stageNumber={activeGame.gameNum}
                  isSimplerLevel={true}
                />
                <button
                  type="button"
                  title="Hear sound cue"
                  onClick={() => sounds.speak(activeGame.spokenAudioCue || activeGame.howToPlay)}
                  className="px-3 py-1 bg-teal-950/80 border border-amber-400/50 hover:bg-teal-900 rounded-xl shadow text-xs font-bold text-amber-200 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Listen</span>
                </button>
              </div>
            </div>

            {/* Interactive Game Arena: Moving Player + Specific Themed Tools */}
            <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-teal-950 via-slate-900 to-cyan-950 rounded-2xl border-2 border-emerald-500/50 overflow-hidden flex flex-col justify-between p-3 select-none">
              
              {/* Overhead Mechanical Claw Gantry (ONLY for Crane / Claw games!) */}
              {activeVisuals.mechanicCategory === 'claw' && (
                <div className="absolute top-0 inset-x-0 h-10 border-b-2 border-slate-700 bg-slate-900/90 z-25 flex items-center">
                  <div
                    style={{
                      left: `${(playerCol * 25) + 12.5}%`,
                      transform: 'translateX(-50%)',
                      transition: 'left 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    className="absolute top-0 flex flex-col items-center"
                  >
                    <div className="w-10 h-3 bg-amber-500 rounded-b-md border border-amber-300 shadow flex items-center justify-center text-[7px] font-black text-black">
                      GANTRY
                    </div>
                    {/* Dropping Mechanical Cable & Steel Claw */}
                    <div
                      style={{
                        height: clawDropping ? '130px' : '20px',
                        transition: 'height 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                      }}
                      className="w-1 bg-amber-300 relative flex flex-col items-center justify-end"
                    >
                      <span className="text-2xl filter drop-shadow -mb-3 animate-pulse">
                        {clawDropping ? '🦾' : '🪝'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4 Interactive Answer Stations */}
              <div className="w-full flex items-center justify-around gap-2 z-20 mt-4">
                {activeGame.options.map((option, idx) => {
                  const isPlayerStandingHere = playerCol === idx;
                  const isSelected = selectedOption === option;
                  const isCorrectChoice = isAnswered && option.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();

                  return (
                    <div
                      key={idx}
                      onClick={() => executeMinigameAction(idx)}
                      className={`flex-1 p-2 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                        isAnswered
                          ? isCorrect && isCorrectChoice
                            ? 'bg-emerald-600/90 border-white text-white shadow-[0_0_25px_rgba(16,185,129,1)] scale-105'
                            : isSelected && !isCorrect
                            ? 'bg-rose-900/90 border-rose-400 text-rose-200 animate-shake'
                            : isCorrectChoice
                            ? 'bg-emerald-600/90 border-white text-white shadow-[0_0_25px_rgba(16,185,129,1)] scale-105'
                            : isSelected
                            ? 'bg-rose-900/90 border-rose-400 text-rose-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-600 opacity-40'
                          : isPlayerStandingHere
                          ? 'bg-emerald-950/90 border-cyan-300 ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-105'
                          : 'bg-slate-950/85 border-emerald-500/60 hover:border-cyan-300 text-slate-100 shadow-md'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl animate-bounce pointer-events-none mb-1">
                        {activeGame.themeIcon}
                      </span>

                      <span className="text-sm sm:text-base font-black font-display tracking-wide block my-1">
                        {option}
                      </span>

                      <span className="text-[9px] text-cyan-300 font-mono font-bold tracking-wider uppercase bg-black/50 px-2 py-0.5 rounded-full mt-1">
                        {isPlayerStandingHere ? '👉 STANDING HERE' : `STATION #${idx + 1}`}
                      </span>

                      {actionEffect && actionEffect.col === idx && (
                        <div className="absolute -top-3 z-30 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-xl animate-ping flex items-center gap-1">
                          <span>{actionEffect.icon}</span>
                          <span>{actionEffect.text}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Free Moving Player Character at current station with Tool */}
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
                    <AvatarRenderer
                      customization={activeExplorer.customization}
                      size={46}
                      isWalking={isStationMoving}
                      isActing={isActing}
                      facing={stationFacing}
                      showPet={false}
                    />
                    
                    {/* The Themed Tool - strictly matching the game! */}
                    <div
                      style={{
                        transform: isActing ? 'rotate(35deg) scale(1.25)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease-out'
                      }}
                      className="absolute -top-1 -right-3 text-2xl filter drop-shadow"
                    >
                      {activeVisuals.toolIcon}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black text-cyan-300 mt-1 bg-slate-950/80 px-2 rounded-full border border-emerald-400/40">
                    {activeExplorer.name}
                  </span>
                </div>
              </div>
            </div>

            {/* In-Game Action Bar & Touch Controls (Move L/R & Action) */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-950/90 rounded-2xl border border-emerald-500/40">
              <button
                type="button"
                onClick={() => {
                  setPlayerCol((c) => Math.max(0, c - 1));
                  setStationFacing('left');
                  setIsStationMoving(true);
                  sounds.playStep();
                  setTimeout(() => setIsStationMoving(false), 220);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Move Left</span>
              </button>

              <button
                type="button"
                onClick={() => executeMinigameAction(playerCol)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.7)] cursor-pointer active:scale-95 hover:brightness-110"
              >
                <span>{activeVisuals.actionLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlayerCol((c) => Math.min(activeGame.options.length - 1, c + 1));
                  setStationFacing('right');
                  setIsStationMoving(true);
                  sounds.playStep();
                  setTimeout(() => setIsStationMoving(false), 220);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Move Right</span>
                <span className="text-sm">➔</span>
              </button>
            </div>

            {/* Result & Continuous Loop Button */}
            {isAnswered && (
              <div
                className={`p-3 rounded-2xl border text-center space-y-2 animate-fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/90 border-rose-500 text-rose-200'
                }`}
              >
                <p className="text-xs sm:text-sm font-bold">
                  {isCorrect ? `🌟 Correct! ${activeGame.explanation}` : 'Not quite! Listen closely and try again.'}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedOption(null);
                      setIsAnswered(false);
                      setIsCorrect(false);
                      setActionEffect(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={handleNextGame}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow cursor-pointer active:scale-95"
                  >
                    Next Island Stall ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

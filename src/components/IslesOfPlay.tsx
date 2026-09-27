import React, { useState, useEffect, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { PhonicsLetter } from './PhonicsLetter';
import { PhonicsWordDisplay } from './PhonicsWordDisplay';
import { sounds } from '../utils/audio';
import { ALL_50_MINIGAMES, MinigameDefinition } from '../data/minigamesCurriculum';
import { 
  ArrowLeft, ArrowRight, Volume2, RotateCcw, Flame, CheckCircle2, 
  Coins, Sparkles, Star, Play, ChevronsUp, Compass, Waves
} from 'lucide-react';
import islesBg from '../../isles.jpeg';

interface IslesOfPlayProps {
  onBackToWorld: () => void;
}

export const IslesOfPlay: React.FC<IslesOfPlayProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);

  // Isles of Play exclusively houses Games 1 through 25 (Preschool through Late Elementary)
  const islesGames = React.useMemo(() => {
    return ALL_50_MINIGAMES.filter(g => g.hub === 'isles-of-play');
  }, []);

  const [activeGame, setActiveGame] = useState<MinigameDefinition | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreStreak, setScoreStreak] = useState(0);

  // Travel & Select on the Island Archipelago (exact layout system like Shellshore Arcade)
  const [playerIslandNum, setPlayerIslandNum] = useState<number>(1);
  const [hoveredIslandNum, setHoveredIslandNum] = useState<number | null>(null);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isSailingToIsland, setIsSailingToIsland] = useState<boolean>(false);

  // Interactive Character & Tool Animation states
  const [playerCol, setPlayerCol] = useState<number>(0);
  const [isActing, setIsActing] = useState<boolean>(false);
  const [actionEffect, setActionEffect] = useState<{ col: number; text: string; icon: string } | null>(null);

  const launchMinigame = useCallback((game: MinigameDefinition) => {
    setPlayerIslandNum(game.gameNum);
    setIsSailingToIsland(true);
    sounds.playStep();

    setTimeout(() => {
      setIsSailingToIsland(false);
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

  const triggerIslandJump = useCallback((gameTarget?: MinigameDefinition) => {
    if (isJumping) return;
    setIsJumping(true);
    sounds.playJump();

    const targetGame = gameTarget || islesGames.find(g => g.gameNum === playerIslandNum) || islesGames[0];

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
        launchMinigame(targetGame);
      }
    };

    requestAnimationFrame(animateJump);
  }, [isJumping, islesGames, playerIslandNum, launchMinigame]);

  const handleChoiceSelect = (choice: string, choiceIdx?: number) => {
    if (!activeGame || isAnswered) return;
    setSelectedOption(choice);
    setIsAnswered(true);

    const win = choice.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      sounds.playSuccess();
      awardCurrency(8, 2);
      setScoreStreak(s => s + 1);
    } else {
      sounds.playError();
      sounds.speak('Try again! Listen closely to the sound!');
    }
  };

  // Real Game Action Animation (Whack crab with stick, Catch turtle in net, Slingshot coconut, Pop pearl)
  const executeToolAction = useCallback((targetCol: number) => {
    if (!activeGame || isAnswered || isActing) return;

    setPlayerCol(targetCol);
    setIsActing(true);

    let effectText = 'ACTION!';
    let effectIcon = '⚡';

    if (activeGame.mechanicType === 'whack' || activeGame.name.toLowerCase().includes('crab')) {
      effectText = 'WHACK!';
      effectIcon = '🏏💥';
      sounds.playJump();
    } else if (activeGame.mechanicType === 'basket-catch' || activeGame.name.toLowerCase().includes('turtle') || activeGame.name.toLowerCase().includes('butterfly')) {
      effectText = 'CAUGHT!';
      effectIcon = '🕸️✨';
      sounds.playWhoosh();
    } else if (activeGame.mechanicType === 'slingshot') {
      effectText = 'DIRECT HIT!';
      effectIcon = '🥥💨';
      sounds.playWhoosh();
    } else if (activeGame.mechanicType === 'bubble-pop') {
      effectText = 'POP!';
      effectIcon = '🫧✨';
      sounds.playCollect();
    } else {
      effectText = 'HIT!';
      effectIcon = '🎯✨';
      sounds.playCollect();
    }

    setActionEffect({ col: targetCol, text: effectText, icon: effectIcon });

    setTimeout(() => {
      const selectedChoice = activeGame.options[targetCol];
      handleChoiceSelect(selectedChoice, targetCol);
    }, 280);

    setTimeout(() => {
      setIsActing(false);
      setActionEffect(null);
    }, 550);
  }, [activeGame, isAnswered, isActing]);

  // Keyboard navigation & space bar action in arena
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
        executeToolAction(playerCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isAnswered, playerCol, executeToolAction]);

  const handleNextIslandInSequence = () => {
    if (!activeGame) return;
    const nextNum = (activeGame.gameNum % 25) + 1;
    const nextGame = islesGames.find(g => g.gameNum === nextNum) || islesGames[0];
    launchMinigame(nextGame);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGame) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'tab' || k === 'enter') {
        e.preventDefault();
        triggerIslandJump();
      } else if (k === 'arrowright' || k === 'd') {
        setPlayerIslandNum((prev) => Math.min(25, prev + 1));
      } else if (k === 'arrowleft' || k === 'a') {
        setPlayerIslandNum((prev) => Math.max(1, prev - 1));
      } else if (k === 'arrowdown' || k === 's') {
        setPlayerIslandNum((prev) => Math.min(25, prev + 5));
      } else if (k === 'arrowup' || k === 'w') {
        setPlayerIslandNum((prev) => Math.max(1, prev - 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, triggerIslandJump]);

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Tropical Island Header */}
      <div className="p-2.5 sm:p-3 bg-gradient-to-r from-emerald-950 via-teal-950 to-blue-950 border-b-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-between z-30">
        <button
          onClick={onBackToWorld}
          className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-emerald-300 border border-emerald-400 font-black text-xs sm:text-sm cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Exit Isles</span>
        </button>

        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-mono font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>ISLES OF PLAY ARCHIPELAGO</span>
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h1 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-cyan-300 font-display">
            Preschool · Kindergarten · Elementary Phonics Voyage
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-black/80 px-3 py-1 rounded-xl border border-amber-400/50 shadow-inner">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{activeExplorer.coins} Shells</span>
        </div>
      </div>

      {/* Main Island Voyage Canvas with isles.jpeg artwork & nautical travel routes */}
      <div className="relative flex-1 w-full overflow-hidden select-none">
        
        {/* Real Isles of Play Background Artwork */}
        <img
          src={islesBg}
          alt="Isles of Play Archipelago Canvas"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-90 z-0"
        />

        {/* Tropical Ocean Water Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 via-transparent to-blue-950/60 pointer-events-none z-0" />

        {/* Nautical Sea Lane Connecting Routes across the 25 islands */}
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
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="8 5"
            className="animate-pulse"
            opacity="0.8"
          />
        </svg>

        {/* 25 Tropical Phonics Islands */}
        {islesGames.map((game, idx) => {
          const row = Math.floor(idx / 5);
          const col = idx % 5;
          const xNorm = row % 2 === 0 ? col : 4 - col;
          const x = 12 + xNorm * 19;
          const y = 14 + row * 18;
          const isHovered = hoveredIslandNum === game.gameNum;
          const isCurrentIsland = playerIslandNum === game.gameNum;

          return (
            <div
              key={game.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredIslandNum(game.gameNum)}
              onMouseLeave={() => setHoveredIslandNum(null)}
              onClick={() => {
                setPlayerIslandNum(game.gameNum);
                triggerIslandJump(game);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Tropical Sandy Island Atoll Base */}
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-3xl p-1 flex flex-col items-center justify-between border-2 transition-all duration-200 ${
                  isCurrentIsland
                    ? 'bg-gradient-to-b from-amber-200 via-emerald-400 to-teal-600 border-white ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-115'
                    : isHovered
                    ? 'bg-gradient-to-b from-emerald-800 to-teal-950 border-amber-300 shadow-[0_0_18px_rgba(52,211,153,0.7)] scale-110'
                    : 'bg-slate-950/85 border-emerald-500/70 shadow-lg'
                }`}
              >
                {/* Island Number Badge */}
                <div className="w-full flex items-center justify-between px-1">
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-300">
                    #{game.gameNum}
                  </span>
                  <span className="text-[10px]">🌴</span>
                </div>

                {/* Island Feature Icon */}
                <span className="text-lg sm:text-2xl filter drop-shadow">
                  {game.themeIcon}
                </span>

                {/* Island Feature Icon */}
                <span className="text-xl sm:text-3xl filter drop-shadow">
                  {game.themeIcon}
                </span>
              </div>

              {/* Player Avatar Standing on Active Island */}
              {isCurrentIsland && (
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

      {/* Bottom Travel & Play Controls Dock */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-emerald-800/60 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-emerald-950 border border-emerald-400/60 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="text-amber-400">🏝️</span>
            <span>Island #{playerIslandNum}: {islesGames[playerIslandNum - 1]?.name}</span>
          </div>
        </div>

        <button
          onClick={() => triggerIslandJump()}
          className="h-10 sm:h-12 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer active:scale-95"
        >
          <ChevronsUp className="w-5 h-5 stroke-[3]" />
          <span>JUMP TO OPEN (SPACE)</span>
        </button>
      </div>

      {/* ACTIVE INTERACTIVE ISLAND MINIGAME ARENA MODAL */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-3xl bg-slate-900 border-3 border-emerald-400 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(16,185,129,0.6)] space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeGame.themeIcon}</span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-emerald-300 uppercase tracking-wide">
                    {activeGame.name}
                  </h2>
                  <p className="text-xs text-amber-300 font-medium">
                    {activeGame.skillCategory} · {activeGame.gradeLevel}
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

            {/* Instruction Banner with Illustrated Phonics Letters */}
            <div className="p-3 bg-slate-950/90 border border-emerald-500/40 rounded-2xl text-center space-y-2">
              <p className="text-sm sm:text-base font-black text-amber-100">
                {activeGame.howToPlay}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">Target Sound:</span>
                <PhonicsWordDisplay text={activeGame.targetSoundOrWord} size={36} />
              </div>
            </div>

            {/* Real Interactive Game Arena: Moving Player + Scurrying Targets + Themed Action Tools */}
            <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-teal-950 via-slate-900 to-blue-950 rounded-2xl border-2 border-emerald-500/50 overflow-hidden flex flex-col justify-between p-3 select-none">
              
              {/* 4 Interactive Answer Stations with Living Themed Targets */}
              <div className="w-full flex items-center justify-around gap-2 z-20">
                {activeGame.options.map((option, idx) => {
                  const isPlayerStandingHere = playerCol === idx;
                  const isSelected = selectedOption === option;
                  const isCorrectChoice = isAnswered && option.trim().toLowerCase() === activeGame.correctAnswer.trim().toLowerCase();

                  // Live animated target icon depending on game theme
                  const renderLiveTarget = () => {
                    const name = activeGame.name.toLowerCase();
                    if (name.includes('crab')) {
                      return <span className="text-2xl sm:text-3xl animate-bounce">🦀</span>;
                    }
                    if (name.includes('turtle')) {
                      return <span className="text-2xl sm:text-3xl animate-pulse">🐢</span>;
                    }
                    if (name.includes('butterfly')) {
                      return <span className="text-2xl sm:text-3xl animate-float">🦋</span>;
                    }
                    if (name.includes('bubble') || name.includes('pearl') || name.includes('dolphin')) {
                      return <span className="text-2xl sm:text-3xl animate-pulse">🐬🫧</span>;
                    }
                    if (name.includes('coconut') || name.includes('slingshot')) {
                      return <span className="text-2xl sm:text-3xl animate-bounce">🥥</span>;
                    }
                    return <span className="text-2xl sm:text-3xl animate-bounce">{activeGame.themeIcon}</span>;
                  };

                  return (
                    <div
                      key={idx}
                      onClick={() => executeToolAction(idx)}
                      className={`flex-1 p-2 sm:p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                        isAnswered
                          ? isCorrectChoice
                            ? 'bg-emerald-600/90 border-white text-white shadow-[0_0_25px_rgba(16,185,129,1)] scale-105'
                            : isSelected
                            ? 'bg-rose-900/90 border-rose-400 text-rose-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-600 opacity-40'
                          : isPlayerStandingHere
                          ? 'bg-emerald-950/90 border-amber-300 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] scale-105'
                          : 'bg-slate-950/85 border-emerald-400/60 hover:border-amber-300 text-slate-100 shadow-md'
                      }`}
                    >
                      {/* Live Target Mascot Creature */}
                      <div className="mb-1 pointer-events-none">
                        {renderLiveTarget()}
                      </div>

                      {/* Phonics Letter Animal card or word */}
                      <div className="my-1 flex items-center justify-center">
                        {option.length === 1 ? (
                          <PhonicsLetter letter={option} size={42} showBadge={false} />
                        ) : (
                          <PhonicsWordDisplay text={option} size={28} />
                        )}
                      </div>

                      {/* Tool Action Hint Badge */}
                      <span className="text-[9px] text-emerald-300 font-mono font-bold tracking-wider uppercase bg-black/50 px-2 py-0.5 rounded-full mt-1">
                        {isPlayerStandingHere ? '👉 STANDING HERE' : `STATION #${idx + 1}`}
                      </span>

                      {/* Direct Smash/Action Impact Animation Popup */}
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

              {/* Free Moving Player Character at current station holding themed game tool */}
              <div className="relative w-full h-24 flex items-end">
                <div
                  style={{
                    left: `${(playerCol * 25) + 12.5}%`,
                    transform: 'translateX(-50%)',
                    transition: 'left 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                  className="absolute bottom-1 flex flex-col items-center pointer-events-none"
                >
                  {/* Held Tool (Whack Stick, Catch Net, Slingshot, Pearl Wand) */}
                  <div className="relative">
                    <AvatarRenderer customization={activeExplorer.customization} size={46} showPet={false} />
                    
                    {/* The Themed Tool Held in Hand with dynamic swing/catch animation */}
                    <div
                      style={{
                        transform: isActing ? 'rotate(50deg) scale(1.2)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease-out'
                      }}
                      className="absolute -top-1 -right-3 text-2xl filter drop-shadow"
                    >
                      {activeGame.mechanicType === 'whack' || activeGame.name.toLowerCase().includes('crab') ? (
                        '🏏'
                      ) : activeGame.mechanicType === 'basket-catch' || activeGame.name.toLowerCase().includes('turtle') || activeGame.name.toLowerCase().includes('butterfly') ? (
                        '🕸️'
                      ) : activeGame.mechanicType === 'slingshot' ? (
                        '🏹'
                      ) : activeGame.mechanicType === 'bubble-pop' ? (
                        '🫧'
                      ) : (
                        '🔨'
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-black text-amber-300 mt-1 bg-slate-950/80 px-2 rounded-full border border-amber-400/40">
                    {activeExplorer.name}
                  </span>
                </div>
              </div>
            </div>

            {/* In-Game Action Bar & Touch Controls (Move L/R & Whack / Catch / Slingshot) */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-950/90 rounded-2xl border border-emerald-500/40">
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
                onClick={() => executeToolAction(playerCol)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.7)] cursor-pointer active:scale-95 hover:brightness-110"
              >
                <span>
                  {activeGame.mechanicType === 'whack' || activeGame.name.toLowerCase().includes('crab')
                    ? '🏏 WHACK TARGET (SPACE)'
                    : activeGame.mechanicType === 'basket-catch' || activeGame.name.toLowerCase().includes('turtle') || activeGame.name.toLowerCase().includes('butterfly')
                    ? '🕸️ NET CATCH (SPACE)'
                    : activeGame.mechanicType === 'slingshot'
                    ? '🏹 LAUNCH SLINGSHOT (SPACE)'
                    : activeGame.mechanicType === 'bubble-pop'
                    ? '🫧 POP PEARL (SPACE)'
                    : '⚡ STRIKE TARGET (SPACE)'}
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

            {/* Answer Result Banner */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border text-center space-y-2 animate-scale-up ${
                isCorrect ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200' : 'bg-rose-950/95 border-rose-400 text-rose-200'
              }`}>
                <div className="text-sm sm:text-base font-black uppercase">
                  {isCorrect ? '⭐ Excellent Voyage Success!' : '❌ Not Quite Right!'}
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
                      onClick={handleNextIslandInSequence}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 cursor-pointer"
                    >
                      <span>Sail to Next Island ➔</span>
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

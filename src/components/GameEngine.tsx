import React, { useState, useEffect, useCallback } from 'react';
import { GameChallenge } from '../types/curriculum';
import { LandId } from '../types/character';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import confetti from 'canvas-confetti';
import { 
  Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, 
  RotateCcw, Trophy, ArrowUp, ArrowDown, Waves, Hammer, 
  Compass, Wind, Flame, ArrowLeft, ArrowRight as ArrowRightIcon
} from 'lucide-react';

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
  const companionGuide = getCompanionGuide(activeExplorer);

  // Determine if multi-block spelling or target-choice mode
  const isWordBuilder = challenge.type === 'WORD_BUILDER' || Array.isArray(challenge.correctAnswer) || landId === 'builders-guild';
  const [selectedLetterSequence, setSelectedLetterSequence] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 8 letter options pool for Builders Guild multi-block hook
  const activeOptions = React.useMemo(() => {
    if (landId === 'builders-guild' && challenge.options.length < 8) {
      const distractors = ['b', 'n', 'g', 'a', 'd', 'e', 'o', 'p', 't', 'm', 's', 'r'];
      const set = new Set(challenge.options);
      for (const d of distractors) {
        if (set.size >= 8) break;
        set.add(d);
      }
      return Array.from(set);
    }
    return challenge.options;
  }, [challenge.options, landId]);

  // Submission & Feedback states
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Visual effects
  const [hitEffects, setHitEffects] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  const [activeActionPulse, setActiveActionPulse] = useState(false);

  // Swimming animation clock (breaststroke arms + kick cycles)
  const [swimCycle, setSwimCycle] = useState(0);

  // ==========================================
  // REALM-SPECIFIC ARENA STATES
  // ==========================================
  // 1. Sound Shallows
  const [swimPos, setSwimPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [swimFacing, setSwimFacing] = useState<'left' | 'right'>('right');
  const [isStroking, setIsStroking] = useState(false);

  // 2. Builders Guild: Crane Hook Position & Hoisting State
  const [builderX, setBuilderX] = useState<number>(50);
  const [builderFacing, setBuilderFacing] = useState<'left' | 'right'>('right');
  const [craneLowered, setCraneLowered] = useState(false);
  const [heldBrick, setHeldBrick] = useState<string | null>(null);

  // 3. Tricky Trails
  const [cartX, setCartX] = useState<number>(50);
  const [cartFacing, setCartFacing] = useState<'left' | 'right'>('right');
  const [isDashing, setIsDashing] = useState(false);

  // 4. Whispering Peaks
  const [gliderPos, setGliderPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [gliderBank, setGliderBank] = useState<number>(0);
  const [isThermalBoosting, setIsThermalBoosting] = useState(false);

  // 5. Lexicon Empire
  const [citadelX, setCitadelX] = useState<number>(50);
  const [citadelFacing, setCitadelFacing] = useState<'left' | 'right'>('right');
  const [isChannelingScepter, setIsChannelingScepter] = useState(false);

  // Shared active control keys
  const [dpad, setDpad] = useState({ left: false, right: false, up: false, down: false });

  // Continuous swimming animation loop
  useEffect(() => {
    let frame: number;
    const animateSwim = () => {
      setSwimCycle(c => c + 0.12);
      frame = requestAnimationFrame(animateSwim);
    };
    if (landId === 'sound-shallows') {
      frame = requestAnimationFrame(animateSwim);
    }
    return () => cancelAnimationFrame(frame);
  }, [landId]);

  // Audio Handler with isolated phonetic breakdown
  const handlePlayAudio = (slow: boolean = false) => {
    const textToSpeak = challenge.spokenAudioText || challenge.targetSoundOrWord;
    if (slow) {
      sounds.speakPhonicsSlow(textToSpeak);
    } else {
      sounds.speak(textToSpeak);
    }
  };

  const spawnEffect = (text: string, xPercent: number, yPx: number) => {
    const id = Date.now();
    setHitEffects(prev => [...prev, { id, x: xPercent, y: yPx, text }]);
    setTimeout(() => {
      setHitEffects(prev => prev.filter(e => e.id !== id));
    }, 900);
  };

  const handleSelectOption = useCallback((option: string, optionIndex: number) => {
    if (hasSubmitted) return;

    sounds.playCollect();
    setActiveActionPulse(true);
    setTimeout(() => setActiveActionPulse(false), 300);

    const targetX = 12 + (optionIndex * (76 / Math.max(activeOptions.length - 1, 1)));
    spawnEffect(`+${option}`, targetX, 110);

    if (isWordBuilder) {
      setSelectedLetterSequence(prev => [...prev, option]);
    } else {
      setSelectedOption(option);
    }
  }, [hasSubmitted, isWordBuilder, activeOptions.length]);

  const handleRemoveTile = (idx: number) => {
    if (hasSubmitted) return;
    sounds.playStep();
    setSelectedLetterSequence(prev => prev.filter((_, i) => i !== idx));
  };

  const handleResetSequence = () => {
    if (hasSubmitted) return;
    sounds.playStep();
    setSelectedLetterSequence([]);
  };

  // Realm 1 Action: Swim Dive Stroke
  const triggerSwimStroke = useCallback(() => {
    if (hasSubmitted || isStroking) return;
    setIsStroking(true);
    sounds.playJump();

    let closestIdx = 0;
    let minDiff = 999;
    activeOptions.forEach((_, idx) => {
      const blockX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
      const diff = Math.abs(swimPos.x - blockX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetX = 12 + (closestIdx * (76 / Math.max(activeOptions.length - 1, 1)));
    setSwimPos(p => ({ x: targetX, y: Math.max(25, p.y - 18) }));
    handleSelectOption(activeOptions[closestIdx], closestIdx);

    setTimeout(() => {
      setSwimPos(p => ({ ...p, y: Math.min(65, p.y + 12) }));
      setIsStroking(false);
    }, 450);
  }, [hasSubmitted, isStroking, activeOptions, swimPos.x, handleSelectOption]);

  // Realm 2 Action: Multi-Letter Crane Hook Drops & Lifts Block
  const triggerHoistBrick = useCallback(() => {
    if (hasSubmitted || craneLowered) return;
    setCraneLowered(true);
    sounds.playBlockHit();

    let closestIdx = 0;
    let minDiff = 999;
    activeOptions.forEach((_, idx) => {
      const blockX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
      const diff = Math.abs(builderX - blockX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const chosen = activeOptions[closestIdx];
    const targetX = 12 + (closestIdx * (76 / Math.max(activeOptions.length - 1, 1)));
    setBuilderX(targetX);
    setHeldBrick(chosen);

    setTimeout(() => {
      handleSelectOption(chosen, closestIdx);
      setHeldBrick(null);
      setCraneLowered(false);
    }, 450);
  }, [hasSubmitted, craneLowered, activeOptions, builderX, handleSelectOption]);

  // Realm 3 Action: Jungle Trail Leap & Switch
  const triggerTrailDash = useCallback(() => {
    if (hasSubmitted || isDashing) return;
    setIsDashing(true);
    sounds.playJump();

    let closestIdx = 0;
    let minDiff = 999;
    activeOptions.forEach((_, idx) => {
      const blockX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
      const diff = Math.abs(cartX - blockX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetX = 12 + (closestIdx * (76 / Math.max(activeOptions.length - 1, 1)));
    setCartX(targetX);
    handleSelectOption(activeOptions[closestIdx], closestIdx);

    setTimeout(() => setIsDashing(false), 450);
  }, [hasSubmitted, isDashing, activeOptions, cartX, handleSelectOption]);

  // Realm 4 Action: Thermal Glider Boost
  const triggerGliderBoost = useCallback(() => {
    if (hasSubmitted || isThermalBoosting) return;
    setIsThermalBoosting(true);
    sounds.playJump();

    let closestIdx = 0;
    let minDiff = 999;
    activeOptions.forEach((_, idx) => {
      const blockX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
      const diff = Math.abs(gliderPos.x - blockX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetX = 12 + (closestIdx * (76 / Math.max(activeOptions.length - 1, 1)));
    setGliderPos({ x: targetX, y: 35 });
    handleSelectOption(activeOptions[closestIdx], closestIdx);

    setTimeout(() => {
      setGliderPos(p => ({ ...p, y: 55 }));
      setIsThermalBoosting(false);
    }, 500);
  }, [hasSubmitted, isThermalBoosting, activeOptions, gliderPos.x, handleSelectOption]);

  // Realm 5 Action: Scepter Beam
  const triggerScepterChannel = useCallback(() => {
    if (hasSubmitted || isChannelingScepter) return;
    setIsChannelingScepter(true);
    sounds.playBlockHit();

    let closestIdx = 0;
    let minDiff = 999;
    activeOptions.forEach((_, idx) => {
      const blockX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
      const diff = Math.abs(citadelX - blockX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetX = 12 + (closestIdx * (76 / Math.max(activeOptions.length - 1, 1)));
    setCitadelX(targetX);
    handleSelectOption(activeOptions[closestIdx], closestIdx);

    setTimeout(() => setIsChannelingScepter(false), 500);
  }, [hasSubmitted, isChannelingScepter, activeOptions, citadelX, handleSelectOption]);

  const triggerRealmAction = useCallback(() => {
    if (landId === 'sound-shallows') triggerSwimStroke();
    else if (landId === 'builders-guild') triggerHoistBrick();
    else if (landId === 'tricky-trails') triggerTrailDash();
    else if (landId === 'whispering-peaks') triggerGliderBoost();
    else triggerScepterChannel();
  }, [landId, triggerSwimStroke, triggerHoistBrick, triggerTrailDash, triggerGliderBoost, triggerScepterChannel]);

  // Movement loop
  useEffect(() => {
    let animId: number;
    const speed = 1.35;

    const tick = () => {
      if (landId === 'sound-shallows') {
        if (dpad.left) {
          setSwimPos(p => ({ ...p, x: Math.max(8, p.x - speed) }));
          setSwimFacing('left');
        }
        if (dpad.right) {
          setSwimPos(p => ({ ...p, x: Math.min(92, p.x + speed) }));
          setSwimFacing('right');
        }
        if (dpad.up) setSwimPos(p => ({ ...p, y: Math.max(20, p.y - speed) }));
        if (dpad.down) setSwimPos(p => ({ ...p, y: Math.min(78, p.y + speed) }));
      } else if (landId === 'builders-guild') {
        if (dpad.left) {
          setBuilderX(p => Math.max(8, p - speed));
          setBuilderFacing('left');
        }
        if (dpad.right) {
          setBuilderX(p => Math.min(92, p + speed));
          setBuilderFacing('right');
        }
      } else if (landId === 'tricky-trails') {
        if (dpad.left) {
          setCartX(p => Math.max(8, p - speed));
          setCartFacing('left');
        }
        if (dpad.right) {
          setCartX(p => Math.min(92, p + speed));
          setCartFacing('right');
        }
      } else if (landId === 'whispering-peaks') {
        if (dpad.left) {
          setGliderPos(p => ({ ...p, x: Math.max(8, p.x - speed) }));
          setGliderBank(-15);
        } else if (dpad.right) {
          setGliderPos(p => ({ ...p, x: Math.min(92, p.x + speed) }));
          setGliderBank(15);
        } else {
          setGliderBank(0);
        }
        if (dpad.up) setGliderPos(p => ({ ...p, y: Math.max(20, p.y - speed) }));
        if (dpad.down) setGliderPos(p => ({ ...p, y: Math.min(75, p.y + speed) }));
      } else {
        if (dpad.left) {
          setCitadelX(p => Math.max(8, p - speed));
          setCitadelFacing('left');
        }
        if (dpad.right) {
          setCitadelX(p => Math.min(92, p + speed));
          setCitadelFacing('right');
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [dpad, landId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const code = e.code;

      if (k === 'arrowleft' || k === 'a' || code === 'KeyA' || code === 'ArrowLeft') {
        setDpad(p => ({ ...p, left: true }));
      }
      if (k === 'arrowright' || k === 'd' || code === 'KeyD' || code === 'ArrowRight') {
        setDpad(p => ({ ...p, right: true }));
      }
      if (k === 'arrowup' || k === 'w' || code === 'KeyW' || code === 'ArrowUp') {
        setDpad(p => ({ ...p, up: true }));
      }
      if (k === 'arrowdown' || k === 's' || code === 'KeyS' || code === 'ArrowDown') {
        setDpad(p => ({ ...p, down: true }));
      }
      if (k === ' ' || k === 'tab' || code === 'Space' || code === 'Tab') {
        e.preventDefault();
        triggerRealmAction();
      }
      if (k === 'enter' || code === 'Enter') {
        if (!hasSubmitted) {
          handleSubmit();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const code = e.code;

      if (k === 'arrowleft' || k === 'a' || code === 'KeyA' || code === 'ArrowLeft') {
        setDpad(p => ({ ...p, left: false }));
      }
      if (k === 'arrowright' || k === 'd' || code === 'KeyD' || code === 'ArrowRight') {
        setDpad(p => ({ ...p, right: false }));
      }
      if (k === 'arrowup' || k === 'w' || code === 'KeyW' || code === 'ArrowUp') {
        setDpad(p => ({ ...p, up: false }));
      }
      if (k === 'arrowdown' || k === 's' || code === 'KeyS' || code === 'ArrowDown') {
        setDpad(p => ({ ...p, down: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerRealmAction, hasSubmitted]);

  // Submit Answer & Verification
  const handleSubmit = () => {
    if (hasSubmitted) return;
    setAttempts(prev => prev + 1);

    let correct = false;

    if (isWordBuilder) {
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
    setShowFeedback(true);

    if (correct) {
      sounds.playSuccess();
      confetti({
        particleCount: 75,
        spread: 75,
        origin: { y: 0.6 }
      });

      const starsEarned = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      const score = starsEarned * 100;
      if (recordGameCompletion) {
        recordGameCompletion(landId, levelNumber, challenge.gameNumber, starsEarned, score, true);
      }
    } else {
      sounds.playError();
      sounds.speak('Not quite! Try again!');
      if (recordGameCompletion) {
        recordGameCompletion(landId, levelNumber, challenge.gameNumber, 1, 20, false);
      }
    }
  };

  const handleNext = () => {
    const starsEarned = isCorrect ? (attempts <= 1 ? 3 : 2) : 1;
    onComplete(starsEarned, starsEarned * 100);
  };

  const handleRetry = () => {
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setSelectedOption(null);
    setSelectedLetterSequence([]);
  };

  // Land Theme Metadata
  const landTheme = {
    'sound-shallows': {
      bgImage: '/sound.jpeg',
      actionTitle: 'SWIM STROKE',
      actionIcon: <Waves className="w-4 h-4 stroke-[3]" />,
      actionDesc: 'Swim & dive to pearls',
      accentColor: 'from-cyan-400 to-blue-500',
      badge: 'Sound Shallows Ocean Swimming',
    },
    'builders-guild': {
      bgImage: '/build.jpeg',
      actionTitle: 'CRANE HOOK',
      actionIcon: <Hammer className="w-4 h-4 stroke-[3]" />,
      actionDesc: 'Drop hook & hoist letters',
      accentColor: 'from-amber-400 to-amber-600',
      badge: 'Quarry Multi-Block Crane Forge',
    },
    'tricky-trails': {
      bgImage: '/trails.jpeg',
      actionTitle: 'TRAIL DASH',
      actionIcon: <Compass className="w-4 h-4 stroke-[3]" />,
      actionDesc: 'Steer canopy cart',
      accentColor: 'from-emerald-400 to-emerald-600',
      badge: 'Jungle Minecart Adventure',
    },
    'whispering-peaks': {
      bgImage: '/peak.jpeg',
      actionTitle: 'THERMAL GLIDE',
      actionIcon: <Wind className="w-4 h-4 stroke-[3]" />,
      actionDesc: 'Soar on rising air',
      accentColor: 'from-indigo-400 to-purple-600',
      badge: 'Sky Glider Thermal Soaring',
    },
    'lexicon-empire': {
      bgImage: '/empire.jpeg',
      actionTitle: 'CHANNEL SCEPTER',
      actionIcon: <Flame className="w-4 h-4 stroke-[3]" />,
      actionDesc: 'Dispel shadow forces',
      accentColor: 'from-amber-300 to-yellow-500',
      badge: 'Imperial Citadel Altar',
    },
  }[landId] || {
    bgImage: '/sound.jpeg',
    actionTitle: 'ACTION',
    actionIcon: <Sparkles className="w-4 h-4" />,
    actionDesc: 'Select target',
    accentColor: 'from-amber-400 to-amber-500',
    badge: 'Phonixia Challenge',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-3xl bg-slate-900 border-3 border-amber-400 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header HUD */}
        <div className="px-4 py-2.5 bg-slate-950/95 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-sm border border-amber-400">
              #{challenge.gameNumber}
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-200 font-display flex items-center gap-1.5">
                <span>{challenge.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50">
                  {landTheme.badge}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {landTheme.actionDesc} · Spacebar or Tap controls below!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAudio(false)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/80 text-amber-300 hover:bg-amber-500/30 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Phonetic Sound</span>
            </button>
            <button
              onClick={() => handlePlayAudio(true)}
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              title="Segmented phoneme sounds"
            >
              🐢 Segmented
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Phonics Target & Rule Bar */}
        <div className="px-4 py-1.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between gap-2 text-[11px] text-amber-200">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate"><b>Sound Rule:</b> {challenge.phonicsRuleTip}</span>
          </div>
          <span className="text-amber-400 font-bold shrink-0">
            Target Sound: <b>{challenge.targetSoundOrWord}</b>
          </span>
        </div>

        {/* Challenge Prompt Banner */}
        <div className="px-4 py-2 bg-slate-900 text-center border-b border-slate-800/80">
          <h2 className="text-sm sm:text-base font-black text-amber-100 font-display">
            {challenge.prompt}
          </h2>
        </div>

        {/* Word Assembly Tray / Crane Hook Load */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-amber-500/20 flex items-center justify-between min-h-[52px]">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider shrink-0">
              {isWordBuilder ? 'Letters on Hook:' : 'Selected:'}
            </span>

            {isWordBuilder ? (
              selectedLetterSequence.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Drop crane hook onto blocks in order to spell the word!
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  {selectedLetterSequence.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveTile(idx)}
                      disabled={hasSubmitted}
                      className="px-3 py-1 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black text-base shadow border-b-2 border-amber-700 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      title="Tap to unhook"
                    >
                      <span>{letter}</span>
                      <span className="text-[10px] text-amber-900 font-bold">#{idx + 1}</span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              selectedOption ? (
                <span className="px-4 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-sm">
                  {selectedOption}
                </span>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Move explorer and activate target to choose!
                </span>
              )
            )}
          </div>

          {/* Tray Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isWordBuilder && selectedLetterSequence.length > 0 && !hasSubmitted && (
              <button
                onClick={handleResetSequence}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Hook</span>
              </button>
            )}

            {!hasSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={(isWordBuilder && selectedLetterSequence.length === 0) || (!isWordBuilder && !selectedOption)}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  ((isWordBuilder && selectedLetterSequence.length > 0) || (!isWordBuilder && selectedOption))
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Check Word</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            REALM-SPECIFIC VIDEO GAME ARENA STAGES
            ======================================================== */}
        <div 
          className="relative flex-1 min-h-[250px] sm:min-h-[290px] overflow-visible border-b border-amber-500/30 bg-cover bg-center select-none pb-2"
          style={{ backgroundImage: `url(${landTheme.bgImage})` }}
        >
          {/* Realm Atmosphere Shroud */}
          <div className={`absolute inset-0 pointer-events-none ${
            landId === 'sound-shallows'
              ? 'bg-cyan-950/40 backdrop-blur-[0.5px]'
              : landId === 'builders-guild'
              ? 'bg-amber-950/35'
              : landId === 'tricky-trails'
              ? 'bg-emerald-950/35'
              : landId === 'whispering-peaks'
              ? 'bg-indigo-950/30'
              : 'bg-purple-950/40'
          }`} />

          {/* Floating Collect Text Particles */}
          {hitEffects.map((eff) => (
            <div
              key={eff.id}
              style={{ left: `${eff.x}%`, bottom: `${eff.y}px` }}
              className="absolute -translate-x-1/2 pointer-events-none text-amber-300 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce z-40"
            >
              {eff.text} ✨
            </div>
          ))}

          {/* ==================== 1. SOUND SHALLOWS: UNDERWATER SWIMMING ==================== */}
          {landId === 'sound-shallows' && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-8 text-lg opacity-40 animate-pulse">🫧</div>
              <div className="absolute top-16 left-1/4 text-sm opacity-50 animate-bounce">🫧</div>
              <div className="absolute bottom-10 right-1/4 text-base opacity-40 animate-pulse">🫧</div>

              {/* Swimming Letter Pearls */}
              <div className="absolute top-6 left-0 right-0 h-24 flex items-center justify-between px-6 sm:px-12 z-20">
                {activeOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const targetX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
                        setSwimPos({ x: targetX, y: 35 });
                        handleSelectOption(opt, idx);
                      }}
                      className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    >
                      <div className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center font-black text-lg sm:text-xl shadow-xl border-3 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-500 text-slate-950 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-110'
                          : 'bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-600 text-slate-950 border-cyan-100 shadow-[0_4px_0_rgba(8,145,178,1)]'
                      }`}>
                        <span className="font-display drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">{opt}</span>
                        <span className="absolute -top-1.5 -right-1 text-xs">🫧</span>
                      </div>
                      <span className="text-[8px] font-black text-cyan-200 mt-1 bg-slate-950/80 px-1 rounded border border-cyan-400/40">
                        PEARL
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Ocean Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-sky-950 to-transparent flex items-center justify-between px-6 opacity-60">
                <span>🪸</span>
                <span>🐚</span>
                <span>🪸</span>
              </div>

              {/* Swimming Companion */}
              <div
                style={{
                  left: `${swimPos.x - (swimFacing === 'left' ? -8 : 8)}%`,
                  top: `${swimPos.y + 4}%`,
                  transform: `translate(-50%, -50%) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-25 transition-all duration-100 flex flex-col items-center pointer-events-none"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-1.5 rounded text-[8px] font-bold text-cyan-300 shadow">
                  {companionGuide.name}
                </div>
                <AvatarRenderer
                  customization={companionGuide.customization}
                  size={40}
                  isSwimming={true}
                  swimCycle={swimCycle}
                  showPet={false}
                />
              </div>

              {/* Swimming Player Explorer with True-to-Story Swim Rig */}
              <div
                style={{
                  left: `${swimPos.x}%`,
                  top: `${swimPos.y}%`,
                  transform: `translate(-50%, -50%) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-30 transition-all duration-100 flex flex-col items-center pointer-events-none"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-cyan-400 px-1.5 rounded text-[8px] font-bold text-cyan-200 shadow">
                  {activeExplorer.name} (Swimming)
                </div>
                <AvatarRenderer
                  customization={activeExplorer.customization}
                  size={54}
                  isSwimming={true}
                  swimCycle={swimCycle}
                />
              </div>
            </div>
          )}

          {/* ==================== 2. BUILDERS GUILD: 8-BLOCK CRANE HOOK ARENA ==================== */}
          {landId === 'builders-guild' && (
            <div className="absolute inset-0 flex flex-col justify-between overflow-visible">
              
              {/* Overhead Crane Cable Line and Hook Assembly */}
              <div className="relative w-full h-8 border-b-2 border-amber-600/60 bg-slate-950/60 flex items-center px-4">
                <div className="text-[10px] font-black text-amber-300 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quarry Crane Track · Move and drop hook to collect letters in order!</span>
                </div>
              </div>

              {/* Suspended Hook following the Builder */}
              <div
                style={{
                  left: `${builderX}%`,
                  top: '32px',
                  height: craneLowered ? '110px' : '48px',
                  transform: 'translateX(-50%)',
                }}
                className="absolute z-20 w-1 bg-amber-400/90 transition-all duration-200 flex flex-col items-center"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500 border border-white flex items-center justify-center shadow-lg -bottom-3 absolute">
                  <span className="text-xs">🪝</span>
                </div>
              </div>

              {/* 8-BLOCK ROW: Adjusted positioning to prevent bottom cutoff */}
              <div className="relative z-25 px-4 sm:px-8 pt-4 pb-2">
                <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-2xl mx-auto items-end">
                  {activeOptions.map((opt, idx) => {
                    const timesSelected = selectedLetterSequence.filter(s => s === opt).length;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          const targetX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
                          setBuilderX(targetX);
                          handleSelectOption(opt, idx);
                        }}
                        className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
                      >
                        <div className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center font-black text-base sm:text-xl shadow-lg border-2 transition-all ${
                          timesSelected > 0
                            ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-slate-950 border-white shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                            : 'bg-gradient-to-b from-stone-200 via-amber-300 to-amber-500 text-slate-950 border-amber-200 shadow-[0_3px_0_rgba(180,83,9,1)]'
                        }`}>
                          <span className="font-display leading-none">{opt}</span>
                          {timesSelected > 0 && (
                            <span className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center border border-white shadow">
                              {timesSelected}
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] font-black text-amber-200 mt-1 bg-slate-950/90 px-1 rounded border border-amber-600/40">
                          BLOCK
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Elevated Quarry Platform (Prevents any block clipping at the bottom) */}
              <div className="relative h-14 bg-gradient-to-t from-stone-950 via-stone-900 to-amber-950 border-t-3 border-amber-500 flex items-center justify-between px-6 z-15">
                <span className="text-xs">🧱</span>
                <span className="text-xs font-black text-amber-400/80 uppercase tracking-widest text-[9px]">
                  ASSEMBLY RUNWAY
                </span>
                <span className="text-xs">🧱</span>
              </div>

              {/* Companion Builder */}
              <div
                style={{
                  left: `${builderX - (builderFacing === 'left' ? -8 : 8)}%`,
                  bottom: '48px',
                  transform: `translateX(-50%) ${builderFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-25 transition-transform duration-75 flex flex-col items-center pointer-events-none"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-1.5 rounded text-[8px] font-bold text-amber-300 shadow">
                  {companionGuide.name}
                </div>
                <AvatarRenderer customization={companionGuide.customization} size={38} showPet={false} />
              </div>

              {/* Player Builder Rig with Crane Hoist */}
              <div
                style={{
                  left: `${builderX}%`,
                  bottom: `${50 + (craneLowered ? 6 : 0)}px`,
                  transform: `translateX(-50%) ${builderFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-30 transition-transform duration-75 flex flex-col items-center pointer-events-none"
              >
                {heldBrick && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 border border-white font-black text-xs px-2 py-0.5 rounded shadow animate-bounce">
                    [ {heldBrick} ]
                  </div>
                )}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400 px-1.5 rounded text-[8px] font-bold text-amber-200 shadow">
                  {activeExplorer.name}
                </div>
                <AvatarRenderer customization={activeExplorer.customization} size={52} />
              </div>
            </div>
          )}

          {/* ==================== 3. TRICKY TRAILS ==================== */}
          {landId === 'tricky-trails' && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-12 text-xl opacity-40 animate-pulse">🌿</div>
              <div className="absolute top-10 right-14 text-xl opacity-40 animate-pulse">🍃</div>

              <div className="absolute top-6 left-0 right-0 h-24 flex items-center justify-between px-6 sm:px-12 z-20">
                {activeOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const targetX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
                        setCartX(targetX);
                        handleSelectOption(opt, idx);
                      }}
                      className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <div className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-black text-lg sm:text-xl shadow-xl border-3 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-300 via-emerald-400 to-green-600 text-slate-950 border-white shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-105'
                          : 'bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-700 text-slate-950 border-emerald-200 shadow-[0_4px_0_rgba(4,120,87,1)]'
                      }`}>
                        <span className="font-display">{opt}</span>
                        <span className="absolute -bottom-1 -left-1 text-xs">🍃</span>
                      </div>
                      <span className="text-[8px] font-black text-emerald-200 mt-1 bg-slate-950/80 px-1 rounded border border-emerald-500/40">
                        TRAIL RUNE
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-emerald-950 to-stone-900 border-t-4 border-amber-800 flex items-center justify-between px-6 opacity-80">
                <span className="text-amber-600 font-mono text-xs">═════</span>
                <span className="text-amber-600 font-mono text-xs">═════</span>
                <span className="text-amber-600 font-mono text-xs">═════</span>
              </div>

              <div
                style={{
                  left: `${cartX}%`,
                  bottom: `${34 + (isDashing ? 8 : 0)}px`,
                  transform: `translateX(-50%) ${cartFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-30 transition-transform duration-75 flex flex-col items-center pointer-events-none"
              >
                <div className="flex items-center gap-1">
                  <AvatarRenderer customization={activeExplorer.customization} size={46} />
                  <AvatarRenderer customization={companionGuide.customization} size={36} showPet={false} />
                </div>
                <div className="w-16 h-4 bg-amber-800 rounded-b-lg border border-amber-500 flex items-center justify-around px-1 shadow">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-300" />
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. WHISPERING PEAKS ==================== */}
          {landId === 'whispering-peaks' && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-6 text-xl opacity-30 animate-pulse">☁️</div>
              <div className="absolute top-12 right-12 text-2xl opacity-30 animate-pulse">💨</div>

              <div className="absolute top-6 left-0 right-0 h-24 flex items-center justify-between px-6 sm:px-12 z-20">
                {activeOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const targetX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
                        setGliderPos({ x: targetX, y: 35 });
                        handleSelectOption(opt, idx);
                      }}
                      className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <div className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-black text-lg sm:text-xl shadow-xl border-3 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-300 via-indigo-400 to-purple-600 text-slate-950 border-white shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-105'
                          : 'bg-gradient-to-b from-indigo-300 via-indigo-500 to-purple-700 text-slate-950 border-indigo-200 shadow-[0_4px_0_rgba(67,56,202,1)]'
                      }`}>
                        <span className="font-display">{opt}</span>
                        <span className="absolute -top-1.5 -right-1 text-xs">🔔</span>
                      </div>
                      <span className="text-[8px] font-black text-indigo-200 mt-1 bg-slate-950/80 px-1 rounded border border-indigo-500/40">
                        CLOUD CHIME
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  left: `${gliderPos.x}%`,
                  top: `${gliderPos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${gliderBank}deg) ${isThermalBoosting ? 'scale(1.15)' : 'scale(1)'}`,
                }}
                className="absolute z-30 transition-all duration-100 flex items-center gap-2 pointer-events-none"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-2.5 bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 rounded-full shadow border border-white" />
                  <AvatarRenderer customization={activeExplorer.customization} size={48} />
                </div>
                <div className="relative flex flex-col items-center opacity-90">
                  <div className="w-10 h-2 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 rounded-full shadow border border-white" />
                  <AvatarRenderer customization={companionGuide.customization} size={36} showPet={false} />
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. LEXICON EMPIRE ==================== */}
          {landId === 'lexicon-empire' && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-8 text-xl opacity-30 animate-pulse">🏛️</div>
              <div className="absolute top-6 right-8 text-xl opacity-30 animate-pulse">👑</div>

              <div className="absolute top-6 left-0 right-0 h-24 flex items-center justify-between px-6 sm:px-12 z-20">
                {activeOptions.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const targetX = 12 + (idx * (76 / Math.max(activeOptions.length - 1, 1)));
                        setCitadelX(targetX);
                        handleSelectOption(opt, idx);
                      }}
                      className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <div className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-black text-lg sm:text-xl shadow-xl border-3 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 text-slate-950 border-white shadow-[0_0_20px_rgba(245,158,11,0.8)] scale-105'
                          : 'bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 text-slate-950 border-amber-200 shadow-[0_4px_0_rgba(180,83,9,1)]'
                      }`}>
                        <span className="font-display">{opt}</span>
                        <span className="absolute -top-1.5 -right-1 text-xs">✨</span>
                      </div>
                      <span className="text-[8px] font-black text-yellow-300 mt-1 bg-slate-950/80 px-1 rounded border border-amber-500/40">
                        GLYPH PILLAR
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-purple-950/90 border-t-4 border-amber-400 flex items-center justify-between px-6 opacity-80">
                <span>🏛️</span>
                <span>⚡</span>
                <span>🏛️</span>
              </div>

              <div
                style={{
                  left: `${citadelX - (citadelFacing === 'left' ? -8 : 8)}%`,
                  bottom: '36px',
                  transform: `translateX(-50%) ${citadelFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-25 transition-transform duration-75 flex flex-col items-center pointer-events-none"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-1.5 rounded text-[8px] font-bold text-yellow-300 shadow">
                  {companionGuide.name}
                </div>
                <AvatarRenderer customization={companionGuide.customization} size={38} showPet={false} />
              </div>

              <div
                style={{
                  left: `${citadelX}%`,
                  bottom: '38px',
                  transform: `translateX(-50%) ${citadelFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                }}
                className="absolute z-30 transition-transform duration-75 flex flex-col items-center pointer-events-none"
              >
                {isChannelingScepter && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3 h-16 bg-gradient-to-t from-amber-400 to-yellow-200 blur-[1px] animate-pulse" />
                )}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-400 px-1.5 rounded text-[8px] font-bold text-amber-200 shadow">
                  {activeExplorer.name}
                </div>
                <AvatarRenderer customization={activeExplorer.customization} size={52} />
              </div>
            </div>
          )}

          {/* Goal Altar */}
          <div
            onClick={handleSubmit}
            className="absolute bottom-4 right-3 z-35 flex flex-col items-center cursor-pointer group"
            title="Check answer!"
          >
            <div className="w-10 h-9 rounded-t-xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-[8px] font-black text-amber-300 uppercase bg-slate-950 px-1 rounded border border-amber-500/40">
              GOAL
            </span>
          </div>
        </div>

        {/* Feedback Banner */}
        {showFeedback && (
          <div
            className={`p-3 sm:p-4 border-t flex items-start gap-3 transition-all ${
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-inner'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            
            <div className="space-y-1 flex-1">
              <div className="text-xs font-black uppercase tracking-wider">
                {isCorrect ? '⭐ Correct! Phonics Mastered!' : '❌ Not Quite! Incorrect Answer.'}
              </div>
              <div className="text-xs leading-relaxed text-slate-200">
                {isCorrect ? (
                  challenge.explanation
                ) : (
                  'No hints allowed in Phonixia — listen to the sound carefully and try again!'
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer border border-rose-400/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
              {isCorrect && (
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow cursor-pointer transition-transform hover:scale-105"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="px-4 py-2 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-amber-500/30">
              <button
                onMouseDown={() => setDpad(p => ({ ...p, left: true }))}
                onMouseUp={() => setDpad(p => ({ ...p, left: false }))}
                onTouchStart={() => setDpad(p => ({ ...p, left: true }))}
                onTouchEnd={() => setDpad(p => ({ ...p, left: false }))}
                className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                  dpad.left ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-amber-300 border-amber-500/40'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {(landId === 'sound-shallows' || landId === 'whispering-peaks') && (
                <>
                  <button
                    onMouseDown={() => setDpad(p => ({ ...p, up: true }))}
                    onMouseUp={() => setDpad(p => ({ ...p, up: false }))}
                    onTouchStart={() => setDpad(p => ({ ...p, up: true }))}
                    onTouchEnd={() => setDpad(p => ({ ...p, up: false }))}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                      dpad.up ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    onMouseDown={() => setDpad(p => ({ ...p, down: true }))}
                    onMouseUp={() => setDpad(p => ({ ...p, down: false }))}
                    onTouchStart={() => setDpad(p => ({ ...p, down: true }))}
                    onTouchEnd={() => setDpad(p => ({ ...p, down: false }))}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                      dpad.down ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </>
              )}

              <button
                onMouseDown={() => setDpad(p => ({ ...p, right: true }))}
                onMouseUp={() => setDpad(p => ({ ...p, right: false }))}
                onTouchStart={() => setDpad(p => ({ ...p, right: true }))}
                onTouchEnd={() => setDpad(p => ({ ...p, right: false }))}
                className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                  dpad.right ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-950 text-amber-300 border-amber-500/40'
                }`}
              >
                <ArrowRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <button
              onMouseDown={triggerRealmAction}
              onTouchStart={triggerRealmAction}
              className={`h-9 px-3.5 rounded-2xl border-2 flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeActionPulse
                  ? 'bg-amber-300 text-slate-950 border-white scale-95 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                  : `bg-gradient-to-r ${landTheme.accentColor} text-slate-950 border-white/80 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95`
              }`}
            >
              {landTheme.actionIcon}
              <span>{landTheme.actionTitle}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] text-slate-400 hidden sm:inline">Exploring with:</span>
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <span>{activeExplorer.name}</span>
              <span className="text-slate-400">&amp;</span>
              <span className="text-amber-200">{companionGuide.name}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
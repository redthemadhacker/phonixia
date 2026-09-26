import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LandId, ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Star, Volume2, 
  CheckCircle2, RotateCcw, ChevronsUp, Sparkles, Shield, Flame, 
  Zap, Hammer, Compass
} from 'lucide-react';

export interface GameQuestion {
  instruction: string;
  targetSound: string;
  soundCue: string;
  choices: string[];
  correct: string;
  explanation: string;
  missionTitle?: string;
  actionPrompt?: string;
}

interface ActivePlayableStageProps {
  landId: LandId;
  activeExplorer: ExplorerProfile;
  companionGuide: { name: string; customization: any };
  currentQuestion: GameQuestion;
  activeGameIndex: number;
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer: string | null;
  realmLives: number;
  earnedStars: number;
  bossBarrierHp: number;
  roundCompleted?: boolean;
  onSelectChoice: (choice: string) => void;
  onFinishRound: () => void;
  onTryAgain: () => void;
  onNextLevel?: () => void;
  onClose: () => void;
}

export const ActivePlayableStage: React.FC<ActivePlayableStageProps> = ({
  landId,
  activeExplorer,
  companionGuide,
  currentQuestion,
  activeGameIndex,
  isAnswered,
  isCorrect,
  selectedAnswer,
  realmLives,
  earnedStars,
  bossBarrierHp,
  roundCompleted = false,
  onSelectChoice,
  onFinishRound,
  onTryAgain,
  onNextLevel,
  onClose
}) => {
  // Game Realm Mechanics
  // 'sound-shallows' -> swim
  // 'builders-guild' -> smash / hoist
  // 'tricky-trails' -> vine / ride
  // 'whispering-peaks' -> cloud / snowboard
  // 'lexicon-empire' -> boss / chariot laser

  // 1. SWIMMING STATE (Sound Shallows)
  const [swimPos, setSwimPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [swimFacing, setSwimFacing] = useState<'left' | 'right'>('right');
  const [isSwimmingStroke, setIsSwimmingStroke] = useState(false);
  const [bubbleParticles, setBubbleParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  // 2. CRANE & HOIST STATE (Builders' Guild)
  const [craneTrolleyX, setCraneTrolleyX] = useState<number>(50);
  const [hoistHookY, setHoistHookY] = useState<number>(20); // 20% (up) to 75% (ground grab)
  const [isHoisting, setIsHoisting] = useState(false);
  const [hoistedChoice, setHoistedChoice] = useState<string | null>(null);

  // 3. RAPTOR MOUNT & VINE SWING STATE (Tricky Trails)
  const [riderX, setRiderX] = useState<number>(30);
  const [riderFacing, setRiderFacing] = useState<'left' | 'right'>('right');
  const [isVineSwinging, setIsVineSwinging] = useState(false);
  const [vineSwingAngle, setVineSwingAngle] = useState(0); // -40deg to +40deg
  const [vineGrabChoice, setVineGrabChoice] = useState<string | null>(null);

  // 4. SNOWBOARD & CLOUD BOUNCE STATE (Whispering Peaks)
  const [snowboardX, setSnowboardX] = useState<number>(40);
  const [snowboardFacing, setSnowboardFacing] = useState<'left' | 'right'>('right');
  const [snowCarveAngle, setSnowCarveAngle] = useState(0); // -15deg to 15deg
  const [isCloudBouncing, setIsCloudBouncing] = useState(false);
  const [cloudBounceHeight, setCloudBounceHeight] = useState(0); // 0 to 120px
  const [cloudFlipRot, setCloudFlipRot] = useState(0); // 0 to 360deg

  // 5. BOSS BATTLE CHARIOT STATE (Lexicon Empire)
  const [chariotX, setChariotX] = useState<number>(50);
  const [laserBeamTarget, setLaserBeamTarget] = useState<{ x: number; y: number; choice: string } | null>(null);
  const [isLaserFiring, setIsLaserFiring] = useState(false);
  const [bossAttackAnim, setBossAttackAnim] = useState(false);

  // General controls input
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  // Continuous movement loop based on mechanic
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // 1. SOUND SHALLOWS: 4-Way Swimming
      if (landId === 'sound-shallows') {
        const speed = 1.1;
        setSwimPos((prev) => {
          let newX = prev.x;
          let newY = prev.y;

          if (activeDpad.left) {
            newX = Math.max(12, prev.x - speed);
            setSwimFacing('left');
          }
          if (activeDpad.right) {
            newX = Math.min(88, prev.x + speed);
            setSwimFacing('right');
          }
          if (activeDpad.up) {
            newY = Math.max(18, prev.y - speed * 0.9); // Swim to surface
          }
          if (activeDpad.down) {
            newY = Math.min(82, prev.y + speed * 0.9); // Dive deep
          }

          return { x: newX, y: newY };
        });
      }

      // 2. BUILDERS GUILD: Crane Trolley Left/Right
      if (landId === 'builders-guild') {
        const speed = 1.3;
        if (activeDpad.left) {
          setCraneTrolleyX((prev) => Math.max(12, prev - speed));
        }
        if (activeDpad.right) {
          setCraneTrolleyX((prev) => Math.min(88, prev + speed));
        }
      }

      // 3. TRICKY TRAILS: Jungle Raptor Ride Left/Right
      if (landId === 'tricky-trails' && !isVineSwinging) {
        const speed = 1.4;
        if (activeDpad.left) {
          setRiderX((prev) => Math.max(12, prev - speed));
          setRiderFacing('left');
        }
        if (activeDpad.right) {
          setRiderX((prev) => Math.min(88, prev + speed));
          setRiderFacing('right');
        }
      }

      // 4. WHISPERING PEAKS: Snowboard Carving Left/Right
      if (landId === 'whispering-peaks' && !isCloudBouncing) {
        const speed = 1.4;
        if (activeDpad.left) {
          setSnowboardX((prev) => Math.max(12, prev - speed));
          setSnowboardFacing('left');
          setSnowCarveAngle(-14);
        } else if (activeDpad.right) {
          setSnowboardX((prev) => Math.min(88, prev + speed));
          setSnowboardFacing('right');
          setSnowCarveAngle(14);
        } else {
          setSnowCarveAngle(0);
        }
      }

      // 5. LEXICON EMPIRE: Phoenix Battle Chariot Drive Left/Right
      if (landId === 'lexicon-empire') {
        const speed = 1.3;
        if (activeDpad.left) {
          setChariotX((prev) => Math.max(12, prev - speed));
        }
        if (activeDpad.right) {
          setChariotX((prev) => Math.min(88, prev + speed));
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [landId, activeDpad, isVineSwinging, isCloudBouncing]);

  // Periodic atmospheric animations (Boss attacks & underwater bubbles)
  useEffect(() => {
    if (landId === 'sound-shallows') {
      const interval = setInterval(() => {
        setBubbleParticles((prev) => [
          ...prev.slice(-12),
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 90 + 5,
            y: 90,
            size: Math.random() * 12 + 6
          }
        ]);
      }, 700);
      return () => clearInterval(interval);
    }

    if (landId === 'lexicon-empire') {
      const interval = setInterval(() => {
        setBossAttackAnim(true);
        setTimeout(() => setBossAttackAnim(false), 900);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [landId]);

  // Helper: Find closest choice based on horizontal position
  const getClosestChoiceIndex = useCallback((posX: number) => {
    if (!currentQuestion) return 0;
    const count = currentQuestion.choices.length;
    let closest = 0;
    let minDiff = 999;
    currentQuestion.choices.forEach((_, idx) => {
      const targetX = 15 + idx * (70 / Math.max(count - 1, 1));
      const diff = Math.abs(posX - targetX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = idx;
      }
    });
    return closest;
  }, [currentQuestion]);

  // --- ACTION 1: SOUND SHALLOWS SWIM STROKE & DIVE ---
  const triggerSwimStroke = useCallback((choiceOverride?: string) => {
    if (isAnswered || !currentQuestion) return;
    setIsSwimmingStroke(true);
    sounds.playSplash();

    // Select target choice
    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(swimPos.x);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    // Swim directly to target pearl
    setSwimPos({ x: targetX, y: 35 });
    sounds.playCollect();

    setTimeout(() => {
      setIsSwimmingStroke(false);
      onSelectChoice(targetChoice);
    }, 450);
  }, [isAnswered, currentQuestion, getClosestChoiceIndex, swimPos.x, onSelectChoice]);

  // --- ACTION 2: BUILDERS GUILD CRANE HOIST & SLAM ---
  const triggerCraneHoist = useCallback((choiceOverride?: string) => {
    if (isAnswered || isHoisting || !currentQuestion) return;
    setIsHoisting(true);

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(craneTrolleyX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setCraneTrolleyX(targetX);
    // Lower hoist hook
    setHoistHookY(72);
    sounds.playHammer();

    setTimeout(() => {
      // Pick up keystone & winch up
      setHoistedChoice(targetChoice);
      setHoistHookY(26);
      sounds.playHammer();
      sounds.playCollect();

      setTimeout(() => {
        setIsHoisting(false);
        onSelectChoice(targetChoice);
      }, 500);
    }, 450);
  }, [isAnswered, isHoisting, currentQuestion, getClosestChoiceIndex, craneTrolleyX, onSelectChoice]);

  // --- ACTION 3: TRICKY TRAILS RAPTOR DASH & VINE LEAP ---
  const triggerVineLeap = useCallback((choiceOverride?: string) => {
    if (isAnswered || isVineSwinging || !currentQuestion) return;
    setIsVineSwinging(true);
    sounds.playWhoosh();

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(riderX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    // Vine Swing arc
    setVineGrabChoice(targetChoice);
    setVineSwingAngle(riderFacing === 'left' ? -35 : 35);
    setRiderX(targetX);
    sounds.playCollect();

    setTimeout(() => {
      setVineSwingAngle(0);
      setIsVineSwinging(false);
      onSelectChoice(targetChoice);
    }, 550);
  }, [isAnswered, isVineSwinging, currentQuestion, getClosestChoiceIndex, riderX, riderFacing, onSelectChoice]);

  // --- ACTION 4: WHISPERING PEAKS SNOWBOARD & CLOUD BOUNCE ---
  const triggerCloudBounce = useCallback((choiceOverride?: string) => {
    if (isAnswered || isCloudBouncing || !currentQuestion) return;
    setIsCloudBouncing(true);
    sounds.playWhoosh();

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(snowboardX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setSnowboardX(targetX);
    setCloudBounceHeight(95);
    setCloudFlipRot(360);
    sounds.playJump();
    sounds.playCollect();

    setTimeout(() => {
      setCloudBounceHeight(0);
      setCloudFlipRot(0);
      setIsCloudBouncing(false);
      onSelectChoice(targetChoice);
    }, 600);
  }, [isAnswered, isCloudBouncing, currentQuestion, getClosestChoiceIndex, snowboardX, onSelectChoice]);

  // --- ACTION 5: LEXICON EMPIRE CHARIOT & SUN CANNON BLAST ---
  const triggerChariotLaser = useCallback((choiceOverride?: string) => {
    if (isAnswered || isLaserFiring || !currentQuestion) return;
    setIsLaserFiring(true);

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(chariotX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    // Align chariot and shoot golden laser beam
    setChariotX(targetX);
    setLaserBeamTarget({ x: targetX, y: 32, choice: targetChoice });
    sounds.playLaser();

    setTimeout(() => {
      setLaserBeamTarget(null);
      setIsLaserFiring(false);
      onSelectChoice(targetChoice);
    }, 450);
  }, [isAnswered, isLaserFiring, currentQuestion, getClosestChoiceIndex, chariotX, onSelectChoice]);

  // Unified realm primary action trigger
  const triggerRealmAction = useCallback((choiceOverride?: string) => {
    switch (landId) {
      case 'sound-shallows':
        triggerSwimStroke(choiceOverride);
        break;
      case 'builders-guild':
        triggerCraneHoist(choiceOverride);
        break;
      case 'tricky-trails':
        triggerVineLeap(choiceOverride);
        break;
      case 'whispering-peaks':
        triggerCloudBounce(choiceOverride);
        break;
      case 'lexicon-empire':
        triggerChariotLaser(choiceOverride);
        break;
    }
  }, [landId, triggerSwimStroke, triggerCraneHoist, triggerVineLeap, triggerCloudBounce, triggerChariotLaser]);

  // Keyboard navigation & space bar action inside active game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') {
        setActiveDpad((prev) => ({ ...prev, left: true }));
      }
      if (k === 'arrowright' || k === 'd') {
        setActiveDpad((prev) => ({ ...prev, right: true }));
      }
      if (k === 'arrowup' || k === 'w') {
        setActiveDpad((prev) => ({ ...prev, up: true }));
      }
      if (k === 'arrowdown' || k === 's') {
        setActiveDpad((prev) => ({ ...prev, down: true }));
      }
      if (k === ' ' || k === 'enter') {
        e.preventDefault();
        triggerRealmAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') {
        setActiveDpad((prev) => ({ ...prev, left: false }));
      }
      if (k === 'arrowright' || k === 'd') {
        setActiveDpad((prev) => ({ ...prev, right: false }));
      }
      if (k === 'arrowup' || k === 'w') {
        setActiveDpad((prev) => ({ ...prev, up: false }));
      }
      if (k === 'arrowdown' || k === 's') {
        setActiveDpad((prev) => ({ ...prev, down: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerRealmAction]);

  // Realm UI Theme configuration
  const realmInfo = {
    'sound-shallows': {
      title: 'Underwater Pearl Dive',
      lore: 'Swim & Dive through the bioluminescent lagoon to pop the target Sound Pearl!',
      btnLabel: 'SWIM & DIVE',
      btnEmoji: '🫧',
      btnBg: 'bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.7)]',
      borderAccent: 'border-cyan-400',
      dpadColor: 'border-cyan-500/40 text-cyan-300'
    },
    'builders-guild': {
      title: 'Castle Rampart Builder',
      lore: 'Operate the heavy gantry crane! Hoist keystones and forge the fortress wall!',
      btnLabel: 'HOIST & SLAM',
      btnEmoji: '🏗️',
      btnBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.7)]',
      borderAccent: 'border-amber-400',
      dpadColor: 'border-amber-500/40 text-amber-300'
    },
    'tricky-trails': {
      title: 'Jungle Raptor & Canopy Vine',
      lore: 'Ride the swift jungle raptor, gallop over pits, and swing vines to snatch Rune Pods!',
      btnLabel: 'VINE LEAP',
      btnEmoji: '🍃',
      btnBg: 'bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.7)]',
      borderAccent: 'border-emerald-400',
      dpadColor: 'border-emerald-500/40 text-emerald-300'
    },
    'whispering-peaks': {
      title: 'Glacier Snowboard & Cloud Bounce',
      lore: 'Carve across the snowy summit and spring off bouncy clouds to shatter Frost Crystals!',
      btnLabel: 'CLOUD BOUNCE',
      btnEmoji: '☁️',
      btnBg: 'bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.7)]',
      borderAccent: 'border-indigo-400',
      dpadColor: 'border-indigo-500/40 text-indigo-300'
    },
    'lexicon-empire': {
      title: 'Phoenix Chariot Boss Showdown',
      lore: 'Pilot the Golden Battle Chariot, dodge dark magma, and blast the Royal Obelisks!',
      btnLabel: 'FIRE CANNON',
      btnEmoji: '⚡',
      btnBg: 'bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 text-slate-950 shadow-[0_0_20px_rgba(244,63,94,0.7)]',
      borderAccent: 'border-rose-400',
      dpadColor: 'border-rose-500/40 text-rose-300'
    }
  }[landId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className={`relative w-full max-w-4xl bg-slate-900 border-3 ${realmInfo.borderAccent} rounded-3xl p-3 sm:p-5 text-center space-y-2.5 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-scale-up flex flex-col max-h-[calc(100dvh-16px)] overflow-y-auto`}>
        
        {/* TOP BAR: Realm Level, Title, Mario Hearts & Stars */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-wide">
              Level #{activeGameIndex}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold hidden xs:inline">
              {realmInfo.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 3 Mario Hearts */}
            <div className="flex items-center gap-0.5" title="Mario Lives: 3 tries">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="text-sm">
                  {i < realmLives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>

            {/* Stars */}
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PHONICS INSTRUCTION & SOUND CUE */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-200 font-bold">
            {currentQuestion.instruction}
          </p>

          <div className="inline-flex items-center gap-2.5 bg-slate-950/80 border-2 border-amber-400 px-4 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-display tracking-widest">
              {currentQuestion.targetSound}
            </span>
            <button
              type="button"
              onClick={() => sounds.speak(currentQuestion.soundCue)}
              className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer transition-transform hover:scale-110 active:scale-95"
              title="Speak Sound Cue"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <p className="text-[11px] text-amber-300/80 font-bold">
            {realmInfo.lore}
          </p>
        </div>

        {/* BOSS HEALTH BAR FOR LEXICON EMPIRE */}
        {landId === 'lexicon-empire' && (
          <div className="bg-slate-950/90 border border-rose-500/60 p-2 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-rose-300 font-black uppercase text-[10px]">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Shadow King's Barrier:</span>
            </div>
            <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-rose-500/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${bossBarrierHp}%` }}
              />
            </div>
            <span className="font-mono text-amber-300 font-bold text-[10px]">{bossBarrierHp}%</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* DEDICATED REALM VIDEO GAME STAGES                         */}
        {/* ======================================================== */}

        {/* 1. SOUND SHALLOWS: REAL UNDERWATER SWIMMING & DIVING ARENA */}
        {landId === 'sound-shallows' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] md:h-[380px] bg-gradient-to-b from-cyan-900 via-teal-950 to-blue-950 rounded-2xl border-2 border-cyan-400/60 overflow-hidden select-none">
            {/* Sunbeams piercing surface */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-transparent to-transparent" />
            
            {/* Animated Rising Bubbles */}
            {bubbleParticles.map((b) => (
              <div
                key={b.id}
                style={{
                  left: `${b.x}%`,
                  bottom: `${b.y}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
                className="absolute rounded-full bg-cyan-200/30 border border-cyan-100/50 pointer-events-none animate-pulse"
              />
            ))}

            {/* Sea bottom corals & seaweed */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-teal-950 to-transparent flex items-end justify-between px-6 pointer-events-none text-xl opacity-75">
              <span>🪸</span>
              <span>🌿</span>
              <span>⭐</span>
              <span>🪸</span>
              <span>🐠</span>
              <span>🌿</span>
            </div>

            {/* FLOATING LUMINOUS PEARL CLAMSHELLS (CHOICES) */}
            <div className="absolute inset-0 flex items-center justify-around px-4 sm:px-12 pointer-events-none z-20">
              {currentQuestion.choices.map((choice, idx) => {
                const count = currentQuestion.choices.length;
                const clamX = 15 + idx * (70 / Math.max(count - 1, 1));
                // Staggered reef depths: 28% to 45%
                const clamY = 24 + (idx % 2 === 0 ? 0 : 16);
                const isSelected = selectedAnswer === choice;
                const isChoiceCorrect = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();

                return (
                  <div
                    key={idx}
                    onClick={() => triggerSwimStroke(choice)}
                    style={{
                      left: `${clamX}%`,
                      top: `${clamY}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  >
                    {/* Clamshell with Phonics Pearl */}
                    <div className={`relative px-3.5 py-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-sm xs:text-base sm:text-lg border-2 shadow-2xl transition-all ${
                      isAnswered
                        ? isCorrect && isChoiceCorrect
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-110 ring-4 ring-emerald-300'
                          : isSelected
                          ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-rose-200 border-rose-400'
                          : 'bg-slate-900/80 text-slate-500 border-slate-700 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                        : 'bg-gradient-to-b from-cyan-400 via-teal-400 to-blue-500 text-slate-950 border-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:border-white'
                    }`}>
                      <div className="text-xs mb-0.5">🐚</div>
                      <span className="font-display font-black tracking-wider truncate max-w-[80px]">
                        {choice}
                      </span>
                      {/* Pearl shimmer */}
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HORIZONTALLY SWIMMING EXPLORER AVATAR */}
            <div
              style={{
                left: `${swimPos.x}%`,
                top: `${swimPos.y}%`,
                transform: `translate(-50%, -50%) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} rotate(${isSwimmingStroke ? (swimFacing === 'left' ? 15 : -15) : 0}deg)`,
              }}
              className="absolute z-30 transition-transform duration-150 flex flex-col items-center pointer-events-none"
            >
              {/* Explorer Name & Diving Bubble */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-950/85 border border-cyan-400/60 px-2 py-0.5 rounded-full text-[9px] font-black text-cyan-200 flex items-center gap-1 shadow">
                <span>🤿</span>
                <span>{activeExplorer.name} (Swimming)</span>
              </div>

              {/* Swimming Avatar with flipper kick motion */}
              <div className="relative">
                <AvatarRenderer customization={activeExplorer.customization} size={54} />
                {/* Diving Fins on feet */}
                <div className="absolute -bottom-1 -left-2 text-base animate-pulse">
                  🫧
                </div>
              </div>
            </div>

            {/* Companion swimming alongside */}
            <div
              style={{
                left: `${swimPos.x - (swimFacing === 'left' ? -9 : 9)}%`,
                top: `${swimPos.y + 6}%`,
                transform: `translate(-50%, -50%) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
              }}
              className="absolute z-25 transition-transform duration-200 pointer-events-none flex flex-col items-center opacity-85"
            >
              <div className="text-xs">🐬</div>
              <AvatarRenderer customization={companionGuide.customization} size={38} showPet={false} />
            </div>
          </div>
        )}

        {/* 2. BUILDERS GUILD: REAL CRANE HOIST & FORTRESS RAMPART ARENA */}
        {landId === 'builders-guild' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] md:h-[380px] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 rounded-2xl border-2 border-amber-500/60 overflow-hidden select-none">
            {/* Overhead Steel I-Beam Rail */}
            <div className="absolute top-0 inset-x-0 h-6 bg-stone-800 border-b-2 border-stone-600 flex items-center justify-between px-4 z-20">
              <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                ⚙️ Industrial Gantry Rail #4
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
            </div>

            {/* Movable Overhead Crane Trolley */}
            <div
              style={{
                left: `${craneTrolleyX}%`,
                top: '20px',
                transform: 'translateX(-50%)',
              }}
              className="absolute z-30 transition-all duration-75 flex flex-col items-center pointer-events-none"
            >
              {/* Trolley Box with Gears */}
              <div className="w-12 h-6 rounded bg-amber-600 border border-yellow-300 shadow flex items-center justify-around px-1 text-slate-950 font-black text-xs">
                <span>⚙️</span>
                <span>🏗️</span>
              </div>

              {/* Steel Cable dropping down */}
              <div
                style={{
                  height: `${(hoistHookY - 10) * 2.8}px`,
                }}
                className="w-1 bg-gradient-to-b from-yellow-400 via-stone-400 to-stone-200 shadow transition-all duration-200"
              />

              {/* Heavy Magnetic Hoist Claw */}
              <div className="w-10 h-5 rounded-b-lg bg-stone-950 border-2 border-amber-400 flex items-center justify-center text-xs font-black text-amber-300 shadow-xl">
                🪝
              </div>

              {/* If Keystone is picked up, display hoisted block */}
              {hoistedChoice && (
                <div className="mt-1 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-2 border-white font-black text-sm shadow-[0_0_20px_rgba(245,158,11,1)] animate-bounce">
                  {hoistedChoice}
                </div>
              )}
            </div>

            {/* Scaffolding Walkway with Builder Explorer Operating Lever */}
            <div className="absolute top-16 left-4 z-20 flex items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-amber-500/40">
              <AvatarRenderer customization={activeExplorer.customization} size={42} />
              <div className="text-left text-[9px] font-black text-amber-300">
                <div className="flex items-center gap-1">
                  <span>🔨</span>
                  <span>{activeExplorer.name} (Operator)</span>
                </div>
                <div className="text-slate-400 font-mono">Winch Ready</div>
              </div>
            </div>

            {/* QUARRY GROUND STAGING: CARVED KEYSTONE BLOCKS (CHOICES) */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => {
                const count = currentQuestion.choices.length;
                const blockX = 15 + idx * (70 / Math.max(count - 1, 1));
                const isSelected = selectedAnswer === choice;
                const isChoiceCorrect = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();

                return (
                  <div
                    key={idx}
                    onClick={() => triggerCraneHoist(choice)}
                    style={{
                      left: `${blockX}%`,
                      transform: 'translateX(-50%)',
                    }}
                    className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 active:scale-95"
                  >
                    {/* Fortress Arch Socket above */}
                    <div className="mb-2 text-[9px] font-mono text-amber-400/80 uppercase font-bold flex items-center gap-1">
                      <span>Socket #{idx + 1}</span>
                    </div>

                    {/* Heavy Carved Masonry Keystone */}
                    <div className={`relative px-4 py-3 rounded-2xl flex flex-col items-center justify-center font-black text-sm xs:text-base sm:text-xl border-3 shadow-2xl transition-all ${
                      isAnswered
                        ? isCorrect && isChoiceCorrect
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-110 ring-4 ring-emerald-300'
                          : isSelected
                          ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-rose-200 border-rose-400'
                          : 'bg-stone-900 text-stone-600 border-stone-800 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                        : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-200 shadow-[0_4px_0_rgba(180,83,9,1)] group-hover:border-white'
                    }`}>
                      {/* Iron bolt corner accents */}
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-black/50" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black/50" />
                      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-black/50" />
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-black/50" />

                      <span className="font-display font-black tracking-wider truncate max-w-[85px]">
                        {choice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. TRICKY TRAILS: REAL JUNGLE RAPTOR MOUNT & CANOPY VINE ARENA */}
        {landId === 'tricky-trails' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] md:h-[380px] bg-gradient-to-b from-emerald-950 via-slate-950 to-stone-950 rounded-2xl border-2 border-emerald-400/60 overflow-hidden select-none">
            {/* Canopy Branches and Vines */}
            <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-emerald-900/60 to-transparent flex items-start justify-around px-8 pointer-events-none text-2xl opacity-70">
              <span className="animate-pulse">🌿</span>
              <span>🍃</span>
              <span className="animate-pulse">🌿</span>
              <span>🍃</span>
              <span className="animate-pulse">🌿</span>
            </div>

            {/* Bramble chasm below */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-stone-950 to-transparent flex items-center justify-between px-6 pointer-events-none text-sm opacity-60">
              <span>🪵</span>
              <span>🍄</span>
              <span>🌿</span>
              <span>🪵</span>
              <span>🍄</span>
            </div>

            {/* SUSPENDED GOLDEN RUNE PODS / VINE FRUIT (CHOICES) */}
            <div className="absolute top-12 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => {
                const count = currentQuestion.choices.length;
                const podX = 15 + idx * (70 / Math.max(count - 1, 1));
                const isSelected = selectedAnswer === choice;
                const isChoiceCorrect = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();

                return (
                  <div
                    key={idx}
                    onClick={() => triggerVineLeap(choice)}
                    style={{
                      left: `${podX}%`,
                      transform: 'translateX(-50%)',
                    }}
                    className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  >
                    {/* Hanging Vine Line */}
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-green-400 rounded-full" />

                    {/* Glowing Golden Rune Pod */}
                    <div className={`relative px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-sm xs:text-base sm:text-lg border-2 shadow-2xl transition-all ${
                      isAnswered
                        ? isCorrect && isChoiceCorrect
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-110 ring-4 ring-emerald-300'
                          : isSelected
                          ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-rose-200 border-rose-400'
                          : 'bg-slate-900/80 text-slate-500 border-slate-700 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                        : 'bg-gradient-to-b from-emerald-400 via-green-400 to-teal-500 text-slate-950 border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.7)] group-hover:border-white'
                    }`}>
                      <span className="text-xs mb-0.5">✨</span>
                      <span className="font-display font-black tracking-wider truncate max-w-[85px]">
                        {choice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EXPLORER RIDING THE JUNGLE RAPTOR MOUNT */}
            <div
              style={{
                left: `${riderX}%`,
                bottom: `${isVineSwinging ? 120 : 34}px`,
                transform: `translateX(-50%) ${riderFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} rotate(${vineSwingAngle}deg)`,
              }}
              className="absolute z-30 transition-all duration-150 flex flex-col items-center pointer-events-none"
            >
              {/* Vine held during swing */}
              {isVineSwinging && (
                <div className="absolute -top-24 w-1.5 h-28 bg-emerald-500 shadow" />
              )}

              {/* Rider Tag */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-emerald-400/60 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-300 shadow flex items-center gap-1 whitespace-nowrap">
                <span>🦖</span>
                <span>{activeExplorer.name} (Raptor Rider)</span>
              </div>

              {/* Explorer Avatar mounted */}
              <div className="relative flex flex-col items-center">
                <AvatarRenderer customization={activeExplorer.customization} size={48} />
                
                {/* Agile Jungle Raptor Mount */}
                <div className="w-14 h-8 -mt-2 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center justify-between px-2 text-xs">
                  <span>🐾</span>
                  <span className="text-[10px] font-black text-amber-300">Raptor</span>
                  <span>🐾</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WHISPERING PEAKS: REAL GLACIER SNOWBOARD & CLOUD BOUNCE ARENA */}
        {landId === 'whispering-peaks' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] md:h-[380px] bg-gradient-to-b from-indigo-950 via-slate-900 to-cyan-950 rounded-2xl border-2 border-indigo-400/60 overflow-hidden select-none">
            {/* Shifting Aurora Borealis in Sky */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-indigo-500/20 via-cyan-500/15 to-transparent pointer-events-none" />

            {/* Bouncy Trampoline Clouds */}
            <div className="absolute top-36 inset-x-0 flex items-center justify-around px-8 pointer-events-none text-3xl opacity-50">
              <span className="animate-bounce">☁️</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>☁️</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>☁️</span>
            </div>

            {/* HIGH-ALTITUDE FROST CRYSTALS (CHOICES) */}
            <div className="absolute top-8 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => {
                const count = currentQuestion.choices.length;
                const crystalX = 15 + idx * (70 / Math.max(count - 1, 1));
                const isSelected = selectedAnswer === choice;
                const isChoiceCorrect = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();

                return (
                  <div
                    key={idx}
                    onClick={() => triggerCloudBounce(choice)}
                    style={{
                      left: `${crystalX}%`,
                      transform: 'translateX(-50%)',
                    }}
                    className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  >
                    {/* Shimmering Frost Crystal */}
                    <div className={`relative px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-sm xs:text-base sm:text-lg border-2 shadow-2xl transition-all ${
                      isAnswered
                        ? isCorrect && isChoiceCorrect
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-110 ring-4 ring-emerald-300'
                          : isSelected
                          ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-rose-200 border-rose-400'
                          : 'bg-slate-900/80 text-slate-500 border-slate-700 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                        : 'bg-gradient-to-b from-sky-300 via-indigo-400 to-cyan-400 text-slate-950 border-cyan-100 shadow-[0_0_25px_rgba(99,102,241,0.7)] group-hover:border-white'
                    }`}>
                      <span className="text-xs mb-0.5">❄️</span>
                      <span className="font-display font-black tracking-wider truncate max-w-[85px]">
                        {choice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EXPLORER RIDING THE NEON AURORA SNOWBOARD */}
            <div
              style={{
                left: `${snowboardX}%`,
                bottom: `${34 + cloudBounceHeight}px`,
                transform: `translateX(-50%) ${snowboardFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} rotate(${snowCarveAngle + cloudFlipRot}deg)`,
              }}
              className="absolute z-30 transition-transform duration-100 flex flex-col items-center pointer-events-none"
            >
              {/* Rider Tag */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-indigo-400/60 px-2 py-0.5 rounded-full text-[9px] font-black text-indigo-200 shadow flex items-center gap-1 whitespace-nowrap">
                <span>🏂</span>
                <span>{activeExplorer.name} (Snowboard)</span>
              </div>

              {/* Explorer Avatar */}
              <div className="relative flex flex-col items-center">
                <AvatarRenderer customization={activeExplorer.customization} size={48} />
                
                {/* Neon Aurora Snowboard */}
                <div className="w-16 h-3 -mt-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full border border-white shadow-[0_0_15px_rgba(6,182,212,0.9)] flex items-center justify-between px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. LEXICON EMPIRE: REAL BOSS SHOWDOWN & PHOENIX CHARIOT ARENA */}
        {landId === 'lexicon-empire' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] md:h-[380px] bg-gradient-to-b from-purple-950 via-slate-950 to-rose-950 rounded-2xl border-2 border-rose-500/60 overflow-hidden select-none">
            {/* The Menacing Shadow King hovering at top */}
            <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-transform ${bossAttackAnim ? 'scale-120' : 'scale-100'}`}>
              <div className="text-4xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse">
                👹
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-300 bg-black/80 px-2 py-0.5 rounded border border-rose-500/50 mt-1">
                Shadow King (Imperator)
              </span>
            </div>

            {/* Magma river glow at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-rose-950 to-transparent flex items-center justify-between px-6 pointer-events-none text-sm opacity-50">
              <span>🔥</span>
              <span>⚡</span>
              <span>🔥</span>
              <span>⚡</span>
              <span>🔥</span>
            </div>

            {/* Laser Beam blast when fired */}
            {laserBeamTarget && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
                <line
                  x1={`${chariotX}%`}
                  y1="75%"
                  x2={`${laserBeamTarget.x}%`}
                  y2={`${laserBeamTarget.y}%`}
                  stroke="#f59e0b"
                  strokeWidth="5"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
                <circle cx={`${laserBeamTarget.x}%`} cy={`${laserBeamTarget.y}%`} r="12" fill="#f59e0b" className="animate-ping" />
              </svg>
            )}

            {/* ROYAL OBSIDIAN OBELISKS (CHOICES) */}
            <div className="absolute top-18 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => {
                const count = currentQuestion.choices.length;
                const obeliskX = 15 + idx * (70 / Math.max(count - 1, 1));
                const isSelected = selectedAnswer === choice;
                const isChoiceCorrect = choice.trim().toLowerCase() === currentQuestion.correct.trim().toLowerCase();

                return (
                  <div
                    key={idx}
                    onClick={() => triggerChariotLaser(choice)}
                    style={{
                      left: `${obeliskX}%`,
                      transform: 'translateX(-50%)',
                    }}
                    className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                  >
                    {/* Royal Obelisk Body */}
                    <div className={`relative px-4 py-3 rounded-2xl flex flex-col items-center justify-center font-black text-sm xs:text-base sm:text-lg border-2 shadow-2xl transition-all ${
                      isAnswered
                        ? isCorrect && isChoiceCorrect
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-white shadow-[0_0_30px_rgba(16,185,129,0.9)] scale-110 ring-4 ring-emerald-300'
                          : isSelected
                          ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-rose-200 border-rose-400'
                          : 'bg-slate-950 text-slate-600 border-slate-800 opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-105'
                        : 'bg-gradient-to-b from-rose-500 via-purple-600 to-rose-700 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.7)] group-hover:border-white'
                    }`}>
                      <span className="text-xs mb-0.5">👑</span>
                      <span className="font-display font-black tracking-wider truncate max-w-[85px]">
                        {choice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GOLDEN PHOENIX BATTLE CHARIOT */}
            <div
              style={{
                left: `${chariotX}%`,
                bottom: '24px',
                transform: 'translateX(-50%)',
              }}
              className="absolute z-30 transition-transform duration-75 flex flex-col items-center pointer-events-none"
            >
              {/* Pilot Tag */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-rose-400/60 px-2 py-0.5 rounded-full text-[9px] font-black text-rose-300 shadow flex items-center gap-1 whitespace-nowrap">
                <span>⚔️</span>
                <span>{activeExplorer.name} (Phoenix Chariot)</span>
              </div>

              {/* Explorer Avatar in Chariot */}
              <div className="relative flex flex-col items-center">
                <AvatarRenderer customization={activeExplorer.customization} size={48} />
                
                {/* Armored Golden Phoenix Chariot with Sun Scepter */}
                <div className="w-18 h-7 -mt-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-2xl border-2 border-white shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center justify-between px-2 text-slate-950">
                  <div className="text-xs">🛞</div>
                  <div className="text-[10px] font-black flex items-center gap-0.5">
                    <span>⚡</span>
                    <span>CANNON</span>
                  </div>
                  <div className="text-xs">🛞</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RESPONSIVE ON-SCREEN CONTROLS TAILORED TO MECHANIC       */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          {/* Virtual Directional Controls */}
          {landId === 'sound-shallows' ? (
            /* 4-Way Swimming D-Pad */
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-2xl border border-cyan-500/40">
              <div />
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                className="w-9 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 active:bg-cyan-400 active:text-slate-950"
                title="Swim Up"
              >
                <ArrowUp className="w-4 h-4 stroke-[3]" />
              </button>
              <div />
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                className="w-9 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 active:bg-cyan-400 active:text-slate-950"
                title="Swim Left"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                className="w-9 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 active:bg-cyan-400 active:text-slate-950"
                title="Dive Down"
              >
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                className="w-9 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 active:bg-cyan-400 active:text-slate-950"
                title="Swim Right"
              >
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Left/Right Horizontal Steer Controls */
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                className={`w-11 h-10 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                  activeDpad.left 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95' 
                    : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                }`}
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                className={`w-11 h-10 rounded-xl flex items-center justify-center border font-bold transition-all cursor-pointer ${
                  activeDpad.right 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95' 
                    : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                }`}
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* DEDICATED REALM ACTION BUTTON */}
          <button
            onClick={() => triggerRealmAction()}
            onTouchStart={() => triggerRealmAction()}
            className={`h-11 sm:h-12 px-6 rounded-2xl border-2 flex items-center gap-2.5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${realmInfo.btnBg} hover:scale-105 active:scale-95`}
          >
            <ChevronsUp className="w-5 h-5 stroke-[3]" />
            <span>{realmInfo.btnLabel} {realmInfo.btnEmoji}</span>
          </button>

          {/* Keyboard Hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-amber-300">
              SPACE
            </span>
            <span>or click targets</span>
          </div>
        </div>

        {/* ANSWER FEEDBACK & NEXT BUTTON */}
        {isAnswered && (
          <div className={`p-3 rounded-2xl border transition-all text-center space-y-2 animate-fade-in ${
            isCorrect
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-inner'
          }`}>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {isCorrect ? '⭐ Correct! Phonics Mastered!' : '❌ Not Quite! Listen closely to the sound!'}
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {isCorrect
                ? currentQuestion.explanation
                : 'No hints allowed in Phonixia — tap Try Again and listen closely to find the match!'}
            </p>

            <div className="flex gap-2 justify-center pt-1">
              {!isCorrect && (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    onTryAgain();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-rose-400/40"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              )}

              {isCorrect && !roundCompleted && (
                <button
                  onClick={onFinishRound}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Finish Round</span>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>

            {roundCompleted && (
              <div className="pt-3 animate-fade-in space-y-2.5 border-t border-slate-800">
                <div className="text-amber-400 font-black text-sm flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>🎉 Challenge Passed! Next Challenge Unlocked!</span>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Return to Map
                  </button>
                  {activeGameIndex < 50 && onNextLevel && (
                    <button
                      onClick={() => {
                        sounds.stopSpeech();
                        onNextLevel();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Next Challenge</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

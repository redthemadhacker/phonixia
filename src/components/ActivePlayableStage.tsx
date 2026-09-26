import React, { useState, useEffect, useCallback } from 'react';
import { LandId, ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { HallOfFameCelebration } from './HallOfFameCelebration';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Star, Volume2, 
  CheckCircle2, RotateCcw, ChevronsUp, Flame, ShieldAlert, Sparkles, Trophy
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
  const isWorld5 = landId === 'lexicon-empire';
  const isFinalBoss = isWorld5 && activeGameIndex >= 5;

  // Castle Guardian Info for Levels 1 to 4
  const guardianProfile = {
    1: { title: "Gargoyle Sentry", icon: "🗿", deathCue: "Defeated Shadow King's gargoyle gatekeeper!" },
    2: { title: "Skull-Turtle Knight", icon: "🐢", deathCue: "Defeated Shadow King's skull-turtle knight!" },
    3: { title: "Obsidian Golem", icon: "🪨", deathCue: "Defeated Shadow King's obsidian golem!" },
    4: { title: "Sorcerer General", icon: "🧙‍♂️", deathCue: "Defeated Shadow King's second most powerful minion!" }
  }[activeGameIndex as 1 | 2 | 3 | 4] || { title: "Castle Minion", icon: "👾", deathCue: "Castle minion defeated!" };

  // Track Multi-Hit Boss Battle Health State
  // Takes 5 clean hits to deplete 100% life-force (20% per hit)
  const [bossHp, setBossHp] = useState<number>(() => (isFinalBoss ? (bossBarrierHp || 100) : 100));
  const [showDeathCeremony, setShowDeathCeremony] = useState(false);
  const [showCoronationAisle, setShowCoronationAisle] = useState(false);

  // Swimming animation clock
  const [swimCycle, setSwimCycle] = useState(0);

  // Realm 1: Swimming
  const [swimPos, setSwimPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [swimFacing, setSwimFacing] = useState<'left' | 'right'>('right');

  // Realm 2: Crane Hoist
  const [craneTrolleyX, setCraneTrolleyX] = useState<number>(50);
  const [hoistHookY, setHoistHookY] = useState<number>(20);
  const [isHoisting, setIsHoisting] = useState(false);

  // Realm 3: Raptor Ride
  const [riderX, setRiderX] = useState<number>(30);
  const [riderFacing, setRiderFacing] = useState<'left' | 'right'>('right');

  // Realm 4: Snowboard
  const [snowboardX, setSnowboardX] = useState<number>(40);
  const [snowboardFacing, setSnowboardFacing] = useState<'left' | 'right'>('right');

  // Realm 5: Chariot
  const [chariotX, setChariotX] = useState<number>(50);
  const [laserBeamTarget, setLaserBeamTarget] = useState<{ x: number; y: number; choice: string } | null>(null);

  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  // Continuous swimming animation loop
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setSwimCycle((c) => c + 0.12);
      frame = requestAnimationFrame(animate);
    };
    if (landId === 'sound-shallows') {
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [landId]);

  // Movement loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
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
          if (activeDpad.up) newY = Math.max(18, prev.y - speed * 0.9);
          if (activeDpad.down) newY = Math.min(82, prev.y + speed * 0.9);
          return { x: newX, y: newY };
        });
      }

      if (landId === 'builders-guild') {
        const speed = 1.3;
        if (activeDpad.left) setCraneTrolleyX((p) => Math.max(12, p - speed));
        if (activeDpad.right) setCraneTrolleyX((p) => Math.min(88, p + speed));
      }

      if (landId === 'tricky-trails') {
        const speed = 1.4;
        if (activeDpad.left) {
          setRiderX((p) => Math.max(12, p - speed));
          setRiderFacing('left');
        }
        if (activeDpad.right) {
          setRiderX((p) => Math.min(88, p + speed));
          setRiderFacing('right');
        }
      }

      if (landId === 'whispering-peaks') {
        const speed = 1.4;
        if (activeDpad.left) {
          setSnowboardX((p) => Math.max(12, p - speed));
          setSnowboardFacing('left');
        }
        if (activeDpad.right) {
          setSnowboardX((p) => Math.min(88, p + speed));
          setSnowboardFacing('right');
        }
      }

      if (landId === 'lexicon-empire') {
        const speed = 1.3;
        if (activeDpad.left) setChariotX((p) => Math.max(12, p - speed));
        if (activeDpad.right) setChariotX((p) => Math.min(88, p + speed));
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [landId, activeDpad]);

  // Handle Multi-Hit Boss Battle Damage Calculation
  useEffect(() => {
    if (isAnswered && isCorrect && isWorld5) {
      if (isFinalBoss) {
        // Deal 20% damage on correct hit
        setBossHp((prev) => {
          const nextHp = Math.max(0, prev - 20);
          if (nextHp <= 0) {
            // Shadow King vanquished completely
            setShowDeathCeremony(true);
            sounds.playFanfare();
            sounds.speak('THE SHADOW KING HAS FALLEN! The Golden Phonix is rescued!');
            setTimeout(() => {
              setShowCoronationAisle(true);
            }, 3000);
          } else {
            sounds.playSuccess();
            sounds.speak(`Direct hit! Shadow King life force down to ${nextHp} percent! Keep striking!`);
          }
          return nextHp;
        });
      } else {
        // Minion Death Ceremony
        setShowDeathCeremony(true);
        sounds.playFanfare();
        sounds.speak(guardianProfile.deathCue);
      }
    }
  }, [isAnswered, isCorrect, isWorld5, isFinalBoss, guardianProfile.deathCue]);

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

  const triggerSwimStroke = useCallback((choiceOverride?: string) => {
    if (isAnswered || !currentQuestion) return;
    sounds.playSplash();

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(swimPos.x);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setSwimPos({ x: targetX, y: 35 });
    sounds.playCollect();
    onSelectChoice(targetChoice);
  }, [isAnswered, currentQuestion, getClosestChoiceIndex, swimPos.x, onSelectChoice]);

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
    setHoistHookY(72);
    sounds.playHammer();

    setTimeout(() => {
      setHoistHookY(26);
      sounds.playHammer();
      sounds.playCollect();
      setIsHoisting(false);
      onSelectChoice(targetChoice);
    }, 450);
  }, [isAnswered, isHoisting, currentQuestion, getClosestChoiceIndex, craneTrolleyX, onSelectChoice]);

  const triggerVineLeap = useCallback((choiceOverride?: string) => {
    if (isAnswered || !currentQuestion) return;
    sounds.playWhoosh();

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(riderX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setRiderX(targetX);
    sounds.playCollect();
    onSelectChoice(targetChoice);
  }, [isAnswered, currentQuestion, getClosestChoiceIndex, riderX, onSelectChoice]);

  const triggerCloudBounce = useCallback((choiceOverride?: string) => {
    if (isAnswered || !currentQuestion) return;
    sounds.playWhoosh();

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(snowboardX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setSnowboardX(targetX);
    sounds.playJump();
    sounds.playCollect();
    onSelectChoice(targetChoice);
  }, [isAnswered, currentQuestion, getClosestChoiceIndex, snowboardX, onSelectChoice]);

  const triggerChariotLaser = useCallback((choiceOverride?: string) => {
    if (isAnswered || !currentQuestion) return;

    const count = currentQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? currentQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(chariotX);

    const targetChoice = choiceOverride || currentQuestion.choices[targetIdx];
    const targetX = 15 + targetIdx * (70 / Math.max(count - 1, 1));

    setChariotX(targetX);
    setLaserBeamTarget({ x: targetX, y: 32, choice: targetChoice });
    sounds.playLaser();

    setTimeout(() => {
      setLaserBeamTarget(null);
      onSelectChoice(targetChoice);
    }, 400);
  }, [isAnswered, currentQuestion, getClosestChoiceIndex, chariotX, onSelectChoice]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') setActiveDpad((prev) => ({ ...prev, left: true }));
      if (k === 'arrowright' || k === 'd') setActiveDpad((prev) => ({ ...prev, right: true }));
      if (k === 'arrowup' || k === 'w') setActiveDpad((prev) => ({ ...prev, up: true }));
      if (k === 'arrowdown' || k === 's') setActiveDpad((prev) => ({ ...prev, down: true }));
      if (k === ' ' || k === 'enter') {
        e.preventDefault();
        triggerRealmAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') setActiveDpad((prev) => ({ ...prev, left: false }));
      if (k === 'arrowright' || k === 'd') setActiveDpad((prev) => ({ ...prev, right: false }));
      if (k === 'arrowup' || k === 'w') setActiveDpad((prev) => ({ ...prev, up: false }));
      if (k === 'arrowdown' || k === 's') setActiveDpad((prev) => ({ ...prev, down: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerRealmAction]);

  if (showCoronationAisle) {
    return <HallOfFameCelebration onDismiss={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border-3 border-amber-400 rounded-3xl p-3 sm:p-5 text-center space-y-2.5 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-scale-up flex flex-col max-h-[calc(100dvh-16px)] overflow-y-auto">
        
        {/* Top Header Bar without clipping */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-wide">
              {isFinalBoss ? 'Shadow King' : `Level #${activeGameIndex}`}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold">
              {isWorld5 ? (isFinalBoss ? 'Throne Fortress' : guardianProfile.title) : 'Course Stage'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="text-sm">
                  {i < realmLives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>

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

        {/* Phonics Instruction & Pure Isolated Speech Trigger */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-200 font-bold truncate">
            {currentQuestion.instruction}
          </p>

          <div className="inline-flex items-center gap-2.5 bg-slate-950/80 border-2 border-amber-400 px-4 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-display tracking-widest">
              {currentQuestion.targetSound}
            </span>
            <button
              type="button"
              onClick={() => sounds.speakPhonicsSlow(currentQuestion.soundCue || currentQuestion.targetSound)}
              className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* World 5 Life Force Gauge */}
        {isWorld5 && (
          <div className="bg-slate-950/90 border border-rose-500/60 p-2 rounded-xl flex items-center justify-between gap-3 text-xs">
            <span className="text-[10px] font-black uppercase text-rose-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{isFinalBoss ? "Shadow King's Barrier:" : `${guardianProfile.title}'s Shield:`}</span>
            </span>
            <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-rose-500/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${isFinalBoss ? bossHp : 100}%` }}
              />
            </div>
            <span className="font-mono text-amber-300 font-bold text-[10px]">{isFinalBoss ? `${bossHp}%` : '100%'}</span>
          </div>
        )}

        {/* ARENA STAGES */}
        {/* 1. SOUND SHALLOWS */}
        {landId === 'sound-shallows' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] bg-gradient-to-b from-cyan-900 via-teal-950 to-blue-950 rounded-2xl border-2 border-cyan-400/60 overflow-hidden select-none">
            <div className="absolute inset-0 flex items-center justify-around px-4 sm:px-12 pointer-events-none z-20">
              {currentQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerSwimStroke(choice)}
                  style={{
                    left: `${15 + idx * (70 / Math.max(currentQuestion.choices.length - 1, 1))}%`,
                    top: `${24 + (idx % 2 === 0 ? 0 : 16)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center hover:scale-110 active:scale-95"
                >
                  <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-500 text-slate-950 border-2 border-cyan-200 font-black text-base shadow-xl">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            {/* Character natively performing action without text tags */}
            <div
              style={{
                left: `${swimPos.x}%`,
                top: `${swimPos.y}%`,
                transform: `translate(-50%, -50%) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
              }}
              className="absolute z-30 pointer-events-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={54} isSwimming={true} swimCycle={swimCycle} />
            </div>
          </div>
        )}

        {/* 2. BUILDERS GUILD */}
        {landId === 'builders-guild' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 rounded-2xl border-2 border-amber-500/60 overflow-visible select-none pb-2">
            <div
              style={{ left: `${craneTrolleyX}%`, top: '16px', transform: 'translateX(-50%)' }}
              className="absolute z-30 flex flex-col items-center pointer-events-none"
            >
              <div style={{ height: `${(hoistHookY - 10) * 2.8}px` }} className="w-1 bg-yellow-400 shadow" />
              <div className="w-8 h-5 rounded-b bg-stone-950 border border-amber-400 flex items-center justify-center text-xs">🪝</div>
            </div>

            <div className="absolute bottom-4 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerCraneHoist(choice)}
                  style={{ left: `${15 + idx * (70 / Math.max(currentQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:-translate-y-2 active:scale-95"
                >
                  <div className="px-4 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-2 border-amber-200 font-black text-lg shadow-xl">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ left: `${craneTrolleyX}%`, bottom: '48px', transform: 'translateX(-50%)' }} className="absolute z-30 pointer-events-none">
              <AvatarRenderer customization={activeExplorer.customization} size={48} />
            </div>
          </div>
        )}

        {/* 3. TRICKY TRAILS */}
        {landId === 'tricky-trails' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] bg-gradient-to-b from-emerald-950 via-slate-950 to-stone-950 rounded-2xl border-2 border-emerald-400/60 overflow-hidden select-none">
            <div className="absolute top-12 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerVineLeap(choice)}
                  style={{ left: `${15 + idx * (70 / Math.max(currentQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95"
                >
                  <div className="w-1 h-8 bg-emerald-500 mx-auto" />
                  <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-emerald-400 to-teal-500 text-slate-950 border-2 border-emerald-200 font-black text-base shadow-xl">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                left: `${riderX}%`,
                bottom: '34px',
                transform: `translateX(-50%) ${riderFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
              }}
              className="absolute z-30 pointer-events-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={48} />
            </div>
          </div>
        )}

        {/* 4. WHISPERING PEAKS: WITH RESTORED SNOWBOARD */}
        {landId === 'whispering-peaks' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] bg-gradient-to-b from-indigo-950 via-slate-900 to-cyan-950 rounded-2xl border-2 border-indigo-400/60 overflow-hidden select-none">
            <div className="absolute top-8 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerCloudBounce(choice)}
                  style={{ left: `${15 + idx * (70 / Math.max(currentQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95"
                >
                  <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-sky-300 via-indigo-400 to-cyan-400 text-slate-950 border-2 border-cyan-100 font-black text-base shadow-xl">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            {/* Restored Glowing Snowboard */}
            <div
              style={{
                left: `${snowboardX}%`,
                bottom: '34px',
                transform: `translateX(-50%) ${snowboardFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
              }}
              className="absolute z-30 flex flex-col items-center pointer-events-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={48} />
              <div className="w-16 h-3.5 -mt-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 border-2 border-white shadow-[0_0_18px_rgba(6,182,212,1)]" />
            </div>
          </div>
        )}

        {/* 5. LEXICON EMPIRE: WITH DEATH CEREMONY FOR MINIONS & SHADOW KING */}
        {landId === 'lexicon-empire' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[350px] bg-gradient-to-b from-purple-950 via-slate-950 to-rose-950 rounded-2xl border-2 border-rose-500/60 overflow-hidden select-none">
            
            {/* Castle Minion / Shadow King Entity */}
            <div 
              className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-700 ${
                showDeathCeremony
                  ? 'scale-50 rotate-90 opacity-0 translate-y-16 blur-sm'
                  : 'scale-100'
              }`}
            >
              <div className="text-4xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse">
                {isFinalBoss ? '👹' : guardianProfile.icon}
              </div>
              <span className="text-[9px] font-black uppercase text-rose-300 bg-black/80 px-2 py-0.5 rounded border border-rose-500/50 mt-1">
                {isFinalBoss ? 'Shadow King' : guardianProfile.title}
              </span>
            </div>

            {/* Dramatic K.O. / Defeat Ceremony Banner */}
            {showDeathCeremony && (
              <div className="absolute top-1/4 inset-x-4 z-40 bg-black/90 border-4 border-amber-400 p-4 rounded-3xl animate-bounce shadow-2xl flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-500 font-display">
                  💥 DEFEATED! 💥
                </span>
                <span className="text-xs font-bold text-amber-200 mt-1">
                  {isFinalBoss ? 'The Shadow King has fallen! Golden Phonix is rescued!' : guardianProfile.deathCue}
                </span>
              </div>
            )}

            {laserBeamTarget && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
                <line x1={`${chariotX}%`} y1="75%" x2={`${laserBeamTarget.x}%`} y2={`${laserBeamTarget.y}%`} stroke="#f59e0b" strokeWidth="5" className="animate-pulse" />
              </svg>
            )}

            <div className="absolute top-18 inset-x-0 flex items-center justify-around px-4 sm:px-12 z-20 pointer-events-none">
              {currentQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerChariotLaser(choice)}
                  style={{ left: `${15 + idx * (70 / Math.max(currentQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95"
                >
                  <div className="px-4 py-3 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-700 text-white border-2 border-rose-300 font-black text-base shadow-2xl">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ left: `${chariotX}%`, bottom: '24px', transform: 'translateX(-50%)' }} className="absolute z-30 pointer-events-none">
              <AvatarRenderer customization={activeExplorer.customization} size={48} />
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onMouseDown={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
              onMouseUp={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
              onTouchStart={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
              onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
              className="w-11 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onMouseDown={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
              onMouseUp={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
              onTouchStart={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
              onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
              className="w-11 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <button
            onClick={() => triggerRealmAction()}
            className="h-11 sm:h-12 px-6 rounded-2xl border-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronsUp className="w-5 h-5 stroke-[3]" />
            <span>ACTIVATE</span>
          </button>
        </div>

        {/* LEVEL COMPLETION & PATH ADVANCEMENT */}
        {isAnswered && (
          <div className={`p-3 rounded-2xl border text-center space-y-2 animate-fade-in ${
            isCorrect ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' : 'bg-rose-950/80 border-rose-400 text-rose-200'
          }`}>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {isCorrect ? '⭐ Correct! Phonics Mastered!' : '❌ Not Quite! Listen closely to the sound!'}
            </div>

            <div className="flex gap-2 justify-center pt-1">
              {!isCorrect ? (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    onTryAgain();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-100 font-bold text-xs flex items-center gap-2 cursor-pointer border border-rose-400/40"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Exit to Map
                  </button>

                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      if (onNextLevel) onNextLevel();
                      else onFinishRound();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <span>Travel to Next Level ➔</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
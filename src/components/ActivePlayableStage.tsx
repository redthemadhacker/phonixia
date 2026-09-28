import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LandId, ExplorerProfile } from '../types/character';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { PhonicsLetter } from './PhonicsLetter';
import { PhonicsWordDisplay } from './PhonicsWordDisplay';
import { sounds } from '../utils/audio';
import { HallOfFameCelebration } from './HallOfFameCelebration';
import { getComprehensiveStageChallenge } from '../data/comprehensiveCurriculum';
import { ALL_50_MINIGAMES, MinigameDefinition } from '../data/minigamesCurriculum';
import { CutePicturePrompt } from './CutePicturePrompt';
import { getPictureClue } from '../utils/phonicsPictures';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Star, Volume2, 
  RotateCcw, ChevronsUp, Flame, Undo2, RefreshCw, Gamepad2, HeartCrack
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
  spokenPrompt?: string;
  builderLetters?: string[];
  builderTarget?: string;
  whisperingParts?: {
    targetWord: string;
    part1: string;
    part2: string;
    choices1: string[];
    choices2: string[];
  };
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
  onOpenMinigamePractice?: (minigame: MinigameDefinition) => void;
}

export const ActivePlayableStage: React.FC<ActivePlayableStageProps> = ({
  landId,
  activeExplorer,
  companionGuide: _companionGuide,
  currentQuestion,
  activeGameIndex,
  isAnswered,
  isCorrect,
  selectedAnswer: _selectedAnswer,
  realmLives,
  earnedStars,
  bossBarrierHp: _bossBarrierHp,
  roundCompleted: _roundCompleted = false,
  onSelectChoice,
  onFinishRound,
  onTryAgain,
  onNextLevel,
  onClose,
  onOpenMinigamePractice
}) => {
  const { recordSkillMiss } = useGame();

  const isBossStage = landId === 'lexicon-empire';
  const isFinalBoss = landId === 'lexicon-empire' && activeGameIndex >= 50;

  const bossDef = useMemo(() => {
    if (activeGameIndex >= 50) {
      return {
        bossName: 'The Shadow King Malakor',
        icon: '👹',
        defeatedSubtext: 'The Golden Phonix is rescued! Phonixia is saved!',
        speechDefeat: 'The Shadow King has fallen! The Golden Phonix is rescued!'
      };
    }
    if (activeGameIndex <= 10) {
      return {
        bossName: 'Gargoyle Sentry',
        icon: '🗿',
        defeatedSubtext: 'Almost finished training to face the Shadow King! Fantastic job!',
        speechDefeat: 'Gargoyle Sentry defeated! Almost finished training to face the Shadow King!'
      };
    }
    if (activeGameIndex <= 20) {
      return {
        bossName: 'Skull-Turtle Knight',
        icon: '🐢',
        defeatedSubtext: 'Almost finished training to face the Shadow King! Fantastic job!',
        speechDefeat: 'Skull-Turtle Knight defeated! Almost finished training to face the Shadow King!'
      };
    }
    if (activeGameIndex <= 30) {
      return {
        bossName: 'Obsidian Golem',
        icon: '🪨',
        defeatedSubtext: 'Almost finished training to face the Shadow King! Fantastic job!',
        speechDefeat: 'Obsidian Golem defeated! Almost finished training to face the Shadow King!'
      };
    }
    return {
      bossName: 'Sorcerer General',
      icon: '🧙‍♂️',
      defeatedSubtext: 'Almost finished training to face the Shadow King! Fantastic job!',
      speechDefeat: 'Sorcerer General defeated! Almost finished training to face the Shadow King!'
    };
  }, [activeGameIndex]);

  const [bossHp, setBossHp] = useState<number>(100);
  const [showDeathCeremony, setShowDeathCeremony] = useState(false);
  const [showCoronationAisle, setShowCoronationAisle] = useState(false);
  const [bossSubCount, setBossSubCount] = useState(0);
  const [bossDamageFlash, setBossDamageFlash] = useState(false);

  const [activeCombatQ, setActiveCombatQ] = useState<GameQuestion>(currentQuestion);
  const [currentQuestionMissCount, setCurrentQuestionMissCount] = useState<number>(0);

  useEffect(() => {
    setActiveCombatQ(currentQuestion);
    setBossHp(100);
    setShowDeathCeremony(false);
    setBossSubCount(0);
    setCurrentQuestionMissCount(0);
  }, [currentQuestion, activeGameIndex]);

  const displayedQuestion = isBossStage ? activeCombatQ : currentQuestion;

  const recommendedMinigame = useMemo(() => {
    const rawTarget = (displayedQuestion.targetSound || displayedQuestion.correct || '').toUpperCase();
    const instruction = (displayedQuestion.instruction || '').toUpperCase();

    const matched = ALL_50_MINIGAMES.find((m) => {
      const cat = m.skillCategory.toUpperCase();
      const sound = m.targetSoundOrWord.toUpperCase();
      return (
        cat.includes(rawTarget) ||
        sound.includes(rawTarget) ||
        rawTarget.includes(cat) ||
        instruction.includes(cat)
      );
    });

    if (matched) return matched;

    if (landId === 'sound-shallows') return ALL_50_MINIGAMES[0];
    if (landId === 'builders-guild') return ALL_50_MINIGAMES[6];
    if (landId === 'tricky-trails') return ALL_50_MINIGAMES[15];
    if (landId === 'whispering-peaks') return ALL_50_MINIGAMES[18];
    return ALL_50_MINIGAMES[25];
  }, [displayedQuestion, landId]);

  // Swimming animation clock & position (Sound Shallows)
  const [swimPos, setSwimPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [swimFacing, setSwimFacing] = useState<'left' | 'right'>('right');
  const [swimPitch, setSwimPitch] = useState<number>(0);
  const [isDiving, setIsDiving] = useState(false);

  // Crane Trolley & Stacking (Builders Guild)
  const [craneTrolleyX, setCraneTrolleyX] = useState<number>(50);
  const [hoistHookY, setHoistHookY] = useState<number>(20);
  const [isHoisting, setIsHoisting] = useState(false);
  const [builderStack, setBuilderStack] = useState<string[]>([]);
  const [builderWrongNotice, setBuilderWrongNotice] = useState<string | null>(null);

  // Tricky Trails: Vine Swing
  const [vineAngle, setVineAngle] = useState(0);
  const [vineX, setVineX] = useState<number>(50);
  const [vinePlayerState, setVinePlayerState] = useState<'ground' | 'jumping' | 'swinging' | 'landing'>('ground');

  // Whispering Peaks: Alpine Snowboard Downhill Run (Strict Inline Row)
  const [snowboardX, setSnowboardX] = useState<number>(50);
  const [snowboardCarve, setSnowboardCarve] = useState<number>(0);
  const [isSnowboardSliding, setIsSnowboardSliding] = useState<boolean>(false);
  const [snowboardSpray, setSnowboardSpray] = useState<boolean>(false);
  const [activeGateIdx, setActiveGateIdx] = useState<number | null>(null);
  const [whisperingStep, setWhisperingStep] = useState<1 | 2>(1);
  const [whisperingPart1, setWhisperingPart1] = useState<string | null>(null);
  const [whisperingNotice, setWhisperingNotice] = useState<string | null>(null);

  useEffect(() => {
    setWhisperingStep(1);
    setWhisperingPart1(null);
    setWhisperingNotice(null);
  }, [displayedQuestion, activeGameIndex]);

  const activeWhisperingChoices = useMemo(() => {
    const raw = displayedQuestion.choices || [];
    const correct = (displayedQuestion.correct || '').trim();
    if (!correct) return raw;
    const hasCorrect = raw.some((c) => c.trim().toLowerCase() === correct.toLowerCase());
    if (!hasCorrect) {
      return [...raw.slice(0, 3), correct].sort(() => 0.5 - Math.random());
    }
    return raw;
  }, [displayedQuestion]);

  const sanitizedTargetSound = useMemo(() => {
    if (!displayedQuestion) return '';
    const rawTarget = displayedQuestion.targetSound || '';
    const correct = (displayedQuestion.correct || '').toString().trim().toUpperCase();
    if (correct.length > 1 && rawTarget.toUpperCase().includes(correct)) {
      return rawTarget.replace(new RegExp(correct, 'gi'), '❓');
    }
    return rawTarget;
  }, [displayedQuestion]);

  // Lexicon Empire: Chariot & Laser
  const [chariotX, setChariotX] = useState<number>(50);
  const [laserBeamTarget, setLaserBeamTarget] = useState<{ x: number; y: number; choice: string } | null>(null);

  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  // 8 Letter Choices for Builders Guild (Guaranteed containing every letter of target word)
  const builderChoices = useMemo(() => {
    if (landId !== 'builders-guild') return displayedQuestion.choices;
    if (displayedQuestion.builderLetters && displayedQuestion.builderLetters.length >= 8) {
      return displayedQuestion.builderLetters;
    }
    const targetWord = (displayedQuestion.builderTarget || displayedQuestion.correct || 'BED').toUpperCase();
    const targetLetters = targetWord.split('');
    const pool = Array.from(new Set([...targetLetters]));
    const alphabet = ['B', 'E', 'D', 'M', 'T', 'S', 'P', 'A', 'C', 'N', 'L', 'R', 'G', 'F', 'O', 'U'];
    for (const char of alphabet) {
      if (pool.length >= 8) break;
      if (!pool.includes(char)) pool.push(char);
    }
    return pool.slice(0, 8).sort(() => 0.5 - Math.random());
  }, [landId, displayedQuestion]);

  const targetBuilderWord = useMemo(() => {
    return (displayedQuestion.builderTarget || displayedQuestion.correct || '').toUpperCase();
  }, [displayedQuestion]);

  useEffect(() => {
    setBuilderStack([]);
    setBuilderWrongNotice(null);
  }, [displayedQuestion, activeGameIndex]);

  useEffect(() => {
    sounds.stopSpeech();
    const promptText = displayedQuestion.instruction || displayedQuestion.spokenPrompt || 'Listen closely!';
    const timer = setTimeout(() => {
      sounds.speak(promptText);
    }, 350);
    return () => clearTimeout(timer);
  }, [displayedQuestion, activeGameIndex]);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const swingLoop = () => {
      t += 0.035;
      if (vinePlayerState === 'ground') {
        setVineAngle(Math.sin(t) * 14);
      }
      frame = requestAnimationFrame(swingLoop);
    };
    if (landId === 'tricky-trails') {
      frame = requestAnimationFrame(swingLoop);
    }
    return () => cancelAnimationFrame(frame);
  }, [landId, vinePlayerState]);

  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (landId === 'sound-shallows') {
        const speed = 0.75;
        setSwimPos((prev) => {
          let newX = prev.x;
          let newY = prev.y;
          let pitch = 0;

          if (activeDpad.left) {
            newX = Math.max(10, prev.x - speed);
            setSwimFacing('left');
          }
          if (activeDpad.right) {
            newX = Math.min(90, prev.x + speed);
            setSwimFacing('right');
          }
          if (activeDpad.up) {
            newY = Math.max(18, prev.y - speed);
            pitch = -18;
          }
          if (activeDpad.down) {
            newY = Math.min(84, prev.y + speed);
            pitch = 20;
          }
          setSwimPitch(pitch);
          return { x: newX, y: newY };
        });
      }

      if (landId === 'builders-guild') {
        const speed = 0.8;
        if (activeDpad.left) setCraneTrolleyX((p) => Math.max(10, p - speed));
        if (activeDpad.right) setCraneTrolleyX((p) => Math.min(90, p + speed));
      }

      if (landId === 'tricky-trails' && vinePlayerState === 'ground') {
        const speed = 0.8;
        if (activeDpad.left) setVineX((p) => Math.max(16, p - speed));
        if (activeDpad.right) setVineX((p) => Math.min(84, p + speed));
      }

      if (landId === 'whispering-peaks' && !isSnowboardSliding) {
        const speed = 0.8;
        if (activeDpad.left) {
          setSnowboardX((p) => Math.max(12, p - speed));
          setSnowboardCarve(-14);
          setSnowboardSpray(true);
        } else if (activeDpad.right) {
          setSnowboardX((p) => Math.min(88, p + speed));
          setSnowboardCarve(14);
          setSnowboardSpray(true);
        } else {
          setSnowboardCarve(0);
          setSnowboardSpray(false);
        }
      }

      if (landId === 'lexicon-empire') {
        const speed = 0.85;
        if (activeDpad.left) setChariotX((p) => Math.max(14, p - speed));
        if (activeDpad.right) setChariotX((p) => Math.min(86, p + speed));
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [landId, activeDpad, vinePlayerState, isSnowboardSliding]);

  const getClosestChoiceIndex = useCallback((charX: number, choices: string[]) => {
    let closestIdx = 0;
    let minDiff = 999;
    choices.forEach((_, idx) => {
      const choiceX = 14 + idx * (72 / Math.max(choices.length - 1, 1));
      const diff = Math.abs(charX - choiceX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  }, []);

  const handleAnswerEvaluation = useCallback((choice: string) => {
    const cleanChoice = choice.trim().toLowerCase();
    const cleanCorrect = (displayedQuestion.correct || '').trim().toLowerCase();

    // Check answer correctness - include flexible matching for Bossy R sister questions
    const isCorrectHit = 
      cleanChoice === cleanCorrect ||
      (cleanCorrect === 'e' && (cleanChoice === 'er' || cleanChoice === 'sister')) ||
      (cleanCorrect === 'er' && (cleanChoice === 'e' || cleanChoice === 'sister')) ||
      (cleanCorrect === 'sister' && (cleanChoice === 'e' || cleanChoice === 'er'));

    if (!isCorrectHit) {
      const nextMiss = currentQuestionMissCount + 1;
      setCurrentQuestionMissCount(nextMiss);
      if (recordSkillMiss) {
        recordSkillMiss(displayedQuestion.targetSound || displayedQuestion.correct || 'General Phonics');
      }

      if (realmLives <= 1) {
        // Mario 8-bit game over melody ONLY - no voice talking over death!
        sounds.playGameOver();
      } else {
        sounds.playDamage();
      }

      if (nextMiss >= 2) {
        sounds.speak(`Stuck on this sound? Try practicing ${recommendedMinigame.name} in the arcade!`);
      }
    }

    if (!isBossStage) {
      onSelectChoice(choice);
      return;
    }

    if (isCorrectHit) {
      setBossDamageFlash(true);
      sounds.playDamage();
      setTimeout(() => setBossDamageFlash(false), 300);

      const damageAmount = 25;
      const nextHp = Math.max(0, bossHp - damageAmount);
      setBossHp(nextHp);

      if (nextHp > 0) {
        // Snappy sound effect - no talking announcements of depleted life force!
        sounds.playSuccess();
        sounds.playLaser();
        const nextCount = bossSubCount + 1;
        setBossSubCount(nextCount);
        const nextChallenge = getComprehensiveStageChallenge(landId, (activeGameIndex * 11 + nextCount) % 50 || 1);
        setActiveCombatQ(nextChallenge);
      } else {
        setShowDeathCeremony(true);
        sounds.playFanfare();

        if (isFinalBoss) {
          sounds.speak('THE SHADOW KING HAS FALLEN! The Golden Phonix is rescued!');
          setTimeout(() => {
            setShowCoronationAisle(true);
          }, 3000);
        } else {
          sounds.speak(bossDef.speechDefeat);
        }
        onSelectChoice(choice);
      }
    } else {
      setBossHp((prev) => Math.min(100, prev + 15));
      setBossDamageFlash(true);
      setTimeout(() => setBossDamageFlash(false), 300);
      // Snappy sound effect - no talking announcements of restored life force!
      sounds.playDamage();
      onSelectChoice(choice);
    }
  }, [displayedQuestion, isBossStage, bossHp, bossDef, bossSubCount, landId, activeGameIndex, isFinalBoss, onSelectChoice, currentQuestionMissCount, recordSkillMiss, recommendedMinigame, realmLives]);

  // 1. Sound Shallows
  const triggerSwimStroke = useCallback((choiceOverride?: string) => {
    if (isAnswered) return;
    setIsDiving(true);
    sounds.playWhoosh();

    const count = displayedQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? displayedQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(swimPos.x, displayedQuestion.choices);

    const targetChoice = choiceOverride || displayedQuestion.choices[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));
    const targetY = 32 + (targetIdx % 2 === 0 ? 0 : 24);

    setSwimPos({ x: targetX, y: targetY });
    sounds.playCollect();

    setTimeout(() => {
      setIsDiving(false);
      handleAnswerEvaluation(targetChoice);
    }, 300);
  }, [isAnswered, displayedQuestion, getClosestChoiceIndex, swimPos.x, handleAnswerEvaluation]);

  // 2. Builders Guild
  const handleBuilderLetterPick = useCallback((letter: string) => {
    if (isAnswered || isHoisting || !targetBuilderWord) return;
    setBuilderWrongNotice(null);

    const currentLen = builderStack.length;
    const expectedLetter = targetBuilderWord[currentLen];

    setIsHoisting(true);
    setHoistHookY(68);
    sounds.playHammer();

    setTimeout(() => {
      setHoistHookY(22);
      setIsHoisting(false);

      if (letter === expectedLetter) {
        sounds.playCollect();
        const nextStack = [...builderStack, letter];
        setBuilderStack(nextStack);

        if (nextStack.join('') === targetBuilderWord) {
          sounds.playFanfare();
          sounds.speak(`Excellent! You stacked ${targetBuilderWord}!`);
          handleAnswerEvaluation(targetBuilderWord);
        } else {
          sounds.speak(letter);
        }
      } else {
        sounds.playDamage();
        const nextMiss = currentQuestionMissCount + 1;
        setCurrentQuestionMissCount(nextMiss);
        if (recordSkillMiss) {
          recordSkillMiss(targetBuilderWord);
        }
        setBuilderWrongNotice('Oops! That letter is out of order or incorrect. Try again!');
        sounds.speak('Try again! Listen closely to the sound!');
        handleAnswerEvaluation('__WRONG__');
      }
    }, 380);
  }, [isAnswered, isHoisting, targetBuilderWord, builderStack, handleAnswerEvaluation, currentQuestionMissCount, recordSkillMiss]);

  // 3. Tricky Trails
  const triggerVineLeap = useCallback((choiceOverride?: string) => {
    if (isAnswered || vinePlayerState !== 'ground') return;

    const count = displayedQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? displayedQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(vineX, displayedQuestion.choices);

    const targetChoice = choiceOverride || displayedQuestion.choices[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));

    setVinePlayerState('jumping');
    sounds.playJump();

    setTimeout(() => {
      setVinePlayerState('swinging');
      setVineAngle(targetX > vineX ? 28 : -28);
      sounds.playWhoosh();

      setTimeout(() => {
        setVineX(targetX);
        sounds.playCollect();

        setTimeout(() => {
          setVinePlayerState('landing');
          setVineAngle(0);
          sounds.playStep();

          setTimeout(() => {
            setVinePlayerState('ground');
            handleAnswerEvaluation(targetChoice);
          }, 240);
        }, 300);
      }, 300);
    }, 200);
  }, [isAnswered, vinePlayerState, displayedQuestion, getClosestChoiceIndex, vineX, handleAnswerEvaluation]);

  // 4. Whispering Peaks (Downhill Mountain Slalom Slide)
  const triggerSnowboardDownhillSlide = useCallback((choiceOverride?: string) => {
    if (isAnswered || isSnowboardSliding) return;

    const choicesToUse = activeWhisperingChoices;
    const count = choicesToUse.length;
    const targetIdx = choiceOverride 
      ? choicesToUse.indexOf(choiceOverride)
      : getClosestChoiceIndex(snowboardX, choicesToUse);

    const targetChoice = choiceOverride || choicesToUse[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));

    setIsSnowboardSliding(true);
    setActiveGateIdx(targetIdx);
    setSnowboardSpray(true);
    sounds.playJump();
    sounds.playWhoosh();

    const carveAngle = targetX > snowboardX ? 24 : -24;
    setSnowboardCarve(carveAngle);
    setSnowboardX(targetX);

    setTimeout(() => {
      sounds.playCollect();

      setTimeout(() => {
        setSnowboardSpray(false);
        setSnowboardCarve(0);
        setIsSnowboardSliding(false);
        setActiveGateIdx(null);
        handleAnswerEvaluation(targetChoice);
      }, 350);
    }, 350);
  }, [isAnswered, isSnowboardSliding, activeWhisperingChoices, getClosestChoiceIndex, snowboardX, handleAnswerEvaluation]);

  // 5. Lexicon Empire
  const triggerChariotLaser = useCallback((choiceOverride?: string) => {
    if (isAnswered || !displayedQuestion) return;

    const count = displayedQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? displayedQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(chariotX, displayedQuestion.choices);

    const targetChoice = choiceOverride || displayedQuestion.choices[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));

    setChariotX(targetX);
    setLaserBeamTarget({ x: targetX, y: 32, choice: targetChoice });
    sounds.playLaser();

    setTimeout(() => {
      setLaserBeamTarget(null);
      handleAnswerEvaluation(targetChoice);
    }, 380);
  }, [isAnswered, displayedQuestion, getClosestChoiceIndex, chariotX, handleAnswerEvaluation]);

  const triggerRealmAction = useCallback(() => {
    switch (landId) {
      case 'sound-shallows':
        triggerSwimStroke();
        break;
      case 'builders-guild': {
        const closestIdx = getClosestChoiceIndex(craneTrolleyX, builderChoices);
        const letter = builderChoices[closestIdx];
        handleBuilderLetterPick(letter);
        break;
      }
      case 'tricky-trails':
        triggerVineLeap();
        break;
      case 'whispering-peaks':
        triggerSnowboardDownhillSlide();
        break;
      case 'lexicon-empire':
        triggerChariotLaser();
        break;
    }
  }, [landId, triggerSwimStroke, getClosestChoiceIndex, craneTrolleyX, builderChoices, handleBuilderLetterPick, triggerVineLeap, triggerSnowboardDownhillSlide, triggerChariotLaser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
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
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
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

  const isOutOfLives = realmLives <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 sm:border-3 border-amber-400 rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 text-center space-y-2 shadow-[0_0_60px_rgba(0,0,0,0.85)] animate-scale-up flex flex-col max-h-[96dvh] overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-sm font-mono font-black text-amber-300 uppercase tracking-wide truncate max-w-[120px] sm:max-w-none">
              {isBossStage ? `Boss: ${bossDef.bossName}` : `Stage #${activeGameIndex}`}
            </span>
            <span className="text-[9px] sm:text-xs px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold hidden xs:inline">
              {isBossStage ? (isFinalBoss ? 'Throne Citadel' : 'Realm Guardian') : 'Adventure Course'}
            </span>
          </div>

          {/* Boss Life Source Bar */}
          {isBossStage && (
            <div className="flex-1 max-w-[120px] xs:max-w-xs sm:max-w-sm mx-2 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-amber-300 mb-0.5 truncate">
                <span className="truncate">{bossDef.bossName}</span>
                <span>{bossHp}%</span>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-slate-950 rounded-full border border-amber-500/60 overflow-hidden p-0.5">
                <div
                  style={{ width: `${bossHp}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    bossHp > 50
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : bossHp > 25
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 animate-pulse'
                      : 'bg-gradient-to-r from-rose-600 to-red-500 animate-ping'
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-xs sm:text-base transition-transform ${i < realmLives ? 'scale-100' : 'scale-90 opacity-40 grayscale'}`}>
                  {i < realmLives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>

            <div className="flex gap-0.5 sm:gap-1 text-amber-400">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                    i < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Clear Phonics Instruction Header */}
        <div className="space-y-1 px-1 sm:px-2">
          <p className="text-xs sm:text-base md:text-lg text-amber-100 font-black leading-snug break-words">
            {landId === 'builders-guild'
              ? `Pick the letter tiles in order to build: ${targetBuilderWord}!`
              : displayedQuestion.instruction}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 py-0.5">
            {/* Cute Picture Clue Button & Animation for Simpler Levels */}
            <CutePicturePrompt
              targetSound={sanitizedTargetSound}
              word={targetBuilderWord || (displayedQuestion.builderLetters ? displayedQuestion.correct : undefined)}
              instruction={displayedQuestion.instruction}
              soundCue={displayedQuestion.soundCue}
              builderTarget={targetBuilderWord}
              stageNumber={activeGameIndex}
              landId={landId}
              isSimplerLevel={landId === 'sound-shallows' || landId === 'builders-guild' || activeGameIndex <= 25 || activeExplorer.ageTier === 'preschool' || activeExplorer.ageTier === 'kindergarten'}
            />

            <div className="inline-flex items-center gap-2 sm:gap-3 bg-slate-950/90 border-2 border-amber-400 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl shadow-inner">
              {landId === 'sound-shallows' || landId === 'builders-guild' ? (
                <PhonicsWordDisplay text={sanitizedTargetSound} size={32} showSubtitle={false} />
              ) : (
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-amber-300 font-display tracking-widest break-all">
                  {sanitizedTargetSound}
                </span>
              )}
              <button
                type="button"
                title="Hear instruction and sound again"
                onClick={() => {
                  const promptText = landId === 'builders-guild'
                    ? `Pick the letter tiles in order to build: ${targetBuilderWord}!`
                    : (displayedQuestion.instruction || displayedQuestion.spokenPrompt || 'Listen closely!');
                  sounds.speak(promptText);
                }}
                className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400/50 cursor-pointer active:scale-90 transition-transform"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* REPEATED MISS PRACTICE RECOMMENDATION BANNER */}
        {currentQuestionMissCount >= 2 && !isOutOfLives && (
          <div className="mx-1 sm:mx-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-950 via-slate-950 to-indigo-950 border border-amber-400 shadow-xl flex flex-wrap items-center justify-between gap-1.5 animate-bounce-gentle">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xl sm:text-2xl p-1 rounded-lg bg-amber-500/20 border border-amber-400/50">
                {recommendedMinigame.themeIcon}
              </span>
              <div>
                <div className="text-[11px] sm:text-sm font-black text-amber-300 flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Practice in: {recommendedMinigame.name}</span>
                </div>
                <div className="text-[9px] sm:text-xs text-slate-300 truncate">
                  Minigame #{recommendedMinigame.gameNum} · {recommendedMinigame.skillCategory}
                </div>
              </div>
            </div>

            {onOpenMinigamePractice && (
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  onOpenMinigamePractice(recommendedMinigame);
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Practice ➔
              </button>
            )}
          </div>
        )}

        {/* 1. SOUND SHALLOWS */}
        {landId === 'sound-shallows' && (
          <div className="relative w-full h-[230px] xs:h-[270px] sm:h-[340px] bg-gradient-to-b from-sky-900 via-teal-950 to-blue-950 rounded-2xl border-2 border-cyan-400/60 overflow-hidden select-none">
            <div className="absolute inset-0 pointer-events-none z-20">
              {displayedQuestion.choices.map((choice, idx) => {
                const choiceX = 14 + idx * (72 / Math.max(displayedQuestion.choices.length - 1, 1));
                const choiceY = 32 + (idx % 2 === 0 ? 0 : 24);

                return (
                  <div
                    key={idx}
                    onClick={() => triggerSwimStroke(choice)}
                    style={{ left: `${choiceX}%`, top: `${choiceY}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute pointer-events-auto cursor-pointer group hover:scale-110 active:scale-95 transition-transform"
                  >
                    <div className="w-13 h-13 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-cyan-200 via-teal-400 to-blue-600 border-2 sm:border-3 border-white flex flex-col items-center justify-center text-slate-950 font-black text-xs sm:text-base shadow-[0_0_25px_rgba(6,182,212,0.8)] overflow-hidden">
                      {choice.length === 1 ? (
                        <PhonicsLetter letter={choice} size={34} showBadge={false} />
                      ) : (
                        <div className="flex flex-col items-center">
                          <PhonicsWordDisplay text={choice} size={20} />
                          <span className="text-[9px] sm:text-[10px] text-white font-mono font-bold">{choice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                left: `${swimPos.x}%`,
                top: `${swimPos.y}%`,
                transform: `translate(-50%, -50%) rotate(${swimPitch}deg) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                transition: isDiving ? 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s ease-out'
              }}
              className="absolute z-30 pointer-events-none flex flex-col items-center select-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={44} isSwimming={true} />
            </div>
          </div>
        )}

        {/* 2. BUILDERS GUILD */}
        {landId === 'builders-guild' && (
          <div className="relative w-full h-[230px] xs:h-[270px] sm:h-[340px] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 rounded-2xl border-2 border-amber-500/60 overflow-hidden select-none">
            <div className="absolute top-1.5 left-2 z-20 bg-slate-950/90 border border-amber-400 p-2 rounded-xl text-left shadow-xl min-w-[100px] xs:min-w-[120px]">
              <div className="flex items-center justify-between gap-1 text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                <span>Target Word:</span>
                <span className="text-sm filter drop-shadow animate-bounce-gentle">
                  {getPictureClue({ builderTarget: targetBuilderWord }).emoji}
                </span>
              </div>
              <div className="text-base sm:text-xl font-black text-white font-mono tracking-wider flex items-center gap-1.5">
                <span>{targetBuilderWord}</span>
              </div>

              <div className="mt-1 flex flex-col-reverse gap-0.5 border-t border-amber-500/40 pt-1">
                {targetBuilderWord.split('').map((_, i) => {
                  const stacked = builderStack[i];
                  return (
                    <div
                      key={i}
                      className={`h-5 xs:h-6 px-2 rounded border font-mono font-black text-xs flex items-center justify-between transition-all ${
                        stacked
                          ? 'bg-amber-400 text-slate-950 border-white shadow animate-scale-up'
                          : 'bg-slate-900 border-dashed border-amber-500/50 text-slate-500'
                      }`}
                    >
                      <span className="text-[9px]">#{i + 1}</span>
                      <span>{stacked || '_'}</span>
                    </div>
                  );
                })}
              </div>

              {builderStack.length > 0 && (
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => {
                      sounds.playDamage();
                      setBuilderStack((prev) => prev.slice(0, -1));
                      setBuilderWrongNotice(null);
                    }}
                    className="flex-1 py-0.5 rounded bg-slate-800 text-amber-300 text-[9px] font-bold border border-amber-500/40 flex items-center justify-center cursor-pointer"
                  >
                    <Undo2 className="w-2.5 h-2.5 mr-0.5" />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playDamage();
                      setBuilderStack([]);
                      setBuilderWrongNotice(null);
                    }}
                    className="flex-1 py-0.5 rounded bg-slate-800 text-rose-300 text-[9px] font-bold border border-rose-500/40 flex items-center justify-center cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5 mr-0.5" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            {builderWrongNotice && (
              <div className="absolute top-2 right-2 z-40 bg-rose-950/95 border border-rose-400 px-2 py-1 rounded-lg text-rose-200 text-[10px] font-bold shadow-xl animate-shake">
                {builderWrongNotice}
              </div>
            )}

            <div
              style={{ left: `${craneTrolleyX}%`, top: '2px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }}
              className="absolute z-25 flex flex-col items-center pointer-events-none"
            >
              <div className="w-8 h-3 bg-amber-500 rounded-b border border-amber-300 shadow" />
              <div style={{ height: `${hoistHookY * 1.8}px`, transition: 'height 0.25s ease-in-out' }} className="w-0.5 bg-slate-300" />
              <div className="text-base sm:text-xl">🪝</div>
            </div>

            <div className="absolute bottom-1.5 inset-x-1 sm:inset-x-4 flex items-center justify-around z-20 pointer-events-none gap-0.5">
              {builderChoices.map((letter, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBuilderLetterPick(letter)}
                  className="pointer-events-auto cursor-pointer hover:scale-115 active:scale-90 transition-transform shrink min-w-0"
                >
                  <PhonicsLetter letter={letter} size={36} />
                </div>
              ))}
            </div>

            <div style={{ left: `${craneTrolleyX}%`, bottom: '44px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }} className="absolute z-30 pointer-events-none">
              <AvatarRenderer customization={activeExplorer.customization} size={40} />
            </div>
          </div>
        )}

        {/* 3. TRICKY TRAILS */}
        {landId === 'tricky-trails' && (
          <div className="relative w-full h-[230px] xs:h-[270px] sm:h-[340px] bg-gradient-to-b from-emerald-950 via-slate-950 to-stone-950 rounded-2xl border-2 border-emerald-400/60 overflow-hidden select-none">
            <div className="absolute top-4 sm:top-6 inset-x-0 flex items-center justify-around px-2 sm:px-8 z-20 pointer-events-none">
              {displayedQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerVineLeap(choice)}
                  style={{ left: `${14 + idx * (72 / Math.max(displayedQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-transform flex flex-col items-center max-w-[85px] sm:max-w-[120px]"
                >
                  <div className="w-1 h-4 bg-emerald-500 rounded" />
                  <div className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 text-slate-950 border border-emerald-100 font-black text-xs sm:text-base shadow-lg truncate max-w-full text-center">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                left: `${vineX}%`,
                top: '0px',
                transformOrigin: 'top center',
                transform: `rotate(${vineAngle}deg)`,
                transition: vinePlayerState === 'swinging' ? 'left 0.3s ease-in-out, transform 0.25s ease-in-out' : 'transform 0.1s'
              }}
              className="absolute pointer-events-none z-25 flex flex-col items-center"
            >
              <div className="w-1.5 h-36 sm:h-48 bg-gradient-to-b from-emerald-700 via-green-600 to-amber-700 rounded-b" />
              {(vinePlayerState === 'swinging' || vinePlayerState === 'jumping') && (
                <div className="-mt-3 flex flex-col items-center animate-scale-up">
                  <AvatarRenderer customization={activeExplorer.customization} size={42} />
                </div>
              )}
            </div>

            {vinePlayerState === 'ground' && (
              <div
                style={{ left: `${vineX}%`, bottom: '10px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }}
                className="absolute z-30 pointer-events-none flex flex-col items-center"
              >
                <AvatarRenderer customization={activeExplorer.customization} size={42} />
              </div>
            )}
          </div>
        )}

        {/* 4. WHISPERING PEAKS: DOWNHILL MOUNTAIN SLALOM SLIDE */}
        {landId === 'whispering-peaks' && (
          <div className="relative w-full h-[230px] xs:h-[270px] sm:h-[340px] bg-gradient-to-b from-slate-900 via-indigo-950 to-sky-950 rounded-2xl border-2 border-indigo-400/60 overflow-hidden select-none flex flex-col justify-between p-2.5 sm:p-3">
            <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-cyan-200 border-b border-indigo-500/40 pb-1 z-20">
              <span className="flex items-center gap-1 truncate">
                <span>🏔️</span>
                <span>Alpine Downhill Mountain Slide</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] shrink-0 flex items-center gap-1">
                <span>🏂</span>
                <span>Mountain Slope</span>
              </span>
            </div>

            {/* Alpine Mountain Slope Background Decors */}
            <div className="absolute inset-0 pointer-events-none opacity-25 z-0 flex items-end justify-between px-4 pb-2">
              <span className="text-3xl filter drop-shadow">🌲</span>
              <span className="text-4xl filter drop-shadow">🏔️</span>
              <span className="text-3xl filter drop-shadow">🌲</span>
              <span className="text-4xl filter drop-shadow">🏔️</span>
              <span className="text-3xl filter drop-shadow">🌲</span>
            </div>

            {/* Downhill Mountain Slalom Gate Choices (Side-by-side with guaranteed correct answer available) */}
            <div className="w-full flex flex-row flex-nowrap items-center justify-around gap-1.5 sm:gap-3 z-20 my-auto px-1 overflow-x-auto">
              {activeWhisperingChoices.map((choice, idx) => {
                const isTarget = activeGateIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => triggerSnowboardDownhillSlide(choice)}
                    className={`flex-1 min-w-0 p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      isTarget
                        ? 'bg-gradient-to-b from-cyan-200 via-sky-300 to-indigo-400 text-slate-950 border-white ring-2 ring-cyan-300 shadow-lg scale-105'
                        : 'bg-slate-900/90 border-cyan-400/70 text-cyan-100 hover:border-cyan-200 shadow'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs mb-0.5">🚩</span>
                    <span className="font-black text-xs sm:text-base tracking-wide truncate max-w-full text-center">
                      {choice}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-cyan-300 font-mono mt-0.5 hidden xs:inline">Slide ➔</span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                left: `${snowboardX}%`,
                bottom: '8px',
                transform: `translateX(-50%) rotate(${snowboardCarve}deg)`,
                transition: isSnowboardSliding ? 'left 0.3s ease-out, transform 0.2s' : 'left 0.08s ease-out, transform 0.1s ease-out'
              }}
              className="absolute z-30 flex flex-col items-center pointer-events-none select-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={40} />
              <div className="w-14 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500 border border-white shadow flex items-center justify-center text-[6px] font-black text-white">
                SNOWBOARD
              </div>
              {snowboardSpray && (
                <div className="text-[9px] text-cyan-200 animate-bounce">❄️ 💨 ❄️</div>
              )}
            </div>
          </div>
        )}

        {/* 5. LEXICON EMPIRE */}
        {landId === 'lexicon-empire' && (
          <div className="relative w-full h-[250px] xs:h-[290px] sm:h-[360px] bg-gradient-to-b from-purple-950 via-slate-950 to-rose-950 rounded-2xl border-2 sm:border-3 border-rose-500 shadow-lg overflow-hidden select-none p-2 sm:p-3">
            <div 
              className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300 ${
                showDeathCeremony
                  ? 'scale-50 rotate-90 opacity-0 translate-y-16 blur-sm'
                  : bossDamageFlash
                  ? 'scale-115 brightness-150 filter drop-shadow-[0_0_20px_rgba(239,68,68,1)]'
                  : 'scale-100'
              }`}
            >
              {isFinalBoss ? (
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-b from-black via-rose-950 to-purple-950 border border-rose-500 flex items-center justify-center shadow-md animate-pulse">
                    <span className="text-3xl sm:text-4xl">👹</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[8px] sm:text-[10px] font-black uppercase text-rose-300 bg-black/95 px-2 py-0.5 rounded-full border border-rose-500/70 mt-0.5">
                    <Flame className="w-2.5 h-2.5 text-rose-500" />
                    <span>SHADOW KING</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl filter drop-shadow animate-pulse">
                    {bossDef.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase text-rose-300 bg-black/85 px-2 py-0.5 rounded border border-rose-500/60 mt-0.5">
                    {bossDef.bossName}
                  </span>
                </div>
              )}
            </div>

            {laserBeamTarget && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
                <line x1={`${chariotX}%`} y1="78%" x2={`${laserBeamTarget.x}%`} y2={`${laserBeamTarget.y}%`} stroke="#f59e0b" strokeWidth="4" className="animate-pulse" />
              </svg>
            )}

            <div className="absolute top-28 sm:top-36 inset-x-0 flex items-center justify-around px-2 sm:px-6 z-20 pointer-events-none">
              {displayedQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerChariotLaser(choice)}
                  style={{ left: `${14 + idx * (72 / Math.max(displayedQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform max-w-[80px] xs:max-w-[110px] sm:max-w-[150px]"
                >
                  <div className="px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-b from-rose-700 via-rose-800 to-rose-950 text-white border border-rose-300 font-black text-[10px] sm:text-sm shadow-xl break-words text-center leading-snug">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ left: `${chariotX}%`, bottom: '16px', transform: 'translateX(-50%)' }} className="absolute z-30 pointer-events-none">
              <AvatarRenderer customization={activeExplorer.customization} size={42} />
            </div>
          </div>
        )}

        {/* GAME OVER (0 Hearts Left) MODAL */}
        {isOutOfLives && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 shadow-2xl flex flex-col items-center justify-center space-y-2 animate-scale-up">
            <HeartCrack className="w-10 h-10 text-rose-400 animate-bounce" />
            <div className="text-center space-y-0.5">
              <h3 className="text-sm sm:text-base font-black text-rose-100 uppercase tracking-wide">
                Out of Hearts!
              </h3>
              <p className="text-[11px] sm:text-xs text-rose-200">
                You lost all 3 hearts! Take a breath, listen carefully, and restart this stage.
              </p>
            </div>
            <button
              onClick={() => {
                onTryAgain();
                sounds.speak('Stage restarted. Listen closely to the sounds!');
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Stage</span>
            </button>
          </div>
        )}

        {/* Defeat Ceremony (Boss Only) */}
        {showDeathCeremony && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/95 border-2 border-amber-400 shadow-2xl flex flex-col items-center justify-center space-y-2.5 animate-scale-up">
            <div className="text-center space-y-0.5">
              <span className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 uppercase">
                💥 {bossDef.bossName} Defeated! 💥
              </span>
              <p className="text-xs font-bold text-amber-200">
                {bossDef.defeatedSubtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 cursor-pointer shadow active:scale-95"
              >
                Exit to Map
              </button>

              {activeGameIndex >= 50 ? (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    setShowCoronationAisle(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer border border-white hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <span>👑</span>
                  <span>Claim Throne!</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    onFinishRound();
                    if (onNextLevel) onNextLevel();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer border border-white hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Next Level ➔</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4-Way Virtual Controls */}
        {!isOutOfLives && (
          <div className="flex items-center justify-between gap-2 px-0.5 pt-0.5">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
                className="w-9 h-8 sm:w-11 sm:h-10 rounded-lg flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {landId === 'sound-shallows' ? (
                <div className="flex flex-col gap-0.5">
                  <button
                    onMouseDown={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                    onMouseUp={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                    onTouchStart={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                    onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                    className="w-9 h-6 sm:w-11 sm:h-7 rounded flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/40 active:scale-95"
                  >
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    onMouseDown={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                    onMouseUp={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                    onTouchStart={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                    onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                    className="w-9 h-6 sm:w-11 sm:h-7 rounded flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/40 active:scale-95"
                  >
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              ) : null}

              <button
                onMouseDown={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onMouseUp={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                onTouchStart={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
                onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
                className="w-9 h-8 sm:w-11 sm:h-10 rounded-lg flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40 active:scale-95"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </div>

            <button
              onClick={() => triggerRealmAction()}
              className="h-9 sm:h-11 px-4 sm:px-7 rounded-xl sm:rounded-2xl border bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
            >
              <ChevronsUp className="w-4 h-4 stroke-[3]" />
              <span>
                {landId === 'sound-shallows'
                  ? 'DIVE'
                  : landId === 'builders-guild'
                  ? 'DROP'
                  : landId === 'tricky-trails'
                  ? 'SWING'
                  : landId === 'whispering-peaks'
                  ? 'SLIDE 🏂'
                  : 'FIRE'}
              </span>
            </button>
          </div>
        )}

        {/* Level Result Banner */}
        {isAnswered && !showDeathCeremony && !isOutOfLives && (
          <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center space-y-1.5 animate-fade-in ${
            isCorrect ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' : 'bg-rose-950/90 border-rose-400 text-rose-200'
          }`}>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {isCorrect ? '⭐ Correct! Phonics Mastered!' : '❌ Not Quite!'}
            </div>
            {isCorrect ? (
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium">
                {displayedQuestion.explanation}
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-rose-300 font-medium">
                Try again! You lost a heart ({realmLives}/3 remaining).
              </p>
            )}
            <div className="flex gap-2 justify-center pt-0.5">
              {!isCorrect ? (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    onTryAgain();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-rose-400/40 hover:bg-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Exit
                  </button>

                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      onFinishRound();
                      if (onNextLevel) onNextLevel();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow flex items-center gap-1 cursor-pointer hover:scale-105"
                  >
                    <span>Next Level ➔</span>
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
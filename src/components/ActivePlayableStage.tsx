import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LandId, ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { PhonicsLetter } from './PhonicsLetter';
import { PhonicsWordDisplay } from './PhonicsWordDisplay';
import { sounds } from '../utils/audio';
import { HallOfFameCelebration } from './HallOfFameCelebration';
import { getComprehensiveStageChallenge } from '../data/comprehensiveCurriculum';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Star, Volume2, 
  CheckCircle2, RotateCcw, ChevronsUp, Flame, ShieldAlert, Sparkles, Trophy,
  Undo2, RefreshCw, Heart, Zap
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
}

interface RealmBossDef {
  bossName: string;
  icon: string;
  defeatedSubtext: string;
  speechDefeat: string;
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
  // BOSS ENCOUNTERS ARE EXCLUSIVELY IN LEXICON EMPIRE
  const isBossStage = landId === 'lexicon-empire';
  const isFinalBoss = landId === 'lexicon-empire' && activeGameIndex >= 50;

  // The 4 Guardian Bosses and Final Boss across Lexicon Empire
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

  // Universal Boss HP for Lexicon Empire (Starts at 100%)
  const [bossHp, setBossHp] = useState<number>(100);
  const [showDeathCeremony, setShowDeathCeremony] = useState(false);
  const [showCoronationAisle, setShowCoronationAisle] = useState(false);
  const [bossSubCount, setBossSubCount] = useState(0);
  const [bossDamageFlash, setBossDamageFlash] = useState(false);

  // Active question state for continuous multi-hit combat
  const [activeCombatQ, setActiveCombatQ] = useState<GameQuestion>(currentQuestion);

  useEffect(() => {
    setActiveCombatQ(currentQuestion);
    setBossHp(100);
    setShowDeathCeremony(false);
    setBossSubCount(0);
  }, [currentQuestion, activeGameIndex]);

  const displayedQuestion = isBossStage ? activeCombatQ : currentQuestion;

  // Swimming animation clock & position (Sound Shallows)
  const [swimCycle, setSwimCycle] = useState(0);
  const [swimPos, setSwimPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [swimFacing, setSwimFacing] = useState<'left' | 'right'>('right');
  const [swimPitch, setSwimPitch] = useState<number>(0);
  const [isDiving, setIsDiving] = useState(false);

  // Crane Trolley & Vertical Stacking (Builders Guild)
  const [craneTrolleyX, setCraneTrolleyX] = useState<number>(50);
  const [hoistHookY, setHoistHookY] = useState<number>(20);
  const [isHoisting, setIsHoisting] = useState(false);
  const [builderStack, setBuilderStack] = useState<string[]>([]);
  const [builderWrongNotice, setBuilderWrongNotice] = useState<string | null>(null);

  // Tricky Trails: Vine Swing with Player Jump & Swing
  const [vineAngle, setVineAngle] = useState(0);
  const [vineX, setVineX] = useState<number>(50);
  const [vinePlayerState, setVinePlayerState] = useState<'ground' | 'jumping' | 'swinging' | 'landing'>('ground');
  const [vineTargetX, setVineTargetX] = useState<number | null>(null);

  // Whispering Peaks: Alpine Snowboard Downhill Run
  const [snowboardX, setSnowboardX] = useState<number>(50);
  const [snowboardY, setSnowboardY] = useState<number>(14); // starts at crest (top 14%)
  const [snowboardCarve, setSnowboardCarve] = useState<number>(0);
  const [isSnowboardSliding, setIsSnowboardSliding] = useState<boolean>(false);
  const [snowboardSpray, setSnowboardSpray] = useState<boolean>(false);
  const [activeGateIdx, setActiveGateIdx] = useState<number | null>(null);
  const [whisperingStep, setWhisperingStep] = useState<1 | 2>(1);
  const [whisperingPart1, setWhisperingPart1] = useState<string | null>(null);
  const [whisperingNotice, setWhisperingNotice] = useState<string | null>(null);

  // Reset Whispering Peaks slalom steps on stage change
  useEffect(() => {
    setWhisperingStep(1);
    setWhisperingPart1(null);
    setWhisperingNotice(null);
  }, [displayedQuestion, activeGameIndex]);

  // Dual-sound configuration for Whispering Peaks
  const whisperingConfig = useMemo(() => {
    if (landId !== 'whispering-peaks') return null;
    if (displayedQuestion.whisperingParts) return displayedQuestion.whisperingParts;
    const target = (displayedQuestion.targetSound || displayedQuestion.correct || 'BLIZZARD').toUpperCase();
    return {
      targetWord: target,
      part1: target.length > 4 ? target.slice(0, 2) : target.charAt(0),
      part2: target.length > 4 ? target.slice(-2) : target.slice(1),
      choices1: ['I', 'E', 'O', 'A'],
      choices2: ['AR', 'OR', 'ER', 'UR']
    };
  }, [landId, displayedQuestion]);

  const activeWhisperingChoices = useMemo(() => {
    if (!whisperingConfig) return displayedQuestion.choices;
    return whisperingStep === 1 ? whisperingConfig.choices1 : whisperingConfig.choices2;
  }, [whisperingConfig, whisperingStep, displayedQuestion.choices]);

  // Anti-Spoiler filter: never display correct answer word in the prompt badge
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

  // D-Pad active keys (Up, Down, Left, Right)
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  // 8 Letter Choices for Builders Guild
  const builderChoices = useMemo(() => {
    if (landId !== 'builders-guild') return displayedQuestion.choices;
    if (displayedQuestion.builderLetters && displayedQuestion.builderLetters.length === 8) {
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
    return pool.slice(0, 8);
  }, [landId, displayedQuestion]);

  const targetBuilderWord = useMemo(() => {
    return (displayedQuestion.builderTarget || displayedQuestion.correct || '').toUpperCase();
  }, [displayedQuestion]);

  // Reset Builder Stack when stage changes
  useEffect(() => {
    setBuilderStack([]);
    setBuilderWrongNotice(null);
  }, [displayedQuestion, activeGameIndex]);

  // Read off instructions aloud on game startup automatically
  useEffect(() => {
    sounds.stopSpeech();
    const promptText = displayedQuestion.instruction || displayedQuestion.spokenPrompt || 'Listen closely!';
    const timer = setTimeout(() => {
      sounds.speak(promptText);
    }, 350);
    return () => clearTimeout(timer);
  }, [displayedQuestion, activeGameIndex]);

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

  // Vine swinging pendulum oscillation when idle
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

  // Movement loop for arena characters (fine-tuned speeds so players do not zoom wildly)
  useEffect(() => {
    let animId: number;
    const tick = () => {
      // Sound Shallows: full 2D swimming & diving (smooth controlled speed)
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

      // Builders Guild: crane movement (controlled speed)
      if (landId === 'builders-guild') {
        const speed = 0.8;
        if (activeDpad.left) setCraneTrolleyX((p) => Math.max(10, p - speed));
        if (activeDpad.right) setCraneTrolleyX((p) => Math.min(90, p + speed));
      }

      // Tricky Trails: vine traversal (controlled speed)
      if (landId === 'tricky-trails' && vinePlayerState === 'ground') {
        const speed = 0.8;
        if (activeDpad.left) setVineX((p) => Math.max(16, p - speed));
        if (activeDpad.right) setVineX((p) => Math.min(84, p + speed));
      }

      // Whispering Peaks: snowboard carving across alpine crest
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

      // Lexicon Empire: chariot navigation (controlled speed)
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

  // Find index of choice closest to character X
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

  // Universal handler for continuous play boss battles vs regular stages
  const handleAnswerEvaluation = useCallback((choice: string) => {
    const isCorrectHit = choice.trim().toLowerCase() === displayedQuestion.correct.trim().toLowerCase();

    if (!isBossStage) {
      // Normal course stage: standard completion
      onSelectChoice(choice);
      return;
    }

    // Boss Stage: Continuous Multi-Hit Life Source Combat!
    if (isCorrectHit) {
      setBossDamageFlash(true);
      sounds.playDamage();
      setTimeout(() => setBossDamageFlash(false), 300);

      const damageAmount = 25; // 4 hits to deplete 100% life source
      const nextHp = Math.max(0, bossHp - damageAmount);
      setBossHp(nextHp);

      if (nextHp > 0) {
        // CONTINUOUS PLAY: Boss still has HP! NO DEFEAT BANNER YET!
        sounds.playSuccess();
        sounds.speak(`Direct hit! ${bossDef.bossName}'s life source down to ${nextHp} percent! Keep going!`);

        // Advance to next procedural question for continuous battle
        const nextCount = bossSubCount + 1;
        setBossSubCount(nextCount);
        const nextChallenge = getComprehensiveStageChallenge(landId, (activeGameIndex * 11 + nextCount) % 50 || 1);
        setActiveCombatQ(nextChallenge);
      } else {
        // 100% DEPLETED: NOW the boss is completely defeated!
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
        // Mark stage completed
        onSelectChoice(choice);
      }
    } else {
      // Wrong choice in boss combat: boss absorbs dark energy & regains 15% life source!
      // NEVER defeat boss or finish battle on a wrong answer!
      setBossHp((prev) => Math.min(100, prev + 15));
      setBossDamageFlash(true);
      setTimeout(() => setBossDamageFlash(false), 300);
      sounds.playDamage();
      sounds.speak(`Miss! The ${bossDef.bossName} absorbs dark energy and restored 15% life force! Strike again!`);
      // Do not end boss battle! Battle continues!
    }
  }, [displayedQuestion, isBossStage, bossHp, bossDef, bossSubCount, landId, activeGameIndex, isFinalBoss, onSelectChoice]);

  // 1. Sound Shallows: Underwater Swim & Dive
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

  // 2. Builders Guild: Pick letter to stack vertically in order
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
        setBuilderWrongNotice(`Oops! That is not the right letter! Try again!`);
        sounds.speak(`Try again! Listen closely to the sound!`);
      }
    }, 380);
  }, [isAnswered, isHoisting, targetBuilderWord, builderStack, handleAnswerEvaluation]);

  // 3. Tricky Trails: Player JUMPS and SWINGS ON VINE to get the answer!
  const triggerVineLeap = useCallback((choiceOverride?: string) => {
    if (isAnswered || vinePlayerState !== 'ground') return;

    const count = displayedQuestion.choices.length;
    const targetIdx = choiceOverride 
      ? displayedQuestion.choices.indexOf(choiceOverride)
      : getClosestChoiceIndex(vineX, displayedQuestion.choices);

    const targetChoice = choiceOverride || displayedQuestion.choices[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));

    // Phase 1: Player jumps UP from ground to grab the vine!
    setVinePlayerState('jumping');
    sounds.playJump();

    setTimeout(() => {
      // Phase 2: Player has gripped the vine, vine swings wide across to target choice pod!
      setVinePlayerState('swinging');
      setVineTargetX(targetX);
      setVineAngle(targetX > vineX ? 28 : -28);
      sounds.playWhoosh();

      setTimeout(() => {
        // Phase 3: Player reaches target rune pod at swing apex and collects it!
        setVineX(targetX);
        sounds.playCollect();

        setTimeout(() => {
          // Phase 4: Player swings down and lands back onto the jungle branch platform!
          setVinePlayerState('landing');
          setVineAngle(0);
          sounds.playStep();

          setTimeout(() => {
            setVinePlayerState('ground');
            setVineTargetX(null);
            handleAnswerEvaluation(targetChoice);
          }, 240);
        }, 300);
      }, 300);
    }, 200);
  }, [isAnswered, vinePlayerState, displayedQuestion, getClosestChoiceIndex, vineX, handleAnswerEvaluation]);

  // 4. Whispering Peaks: Alpine Snowboard Downhill Slalom Slide (Dual-Sound Carving)
  const triggerSnowboardDownhillSlide = useCallback((choiceOverride?: string) => {
    if (isAnswered || isSnowboardSliding) return;

    const choicesToUse = activeWhisperingChoices;
    const count = choicesToUse.length;
    const targetIdx = choiceOverride 
      ? choicesToUse.indexOf(choiceOverride)
      : getClosestChoiceIndex(snowboardX, choicesToUse);

    const targetChoice = choiceOverride || choicesToUse[targetIdx];
    const targetX = 14 + targetIdx * (72 / Math.max(count - 1, 1));

    // Phase 1: Snowboarder carves and launches downhill directly toward the target slalom gate!
    setIsSnowboardSliding(true);
    setActiveGateIdx(targetIdx);
    setSnowboardSpray(true);
    sounds.playJump();
    sounds.playWhoosh();

    const carveAngle = targetX > snowboardX ? 22 : -22;
    setSnowboardCarve(carveAngle);
    setSnowboardX(targetX);
    setSnowboardY(68); // Slides down the mountain slope directly into the answer gate!

    setTimeout(() => {
      // Phase 2: Smashes through the slalom gate kicking up powder snow spray!
      sounds.playCollect();

      setTimeout(() => {
        // Phase 3: Glides back to top ridge ready for next turn
        setSnowboardSpray(false);
        setSnowboardCarve(0);
        setSnowboardY(14);
        setIsSnowboardSliding(false);
        setActiveGateIdx(null);

        if (whisperingConfig) {
          if (whisperingStep === 1) {
            // Check gate 1
            if (targetChoice.trim().toUpperCase() === whisperingConfig.part1.trim().toUpperCase()) {
              sounds.playSuccess();
              setWhisperingPart1(targetChoice);
              setWhisperingStep(2);
              setWhisperingNotice(`❄️ Gate 1 Hit: [${targetChoice}]! Now carve down through Sound 2!`);
              setTimeout(() => setWhisperingNotice(null), 3000);
            } else {
              sounds.playError();
              setWhisperingNotice('❄️ Wipeout! Steer carefully and try carving the first sound again!');
              setTimeout(() => setWhisperingNotice(null), 2500);
            }
          } else {
            // Check gate 2
            if (targetChoice.trim().toUpperCase() === whisperingConfig.part2.trim().toUpperCase()) {
              sounds.playSuccess();
              handleAnswerEvaluation(targetChoice);
            } else {
              sounds.playError();
              setWhisperingNotice('❄️ Wipeout on Gate 2! Steer into the second sound gate!');
              setTimeout(() => setWhisperingNotice(null), 2500);
            }
          }
        } else {
          handleAnswerEvaluation(targetChoice);
        }
      }, 350);
    }, 400);
  }, [isAnswered, isSnowboardSliding, activeWhisperingChoices, getClosestChoiceIndex, snowboardX, whisperingConfig, whisperingStep, handleAnswerEvaluation]);

  // 5. Lexicon Empire: Chariot Laser
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

  // Keyboard controls
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-3 border-amber-400 rounded-3xl p-3 sm:p-5 text-center space-y-2.5 shadow-[0_0_60px_rgba(0,0,0,0.85)] animate-scale-up flex flex-col max-h-[calc(100dvh-16px)] overflow-y-auto">
        
        {/* Top Header Bar with Boss HP Health Bar (Universal for Boss Stages) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-mono font-black text-amber-300 uppercase tracking-wide">
              {isBossStage ? `Boss: ${bossDef.bossName}` : `Stage #${activeGameIndex}`}
            </span>
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold">
              {isBossStage ? (isFinalBoss ? 'Throne Citadel' : 'Realm Guardian') : 'Adventure Course'}
            </span>
          </div>

          {/* Universal Boss Life Source Bar: Starts at 100%, depleted to 0% */}
          {isBossStage && (
            <div className="flex-1 max-w-xs sm:max-w-sm mx-3 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-amber-300 mb-0.5">
                <span className="flex items-center gap-1">
                  <span>{bossDef.icon}</span>
                  <span className="truncate">{bossDef.bossName}</span>
                </span>
                <span>{bossHp}% Life Source</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full border border-amber-500/60 overflow-hidden p-0.5">
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="text-sm sm:text-base">
                  {i < realmLives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>

            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Big, Clear, Kid-Friendly Audio Prompt with NO giveaways or hints */}
        <div className="space-y-2 px-2 text-center">
          <p className="text-sm sm:text-base md:text-lg text-amber-100 font-black leading-snug break-words">
            {displayedQuestion.instruction}
          </p>

          <div className="flex justify-center items-center py-1">
            <button
              type="button"
              title="Hear instruction and sound again"
              onClick={() => {
                const promptText = displayedQuestion.instruction || displayedQuestion.spokenPrompt || 'Listen closely!';
                sounds.speak(promptText);
              }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/40 border-2 border-amber-400 px-5 py-2.5 rounded-2xl shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer active:scale-95 transition-all text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Tap to Hear Sound Again</span>
              <span className="text-base">🔊</span>
            </button>
          </div>
        </div>

        {/* 1. SOUND SHALLOWS: FULL 2D SWIMMING & DIVING */}
        {landId === 'sound-shallows' && (
          <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[360px] bg-gradient-to-b from-sky-900 via-teal-950 to-blue-950 rounded-2xl border-2 border-cyan-400/60 overflow-hidden select-none">
            {/* Luminous Animated Bubbles */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <span className="absolute top-1/4 left-1/6 text-xl animate-float">🫧</span>
              <span className="absolute top-1/2 left-3/4 text-2xl animate-float" style={{ animationDelay: '0.8s' }}>🫧</span>
              <span className="absolute top-2/3 left-1/3 text-lg animate-float" style={{ animationDelay: '1.4s' }}>🫧</span>
            </div>

            {/* Floating Sound Pearls with Depth Variations & Illustrated Alphabet Animals */}
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
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-cyan-200 via-teal-400 to-blue-600 border-3 border-white flex flex-col items-center justify-center text-slate-950 font-black text-sm sm:text-base shadow-[0_0_25px_rgba(6,182,212,0.8)] overflow-hidden">
                      {choice.length === 1 ? (
                        <PhonicsLetter letter={choice} size={42} showBadge={false} />
                      ) : (
                        <div className="flex flex-col items-center">
                          <PhonicsWordDisplay text={choice} size={24} />
                          <span className="text-[10px] text-white font-mono font-bold">{choice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Free Swimming & Diving Player Avatar */}
            <div
              style={{
                left: `${swimPos.x}%`,
                top: `${swimPos.y}%`,
                transform: `translate(-50%, -50%) rotate(${swimPitch}deg) ${swimFacing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`,
                transition: isDiving ? 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s ease-out'
              }}
              className="absolute z-30 pointer-events-none flex flex-col items-center select-none"
            >
              <AvatarRenderer customization={activeExplorer.customization} size={50} />
              {isDiving && (
                <div className="absolute -bottom-3 text-sm animate-ping">🫧</div>
              )}
            </div>
          </div>
        )}

        {/* 2. BUILDERS GUILD: 8-LETTER VERTICAL WORD STACKING */}
        {landId === 'builders-guild' && (
          <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[360px] bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 rounded-2xl border-2 border-amber-500/60 overflow-hidden select-none">
            {/* Target Word Stacking Pedestal */}
            <div className="absolute top-2 left-4 z-20 bg-slate-950/90 border-2 border-amber-400 p-2.5 rounded-2xl text-left shadow-xl min-w-[130px]">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                Word Tower ({targetBuilderWord.length} Letters):
              </div>
              <div className="text-lg sm:text-xl font-black text-white font-mono tracking-widest">
                {Array.from({ length: targetBuilderWord.length }).map((_, i) => builderStack[i] || '_').join(' ')}
              </div>

              {/* Vertical Stacking Tower Display */}
              <div className="mt-2 flex flex-col-reverse gap-1 border-t border-amber-500/40 pt-2 min-h-[70px]">
                {targetBuilderWord.split('').map((letter, i) => {
                  const stacked = builderStack[i];
                  return (
                    <div
                      key={i}
                      className={`h-7 px-3 rounded-lg border-2 font-mono font-black text-sm flex items-center justify-between transition-all ${
                        stacked
                          ? 'bg-amber-400 text-slate-950 border-white shadow-md animate-scale-up'
                          : 'bg-slate-900 border-dashed border-amber-500/50 text-slate-500'
                      }`}
                    >
                      <span>Slot #{i + 1}</span>
                      <span>{stacked || '_'}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stack Action Controls */}
              {builderStack.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => {
                      sounds.playDamage();
                      setBuilderStack((prev) => prev.slice(0, -1));
                      setBuilderWrongNotice(null);
                    }}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playDamage();
                      setBuilderStack([]);
                      setBuilderWrongNotice(null);
                    }}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[10px] font-bold border border-rose-500/40 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wrong letter notice */}
            {builderWrongNotice && (
              <div className="absolute top-4 right-4 z-40 bg-rose-950/95 border-2 border-rose-400 px-3 py-1.5 rounded-xl text-rose-200 text-xs font-bold shadow-2xl animate-shake">
                {builderWrongNotice}
              </div>
            )}

            {/* Overhead Heavy Crane Track */}
            <div className="absolute top-0 inset-x-0 h-4 bg-stone-900 border-b-2 border-amber-500/60 flex items-center justify-around z-20">
              <div className="w-full h-1 bg-amber-400/40" />
            </div>

            {/* Crane Trolley & Suspended Magnetic Hook */}
            <div
              style={{ left: `${craneTrolleyX}%`, top: '4px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }}
              className="absolute z-25 flex flex-col items-center pointer-events-none"
            >
              <div className="w-10 h-4 bg-amber-500 rounded-b border border-amber-300 shadow" />
              <div style={{ height: `${hoistHookY * 2.2}px`, transition: 'height 0.25s ease-in-out' }} className="w-1 bg-slate-300" />
              <div className="text-xl sm:text-2xl filter drop-shadow">🪝</div>
            </div>

            {/* 8 Letter Animal Cards Conveyor Platform */}
            <div className="absolute bottom-2.5 inset-x-2 sm:inset-x-4 flex items-center justify-around z-20 pointer-events-none gap-1">
              {builderChoices.map((letter, idx) => (
                <div
                  key={idx}
                  onClick={() => handleBuilderLetterPick(letter)}
                  className="pointer-events-auto cursor-pointer hover:scale-115 active:scale-90 transition-transform group"
                >
                  <PhonicsLetter letter={letter} size={44} />
                </div>
              ))}
            </div>

            <div style={{ left: `${craneTrolleyX}%`, bottom: '52px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }} className="absolute z-30 pointer-events-none">
              <AvatarRenderer customization={activeExplorer.customization} size={48} />
            </div>
          </div>
        )}

        {/* 3. TRICKY TRAILS: PLAYER JUMPS AND SWINGS ON VINE TO GET ANSWER */}
        {landId === 'tricky-trails' && (
          <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[360px] bg-gradient-to-b from-emerald-950 via-slate-950 to-stone-950 rounded-2xl border-2 border-emerald-400/60 overflow-hidden select-none">
            
            {/* Hanging Jungle Canopy */}
            <div className="absolute top-0 inset-x-0 h-10 flex justify-between px-6 pointer-events-none opacity-40">
              <span className="text-2xl animate-float">🌿</span>
              <span className="text-xl animate-float" style={{ animationDelay: '0.6s' }}>🍃</span>
              <span className="text-2xl animate-float" style={{ animationDelay: '1.2s' }}>🌿</span>
              <span className="text-xl animate-float" style={{ animationDelay: '1.8s' }}>🍃</span>
            </div>

            {/* Hanging Golden Rune Pod Choices */}
            <div className="absolute top-8 inset-x-0 flex items-center justify-around px-4 sm:px-10 z-20 pointer-events-none">
              {displayedQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerVineLeap(choice)}
                  style={{ left: `${14 + idx * (72 / Math.max(displayedQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-115 active:scale-95 transition-transform flex flex-col items-center"
                >
                  <div className="w-1.5 h-6 bg-emerald-500 rounded" />
                  <div className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-b from-emerald-300 via-emerald-400 to-teal-500 text-slate-950 border-2 border-emerald-100 font-black text-sm sm:text-lg shadow-[0_0_20px_rgba(16,185,129,0.7)]">
                    {choice}
                  </div>
                </div>
              ))}
            </div>

            {/* Jungle Tree Platform at Bottom */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-amber-950 to-stone-900 border-t-2 border-emerald-600/70 flex items-center justify-between px-6 text-emerald-400 text-[10px] font-mono font-bold pointer-events-none">
              <span>🌿 Jungle Tree Platform</span>
              <span>Moss Canopy 🍃</span>
            </div>

            {/* Swinging Jungle Vine hanging from canopy */}
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
              {/* Vine Rope */}
              <div className="w-2 h-44 sm:h-50 bg-gradient-to-b from-emerald-700 via-green-600 to-amber-700 rounded-b shadow-[0_0_12px_rgba(16,185,129,0.7)] flex flex-col justify-between py-2 items-center">
                <span className="text-[10px]">🍃</span>
                <span className="text-[10px]">🌿</span>
                <span className="text-[10px]">🍃</span>
              </div>

              {/* Player Avatar gripping the vine while swinging */}
              {(vinePlayerState === 'swinging' || vinePlayerState === 'jumping') && (
                <div className="-mt-4 flex flex-col items-center animate-scale-up">
                  <AvatarRenderer customization={activeExplorer.customization} size={50} />
                  <span className="text-xs text-emerald-300 font-black animate-ping mt-0.5">🍃 Swinging Vine!</span>
                </div>
              )}
            </div>

            {/* Player standing on platform when NOT in air swinging */}
            {vinePlayerState === 'ground' && (
              <div
                style={{ left: `${vineX}%`, bottom: '12px', transform: 'translateX(-50%)', transition: 'left 0.1s ease-out' }}
                className="absolute z-30 pointer-events-none flex flex-col items-center"
              >
                <AvatarRenderer customization={activeExplorer.customization} size={48} />
              </div>
            )}
          </div>
        )}

        {/* 4. WHISPERING PEAKS: ALPINE SNOWBOARD DOWNHILL SLALOM RUN */}
        {landId === 'whispering-peaks' && (
          <div className="relative w-full h-[290px] xs:h-[330px] sm:h-[390px] bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 rounded-2xl border-2 border-indigo-400/60 overflow-hidden select-none">
            
            {/* Snowy Alpine Mountain Top Ridge Crest */}
            <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-slate-800 via-indigo-950/80 to-transparent flex items-center justify-between px-6 pointer-events-none opacity-60">
              <span className="text-xl">🏔️</span>
              <span className="text-sm text-cyan-200 font-mono font-bold tracking-widest uppercase">❄️ Crest Start Ridge · Steer & Slide Down! ❄️</span>
              <span className="text-xl">🏔️</span>
            </div>

            {/* Downhill Mountain Slope with Ski Tracks & Pine Trees */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <div className="absolute top-16 left-1/4 text-2xl">🌲</div>
              <div className="absolute top-28 left-3/4 text-2xl">🌲</div>
              <div className="absolute top-20 left-2/3 text-lg">❄️</div>
              <div className="absolute top-12 left-1/8 text-lg">❄️</div>
              {/* Slalom slope tracks */}
              <div className="absolute top-0 bottom-0 left-1/4 w-1 border-r border-dashed border-cyan-300/40" />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 border-r border-dashed border-cyan-300/40" />
              <div className="absolute top-0 bottom-0 left-3/4 w-1 border-r border-dashed border-cyan-300/40" />
            </div>

            {/* Downhill Slalom Answer Gates */}
            <div className="absolute bottom-6 inset-x-0 flex items-center justify-around px-4 sm:px-10 z-20 pointer-events-none">
              {activeWhisperingChoices.map((choice, idx) => {
                const isTarget = activeGateIdx === idx;
                const gateX = 14 + idx * (72 / Math.max(activeWhisperingChoices.length - 1, 1));

                return (
                  <div
                    key={idx}
                    onClick={() => triggerSnowboardDownhillSlide(choice)}
                    style={{ left: `${gateX}%`, transform: 'translateX(-50%)' }}
                    className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-transform flex flex-col items-center group"
                  >
                    {/* Slalom Gate Flags */}
                    <div className="flex items-center gap-6 mb-1 pointer-events-none">
                      <span className="text-xs">🚩</span>
                      <span className="text-xs">🚩</span>
                    </div>

                    {/* Snowboard Target Gate Banner */}
                    <div className={`px-4 py-2 sm:px-5 sm:py-3 rounded-2xl border-2 flex flex-col items-center transition-all ${
                      isTarget
                        ? 'bg-gradient-to-b from-cyan-200 via-sky-300 to-indigo-400 text-slate-950 border-white ring-4 ring-cyan-300 shadow-[0_0_30px_rgba(6,182,212,1)] scale-110'
                        : 'bg-slate-900/95 border-cyan-400/80 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:border-cyan-200'
                    }`}>
                      <span className="text-xs">🏂</span>
                      <span className="font-black text-sm sm:text-base tracking-wide">{choice}</span>
                    </div>

                    {/* Snow Drift Base */}
                    <div className="w-16 h-2 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full mt-1 blur-xs" />
                  </div>
                );
              })}
            </div>

            {/* 2-Sound Slalom Progress Banner */}
            <div className="absolute top-12 inset-x-0 flex justify-center pointer-events-none z-20">
              <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400 text-xs font-black text-cyan-200 shadow-md flex items-center gap-2">
                <span>🏂 {whisperingStep === 1 ? 'Gate 1 of 2: Carve Sound 1' : 'Gate 2 of 2: Carve Sound 2'}</span>
                {whisperingPart1 && (
                  <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Sound 1: {whisperingPart1} ✅
                  </span>
                )}
              </div>
            </div>

            {/* Whispering Slalom Notice */}
            {whisperingNotice && (
              <div className="absolute top-22 inset-x-0 flex justify-center pointer-events-none z-30 animate-bounce">
                <div className="px-4 py-1.5 rounded-2xl bg-indigo-950/95 border-2 border-cyan-300 text-cyan-100 text-xs font-black shadow-xl">
                  {whisperingNotice}
                </div>
              </div>
            )}

            {/* Active Snowboarder (Starts at top crest, carves L/R, zooms downhill on select) */}
            <div
              style={{
                left: `${snowboardX}%`,
                top: `${snowboardY}%`,
                transform: `translateX(-50%) rotate(${snowboardCarve}deg)`,
                transition: isSnowboardSliding ? 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s ease-out, transform 0.2s' : 'left 0.08s ease-out, transform 0.1s ease-out'
              }}
              className="absolute z-30 flex flex-col items-center pointer-events-none select-none"
            >
              {/* Downhill Speed Lines when sliding */}
              {isSnowboardSliding && (
                <div className="absolute -top-10 text-cyan-200 text-xs font-mono font-black animate-pulse flex flex-col items-center">
                  <span>💨 DOWNHILL SLIDE!</span>
                  <div className="w-0.5 h-8 bg-cyan-300/80" />
                </div>
              )}

              <AvatarRenderer customization={activeExplorer.customization} size={48} />
              
              {/* Real Alpine Snowboard Deck */}
              <div className="w-18 h-3.5 -mt-1 rounded-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-blue-600 border-2 border-white shadow-[0_0_15px_rgba(6,182,212,0.9)] flex items-center justify-around text-[8px] font-black text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>SNOWBOARD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>

              {/* Snow Powder Spray when carving or sliding */}
              {snowboardSpray && (
                <div className="flex items-center gap-1 text-xs -mt-1 opacity-90 text-cyan-100 animate-bounce">
                  <span>❄️</span>
                  <span>✨</span>
                  <span>❄️</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. LEXICON EMPIRE: CHARIOT LASER & MULTI-HIT CONTINUOUS BOSS BATTLE (EXPANDED TO PREVENT TEXT CUT-OFF) */}
        {landId === 'lexicon-empire' && (
          <div className="relative w-full min-h-[460px] sm:min-h-[520px] h-[460px] sm:h-[520px] bg-gradient-to-b from-purple-950 via-slate-950 to-rose-950 rounded-3xl border-3 border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.5)] overflow-hidden select-none p-3 pt-4">
            
            {/* Castle Boss Entity with Menacing Scary Face for Shadow King (NOT a crown) */}
            <div 
              className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300 ${
                showDeathCeremony
                  ? 'scale-50 rotate-90 opacity-0 translate-y-16 blur-sm'
                  : bossDamageFlash
                  ? 'scale-120 brightness-150 filter drop-shadow-[0_0_30px_rgba(239,68,68,1)]'
                  : 'scale-100'
              }`}
            >
              {isFinalBoss ? (
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-black via-rose-950 to-purple-950 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_35px_rgba(225,29,72,1)] animate-pulse">
                    <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_20px_rgba(255,0,0,1)]">👹</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-300 bg-black/95 px-3 py-0.5 rounded-full border border-rose-500/70 mt-1 shadow-lg">
                    <Flame className="w-3 h-3 text-rose-500 animate-bounce" />
                    <span>THE SHADOW KING</span>
                    <Flame className="w-3 h-3 text-rose-500 animate-bounce" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-4xl sm:text-5xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse">
                    {bossDef.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-rose-300 bg-black/85 px-2.5 py-0.5 rounded border border-rose-500/60 mt-1">
                    {bossDef.bossName}
                  </span>
                </div>
              )}
            </div>

            {laserBeamTarget && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-35">
                <line x1={`${chariotX}%`} y1="78%" x2={`${laserBeamTarget.x}%`} y2={`${laserBeamTarget.y}%`} stroke="#f59e0b" strokeWidth="6" className="animate-pulse" />
              </svg>
            )}

            {/* Answer Obelisks: Positioned Lower with Generous Room to Completely Prevent Text Cut-Off */}
            <div className="absolute top-36 sm:top-44 inset-x-0 flex items-center justify-around px-3 sm:px-8 z-20 pointer-events-none">
              {displayedQuestion.choices.map((choice, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerChariotLaser(choice)}
                  style={{ left: `${14 + idx * (72 / Math.max(displayedQuestion.choices.length - 1, 1))}%`, transform: 'translateX(-50%)' }}
                  className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <div className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl bg-gradient-to-b from-rose-700 via-rose-800 to-rose-950 text-white border-2 border-rose-300 font-black text-xs sm:text-sm md:text-base shadow-2xl break-words max-w-[130px] sm:max-w-[170px] text-center leading-snug">
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

        {/* UNIVERSAL DEFEAT CEREMONY: HAS CLEAR ADVANCE & EXIT BUTTONS SO PLAYER IS NEVER STUCK! */}
        {showDeathCeremony && (
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/95 border-3 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.6)] flex flex-col items-center justify-center space-y-3 animate-scale-up">
            <div className="text-center space-y-1">
              <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 font-display block uppercase">
                💥 {bossDef.bossName} Defeated! 💥
              </span>
              <p className="text-xs sm:text-sm font-bold text-amber-200">
                {bossDef.defeatedSubtext}
              </p>
            </div>

            {/* Advance and Exit Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-600 cursor-pointer shadow transition-transform active:scale-95"
              >
                Exit to Realm Map
              </button>

              {activeGameIndex >= 50 ? (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    setShowCoronationAisle(true);
                  }}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.8)] cursor-pointer border-2 border-white transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>👑</span>
                  <span>Claim Throne & Celebrate!</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    if (onNextLevel) onNextLevel();
                    else onFinishRound();
                  }}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.7)] cursor-pointer border-2 border-white transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Advance to Next Level ➔</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4-WAY VIRTUAL ON-SCREEN CONTROLS & ACTIVATE BUTTON */}
        <div className="flex items-center justify-between gap-3 px-1 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onMouseDown={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
              onMouseUp={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
              onTouchStart={() => setActiveDpad((prev) => ({ ...prev, left: true }))}
              onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, left: false }))}
              className="w-10 h-9 sm:w-11 sm:h-10 rounded-xl flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {landId === 'sound-shallows' ? (
              <div className="flex flex-col gap-1">
                <button
                  onMouseDown={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                  onMouseUp={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                  onTouchStart={() => setActiveDpad((prev) => ({ ...prev, up: true }))}
                  onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, up: false }))}
                  className="w-10 h-7 sm:w-11 sm:h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/40 active:scale-95"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onMouseDown={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                  onMouseUp={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                  onTouchStart={() => setActiveDpad((prev) => ({ ...prev, down: true }))}
                  onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, down: false }))}
                  className="w-10 h-7 sm:w-11 sm:h-8 rounded-lg flex items-center justify-center bg-slate-900 text-cyan-300 border border-cyan-500/40 active:scale-95"
                >
                  <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : null}

            <button
              onMouseDown={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
              onMouseUp={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
              onTouchStart={() => setActiveDpad((prev) => ({ ...prev, right: true }))}
              onTouchEnd={() => setActiveDpad((prev) => ({ ...prev, right: false }))}
              className="w-10 h-9 sm:w-11 sm:h-10 rounded-xl flex items-center justify-center bg-slate-900 text-amber-300 border border-amber-500/40 active:scale-95"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <button
            onClick={() => triggerRealmAction()}
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-2xl border-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronsUp className="w-5 h-5 stroke-[3]" />
            <span>
              {landId === 'sound-shallows'
                ? 'DIVE / POP'
                : landId === 'builders-guild'
                ? 'DROP HOOK'
                : landId === 'tricky-trails'
                ? 'JUMP & SWING'
                : landId === 'whispering-peaks'
                ? 'SLIDE DOWNHILL 🏂'
                : 'FIRE LASER'}
            </span>
          </button>
        </div>

        {/* LEVEL COMPLETION & PATH ADVANCEMENT */}
        {isAnswered && !showDeathCeremony && (
          <div className={`p-3 sm:p-4 rounded-2xl border text-center space-y-2 animate-fade-in ${
            isCorrect ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' : 'bg-rose-950/90 border-rose-400 text-rose-200'
          }`}>
            <div className="text-sm sm:text-base font-black uppercase tracking-wider">
              {isCorrect ? '⭐ Correct! Phonics Mastered!' : '❌ Not Quite! Listen closely to the pure sound!'}
            </div>
            {isCorrect ? (
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {displayedQuestion.explanation}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-rose-300 font-medium">
                Try again! Listen to the sound and make your choice!
              </p>
            )}

            <div className="flex gap-3 justify-center pt-1">
              {!isCorrect ? (
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    onTryAgain();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer border border-rose-400/40 hover:bg-slate-700"
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
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Exit to Map
                  </button>

                  <button
                    onClick={() => {
                      sounds.stopSpeech();
                      if (onNextLevel) onNextLevel();
                      else onFinishRound();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105"
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

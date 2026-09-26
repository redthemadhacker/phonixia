import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Play, Sparkles, Gamepad2, Footprints, 
  Zap, CheckCircle2, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, 
  ArrowRight, RotateCcw, Volume2, Flame, Award, X, ChevronsUp
} from 'lucide-react';
import shellshoreBg from '../../shellshore.jpeg';

interface ShellshoreArcadeProps {
  onBackToWorld: () => void;
}

export interface ArcadeCabinetGame {
  id: string;
  name: string;
  building: string;
  skill: string;
  icon: string;
  howToPlay: string;
  x: number;
  y: number;
}

export const SHELLSHORE_25_GAMES: ArcadeCabinetGame[] = [
  { id: 'ssa-1', name: 'Pinball Beacon Spire', building: 'Neon Spiral Spire', skill: 'Root CHRON (Time)', icon: '⏳', howToPlay: 'Launch cyber pinballs along the spiral ramp to decode chronological roots.', x: 14, y: 15 },
  { id: 'ssa-2', name: 'Spire Arcade Portal', building: 'Spire Base Cabinets', skill: 'Root TELE (Far)', icon: '📡', howToPlay: 'Calibrate long-distance satellite signals for telescope and telepathy.', x: 19, y: 32 },
  { id: 'ssa-3', name: 'Matrix Obelisk Circuit', building: 'Neon Maze Obelisk', skill: 'Root BIO (Life)', icon: '🧬', howToPlay: 'Guide electrical circuits to the central pillar for biology and biome.', x: 30, y: 20 },
  { id: 'ssa-4', name: 'Hedge Firewall Gate', building: 'Maze Security Gate', skill: 'Root GEO (Earth)', icon: '🌍', howToPlay: 'Bypass security gates by mining geological and geothermal root words.', x: 38, y: 27 },
  { id: 'ssa-5', name: 'Binary Code Cleft', building: 'Binary Matrix Mountain', skill: 'Root SPEC (See)', icon: '🔬', howToPlay: 'Inspect streaming cyber code for spectator, spectacle, and conspicuous.', x: 50, y: 19 },
  { id: 'ssa-6', name: 'Matrix Data Stream', building: 'Mountain Aqueduct Run', skill: 'Quad-Syllables', icon: '⚔️', howToPlay: 'Slice streaming data packets into syllables: un-pre-dict-a-ble.', x: 58, y: 26 },
  { id: 'ssa-7', name: 'Laser Stage Rhythm', building: 'Neon Amphitheater', skill: 'Primary Stress', icon: '🎚️', howToPlay: 'Tune audio frequencies on stressed syllables: pho-TOG-ra-phy.', x: 69, y: 19 },
  { id: 'ssa-8', name: 'Hologram Projection Beam', building: 'Upper Laser Crane', skill: 'The Schwa (ə)', icon: '📻', howToPlay: 'Filter sound waves to locate unaccented schwa vowels in a-bout and pen-cil.', x: 63, y: 11 },
  { id: 'ssa-9', name: 'Vaporwave Neon Grid', building: 'Grid Platform', skill: 'Prefixes MEGA/MICRO', icon: '💾', howToPlay: 'Sort microscopic and megabyte data crystals across the glowing grid.', x: 86, y: 22 },
  { id: 'ssa-10', name: 'Grid Telescope Radar', building: 'Observatory Tower', skill: 'Prefixes ANTI/COUNTER', icon: '🛡️', howToPlay: 'Scan for defense codes like antioxidant, counterattack, and antidote.', x: 79, y: 20 },
  { id: 'ssa-11', name: 'Bioluminescent Maze', building: 'Lower Neon Maze', skill: 'Prefixes INTER/INTRA', icon: '🌐', howToPlay: 'Route maze packets along international and intracellular pathways.', x: 12, y: 52 },
  { id: 'ssa-12', name: 'Maze Neon Steps', building: 'Labyrinth Steps', skill: 'Suffix -OLOGY', icon: '📚', howToPlay: 'Unlock study archives for archaeology, neurology, and meteorology.', x: 6, y: 61 },
  { id: 'ssa-13', name: 'Synth Rowboat Regatta', building: 'Letter Rowboats', skill: 'Suffixes -IBLE vs -ABLE', icon: '🔐', howToPlay: 'Navigate boats through canal gates for flexible, dependable, and durable.', x: 33, y: 40 },
  { id: 'ssa-14', name: 'Canal Neon Waterfall', building: 'Stone Bridge Arch', skill: 'I Before E Rule', icon: '🎹', howToPlay: 'Hit keyboard notes in rhythm for ceiling, receive, and neighbor.', x: 26, y: 48 },
  { id: 'ssa-15', name: 'Bioluminescent Fountain', building: 'Coral Altar Fountain', skill: 'Complex R-Vowels', icon: '⚡', howToPlay: 'Shield the fountain core against storms of thorough, murmur, and whirl.', x: 49, y: 48 },
  { id: 'ssa-16', name: 'Coral Island Boardwalk', building: 'Center Coral Walkway', skill: 'Silent Letters', icon: '🥷', howToPlay: 'Walk silently past monitors using words with silent k, w, and b.', x: 45, y: 53 },
  { id: 'ssa-17', name: 'Cyber Terminal Tent', building: 'Covered Screen Tent', skill: 'Diphthongs (OI, OU)', icon: '🌊', howToPlay: 'Synthesize audio tracks with royal, void, bounce, and prowl.', x: 63, y: 37 },
  { id: 'ssa-18', name: 'Neon Suspension Bridge', building: 'Wooden Footbridge', skill: 'Soft C and Soft G', icon: '🎸', howToPlay: 'Slap synthesizer basslines for cinema, giant, logic, and gym.', x: 60, y: 42 },
  { id: 'ssa-19', name: 'Silicon CPU Chip Hub', building: 'Micro-Hub Tower', skill: 'Context Clues', icon: '🏎️', howToPlay: 'Solve sentence context clues to overclock the CPU engine speed.', x: 89, y: 44 },
  { id: 'ssa-20', name: 'Chipboard Smoker', building: 'Silicon Pipes', skill: 'Denotation / Connotation', icon: '⚖️', howToPlay: 'Balance subtle word weights: curious vs nosy, and thrifty vs stingy.', x: 80, y: 45 },
  { id: 'ssa-21', name: 'High Score Cabinets', building: 'Neon Arcade', skill: 'Academic Analogies', icon: '🏁', howToPlay: 'Play CRT arcade cabinets by completing analogies at high speed.', x: 13, y: 76 },
  { id: 'ssa-22', name: 'Arcade Marquee Deck', building: 'Neon Star Marquee', skill: 'Confusing Homophones', icon: '🎯', howToPlay: 'Lock radar crosshairs on affect/effect and principal/principle.', x: 21, y: 83 },
  { id: 'ssa-23', name: 'Holographic Codex Page', building: 'Giant Cyber Book', skill: 'Language Lineage', icon: '🏛️', howToPlay: 'Trace word origins back to Latin, Ancient Greek, and Old English.', x: 42, y: 77 },
  { id: 'ssa-24', name: 'Tidal Crane Dock', building: 'Cyber Wharf Pier', skill: 'Base Word Extraction', icon: '💻', howToPlay: 'Decompile long words like unconstitutionally down to their base word.', x: 53, y: 89 },
  { id: 'ssa-25', name: 'Prismatic Crystal Mines', building: 'Neon Crystal Mountain', skill: 'Figurative Language', icon: '🏆', howToPlay: 'Identify hyperbole, metaphor, and oxymorons to unlock the crystal chest.', x: 92, y: 82 }
];

interface ArcadeChallenge {
  prompt: string;
  target: string;
  soundCue: string;
  choices: string[];
  correct: string;
  fact: string;
}

const GENERATE_ARCADE_CHALLENGE = (cabinet: ArcadeCabinetGame): ArcadeChallenge => {
  const rootDatabase = [
    { root: 'CHRON', meaning: 'Time', example: 'Chronological', dist: ['Space', 'Water', 'Speed'] },
    { root: 'TELE', meaning: 'Far / Distant', example: 'Telescope', dist: ['Near', 'Small', 'Mind'] },
    { root: 'BIO', meaning: 'Life', example: 'Biology', dist: ['Earth', 'Heat', 'Sound'] },
    { root: 'GEO', meaning: 'Earth / Ground', example: 'Geothermal', dist: ['Sky', 'Cold', 'Air'] },
    { root: 'SPEC', meaning: 'To Look / See', example: 'Spectator', dist: ['Hear', 'Touch', 'Taste'] },
    { root: 'PORT', meaning: 'To Carry', example: 'Transport', dist: ['Build', 'Break', 'Drop'] },
    { root: 'PHON', meaning: 'Sound / Voice', example: 'Symphony', dist: ['Light', 'Weight', 'Color'] },
    { root: 'MICRO', meaning: 'Very Small', example: 'Microscopic', dist: ['Huge', 'Distant', 'Old'] },
    { root: 'ANTI', meaning: 'Against / Opposite', example: 'Antibacterial', dist: ['Before', 'After', 'With'] },
  ];

  const advancedRules = [
    { rule: 'I before E except after C', word: 'RECEIVE', dist: ['RECIEVE', 'RECEVE', 'RECEV'] },
    { rule: 'Silent Letter Challenge', word: 'KNIGHT', dist: ['NIGHT', 'KITE', 'KNOT'] },
    { rule: 'Suffix -OLOGY (Study of)', word: 'BIOLOGY', dist: ['BIOGRAPHY', 'BIOMETRIC', 'BIONIC'] },
    { rule: 'Suffix -ABLE (Can be done)', word: 'REPAIRABLE', dist: ['REPAIRIBLE', 'REPAIREBLE', 'REPAIROBLE'] },
  ];

  if (cabinet.skill.includes('Root') || cabinet.skill.includes('Prefix')) {
    const r = rootDatabase[Math.floor(Math.random() * rootDatabase.length)];
    return {
      prompt: `Cyber Root Matrix: Decompile meaning for:`,
      target: `${r.root} (${r.example})`,
      soundCue: `What is the core meaning of the root ${r.root}?`,
      choices: [r.meaning, ...r.dist].sort(() => Math.random() - 0.5),
      correct: r.meaning,
      fact: `${r.root} translates directly to "${r.meaning}"!`
    };
  }

  const adv = advancedRules[Math.floor(Math.random() * advancedRules.length)];
  return {
    prompt: `Advanced Linguistic Cabinet:`,
    target: adv.rule,
    soundCue: `Identify the correct spelling according to the rule: ${adv.rule}.`,
    choices: [adv.word, ...adv.dist].sort(() => Math.random() - 0.5),
    correct: adv.word,
    fact: `Correct! ${adv.word} follows the rule: ${adv.rule}.`
  };
};

export const ShellshoreArcade: React.FC<ShellshoreArcadeProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  const playerPosRef = useRef<{ x: number; y: number }>({ x: 42, y: 68 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 42, y: 68 });
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);

  const [nearbyGame, setNearbyGame] = useState<ArcadeCabinetGame | null>(null);
  const [activeCabinet, setActiveCabinet] = useState<ArcadeCabinetGame | null>(null);
  const [challenge, setChallenge] = useState<ArcadeChallenge | null>(null);
  const [scoreStreak, setScoreStreak] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebrationAnim, setShowCelebrationAnim] = useState(false);

  // Jump physics on arcade map
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  const triggerArcadeJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    sounds.playJump();

    const startTime = performance.now();
    const jumpDuration = 450;
    const maxDisplacement = 40;

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
      }
    };

    requestAnimationFrame(animateJump);
  }, [isJumping]);

  const dirKeysRef = useRef({ up: false, down: false, left: false, right: false, shift: false });
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const enterCooldown = useRef<number>(0);
  const lastEnteredGameId = useRef<string | null>(null);

  useEffect(() => {
    containerRef.current?.focus();
    return () => {
      sounds.stopSpeech();
    };
  }, []);

  const launchCabinet = useCallback((game: ArcadeCabinetGame) => {
    sounds.stopSpeech();
    sounds.playStep();
    sounds.speak(`Booting ${game.name}! Prepare for endless play!`);
    const firstChallenge = GENERATE_ARCADE_CHALLENGE(game);
    setChallenge(firstChallenge);
    setActiveCabinet(game);
    setScoreStreak(0);
    setSelectedChoice(null);
    setIsCorrect(null);
    setShowCelebrationAnim(false);

    setTimeout(() => {
      sounds.speak(firstChallenge.soundCue);
    }, 300);
  }, []);

  const checkProximity = useCallback((x: number, y: number) => {
    let closest: ArcadeCabinetGame | null = null;
    let minDistance = 5.0;

    SHELLSHORE_25_GAMES.forEach((game) => {
      const dist = Math.hypot(game.x - x, game.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = game;
      }
    });

    setNearbyGame(closest);

    const now = Date.now();
    if (closest && minDistance < 3.2 && now > enterCooldown.current && !activeCabinet) {
      const target = closest as ArcadeCabinetGame;
      if (lastEnteredGameId.current !== target.id) {
        lastEnteredGameId.current = target.id;
        enterCooldown.current = now + 2000;
        launchCabinet(target);
      }
    } else if (!closest || minDistance > 5.5) {
      lastEnteredGameId.current = null;
    }
  }, [launchCabinet, activeCabinet]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      let matched = false;

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = true;
        setActiveDpad(prev => ({ ...prev, up: true }));
        matched = true;
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = true;
        setActiveDpad(prev => ({ ...prev, down: true }));
        matched = true;
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = true;
        setActiveDpad(prev => ({ ...prev, left: true }));
        matched = true;
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = true;
        setActiveDpad(prev => ({ ...prev, right: true }));
        matched = true;
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = true;
        matched = true;
      }

      // Space bar (arrow keys) and Tab (WASD) jump action
      if (k === ' ' || k === 'tab' || code === 'Space' || code === 'Tab') {
        e.preventDefault();
        matched = true;
        triggerArcadeJump();
      }

      if ((k === 'e' || k === 'enter' || code === 'KeyE') && nearbyGame && !activeCabinet) {
        matched = true;
        launchCabinet(nearbyGame);
      }

      if (matched) {
        targetPosRef.current = null;
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'space'].includes(k)) {
          e.preventDefault();
        }
        if (!lastKeyTimeRef.current) lastKeyTimeRef.current = performance.now();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW') {
        dirKeysRef.current.up = false;
        setActiveDpad(prev => ({ ...prev, up: false }));
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS') {
        dirKeysRef.current.down = false;
        setActiveDpad(prev => ({ ...prev, down: false }));
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA') {
        dirKeysRef.current.left = false;
        setActiveDpad(prev => ({ ...prev, left: false }));
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD') {
        dirKeysRef.current.right = false;
        setActiveDpad(prev => ({ ...prev, right: false }));
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = false;
      }

      const anyActive = dirKeysRef.current.up || dirKeysRef.current.down || dirKeysRef.current.left || dirKeysRef.current.right;
      if (!anyActive) lastKeyTimeRef.current = 0;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyGame, activeCabinet, launchCabinet]);

  useEffect(() => {
    let prevTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - prevTime) / 1000, 0.1);
      prevTime = currentTime;

      const dirs = dirKeysRef.current;
      let dx = 0;
      let dy = 0;

      if (dirs.up) dy -= 1;
      if (dirs.down) dy += 1;
      if (dirs.left) dx -= 1;
      if (dirs.right) dx += 1;

      const isHeld = lastKeyTimeRef.current > 0 && (currentTime - lastKeyTimeRef.current > 280);
      const running = isHeld || dirs.shift;
      setIsRunning(running);

      const baseSpeed = running ? 36 : 20;

      let newX = playerPosRef.current.x;
      let newY = playerPosRef.current.y;
      let moving = false;

      if (dx !== 0 || dy !== 0) {
        targetPosRef.current = null;
        const len = Math.hypot(dx, dy);

        if (Math.abs(dx) >= Math.abs(dy)) {
          setFacing(dx > 0 ? 'right' : 'left');
        } else {
          setFacing(dy > 0 ? 'down' : 'up');
        }

        newX = Math.max(5, Math.min(95, playerPosRef.current.x + (dx / len) * baseSpeed * dt));
        newY = Math.max(10, Math.min(92, playerPosRef.current.y + (dy / len) * baseSpeed * dt));
        moving = true;
      } else if (targetPosRef.current) {
        const target = targetPosRef.current;
        const distX = target.x - playerPosRef.current.x;
        const distY = target.y - playerPosRef.current.y;
        const dist = Math.hypot(distX, distY);

        if (dist > 0.8) {
          if (Math.abs(distX) > Math.abs(distY)) {
            setFacing(distX > 0 ? 'right' : 'left');
          } else {
            setFacing(distY > 0 ? 'down' : 'up');
          }

          newX = playerPosRef.current.x + (distX / dist) * baseSpeed * dt;
          newY = playerPosRef.current.y + (distY / dist) * baseSpeed * dt;
          moving = true;
        } else {
          targetPosRef.current = null;
        }
      }

      if (moving) {
        playerPosRef.current = { x: newX, y: newY };
        setPlayerPos({ x: newX, y: newY });
        setIsMoving(true);
        setWalkCycle((prev) => (prev + dt * (running ? 16 : 9)) % (Math.PI * 2));
        checkProximity(newX, newY);

        const stepCadence = running ? 200 : 320;
        if (currentTime - lastStepSoundTime.current > stepCadence) {
          sounds.playStep();
          lastStepSoundTime.current = currentTime;
        }
      } else {
        setIsMoving(false);
        setWalkCycle(0);
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [checkProximity]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    containerRef.current?.focus();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetPosRef.current = { x: clickX, y: clickY };
  };

  const handleDpadPress = (dir: 'up' | 'down' | 'left' | 'right') => {
    containerRef.current?.focus();
    dirKeysRef.current[dir] = true;
    setActiveDpad(prev => ({ ...prev, [dir]: true }));
    if (!lastKeyTimeRef.current) lastKeyTimeRef.current = performance.now();
  };

  const handleDpadRelease = (dir: 'up' | 'down' | 'left' | 'right') => {
    dirKeysRef.current[dir] = false;
    setActiveDpad(prev => ({ ...prev, [dir]: false }));
    const anyActive = dirKeysRef.current.up || dirKeysRef.current.down || dirKeysRef.current.left || dirKeysRef.current.right;
    if (!anyActive) lastKeyTimeRef.current = 0;
  };

  const handleAnswerPick = (choice: string) => {
    if (!challenge || selectedChoice !== null) return;
    sounds.stopSpeech();

    setSelectedChoice(choice);
    const correct = choice.trim().toLowerCase() === challenge.correct.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      sounds.playSuccess();
      awardCurrency(10, 2);
      setScoreStreak(prev => prev + 1);
      setShowCelebrationAnim(true);

      setTimeout(() => {
        if (!activeCabinet) return;
        const nextQ = GENERATE_ARCADE_CHALLENGE(activeCabinet);
        setChallenge(nextQ);
        setSelectedChoice(null);
        setIsCorrect(null);
        setShowCelebrationAnim(false);
        sounds.speak(nextQ.soundCue);
      }, 1200);
    } else {
      sounds.playError();
      sounds.speak(`Access Denied! Recalibrate and try again!`);
      setTimeout(() => {
        setSelectedChoice(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      className="relative w-full h-full flex flex-col justify-between select-none outline-none overflow-hidden"
    >
      {/* Top HUD */}
      <div 
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
          left: 'calc(env(safe-area-inset-left, 0px) + 8px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 8px)'
        }}
        className="absolute z-40 flex items-center justify-between pointer-events-none"
      >
        <button
          onClick={() => {
            sounds.stopSpeech();
            sounds.playStep();
            onBackToWorld();
          }}
          className="pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-fuchsia-300 border border-fuchsia-400/70 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-fuchsia-400/50 shadow-xl">
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-400" />
            <span className="text-xs sm:text-sm font-black text-fuchsia-200 font-display uppercase tracking-wide">
              Shellshore Arcade
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-fuchsia-300/80 font-medium hidden sm:block">
            Endless Cyber Phonics Arena
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md border border-fuchsia-400/60 text-fuchsia-300 text-[11px] sm:text-xs font-mono font-bold shadow-xl">
          <Sparkles className="w-3 h-3 text-fuchsia-400" />
          <span>{activeExplorer.name}</span>
        </div>
      </div>

      {/* Main Isometric Cyber Canvas */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none"
        style={{ backgroundColor: '#0d1527' }}
      >
        <img
          src={shellshoreBg}
          alt="Shellshore Arcade Canvas"
          className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none z-0"
        />

        {/* 25 Dedicated Landmark Icons */}
        {SHELLSHORE_25_GAMES.map((cab) => (
          <div
            key={cab.id}
            style={{ left: `${cab.x}%`, top: `${cab.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              launchCabinet(cab);
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 active:scale-95 group"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/90 hover:bg-fuchsia-950/90 border-2 border-fuchsia-400 hover:border-cyan-300 shadow-[0_0_15px_rgba(217,70,239,0.6)] flex items-center justify-center backdrop-blur-sm transition-all">
              <span className="text-sm sm:text-base">{cab.icon}</span>

              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 border border-fuchsia-400/80 px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <span className="text-[10px] font-black text-fuchsia-200">{cab.name}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Ground Shadow underneath Avatar */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: `translate(-50%, calc(-50% + 20px)) scale(${Math.max(0.35, 1 - jumpOffset / 60)})`,
            opacity: Math.max(0.2, 0.6 - jumpOffset / 70)
          }}
        >
          <div className="w-10 h-3 bg-black/60 rounded-full blur-[1px]" />
        </div>

        {/* Companion Guide (Kam or Celine) */}
        {(() => {
          const companionGuide = getCompanionGuide(activeExplorer);
          return (
            <div
              className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-100"
              style={{
                left: `${playerPos.x - (facing === 'left' ? -3.5 : 3.5)}%`,
                top: `${playerPos.y + 0.8}%`,
                transform: `translate(-50%, calc(-50% - ${jumpOffset * 0.9}px))`
              }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-fuchsia-400/60 px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
                <span className="text-[9px] font-bold text-amber-200">{companionGuide.name}</span>
              </div>
              <AvatarRenderer
                customization={companionGuide.customization}
                size={40}
                isWalking={isMoving}
                isRunning={isRunning}
                facing={facing}
                walkCycle={isJumping ? 1.5 : walkCycle}
                showPet={false}
              />
            </div>
          );
        })()}

        {/* Player Avatar */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
          style={{ 
            left: `${playerPos.x}%`, 
            top: `${playerPos.y}%`,
            transform: `translate(-50%, calc(-50% - ${jumpOffset}px))`
          }}
        >
          {targetPosRef.current && (
            <div className="absolute -inset-4 rounded-full border-2 border-fuchsia-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-fuchsia-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-fuchsia-300">{activeExplorer.name}</span>
          </div>

          <AvatarRenderer
            customization={activeExplorer.customization}
            size={52}
            isWalking={isMoving}
            isRunning={isRunning}
            facing={facing}
            walkCycle={isJumping ? 1.5 : walkCycle}
            showPet={true}
          />
        </div>

        {/* Controls with Jump Button */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
            left: 'calc(env(safe-area-inset-left, 0px) + 8px)'
          }}
          className="absolute z-40 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-fuchsia-600/50 shadow-2xl flex items-center gap-2 select-none pointer-events-auto touch-none"
        >
          <div className="flex flex-col items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('up')}
              onMouseUp={() => handleDpadRelease('up')}
              onTouchStart={(e) => { e.preventDefault(); handleDpadPress('up'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('up'); }}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.up ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300' : 'bg-slate-900 text-fuchsia-300 border-fuchsia-500/40'
              }`}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onMouseDown={() => handleDpadPress('left')}
                onMouseUp={() => handleDpadRelease('left')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('left'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('left'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.left ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300' : 'bg-slate-900 text-fuchsia-300 border-fuchsia-500/40'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onMouseDown={() => handleDpadPress('down')}
                onMouseUp={() => handleDpadRelease('down')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('down'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('down'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.down ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300' : 'bg-slate-900 text-fuchsia-300 border-fuchsia-500/40'
                }`}
              >
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onMouseDown={() => handleDpadPress('right')}
                onMouseUp={() => handleDpadRelease('right')}
                onTouchStart={(e) => { e.preventDefault(); handleDpadPress('right'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('right'); }}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                  activeDpad.right ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300' : 'bg-slate-900 text-fuchsia-300 border-fuchsia-500/40'
                }`}
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Arcade Jump Button */}
          <button
            onMouseDown={triggerArcadeJump}
            onTouchStart={(e) => { e.preventDefault(); triggerArcadeJump(); }}
            className={`h-16 sm:h-20 w-11 sm:w-14 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-black text-[9px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              isJumping
                ? 'bg-fuchsia-300 text-slate-950 border-white scale-95 shadow-[0_0_15px_rgba(217,70,239,0.8)]'
                : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.5)] active:scale-95'
            }`}
          >
            <ChevronsUp className="w-4 h-4 stroke-[3]" />
            <span>JUMP</span>
          </button>
        </div>
      </div>

      {/* Bottom Proximity Bar */}
      <div 
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 8px)',
          paddingRight: 'calc(env(safe-area-inset-right, 0px) + 8px)'
        }}
        className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-fuchsia-900/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2">
          {nearbyGame ? (
            <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-fuchsia-500/40">
              <span className="text-base sm:text-xl">{nearbyGame.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{nearbyGame.name}</span>
                  <span className="text-[10px] text-cyan-300">({nearbyGame.building})</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  launchCabinet(nearbyGame);
                }}
                className="ml-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-400 text-slate-950 text-xs font-black shadow cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1">
              <Footprints className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[11px] hidden xs:inline">Walk to any neon station for endless cyber phonics!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {SHELLSHORE_25_GAMES.slice(0, 8).map((g) => (
            <button
              key={g.id}
              onClick={() => {
                sounds.stopSpeech();
                playerPosRef.current = { x: g.x, y: g.y };
                setPlayerPos({ x: g.x, y: g.y });
                launchCabinet(g);
              }}
              className="px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-slate-900 hover:bg-fuchsia-950/60 text-slate-200 border border-fuchsia-500/30 whitespace-nowrap cursor-pointer"
            >
              {g.building}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE ENDLESS PLAYABLE MINI-GAME LOOP MODAL */}
      {activeCabinet && challenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-fuchsia-950/80 border-4 border-fuchsia-400 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-[0_0_60px_rgba(217,70,239,0.6)] animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCabinet.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-fuchsia-300 uppercase tracking-wide">
                    {activeCabinet.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{activeCabinet.skill}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-black animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>{scoreStreak} Streak</span>
                </div>

                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    setActiveCabinet(null);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer transition-colors"
                  title="Exit Cabinet"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {challenge.prompt}
              </p>

              <div className="inline-flex items-center gap-3 bg-fuchsia-500/20 border-2 border-fuchsia-400 px-6 py-3 rounded-2xl shadow-inner animate-bounce">
                <span className="text-2xl sm:text-3xl font-black text-fuchsia-200 font-display tracking-widest">
                  {challenge.target}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speak(challenge.soundCue)}
                  className="p-2 rounded-xl bg-fuchsia-400 hover:bg-fuchsia-300 text-slate-950 shadow-md cursor-pointer transition-transform hover:scale-115 active:scale-95"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {challenge.choices.map((choice) => {
                const isSelected = selectedChoice === choice;
                let btnStyle = 'bg-slate-950 hover:bg-fuchsia-950/70 border-slate-700 text-slate-200';

                if (selectedChoice !== null) {
                  if (choice.trim().toLowerCase() === challenge.correct.trim().toLowerCase()) {
                    btnStyle = 'bg-cyan-600 border-cyan-400 text-white font-black scale-105 shadow-[0_0_20px_rgba(6,182,212,0.7)]';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-900 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950 border-slate-800 text-slate-600 opacity-40';
                  }
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswerPick(choice)}
                    disabled={selectedChoice !== null}
                    className={`py-4 sm:py-5 px-3 rounded-2xl border-2 text-base sm:text-xl font-black font-display tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${btnStyle}`}
                  >
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>

            {showCelebrationAnim && (
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-black animate-scale-up flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Cyber Match Decoded! +10 Tokens · Streak +1!</span>
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                🕹️ Mario-Style Endless Play (Auto-replaying)
              </span>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  setActiveCabinet(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Exit to Arcade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
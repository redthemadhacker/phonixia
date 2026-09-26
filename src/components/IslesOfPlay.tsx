import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Play, Sparkles, Gamepad2, Footprints, 
  CheckCircle2, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, 
  ArrowRight, RotateCcw, Volume2, Flame, Award, X, ChevronsUp
} from 'lucide-react';
import islesBg from '../../isles.jpeg';

interface IslesOfPlayProps {
  onBackToWorld: () => void;
}

export interface IsleMinigame {
  id: string;
  name: string;
  building: string;
  skill: string;
  icon: string;
  howToPlay: string;
  x: number;
  y: number;
}

export const ISLES_25_GAMES: IsleMinigame[] = [
  { id: 'iop-1', name: 'Tower Spire Climber', building: 'Ancient Rune Spire', skill: 'Letter Sounds', icon: '🗼', howToPlay: 'Tap the letter that makes the target sound to climb higher!', x: 14, y: 15 },
  { id: 'iop-2', name: 'Spire Stone Gate', building: 'Spire Entrance', skill: 'Initial Blends', icon: '🚪', howToPlay: 'Unlock the gate by matching the beginning blend sound.', x: 19, y: 32 },
  { id: 'iop-3', name: 'Hedge Maze Altar', building: 'Stone Obelisk Altar', skill: 'Sight Words', icon: '🗿', howToPlay: 'Match the glowing sight word to advance through the hedges.', x: 30, y: 20 },
  { id: 'iop-4', name: 'Maze Hedge Entrance', building: 'Maze Archway', skill: 'Word Families', icon: '🌿', howToPlay: 'Choose the rhyming word family to open the pathway.', x: 38, y: 27 },
  { id: 'iop-5', name: 'Grand Mountain Library', building: 'Carved Mountain Archives', skill: 'Story Blending', icon: '🏛️', howToPlay: 'Blend simple phonemes together into complete words.', x: 50, y: 19 },
  { id: 'iop-6', name: 'Mountain Stream Flume', building: 'Library Aqueduct', skill: 'Vowel Sounds', icon: '🌊', howToPlay: 'Sort short vowels to guide the stream boats down the flume.', x: 58, y: 26 },
  { id: 'iop-7', name: 'Colosseum Rhyme Arena', building: 'Rooftop Amphitheater', skill: 'Rhyme Battles', icon: '🎪', howToPlay: 'Pick the rhyming word to win cheers from the crowd.', x: 69, y: 19 },
  { id: 'iop-8', name: 'Crane Construction Deck', building: 'Upper Crane', skill: 'Consonant Blocks', icon: '🏗️', howToPlay: 'Hoist the consonant blocks into position.', x: 63, y: 11 },
  { id: 'iop-9', name: 'Stargazer Observatory', building: 'Telescope Tower', skill: 'Alphabet Stars', icon: '🔭', howToPlay: 'Connect celestial letters in alphabetical order.', x: 80, y: 20 },
  { id: 'iop-10', name: 'Windmill Clockwork Shrine', building: 'Clockwork Shrine', skill: 'Digraph Gears', icon: '⚙️', howToPlay: 'Spin the clockwork gears with SH, CH, and TH words.', x: 88, y: 24 },
  { id: 'iop-11', name: 'Lower Garden Labyrinth', building: 'Garden Maze', skill: 'Tricky Words', icon: '🌳', howToPlay: 'Spot the tricky sight word hidden in the garden hedges.', x: 12, y: 52 },
  { id: 'iop-12', name: 'Labyrinth Steps', building: 'Maze Stone Stairs', skill: 'Double Letters', icon: '🪜', howToPlay: 'Hop up the stairs by spelling double consonants.', x: 6, y: 61 },
  { id: 'iop-13', name: 'Letter Fleet Regatta', building: 'Canal Rowboats', skill: 'Alphabet Order', icon: '⛵', howToPlay: 'Guide the canal boats by picking the next letter in line.', x: 33, y: 40 },
  { id: 'iop-14', name: 'Canal Aqueduct Gate', building: 'Stone Bridge Arch', skill: 'Silent E', icon: '🌉', howToPlay: 'Turn short vowels into long vowels using magic Silent E.', x: 26, y: 48 },
  { id: 'iop-15', name: 'Wishing Well Echo', building: 'Central Stone Well', skill: 'Phonemic Awareness', icon: '🪣', howToPlay: 'Listen to the echo in the well and find the matching sound.', x: 49, y: 48 },
  { id: 'iop-16', name: 'Center Island Grove', building: 'Wishing Well Bridge', skill: 'Color Words', icon: '🌲', howToPlay: 'Cross the bridge by reading colorful word stones.', x: 45, y: 53 },
  { id: 'iop-17', name: 'Covered Canopy Stage', building: 'Canopy Tent', skill: 'Action Verbs', icon: '⛺', howToPlay: 'Pick the action word to act out on the island stage.', x: 63, y: 37 },
  { id: 'iop-18', name: 'Canopy Footbridge', building: 'Wooden Footbridge', skill: 'Compound Words', icon: '🪵', howToPlay: 'Join two small words together to build a compound bridge.', x: 60, y: 42 },
  { id: 'iop-19', name: 'Watermill Gear Shop', building: 'Industrial Mill', skill: 'R-Blends', icon: '🏭', howToPlay: 'Power the watermill wheel using words that begin with BR, TR, and GR.', x: 89, y: 44 },
  { id: 'iop-20', name: 'Smokestack Steam Pipes', building: 'Steam Boiler', skill: 'Ending Consonants', icon: '💨', howToPlay: 'Seal the steam valves with the matching ending consonant.', x: 80, y: 45 },
  { id: 'iop-21', name: 'Timber Arcade Cabinets', building: 'Arcade Cabinets', skill: 'CVC Words', icon: '🕹️', howToPlay: 'Play classic island arcade cabinets to build 3-letter CVC words.', x: 13, y: 76 },
  { id: 'iop-22', name: 'Arcade Barrel Porch', building: 'Arcade Entryway', skill: 'Word Family -at', icon: '🪵', howToPlay: 'Stack barrels on the porch that rhyme with Cat, Hat, and Bat.', x: 21, y: 83 },
  { id: 'iop-23', name: 'Giant Storybook Page', building: 'Grand Open Book', skill: 'Sentence Reading', icon: '📖', howToPlay: 'Read sentences printed across the giant open storybook.', x: 42, y: 77 },
  { id: 'iop-24', name: 'Storybook Crane Pier', building: 'Harbor Dock & Boat', skill: 'First Letter Sounds', icon: '⚓', howToPlay: 'Reel in letters from the water with the harbor crane.', x: 53, y: 89 },
  { id: 'iop-25', name: 'Treasure Chest Cavern', building: 'Rocky Mountain Grotto', skill: 'Phonics Fluency', icon: '💎', howToPlay: 'Unlock the glowing chest inside the grotto with speed reading.', x: 92, y: 82 }
];

interface DynamicChallenge {
  prompt: string;
  target: string;
  soundCue: string;
  choices: string[];
  correct: string;
  fact: string;
}

const GENERATE_ISLE_CHALLENGE = (game: IsleMinigame): DynamicChallenge => {
  const letters = ['B', 'M', 'S', 'T', 'P', 'R', 'F', 'D', 'C', 'N', 'L', 'G', 'W', 'H', 'K'];
  const cvcs = [
    { word: 'CAT', cue: '/c/ /a/ /t/', dist: ['COT', 'CUT', 'BAT'] },
    { word: 'DOG', cue: '/d/ /o/ /g/', dist: ['DIG', 'DUG', 'LOG'] },
    { word: 'SUN', cue: '/s/ /u/ /n/', dist: ['SIN', 'RUN', 'SIT'] },
    { word: 'BED', cue: '/b/ /e/ /d/', dist: ['BAD', 'BUD', 'BAT'] },
    { word: 'PIG', cue: '/p/ /i/ /g/', dist: ['PUG', 'PEG', 'BIG'] },
    { word: 'CUP', cue: '/c/ /u/ /p/', dist: ['CAP', 'COP', 'MUG'] },
    { word: 'FOX', cue: '/f/ /o/ /x/', dist: ['FIX', 'BOX', 'FAX'] }
  ];
  const rhymes = [
    { target: 'PAN', rh: 'FAN', dist: ['CAT', 'PIG', 'DOG'] },
    { target: 'BAT', rh: 'HAT', dist: ['SUN', 'CUP', 'LOG'] },
    { target: 'PIG', rh: 'WIG', dist: ['PEN', 'BED', 'RUN'] },
    { target: 'BED', rh: 'RED', dist: ['BAG', 'NET', 'HOT'] },
    { target: 'HOP', rh: 'TOP', dist: ['SIT', 'MAN', 'CUP'] }
  ];
  const sights = ['THE', 'AND', 'YOU', 'SAID', 'HAVE', 'LOOK', 'COME', 'SOME', 'WITH', 'THEY', 'HERE', 'PLAY'];

  if (game.skill.includes('Letter') || game.skill.includes('Alphabet') || game.skill.includes('Consonant')) {
    const l = letters[Math.floor(Math.random() * letters.length)];
    const otherLetters = letters.filter(x => x !== l).sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      prompt: `Target Sound Challenge:`,
      target: `/${l.toLowerCase()}/`,
      soundCue: `Which letter makes the sound /${l.toLowerCase()}/?`,
      choices: [l, ...otherLetters].sort(() => Math.random() - 0.5),
      correct: l,
      fact: `Letter ${l} makes the sound /${l.toLowerCase()}/!`
    };
  }

  if (game.skill.includes('Rhyme') || game.skill.includes('-at')) {
    const r = rhymes[Math.floor(Math.random() * rhymes.length)];
    return {
      prompt: `Rhyme Battle! Find the match for:`,
      target: r.target,
      soundCue: `Which word rhymes with ${r.target}?`,
      choices: [r.rh, ...r.dist].sort(() => Math.random() - 0.5),
      correct: r.rh,
      fact: `${r.target} and ${r.rh} both rhyme!`
    };
  }

  if (game.skill.includes('Sight') || game.skill.includes('Tricky')) {
    const s = sights[Math.floor(Math.random() * sights.length)];
    const fake1 = s.slice(0, -1) + 'E';
    const fake2 = s.split('').reverse().join('');
    const fake3 = 'RUN';
    return {
      prompt: `Sight Word Flash! Tap the word:`,
      target: s,
      soundCue: `Can you spot the sight word: ${s}?`,
      choices: [s, fake1, fake2, fake3].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4).sort(() => Math.random() - 0.5),
      correct: s,
      fact: `Great reading! "${s}" is an essential sight word.`
    };
  }

  const c = cvcs[Math.floor(Math.random() * cvcs.length)];
  return {
    prompt: `Sound Blend Machine! Combine:`,
    target: c.cue,
    soundCue: `Blend these sounds: ${c.cue}. What word is it?`,
    choices: [c.word, ...c.dist].sort(() => Math.random() - 0.5),
    correct: c.word,
    fact: `${c.cue} blends together to make ${c.word}!`
  };
};

export const IslesOfPlay: React.FC<IslesOfPlayProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  const playerPosRef = useRef<{ x: number; y: number }>({ x: 42, y: 68 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 42, y: 68 });
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);

  const [nearbyGame, setNearbyGame] = useState<IsleMinigame | null>(null);
  const [activeGame, setActiveGame] = useState<IsleMinigame | null>(null);
  const [challenge, setChallenge] = useState<DynamicChallenge | null>(null);
  const [scoreStreak, setScoreStreak] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebrationAnim, setShowCelebrationAnim] = useState(false);

  // Jump physics on island map
  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  const triggerIsleJump = useCallback(() => {
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

  const launchMinigame = useCallback((game: IsleMinigame) => {
    sounds.stopSpeech();
    sounds.playStep();
    sounds.speak(`Entering ${game.name}! Tap the answers to play!`);
    const firstChallenge = GENERATE_ISLE_CHALLENGE(game);
    setChallenge(firstChallenge);
    setActiveGame(game);
    setScoreStreak(0);
    setSelectedChoice(null);
    setIsCorrect(null);
    setShowCelebrationAnim(false);

    setTimeout(() => {
      sounds.speak(firstChallenge.soundCue);
    }, 300);
  }, []);

  const checkProximity = useCallback((x: number, y: number) => {
    let closest: IsleMinigame | null = null;
    let minDistance = 5.0;

    ISLES_25_GAMES.forEach((game) => {
      const dist = Math.hypot(game.x - x, game.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = game;
      }
    });

    setNearbyGame(closest);

    const now = Date.now();
    if (closest && minDistance < 3.2 && now > enterCooldown.current && !activeGame) {
      const target = closest as IsleMinigame;
      if (lastEnteredGameId.current !== target.id) {
        lastEnteredGameId.current = target.id;
        enterCooldown.current = now + 2000;
        launchMinigame(target);
      }
    } else if (!closest || minDistance > 5.5) {
      lastEnteredGameId.current = null;
    }
  }, [launchMinigame, activeGame]);

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
        triggerIsleJump();
      }

      if ((k === 'e' || k === 'enter' || code === 'KeyE') && nearbyGame && !activeGame) {
        matched = true;
        launchMinigame(nearbyGame);
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
  }, [nearbyGame, activeGame, launchMinigame]);

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
      awardCurrency(5, 1);
      setScoreStreak(prev => prev + 1);
      setShowCelebrationAnim(true);

      setTimeout(() => {
        if (!activeGame) return;
        const nextQ = GENERATE_ISLE_CHALLENGE(activeGame);
        setChallenge(nextQ);
        setSelectedChoice(null);
        setIsCorrect(null);
        setShowCelebrationAnim(false);
        sounds.speak(nextQ.soundCue);
      }, 1200);
    } else {
      sounds.playError();
      sounds.speak(`Oops! Try that sound again!`);
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
          className="pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-teal-300 border border-teal-400/70 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-teal-400/50 shadow-xl">
          <div className="flex items-center justify-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
            <span className="text-xs sm:text-sm font-black text-teal-200 font-display uppercase tracking-wide">
              Isles of Play
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-teal-300/80 font-medium hidden sm:block">
            Endless Phonics Arcade Sandbox
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-slate-950/85 backdrop-blur-md border border-teal-400/60 text-teal-300 text-[11px] sm:text-xs font-mono font-bold shadow-xl">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>{activeExplorer.name}</span>
        </div>
      </div>

      {/* Main Isometric World Canvas */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none"
        style={{ backgroundColor: '#1a334f' }}
      >
        <img
          src={islesBg}
          alt="Isles of Play Canvas"
          className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none z-0"
        />

        {/* 25 Landmark Icons */}
        {ISLES_25_GAMES.map((game) => (
          <div
            key={game.id}
            style={{ left: `${game.x}%`, top: `${game.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              launchMinigame(game);
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 active:scale-95 group"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/90 hover:bg-teal-950/90 border-2 border-teal-400 hover:border-amber-300 shadow-[0_0_15px_rgba(20,184,166,0.6)] flex items-center justify-center backdrop-blur-sm transition-all">
              <span className="text-sm sm:text-base">{game.icon}</span>

              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 border border-teal-400/80 px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <span className="text-[10px] font-black text-teal-200">{game.name}</span>
              </div>
            </div>
          </div>
        ))}

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
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-teal-400/60 px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
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
            <div className="absolute -inset-4 rounded-full border-2 border-teal-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-teal-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-teal-300">{activeExplorer.name}</span>
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

        {/* Controls with Arcade Jump Button */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
            left: 'calc(env(safe-area-inset-left, 0px) + 8px)'
          }}
          className="absolute z-40 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-teal-600/50 shadow-2xl flex items-center gap-2 select-none pointer-events-auto touch-none"
        >
          <div className="flex flex-col items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('up')}
              onMouseUp={() => handleDpadRelease('up')}
              onTouchStart={(e) => { e.preventDefault(); handleDpadPress('up'); }}
              onTouchEnd={(e) => { e.preventDefault(); handleDpadRelease('up'); }}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.up ? 'bg-teal-400 text-slate-950 border-teal-300' : 'bg-slate-900 text-teal-300 border-teal-500/40'
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
                  activeDpad.left ? 'bg-teal-400 text-slate-950 border-teal-300' : 'bg-slate-900 text-teal-300 border-teal-500/40'
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
                  activeDpad.down ? 'bg-teal-400 text-slate-950 border-teal-300' : 'bg-slate-900 text-teal-300 border-teal-500/40'
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
                  activeDpad.right ? 'bg-teal-400 text-slate-950 border-teal-300' : 'bg-slate-900 text-teal-300 border-teal-500/40'
                }`}
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Arcade Jump Button */}
          <button
            onMouseDown={triggerIsleJump}
            onTouchStart={(e) => { e.preventDefault(); triggerIsleJump(); }}
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] tracking-wider transition-all cursor-pointer shadow-lg border-2 ${
              isJumping
                ? 'bg-gradient-to-t from-teal-400 to-amber-300 text-slate-950 border-white scale-95 shadow-[0_0_20px_rgba(20,184,166,0.8)]'
                : 'bg-gradient-to-t from-teal-600 via-teal-500 to-teal-400 hover:from-teal-500 hover:to-teal-300 text-slate-950 border-teal-200 shadow-[0_4px_0_rgba(15,118,110,1)] active:scale-95'
            }`}
          >
            <ChevronsUp className="w-5 h-5 stroke-[3]" />
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
        className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-teal-900/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-2">
          {nearbyGame ? (
            <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-teal-500/40">
              <span className="text-base sm:text-xl">{nearbyGame.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{nearbyGame.name}</span>
                  <span className="text-[10px] text-teal-400">({nearbyGame.building})</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  launchMinigame(nearbyGame);
                }}
                className="ml-1 px-2.5 py-1 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black shadow cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1">
              <Footprints className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] hidden xs:inline">Walk to any building to play endless phonics!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {ISLES_25_GAMES.slice(0, 8).map((g) => (
            <button
              key={g.id}
              onClick={() => {
                sounds.stopSpeech();
                playerPosRef.current = { x: g.x, y: g.y };
                setPlayerPos({ x: g.x, y: g.y });
                launchMinigame(g);
              }}
              className="px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg bg-slate-900 hover:bg-teal-950/60 text-slate-200 border border-teal-500/30 whitespace-nowrap cursor-pointer"
            >
              {g.building}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE ENDLESS PLAYABLE MINI-GAME LOOP MODAL */}
      {activeGame && challenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/80 border-4 border-teal-400 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-[0_0_60px_rgba(20,184,166,0.6)] animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeGame.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-teal-300 uppercase tracking-wide">
                    {activeGame.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{activeGame.skill}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-black animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{scoreStreak} Streak</span>
                </div>

                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    setActiveGame(null);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer transition-colors"
                  title="Exit Minigame"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {challenge.prompt}
              </p>

              <div className="inline-flex items-center gap-3 bg-teal-500/20 border-2 border-teal-400 px-6 py-3 rounded-2xl shadow-inner animate-bounce">
                <span className="text-2xl sm:text-3xl font-black text-teal-200 font-display tracking-widest">
                  {challenge.target}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speak(challenge.soundCue)}
                  className="p-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md cursor-pointer transition-transform hover:scale-115 active:scale-95"
                  title="Listen"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {challenge.choices.map((choice) => {
                const isSelected = selectedChoice === choice;
                let btnStyle = 'bg-slate-950 hover:bg-teal-950/70 border-slate-700 text-slate-200';

                if (selectedChoice !== null) {
                  if (choice.trim().toLowerCase() === challenge.correct.trim().toLowerCase()) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black scale-105 shadow-[0_0_20px_rgba(16,185,129,0.7)]';
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
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black animate-scale-up flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Correct! +5 Coins · Keep the streak going!</span>
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                🎮 Mario-Style Endless Play (Auto-replaying)
              </span>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  setActiveGame(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Exit to Island
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
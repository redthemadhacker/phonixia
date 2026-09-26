import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Volume2, Flame, X, CheckCircle2, 
  Coins, Sparkles, Star, Play, ChevronsUp, Footprints,
  ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight
} from 'lucide-react';
import islesBg from '../../isles.jpeg';

interface IslesOfPlayProps {
  onBackToWorld: () => void;
}

export interface IsleMinigame {
  id: string;
  gameNum: number;
  name: string;
  building: string;
  skill: string;
  icon: string;
  howToPlay: string;
  targetPhoneme: string;
  soundCue: string;
  choices: string[];
  correct: string;
  fact: string;
  x: number;
  y: number;
}

export const ISLES_25_GAMES: IsleMinigame[] = [
  { id: 'iop-1', gameNum: 1, name: 'Tower Spire Climber', building: 'Ancient Rune Spire', skill: 'Pure /f/ /ɒ/ /ks/ Segmenting', icon: '🗼', howToPlay: 'Listen to the pure isolated sounds: fff - ah - ksss. Which word forms?', targetPhoneme: 'fff / ah / ksss', soundCue: 'fff - ah - ksss', choices: ['FOX', 'BOX', 'SIX', 'FIX'], correct: 'FOX', fact: 'fff, ah, and ksss blend together cleanly to spell fox!', x: 14, y: 15 },
  { id: 'iop-2', gameNum: 2, name: 'Spire Stone Gate', building: 'Spire Entrance', skill: 'Initial Stop /b/', icon: '🚪', howToPlay: 'Tap the word starting with the clean, unvoiced stop /b/!', targetPhoneme: '/b/', soundCue: 'b', choices: ['BED', 'RED', 'FED', 'WED'], correct: 'BED', fact: 'The lips press together to release the crisp sound /b/ in bed!', x: 19, y: 32 },
  { id: 'iop-3', gameNum: 3, name: 'Hedge Maze Altar', building: 'Stone Obelisk Altar', skill: 'Short Vowel /æ/', icon: '🗿', howToPlay: 'Locate the ancient rune with the open short vowel sound /æ/!', targetPhoneme: '/æ/', soundCue: 'aaa as in cat', choices: ['CAT', 'COT', 'CUT', 'CIT'], correct: 'CAT', fact: '/æ/ is the bright short vowel at the center of cat!', x: 30, y: 20 },
  { id: 'iop-4', gameNum: 4, name: 'Maze Hedge Entrance', building: 'Maze Archway', skill: 'Ending Stop /t/', icon: '🌿', howToPlay: 'Pick the hedge doorway ending with the crisp unvoiced stop /t/!', targetPhoneme: '/t/', soundCue: 't', choices: ['BAT', 'BAG', 'BAD', 'BAN'], correct: 'BAT', fact: 'The tongue taps behind the teeth to produce the crisp ending /t/ in bat!', x: 38, y: 27 },
  { id: 'iop-5', gameNum: 5, name: 'Grand Mountain Library', building: 'Carved Mountain Archives', skill: 'Continuous Nasal /m/', icon: '🏛️', howToPlay: 'Listen to the humming sound /m/. Which word begins with this sound?', targetPhoneme: '/m/', soundCue: 'mmm', choices: ['MUG', 'BUG', 'RUG', 'TUG'], correct: 'MUG', fact: 'The sound /m/ is a continuous hum that starts mug!', x: 50, y: 19 },
  { id: 'iop-6', gameNum: 6, name: 'Mountain Stream Flume', building: 'Library Aqueduct', skill: 'Short Mid Vowel /ɛ/', icon: '🌊', howToPlay: 'Steer the flume boat through the short vowel /ɛ/ sound!', targetPhoneme: '/ɛ/', soundCue: 'eh as in pen', choices: ['PEN', 'PAN', 'PIN', 'PUN'], correct: 'PEN', fact: '/ɛ/ is the relaxed mid vowel in pen!', x: 58, y: 26 },
  { id: 'iop-7', gameNum: 7, name: 'Colosseum Rhyme Arena', building: 'Rooftop Amphitheater', skill: 'Phonemic Rhyme /æn/', icon: '🎪', howToPlay: 'Pick the contestant that shares the exact rhyming phonemes with pan!', targetPhoneme: '-an (/æn/)', soundCue: 'Which word rhymes with pan?', choices: ['FAN', 'FIN', 'FUN', 'FAT'], correct: 'FAN', fact: 'Pan and fan both end in the exact phoneme chunk /æn/!', x: 69, y: 19 },
  { id: 'iop-8', gameNum: 8, name: 'Crane Construction Deck', building: 'Upper Crane', skill: 'Voiced Stop /d/', icon: '🏗️', howToPlay: 'Hoist the beam ending with the voiced stop /d/!', targetPhoneme: '/d/', soundCue: 'd', choices: ['RED', 'REN', 'RET', 'REM'], correct: 'RED', fact: 'The vocal cords vibrate on the ending stop sound /d/ in red!', x: 63, y: 11 },
  { id: 'iop-9', gameNum: 9, name: 'Stargazer Observatory', building: 'Telescope Tower', skill: 'Fricative Hiss /s/', icon: '🔭', howToPlay: 'Align the telescope to the star shining with the hissing fricative /s/!', targetPhoneme: '/s/', soundCue: 'sss', choices: ['SUN', 'RUN', 'BUN', 'FUN'], correct: 'SUN', fact: '/s/ is an unvoiced continuous hiss that leads sun!', x: 80, y: 20 },
  { id: 'iop-10', gameNum: 10, name: 'Windmill Clockwork Shrine', building: 'Clockwork Shrine', skill: 'Digraph /ʃ/ (sh)', icon: '⚙️', howToPlay: 'Turn the gear bearing the quiet voiceless fricative /ʃ/!', targetPhoneme: '/ʃ/', soundCue: 'shhh', choices: ['SHIP', 'CHIP', 'WHIP', 'TRIP'], correct: 'SHIP', fact: 'Letters S and H join together to create the quiet sound /ʃ/!', x: 88, y: 24 },
  { id: 'iop-11', gameNum: 11, name: 'Lower Garden Labyrinth', building: 'Garden Maze', skill: 'Short Close Vowel /ɪ/', icon: '🌳', howToPlay: 'Follow the garden path with the short close vowel sound /ɪ/!', targetPhoneme: '/ɪ/', soundCue: 'ih as in pig', choices: ['PIG', 'PUG', 'PEG', 'PAG'], correct: 'PIG', fact: '/ɪ/ is the quick short vowel sound heard inside pig!', x: 12, y: 52 },
  { id: 'iop-12', gameNum: 12, name: 'Labyrinth Steps', building: 'Maze Stone Stairs', skill: 'Velar Stop /ɡ/', icon: '🪜', howToPlay: 'Hop up the step ending with the voiced velar sound /ɡ/!', targetPhoneme: '/ɡ/', soundCue: 'g', choices: ['DOG', 'DOT', 'DON', 'DOB'], correct: 'DOG', fact: 'The back of the tongue taps the soft palate to make /ɡ/ in dog!', x: 6, y: 61 },
  { id: 'iop-13', gameNum: 13, name: 'Letter Fleet Regatta', building: 'Canal Rowboats', skill: 'Alveolar Liquid /l/', icon: '⛵', howToPlay: 'Row the boat starting with the continuous liquid /l/ sound!', targetPhoneme: '/l/', soundCue: 'lll', choices: ['LOG', 'FOG', 'BOG', 'JOG'], correct: 'LOG', fact: 'The tongue touches the roof of the mouth for /l/ in log!', x: 33, y: 40 },
  { id: 'iop-14', gameNum: 14, name: 'Canal Aqueduct Gate', building: 'Stone Bridge Arch', skill: 'Magic Silent E (a_e)', icon: '🌉', howToPlay: 'Open the gate by matching the long vowel /eɪ/ sound!', targetPhoneme: '/eɪ/', soundCue: 'long a as in cake', choices: ['CAKE', 'CAN', 'CAP', 'CAT'], correct: 'CAKE', fact: 'Magic Silent E reaches over the consonant to make the vowel say /eɪ/!', x: 26, y: 48 },
  { id: 'iop-15', gameNum: 15, name: 'Wishing Well Echo', building: 'Central Stone Well', skill: 'Pure Segment Blend: d-o-g', icon: '🪣', howToPlay: 'Listen to the well echo: /d/ /ɒ/ /ɡ/. What word forms?', targetPhoneme: '/d/ /ɒ/ /ɡ/', soundCue: 'd - ah - g', choices: ['DOG', 'DIG', 'DUG', 'DOT'], correct: 'DOG', fact: '/d/ /ɒ/ /ɡ/ blends together into the word dog!', x: 49, y: 48 },
  { id: 'iop-16', gameNum: 16, name: 'Center Island Grove', building: 'Wishing Well Bridge', skill: 'Affricate Digraph /tʃ/ (ch)', icon: '🌲', howToPlay: 'Cross the bridge stone marked with the crisp affricate /tʃ/!', targetPhoneme: '/tʃ/', soundCue: 'ch as in chin', choices: ['CHIN', 'SHIN', 'THIN', 'WIN'], correct: 'CHIN', fact: 'Letters C and H combine to make the stop-fricative /tʃ/ in chin!', x: 45, y: 53 },
  { id: 'iop-17', gameNum: 17, name: 'Covered Canopy Stage', building: 'Canopy Tent', skill: 'Glided /w/', icon: '⛺', howToPlay: 'Perform on stage with the word starting with the glide /w/!', targetPhoneme: '/w/', soundCue: 'w', choices: ['WET', 'VET', 'MET', 'SET'], correct: 'WET', fact: 'The rounded lips glide forward to produce /w/ in wet!', x: 63, y: 37 },
  { id: 'iop-18', gameNum: 18, name: 'Canopy Footbridge', building: 'Wooden Footbridge', skill: 'Nasal Stop /n/', icon: '🪵', howToPlay: 'Step onto the footbridge plank ending with the alveolar nasal /n/!', targetPhoneme: '/n/', soundCue: 'nnn', choices: ['SUN', 'SUB', 'SIT', 'SUP'], correct: 'SUN', fact: 'Air resonates through the nasal cavity to end sun with /n/!', x: 60, y: 42 },
  { id: 'iop-19', gameNum: 19, name: 'Watermill Gear Shop', building: 'Industrial Mill', skill: 'Initial Blend /br/', icon: '🏭', howToPlay: 'Power the mill cog that starts with the blended cluster /br/!', targetPhoneme: '/br/', soundCue: 'b-r', choices: ['BRAG', 'CRAG', 'DRAG', 'RAG'], correct: 'BRAG', fact: '/b/ and /r/ blend together smoothly to start brag!', x: 89, y: 44 },
  { id: 'iop-20', gameNum: 20, name: 'Smokestack Steam Pipes', building: 'Steam Boiler', skill: 'Bilabial Plosive /p/', icon: '💨', howToPlay: 'Seal the steam pipe that ends with the unvoiced pop /p/!', targetPhoneme: '/p/', soundCue: 'p', choices: ['CUP', 'CUB', 'CUT', 'CUD'], correct: 'CUP', fact: 'A quick puff of air released from closed lips ends cup with /p/!', x: 80, y: 45 },
  { id: 'iop-21', gameNum: 21, name: 'Timber Arcade Cabinets', building: 'Arcade Cabinets', skill: 'Pure Segment Blend: c-a-t', icon: '🕹️', howToPlay: 'Blend the sounds: /k/ /æ/ /t/. What word does the arcade build?', targetPhoneme: '/k/ /æ/ /t/', soundCue: 'k - ah - t', choices: ['CAT', 'COT', 'CUT', 'BAT'], correct: 'CAT', fact: '/k/ /æ/ /t/ blends together into the word cat!', x: 13, y: 76 },
  { id: 'iop-22', gameNum: 22, name: 'Arcade Barrel Porch', building: 'Arcade Entryway', skill: 'Rhyme Chunk /-æt/', icon: '🪵', howToPlay: 'Stack the porch barrel that rhymes with bat!', targetPhoneme: '-at (/-æt/)', soundCue: 'Which word rhymes with bat?', choices: ['HAT', 'HOT', 'HUT', 'HIT'], correct: 'HAT', fact: 'Bat and hat rhyme with the exact same ending chunk /-æt/!', x: 21, y: 83 },
  { id: 'iop-23', gameNum: 23, name: 'Giant Storybook Page', building: 'Grand Open Book', skill: 'Central Short Vowel /ʌ/', icon: '📖', howToPlay: 'Read the storybook word that contains the open-mid vowel /ʌ/!', targetPhoneme: '/ʌ/', soundCue: 'uh as in cup and sun', choices: ['CUP', 'CAP', 'COP', 'CLIP'], correct: 'CUP', fact: '/ʌ/ is the open-mid short vowel sound inside cup!', x: 42, y: 77 },
  { id: 'iop-24', gameNum: 24, name: 'Storybook Crane Pier', building: 'Harbor Dock & Boat', skill: 'Initial Labiodental /f/', icon: '⚓', howToPlay: 'Reel in the cargo box starting with the gentle friction sound /f/!', targetPhoneme: '/f/', soundCue: 'fff', choices: ['FISH', 'WISH', 'DISH', 'SWISH'], correct: 'FISH', fact: 'Top teeth touch bottom lip to create the quiet friction /f/ in fish!', x: 53, y: 89 },
  { id: 'iop-25', gameNum: 25, name: 'Treasure Chest Cavern', building: 'Rocky Mountain Grotto', skill: 'Pure Segment Blend: p-i-g', icon: '💎', howToPlay: 'Unlock the crystal chest by blending: /p/ /ɪ/ /ɡ/!', targetPhoneme: '/p/ /ɪ/ /ɡ/', soundCue: 'p - ih - g', choices: ['PIG', 'PUG', 'PEG', 'BIG'], correct: 'PIG', fact: '/p/ /ɪ/ /ɡ/ blends together to unlock pig!', x: 92, y: 82 }
];

export const IslesOfPlay: React.FC<IslesOfPlayProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);
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
  const [scoreStreak, setScoreStreak] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [jumpOffset, setJumpOffset] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

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

  const launchMinigame = useCallback((game: IsleMinigame) => {
    sounds.stopSpeech();
    sounds.playJump();
    setActiveGame(game);
    setSelectedChoice(null);
    setIsAnswered(false);
    setIsCorrect(false);

    setTimeout(() => {
      sounds.speakPhonicsSlow(game.soundCue);
    }, 250);
  }, []);

  const checkProximity = useCallback((x: number, y: number) => {
    let closest: IsleMinigame | null = null;
    let minDistance = 6.0;

    ISLES_25_GAMES.forEach((game) => {
      const dist = Math.hypot(game.x - x, game.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = game;
      }
    });

    setNearbyGame(closest);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') {
        dirKeysRef.current.up = true;
        setActiveDpad(p => ({ ...p, up: true }));
      }
      if (k === 'arrowdown' || k === 's') {
        dirKeysRef.current.down = true;
        setActiveDpad(p => ({ ...p, down: true }));
      }
      if (k === 'arrowleft' || k === 'a') {
        dirKeysRef.current.left = true;
        setActiveDpad(p => ({ ...p, left: true }));
      }
      if (k === 'arrowright' || k === 'd') {
        dirKeysRef.current.right = true;
        setActiveDpad(p => ({ ...p, right: true }));
      }
      if (k === ' ' || k === 'tab') {
        e.preventDefault();
        triggerIsleJump();
      }
      if ((k === 'e' || k === 'enter') && nearbyGame && !activeGame) {
        launchMinigame(nearbyGame);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') {
        dirKeysRef.current.up = false;
        setActiveDpad(p => ({ ...p, up: false }));
      }
      if (k === 'arrowdown' || k === 's') {
        dirKeysRef.current.down = false;
        setActiveDpad(p => ({ ...p, down: false }));
      }
      if (k === 'arrowleft' || k === 'a') {
        dirKeysRef.current.left = false;
        setActiveDpad(p => ({ ...p, left: false }));
      }
      if (k === 'arrowright' || k === 'd') {
        dirKeysRef.current.right = false;
        setActiveDpad(p => ({ ...p, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyGame, activeGame, launchMinigame, triggerIsleJump]);

  useEffect(() => {
    let prevTime = performance.now();
    let frameId: number;

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

      const baseSpeed = 24;
      let newX = playerPosRef.current.x;
      let newY = playerPosRef.current.y;
      let moving = false;

      if (dx !== 0 || dy !== 0) {
        targetPosRef.current = null;
        const len = Math.hypot(dx, dy);
        setFacing(Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        newX = Math.max(6, Math.min(94, playerPosRef.current.x + (dx / len) * baseSpeed * dt));
        newY = Math.max(10, Math.min(90, playerPosRef.current.y + (dy / len) * baseSpeed * dt));
        moving = true;
      } else if (targetPosRef.current) {
        const target = targetPosRef.current;
        const distX = target.x - playerPosRef.current.x;
        const distY = target.y - playerPosRef.current.y;
        const dist = Math.hypot(distX, distY);

        if (dist > 0.8) {
          setFacing(Math.abs(distX) > Math.abs(distY) ? (distX > 0 ? 'right' : 'left') : (distY > 0 ? 'down' : 'up'));
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
        setWalkCycle((p) => (p + dt * 10) % (Math.PI * 2));
        checkProximity(newX, newY);
      } else {
        setIsMoving(false);
        setWalkCycle(0);
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [checkProximity]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    containerRef.current?.focus();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetPosRef.current = { x: clickX, y: clickY };
  };

  const handleAnswerPick = (choice: string) => {
    if (!activeGame || isAnswered) return;
    sounds.stopSpeech();
    setSelectedChoice(choice);
    setIsAnswered(true);

    const win = choice.trim().toLowerCase() === activeGame.correct.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      sounds.playSuccess();
      awardCurrency(6, 1);
      setScoreStreak((p) => p + 1);
    } else {
      sounds.playError();
      sounds.speak('Try again!');
    }
  };

  const handleNextGameInContinuousLoop = () => {
    if (!activeGame) return;
    const nextIdx = activeGame.gameNum % 25;
    const nextGame = ISLES_25_GAMES[nextIdx];
    launchMinigame(nextGame);
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
          className="pointer-events-auto px-3 sm:px-4 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-teal-300 border border-teal-400/70 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>World Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-teal-400/50 shadow-xl">
          <span className="text-xs sm:text-sm font-black text-teal-200 font-display uppercase tracking-wide">
            Isles of Play · 25 All Unlocked Mini-Games
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-teal-400/60 text-teal-300 text-xs font-mono font-bold shadow-xl">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{activeExplorer.coins} Coins</span>
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
          alt="Isles of Play Background"
          className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none z-0"
        />

        {/* 25 MARIO-STYLE LEVEL DOTS ACROSS THE ISLANDS */}
        {ISLES_25_GAMES.map((game) => {
          const isNearby = nearbyGame?.id === game.id;
          const isHovered = hoveredNodeId === game.id;

          return (
            <div
              key={game.id}
              style={{ left: `${game.x}%`, top: `${game.y}%` }}
              onMouseEnter={() => setHoveredNodeId(game.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={(e) => {
                e.stopPropagation();
                launchMinigame(game);
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Lil Black Mario Dot */}
              <div
                className={`relative rounded-full flex items-center justify-center transition-all ${
                  isNearby
                    ? 'w-7 h-7 sm:w-8 sm:h-8 bg-amber-500 border-2 border-white ring-4 ring-amber-400/80 animate-bounce shadow-[0_0_20px_rgba(245,158,11,1)]'
                    : 'w-5 h-5 sm:w-6 sm:h-6 bg-black border-2 border-teal-400 hover:scale-130 shadow-[0_0_12px_rgba(20,184,166,0.6)]'
                }`}
              >
                <span className="text-[11px] sm:text-xs">{game.icon}</span>
              </div>

              {/* Bouncy Hover Banner */}
              {(isHovered || isNearby) && (
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-teal-400 px-2.5 py-1.5 rounded-xl shadow-2xl z-40 whitespace-nowrap text-center animate-fade-in pointer-events-none">
                  <div className="text-[11px] font-black text-teal-200">
                    #{game.gameNum} {game.name}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400">
                    {game.skill} · Tap to Play (Free &amp; Unlocked)
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Companion Guide */}
        <div
          className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-100"
          style={{
            left: `${playerPos.x - (facing === 'left' ? -3.5 : 3.5)}%`,
            top: `${playerPos.y + 0.8}%`,
            transform: `translate(-50%, calc(-50% - ${jumpOffset * 0.9}px))`
          }}
        >
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

        {/* D-Pad Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
            left: 'calc(env(safe-area-inset-left, 0px) + 8px)'
          }}
          className="absolute z-40 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-teal-600/50 shadow-2xl flex items-center gap-2 select-none pointer-events-auto touch-none"
        >
          <div className="flex flex-col items-center gap-1">
            <button
              onMouseDown={() => { dirKeysRef.current.up = true; setActiveDpad(p => ({ ...p, up: true })); }}
              onMouseUp={() => { dirKeysRef.current.up = false; setActiveDpad(p => ({ ...p, up: false })); }}
              onTouchStart={(e) => { e.preventDefault(); dirKeysRef.current.up = true; setActiveDpad(p => ({ ...p, up: true })); }}
              onTouchEnd={(e) => { e.preventDefault(); dirKeysRef.current.up = false; setActiveDpad(p => ({ ...p, up: false })); }}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-slate-900 text-teal-300 border border-teal-500/40"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-1">
              <button
                onMouseDown={() => { dirKeysRef.current.left = true; setActiveDpad(p => ({ ...p, left: true })); }}
                onMouseUp={() => { dirKeysRef.current.left = false; setActiveDpad(p => ({ ...p, left: false })); }}
                onTouchStart={(e) => { e.preventDefault(); dirKeysRef.current.left = true; setActiveDpad(p => ({ ...p, left: true })); }}
                onTouchEnd={(e) => { e.preventDefault(); dirKeysRef.current.left = false; setActiveDpad(p => ({ ...p, left: false })); }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-slate-900 text-teal-300 border border-teal-500/40"
              >
                <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onMouseDown={() => { dirKeysRef.current.down = true; setActiveDpad(p => ({ ...p, down: true })); }}
                onMouseUp={() => { dirKeysRef.current.down = false; setActiveDpad(p => ({ ...p, down: false })); }}
                onTouchStart={(e) => { e.preventDefault(); dirKeysRef.current.down = true; setActiveDpad(p => ({ ...p, down: true })); }}
                onTouchEnd={(e) => { e.preventDefault(); dirKeysRef.current.down = false; setActiveDpad(p => ({ ...p, down: false })); }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-slate-900 text-teal-300 border border-teal-500/40"
              >
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onMouseDown={() => { dirKeysRef.current.right = true; setActiveDpad(p => ({ ...p, right: true })); }}
                onMouseUp={() => { dirKeysRef.current.right = false; setActiveDpad(p => ({ ...p, right: false })); }}
                onTouchStart={(e) => { e.preventDefault(); dirKeysRef.current.right = true; setActiveDpad(p => ({ ...p, right: true })); }}
                onTouchEnd={(e) => { e.preventDefault(); dirKeysRef.current.right = false; setActiveDpad(p => ({ ...p, right: false })); }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-slate-900 text-teal-300 border border-teal-500/40"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <button
            onMouseDown={triggerIsleJump}
            onTouchStart={(e) => { e.preventDefault(); triggerIsleJump(); }}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] tracking-wider bg-teal-500 text-slate-950 border-2 border-teal-200 shadow-lg active:scale-95 cursor-pointer"
          >
            <ChevronsUp className="w-5 h-5 stroke-[3]" />
            <span>JUMP</span>
          </button>
        </div>
      </div>

      {/* ACTIVE UNLOCKED CONTINUOUS PLAY MODAL */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/80 border-4 border-teal-400 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-[0_0_60px_rgba(20,184,166,0.6)] animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeGame.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-teal-300 uppercase tracking-wide">
                    #{activeGame.gameNum} {activeGame.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{activeGame.skill}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{scoreStreak} Streak</span>
                </div>
                <button
                  onClick={() => {
                    sounds.stopSpeech();
                    setActiveGame(null);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {activeGame.howToPlay}
              </p>

              <div className="inline-flex items-center gap-3 bg-teal-500/20 border-2 border-teal-400 px-6 py-3 rounded-2xl shadow-inner animate-bounce">
                <span className="text-2xl sm:text-3xl font-black text-teal-200 font-display tracking-widest">
                  {activeGame.targetPhoneme}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speakPhonicsSlow(activeGame.soundCue)}
                  className="p-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md cursor-pointer transition-transform hover:scale-115 active:scale-95"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {activeGame.choices.map((choice) => {
                const isSelected = selectedChoice === choice;
                let btnStyle = 'bg-slate-950 hover:bg-teal-950/70 border-slate-700 text-slate-200';

                if (isAnswered) {
                  if (choice.trim().toLowerCase() === activeGame.correct.trim().toLowerCase()) {
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
                    disabled={isAnswered}
                    className={`py-4 px-3 rounded-2xl border-2 text-base sm:text-xl font-black font-display tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${btnStyle}`}
                  >
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`p-2.5 rounded-xl border text-xs font-black animate-scale-up flex items-center justify-between ${
                isCorrect ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300'
              }`}>
                <span>{isCorrect ? `${activeGame.fact} +6 Coins!` : 'Remember: listen to the pure isolated sounds!'}</span>
                {isCorrect ? (
                  <button
                    onClick={handleNextGameInContinuousLoop}
                    className="px-3 py-1 rounded-lg bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow cursor-pointer hover:bg-teal-300"
                  >
                    Next Game ➔
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAnswered(false);
                      setSelectedChoice(null);
                      sounds.speakPhonicsSlow(activeGame.soundCue);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
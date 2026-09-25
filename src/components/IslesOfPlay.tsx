import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { ArrowLeft, Play, Sparkles, Gamepad2, Compass, CheckCircle2, Footprints, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react';
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
  x: number; // exact % on map image
  y: number;
}

export const ISLES_25_GAMES: IsleMinigame[] = [
  // 1. Tower Spire (Top-Left)
  { id: 'iop-1', name: 'Tower Spire Climber', building: 'Ancient Rune Spire', skill: 'Letter Sounds', icon: '🗼', howToPlay: 'Climb the winding spiral tower by reading the rune inscriptions.', x: 14, y: 15 },
  { id: 'iop-2', name: 'Spire Stone Gate', building: 'Spire Entrance', skill: 'Initial Blends', icon: '🚪', howToPlay: 'Unlock the ancient stone gate by matching beginning consonant blends.', x: 19, y: 32 },

  // 2. Upper Hedge Maze (Top-Left Interior)
  { id: 'iop-3', name: 'Hedge Maze Altar', building: 'Stone Obelisk Altar', skill: 'Sight Words', icon: '🗿', howToPlay: 'Reach the center stone pillar by following sight word trail markers.', x: 30, y: 20 },
  { id: 'iop-4', name: 'Maze Hedge Entrance', building: 'Maze Archway', skill: 'Word Families', icon: '🌿', howToPlay: 'Enter the maze paths by picking the correct rhyming pathway.', x: 38, y: 27 },

  // 3. Mountain Library (Top Center Cleft)
  { id: 'iop-5', name: 'Grand Mountain Library', building: 'Carved Mountain Archives', skill: 'Story Blending', icon: '🏛️', howToPlay: 'Assemble the ancient reading scrolls inside the mountain archive.', x: 50, y: 19 },
  { id: 'iop-6', name: 'Mountain Stream Flume', building: 'Library Aqueduct', skill: 'Vowel Sounds', icon: '🌊', howToPlay: 'Guide stream boats along the mountain flume by sorting short vowels.', x: 58, y: 26 },

  // 4. Amphitheater & Arena (Top Right)
  { id: 'iop-7', name: 'Colosseum Rhyme Arena', building: 'Rooftop Amphitheater', skill: 'Rhyme Battles', icon: '🎪', howToPlay: 'Join the stage show and pick matching rhyming couplets to win cheers.', x: 69, y: 19 },
  { id: 'iop-8', name: 'Crane Construction Deck', building: 'Upper Crane', skill: 'Consonant Blocks', icon: '🏗️', howToPlay: 'Swing the construction crane to set letter blocks in place.', x: 63, y: 11 },

  // 5. Observatory & Clockwork Shrine (Far Top-Right Island)
  { id: 'iop-9', name: 'Stargazer Observatory', building: 'Telescope Tower', skill: 'Alphabet Stars', icon: '🔭', howToPlay: 'Look through the telescope to connect constellation letters into words.', x: 80, y: 20 },
  { id: 'iop-10', name: 'Windmill Clockwork Shrine', building: 'Clockwork Shrine', skill: 'Digraph Gears', icon: '⚙️', howToPlay: 'Spin the gears on the rooftop shrine by completing sh, ch, and th words.', x: 88, y: 24 },

  // 6. Lower Hedge Maze (Far Left)
  { id: 'iop-11', name: 'Lower Garden Labyrinth', building: 'Garden Maze', skill: 'Tricky Words', icon: '🌳', howToPlay: 'Find the lost forest friends hidden in the hedge corners.', x: 12, y: 52 },
  { id: 'iop-12', name: 'Labyrinth Steps', building: 'Maze Stone Stairs', skill: 'Double Letters', icon: '🪜', howToPlay: 'Climb the maze entry stairs by spelling words with ll, ss, and ff.', x: 6, y: 61 },

  // 7. Letter Water Bay (Center-Left Water Canal)
  { id: 'iop-13', name: 'Letter Fleet Regatta', building: 'Canal Rowboats', skill: 'Alphabet Order', icon: '⛵', howToPlay: 'Sail rowboats carrying letters A through G in the canal.', x: 33, y: 40 },
  { id: 'iop-14', name: 'Canal Aqueduct Gate', building: 'Stone Bridge Arch', skill: 'Silent E', icon: '🌉', howToPlay: 'Open the water locks by turning short vowel words into long vowels.', x: 26, y: 48 },

  // 8. Center Wishing Well (Middle Island)
  { id: 'iop-15', name: 'Wishing Well Echo', building: 'Central Stone Well', skill: 'Phonemic Awareness', icon: '🪣', howToPlay: 'Toss a coin into the well and listen for spoken phoneme echoes.', x: 49, y: 48 },
  { id: 'iop-16', name: 'Center Island Grove', building: 'Wishing Well Bridge', skill: 'Color Words', icon: '🌲', howToPlay: 'Cross the wooden planks onto the center island by identifying colors.', x: 45, y: 53 },

  // 9. Covered Tent Stage (Mid-Right Island)
  { id: 'iop-17', name: 'Covered Canopy Stage', building: 'Canopy Tent', skill: 'Action Verbs', icon: '⛺', howToPlay: 'Watch stage actors act out running, jumping, clapping, and reading.', x: 63, y: 37 },
  { id: 'iop-18', name: 'Canopy Footbridge', building: 'Wooden Footbridge', skill: 'Compound Words', icon: '🪵', howToPlay: 'Walk the footbridge by pairing sun + flower and rain + bow.', x: 60, y: 42 },

  // 10. Industrial Gear Workshop (Far Mid-Right Island)
  { id: 'iop-19', name: 'Watermill Gear Shop', building: 'Industrial Mill', skill: 'R-Blends', icon: '🏭', howToPlay: 'Power the watermill wheel using words that begin with br, tr, and gr.', x: 89, y: 44 },
  { id: 'iop-20', name: 'Smokestack Steam Pipes', building: 'Steam Boiler', skill: 'Ending Consonants', icon: '💨', howToPlay: 'Fix leaking steam valves with matching ending consonant stamps.', x: 80, y: 45 },

  // 11. Timber Arcade Den (Bottom-Left Island)
  { id: 'iop-21', name: 'Timber Arcade Cabinets', building: 'Arcade Cabinets', skill: 'CVC Words', icon: '🕹️', howToPlay: 'Play classic arcade cabinets to build 3-letter words like cat, cup, and pen.', x: 13, y: 76 },
  { id: 'iop-22', name: 'Arcade Barrel Porch', building: 'Arcade Entryway', skill: 'Word Family -at', icon: '🪵', howToPlay: 'Stack barrels on the porch to rhyme with bat, mat, and hat.', x: 21, y: 83 },

  // 12. Giant Open Storybook (Bottom-Center Island)
  { id: 'iop-23', name: 'Giant Storybook Page', building: 'Grand Open Book', skill: 'Sentence Reading', icon: '📖', howToPlay: 'Read sentences printed across the giant open storybook.', x: 42, y: 77 },
  { id: 'iop-24', name: 'Storybook Crane Pier', building: 'Harbor Dock & Boat', skill: 'First Letter Sounds', icon: '⚓', howToPlay: 'Catch letters from the harbor pier using the small dock crane.', x: 53, y: 89 },

  // 13. Lookout Tower & Mountain Cavern (Bottom-Right Islands)
  { id: 'iop-25', name: 'Treasure Chest Cavern', building: 'Rocky Mountain Grotto', skill: 'Phonics Fluency', icon: '💎', howToPlay: 'Enter the rocky mountain cave to find the glowing phonics treasure chest.', x: 92, y: 82 }
];

export const IslesOfPlay: React.FC<IslesOfPlayProps> = ({ onBackToWorld }) => {
  const { activeExplorer } = useGame();
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

  const dirKeysRef = useRef({ up: false, down: false, left: false, right: false, shift: false });
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const enterCooldown = useRef<number>(0);
  const lastEnteredGameId = useRef<string | null>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const triggerGameLaunch = useCallback((game: IsleMinigame) => {
    sounds.playStep();
    sounds.speak(`Visiting ${game.building}! Let's play ${game.name}!`);
    setActiveGame(game);
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
        triggerGameLaunch(target);
      }
    } else if (!closest || minDistance > 5.5) {
      lastEnteredGameId.current = null;
    }
  }, [triggerGameLaunch, activeGame]);

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

      if ((k === 'e' || k === ' ' || k === 'enter' || code === 'KeyE' || code === 'Space') && nearbyGame && !activeGame) {
        matched = true;
        triggerGameLaunch(nearbyGame);
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
  }, [nearbyGame, activeGame, triggerGameLaunch]);

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

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1500px] mx-auto rounded-3xl overflow-hidden border-4 border-teal-500/60 shadow-2xl bg-slate-950 flex flex-col justify-between select-none outline-none focus:ring-2 focus:ring-teal-400/40"
    >
      {/* Top HUD */}
      <div className="absolute top-3 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => {
            sounds.playStep();
            onBackToWorld();
          }}
          className="pointer-events-auto px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-teal-300 border-2 border-teal-400/70 text-xs font-black flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to World Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-teal-400/50 shadow-xl hidden sm:block">
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-4 h-4 text-teal-300" />
            <span className="text-sm font-black text-teal-200 font-display uppercase tracking-wide">
              Isles of Play
            </span>
          </div>
          <span className="text-[10px] text-teal-300/80 font-medium">
            Tap or walk to any building on the island!
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-teal-400/60 text-teal-300 text-xs font-mono font-bold shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
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

        {/* 25 Dedicated Landmark Icons (Positioned Directly on the Structures) */}
        {ISLES_25_GAMES.map((game) => (
          <div
            key={game.id}
            style={{ left: `${game.x}%`, top: `${game.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              triggerGameLaunch(game);
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 active:scale-95 group"
          >
            {/* Compact Circular Landmark Badge that doesn't block the art */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/90 hover:bg-teal-950/90 border-2 border-teal-400 hover:border-amber-300 shadow-[0_0_15px_rgba(20,184,166,0.6)] flex items-center justify-center backdrop-blur-sm transition-all">
              <span className="text-sm sm:text-base">{game.icon}</span>

              {/* Hover Name Tag that only appears on hover so it never crowds other games */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 border border-teal-400/80 px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <span className="text-[10px] font-black text-teal-200">{game.name}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Player Avatar */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          {targetPosRef.current && (
            <div className="absolute -inset-4 rounded-full border-2 border-teal-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-teal-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-teal-300">{activeExplorer.name}</span>
            {isRunning && <span className="text-[8px] text-teal-400 font-black uppercase tracking-wider">Run</span>}
          </div>

          <AvatarRenderer
            customization={activeExplorer.customization}
            size={52}
            isWalking={isMoving}
            isRunning={isRunning}
            facing={facing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>

        {/* On-Screen D-Pad Arrow Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-4 z-40 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border-2 border-teal-600/50 shadow-2xl flex flex-col items-center gap-1 select-none pointer-events-auto"
        >
          <div className="text-[9px] font-black text-teal-400 uppercase tracking-widest text-center -mb-0.5">
            Controls
          </div>
          <button
            onMouseDown={() => handleDpadPress('up')}
            onMouseUp={() => handleDpadRelease('up')}
            onMouseLeave={() => handleDpadRelease('up')}
            onTouchStart={() => handleDpadPress('up')}
            onTouchEnd={() => handleDpadRelease('up')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ${
              activeDpad.up
                ? 'bg-teal-400 text-slate-950 border-teal-300 scale-95 shadow-inner'
                : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-teal-500/40'
            }`}
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('left')}
              onMouseUp={() => handleDpadRelease('left')}
              onMouseLeave={() => handleDpadRelease('left')}
              onTouchStart={() => handleDpadPress('left')}
              onTouchEnd={() => handleDpadRelease('left')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ${
                activeDpad.left
                  ? 'bg-teal-400 text-slate-950 border-teal-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-teal-500/40'
              }`}
            >
              <ArrowLeftIcon className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('down')}
              onMouseUp={() => handleDpadRelease('down')}
              onMouseLeave={() => handleDpadRelease('down')}
              onTouchStart={() => handleDpadPress('down')}
              onTouchEnd={() => handleDpadRelease('down')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ${
                activeDpad.down
                  ? 'bg-teal-400 text-slate-950 border-teal-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-teal-500/40'
              }`}
            >
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('right')}
              onMouseUp={() => handleDpadRelease('right')}
              onMouseLeave={() => handleDpadRelease('right')}
              onTouchStart={() => handleDpadPress('right')}
              onTouchEnd={() => handleDpadRelease('right')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ${
                activeDpad.right
                  ? 'bg-teal-400 text-slate-950 border-teal-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-teal-500/40'
              }`}
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Proximity Bar & Quick Jump */}
      <div className="p-3 bg-slate-950/95 border-t-2 border-teal-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {nearbyGame ? (
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-teal-500/40">
              <span className="text-xl">{nearbyGame.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>{nearbyGame.name}</span>
                  <span className="text-[11px] text-teal-400 font-normal">({nearbyGame.building})</span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 max-w-sm">
                  {nearbyGame.howToPlay}
                </div>
              </div>
              <button
                onClick={() => triggerGameLaunch(nearbyGame)}
                className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-2xl border border-slate-800">
              <Footprints className="w-4 h-4 text-teal-400" />
              <span>
                Move with <b>Arrow Keys / WASD</b> or <b>Click on Buildings</b> to launch minigames!
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mr-1">Locations:</span>
          {ISLES_25_GAMES.slice(0, 8).map((g) => (
            <button
              key={g.id}
              onClick={() => {
                playerPosRef.current = { x: g.x, y: g.y };
                setPlayerPos({ x: g.x, y: g.y });
                triggerGameLaunch(g);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-900 hover:bg-teal-950/60 text-slate-200 hover:text-teal-300 border border-teal-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              {g.building}
            </button>
          ))}
        </div>
      </div>

      {/* Active Minigame Modal */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-teal-400 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(20,184,166,0.5)] animate-scale-up">
            <div className="text-5xl">{activeGame.icon}</div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-400/40">
                {activeGame.building}
              </div>
              <h2 className="text-2xl font-black text-slate-100 font-display">
                {activeGame.name}
              </h2>
              <p className="text-xs text-amber-300 font-bold">Skill: {activeGame.skill}</p>
              <p className="text-xs text-slate-300 max-w-sm mx-auto pt-2">
                {activeGame.howToPlay}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-2">
              <p className="font-bold text-teal-300 text-sm">🎮 Interactive Activity Ready!</p>
              <p className="text-[11px] text-slate-400">
                Play freely with no timer, no stars deducted, and no score recording.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveGame(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Exit Game
              </button>
              <button
                onClick={() => {
                  sounds.playFanfare();
                  sounds.speak('Awesome round completed!');
                  setActiveGame(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Finish Round & Return</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
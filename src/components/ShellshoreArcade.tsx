import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { ArrowLeft, Play, Sparkles, Gamepad2, Compass, CheckCircle2, Footprints, Zap, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react';
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
  x: number; // exact % on map image
  y: number;
}

export const SHELLSHORE_25_GAMES: ArcadeCabinetGame[] = [
  // 1. Neon Tower Spire (Top-Left)
  { id: 'ssa-1', name: 'Pinball Beacon Spire', building: 'Neon Spiral Spire', skill: 'Root CHRON (Time)', icon: '⏳', howToPlay: 'Launch cyber pinballs along the spiral ramp to decode chronological roots.', x: 14, y: 15 },
  { id: 'ssa-2', name: 'Spire Arcade Portal', building: 'Spire Base Cabinets', skill: 'Root TELE (Far)', icon: '📡', howToPlay: 'Calibrate long-distance satellite signals for telescope and telepathy.', x: 19, y: 32 },

  // 2. Upper Neon Hedge Maze (Top-Left Interior)
  { id: 'ssa-3', name: 'Matrix Obelisk Circuit', building: 'Neon Maze Obelisk', skill: 'Root BIO (Life)', icon: '🧬', howToPlay: 'Guide electrical circuits to the central pillar for biology and biome.', x: 30, y: 20 },
  { id: 'ssa-4', name: 'Hedge Firewall Gate', building: 'Maze Security Gate', skill: 'Root GEO (Earth)', icon: '🌍', howToPlay: 'Bypass security gates by mining geological and geothermal root words.', x: 38, y: 27 },

  // 3. Binary Matrix Mountain Cleft (Top Center)
  { id: 'ssa-5', name: 'Binary Code Cleft', building: 'Binary Matrix Mountain', skill: 'Root SPEC (See)', icon: '🔬', howToPlay: 'Inspect streaming cyber code for spectator, spectacle, and conspicuous.', x: 50, y: 19 },
  { id: 'ssa-6', name: 'Matrix Data Stream', building: 'Mountain Aqueduct Run', skill: 'Quad-Syllables', icon: '⚔️', howToPlay: 'Slice streaming data packets into syllables: un-pre-dict-a-ble.', x: 58, y: 26 },

  // 4. Laser Amphitheater & Hologram Ring (Top Right)
  { id: 'ssa-7', name: 'Laser Stage Rhythm', building: 'Neon Amphitheater', skill: 'Primary Stress', icon: '🎚️', howToPlay: 'Tune audio frequencies on stressed syllables: pho-TOG-ra-phy.', x: 69, y: 19 },
  { id: 'ssa-8', name: 'Hologram Projection Beam', building: 'Upper Laser Crane', skill: 'The Schwa (ə)', icon: '📻', howToPlay: 'Filter sound waves to locate unaccented schwa vowels in a-bout and pen-cil.', x: 63, y: 11 },

  // 5. Vaporwave Grid Platform & Telescope (Far Top-Right Island)
  { id: 'ssa-9', name: 'Vaporwave Neon Grid', building: 'Grid Platform', skill: 'Prefixes MEGA/MICRO', icon: '💾', howToPlay: 'Sort microscopic and megabyte data crystals across the glowing grid.', x: 86, y: 22 },
  { id: 'ssa-10', name: 'Grid Telescope Radar', building: 'Observatory Tower', skill: 'Prefixes ANTI/COUNTER', icon: '🛡️', howToPlay: 'Scan for defense codes like antioxidant, counterattack, and antidote.', x: 79, y: 20 },

  // 6. Lower Neon Hedge Labyrinth (Far Left)
  { id: 'ssa-11', name: 'Bioluminescent Maze', building: 'Lower Neon Maze', skill: 'Prefixes INTER/INTRA', icon: '🌐', howToPlay: 'Route maze packets along international and intracellular pathways.', x: 12, y: 52 },
  { id: 'ssa-12', name: 'Maze Neon Steps', building: 'Labyrinth Steps', skill: 'Suffix -OLOGY', icon: '📚', howToPlay: 'Unlock study archives for archaeology, neurology, and meteorology.', x: 6, y: 61 },

  // 7. Letter Water Bay (Center-Left Water Canal)
  { id: 'ssa-13', name: 'Synth Rowboat Regatta', building: 'Letter Rowboats', skill: 'Suffixes -IBLE vs -ABLE', icon: '🔐', howToPlay: 'Navigate boats through canal gates for flexible, dependable, and durable.', x: 33, y: 40 },
  { id: 'ssa-14', name: 'Canal Neon Waterfall', building: 'Stone Bridge Arch', skill: 'I Before E Rule', icon: '🎹', howToPlay: 'Hit keyboard notes in rhythm for ceiling, receive, and neighbor.', x: 26, y: 48 },

  // 8. Center Bioluminescent Coral Well (Middle Island)
  { id: 'ssa-15', name: 'Bioluminescent Fountain', building: 'Coral Altar Fountain', skill: 'Complex R-Vowels', icon: '⚡', howToPlay: 'Shield the fountain core against storms of thorough, murmur, and whirl.', x: 49, y: 48 },
  { id: 'ssa-16', name: 'Coral Island Boardwalk', building: 'Center Coral Walkway', skill: 'Silent Letters', icon: '🥷', howToPlay: 'Walk silently past monitors using words with silent k, w, and b.', x: 45, y: 53 },

  // 9. Covered Digital Nook (Mid-Right Island)
  { id: 'ssa-17', name: 'Cyber Terminal Tent', building: 'Covered Screen Tent', skill: 'Diphthongs (OI, OU)', icon: '🌊', howToPlay: 'Synthesize audio tracks with royal, void, bounce, and prowl.', x: 63, y: 37 },
  { id: 'ssa-18', name: 'Neon Suspension Bridge', building: 'Wooden Footbridge', skill: 'Soft C and Soft G', icon: '🎸', howToPlay: 'Slap synthesizer basslines for cinema, giant, logic, and gym.', x: 60, y: 42 },

  // 10. Silicon Micro-Hub Station (Far Mid-Right Island)
  { id: 'ssa-19', name: 'Silicon CPU Chip Hub', building: 'Micro-Hub Tower', skill: 'Context Clues', icon: '🏎️', howToPlay: 'Solve sentence context clues to overclock the CPU engine speed.', x: 89, y: 44 },
  { id: 'ssa-20', name: 'Chipboard Smoker', building: 'Silicon Pipes', skill: 'Denotation / Connotation', icon: '⚖️', howToPlay: 'Balance subtle word weights: curious vs nosy, and thrifty vs stingy.', x: 80, y: 45 },

  // 11. High Score Neon Arcade Den (Bottom-Left Island)
  { id: 'ssa-21', name: 'High Score Cabinets', building: 'Neon Arcade', skill: 'Academic Analogies', icon: '🏁', howToPlay: 'Play CRT arcade cabinets by completing analogies at high speed.', x: 13, y: 76 },
  { id: 'ssa-22', name: 'Arcade Marquee Deck', building: 'Neon Star Marquee', skill: 'Confusing Homophones', icon: '🎯', howToPlay: 'Lock radar crosshairs on affect/effect and principal/principle.', x: 21, y: 83 },

  // 12. Glowing Cyber Grimoire (Bottom-Center Beach)
  { id: 'ssa-23', name: 'Holographic Codex Page', building: 'Giant Cyber Book', skill: 'Language Lineage', icon: '🏛️', howToPlay: 'Trace word origins back to Latin, Ancient Greek, and Old English.', x: 42, y: 77 },
  { id: 'ssa-24', name: 'Tidal Crane Dock', building: 'Cyber Wharf Pier', skill: 'Base Word Extraction', icon: '💻', howToPlay: 'Decompile long words like unconstitutionally down to their base word.', x: 53, y: 89 },

  // 13. Prismatic Crystal Cavern (Bottom-Right Mountain)
  { id: 'ssa-25', name: 'Prismatic Crystal Mines', building: 'Neon Crystal Mountain', skill: 'Figurative Language', icon: '🏆', howToPlay: 'Identify hyperbole, metaphor, and oxymorons to unlock the crystal chest.', x: 92, y: 82 }
];

export const ShellshoreArcade: React.FC<ShellshoreArcadeProps> = ({ onBackToWorld }) => {
  const { activeExplorer } = useGame();
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

  const triggerCabinetLaunch = useCallback((game: ArcadeCabinetGame) => {
    sounds.playStep();
    sounds.speak(`Accessing ${game.building}! Initializing ${game.name}!`);
    setActiveCabinet(game);
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
        triggerCabinetLaunch(target);
      }
    } else if (!closest || minDistance > 5.5) {
      lastEnteredGameId.current = null;
    }
  }, [triggerCabinetLaunch, activeCabinet]);

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

      if ((k === 'e' || k === ' ' || k === 'enter' || code === 'KeyE' || code === 'Space') && nearbyGame && !activeCabinet) {
        matched = true;
        triggerCabinetLaunch(nearbyGame);
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
  }, [nearbyGame, activeCabinet, triggerCabinetLaunch]);

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
      className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1500px] mx-auto rounded-3xl overflow-hidden border-4 border-fuchsia-500/60 shadow-2xl bg-slate-950 flex flex-col justify-between select-none outline-none focus:ring-2 focus:ring-fuchsia-400/40"
    >
      {/* Top Neon HUD */}
      <div className="absolute top-3 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => {
            sounds.playStep();
            onBackToWorld();
          }}
          className="pointer-events-auto px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md hover:bg-slate-900 text-fuchsia-300 border-2 border-fuchsia-400/70 text-xs font-black flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to World Map</span>
        </button>

        <div className="pointer-events-auto text-center bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-fuchsia-400/50 shadow-xl hidden sm:block">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-black text-fuchsia-200 font-display uppercase tracking-wide">
              Shellshore Arcade
            </span>
          </div>
          <span className="text-[10px] text-fuchsia-300/80 font-medium">
            Tap or walk to any neon terminal on the cyber reef!
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-fuchsia-400/60 text-fuchsia-300 text-xs font-mono font-bold shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
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

        {/* 25 Dedicated Landmark Icons (Positioned Directly on the Structures) */}
        {SHELLSHORE_25_GAMES.map((cab) => (
          <div
            key={cab.id}
            style={{ left: `${cab.x}%`, top: `${cab.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              triggerCabinetLaunch(cab);
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 active:scale-95 group"
          >
            {/* Compact Glowing Cyber Circle Badge */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/90 hover:bg-fuchsia-950/90 border-2 border-fuchsia-400 hover:border-cyan-300 shadow-[0_0_15px_rgba(217,70,239,0.6)] flex items-center justify-center backdrop-blur-sm transition-all">
              <span className="text-sm sm:text-base">{cab.icon}</span>

              {/* Hover Name Tag that only shows on hover */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 border border-fuchsia-400/80 px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-30 shadow-lg">
                <span className="text-[10px] font-black text-fuchsia-200">{cab.name}</span>
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
            <div className="absolute -inset-4 rounded-full border-2 border-fuchsia-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-fuchsia-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-fuchsia-300">{activeExplorer.name}</span>
            {isRunning && <span className="text-[8px] text-cyan-400 font-black uppercase tracking-wider">Run</span>}
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
          className="absolute bottom-4 left-4 z-40 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border-2 border-fuchsia-600/50 shadow-2xl flex flex-col items-center gap-1 select-none pointer-events-auto"
        >
          <div className="text-[9px] font-black text-fuchsia-400 uppercase tracking-widest text-center -mb-0.5">
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
                ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 scale-95 shadow-inner'
                : 'bg-slate-900 hover:bg-slate-800 text-fuchsia-300 border-fuchsia-500/40'
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
                  ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-fuchsia-300 border-fuchsia-500/40'
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
                  ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-fuchsia-300 border-fuchsia-500/40'
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
                  ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-fuchsia-300 border-fuchsia-500/40'
              }`}
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Proximity Bar & Quick Jump */}
      <div className="p-3 bg-slate-950/95 border-t-2 border-fuchsia-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {nearbyGame ? (
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-fuchsia-500/40">
              <span className="text-xl">{nearbyGame.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>{nearbyGame.name}</span>
                  <span className="text-[11px] text-cyan-300 font-normal">({nearbyGame.building})</span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 max-w-sm">
                  {nearbyGame.howToPlay}
                </div>
              </div>
              <button
                onClick={() => triggerCabinetLaunch(nearbyGame)}
                className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-400 hover:to-cyan-400 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-2xl border border-slate-800">
              <Footprints className="w-4 h-4 text-fuchsia-400" />
              <span>
                Move with <b>Arrow Keys / WASD</b> or <b>Click on Buildings</b> to launch arcade cabinets!
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider mr-1">Locations:</span>
          {SHELLSHORE_25_GAMES.slice(0, 8).map((g) => (
            <button
              key={g.id}
              onClick={() => {
                playerPosRef.current = { x: g.x, y: g.y };
                setPlayerPos({ x: g.x, y: g.y });
                triggerCabinetLaunch(g);
              }}
              className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-900 hover:bg-fuchsia-950/60 text-slate-200 hover:text-fuchsia-300 border border-fuchsia-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              {g.building}
            </button>
          ))}
        </div>
      </div>

      {/* Active Cabinet Modal */}
      {activeCabinet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-fuchsia-400 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-[0_0_50px_rgba(217,70,239,0.5)] animate-scale-up">
            <div className="text-5xl">{activeCabinet.icon}</div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-mono font-bold border border-fuchsia-400/40">
                {activeCabinet.building}
              </div>
              <h2 className="text-2xl font-black text-slate-100 font-display">
                {activeCabinet.name}
              </h2>
              <p className="text-xs text-cyan-300 font-bold">Skill Focus: {activeCabinet.skill}</p>
              <p className="text-xs text-slate-300 max-w-sm mx-auto pt-2">
                {activeCabinet.howToPlay}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-2">
              <p className="font-bold text-fuchsia-300 text-sm">🕹️ Advanced Linguistic Cabinet Active</p>
              <p className="text-[11px] text-slate-400">
                Explore roots, affixes, and complex rules freely without any score impact.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveCabinet(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Quit Cabinet
              </button>
              <button
                onClick={() => {
                  sounds.playFanfare();
                  sounds.speak('Cabinet cleared! Excellent reading!');
                  setActiveCabinet(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-500 hover:from-fuchsia-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
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
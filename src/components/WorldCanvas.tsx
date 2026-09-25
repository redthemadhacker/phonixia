import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, isLandUnlocked } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { LandmarkNode, LandId, MinigameId } from '../types/character';
import { sounds, VOICE_PERSONAS } from '../utils/audio';
import { 
  Lock, Volume2, VolumeX, Home, Play, Star, Footprints, 
  Sparkles, Compass, Gamepad2, Blocks, Trees, Mountain, 
  Landmark, Waves, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Mic, X
} from 'lucide-react';
import phonixiaMap from '../../phonixia.png';

interface WorldCanvasProps {
  onSelectLand: (landId: LandId) => void;
  onSelectMinigame: (minigameId: MinigameId) => void;
  onOpenHomeHut: () => void;
}

export const LANDMARK_NODES: LandmarkNode[] = [
  {
    id: 'home-hut',
    name: 'Home Hut',
    tagline: 'Family & Teacher Hub',
    targetAge: 'All Explorers',
    x: 10,
    y: 65,
    icon: '',
    color: '#854d0e',
    accentColor: '#fde047',
    description: 'Harbor pier hut. View synced scores, switch explorers, check reading progress, and manage settings.'
  },
  {
    id: 'sound-shallows',
    name: 'Sound Shallows',
    tagline: 'Letter Sounds & Blending',
    targetAge: 'Preschool',
    x: 50,
    y: 45,
    icon: '',
    color: '#0284c7',
    accentColor: '#38bdf8',
    description: 'The Grand Phoenix Citadel. Pure letter sounds, rhyming shells, and gentle sound blending.'
  },
  {
    id: 'builders-guild',
    name: 'Builders Guild',
    tagline: 'CVC Words & Digraphs',
    targetAge: 'Kindergarten',
    x: 18,
    y: 28,
    icon: '',
    color: '#d97706',
    accentColor: '#fbbf24',
    description: 'Harbor workshop quarries. Stack CVC blocks, weld SH/CH/TH digraphs, and learn double consonant rules.'
  },
  {
    id: 'tricky-trails',
    name: 'Tricky Trails',
    tagline: 'Silent E & Sight Words',
    targetAge: 'Early Elementary',
    x: 50,
    y: 82,
    icon: '',
    color: '#059669',
    accentColor: '#34d399',
    description: 'Enchanted mossy paths. Magic Silent E trails, tricky sight stones, and compound canopy paths.'
  },
  {
    id: 'whispering-peaks',
    name: 'Whispering Peaks',
    tagline: 'Vowel Teams & Bossy R',
    targetAge: 'Late Elementary',
    x: 80,
    y: 26,
    icon: '',
    color: '#4f46e5',
    accentColor: '#818cf8',
    description: 'Glacial alpine peaks. Complex vowel teams, Bossy R storms, syllable divide ridges, and silent letters.'
  },
  {
    id: 'lexicon-empire',
    name: 'Lexicon Empire',
    tagline: 'Roots, Affixes & Rules',
    targetAge: 'Middle to High School',
    x: 82,
    y: 72,
    icon: '',
    color: '#b45309',
    accentColor: '#f59e0b',
    description: 'Grand golden acropolis. Greek and Latin roots, advanced spelling rules, and etymology.'
  }
];

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  onSelectLand,
  onSelectMinigame,
  onOpenHomeHut
}) => {
  const { activeExplorer } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  const playerPosRef = useRef<{ x: number; y: number }>({ x: 18, y: 64 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 18, y: 64 });

  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);
  const [nearbyNode, setNearbyNode] = useState<{ id: string; name: string; tagline?: string; description?: string } | null>(null);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  const dirKeysRef = useRef({ up: false, down: false, left: false, right: false, shift: false });
  const [activeDpad, setActiveDpad] = useState({ up: false, down: false, left: false, right: false });

  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const lastEnteredNodeId = useRef<string | null>(null);
  const enterCooldown = useRef<number>(0);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    containerRef.current?.focus();
    return () => {
      sounds.stopSpeech();
    };
  }, []);

  const triggerNodeEnter = useCallback((targetId: string, targetName: string) => {
    sounds.stopSpeech();
    if (targetId === 'home-hut') {
      sounds.speak('Welcome home to the Family Hub! Ready to check your reading progress?', 0.92, 1.2);
      onOpenHomeHut();
    } else if (targetId === 'isles-of-play') {
      sounds.playSuccess();
      sounds.speak('Welcome to the Isles of Play!', 0.92, 1.2);
      onSelectMinigame('isles-of-play');
    } else if (targetId === 'shellshore-arcade') {
      sounds.playSuccess();
      sounds.speak('Entering Shellshore Arcade!', 0.92, 1.2);
      onSelectMinigame('shellshore-arcade');
    } else if (['sound-shallows', 'builders-guild', 'tricky-trails', 'whispering-peaks', 'lexicon-empire'].includes(targetId)) {
      const landId = targetId as LandId;
      if (isLandUnlocked(landId, activeExplorer.landScores)) {
        sounds.playSuccess();
        sounds.speak(`Entering ${targetName}! Let's read!`, 0.92, 1.2);
        onSelectLand(landId);
      } else {
        sounds.playError();
        const prevLandName = targetId === 'builders-guild' ? 'Sound Shallows'
          : targetId === 'tricky-trails' ? 'Builders Guild'
          : targetId === 'whispering-peaks' ? 'Tricky Trails'
          : 'Whispering Peaks';
        const msg = `${targetName} is locked! Complete ${prevLandName} first to unlock this land.`;
        setLockNotice(msg);
        sounds.speak(`This land is locked. Complete ${prevLandName} to unlock!`, 0.88, 1.18);
        setTimeout(() => setLockNotice(null), 3800);
      }
    }
  }, [activeExplorer, onOpenHomeHut, onSelectLand, onSelectMinigame]);

  const checkProximity = useCallback((x: number, y: number) => {
    const allLocations = [
      ...LANDMARK_NODES,
      { id: 'isles-of-play', name: 'Isles of Play', tagline: 'Letter Islands', description: 'Fun phonics games.', x: 15, y: 52 },
      { id: 'shellshore-arcade', name: 'Shellshore Arcade', tagline: 'Seashell Beach', description: 'Fun phonics arcade.', x: 14, y: 82 }
    ];

    let closest: { id: string; name: string; tagline?: string; description?: string; x: number; y: number } | null = null;
    let minDistance = 8;

    allLocations.forEach((node) => {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = node;
      }
    });

    setNearbyNode(closest);

    const now = Date.now();
    if (closest && minDistance < 5.2 && now > enterCooldown.current) {
      const target = closest;
      if (lastEnteredNodeId.current !== target.id) {
        lastEnteredNodeId.current = target.id;
        enterCooldown.current = now + 1800;
        triggerNodeEnter(target.id, target.name);
      }
    } else if (!closest || minDistance > 7.5) {
      lastEnteredNodeId.current = null;
    }
  }, [triggerNodeEnter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      let matched = false;

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW' || code === 'Numpad8') {
        dirKeysRef.current.up = true;
        setActiveDpad(prev => ({ ...prev, up: true }));
        matched = true;
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS' || code === 'Numpad2') {
        dirKeysRef.current.down = true;
        setActiveDpad(prev => ({ ...prev, down: true }));
        matched = true;
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA' || code === 'Numpad4') {
        dirKeysRef.current.left = true;
        setActiveDpad(prev => ({ ...prev, left: true }));
        matched = true;
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD' || code === 'Numpad6') {
        dirKeysRef.current.right = true;
        setActiveDpad(prev => ({ ...prev, right: true }));
        matched = true;
      }
      if (k === 'shift' || code === 'ShiftLeft' || code === 'ShiftRight') {
        dirKeysRef.current.shift = true;
        matched = true;
      }

      if ((k === 'e' || k === ' ' || k === 'enter' || code === 'KeyE' || code === 'Space') && nearbyNode) {
        matched = true;
        triggerNodeEnter(nearbyNode.id, nearbyNode.name);
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

      if (k === 'arrowup' || k === 'up' || k === 'w' || code === 'ArrowUp' || code === 'KeyW' || code === 'Numpad8') {
        dirKeysRef.current.up = false;
        setActiveDpad(prev => ({ ...prev, up: false }));
      }
      if (k === 'arrowdown' || k === 'down' || k === 's' || code === 'ArrowDown' || code === 'KeyS' || code === 'Numpad2') {
        dirKeysRef.current.down = false;
        setActiveDpad(prev => ({ ...prev, down: false }));
      }
      if (k === 'arrowleft' || k === 'left' || k === 'a' || code === 'ArrowLeft' || code === 'KeyA' || code === 'Numpad4') {
        dirKeysRef.current.left = false;
        setActiveDpad(prev => ({ ...prev, left: false }));
      }
      if (k === 'arrowright' || k === 'right' || k === 'd' || code === 'ArrowRight' || code === 'KeyD' || code === 'Numpad6') {
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
  }, [nearbyNode, triggerNodeEnter]);

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

        newX = Math.max(6, Math.min(94, playerPosRef.current.x + (dx / len) * baseSpeed * dt));
        newY = Math.max(12, Math.min(88, playerPosRef.current.y + (dy / len) * baseSpeed * dt));
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

  const handleFastTravel = (node: LandmarkNode) => {
    sounds.stopSpeech();
    triggerNodeEnter(node.id, node.name);
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
      className="relative w-full h-full flex flex-col justify-between select-none outline-none overflow-hidden"
    >
      {/* IN-GAME TOP HUD */}
      <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-950/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-amber-600/60 shadow-xl">
          <div className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center overflow-hidden">
            <AvatarRenderer customization={activeExplorer.customization} size={30} facing="down" showPet={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-amber-300 font-display">{activeExplorer.name}</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1 rounded bg-amber-500/20 text-amber-300">Lv.{activeExplorer.level}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
                {activeExplorer.totalStars}
              </span>
              <span className="text-yellow-400 font-bold hidden xs:inline">{activeExplorer.coins}c</span>
              <span className="text-sky-300 font-bold hidden sm:inline">{activeExplorer.arcadeTokens}t</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sounds.stopSpeech();
              setShowVoiceModal(true);
            }}
            title="Choose Phonics Voice (Ms. Rachel, US/UK)"
            className="h-8 sm:h-10 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-500/70 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">Voice</span>
          </button>

          <button
            onClick={() => {
              sounds.stopSpeech();
              const next = !isAudioMuted;
              setIsAudioMuted(next);
              sounds.speechEnabled = !next;
              sounds.soundEnabled = !next;
              if (!next) sounds.speak('Voice is on.');
            }}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-xl cursor-pointer"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={() => {
              sounds.stopSpeech();
              onOpenHomeHut();
            }}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-xl border border-amber-300 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Home Hut</span>
          </button>
        </div>
      </div>

      {lockNotice && (
        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-max max-w-[92%] px-4 sm:px-5 py-2 sm:py-2.5 bg-rose-950/95 border-2 border-rose-500 rounded-2xl shadow-2xl text-rose-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-bounce pointer-events-none">
          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-center">{lockNotice}</span>
        </div>
      )}

      {/* WORLD MAP VIEWPORT */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none"
        style={{ backgroundColor: '#0c1a2c' }}
      >
        <img
          src={phonixiaMap}
          alt="Phonixia World Map"
          className="absolute inset-0 w-full h-full object-fill select-none z-0"
        />

        {/* 1. HOME HUT */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
          style={{ left: '10%', top: '65%' }}
          onClick={(e) => {
            e.stopPropagation();
            sounds.stopSpeech();
            onOpenHomeHut();
          }}
        >
          <div className="w-20 sm:w-24 h-16 sm:h-20 rounded-2xl bg-amber-950/80 hover:bg-amber-900/90 p-1.5 sm:p-2 shadow-xl border-2 border-amber-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-wider mt-0.5">Home Hut</span>
          </div>
        </div>

        {/* 2. ISLES OF PLAY */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sounds.stopSpeech();
            onSelectMinigame('isles-of-play');
          }}
          className="absolute left-[15%] top-[52%] z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-950/90 border border-teal-400 shadow-xl flex items-center gap-1 sm:gap-1.5 text-teal-200 backdrop-blur-sm">
            <Gamepad2 className="w-3.5 h-3.5 text-teal-300" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Isles of Play</span>
          </div>
        </div>

        {/* 3. SHELLSHORE ARCADE */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sounds.stopSpeech();
            onSelectMinigame('shellshore-arcade');
          }}
          className="absolute left-[14%] top-[82%] z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-950/90 border border-sky-400 shadow-xl flex items-center gap-1 sm:gap-1.5 text-sky-200 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-sky-300" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">Shellshore Arcade</span>
          </div>
        </div>

        {/* 4. SOUND SHALLOWS */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
          style={{ left: '50%', top: '45%' }}
          onClick={(e) => {
            e.stopPropagation();
            sounds.stopSpeech();
            onSelectLand('sound-shallows');
          }}
        >
          <div className="w-28 sm:w-34 h-20 sm:h-24 rounded-2xl bg-sky-950/80 hover:bg-sky-900/90 p-1.5 sm:p-2 shadow-2xl border-2 border-sky-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300" />
            <div className="text-[10px] sm:text-[11px] font-black text-sky-200 uppercase tracking-wider text-center mt-0.5 leading-tight">
              Sound Shallows
            </div>
            <div className="absolute -bottom-2.5 bg-slate-950/95 border border-sky-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-300">
                {activeExplorer.landScores['sound-shallows'].stars}
              </span>
            </div>
          </div>
        </div>

        {/* 5. BUILDERS GUILD */}
        {(() => {
          const unlocked = isLandUnlocked('builders-guild', activeExplorer.landScores);
          return (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
              style={{ left: '18%', top: '28%' }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.stopSpeech();
                if (unlocked) onSelectLand('builders-guild');
                else triggerNodeEnter(LANDMARK_NODES[2].id, LANDMARK_NODES[2].name);
              }}
            >
              <div className="w-26 sm:w-32 h-20 sm:h-24 rounded-2xl bg-amber-950/80 p-1.5 sm:p-2 shadow-2xl border-2 border-amber-500/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Blocks className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                <div className="text-[10px] sm:text-[11px] font-black text-amber-200 uppercase tracking-wider text-center mt-0.5 leading-tight">
                  Builders Guild
                </div>
                <div className="absolute -bottom-2.5 bg-slate-950/95 border border-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['builders-guild'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 6. TRICKY TRAILS */}
        {(() => {
          const unlocked = isLandUnlocked('tricky-trails', activeExplorer.landScores);
          return (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
              style={{ left: '50%', top: '82%' }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.stopSpeech();
                if (unlocked) onSelectLand('tricky-trails');
                else triggerNodeEnter(LANDMARK_NODES[3].id, LANDMARK_NODES[3].name);
              }}
            >
              <div className="w-26 sm:w-32 h-20 sm:h-24 rounded-2xl bg-emerald-950/80 p-1.5 sm:p-2 shadow-2xl border-2 border-emerald-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Trees className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                <div className="text-[10px] sm:text-[11px] font-black text-emerald-200 uppercase tracking-wider text-center mt-0.5 leading-tight">
                  Tricky Trails
                </div>
                <div className="absolute -bottom-2.5 bg-slate-950/95 border border-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  ) : (
                    <>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['tricky-trails'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 7. WHISPERING PEAKS */}
        {(() => {
          const unlocked = isLandUnlocked('whispering-peaks', activeExplorer.landScores);
          return (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
              style={{ left: '80%', top: '26%' }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.stopSpeech();
                if (unlocked) onSelectLand('whispering-peaks');
                else triggerNodeEnter(LANDMARK_NODES[4].id, LANDMARK_NODES[4].name);
              }}
            >
              <div className="w-26 sm:w-32 h-20 sm:h-24 rounded-2xl bg-indigo-950/80 p-1.5 sm:p-2 shadow-2xl border-2 border-indigo-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Mountain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-300" />
                <div className="text-[10px] sm:text-[11px] font-black text-indigo-200 uppercase tracking-wider text-center mt-0.5 leading-tight">
                  Whispering Peaks
                </div>
                <div className="absolute -bottom-2.5 bg-slate-950/95 border border-indigo-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-2.5 h-2.5 text-indigo-400" />
                  ) : (
                    <>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['whispering-peaks'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 8. LEXICON EMPIRE */}
        {(() => {
          const unlocked = isLandUnlocked('lexicon-empire', activeExplorer.landScores);
          return (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
              style={{ left: '82%', top: '72%' }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.stopSpeech();
                if (unlocked) onSelectLand('lexicon-empire');
                else triggerNodeEnter(LANDMARK_NODES[5].id, LANDMARK_NODES[5].name);
              }}
            >
              <div className="w-26 sm:w-32 h-20 sm:h-24 rounded-2xl bg-amber-950/80 p-1.5 sm:p-2 shadow-2xl border-2 border-amber-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                <div className="text-[10px] sm:text-[11px] font-black text-amber-200 uppercase tracking-wider text-center mt-0.5 leading-tight">
                  Lexicon Empire
                </div>
                <div className="absolute -bottom-2.5 bg-slate-950/95 border border-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['lexicon-empire'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* PLAYER AVATAR */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          {targetPosRef.current && (
            <div className="absolute -inset-3 rounded-full border border-amber-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-amber-400/90 px-2 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-amber-300">{activeExplorer.name}</span>
            {isRunning && <span className="text-[8px] text-amber-400 font-black uppercase">Run</span>}
          </div>

          <AvatarRenderer
            customization={activeExplorer.customization}
            size={46}
            isWalking={isMoving}
            isRunning={isRunning}
            facing={facing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>

        {/* D-PAD */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-40 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl sm:rounded-2xl border border-amber-600/50 shadow-2xl flex flex-col items-center gap-1 select-none pointer-events-auto"
        >
          <button
            onMouseDown={() => handleDpadPress('up')}
            onMouseUp={() => handleDpadRelease('up')}
            onTouchStart={() => handleDpadPress('up')}
            onTouchEnd={() => handleDpadRelease('up')}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
              activeDpad.up ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
            }`}
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onMouseDown={() => handleDpadPress('left')}
              onMouseUp={() => handleDpadRelease('left')}
              onTouchStart={() => handleDpadPress('left')}
              onTouchEnd={() => handleDpadRelease('left')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.left ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('down')}
              onMouseUp={() => handleDpadRelease('down')}
              onTouchStart={() => handleDpadPress('down')}
              onTouchEnd={() => handleDpadRelease('down')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.down ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('right')}
              onMouseUp={() => handleDpadRelease('right')}
              onTouchStart={() => handleDpadPress('right')}
              onTouchEnd={() => handleDpadRelease('right')}
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border transition-all ${
                activeDpad.right ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM TRAVEL / PROXIMITY BAR */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-amber-900/60 flex items-center justify-between gap-2 overflow-x-auto">
        {nearbyNode ? (
          <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-amber-500/40">
            <span className="text-xs font-bold text-slate-100">{nearbyNode.name}</span>
            <button
              onClick={() => {
                sounds.stopSpeech();
                triggerNodeEnter(nearbyNode.id, nearbyNode.name);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Enter</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-1">
            <Footprints className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] hidden xs:inline">Tap map or use arrows to explore!</span>
          </div>
        )}

        <div className="flex items-center gap-1 overflow-x-auto">
          {LANDMARK_NODES.map((node) => {
            const isHome = node.id === 'home-hut';
            const unlocked = isHome || isLandUnlocked(node.id as LandId, activeExplorer.landScores);

            return (
              <button
                key={node.id}
                onClick={() => handleFastTravel(node)}
                className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                  unlocked
                    ? 'bg-slate-900 text-slate-200 border-amber-500/30'
                    : 'bg-slate-950 text-slate-600 border-slate-800 opacity-60'
                }`}
              >
                <span>{node.name}</span>
                {!unlocked && <Lock className="w-2.5 h-2.5 text-slate-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Selection Studio Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Phonics Voice Studio
                </h3>
              </div>
              <button
                onClick={() => {
                  sounds.stopSpeech();
                  setShowVoiceModal(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {VOICE_PERSONAS.map((v) => {
                const isActive = sounds.activePersonaId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      sounds.stopSpeech();
                      sounds.setPersona(v.id);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-amber-200">{v.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{v.description}</div>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-black uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                sounds.speak('Hi there! Welcome back to Phonixia! Are you ready to read?');
                setShowVoiceModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer"
            >
              Test Voice & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
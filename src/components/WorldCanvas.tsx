import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame, isLandUnlocked } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { LandmarkNode, LandId, MinigameId } from '../types/character';
import { sounds } from '../utils/audio';
import { Lock, Volume2, VolumeX, Home, Play, Star, Footprints, Sparkles, Compass, Gamepad2, Blocks, Trees, Mountain, Landmark, Waves, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
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

  // 1. Beginner spawn: near Home Hut (10, 65) outside on the path without triggering auto-enter
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 18, y: 64 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 18, y: 64 });

  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);
  const [nearbyNode, setNearbyNode] = useState<{ id: string; name: string; tagline?: string; description?: string } | null>(null);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  const dirKeysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  });

  const [activeDpad, setActiveDpad] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  const lastKeyTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const lastStepSoundTime = useRef<number>(0);
  const lastEnteredNodeId = useRef<string | null>(null);
  const enterCooldown = useRef<number>(0);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(sounds.selectedVoiceName);

  useEffect(() => {
    containerRef.current?.focus();
    const timer = setTimeout(() => {
      const v = sounds.getVoices();
      setAvailableVoices(v);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const triggerNodeEnter = useCallback((targetId: string, targetName: string) => {
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

  // 2. Check proximity including lands AND minigames for passover triggers
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
        if (!lastKeyTimeRef.current) {
          lastKeyTimeRef.current = performance.now();
        }
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
      if (!anyActive) {
        lastKeyTimeRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
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
    triggerNodeEnter(node.id, node.name);
  };

  const handleDpadPress = (dir: 'up' | 'down' | 'left' | 'right') => {
    containerRef.current?.focus();
    dirKeysRef.current[dir] = true;
    setActiveDpad(prev => ({ ...prev, [dir]: true }));
    if (!lastKeyTimeRef.current) {
      lastKeyTimeRef.current = performance.now();
    }
  };

  const handleDpadRelease = (dir: 'up' | 'down' | 'left' | 'right') => {
    dirKeysRef.current[dir] = false;
    setActiveDpad(prev => ({ ...prev, [dir]: false }));
    const anyActive = dirKeysRef.current.up || dirKeysRef.current.down || dirKeysRef.current.left || dirKeysRef.current.right;
    if (!anyActive) {
      lastKeyTimeRef.current = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      onMouseEnter={() => containerRef.current?.focus()}
      className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1500px] mx-auto rounded-3xl overflow-hidden border-4 border-amber-900/70 shadow-2xl bg-slate-950 flex flex-col justify-between outline-none focus:ring-2 focus:ring-amber-500/40"
    >
      {/* IN-GAME TOP HUD */}
      <div className="absolute top-3 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Player Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-amber-600/60 shadow-xl">
          <div className="relative w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center overflow-hidden">
            <AvatarRenderer customization={activeExplorer.customization} size={36} facing="down" showPet={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-amber-300 font-display">{activeExplorer.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Lv.{activeExplorer.level}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {activeExplorer.totalStars}
              </span>
              <span className="text-yellow-400 font-bold">Coins {activeExplorer.coins}</span>
              <span className="text-sky-300 font-bold">Tokens {activeExplorer.arcadeTokens}</span>
            </div>
          </div>
        </div>

        {/* Audio Toggle, Voice Settings & Quick Home Hut */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isAudioMuted;
              setIsAudioMuted(next);
              sounds.speechEnabled = !next;
              sounds.soundEnabled = !next;
              if (!next) {
                sounds.speak('Voice is on. Ready to read.', 0.92, 1.2);
              }
            }}
            title={isAudioMuted ? 'Unmute Voice' : 'Mute Voice'}
            className="w-10 h-10 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 hover:border-amber-400 flex items-center justify-center text-amber-400 shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setAvailableVoices(sounds.getVoices());
              setShowVoiceSettings(!showVoiceSettings);
            }}
            title="Kid-Friendly Teacher Voice Settings"
            className="px-3 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 hover:border-amber-400 text-amber-300 font-bold text-xs shadow-xl cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher Voice</span>
          </button>

          <button
            onClick={onOpenHomeHut}
            title="Open Home Hut (Family / Teacher Hub)"
            className="px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl border border-amber-300 flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Home Hut</span>
          </button>
        </div>
      </div>

      {/* TEACHER VOICE SETTINGS MODAL */}
      {showVoiceSettings && (
        <div className="absolute top-16 right-4 z-50 w-84 p-4 rounded-2xl bg-slate-900/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-md text-slate-100 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">Teacher Phonics Voice</div>
              <div className="text-[10px] text-slate-400">Warm & Clear Pronunciation</div>
            </div>
            <button
              onClick={() => setShowVoiceSettings(false)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Phonixia uses clear inflections with focused phoneme pronunciation so children hear friendly, encouraging sounds.
          </p>

          <button
            onClick={() => {
              sounds.speak('Hi friend! Great job reading! Are you ready for an adventure? You can do it!', 0.92, 1.22);
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hear Voice Sample</span>
          </button>

          {availableVoices.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Voice:
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedVoice(val);
                  sounds.setVoice(val);
                  sounds.speak('Hello! I am ready to read with you!', 0.92, 1.2);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
              >
                <option value="">Default Friendly Voice</option>
                {availableVoices
                  .filter(v => v.lang.startsWith('en'))
                  .map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Lock Notice Banner */}
      {lockNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-rose-950/95 border-2 border-rose-500 rounded-2xl shadow-2xl text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>{lockNotice}</span>
        </div>
      )}

      {/* WORLD MAP VIEWPORT */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none"
        style={{
          backgroundColor: '#0c1a2c'
        }}
      >
        <img
          src={phonixiaMap}
          alt="Phonixia World Map"
          className="absolute inset-0 w-full h-full object-fill select-none z-0"
        />

        {/* 1. HOME HUT (Harbor Pier at Left - 10%, 65%) */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group"
          style={{ left: '10%', top: '65%' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenHomeHut();
          }}
        >
          <div className="w-24 h-20 rounded-2xl bg-amber-950/80 hover:bg-amber-900/90 p-2 shadow-xl border-2 border-amber-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <Home className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-black text-amber-200 uppercase tracking-wider mt-1">Home Hut</span>
            <div className="absolute -bottom-3 bg-slate-950/90 border border-amber-400/80 px-2 py-0.5 rounded-full text-center whitespace-nowrap">
              <span className="text-[9px] font-bold text-amber-300">Family Hub</span>
            </div>
          </div>
        </div>

        {/* 3. ISLES OF PLAY (Letter A & C Islands in Bay - 15%, 52%) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectMinigame('isles-of-play');
          }}
          className="absolute left-[15%] top-[52%] z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-teal-400 shadow-xl flex items-center gap-1.5 text-teal-200 backdrop-blur-sm">
            <Gamepad2 className="w-4 h-4 text-teal-300" />
            <span className="text-[11px] font-black uppercase tracking-wider">Isles of Play</span>
          </div>
        </div>

        {/* 3. SHELLSHORE ARCADE (Letter Shells Cove - 14%, 82%) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectMinigame('shellshore-arcade');
          }}
          className="absolute left-[14%] top-[82%] z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-sky-400 shadow-xl flex items-center gap-1.5 text-sky-200 backdrop-blur-sm">
            <Compass className="w-4 h-4 text-sky-300" />
            <span className="text-[11px] font-black uppercase tracking-wider">Shellshore Arcade</span>
          </div>
        </div>

        {/* 2. SOUND SHALLOWS (Grand Phoenix Citadel in Center - 50%, 45%) */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group"
          style={{ left: '50%', top: '45%' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectLand('sound-shallows');
          }}
        >
          <div className="w-34 h-24 rounded-2xl bg-sky-950/80 hover:bg-sky-900/90 p-2 shadow-2xl border-2 border-sky-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <Waves className="w-6 h-6 text-sky-300" />
            <div className="text-[11px] font-black text-sky-200 uppercase tracking-wider text-center mt-1 leading-tight">
              Sound Shallows
            </div>
            <div className="absolute -bottom-3 bg-slate-950/95 border border-sky-400 px-2.5 py-0.5 rounded-full text-center whitespace-nowrap flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-bold text-amber-300">
                {activeExplorer.landScores['sound-shallows'].stars}
              </span>
            </div>
          </div>
        </div>

        {/* 4. BUILDERS GUILD (Top-Left Workshop Crane - 18%, 28%) */}
        {(() => {
          const unlocked = isLandUnlocked('builders-guild', activeExplorer.landScores);
          return (
            <div
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group ${
                !unlocked ? 'opacity-90' : ''
              }`}
              style={{ left: '18%', top: '28%' }}
              onClick={(e) => {
                e.stopPropagation();
                if (unlocked) onSelectLand('builders-guild');
                else triggerNodeEnter(LANDMARK_NODES[2].id, LANDMARK_NODES[2].name);
              }}
            >
              <div className="w-32 h-24 rounded-2xl bg-amber-950/80 hover:bg-amber-900/90 p-2 shadow-2xl border-2 border-amber-500/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Blocks className="w-6 h-6 text-amber-300" />
                <div className="text-[11px] font-black text-amber-200 uppercase tracking-wider text-center mt-1 leading-tight">
                  Builders Guild
                </div>
                <div className="absolute -bottom-3 bg-slate-950/95 border border-amber-400 px-2.5 py-0.5 rounded-full text-center whitespace-nowrap flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-3 h-3 text-amber-400" />
                  ) : (
                    <>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['builders-guild'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 5. TRICKY TRAILS (Bottom-Center Mossy Forest Arch - 50%, 82%) */}
        {(() => {
          const unlocked = isLandUnlocked('tricky-trails', activeExplorer.landScores);
          return (
            <div
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group ${
                !unlocked ? 'opacity-90' : ''
              }`}
              style={{ left: '50%', top: '82%' }}
              onClick={(e) => {
                e.stopPropagation();
                if (unlocked) onSelectLand('tricky-trails');
                else triggerNodeEnter(LANDMARK_NODES[3].id, LANDMARK_NODES[3].name);
              }}
            >
              <div className="w-32 h-24 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 p-2 shadow-2xl border-2 border-emerald-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Trees className="w-6 h-6 text-emerald-300" />
                <div className="text-[11px] font-black text-emerald-200 uppercase tracking-wider text-center mt-1 leading-tight">
                  Tricky Trails
                </div>
                <div className="absolute -bottom-3 bg-slate-950/95 border border-emerald-400 px-2.5 py-0.5 rounded-full text-center whitespace-nowrap flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['tricky-trails'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 6. WHISPERING PEAKS (Top-Right Snowy Mountain - 80%, 26%) */}
        {(() => {
          const unlocked = isLandUnlocked('whispering-peaks', activeExplorer.landScores);
          return (
            <div
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group ${
                !unlocked ? 'opacity-90' : ''
              }`}
              style={{ left: '80%', top: '26%' }}
              onClick={(e) => {
                e.stopPropagation();
                if (unlocked) onSelectLand('whispering-peaks');
                else triggerNodeEnter(LANDMARK_NODES[4].id, LANDMARK_NODES[4].name);
              }}
            >
              <div className="w-32 h-24 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900/90 p-2 shadow-2xl border-2 border-indigo-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Mountain className="w-6 h-6 text-indigo-300" />
                <div className="text-[11px] font-black text-indigo-200 uppercase tracking-wider text-center mt-1 leading-tight">
                  Whispering Peaks
                </div>
                <div className="absolute -bottom-3 bg-slate-950/95 border border-indigo-400 px-2.5 py-0.5 rounded-full text-center whitespace-nowrap flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-3 h-3 text-indigo-400" />
                  ) : (
                    <>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['whispering-peaks'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 7. LEXICON EMPIRE (Bottom-Right Classical Citadel - 82%, 72%) */}
        {(() => {
          const unlocked = isLandUnlocked('lexicon-empire', activeExplorer.landScores);
          return (
            <div
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 group ${
                !unlocked ? 'opacity-90' : ''
              }`}
              style={{ left: '82%', top: '72%' }}
              onClick={(e) => {
                e.stopPropagation();
                if (unlocked) onSelectLand('lexicon-empire');
                else triggerNodeEnter(LANDMARK_NODES[5].id, LANDMARK_NODES[5].name);
              }}
            >
              <div className="w-32 h-24 rounded-2xl bg-amber-950/80 hover:bg-amber-900/90 p-2 shadow-2xl border-2 border-amber-400/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Landmark className="w-6 h-6 text-amber-300" />
                <div className="text-[11px] font-black text-amber-200 uppercase tracking-wider text-center mt-1 leading-tight">
                  Lexicon Empire
                </div>
                <div className="absolute -bottom-3 bg-slate-950/95 border border-amber-400 px-2.5 py-0.5 rounded-full text-center whitespace-nowrap flex items-center gap-1">
                  {!unlocked ? (
                    <Lock className="w-3 h-3 text-amber-400" />
                  ) : (
                    <>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-300">
                        {activeExplorer.landScores['lexicon-empire'].stars}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* PLAYER AVATAR EXPLORER */}
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`
          }}
        >
          {targetPosRef.current && (
            <div className="absolute -inset-4 rounded-full border-2 border-amber-400 animate-ping opacity-40 pointer-events-none" />
          )}

          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-amber-400/90 px-2.5 py-0.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-amber-300">{activeExplorer.name}</span>
            {isRunning && <span className="text-[9px] text-amber-400 font-black uppercase tracking-wider">Run</span>}
          </div>

          <AvatarRenderer
            customization={activeExplorer.customization}
            size={54}
            isWalking={isMoving}
            isRunning={isRunning}
            facing={facing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>

        {/* ON-SCREEN ARROW CONTROLS */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-4 z-40 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border-2 border-amber-600/50 shadow-2xl flex flex-col items-center gap-1 select-none pointer-events-auto"
        >
          <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest text-center -mb-0.5">
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
                ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-inner'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
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
                  ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              onMouseDown={() => handleDpadPress('down')}
              onMouseUp={() => handleDpadRelease('down')}
              onMouseLeave={() => handleDpadRelease('down')}
              onTouchStart={() => handleDpadPress('down')}
              onTouchEnd={() => handleDpadRelease('down')}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ${
                activeDpad.down
                  ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
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
                  ? 'bg-amber-400 text-slate-950 border-amber-300 scale-95 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
              }`}
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* FAST TRAVEL & DOCK */}
      <div className="p-3 bg-slate-950/95 border-t-2 border-amber-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {nearbyNode ? (
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-amber-500/40">
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>{nearbyNode.name}</span>
                  {nearbyNode.tagline && (
                    <span className="text-[11px] text-amber-400 font-normal">({nearbyNode.tagline})</span>
                  )}
                </div>
                {nearbyNode.description && (
                  <div className="text-[10px] text-slate-400 line-clamp-1 max-w-sm">
                    {nearbyNode.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => triggerNodeEnter(nearbyNode.id, nearbyNode.name)}
                className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-2xl border border-slate-800">
              <Footprints className="w-4 h-4 text-amber-400" />
              <span>
                Move with <b>Arrow Keys / WASD</b> or <b>Click on Map</b>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mr-1">Fast Travel:</span>
          {LANDMARK_NODES.map((node) => {
            const isHome = node.id === 'home-hut';
            const unlocked = isHome || isLandUnlocked(node.id as LandId, activeExplorer.landScores);

            return (
              <button
                key={node.id}
                onClick={() => handleFastTravel(node)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border shadow-sm ${
                  unlocked
                    ? 'bg-slate-900 hover:bg-amber-950/60 text-slate-200 hover:text-amber-300 border-amber-500/30 hover:border-amber-400'
                    : 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{node.name}</span>
                {!unlocked && <Lock className="w-3 h-3 text-slate-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
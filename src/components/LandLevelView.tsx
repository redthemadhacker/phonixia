import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LandId } from '../types/character';
import { PHONIXIA_LANDS } from '../data/curriculumData';
import { useGame } from '../context/GameContext';
import { GameEngine } from './GameEngine';
import { GameChallenge, CurriculumLevel } from '../types/curriculum';
import { ArrowLeft, Star, Lock, Play, Footprints, Volume2, VolumeX, Sparkles, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';

import soundBg from '../../sound.jpeg';
import buildBg from '../../build.jpeg';
import trailsBg from '../../trails.jpeg';
import peakBg from '../../peak.jpeg';
import empireBg from '../../empire.jpeg';

interface LandLevelViewProps {
  landId: LandId;
  onBackToWorld: () => void;
}

interface LevelWaypoint {
  levelNumber: number;
  x: number;
  y: number;
}

const LAND_BACKGROUNDS: Record<string, string> = {
  'sound-shallows': soundBg,
  'builders-guild': buildBg,
  'tricky-trails': trailsBg,
  'whispering-peaks': peakBg,
  'lexicon-empire': empireBg,
};

// Map waypoints tailored to the path routes of each artwork
const LAND_WAYPOINTS: Record<string, LevelWaypoint[]> = {
  'sound-shallows': [
    { levelNumber: 1, x: 26, y: 72 }, // stepping stone lagoon
    { levelNumber: 2, x: 42, y: 64 }, // shallow sandbar pool
    { levelNumber: 3, x: 49, y: 41 }, // coral shell stage
    { levelNumber: 4, x: 24, y: 34 }, // sound stage cavern
    { levelNumber: 5, x: 67, y: 34 }, // treetop chime terrace
  ],
  'builders-guild': [
    { levelNumber: 1, x: 53, y: 88 }, // harbor dock arrival
    { levelNumber: 2, x: 42, y: 73 }, // gear mechanism beach
    { levelNumber: 3, x: 62, y: 59 }, // central planning platform
    { levelNumber: 4, x: 55, y: 26 }, // spiral block tower
    { levelNumber: 5, x: 84, y: 46 }, // quarry mine forge
  ],
  'tricky-trails': [
    { levelNumber: 1, x: 74, y: 72 }, // mud pit clearing
    { levelNumber: 2, x: 45, y: 67 }, // fallen hollow log bridge
    { levelNumber: 3, x: 79, y: 42 }, // canopy rope crossing
    { levelNumber: 4, x: 49, y: 44 }, // great hollow root tree
    { levelNumber: 5, x: 20, y: 44 }, // mossy grotto cave
  ],
  'whispering-peaks': [
    { levelNumber: 1, x: 13, y: 80 }, // carved tablet overlook
    { levelNumber: 2, x: 26, y: 67 }, // suspension gorge bridge
    { levelNumber: 3, x: 42, y: 58 }, // musical harp waterfall
    { levelNumber: 4, x: 69, y: 46 }, // mountain shrine sanctuary
    { levelNumber: 5, x: 88, y: 19 }, // peak wind gear apparatus
  ],
  'lexicon-empire': [
    { levelNumber: 1, x: 30, y: 74 }, // grand open book courtyard
    { levelNumber: 2, x: 52, y: 68 }, // twin fountain plaza
    { levelNumber: 3, x: 58, y: 47 }, // tiered academy steps
    { levelNumber: 4, x: 84, y: 43 }, // pulpit of interpretation
    { levelNumber: 5, x: 36, y: 30 }, // tower of phonics library
  ],
};

export const LandLevelView: React.FC<LandLevelViewProps> = ({ landId, onBackToWorld }) => {
  const { activeExplorer } = useGame();
  const landData = PHONIXIA_LANDS.find(l => l.id === landId) || PHONIXIA_LANDS[0];
  const explorerLandStats = activeExplorer.landScores[landId];

  const containerRef = useRef<HTMLDivElement>(null);

  // Player position state & ref for 60fps tick
  const playerPosRef = useRef<{ x: number; y: number }>({ x: 20, y: 84 });
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 20, y: 84 });

  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right' | 'down' | 'up'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);

  const [nearbyLevel, setNearbyLevel] = useState<CurriculumLevel | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | null>(null);
  const [activeGameChallenge, setActiveGameChallenge] = useState<GameChallenge | null>(null);
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

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
  const lastEnteredLevelNum = useRef<number | null>(null);
  const enterCooldown = useRef<number>(0);

  const waypoints = LAND_WAYPOINTS[landId] || LAND_WAYPOINTS['sound-shallows'];
  const bgImage = LAND_BACKGROUNDS[landId] || soundBg;

  useEffect(() => {
    containerRef.current?.focus();
    // Default initial level launcher to Level 1
    const lvl1 = landData.levels.find(l => l.levelNumber === 1) || landData.levels[0];
    setSelectedLevel(lvl1);
  }, [landData]);

  const triggerLevelEnter = useCallback((level: CurriculumLevel) => {
    const isUnlocked = level.levelNumber <= explorerLandStats.highestLevelUnlocked || level.levelNumber === 1;

    if (isUnlocked) {
      sounds.playSuccess();
      sounds.speak(`Starting Level ${level.levelNumber}: ${level.name}! Let's read!`, 0.92, 1.2);
      setSelectedLevel(level);
    } else {
      sounds.playError();
      const msg = `Level ${level.levelNumber} is locked! Complete Level ${level.levelNumber - 1} first.`;
      setLockNotice(msg);
      sounds.speak(`This level is locked. Complete level ${level.levelNumber - 1} to unlock!`, 0.88, 1.18);
      setTimeout(() => setLockNotice(null), 3500);
    }
  }, [explorerLandStats.highestLevelUnlocked]);

  // Proximity check for passover triggers
  const checkProximity = useCallback((x: number, y: number) => {
    let closestLevel: CurriculumLevel | null = null;
    let minDistance = 7.5;

    waypoints.forEach((wp) => {
      const dist = Math.hypot(wp.x - x, wp.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        const found = landData.levels.find(l => l.levelNumber === wp.levelNumber);
        if (found) closestLevel = found;
      }
    });

    setNearbyLevel(closestLevel);

    const now = Date.now();
    if (closestLevel && minDistance < 5.0 && now > enterCooldown.current) {
      const target = closestLevel as CurriculumLevel;
      if (lastEnteredLevelNum.current !== target.levelNumber) {
        lastEnteredLevelNum.current = target.levelNumber;
        enterCooldown.current = now + 2000;
        triggerLevelEnter(target);
      }
    } else if (!closestLevel || minDistance > 7.5) {
      lastEnteredLevelNum.current = null;
    }
  }, [waypoints, landData.levels, triggerLevelEnter]);

  // Keyboard controls listener
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

      if ((k === 'e' || k === ' ' || k === 'enter' || code === 'KeyE' || code === 'Space') && nearbyLevel) {
        matched = true;
        triggerLevelEnter(nearbyLevel);
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
  }, [nearbyLevel, triggerLevelEnter]);

  // Continuous 60fps Tick Loop
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

  const handleLaunchGame = (game: GameChallenge) => {
    sounds.playStep();
    setActiveGameChallenge(game);
  };

  const handleGameComplete = () => {
    if (!selectedLevel) return;
    const nextGameNum = activeGameChallenge ? activeGameChallenge.gameNumber + 1 : 1;
    const nextGame = selectedLevel.games.find(g => g.gameNumber === nextGameNum);
    if (nextGame) {
      setActiveGameChallenge(nextGame);
    } else {
      setActiveGameChallenge(null);
      sounds.playFanfare();
    }
  };

  const activeLevelStats = selectedLevel
    ? explorerLandStats.levels[selectedLevel.levelNumber] || { stars: 0, unlocked: true, highScore: 0, completedGames: [] }
    : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => containerRef.current?.focus()}
      className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1500px] mx-auto rounded-3xl overflow-hidden border-4 border-amber-900/70 shadow-2xl bg-slate-950 flex flex-col justify-between outline-none focus:ring-2 focus:ring-amber-500/40"
    >
      {/* TOP HUD BAR */}
      <div className="absolute top-3 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Back to World & Land Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={onBackToWorld}
            className="px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 hover:border-amber-400 text-amber-300 font-bold text-xs shadow-xl cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>World Map</span>
          </button>

          <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-amber-600/60 shadow-xl flex items-center gap-2.5">
            <AvatarRenderer customization={activeExplorer.customization} size={32} facing="down" showPet={false} />
            <div>
              <div className="text-xs font-black text-amber-300 font-display">{landData.name}</div>
              <div className="text-[10px] text-slate-300 font-mono">
                Mastery: {explorerLandStats.completedGamesCount}/50 Games
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sound Toggle & Total Land Stars */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-500/60 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{explorerLandStats.stars} Stars</span>
          </div>

          <button
            onClick={() => {
              const next = !isAudioMuted;
              setIsAudioMuted(next);
              sounds.speechEnabled = !next;
              sounds.soundEnabled = !next;
              if (!next) sounds.speak('Audio on.', 0.92, 1.2);
            }}
            className="w-10 h-10 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/60 hover:border-amber-400 flex items-center justify-center text-amber-400 shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* LOCK NOTICE BANNER */}
      {lockNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-rose-950/95 border-2 border-rose-500 rounded-2xl shadow-2xl text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>{lockNotice}</span>
        </div>
      )}

      {/* EXPLORABLE LAND MAP VIEWPORT */}
      <div
        onClick={handleMapClick}
        className="relative flex-1 w-full cursor-crosshair overflow-hidden select-none bg-slate-950"
      >
        <img
          src={bgImage}
          alt={landData.name}
          className="absolute inset-0 w-full h-full object-fill select-none z-0"
        />

        {/* INTERACTIVE LEVEL NODES */}
        {landData.levels.map((level) => {
          const wp = waypoints.find(w => w.levelNumber === level.levelNumber) || { x: 50, y: 50 };
          const isUnlocked = level.levelNumber <= explorerLandStats.highestLevelUnlocked || level.levelNumber === 1;
          const isSelected = selectedLevel?.levelNumber === level.levelNumber;
          const lvlStats = explorerLandStats.levels[level.levelNumber];
          const completedCount = lvlStats?.completedGames.length || 0;

          return (
            <div
              key={level.levelNumber}
              onClick={(e) => {
                e.stopPropagation();
                triggerLevelEnter(level);
              }}
              style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
            >
              <div
                className={`px-3 py-1.5 rounded-2xl shadow-2xl border-2 flex items-center gap-2 backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-300'
                    : isUnlocked
                    ? 'bg-slate-950/90 text-amber-200 border-amber-400/80 hover:border-amber-300'
                    : 'bg-slate-950/90 text-slate-500 border-slate-700 opacity-70'
                }`}
              >
                {!isUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center font-mono">
                    {level.levelNumber}
                  </div>
                )}
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider leading-none">
                    Lvl {level.levelNumber}
                  </div>
                  <div className="text-[9px] font-bold text-amber-300/80 mt-0.5">
                    {completedCount}/10
                  </div>
                </div>
              </div>
            </div>
          );
        })}

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
              <ArrowRightIcon className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM LEVEL LAUNCHER DOCK */}
      <div className="p-3 bg-slate-950/95 border-t-2 border-amber-900/60 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {selectedLevel ? (
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-amber-500/40">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                {selectedLevel.levelNumber}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>Level {selectedLevel.levelNumber}: {selectedLevel.name}</span>
                  <span className="text-[11px] text-amber-400 font-normal">Focus: {selectedLevel.skillFocus}</span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  {selectedLevel.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-2xl border border-slate-800">
              <Footprints className="w-4 h-4 text-amber-400" />
              <span>
                Move with <b>Arrow Keys / WASD</b> or <b>Click on Map</b> to explore levels
              </span>
            </div>
          )}

          {/* Quick launch next incomplete game */}
          {selectedLevel && (
            <button
              onClick={() => {
                const incomplete = selectedLevel.games.find(g => !(activeLevelStats?.completedGames || []).includes(g.gameNumber)) || selectedLevel.games[0];
                handleLaunchGame(incomplete);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Next Game</span>
            </button>
          )}
        </div>

        {/* Game list horizontally scrollable strip */}
        {selectedLevel && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedLevel.games.map((game) => {
              const isDone = (activeLevelStats?.completedGames || []).includes(game.gameNumber);

              return (
                <button
                  key={game.id}
                  onClick={() => handleLaunchGame(game)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-slate-900 hover:bg-slate-800 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 hover:bg-slate-900 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <span>Game {game.gameNumber}</span>
                  {isDone ? (
                    <span className="text-[10px] text-emerald-400">Done</span>
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current text-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE GAME MODAL */}
      {activeGameChallenge && selectedLevel && (
        <GameEngine
          challenge={activeGameChallenge}
          landId={landId}
          levelNumber={selectedLevel.levelNumber}
          onComplete={handleGameComplete}
          onClose={() => setActiveGameChallenge(null)}
        />
      )}
    </div>
  );
};
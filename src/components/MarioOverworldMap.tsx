import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { LandId } from '../types/character';
import { sounds } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { Star, CheckCircle2, ArrowLeft, Footprints, Play, Lock, Shield, Sparkles } from 'lucide-react';

const shallowsBg = '/sound.jpeg';
const buildersBg = '/build.jpeg';
const trailsBg = '/trails.jpeg';
const peaksBg = '/peak.jpeg';
const empireBg = '/empire.jpeg';

interface StageNode {
  number: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isCastle: boolean;
  isBoss: boolean;
  stars: number;
  x: number;
  y: number;
}

interface MarioOverworldMapProps {
  landId: LandId;
  landName: string;
  totalStages?: number;
  completedStages: number;
  onLaunchStage: (stageNumber: number) => void;
  onBack: () => void;
}

const LAND_BACKGROUNDS: Record<LandId, string> = {
  'sound-shallows': shallowsBg,
  'builders-guild': buildersBg,
  'tricky-trails': trailsBg,
  'whispering-peaks': peaksBg,
  'lexicon-empire': empireBg,
  'phonixia-academy': empireBg,
  'masters-pathways': peaksBg,
  'celestial-archives': shallowsBg,
};

const LAND_THEME_BADGES: Record<LandId, { icon: string; border: string; glow: string; pathColor: string }> = {
  'sound-shallows': { icon: '🌊', border: 'border-cyan-400', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)]', pathColor: '#06b6d4' },
  'builders-guild': { icon: '🔨', border: 'border-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]', pathColor: '#f59e0b' },
  'tricky-trails': { icon: '🌿', border: 'border-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]', pathColor: '#10b981' },
  'whispering-peaks': { icon: '❄️', border: 'border-indigo-400', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.6)]', pathColor: '#6366f1' },
  'lexicon-empire': { icon: '🔥', border: 'border-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.6)]', pathColor: '#f43f5e' },
  'phonixia-academy': { icon: '🏛️', border: 'border-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]', pathColor: '#a855f7' },
  'masters-pathways': { icon: '📜', border: 'border-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]', pathColor: '#10b981' },
  'celestial-archives': { icon: '🌌', border: 'border-yellow-400', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]', pathColor: '#eab308' },
};

export const MarioOverworldMap: React.FC<MarioOverworldMapProps> = ({
  landId,
  landName,
  totalStages = 50,
  completedStages,
  onLaunchStage,
  onBack,
}) => {
  const { activeExplorer } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);

  const bgImage = LAND_BACKGROUNDS[landId] || shallowsBg;
  const theme = LAND_THEME_BADGES[landId] || LAND_THEME_BADGES['sound-shallows'];
  const isBossRealm = landId === 'lexicon-empire';

  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [transitioningStage, setTransitioningStage] = useState<number | null>(null);

  // Mario S-Curve Winding Path layout across 50 nodes
  const nodes: StageNode[] = useMemo(() => {
    return Array.from({ length: totalStages }).map((_, idx) => {
      const stageNum = idx + 1;
      const isCompleted = stageNum <= completedStages;
      const isCurrent = stageNum === Math.min(totalStages, completedStages + 1);
      const isLocked = stageNum > completedStages + 1;
      const isCastle = stageNum % 10 === 0 && stageNum !== totalStages;
      const isBoss = isBossRealm && stageNum === totalStages;

      const row = Math.floor(idx / 10);
      const col = idx % 10;
      const xNorm = row % 2 === 0 ? col : 9 - col;
      const x = 7.5 + xNorm * 9.4;
      const y = 14 + row * 17.5;

      return {
        number: stageNum,
        isCompleted,
        isCurrent,
        isLocked,
        isCastle,
        isBoss,
        stars: isCompleted ? 3 : 0,
        x,
        y,
      };
    });
  }, [totalStages, completedStages, isBossRealm]);

  // Initial avatar position on current stage
  const currentStageNum = Math.min(totalStages, completedStages + 1);
  const initialNode = nodes.find(n => n.number === currentStageNum) || nodes[0];

  const [avatarCoords, setAvatarCoords] = useState<{ x: number; y: number }>({ x: initialNode.x, y: initialNode.y });
  const [currentStandingNode, setCurrentStandingNode] = useState<number>(currentStageNum);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkFacing, setWalkFacing] = useState<'left' | 'right'>('right');
  const [hopOffset, setHopOffset] = useState<number>(0);
  const [walkCycle, setWalkCycle] = useState<number>(0);
  const [dustPuff, setDustPuff] = useState<{ x: number; y: number } | null>(null);

  // Walk cycle frame loop
  useEffect(() => {
    let frame: number;
    if (isWalking) {
      const animate = () => {
        setWalkCycle((c) => (c + 0.3) % (Math.PI * 2));
        setHopOffset(Math.abs(Math.sin(Date.now() / 120)) * 10);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    } else {
      setHopOffset(0);
    }
    return () => cancelAnimationFrame(frame);
  }, [isWalking]);

  // Handle Mario Node Click with Cute Animated Walk-Over
  const handleNodeClick = (targetNode: StageNode) => {
    if (targetNode.isLocked || isWalking || transitioningStage !== null) {
      sounds.playError();
      return;
    }

    if (targetNode.number === currentStandingNode) {
      // Already there! Pop up with jump sound and launch
      sounds.playJump();
      setTransitioningStage(targetNode.number);
      setTimeout(() => {
        sounds.playFanfare();
        onLaunchStage(targetNode.number);
        setTransitioningStage(null);
      }, 350);
      return;
    }

    // Cute walk path sequence
    setIsWalking(true);
    setTransitioningStage(targetNode.number);

    const fromNum = currentStandingNode;
    const toNum = targetNode.number;
    const stepDirection = toNum > fromNum ? 1 : -1;
    const stepsCount = Math.abs(toNum - fromNum);

    // Build intermediate path of nodes
    const walkSequence: StageNode[] = [];
    for (let i = 1; i <= stepsCount; i++) {
      const nextNum = fromNum + i * stepDirection;
      const found = nodes.find(n => n.number === nextNum);
      if (found) walkSequence.push(found);
    }

    let stepIndex = 0;
    const stepInterval = Math.max(140, Math.min(260, 1000 / Math.max(walkSequence.length, 1)));

    const walkInterval = setInterval(() => {
      if (stepIndex < walkSequence.length) {
        const nextStepNode = walkSequence[stepIndex];
        
        setWalkFacing(nextStepNode.x >= avatarCoords.x ? 'right' : 'left');
        setAvatarCoords({ x: nextStepNode.x, y: nextStepNode.y });
        setCurrentStandingNode(nextStepNode.number);
        setDustPuff({ x: nextStepNode.x, y: nextStepNode.y });
        sounds.playStep();

        stepIndex++;
      } else {
        clearInterval(walkInterval);
        setIsWalking(false);
        setDustPuff(null);
        setHopOffset(0);
        sounds.playJump();

        setTimeout(() => {
          sounds.playFanfare();
          onLaunchStage(targetNode.number);
          setTransitioningStage(null);
        }, 350);
      }
    }, stepInterval);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Banner HUD */}
      <div className="p-2 sm:p-3 bg-slate-900/90 border-b-2 border-amber-400 backdrop-blur-md flex items-center justify-between z-30 shadow-2xl">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs sm:text-sm cursor-pointer shadow-lg flex items-center gap-1.5 border border-amber-400/60 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Citadel Map</span>
        </button>

        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-mono font-black text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span>{theme.icon}</span>
            <span>SUPER MARIO OVERWORLD MAP</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-sm sm:text-lg font-black text-amber-100 font-display flex items-center justify-center gap-2">
            <span>{landName}</span>
            {isBossRealm ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono border border-rose-500/40">
                👑 Shadow King's Citadel · Boss Realm
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                Adventure Course · 50 Stages
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-300 bg-slate-950/90 px-3 py-1 rounded-xl border border-amber-400/60 shadow">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{completedStages * 3} / 150 Stars</span>
        </div>
      </div>

      {/* Main Overworld Territory Canvas with Full Real Land Illustration Background clearly visible */}
      <div className="relative flex-1 w-full overflow-hidden select-none">
        
        {/* Full Real Land Background Artwork - Bright, Vibrant, Not Darkened Out! */}
        <img
          src={bgImage}
          alt={`${landName} Overworld Illustration`}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-95 z-0"
        />

        {/* Subtle atmospheric vignette so the art pops while keeping nodes readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/40 pointer-events-none z-0" />

        {/* Mario S-Curve Cobblestone Winding Road */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Outer road border shadow */}
          <polyline
            points={nodes.map((n) => `${n.x}%,${n.y + 1}%`).join(' ')}
            fill="none"
            stroke="#1c1917"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          {/* Main Mario Cobblestone Roadbed */}
          <polyline
            points={nodes.map((n) => `${n.x}%,${n.y}%`).join(' ')}
            fill="none"
            stroke="#fef08a"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dashed Golden Road Centerline */}
          <polyline
            points={nodes.map((n) => `${n.x}%,${n.y}%`).join(' ')}
            fill="none"
            stroke={theme.pathColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 8"
            className="animate-pulse"
          />
        </svg>

        {/* 50 Super Mario World Level Pads */}
        {nodes.map((node) => {
          const isHovered = hoveredStage === node.number;
          const isStandingHere = currentStandingNode === node.number;

          return (
            <div
              key={node.number}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredStage(node.number)}
              onMouseLeave={() => setHoveredStage(null)}
              onClick={() => handleNodeClick(node)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Mario World Level Pad Graphic */}
              <div
                className={`relative rounded-full flex items-center justify-center transition-transform duration-150 ${
                  node.isBoss
                    ? 'w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-b from-rose-600 via-amber-600 to-stone-950 border-3 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,1)] animate-pulse'
                    : node.isCastle
                    ? 'w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-b from-amber-700 via-stone-800 to-stone-950 border-2 border-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.8)]'
                    : 'w-5 h-5 sm:w-7 sm:h-7 border-2 shadow-lg'
                } ${
                  node.isCurrent
                    ? 'bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 border-white ring-4 ring-amber-300 animate-bounce scale-115 shadow-[0_0_25px_rgba(245,158,11,1)]'
                    : node.isCompleted
                    ? 'bg-gradient-to-b from-emerald-400 to-teal-700 border-white hover:scale-120'
                    : node.isLocked
                    ? 'bg-slate-900/90 border-slate-700 opacity-60 cursor-not-allowed'
                    : 'bg-amber-400 border-white hover:scale-120'
                }`}
              >
                {node.isBoss ? (
                  <span className="text-sm sm:text-base">👑</span>
                ) : node.isCastle ? (
                  <span className="text-xs sm:text-sm">🏰</span>
                ) : node.isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow animate-ping" />
                ) : node.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-mono font-black text-slate-900 drop-shadow">
                    {node.number}
                  </span>
                )}
              </div>

              {/* Bouncy Hover Banner */}
              {isHovered && (
                <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 px-3 py-1.5 rounded-xl shadow-2xl z-40 whitespace-nowrap text-center animate-fade-in pointer-events-none">
                  <div className="text-xs font-black text-amber-200 font-display">
                    {node.isBoss
                      ? '👑 Final Boss Fortress: The Shadow King Malakor'
                      : node.isCastle
                      ? (isBossRealm ? `🏰 Guardian Fortress #${node.number}` : `🏰 Realm Castle #${node.number}`)
                      : `Stage #${node.number}`}
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                    {node.isCompleted ? (
                      <span className="text-emerald-400">⭐⭐⭐ Cleared</span>
                    ) : node.isLocked ? (
                      <span className="text-slate-500 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Locked</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><Play className="w-2.5 h-2.5 fill-current" /> Tap to Walk &amp; Enter</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Dust Puff when walking */}
        {dustPuff && (
          <div
            style={{ left: `${dustPuff.x}%`, top: `${dustPuff.y + 2}%` }}
            className="absolute z-22 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-sm animate-ping opacity-80"
          >
            💨
          </div>
        )}

        {/* Traveling Companion Guide Walking Alongside Player */}
        <div
          style={{
            left: `${avatarCoords.x - (walkFacing === 'left' ? -3.5 : 3.5)}%`,
            top: `${avatarCoords.y - 1}%`,
            transform: `translate(-50%, calc(-50% - ${hopOffset * 0.8}px))`,
            transition: isWalking ? 'left 0.15s linear, top 0.15s linear' : 'none'
          }}
          className="absolute z-28 pointer-events-none flex flex-col items-center select-none"
        >
          <div className="absolute -top-4 bg-slate-950/90 border border-amber-400/80 px-1.5 py-0.2 rounded-full shadow text-[8px] font-bold text-amber-200">
            {companionGuide.name}
          </div>
          <AvatarRenderer
            customization={companionGuide.customization}
            size={36}
            isWalking={isWalking}
            isJumping={hopOffset > 2}
            facing={walkFacing}
            walkCycle={walkCycle}
            showPet={false}
          />
        </div>

        {/* Player Explorer Avatar with Cute Walking/Hopping Animation directly on the Mario Path */}
        <div
          style={{
            left: `${avatarCoords.x}%`,
            top: `${avatarCoords.y - 2.5}%`,
            transform: `translate(-50%, calc(-50% - ${hopOffset}px))`,
            transition: isWalking ? 'left 0.15s linear, top 0.15s linear' : 'none'
          }}
          className="absolute z-30 pointer-events-none flex flex-col items-center select-none"
        >
          <div className="absolute -top-5 bg-slate-950/90 border-2 border-amber-400 px-2 py-0.5 rounded-full shadow text-[9px] font-black text-amber-300 uppercase tracking-wide">
            {activeExplorer.name}
          </div>
          <AvatarRenderer
            customization={activeExplorer.customization}
            size={50}
            isWalking={isWalking}
            isJumping={hopOffset > 2}
            facing={walkFacing}
            walkCycle={walkCycle}
            showPet={true}
          />
        </div>
      </div>

      {/* Bottom Info HUD */}
      <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-amber-500/40 flex items-center justify-between text-xs font-mono text-slate-300 z-30">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] sm:text-xs">
            {isWalking
              ? `Walking along Mario path to Stage #${transitioningStage}...`
              : `Standing at Stage #${currentStandingNode} · Tap any unlocked level pad to walk over!`}
          </span>
        </div>

        <button
          onClick={() => {
            const nextNode = nodes.find(n => n.number === currentStandingNode) || nodes[0];
            handleNodeClick(nextNode);
          }}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer active:scale-95 flex items-center gap-1"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Enter Stage #{currentStandingNode}</span>
        </button>
      </div>
    </div>
  );
};

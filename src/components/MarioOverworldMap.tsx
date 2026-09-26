import React, { useState } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { LandId } from '../types/character';
import { sounds } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { Star, CheckCircle2, ArrowLeft } from 'lucide-react';

interface StageNode {
  number: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isCastle: boolean;
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

  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [transitioningStage, setTransitioningStage] = useState<number | null>(null);

  // Mario S-Curve Winding Path layout across 50 nodes
  const nodes: StageNode[] = React.useMemo(() => {
    return Array.from({ length: totalStages }).map((_, idx) => {
      const stageNum = idx + 1;
      const isCompleted = stageNum <= completedStages;
      const isCurrent = stageNum === completedStages + 1;
      const isLocked = stageNum > completedStages + 1;
      const isCastle = stageNum % 10 === 0 || stageNum === totalStages;

      const row = Math.floor(idx / 10);
      const col = idx % 10;
      const xNorm = row % 2 === 0 ? col : 9 - col;
      const x = 8 + xNorm * 9.3;
      const y = 14 + row * 17.5;

      return {
        number: stageNum,
        isCompleted,
        isCurrent,
        isLocked,
        isCastle,
        stars: isCompleted ? 3 : 0,
        x,
        y,
      };
    });
  }, [totalStages, completedStages]);

  const handleNodeClick = (node: StageNode) => {
    if (node.isLocked || transitioningStage !== null) {
      sounds.playError();
      return;
    }

    sounds.playJump();
    setTransitioningStage(node.number);

    setTimeout(() => {
      sounds.playFanfare();
      onLaunchStage(node.number);
      setTransitioningStage(null);
    }, 600);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Banner */}
      <div className="p-3 bg-slate-900/90 border-b border-amber-500/40 flex items-center justify-between z-30">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs cursor-pointer shadow flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel</span>
        </button>

        <div className="text-center">
          <div className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <span>WORLD MAP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-sm sm:text-base font-black text-amber-200 font-display">
            {landName}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{completedStages * 3} Stars</span>
        </div>
      </div>

      {/* Interactive Overworld Map Canvas */}
      <div className="relative flex-1 w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/40 p-4">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60">
          <polyline
            points={nodes.map((n) => `${n.x}%,${n.y}%`).join(' ')}
            fill="none"
            stroke="#b45309"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>

        {nodes.map((node) => {
          const isHovered = hoveredStage === node.number;
          return (
            <div
              key={node.number}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredStage(node.number)}
              onMouseLeave={() => setHoveredStage(null)}
              onClick={() => handleNodeClick(node)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Mario Dot */}
              <div
                className={`relative rounded-full flex items-center justify-center transition-all ${
                  node.isCastle
                    ? 'w-7 h-7 sm:w-8 sm:h-8 bg-amber-950 border-2 border-amber-300 shadow-xl'
                    : 'w-4 h-4 sm:w-5 sm:h-5 bg-black border-2 border-slate-700 shadow-md'
                } ${
                  node.isCurrent
                    ? 'scale-135 ring-4 ring-amber-400 border-amber-300 bg-amber-500 animate-bounce shadow-[0_0_20px_rgba(245,158,11,1)]'
                    : node.isCompleted
                    ? 'border-emerald-400 bg-emerald-950'
                    : node.isLocked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-125'
                }`}
              >
                {node.isCastle ? (
                  <span className="text-xs">🏰</span>
                ) : node.isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ) : node.isCompleted ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                )}

                {node.isCompleted && !node.isCastle && (
                  <div className="absolute -top-3 -right-2 text-[10px]">🚩</div>
                )}
              </div>

              {node.isCurrent && transitioningStage === null && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-30">
                  <AvatarRenderer customization={activeExplorer.customization} size={38} showPet={false} />
                  <span className="text-[8px] font-black text-slate-950 bg-amber-400 px-1 rounded uppercase shadow -mt-1">
                    START
                  </span>
                </div>
              )}

              {transitioningStage === node.number && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-40 animate-bounce flex flex-col items-center">
                  <span className="text-xl">⭐</span>
                  <AvatarRenderer customization={activeExplorer.customization} size={44} showPet={true} />
                </div>
              )}

              {isHovered && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 px-2.5 py-1.5 rounded-xl shadow-2xl z-40 whitespace-nowrap text-center animate-fade-in pointer-events-none">
                  <div className="text-[11px] font-black text-amber-200">
                    {node.isCastle ? `Fortress #${node.number}` : `Course #${node.number}`}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400">
                    {node.isLocked ? 'Locked Course' : node.isCompleted ? 'Cleared! ⭐⭐⭐' : 'Tap to Play!'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-400">
        <span>🎮 Mario Course Path · 50 Quick Phonics Dots</span>
        <div className="flex items-center gap-2">
          <span>Companion:</span>
          <b className="text-amber-300">{companionGuide.name}</b>
        </div>
      </div>
    </div>
  );
};
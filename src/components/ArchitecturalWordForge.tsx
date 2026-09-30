import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { 
  Hammer, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  ShieldCheck, 
  Trophy, 
  ArrowLeft,
  Layers,
  Wrench,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Blueprint {
  id: string;
  name: string;
  category: 'CVC Starter' | 'Silent-E Arch' | 'Vowel Team Tower' | 'Multisyllabic Citadel';
  targetWord: string;
  syllableBreak: string[];
  slots: { label: string; correctLetter: string; type: 'consonant' | 'vowel' | 'digraph' | 'suffix' }[];
  pool: string[];
  ruleTip: string;
  historicalArchitectNote: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'bp-craft',
    name: 'Foundation of Craft',
    category: 'CVC Starter',
    targetWord: 'CRAFT',
    syllableBreak: ['CRAFT'],
    slots: [
      { label: 'Initial Blend', correctLetter: 'C', type: 'consonant' },
      { label: 'Blend Joint', correctLetter: 'R', type: 'consonant' },
      { label: 'Vowel Keystone', correctLetter: 'A', type: 'vowel' },
      { label: 'Final Joint', correctLetter: 'F', type: 'consonant' },
      { label: 'Anchor Stone', correctLetter: 'T', type: 'consonant' }
    ],
    pool: ['C', 'B', 'R', 'L', 'A', 'E', 'F', 'P', 'T', 'D'],
    ruleTip: 'Initial consonant blend /kr/ pairs with short /æ/ and ending consonant blend /ft/!',
    historicalArchitectNote: 'In the early guild eras, masons chiselled CRAFT into fortress lintels.'
  },
  {
    id: 'bp-bridge',
    name: 'Arch of the River Chasm',
    category: 'Silent-E Arch',
    targetWord: 'BRIDGE',
    syllableBreak: ['BRIDGE'],
    slots: [
      { label: 'Initial Pillar', correctLetter: 'B', type: 'consonant' },
      { label: 'Support Strut', correctLetter: 'R', type: 'consonant' },
      { label: 'Short Vowel Keystone', correctLetter: 'I', type: 'vowel' },
      { label: 'Trigraph Truss (DGE)', correctLetter: 'DGE', type: 'digraph' }
    ],
    pool: ['B', 'P', 'R', 'L', 'I', 'O', 'DGE', 'GE', 'TCH'],
    ruleTip: 'Rule: The -dge spelling pattern protects short vowels immediately before the /dʒ/ sound!',
    historicalArchitectNote: 'Masons used the -dge keystone whenever a short vowel required structural reinforcement.'
  },
  {
    id: 'bp-castle',
    name: 'Keep of the Silent Knight',
    category: 'Vowel Team Tower',
    targetWord: 'KNIGHT',
    syllableBreak: ['KNIGHT'],
    slots: [
      { label: 'Silent Guardian (KN)', correctLetter: 'KN', type: 'digraph' },
      { label: 'High Vowel Truss (IGH)', correctLetter: 'IGH', type: 'vowel' },
      { label: 'Anchor Buttress', correctLetter: 'T', type: 'consonant' }
    ],
    pool: ['KN', 'N', 'WR', 'IGH', 'AY', 'EE', 'T', 'D', 'K'],
    ruleTip: 'Trigraph /igh/ makes the long /aɪ/ sound, anchored by the historical silent /kn/ root!',
    historicalArchitectNote: 'Old English cniht once pronounced both the /k/ and the gutteral /gh/ before silent smoothing.'
  },
  {
    id: 'bp-construct',
    name: 'Imperial Construct Citadel',
    category: 'Multisyllabic Citadel',
    targetWord: 'CONSTRUCT',
    syllableBreak: ['CON', 'STRUCT'],
    slots: [
      { label: 'Prefix Stone', correctLetter: 'CON', type: 'consonant' },
      { label: 'Root Base (STRUCT)', correctLetter: 'STRUCT', type: 'consonant' }
    ],
    pool: ['CON', 'DIS', 'PRE', 'STRUCT', 'TRACT', 'PORT'],
    ruleTip: 'Latin prefix CON- (together) fuses to STRUCT (to build) forming CONSTRUCT!',
    historicalArchitectNote: 'The Builders Guild motto is "Ad Construendum Veritatem" (To Construct Truth).'
  }
];

interface ArchitecturalWordForgeProps {
  onBack: () => void;
}

export const ArchitecturalWordForge: React.FC<ArchitecturalWordForgeProps> = ({ onBack }) => {
  const { activeExplorer, updateExplorerScore, awardCurrency } = useGame();
  const [selectedBlueprintIndex, setSelectedBlueprintIndex] = useState(0);
  const currentBlueprint = BLUEPRINTS[selectedBlueprintIndex];

  const [placedSlots, setPlacedSlots] = useState<(string | null)[]>(
    new Array(currentBlueprint.slots.length).fill(null)
  );
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [isForged, setIsForged] = useState(false);
  const [stabilityPercent, setStabilityPercent] = useState(0);

  // Reset when blueprint changes
  useEffect(() => {
    setPlacedSlots(new Array(currentBlueprint.slots.length).fill(null));
    setSelectedSlotIndex(0);
    setIsForged(false);
    setStabilityPercent(0);
  }, [selectedBlueprintIndex, currentBlueprint.slots.length]);

  // Check word accuracy & stability
  const handlePlaceTile = (tile: string) => {
    if (isForged) return;
    sounds.playPlaceBlock();

    const newPlaced = [...placedSlots];
    newPlaced[selectedSlotIndex] = tile;
    setPlacedSlots(newPlaced);

    // Auto-advance to next empty slot
    const nextEmpty = newPlaced.findIndex((s, idx) => s === null && idx > selectedSlotIndex);
    if (nextEmpty !== -1) {
      setSelectedSlotIndex(nextEmpty);
    } else {
      const firstEmpty = newPlaced.findIndex((s) => s === null);
      if (firstEmpty !== -1) {
        setSelectedSlotIndex(firstEmpty);
      }
    }

    // Calculate stability
    let correctCount = 0;
    newPlaced.forEach((p, idx) => {
      if (p === currentBlueprint.slots[idx].correctLetter) {
        correctCount++;
      }
    });
    const calculatedStability = Math.round((correctCount / currentBlueprint.slots.length) * 100);
    setStabilityPercent(calculatedStability);

    // Check if whole word is forged
    const isComplete = newPlaced.every((p, idx) => p === currentBlueprint.slots[idx].correctLetter);
    if (isComplete) {
      setIsForged(true);
      sounds.playSuccess();
      sounds.speak(`Blueprint complete! ${currentBlueprint.targetWord}! ${currentBlueprint.ruleTip}`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      updateExplorerScore('builders-guild', 1, 3);
      awardCurrency(30, 2);
    }
  };

  const handleClearSlot = (idx: number) => {
    if (isForged) return;
    sounds.playClick();
    const newPlaced = [...placedSlots];
    newPlaced[idx] = null;
    setPlacedSlots(newPlaced);
    setSelectedSlotIndex(idx);

    let correctCount = 0;
    newPlaced.forEach((p, i) => {
      if (p === currentBlueprint.slots[i].correctLetter) correctCount++;
    });
    setStabilityPercent(Math.round((correctCount / currentBlueprint.slots.length) * 100));
  };

  const handleListenWord = () => {
    sounds.speak(currentBlueprint.targetWord);
  };

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-gradient-to-b from-stone-950 via-amber-950/40 to-stone-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none fixed inset-0">
      
      {/* Top Header */}
      <div className="px-4 py-3 bg-stone-950/95 border-b border-amber-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-stone-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Realm Map
          </button>
          <div>
            <div className="text-amber-400 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 font-display">
              <Hammer className="w-3.5 h-3.5" />
              Realm 2: Builders Guild Flagship
            </div>
            <h1 className="text-lg font-black text-amber-100 tracking-wide font-display">
              The Architectural Word Forge
            </h1>
          </div>
        </div>

        {/* Stability Meter */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-stone-400">Architectural Stability</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-3 rounded-full bg-stone-800 overflow-hidden border border-stone-700">
                <div 
                  className={`h-full transition-all duration-500 ${
                    stabilityPercent === 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : stabilityPercent > 50 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${stabilityPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs font-black text-amber-300">{stabilityPercent}%</span>
            </div>
          </div>

          <button
            onClick={handleListenWord}
            className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 flex items-center justify-center transition"
            title="Hear Target Word Pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Workbench Body */}
      <div className="flex-1 flex flex-col md:flex-row p-3 sm:p-6 gap-4 overflow-hidden max-w-7xl mx-auto w-full">
        
        {/* Left Column: Blueprint Selector & Lore */}
        <div className="w-full md:w-80 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Select Blueprint
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {selectedBlueprintIndex + 1}/{BLUEPRINTS.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {BLUEPRINTS.map((bp, idx) => (
                <button
                  key={bp.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedBlueprintIndex(idx);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    selectedBlueprintIndex === idx
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-stone-800/60 border-stone-700/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div>
                    <div className="font-bold">{bp.name}</div>
                    <div className="text-[10px] text-stone-400">{bp.category} • {bp.targetWord}</div>
                  </div>
                  {selectedBlueprintIndex === idx && <Sparkles className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Historical Architect Tablet */}
          <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex-1 flex flex-col justify-between text-xs">
            <div>
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Architect's Rule Tablet
              </div>
              <p className="text-stone-300 leading-relaxed italic mb-3">
                "{currentBlueprint.ruleTip}"
              </p>
              <div className="text-[11px] text-stone-400 leading-normal border-t border-stone-800 pt-2">
                <span className="text-amber-400/80 font-bold block mb-0.5">Guild Chronicle:</span>
                {currentBlueprint.historicalArchitectNote}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>Target: <strong className="text-amber-300 font-black">{currentBlueprint.targetWord}</strong></span>
              <span>Syllables: {currentBlueprint.syllableBreak.join(' • ')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Word Scaffold & Stone Quarry Pool */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 rounded-3xl bg-stone-900/80 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
          
          {/* Construction Scaffold */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="text-xs uppercase font-bold tracking-widest text-amber-400/80 mb-6 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Slot Granite Phoneme Stones into Keystone Sockets
            </div>

            {/* Word Structure Frame */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-3xl bg-stone-950/80 border-2 border-stone-700 shadow-inner">
              {currentBlueprint.slots.map((slot, idx) => {
                const placed = placedSlots[idx];
                const isSelected = selectedSlotIndex === idx;
                const isCorrect = placed === slot.correctLetter;

                // Color code by phoneme category
                let tileColor = 'bg-stone-800 border-stone-600 text-stone-200';
                if (placed) {
                  if (slot.type === 'vowel') {
                    tileColor = 'bg-gradient-to-b from-rose-500 to-red-600 border-red-300 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]';
                  } else if (slot.type === 'digraph') {
                    tileColor = 'bg-gradient-to-b from-purple-500 to-indigo-600 border-purple-300 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]';
                  } else {
                    tileColor = 'bg-gradient-to-b from-blue-500 to-sky-600 border-sky-300 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
                  }
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedSlotIndex(idx);
                        if (placed) handleClearSlot(idx);
                      }}
                      className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center transition-all transform ${
                        isSelected 
                          ? 'border-amber-400 ring-4 ring-amber-400/30 scale-105' 
                          : 'border-stone-600'
                      } ${placed ? tileColor : 'bg-stone-900/90 text-stone-500 hover:bg-stone-850'}`}
                    >
                      {placed ? (
                        <span className="font-display font-black text-2xl sm:text-3xl tracking-wide">
                          {placed}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-stone-600 font-bold">
                          [{idx + 1}]
                        </span>
                      )}
                    </button>
                    <span className="text-[10px] font-bold text-stone-400 text-center max-w-[80px] leading-tight">
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Victory Celebration Banner */}
            {isForged && (
              <div className="mt-6 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black flex items-center gap-3 animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <Trophy className="w-5 h-5" />
                <span>ARCHITECTURAL MASTERY ACHIEVED! +30 COINS &amp; 3 STARS</span>
              </div>
            )}
          </div>

          {/* Bottom Phoneme Stone Quarry */}
          <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 font-bold mb-3">
              <span>Granite Letter Quarry (Click stone to place into active socket)</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setPlacedSlots(new Array(currentBlueprint.slots.length).fill(null));
                  setSelectedSlotIndex(0);
                  setIsForged(false);
                  setStabilityPercent(0);
                }}
                className="text-stone-400 hover:text-amber-300 flex items-center gap-1 text-[11px] transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sockets
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              {currentBlueprint.pool.map((tile, i) => (
                <button
                  key={i}
                  onClick={() => handlePlaceTile(tile)}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-2 border-stone-600 hover:border-amber-400 text-amber-200 font-display font-black text-lg sm:text-xl shadow-[0_4px_0_rgba(28,25,23,1)] active:translate-y-1 active:shadow-none hover:from-stone-650 transition"
                >
                  {tile}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GRADE_MILESTONES } from '../data/lifelongCurriculumData';
import { GradeLevel } from '../types/character';
import { 
  BookMarked, 
  Target, 
  Award, 
  CheckCircle, 
  Sparkles, 
  ArrowLeft,
  X,
  Compass,
  FileCheck
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GradeMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeMilestonesModal: React.FC<GradeMilestonesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeExplorer, updateGradeLevel } = useGame();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    activeExplorer.gradeLevel || 'Kindergarten'
  );

  if (!isOpen) return null;

  const milestone = GRADE_MILESTONES[selectedGrade] || GRADE_MILESTONES['Kindergarten'];
  const allGrades = Object.keys(GRADE_MILESTONES) as GradeLevel[];

  const handleSelectGrade = (grade: GradeLevel) => {
    sounds.playClick();
    setSelectedGrade(grade);
  };

  const handleApplyPlacement = () => {
    sounds.playSuccess();
    updateGradeLevel(selectedGrade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl">
              📜
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200 tracking-wide font-display flex items-center gap-2">
                19-Tier Lifelong Literacy Curriculum
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  PreK3 → Doctorate
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Science of Reading Standards, Target WCPM, and Mastery Requirements across all stages of human learning.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6 text-sm">
          
          {/* Grade Tiers Horizontal/Vertical Rail */}
          <div className="w-full lg:w-72 space-y-1.5 max-h-[70vh] overflow-y-auto pr-2">
            <span className="text-xs uppercase font-bold text-amber-400 block mb-2">
              Select Grade Placement:
            </span>
            {allGrades.map((g) => {
              const isSelected = selectedGrade === g;
              const isCurrent = activeExplorer.gradeLevel === g;
              return (
                <button
                  key={g}
                  onClick={() => handleSelectGrade(g)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{g}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {GRADE_MILESTONES[g]?.ageRange}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Details Pane */}
          <div className="flex-1 p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono">
                  {milestone.ageRange}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Target Fluency:</span>
                  <span className="text-xs font-mono font-black text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {milestone.targetWCPM === 0 ? 'Oral / Emergent' : `${milestone.targetWCPM} WCPM`}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-amber-100 font-display mb-1">
                {milestone.grade}: {milestone.focusDomain}
              </h3>
              
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6">
                <strong className="text-amber-400 block mb-1">Science of Reading Foundation:</strong>
                {milestone.scienceOfReadingAnchor}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
                
                {/* Phonemic Milestones */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Phonemic Awareness &amp; Decoding Milestones:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {milestone.phonemicMilestones.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Comprehension Milestones */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-300 block mb-2 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" />
                    Comprehension &amp; Syntax Milestones:
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {milestone.comprehensionMilestones.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* End of Year Mastery */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-300 block mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  End-of-Year Mastery Expectation:
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">{milestone.masteryRequirements}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Sets active learning tier &amp; calibrates procedural challenge difficulty.
              </span>
              <button
                onClick={handleApplyPlacement}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
              >
                Set {selectedGrade} Placement
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

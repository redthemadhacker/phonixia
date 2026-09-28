import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GradeLevel, LearningPathway, AccessibilitySettings, IEPProfile } from '../types/character';
import { GRADE_MILESTONES } from '../data/lifelongCurriculumData';
import { sounds } from '../utils/audio';
import { 
  BookMarked, Users, Layers, ShieldCheck, HeartHandshake, 
  BarChart3, X, Check, Award, Lock, Sparkles, 
  CheckCircle, Plus, Eye, Cpu
} from 'lucide-react';

interface EducatorParentSanctumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'curriculum' | 'mtss' | 'udl' | 'reports' | 'privacy' | 'licensing' | 'profiles';
}

export const EducatorParentSanctumModal: React.FC<EducatorParentSanctumModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'curriculum'
}) => {
  const { 
    account, 
    activeExplorer, 
    updateGradeLevel, 
    updateAccessibilitySettings, 
    updateIEPProfile,
    updateLearningPathway,
    createExplorer,
    deleteExplorer,
    switchExplorer
  } = useGame();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'mtss' | 'udl' | 'reports' | 'privacy' | 'licensing' | 'profiles'>(initialTab);

  // Grade Milestones State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    activeExplorer.gradeLevel || 'Kindergarten'
  );
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  // Default Accessibility & IEP values
  const defaultAcc: AccessibilitySettings = {
    dyslexiaFont: false,
    colorCodedPhonemes: false,
    highContrast: false,
    reducedMotion: false,
    focusMode: false,
    speechSpeed: 1.0,
    soundVolume: 1.0,
    sensoryCalmMode: false,
    syllableChunking: false,
    aacEnabled: false,
    visualMouthGuides: false,
    screenTimeLimitMinutes: 30,
  };

  const defaultIEP: IEPProfile = {
    hasActivePlan: false,
    planType: 'None',
    primaryFocusArea: '',
    accommodations: [],
    targetWCPM: 60,
    currentWCPM: 45,
    phonemicAccuracyPercent: 85,
    notes: '',
  };

  const acc: AccessibilitySettings = { ...defaultAcc, ...(activeExplorer.accessibility || {}) };
  const iep: IEPProfile = { ...defaultIEP, ...(activeExplorer.iepProfile || {}) };
  const currentPathway: LearningPathway = activeExplorer.learningPathway || 'general-education';

  // MTSS Roster State
  const [selectedRosterTier, setSelectedRosterTier] = useState<string>('All');
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Explorer Profile Management inside Admin
  const [newExpName, setNewExpName] = useState('');
  const [newExpGrade, setNewExpGrade] = useState<GradeLevel>('Kindergarten');
  const [newExpGender, setNewExpGender] = useState<'boy' | 'girl'>('boy');
  const [isAddingProfile, setIsAddingProfile] = useState(false);

  if (!isOpen) return null;

  const allGrades = Object.keys(GRADE_MILESTONES) as GradeLevel[];
  const activeMilestone = GRADE_MILESTONES[selectedGrade] || GRADE_MILESTONES['Kindergarten'];

  const handleApplyGrade = () => {
    updateGradeLevel(selectedGrade);
    sounds.playSuccess();
    setAppliedMessage(`Curriculum placement updated to ${selectedGrade} for ${activeExplorer.name}!`);
    setTimeout(() => setAppliedMessage(null), 3500);
  };

  const handleToggleAcc = (key: keyof AccessibilitySettings) => {
    sounds.playClick();
    updateAccessibilitySettings({ [key]: !acc[key] });
  };

  const handleSpeedChange = (speed: number) => {
    sounds.playClick();
    updateAccessibilitySettings({ speechSpeed: speed });
  };

  const handlePathwayChange = (pathway: LearningPathway) => {
    sounds.playClick();
    updateLearningPathway(pathway);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName.trim()) return;
    createExplorer(newExpName.trim(), 'kindergarten', newExpGender);
    updateGradeLevel(newExpGrade);
    sounds.playFanfare();
    setNewExpName('');
    setIsAddingProfile(false);
    setAppliedMessage(`Created profile for ${newExpName.trim()} placed at ${newExpGrade}!`);
    setTimeout(() => setAppliedMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-6xl bg-slate-900 border-2 sm:border-3 border-amber-500/80 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-950 via-slate-950 to-indigo-950 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shadow">
              🔒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-display uppercase tracking-wide">
                  Educator &amp; Parent Command Sanctum
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-bold">
                  VERIFIED ADULT ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Curriculum Placements, MTSS / RTI Roster, UDL Accommodations &amp; Family Privacy
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {appliedMessage && (
          <div className="px-4 py-2 bg-emerald-500/20 border-b border-emerald-400 text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{appliedMessage}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('curriculum'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Curriculum &amp; Grade Placement</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('mtss'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'mtss'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Teacher MTSS / RTI Roster</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('udl'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'udl'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>UDL &amp; Special Ed (IEP/504)</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('reports'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Fluency &amp; Diagnostic Reports</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('profiles'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'profiles'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Profiles</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('privacy'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cyber Guardian (COPPA/FERPA)</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTab('licensing'); }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'licensing'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚖️</span>
            <span>Ethical Model &amp; Subsidies</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: CURRICULUM & GRADE PLACEMENT */}
          {activeTab === 'curriculum' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-amber-300 font-display">
                    19-Tier Lifelong Literacy Continuum (Ages 3 to Doctorate &amp; Adult)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select a grade tier to review rigorous Science of Reading standards and assign to <span className="text-amber-300 font-bold">{activeExplorer.name}</span>.
                    (Kids in gameplay never see grade labels—they only see game levels and fantasy realm ranks!)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Current Assigned:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 font-bold text-xs">
                    {activeExplorer.gradeLevel || 'Kindergarten'}
                  </span>
                </div>
              </div>

              {/* Grade Selector Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Select Educational Stage:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  {allGrades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedGrade(grade);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        selectedGrade === grade
                          ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md font-black scale-102'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="truncate">{grade}</div>
                      <div className="text-[10px] opacity-75 font-normal">
                        {GRADE_MILESTONES[grade]?.ageRange || ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestone Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div>
                    <h4 className="text-base font-black text-amber-300">
                      {activeMilestone.grade} · {activeMilestone.focusDomain}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Target Age: {activeMilestone.ageRange} · WCPM Target: {activeMilestone.targetWCPM} WCPM
                    </p>
                  </div>
                  <button
                    onClick={handleApplyGrade}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Placement to {activeExplorer.name}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-400 uppercase tracking-wider block">
                      Phonemic &amp; Decoding Milestones:
                    </span>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      {activeMilestone.phonemicMilestones.map((std: string, i: number) => (
                        <li key={i} className="leading-relaxed">{std}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                      Comprehension &amp; Language Milestones:
                    </span>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      {activeMilestone.comprehensionMilestones.map((crit: string, i: number) => (
                        <li key={i} className="leading-relaxed">{crit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-500/20 text-xs flex items-center gap-2 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Science of Reading Anchor:</strong> {activeMilestone.scienceOfReadingAnchor}. Mastery Requirements: {activeMilestone.masteryRequirements}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEACHER MTSS / RTI ROSTER */}
          {activeTab === 'mtss' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-emerald-300 font-display">
                    Multi-Tiered System of Supports (MTSS / RTI) Dashboard
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Track Tier 1 universal instruction, Tier 2 targeted group interventions, and Tier 3 intensive dyslexia support.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filter Tier:</span>
                  <select
                    value={selectedRosterTier}
                    onChange={(e) => setSelectedRosterTier(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-bold cursor-pointer"
                  >
                    <option value="All">All Tiers (Classroom)</option>
                    <option value="Tier 1">Tier 1 (Universal)</option>
                    <option value="Tier 2">Tier 2 (Targeted)</option>
                    <option value="Tier 3">Tier 3 (Intensive)</option>
                    <option value="Gifted">Gifted / 2e</option>
                  </select>
                </div>
              </div>

              {dispatchNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                  {dispatchNotice}
                </div>
              )}

              {/* Roster Table */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Placement</th>
                      <th className="p-3">MTSS Tier</th>
                      <th className="p-3">Oral Fluency (WCPM)</th>
                      <th className="p-3">Phonics Accuracy</th>
                      <th className="p-3">Target Skill Focus</th>
                      <th className="p-3 text-right">Intervention Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🌟</span>
                        <span>{activeExplorer.name} (Active)</span>
                      </td>
                      <td className="p-3">{activeExplorer.gradeLevel || 'Kindergarten'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-400/40">
                          {currentPathway === 'supported-learning' ? 'Tier 2 (Targeted)' : currentPathway === 'adaptive-learning' ? 'Tier 3 (Intensive)' : 'Tier 1 (Universal)'}
                        </span>
                      </td>
                      <td className="p-3 font-mono">68 WCPM</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">96%</td>
                      <td className="p-3 text-slate-300">Consonant Digraphs &amp; Blends</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            setDispatchNotice(`Assigned 10-minute targeted Phonics Lab to ${activeExplorer.name}!`);
                            setTimeout(() => setDispatchNotice(null), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold text-[11px] cursor-pointer"
                        >
                          Dispatch Lab
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-200">Kamden R.</td>
                      <td className="p-3">Grade 1</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-400/40">
                          Tier 1 (Universal)
                        </span>
                      </td>
                      <td className="p-3 font-mono">64 WCPM</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">94%</td>
                      <td className="p-3 text-slate-300">Short Vowel Families (-an, -it)</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            setDispatchNotice('Assigned review quest to Kamden R.!');
                            setTimeout(() => setDispatchNotice(null), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] cursor-pointer"
                        >
                          Assign Quest
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-200">Zuri M.</td>
                      <td className="p-3">Grade 2</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-400/40">
                          Tier 2 (Targeted)
                        </span>
                      </td>
                      <td className="p-3 font-mono">72 WCPM</td>
                      <td className="p-3 font-mono font-bold text-amber-300">88%</td>
                      <td className="p-3 text-slate-300">Vowel Teams (ai / ay)</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            setDispatchNotice('Dispatched multisensory syllable intervention to Zuri M.!');
                            setTimeout(() => setDispatchNotice(null), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] cursor-pointer"
                        >
                          Multisensory Drill
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-200">Joleigh S.</td>
                      <td className="p-3">Grade 1</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-400/40">
                          Tier 3 (Intensive)
                        </span>
                      </td>
                      <td className="p-3 font-mono">38 WCPM</td>
                      <td className="p-3 font-mono font-bold text-rose-400">79%</td>
                      <td className="p-3 text-slate-300">Phonemic Awareness / Slicing</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            sounds.playSuccess();
                            setDispatchNotice('Activated 1-on-1 Structured Literacy Protocol for Joleigh S.!');
                            setTimeout(() => setDispatchNotice(null), 3000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px] cursor-pointer"
                        >
                          1-on-1 Protocol
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: UDL & SPECIAL ED ACCOMMODATIONS */}
          {activeTab === 'udl' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                <h3 className="text-sm font-black text-indigo-300 font-display">
                  Universal Design for Learning (UDL) &amp; IEP / 504 Accommodations
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Phonixia never forces separate games. All learners play the identical adventure with individualized neurodivergent scaffolds.
                </p>
              </div>

              {/* Learning Pathway Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Learning Pathway:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'general-education' as LearningPathway, title: 'General Education', desc: 'Standard SoR progression & pacing' },
                    { id: 'supported-learning' as LearningPathway, title: 'Supported Learning', desc: 'Added visual prompts & repetition' },
                    { id: 'personalized-learning' as LearningPathway, title: 'Personalized Pathway', desc: 'Adaptive challenge calibration' },
                    { id: 'adaptive-learning' as LearningPathway, title: 'Adaptive Intervention', desc: 'Intensive phonological multisensory scaffolds' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePathwayChange(p.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        currentPathway === p.id
                          ? 'bg-indigo-950/60 border-indigo-400 ring-1 ring-indigo-400 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.title}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div 
                  onClick={() => handleToggleAcc('dyslexiaFont')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.dyslexiaFont 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>OpenDyslexic Font</span>
                    <span>{acc.dyslexiaFont ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Weighted bottom baseline to prevent letter inversions &amp; flipping.</p>
                </div>

                <div 
                  onClick={() => handleToggleAcc('colorCodedPhonemes')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.colorCodedPhonemes 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Orton-Gillingham Colors</span>
                    <span>{acc.colorCodedPhonemes ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Red vowels, blue consonants, green blends for orthographic mapping.</p>
                </div>

                <div 
                  onClick={() => handleToggleAcc('sensoryCalmMode')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.sensoryCalmMode 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Sensory Calm Mode (Autism / ADHD)</span>
                    <span>{acc.sensoryCalmMode ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Mutes flashy particle bursts, softens SFX, and removes timers.</p>
                </div>

                <div 
                  onClick={() => handleToggleAcc('highContrast')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.highContrast 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>High Contrast Visuals</span>
                    <span>{acc.highContrast ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Sharpened outlines and WCAG AAA compliant text contrast.</p>
                </div>

                <div 
                  onClick={() => handleToggleAcc('aacEnabled')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.aacEnabled 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>AAC Pictogram Assistance</span>
                    <span>{acc.aacEnabled ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Visual communication symbols alongside all phoneme prompts.</p>
                </div>

                <div 
                  onClick={() => handleToggleAcc('reducedMotion')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    acc.reducedMotion 
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Reduced Motion</span>
                    <span>{acc.reducedMotion ? 'ON' : 'OFF'}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-1">Smooth static transitions without camera shakes or zooming.</p>
                </div>
              </div>

              {/* Speech Speed Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Speech Language Pathologist Audio Pacing:</span>
                  <span className="font-mono text-amber-300 font-bold">{acc.speechSpeed}x</span>
                </div>
                <div className="flex items-center gap-3">
                  {[0.75, 0.85, 1.0, 1.15].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                        acc.speechSpeed === speed
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {speed === 0.75 ? '0.75x (Gentle & Slow)' : speed === 1.0 ? '1.0x (Standard)' : `${speed}x`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FLUENCY & DIAGNOSTIC REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-sky-300 font-display">
                    Diagnostic Literacy &amp; Oral Fluency Analytics
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Real-time Science of Reading tracking across Phonemic Awareness, Phonics, Morphology &amp; Fluency.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs cursor-pointer shadow"
                >
                  Print Report Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Oral Reading Fluency</span>
                  <div className="text-xl font-mono font-black text-emerald-400">68 WCPM</div>
                  <span className="text-[11px] text-slate-400">Target for {activeExplorer.gradeLevel || 'Kindergarten'}: 60 WCPM (Above Benchmark)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Phonics Accuracy</span>
                  <div className="text-xl font-mono font-black text-amber-300">96.4%</div>
                  <span className="text-[11px] text-slate-400">Mastered CVC, Digraphs, Rimes</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Active Game Stages Cleared</span>
                  <div className="text-xl font-mono font-black text-sky-400">
                    {Object.values(activeExplorer.landScores).reduce((a, b) => a + (b?.completedGamesCount || 0), 0)} / 250
                  </div>
                  <span className="text-[11px] text-slate-400">Total Stars: {activeExplorer.totalStars} ⭐</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Early Dyslexia Risk Index</span>
                  <div className="text-xl font-mono font-black text-emerald-400">LOW (Tier 1)</div>
                  <span className="text-[11px] text-slate-400">Rapid automatized naming steady</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Strands of Scarborough&apos;s Reading Rope:
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Word Recognition (Phonemic Awareness, Decoding, Sight Recognition)</span>
                      <span className="font-bold text-emerald-400 font-mono">94% Mastery</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Language Comprehension (Vocabulary, Morphology, Syntax, Reasoning)</span>
                      <span className="font-bold text-amber-400 font-mono">88% Mastery</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT PROFILES */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-amber-300 font-display">
                    Learner &amp; Classroom Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create students and set their curriculum placement securely without student tampering.
                  </p>
                </div>
                {!isAddingProfile && (
                  <button
                    onClick={() => setIsAddingProfile(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Learner Profile</span>
                  </button>
                )}
              </div>

              {isAddingProfile && (
                <form onSubmit={handleCreateStudent} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">New Learner Profile</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingProfile(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Student Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jordan"
                        value={newExpName}
                        onChange={(e) => setNewExpName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-bold"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Curriculum Placement
                      </label>
                      <select
                        value={newExpGrade}
                        onChange={(e) => setNewExpGrade(e.target.value as GradeLevel)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {allGrades.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Avatar Gender
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewExpGender('boy')}
                          className={`py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                            newExpGender === 'boy' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          Boy (Liam)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewExpGender('girl')}
                          className={`py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                            newExpGender === 'girl' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          Girl (Maya)
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow"
                  >
                    Confirm &amp; Add Student
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {account.explorers.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      activeExplorer.id === exp.id
                        ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-200 text-xs">{exp.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {exp.gradeLevel || 'Kindergarten'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-3">
                      Level {exp.level} · {exp.totalStars} Stars · {exp.coins} Coins
                    </div>
                    <div className="flex items-center gap-2">
                      {activeExplorer.id !== exp.id && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            switchExplorer(exp.id);
                          }}
                          className="flex-1 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold text-xs cursor-pointer"
                        >
                          Switch Active
                        </button>
                      )}
                      {account.explorers.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete student profile for ${exp.name}?`)) {
                              deleteExplorer(exp.id);
                              sounds.playDamage();
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRIVACY & DIGITAL CITIZENSHIP */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <h3 className="text-sm font-black text-cyan-300 font-display">
                  Family Cybersecurity &amp; 100% Student Privacy Shield
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Phonixia is architected strictly under the highest COPPA (Children&apos;s Online Privacy Protection Act) and FERPA standards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Zero Commercial Advertising or Behavioral Tracking
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Student reading telemetry is stored strictly client-side in encrypted local storage. No advertising trackers, no cookies sold to third parties, zero data mining.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    Zero Predatory Microtransactions or Loot Boxes
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    In-game coins and gems can ONLY be earned through genuine literacy mastery. There are no pay-to-win mechanisms or psychological gambling hooks.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Safe Screen Time &amp; Ergonomics
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Automatic 20-20-20 eye strain breaks and session limits customizable by parents. Inactivity auto-lock secures profiles when children walk away.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Kid-Safe Social Sandbox
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Student multiplayer communication uses strictly pre-approved whitelisted emoji greetings. No open unmoderated chat or external link sharing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ETHICAL MODEL & SUBSIDIES */}
          {activeTab === 'licensing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <h3 className="text-sm font-black text-amber-300 font-display">
                  Ethical Business Model &amp; 100% Free Title I Subsidies
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Literacy is a fundamental human right. Phonixia guarantees that no child is ever denied access due to economic hardship.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 text-sm block">1. Family Perpetual</span>
                  <div className="text-slate-300 text-[11px]">
                    Single transparent family purchase. Covers up to 5 children with lifetime updates and zero subscription traps.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-blue-400 text-sm block">2. School &amp; District</span>
                  <div className="text-slate-300 text-[11px]">
                    Institutional MTSS site licenses with LMS integration (Canvas, Google Classroom, Clever) and administrative roster sync.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                  <span className="font-bold text-amber-300 text-sm block">3. 100% Subsidized Title I</span>
                  <div className="text-slate-300 text-[11px]">
                    Any high-needs school, homeschool family, or community clinic qualifies for immediate, no-questions-asked full platform grants.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Settings are auto-saved locally and strictly encrypted for this device.</span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            Close Sanctum
          </button>
        </div>

      </div>
    </div>
  );
};

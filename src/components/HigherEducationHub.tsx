import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  PHONIXIA_COLLEGES, 
  MASTER_PATHWAYS, 
  DOCTORAL_ARCHIVE_TOPICS,
  MASTER_OF_PHONIXIA_CREED 
} from '../data/lifelongCurriculumData';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  ArrowLeft,
  X,
  Volume2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface HigherEducationHubProps {
  onBack: () => void;
  onLaunchStage: (landId: 'phonixia-academy' | 'masters-pathways' | 'celestial-archives', stageNumber: number) => void;
}

export const HigherEducationHub: React.FC<HigherEducationHubProps> = ({
  onBack,
  onLaunchStage
}) => {
  const { 
    activeExplorer, 
    inductMasterOfPhonixia, 
    recordDissertationCompleted,
    awardCurrency,
    awardScholarReputation
  } = useGame();

  const [activeTab, setActiveTab] = useState<'academy' | 'masters' | 'celestial'>('academy');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('linguistics');
  const [selectedMasterPathwayId, setSelectedMasterPathwayId] = useState<string>('master-author');
  const [selectedDoctoralTopicId, setSelectedDoctoralTopicId] = useState<string>('reading-science');
  const [defenseActive, setDefenseActive] = useState<boolean>(false);
  const [defenseStep, setDefenseStep] = useState<number>(1);

  const selectedCollege = PHONIXIA_COLLEGES.find((c) => c.id === selectedCollegeId) || PHONIXIA_COLLEGES[0];
  const selectedPathway = MASTER_PATHWAYS.find((p) => p.id === selectedMasterPathwayId) || MASTER_PATHWAYS[0];
  const selectedDoctoralTopic = DOCTORAL_ARCHIVE_TOPICS.find((d) => d.id === selectedDoctoralTopicId) || DOCTORAL_ARCHIVE_TOPICS[0];

  const handleDefenseSuccess = () => {
    sounds.playVictory();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    recordDissertationCompleted(selectedDoctoralTopic.id);
    inductMasterOfPhonixia();
    awardCurrency(200, 10);
    awardScholarReputation(50);
    setDefenseActive(false);
  };

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none fixed inset-0">
      
      {/* Top Banner HUD */}
      <div className="px-4 py-3 bg-slate-900/95 border-b border-purple-500/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            World Canvas
          </button>
          <div>
            <div className="text-purple-400 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 font-display">
              <GraduationCap className="w-3.5 h-3.5" />
              Higher Education &amp; Doctoral Endgame
            </div>
            <h1 className="text-lg font-black text-purple-100 tracking-wide font-display">
              Phonixia Academic Universe
            </h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('academy');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'academy'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Phonixia Academy
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('masters');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'masters'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Master’s Pathways
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('celestial');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'celestial'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Celestial Archives (PhD)
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* 1. PHONIXIA ACADEMY TAB */}
        {activeTab === 'academy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* College List */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                The 8 Colleges of Phonixia
              </div>
              {PHONIXIA_COLLEGES.map((college) => {
                const isSelected = selectedCollegeId === college.id;
                return (
                  <button
                    key={college.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCollegeId(college.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{college.name}</div>
                      <div className="text-[11px] text-purple-300/80">{college.deityDean}</div>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: college.color }} 
                    />
                  </button>
                );
              })}
            </div>

            {/* College Details View */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 font-mono">
                    Undergraduate &amp; Collegiate Honours
                  </span>
                  <button
                    onClick={() => onLaunchStage('phonixia-academy', 1)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Enter Seminar Quest
                  </button>
                </div>

                <h2 className="text-2xl font-black text-purple-200 font-display mb-1">
                  {selectedCollege.name}
                </h2>
                <p className="text-xs text-purple-400 italic mb-4 font-mono">
                  "{selectedCollege.motto}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-purple-300 block mb-1">Dean &amp; Faculty Lead:</span>
                    <span className="text-slate-200">{selectedCollege.deityDean}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-purple-300 block mb-1">Core Academic Focus:</span>
                    <span className="text-slate-200">{selectedCollege.focus}</span>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-6">
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-2">Curriculum Course Sequence:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedCollege.courses.map((course, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capstone Project */}
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs">
                  <span className="font-bold text-purple-300 block mb-1">Collegiate Capstone Defense:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedCollege.capstoneProject}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Career Outcomes: {selectedCollege.careerOutcomes.join(', ')}</span>
                <span className="text-purple-300 font-mono">120 Credits Required for Graduation</span>
              </div>
            </div>

          </div>
        )}

        {/* 2. MASTER'S PATHWAYS TAB */}
        {activeTab === 'masters' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pathway List */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                The 7 Master's Disciplines
              </div>
              {MASTER_PATHWAYS.map((pathway) => {
                const isSelected = selectedMasterPathwayId === pathway.id;
                return (
                  <button
                    key={pathway.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMasterPathwayId(pathway.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{pathway.title}</div>
                      <div className="text-[11px] text-emerald-300/80">{pathway.loreMasterTitle}</div>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: pathway.color }} 
                    />
                  </button>
                );
              })}
            </div>

            {/* Pathway Details View */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono">
                    Graduate Degree Candidacy
                  </span>
                  <button
                    onClick={() => onLaunchStage('masters-pathways', 1)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Commence Master Practicum
                  </button>
                </div>

                <h2 className="text-2xl font-black text-emerald-200 font-display mb-1">
                  {selectedPathway.title}
                </h2>
                <div className="text-xs text-emerald-400 font-bold mb-4">
                  Lore Master Title: "{selectedPathway.loreMasterTitle}"
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Clinical Practicum Requirement:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedPathway.practicumRequirement}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Master’s Thesis Topic:</span>
                    <p className="text-slate-300 leading-relaxed italic">"{selectedPathway.thesisTopic}"</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="font-bold text-emerald-300 block mb-2">Core Disciplines:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPathway.disciplines.map((d, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-[11px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Earns Gold Scholar Crest &amp; Clinical Fellowship</span>
                <span className="text-emerald-300 font-mono">Thesis Defense Required</span>
              </div>
            </div>

          </div>
        )}

        {/* 3. CELESTIAL ARCHIVES TAB (DOCTORAL ENDGAME) */}
        {activeTab === 'celestial' && (
          <div className="space-y-6">
            
            {/* Supreme Creed Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-yellow-950/70 border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
                    <Crown className="w-4 h-4" />
                    Doctoral Pinnacle of Reading Science &amp; Linguistics
                  </div>
                  <h2 className="text-2xl font-black text-amber-100 font-display">
                    The Celestial Archives
                  </h2>
                  <p className="text-xs text-amber-300/80 italic mt-2 max-w-2xl whitespace-pre-line leading-relaxed">
                    {MASTER_OF_PHONIXIA_CREED}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 bg-slate-950/80 p-4 rounded-2xl border border-amber-500/40">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Supreme Title Status:</span>
                    <span className="text-sm font-black text-amber-300">
                      {activeExplorer.isMasterOfPhonixia ? 'MASTER OF PHONIXIA' : 'DOCTORAL CANDIDATE'}
                    </span>
                  </div>
                  <button
                    onClick={() => setDefenseActive(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.6)] transition"
                  >
                    Defend Doctoral Dissertation
                  </button>
                </div>
              </div>
            </div>

            {/* Research Expeditions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOCTORAL_ARCHIVE_TOPICS.map((topic) => {
                const isCompleted = activeExplorer.completedDissertations?.includes(topic.id);
                return (
                  <div 
                    key={topic.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex flex-col justify-between space-y-4 hover:border-amber-400/70 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                          {topic.masterySeal}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" /> Defended
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-100 text-sm mb-2">{topic.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{topic.researchExpedition}</p>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Research Subfields:</span>
                        <div className="flex flex-wrap gap-1">
                          {topic.subfields.map((sf, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {sf}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onLaunchStage('celestial-archives', 1)}
                      className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Engage Research Expedition
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* Interactive Dissertation Defense Modal */}
      {defenseActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 mb-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Crown className="w-5 h-5 text-amber-400" />
                Celestial Senate Dissertation Hearing
              </div>
              <button 
                onClick={() => setDefenseActive(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p className="leading-relaxed">
                "Candidate <strong className="text-amber-200">{activeExplorer.name}</strong>, you stand before the Eternal Flamekeepers of Phonixia. Present your unified synthesis of the Science of Reading."
              </p>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">Defense Inquiry:</span>
                <p className="text-xs text-slate-300">
                  How does Stanislas Dehaene’s Neuronal Recycling Hypothesis explain the human ability to transform arbitrary visual orthography into spoken language and profound comprehension?
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDefenseSuccess}
                  className="w-full p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-left text-xs text-amber-200 transition"
                >
                  "By recycling primate object-recognition pathways in the left occipitotemporal cortex (Visual Word Form Area), reading connects graphemes to phonology and mental lexicon with lightning automaticity."
                </button>
                <button
                  onClick={() => sounds.playError()}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left text-xs text-slate-300 transition"
                >
                  "Reading is purely an innate biological reflex encoded directly into the human genetic sequence with no need for structured instruction."
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { useGame } from '../context/GameContext';
import { LearningPathway, AccessibilitySettings, IEPProfile } from '../types/character';
import { 
  Eye, 
  Volume2, 
  Sliders, 
  Sparkles, 
  FileText, 
  Clock, 
  Heart, 
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface AdaptiveAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdaptiveAccessibilityModal: React.FC<AdaptiveAccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeExplorer, updateAccessibilitySettings, updateIEPProfile, updateLearningPathway } = useGame();
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

  if (!isOpen) return null;

  const pathways: { id: LearningPathway; title: string; desc: string; icon: string }[] = [
    {
      id: 'general-education',
      title: 'General Education Pathway',
      desc: 'Standard curriculum progression aligned with grade-level Science of Reading standards.',
      icon: '🌱'
    },
    {
      id: 'supported-learning',
      title: 'Supported Learning Pathway',
      desc: 'Extra visual scaffolds, highlighted phoneme chunks, unlimited retries, and oral prompts.',
      icon: '🤝'
    },
    {
      id: 'personalized-learning',
      title: 'Personalized Learning Pathway',
      desc: 'Dynamic pacing based on mastery, recurring practice on struggling phonetic patterns.',
      icon: '🎯'
    },
    {
      id: 'adaptive-learning',
      title: 'Adaptive Learning Pathway (UDL)',
      desc: 'Full Universal Design for Learning: multisensory cues, AAC options, and cognitive supports.',
      icon: '⭐'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl">
              ♿
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200 tracking-wide font-display flex items-center gap-2">
                Universal Design & Adaptive Learning
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  UDL Architecture
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Phonixia is built for ALL learners: Dyslexia, ADHD, Autism, Speech Delays, Gifted, and AAC Users.
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* 1. Learning Pathway Selector */}
          <div>
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Active Learning Pathway for {activeExplorer.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pathways.map((p) => {
                const isSelected = activeExplorer.learningPathway === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sounds.playClick();
                      updateLearningPathway(p.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{p.icon}</span>
                      <span className="font-bold text-slate-100">{p.title}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Structured Literacy & Dyslexia Supports */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <h3 className="text-indigo-300 font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              Structured Literacy & Dyslexia Accommodations (Science of Reading)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Color-Coded Phonemes */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">Orton-Gillingham Color Coding</div>
                  <div className="text-[11px] text-slate-400">Blue consonants, Red vowels, Purple digraphs</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.colorCodedPhonemes}
                  onChange={(e) => updateAccessibilitySettings({ colorCodedPhonemes: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* Dyslexia High-Legibility Font */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">High-Legibility Dyslexia Font</div>
                  <div className="text-[11px] text-slate-400">Weighted letter bottoms to prevent flips (b/d/p/q)</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.dyslexiaFont}
                  onChange={(e) => updateAccessibilitySettings({ dyslexiaFont: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* Syllable Chunking */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">Visual Syllable Scaffolding</div>
                  <div className="text-[11px] text-slate-400">Breaks multisyllabic words into clear decodable parts</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.syllableChunking}
                  onChange={(e) => updateAccessibilitySettings({ syllableChunking: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* Visual Mouth Formation Guides */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">Visual Mouth Cues (Speech & SLP)</div>
                  <div className="text-[11px] text-slate-400">Shows tongue & lip placement for target phonemes</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.visualMouthGuides}
                  onChange={(e) => updateAccessibilitySettings({ visualMouthGuides: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>
            </div>
          </div>

          {/* 3. ADHD, Autism & Sensory Settings */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <h3 className="text-amber-300 font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Sensory, ADHD & Executive Functioning Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Focus Mode */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">ADHD Focus Mode</div>
                  <div className="text-[11px] text-slate-400">Hides peripheral HUD to reduce cognitive distraction</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.focusMode}
                  onChange={(e) => updateAccessibilitySettings({ focusMode: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* Sensory Calm Mode */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">Sensory Calm Mode (Autism / Sensitivity)</div>
                  <div className="text-[11px] text-slate-400">Gentle sound chimes, no abrupt flashes or shaking</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.sensoryCalmMode}
                  onChange={(e) => updateAccessibilitySettings({ sensoryCalmMode: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* AAC Symbol Board */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">AAC Picture Symbol Responses</div>
                  <div className="text-[11px] text-slate-400">Enables high-contrast symbol tiles for non-verbal learners</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.aacEnabled}
                  onChange={(e) => updateAccessibilitySettings({ aacEnabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>

              {/* High Contrast Mode */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-200 text-xs">High Contrast Mode</div>
                  <div className="text-[11px] text-slate-400">Deep blacks & ultra-bright text borders for low vision</div>
                </div>
                <input
                  type="checkbox"
                  checked={acc.highContrast}
                  onChange={(e) => updateAccessibilitySettings({ highContrast: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
              </label>
            </div>

            {/* Speech Rate Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Guide Speech Pacing:
                </span>
                <span className="font-mono text-amber-300 font-bold">{acc.speechSpeed}x speed</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={acc.speechSpeed}
                onChange={(e) => updateAccessibilitySettings({ speechSpeed: parseFloat(e.target.value) })}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.75x (Deliberate Phonics)</span>
                <span>1.0x (Standard)</span>
                <span>1.25x (Accelerated)</span>
              </div>
            </div>
          </div>

          {/* 4. IEP & 504 Documentation Card */}
          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-teal-300 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                School IEP / 504 / MTSS Plan Tracking
              </h3>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <span>Active Plan:</span>
                <input
                  type="checkbox"
                  checked={iep.hasActivePlan}
                  onChange={(e) => updateIEPProfile({ hasActivePlan: e.target.checked })}
                  className="w-4 h-4 rounded accent-teal-500"
                />
              </label>
            </div>

            {iep.hasActivePlan && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Plan Classification</span>
                  <select
                    value={iep.planType}
                    onChange={(e) => updateIEPProfile({ planType: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-1 text-slate-200"
                  >
                    <option value="IEP">IEP (Special Education)</option>
                    <option value="504">504 Accommodation Plan</option>
                    <option value="MTSS-Tier2">MTSS Tier 2 Targeted Support</option>
                    <option value="MTSS-Tier3">MTSS Tier 3 Intensive Support</option>
                    <option value="Gifted-Accelerated">Gifted & Accelerated (2e)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Target Reading WCPM</span>
                  <input
                    type="number"
                    value={iep.targetWCPM}
                    onChange={(e) => updateIEPProfile({ targetWCPM: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-1 text-slate-200 font-mono"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Phonemic Accuracy Target</span>
                  <input
                    type="number"
                    value={iep.phonemicAccuracyPercent}
                    onChange={(e) => updateIEPProfile({ phonemicAccuracyPercent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-1 text-slate-200 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Settings automatically sync to player profile & parent reports
          </span>
          <button
            onClick={() => {
              sounds.playSuccess();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
          >
            Apply Accommodations
          </button>
        </div>

      </div>
    </div>
  );
};

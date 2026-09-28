import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { 
  ShieldCheck, 
  Check, 
  HeartHandshake, 
  School, 
  Home, 
  Building2, 
  X,
  Sparkles,
  Award
} from 'lucide-react';

interface BusinessLicensingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessLicensingModal: React.FC<BusinessLicensingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { account } = useGame();
  const [selectedPlan, setSelectedPlan] = useState<string>('family-pro');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'family-free',
      name: 'Explorer Free Foundation',
      target: 'Families & Children',
      price: '$0',
      period: 'Forever Free',
      features: [
        'Complete Sound Shallows & Builders Guild access',
        'Full Science of Reading phonics curriculum',
        'Privacy-safe speech practice lab',
        'Up to 2 explorer profiles',
        'Zero ads, zero data tracking'
      ],
      badge: 'Public Good'
    },
    {
      id: 'family-pro',
      name: 'Family Lifelong Literacy Pro',
      target: 'Families & Homeschoolers',
      price: '$9.99',
      period: 'per month',
      features: [
        'All 5 Core Realms + Phonixia Academy & Celestial Archives',
        'Unlimited explorer profiles for siblings',
        'Advanced IEP / 504 accommodation trackers',
        'Parent dashboard with detailed WCPM & phonics diagnostics',
        'Offline play & multi-device cloud synchronization'
      ],
      badge: 'Most Popular'
    },
    {
      id: 'school-license',
      name: 'School & District Universal',
      target: 'K-12 Schools, Districts & Tutors',
      price: '$4.50',
      period: 'per student / year',
      features: [
        'Full MTSS Tier 1, 2, & 3 intervention suite',
        'Teacher dashboard with CSV roster exports',
        'Automated dyslexia risk screener analytics',
        'District-wide administrative control & single sign-on (SSO)',
        'Dedicated educational specialist onboarding & training'
      ],
      badge: 'Institutional'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-emerald-400/80 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-200 tracking-wide font-display flex items-center gap-2">
                Ethical Business &amp; Licensing Model
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Zero Exploitation
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                NO pay-to-win mechanics • NO loot boxes or gambling • 100% Student data privacy
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
          
          {/* Ethical Charter Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-emerald-300 font-bold block text-sm">The Phonixia Educational Charter</strong>
              <p className="text-slate-300 leading-relaxed">
                Reading is a fundamental human right. Phonixia rejects predatory freemium gaming patterns, artificial energy meters, and manipulative advertisements. All educational progression is unlocked through academic mastery and genuine student effort.
              </p>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedPlan(p.id);
                  }}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                        {p.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <h3 className="font-bold text-slate-100 text-base mb-1">{p.name}</h3>
                    <div className="text-xs text-slate-400 mb-3">{p.target}</div>

                    <div className="mb-4">
                      <span className="text-2xl font-black text-emerald-300">{p.price}</span>
                      <span className="text-xs text-slate-400 ml-1.5 font-mono">{p.period}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      isSelected
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Current Selection' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>School grants and Title I subsidies are available upon institutional request.</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { 
  ShieldCheck, 
  Lock, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  Key, 
  Globe, 
  X, 
  Sparkles,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CyberGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHISHING_SCENARIOS = [
  {
    id: 'phish-1',
    sender: 'Grand Scribe of Phonixia (admin@phonlxla-free-coins.xyz)',
    subject: 'URGENT: Claim 10,000 Free Golden Coins Immediately!',
    body: 'Greetings Explorer! Your account has won 10,000 free coins. Click this unverified portal link and enter your family parent password right now to claim!',
    isPhishing: true,
    explanation: 'PHISHING DETECTED! Look at the suspicious URL (phonlxla with an "l" instead of "i") and the urgent demand for your parent password. Authentic realm guides never ask for your password!'
  },
  {
    id: 'phish-2',
    sender: 'Builders Guild Master (curriculum@phonixia.edu)',
    subject: 'Weekly Phonics Progress: CVCe Long Vowel Quest Unlocked',
    body: 'Hello explorer family, Kam has completed Stage 10 in Builders Guild! Log in via your standard game app to view new syllable challenges.',
    isPhishing: false,
    explanation: 'SAFE & AUTHENTIC! Official @phonixia.edu domain, no demands for secret credentials, simply informs you of educational progress.'
  }
];

export const CyberGuardianModal: React.FC<CyberGuardianModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeExplorer, recordCyberBadge, awardCurrency } = useGame();
  
  const [testPassword, setTestPassword] = useState('');
  const [phishingStep, setPhishingStep] = useState(0);
  const [phishFeedback, setPhishFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password entropy evaluation
  const hasMinLength = testPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(testPassword);
  const hasLower = /[a-z]/.test(testPassword);
  const hasNumber = /[0-9]/.test(testPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(testPassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const currentPhish = PHISHING_SCENARIOS[phishingStep % PHISHING_SCENARIOS.length];

  const handleTestPhishChoice = (guessedPhishing: boolean) => {
    if (guessedPhishing === currentPhish.isPhishing) {
      sounds.playSuccess();
      setPhishFeedback(`CORRECT! ${currentPhish.explanation}`);
      recordCyberBadge(`phish-sleuth-${phishingStep + 1}`);
      awardCurrency(25, 2);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      sounds.playError();
      setPhishFeedback(`WATCH OUT! ${currentPhish.explanation}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-cyan-400/80 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-black text-cyan-200 tracking-wide font-display flex items-center gap-2">
                Cyber Guardian &amp; Family Digital Safety
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  Zero Trust Education
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Educating families and explorers in online privacy, password hygiene, and home Wi-Fi security.
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
          
          {/* 1. Interactive Password Fortress Builder */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Password Fortress &amp; Entropy Tester
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                strengthScore === 5 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400' :
                strengthScore >= 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-400' :
                'bg-rose-500/20 text-rose-300 border border-rose-400'
              }`}>
                Strength: {strengthScore}/5
              </span>
            </div>

            <input
              type="text"
              placeholder="Type a sample password to test fortress strength..."
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none"
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <span className={`p-2 rounded-lg border flex items-center gap-1.5 ${hasMinLength ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> 12+ Characters
              </span>
              <span className={`p-2 rounded-lg border flex items-center gap-1.5 ${hasUpper ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> Uppercase (A-Z)
              </span>
              <span className={`p-2 rounded-lg border flex items-center gap-1.5 ${hasLower ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> Lowercase (a-z)
              </span>
              <span className={`p-2 rounded-lg border flex items-center gap-1.5 ${hasNumber ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> Numbers (0-9)
              </span>
              <span className={`p-2 rounded-lg border flex items-center gap-1.5 ${hasSpecial ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> Symbols (!@#$)
              </span>
            </div>
          </div>

          {/* 2. Interactive Phishing Quest */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-blue-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-blue-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Phishing Detective Simulation: Is This Scroll Safe?
              </h3>
              <span className="text-xs text-slate-400 font-mono">Scenario #{phishingStep + 1}</span>
            </div>

            {/* Email Scroll Preview */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">
                <strong className="text-slate-300">From:</strong> {currentPhish.sender}
              </div>
              <div className="text-slate-400">
                <strong className="text-slate-300">Subject:</strong> {currentPhish.subject}
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-200 leading-relaxed font-sans mt-2">
                {currentPhish.body}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleTestPhishChoice(true)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                DANGER: This is a Phishing Trap!
              </button>
              <button
                onClick={() => handleTestPhishChoice(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4" />
                SAFE: Legitimate Realm Message
              </button>
            </div>

            {phishFeedback && (
              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-400/40 text-cyan-200 text-xs leading-relaxed animate-fade-in">
                {phishFeedback}
              </div>
            )}
          </div>

          {/* 3. Family Home Wi-Fi & Privacy Checklist */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              Family Home Wi-Fi &amp; Router Security Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">1. Update Default Admin</strong>
                <p className="text-slate-400 leading-normal">
                  Change the default router password (never leave it as "admin/admin").
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">2. WPA3 / WPA2 Encryption</strong>
                <p className="text-slate-400 leading-normal">
                  Ensure your home Wi-Fi network uses modern WPA2-AES or WPA3 encryption.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">3. Guest Network for IoT</strong>
                <p className="text-slate-400 leading-normal">
                  Put smart home bulbs and appliances on a separate guest Wi-Fi network.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Phonixia never monitors private home networks. We empower families through education.
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

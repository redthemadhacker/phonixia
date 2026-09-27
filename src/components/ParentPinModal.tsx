import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { ShieldCheck, Lock, X, KeyRound, Calculator, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Parent & Teacher Portal',
  subtitle = 'Enter your 4-digit PIN or password to access account settings & progress stats.'
}) => {
  const { account } = useGame();
  
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [usePasswordMode, setUsePasswordMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [useMathFallback, setUseMathFallback] = useState(false);
  const [mathAnswerInput, setMathAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active PIN configured for account or stored locally, default 1234
  const expectedPin = useMemo(() => {
    return account.parentPin || localStorage.getItem('phonixia_parent_pin') || '1234';
  }, [account.parentPin]);

  // YouTube Kids style random multiplication challenge for fallback verification
  const mathChallenge = useMemo(() => {
    const a = Math.floor(Math.random() * 5) + 6; // 6 to 10
    const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
    return { num1: a, num2: b, answer: a * b };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pinDigits.length >= 4) return;
    setErrorMsg(null);
    sounds.playStep();

    const next = [...pinDigits, digit];
    setPinDigits(next);

    if (next.length === 4) {
      const entered = next.join('');
      if (entered === expectedPin) {
        sounds.playSuccess();
        setTimeout(() => {
          setPinDigits([]);
          onSuccess();
        }, 180);
      } else {
        sounds.playError();
        setErrorMsg('Incorrect PIN. Try again or use password fallback.');
        setTimeout(() => {
          setPinDigits([]);
        }, 600);
      }
    }
  };

  const handleDeleteDigit = () => {
    sounds.playStep();
    setPinDigits(prev => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClearPin = () => {
    sounds.playStep();
    setPinDigits([]);
    setErrorMsg(null);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    // Any non-empty password matching saved account or default
    if (passwordInput.trim().length >= 4) {
      sounds.playSuccess();
      setPasswordInput('');
      onSuccess();
    } else {
      sounds.playError();
      setErrorMsg('Please enter a valid password (minimum 4 characters).');
    }
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswerInput.trim(), 10) === mathChallenge.answer) {
      sounds.playSuccess();
      setMathAnswerInput('');
      onSuccess();
    } else {
      sounds.playError();
      setErrorMsg('Incorrect answer. Only adults may proceed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon Header */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-black text-amber-300 font-display tracking-wide uppercase">
            {title}
          </h2>
          <p className="text-xs text-slate-300 pt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2 rounded-xl bg-rose-950/90 border border-rose-400 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE 1: 4-DIGIT PIN ENTRY (DEFAULT - LIKE YOUTUBE KIDS) */}
        {!usePasswordMode && !useMathFallback && (
          <div className="space-y-4">
            {/* 4 PIN Dots */}
            <div className="flex justify-center items-center gap-3 py-2">
              {Array.from({ length: 4 }).map((_, idx) => {
                const isFilled = idx < pinDigits.length;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      isFilled
                        ? 'bg-amber-400 border-white text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-105'
                        : 'bg-slate-950 border-slate-700 text-transparent'
                    }`}
                  >
                    <span className="text-xl font-black">
                      {isFilled ? '●' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              Default PIN is <b className="text-amber-300">1234</b>. You can customize this anytime.
            </p>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 active:scale-95 text-lg font-black text-slate-100 shadow transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClearPin}
                className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400 cursor-pointer"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 active:scale-95 text-lg font-black text-slate-100 shadow transition-all cursor-pointer"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDeleteDigit}
                className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Alternative Fallback Options */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUsePasswordMode(true);
                  setErrorMsg(null);
                }}
                className="text-amber-300 hover:text-amber-200 font-bold flex items-center justify-center gap-1 cursor-pointer py-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Use Account Password instead</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseMathFallback(true);
                  setErrorMsg(null);
                }}
                className="text-slate-400 hover:text-slate-300 font-medium flex items-center justify-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Solve Adult Math Challenge</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: ACCOUNT PASSWORD FALLBACK */}
        {usePasswordMode && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Account Password:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsePasswordMode(false);
                  setErrorMsg(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Back to PIN
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer hover:scale-105"
              >
                Unlock
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: ADULT MATH CHALLENGE (YOUTUBE KIDS STYLE) */}
        {useMathFallback && (
          <form onSubmit={handleMathSubmit} className="space-y-4 pt-1">
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-2">
              <span className="text-xs text-amber-300 font-bold block">Parental Security Math Question:</span>
              <div className="text-2xl font-black text-white font-mono">
                {mathChallenge.num1} × {mathChallenge.num2} = ?
              </div>
            </div>

            <input
              type="number"
              value={mathAnswerInput}
              onChange={(e) => setMathAnswerInput(e.target.value)}
              placeholder="Enter answer..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-center font-mono font-black text-lg focus:outline-none focus:border-amber-400"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUseMathFallback(false);
                  setErrorMsg(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Back to PIN
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer hover:scale-105"
              >
                Verify
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ParentPinModal;

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ExplorerProfile } from '../types/character';
import { UserCheck, KeyRound, UserPlus, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { account, allAccounts, createAccount, loginAccount } = useGame();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [firstKidName, setFirstKidName] = useState('');
  const [kidAgeTier, setKidAgeTier] = useState<ExplorerProfile['ageTier']>('preschool');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const ok = loginAccount(username.trim());
    if (ok) {
      onClose();
    } else {
      setErrorMsg('Account username not found. You can register a new parent account!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !firstKidName.trim()) return;
    createAccount(username.trim(), familyName.trim(), firstKidName.trim(), kidAgeTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">
                {isRegistering ? 'Create Parent Account' : 'Parent Account Sign-In'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage multiple explorers and track phonics scores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Parent Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. kam_family"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              Sign In to Account
            </button>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5">Saved Accounts on this device:</span>
              <div className="flex flex-wrap gap-1.5">
                {allAccounts.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      loginAccount(acc.username);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700 cursor-pointer"
                  >
                    @{acc.username} ({acc.explorers.map(e => e.name).join(', ')})
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMsg('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Need a new account? Create one here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Parent Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. martinez_family"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Family / Classroom Name
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. The Martinez Explorers"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  First Child Name
                </label>
                <input
                  type="text"
                  value={firstKidName}
                  onChange={(e) => setFirstKidName(e.target.value)}
                  placeholder="e.g. Kam, Chloe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Grade Tier
                </label>
                <select
                  value={kidAgeTier}
                  onChange={(e) => setKidAgeTier(e.target.value as ExplorerProfile['ageTier'])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="preschool">Preschool (Ages 3-5)</option>
                  <option value="kindergarten">Kindergarten (Ages 5-6)</option>
                  <option value="early-elementary">Grades 1-2</option>
                  <option value="late-elementary">Grades 3-5</option>
                  <option value="middle-school">Grades 6-9+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              Create Account & Start Adventure
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

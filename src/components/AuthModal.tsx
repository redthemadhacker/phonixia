import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { LogIn, UserPlus, Lock, User, Sparkles, X, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { account, loginWithCredentials, registerAccount } = useGame();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUsername, setRememberUsername] = useState(true);
  const [familyName, setFamilyName] = useState('');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [firstKidName, setFirstKidName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill remembered username from this device if available
  useEffect(() => {
    const savedUser = localStorage.getItem('phonixia_saved_username');
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const success = loginWithCredentials(username.trim(), password.trim());
    if (success) {
      if (rememberUsername) {
        localStorage.setItem('phonixia_saved_username', username.trim());
      } else {
        localStorage.removeItem('phonixia_saved_username');
      }

      sounds.playFanfare();
      sounds.speak(`Welcome back, ${account.familyName || username}!`);
      onSuccess();
    } else {
      setErrorMsg('Incorrect username or password for this realm.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim() || !familyName.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (rememberUsername) {
      localStorage.setItem('phonixia_saved_username', username.trim());
    }

    registerAccount({
      username: username.trim(),
      password: password.trim(),
      familyName: familyName.trim(),
      role,
      starterExplorerName: firstKidName.trim() || 'Explorer',
    });

    sounds.playFanfare();
    sounds.speak(`Account created! Welcome to Phonixia!`);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40 text-lg">
              🏰
            </span>
            <div>
              <h2 className="text-base font-black text-slate-100 font-display uppercase tracking-wide">
                {mode === 'login' ? 'Explorer Gateway' : 'New Realm Account'}
              </h2>
              <p className="text-[11px] text-slate-400">Credentials required to access Phonixia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              {/* Remember Username Option & Browser Password Prompt helper */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Remember username on this device
                  </span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-amber-400/80 font-medium" title="Browser will prompt to save password">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Save Password</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Authenticate & Enter Realm</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Family or Classroom Name</label>
                <input
                  type="text"
                  name="organization"
                  placeholder="e.g. The James Family or Room 402"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Create username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'parent' | 'teacher')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="parent">Parent Account</option>
                    <option value="teacher">Educator / Teacher</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">First Explorer Kid</label>
                  <input
                    type="text"
                    placeholder="e.g. Kam or Celine"
                    value={firstKidName}
                    onChange={(e) => setFirstKidName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    Remember username on this device
                  </span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-amber-400/80 font-medium">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Device Keychain</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Account & Save to Device</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
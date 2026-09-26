import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { validatePassword } from '../utils/security';
import { 
  LogIn, UserPlus, Lock, User, Sparkles, X, ShieldCheck, KeyRound, 
  Check, Wifi 
} from 'lucide-react';

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
  const [firstKidGender, setFirstKidGender] = useState<'boy' | 'girl'>('boy');
  const [errorMsg, setErrorMsg] = useState('');

  const pwCheckResult = validatePassword(password);

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

    if (!pwCheckResult.isValid) {
      setErrorMsg(pwCheckResult.errorMessage || 'Please fulfill all password security parameters.');
      sounds.playError();
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
      gender: firstKidGender
    });

    sounds.playFanfare();
    sounds.speak(`Account created! Welcome to Phonixia!`);
    onSuccess();
  };

  return (
    <div 
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 12px)'
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-y-auto max-h-[calc(100dvh-24px)] animate-scale-up my-auto">
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

              {/* Standard Password Security Parameters Checklist */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>Security Parameters</span>
                  </span>
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full ${
                    pwCheckResult.isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {pwCheckResult.score}/5 Met
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                  {pwCheckResult.checks.map((check) => (
                    <div
                      key={check.id}
                      className={`flex items-center gap-1 ${
                        check.passed ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {check.passed ? (
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3] shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className="leading-tight">{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Character Gender & Companion Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Explorer Gender &amp; Companion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFirstKidGender('boy');
                      sounds.playStep();
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      firstKidGender === 'boy'
                        ? 'bg-blue-950/60 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-200">👦 Boy Explorer</div>
                    <div className="text-[10px] text-blue-300 font-medium">Kam travels with you!</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFirstKidGender('girl');
                      sounds.playStep();
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      firstKidGender === 'girl'
                        ? 'bg-pink-950/60 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-200">👧 Girl Explorer</div>
                    <div className="text-[10px] text-pink-300 font-medium">Celine travels with you!</div>
                  </button>
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

              {/* Parents Wi-Fi & Network Cybersecurity Shield */}
              <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2 text-[10px] text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-emerald-400 font-bold block">Protected Home Wi-Fi &amp; Cloud Cartridge</b>
                  <span>Backend network isolation prevents local Wi-Fi probing. Accounts are accessible across any phone or computer.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Cloud Account &amp; Begin</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
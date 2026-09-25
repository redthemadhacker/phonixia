import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { User, KeyRound, ArrowRight, UserPlus } from 'lucide-react';

interface AuthGatewayProps {
  onAuthenticated: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onAuthenticated }) => {
  const { loginWithCredentials, registerAccount } = useGame();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Registration state
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'parent' | 'teacher'>('parent');
  const [regExplorerName, setRegExplorerName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const ok = loginWithCredentials(username.trim().toLowerCase(), password);
    if (ok) {
      sessionStorage.setItem('phonixia_active_session', 'true');
      sounds.playSuccess();
      sounds.speak('Welcome to Phonixia! Opening the world map.');
      onAuthenticated();
    } else {
      sounds.playError();
      setErrorMsg('Invalid username or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regUsername.trim() || !regPassword.trim() || !regExplorerName.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    registerAccount({
      username: regUsername.trim().toLowerCase(),
      password: regPassword,
      familyName: regFamilyName.trim() || `${regExplorerName}'s Family`,
      role: regRole,
      starterExplorerName: regExplorerName.trim(),
    });

    sessionStorage.setItem('phonixia_active_session', 'true');
    sounds.playFanfare();
    sounds.speak(`Welcome to Phonixia, ${regExplorerName}!`);
    onAuthenticated();
  };

  const handleGuestPlay = () => {
    sessionStorage.setItem('phonixia_active_session', 'true');
    sounds.playSuccess();
    onAuthenticated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-4 border-amber-600/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/90 border-2 border-amber-400 mx-auto flex items-center justify-center text-3xl shadow-xl">
            🦅
          </div>
          <h1 className="text-2xl font-black text-amber-300 font-display uppercase tracking-wider">
            Phonixia Gateway
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {mode === 'login' ? 'Sign in to access your explorer journey' : 'Create an educational family profile'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setMode('login');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setMode('register');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                Username / Email
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-bold"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-102 active:scale-98"
            >
              <span>Enter World</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                Family / School Name
              </label>
              <input
                type="text"
                value={regFamilyName}
                onChange={(e) => setRegFamilyName(e.target.value)}
                placeholder="Family or Classroom Name"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                Starter Explorer Name
              </label>
              <input
                type="text"
                value={regExplorerName}
                onChange={(e) => setRegExplorerName(e.target.value)}
                placeholder="Enter explorer name"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                Role
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="parent">Parent / Family Hub</option>
                <option value="teacher">Educator / Classroom</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-102 active:scale-98"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Create & Begin Journey</span>
            </button>
          </form>
        )}

        {/* Quick Guest Play */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleGuestPlay}
            className="text-xs text-slate-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Or play immediately as Guest Explorer →
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useGame, KAM_GUIDE, CELINE_GUIDE } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { validatePassword, PASSWORD_REQUIREMENTS } from '../utils/security';
import { 
  User, KeyRound, ArrowRight, UserPlus, Sparkles, Star, Heart, 
  Compass, ShieldCheck, Check, X, ShieldAlert, Wifi
} from 'lucide-react';
import { AvatarRenderer } from './AvatarRenderer';

interface AuthGatewayProps {
  onAuthenticated: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onAuthenticated }) => {
  const { loginWithCredentials, registerAccount } = useGame();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Registration & Character Creation state
  const [characterName, setCharacterName] = useState('');
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('boy');
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'parent' | 'teacher'>('parent');

  const pwCheckResult = validatePassword(regPassword);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const ok = loginWithCredentials(username.trim().toLowerCase(), password);
    if (ok) {
      sessionStorage.setItem('phonixia_active_session', 'true');
      sounds.playSuccess();
      sounds.speak('Welcome to Phonixia! Exploring with Kam and Celine!');
      onAuthenticated();
    } else {
      sounds.playError();
      setErrorMsg('Invalid username or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regUsername.trim() || !regPassword.trim() || !characterName.trim()) {
      setErrorMsg('Please enter your character name, username, and password.');
      return;
    }

    if (!pwCheckResult.isValid) {
      setErrorMsg(pwCheckResult.errorMessage || 'Please fulfill all password security parameters.');
      sounds.playError();
      return;
    }

    const companionName = characterGender === 'boy' ? 'Kam' : 'Celine';

    registerAccount({
      username: regUsername.trim().toLowerCase(),
      password: regPassword,
      familyName: regFamilyName.trim() || `${characterName}'s Family`,
      role: regRole,
      starterExplorerName: characterName.trim(),
      gender: characterGender,
    });

    sessionStorage.setItem('phonixia_active_session', 'true');
    sounds.playFanfare();
    sounds.speak(`Welcome to Phonixia, ${characterName}! ${companionName} is excited to travel with you!`);
    onAuthenticated();
  };

  return (
    <div 
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 12px)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 12px)'
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md select-none overflow-y-auto"
    >
      {/* Golden Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 sm:border-4 border-amber-400 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.35)] space-y-4 my-auto max-h-[calc(100dvh-24px)] overflow-y-auto">
        
        {/* Golden Cute Header with Video Game Quest Lore */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/80 text-amber-300 text-xs font-black tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>EPIC ADVENTURE QUEST</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-display tracking-wide drop-shadow-sm">
            Join Kam and Celine in the quest to save Phonixia!
          </h1>

          <p className="text-xs sm:text-sm text-amber-200 font-bold max-w-md mx-auto leading-snug">
            Travel across 5 magical realms to defeat the Shadow King, rescue the Golden Phoenix, and earn your place among the Eternal Flamekeepers.
          </p>

          <p className="text-[11px] sm:text-xs text-amber-400/90 font-medium">
            Create account or login to explore
          </p>
        </div>

        {/* Adventure Companions: Kam & Celine */}
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-inner flex items-center justify-around gap-2 text-center">
          {/* Kam Guide Card */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-950/90 border border-blue-400/60 flex items-center justify-center overflow-hidden p-0.5 shadow">
              <AvatarRenderer customization={KAM_GUIDE.customization} size={36} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-amber-200">Kam</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-[10px] text-amber-400/80 font-bold block">Adventure Companion</span>
            </div>
          </div>

          <div className="h-8 w-px bg-amber-500/30" />

          {/* Celine Guide Card */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-pink-950/90 border border-pink-400/60 flex items-center justify-center overflow-hidden p-0.5 shadow">
              <AvatarRenderer customization={CELINE_GUIDE.customization} size={36} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-amber-200">Celine</span>
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              </div>
              <span className="text-[10px] text-pink-400/80 font-bold block">Adventure Companion</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Golden Styled */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border-2 border-amber-500/40 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setMode('login');
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setMode('register');
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-amber-200/70 hover:text-amber-100'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-bold text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-amber-400/80" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-[16px] sm:text-xs focus:outline-none focus:border-amber-400 font-bold"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-amber-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-amber-400/80" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-[16px] sm:text-xs focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-102 active:scale-98 border border-amber-300"
            >
              <span>Enter Phonixia</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* REGISTER & CREATE CHARACTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
            
            {/* Create Your Own Character */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5">
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Your Explorer Character</span>
              </span>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Character Name
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter your character name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>

              {/* Character Gender & Companion Guide */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Character Gender &amp; Traveling Companion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCharacterGender('boy');
                      sounds.playStep();
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      characterGender === 'boy'
                        ? 'bg-blue-950/60 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-200">👦 Boy Character</div>
                    <div className="text-[10px] text-blue-300 font-medium">Kam travels with you!</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCharacterGender('girl');
                      sounds.playStep();
                    }}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      characterGender === 'girl'
                        ? 'bg-pink-950/60 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="text-xs font-black text-amber-200">👧 Girl Character</div>
                    <div className="text-[10px] text-pink-300 font-medium">Celine travels with you!</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>
            </div>

            {/* Standard Password Security Parameters Checklist */}
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Standard Security Parameters</span>
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
                    className={`flex items-center gap-1.5 transition-colors ${
                      check.passed ? 'text-emerald-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {check.passed ? (
                      <Check className="w-3 h-3 text-emerald-400 stroke-[3] shrink-0" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className="leading-tight">{check.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                Family / School Name
              </label>
              <input
                type="text"
                value={regFamilyName}
                onChange={(e) => setRegFamilyName(e.target.value)}
                placeholder="Family or Classroom Name"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            {/* Parents Wi-Fi & Network Cybersecurity Shield Info */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2 text-[10px] text-slate-300">
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-emerald-400 block font-black">Home Wi-Fi &amp; Network Protected</b>
                <span>Phonixia features backend network isolation, brute-force rate-limiting, and encrypted cloud storage. Your family router and Wi-Fi cannot be accessed or compromised through gameplay.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-102 active:scale-98 border border-amber-300"
            >
              <UserPlus className="w-4 h-4 stroke-[3]" />
              <span>Create Character &amp; Begin Journey</span>
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

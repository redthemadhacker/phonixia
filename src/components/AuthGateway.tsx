import React, { useState } from 'react';
import { useGame, KAM_GUIDE, CELINE_GUIDE } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { validatePassword } from '../utils/security';
import { 
  User, KeyRound, ArrowRight, UserPlus, Sparkles, Star, Heart, 
  Compass, ShieldCheck, Check, Wifi, GraduationCap, Eye, EyeOff, HelpCircle, Calculator
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotRecoveryMethod, setForgotRecoveryMethod] = useState<'pin' | 'math'>('math');
  const [forgotUsernameInput, setForgotUsernameInput] = useState('');
  const [forgotPinInput, setForgotPinInput] = useState('');
  const [forgotMathAnswer, setForgotMathAnswer] = useState('');
  const [isVerifiedForReset, setIsVerifiedForReset] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Adult Math Challenge Generator (Randomized)
  const [mathProblem, setMathProblem] = useState<{ q: string; a: number }>(() => {
    const num1 = Math.floor(Math.random() * 12) + 12; // 12-24
    const num2 = Math.floor(Math.random() * 8) + 3;   // 3-10
    return { q: `${num1} × ${num2}`, a: num1 * num2 };
  });

  const resetMathProblem = () => {
    const num1 = Math.floor(Math.random() * 14) + 12;
    const num2 = Math.floor(Math.random() * 8) + 4;
    setMathProblem({ q: `${num1} × ${num2}`, a: num1 * num2 });
  };

  // Registration & Character Creation state
  const [characterName, setCharacterName] = useState('');
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('boy');
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regRole, setRegRole] = useState<'parent' | 'teacher'>('parent');

  const pwCheckResult = validatePassword(regPassword);
  const newPwCheckResult = validatePassword(newPasswordInput);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(username.trim().toLowerCase(), password);
      if (result.success) {
        sessionStorage.setItem('phonixia_active_session', 'true');
        sounds.playSuccess();
        sounds.speak('Welcome to Phonixia! Exploring with Kam and Celine!');
        onAuthenticated();
      } else {
        sounds.playError();
        setErrorMsg(result.error || 'Invalid username or password.');
      }
    } catch {
      sounds.playError();
      setErrorMsg('Login request failed. Please check your network or credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUser = regUsername.trim().toLowerCase();

    if (!cleanUser || !regPassword.trim() || !characterName.trim()) {
      setErrorMsg('Please enter your character name, username, and password.');
      return;
    }

    // UNIQUE USERNAME CHECK: Check server cloud database & local device cache
    try {
      const checkRes = await fetch(`/api/auth/check-username/${encodeURIComponent(cleanUser)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        sounds.playError();
        setErrorMsg('That username is already taken. Please choose another username.');
        return;
      }
    } catch {}

    const existingPassword = localStorage.getItem(`phonixia_pw_${cleanUser}`);
    let accountExists = false;
    try {
      const savedAccounts = localStorage.getItem('phonixia_account_v2');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (parsed.username?.toLowerCase() === cleanUser) {
          accountExists = true;
        }
      }
    } catch {}

    if (existingPassword || accountExists) {
      sounds.playError();
      setErrorMsg('That username is already taken. Please choose another username.');
      return;
    }

    if (!pwCheckResult.isValid) {
      setErrorMsg(pwCheckResult.errorMessage || 'Please fulfill all password security parameters.');
      sounds.playError();
      return;
    }

    setIsSubmitting(true);
    const companionId = characterGender === 'boy' ? 'kam' : 'celine';
    const companionName = characterGender === 'boy' ? 'Kam' : 'Celine';

    const regResult = await registerAccount({
      username: cleanUser,
      password: regPassword,
      familyName: regFamilyName.trim() || (regRole === 'teacher' ? `${characterName}'s Classroom` : `${characterName}'s Family`),
      role: regRole,
      starterExplorerName: characterName.trim(),
      gender: characterGender,
      companionGuide: companionId,
    });

    setIsSubmitting(false);
    if (!regResult.success) {
      setErrorMsg(regResult.error || 'Failed to create account.');
      sounds.playError();
      return;
    }

    sessionStorage.setItem('phonixia_active_session', 'true');
    sounds.playFanfare();
    sounds.speak(`Welcome to Phonixia, ${characterName}! ${companionName} is excited to travel with you!`);
    onAuthenticated();
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const cleanUser = forgotUsernameInput.trim().toLowerCase();
    if (!cleanUser) {
      setForgotError('Please enter your account username.');
      return;
    }

    // Verify account existence in cloud or local cache
    const savedPw = localStorage.getItem(`phonixia_pw_${cleanUser}`);
    let accountFound = false;
    try {
      const checkRes = await fetch(`/api/account/${encodeURIComponent(cleanUser)}`);
      if (checkRes.ok) accountFound = true;
    } catch {}

    if (!accountFound) {
      try {
        const savedAccounts = localStorage.getItem('phonixia_account_v2');
        if (savedAccounts) {
          const parsed = JSON.parse(savedAccounts);
          if (parsed.username?.toLowerCase() === cleanUser) {
            accountFound = true;
          }
        }
      } catch {}
    }

    if (!savedPw && !accountFound) {
      sounds.playError();
      setForgotError(`No registered account found with username: "${forgotUsernameInput}".`);
      return;
    }

    // Check Verification Method without default PIN
    if (forgotRecoveryMethod === 'math') {
      if (parseInt(forgotMathAnswer.trim(), 10) !== mathProblem.a) {
        sounds.playError();
        setForgotError('Incorrect math answer. Only adults may verify recovery.');
        resetMathProblem();
        return;
      }
    } else {
      const configuredPin = localStorage.getItem('phonixia_parent_pin');
      if (!configuredPin) {
        sounds.playError();
        setForgotError('No Parent PIN has been set up yet. Please select the Adult Math Question method.');
        return;
      }
      if (forgotPinInput.trim() !== configuredPin) {
        sounds.playError();
        setForgotError('Incorrect 4-digit Parent PIN.');
        return;
      }
    }

    sounds.playSuccess();
    setIsVerifiedForReset(true);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!newPwCheckResult.isValid) {
      sounds.playError();
      setForgotError(newPwCheckResult.errorMessage || 'Please fulfill all password parameters.');
      return;
    }

    const cleanUser = forgotUsernameInput.trim().toLowerCase();
    localStorage.setItem(`phonixia_pw_${cleanUser}`, newPasswordInput);

    // Sync new password to server database
    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, newPassword: newPasswordInput })
    }).catch(() => {});

    try {
      const savedAccounts = localStorage.getItem('phonixia_account_v2');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (parsed.username?.toLowerCase() === cleanUser) {
          localStorage.setItem('phonixia_account_v2', JSON.stringify(parsed));
        }
      }
    } catch {}

    sounds.playFanfare();
    setResetSuccessMessage('Password successfully updated! You can now sign in.');
    setTimeout(() => {
      setPassword(newPasswordInput);
      setUsername(cleanUser);
      setIsForgotModalOpen(false);
      setIsVerifiedForReset(false);
      setResetSuccessMessage(null);
      setNewPasswordInput('');
    }, 2000);
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
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 sm:border-4 border-amber-400 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.35)] space-y-4 my-auto max-h-[calc(100dvh-24px)] overflow-y-auto">
        
        {/* Header */}
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
            Travel across 5 magical realms to defeat the Shadow King, rescue the Golden Phonix, and earn your place among the Eternal Flamekeepers.
          </p>
        </div>

        {/* Adventure Companions */}
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-inner flex items-center justify-around gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-950/90 border border-blue-400/60 flex items-center justify-center overflow-hidden p-0.5 shadow">
              <AvatarRenderer customization={KAM_GUIDE.customization} size={36} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-amber-200">Kam</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-[10px] text-amber-400/80 font-bold block">Boy Companion</span>
            </div>
          </div>

          <div className="h-8 w-px bg-amber-500/30" />

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-pink-950/90 border border-pink-400/60 flex items-center justify-center overflow-hidden p-0.5 shadow">
              <AvatarRenderer customization={CELINE_GUIDE.customization} size={36} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-amber-200">Celine</span>
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              </div>
              <span className="text-[10px] text-pink-400/80 font-bold block">Girl Companion</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
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
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setIsVerifiedForReset(false);
                    setResetSuccessMessage(null);
                    setForgotUsernameInput(username);
                    setNewPasswordInput('');
                    resetMathProblem();
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-amber-400/80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-[16px] sm:text-xs focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-amber-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-amber-500/60 text-amber-500 focus:ring-amber-400"
                />
                <span>Show Password</span>
              </label>
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
            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Role</span>
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as 'parent' | 'teacher')}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="parent">Parent / Family Account</option>
                <option value="teacher">Teacher / Educator Account</option>
              </select>
            </div>

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

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Character Gender &amp; Companion
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

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                  Unique Username
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
                <div className="relative flex items-center">
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-amber-300 cursor-pointer"
                    tabIndex={-1}
                  >
                    {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
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
                {regRole === 'teacher' ? 'School / Classroom Name' : 'Family Name'}
              </label>
              <input
                type="text"
                value={regFamilyName}
                onChange={(e) => setRegFamilyName(e.target.value)}
                placeholder={regRole === 'teacher' ? 'e.g. Ms. Smith Room 102' : 'Family Name'}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-medium"
              />
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
      </div>

      {/* SECURE PASSWORD RESET GATE MODAL (NO DEFAULTS) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    Reset Account Password
                  </h3>
                  <p className="text-[11px] text-slate-400">Adult Parent or Educator Gate</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setIsVerifiedForReset(false);
                }}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold text-center">
                {forgotError}
              </div>
            )}

            {resetSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-center space-y-2 animate-scale-up">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-emerald-200">
                  {resetSuccessMessage}
                </div>
              </div>
            ) : isVerifiedForReset ? (
              /* Step 2: Set New Password */
              <form onSubmit={handleSaveNewPassword} className="space-y-3.5 animate-scale-up">
                <div className="text-xs text-emerald-300 font-bold text-center">
                  Identity Verified! Set a new password for @{forgotUsernameInput}:
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-amber-300 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Password Quality Breakdown */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-[10px] space-y-1">
                  <div className="text-amber-300 font-bold">New Password Parameters:</div>
                  <div className="grid grid-cols-2 gap-1 text-slate-300">
                    {newPwCheckResult.checks.map(c => (
                      <span key={c.id} className={c.passed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {c.passed ? '✓' : '•'} {c.label}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow transition-all active:scale-95"
                >
                  Save New Password &amp; Sign In
                </button>
              </form>
            ) : (
              /* Step 1: Adult Verification Challenge */
              <form onSubmit={handleVerifyIdentity} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Account Username</label>
                  <input
                    type="text"
                    value={forgotUsernameInput}
                    onChange={(e) => setForgotUsernameInput(e.target.value)}
                    placeholder="Enter account username"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Verification Challenge</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotRecoveryMethod('math')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        forgotRecoveryMethod === 'math'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Adult Math Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotRecoveryMethod('pin')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        forgotRecoveryMethod === 'pin'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Custom Parent PIN</span>
                    </button>
                  </div>
                </div>

                {forgotRecoveryMethod === 'math' ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 space-y-1.5 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Please solve this adult question:</span>
                    <div className="text-lg font-black text-amber-300 font-mono tracking-widest">
                      {mathProblem.q} = ?
                    </div>
                    <input
                      type="number"
                      value={forgotMathAnswer}
                      onChange={(e) => setForgotMathAnswer(e.target.value)}
                      placeholder="Enter answer"
                      className="w-32 mx-auto px-3 py-1.5 text-center font-mono font-bold bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 space-y-1.5 text-center">
                    <span className="text-[11px] text-slate-400 block font-medium">Enter your configured 4-digit Parent PIN:</span>
                    <input
                      type="password"
                      maxLength={4}
                      pattern="\d{4}"
                      value={forgotPinInput}
                      onChange={(e) => setForgotPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      className="w-32 mx-auto px-3 py-1.5 text-center font-mono font-bold tracking-widest bg-slate-900 border border-slate-700 rounded-lg text-white text-base focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow transition-all active:scale-95"
                >
                  Verify &amp; Continue to Reset
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
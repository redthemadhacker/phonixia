import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PHONIXIA_LANDS } from '../data/curriculumData';
import { ALL_50_MINIGAMES } from '../data/minigamesCurriculum';
import { ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  Users, UserPlus, Star, Trophy, BarChart3, Printer, LogOut, 
  ArrowLeft, Palette, ChevronDown, ChevronUp, RotateCcw, Award, 
  AlertCircle, Sparkles, CheckCircle2, Play
} from 'lucide-react';

interface ParentDashboardProps {
  onClose: () => void;
  onOpenCharacterCreator?: () => void;
  onOpenAuthModal?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onClose,
  onOpenCharacterCreator,
  onOpenAuthModal
}) => {
  const { account, activeExplorer, switchExplorer, createExplorer, resetExplorerProgress, logout } = useGame();

  const [isAddingKid, setIsAddingKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState<ExplorerProfile['ageTier']>('preschool');
  const [newKidGender, setNewKidGender] = useState<'boy' | 'girl'>('boy');
  const [isHallOfFameExpanded, setIsHallOfFameExpanded] = useState(false);

  const [currentPin, setCurrentPin] = useState<string>(() => {
    return (account as any).parentPin || localStorage.getItem('phonixia_parent_pin') || '1234';
  });
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSaveMessage, setPinSaveMessage] = useState<string | null>(null);

  const handleSaveCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length === 4 && /^\d{4}$/.test(newPinInput)) {
      localStorage.setItem('phonixia_parent_pin', newPinInput);
      setCurrentPin(newPinInput);
      setPinSaveMessage(`Quick PIN updated to ${newPinInput}!`);
      sounds.playSuccess();
      setNewPinInput('');
      setTimeout(() => setPinSaveMessage(null), 4000);
    } else {
      sounds.playError();
      setPinSaveMessage('Please enter exactly 4 numbers.');
    }
  };

  const hallOfFameExplorers = account.explorers.filter((exp) => {
    const scores = Object.values(exp.landScores) as { completedGamesCount?: number }[];
    const totalCompleted = scores.reduce<number>(
      (sum: number, land) => sum + (land?.completedGamesCount || 0),
      0
    );
    return (
      exp.isHallOfFameInducted ||
      (exp.timesStorylineCompleted && exp.timesStorylineCompleted > 0) ||
      totalCompleted >= 250 ||
      exp.totalStars >= 750
    );
  });

  const handleCreateKid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKidName.trim()) return;
    createExplorer(newKidName.trim(), newKidAge, newKidGender);
    sounds.playFanfare();
    sounds.speak(`Explorer ${newKidName.trim()} created! Welcome to Phonixia!`);
    setNewKidName('');
    setIsAddingKid(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleReturnToGame = () => {
    sounds.speak('Returning to Phonixia! Happy reading!', 0.88, 1.25);
    onClose();
  };

  const handleLogout = () => {
    sounds.speak('Logged out. See you soon in Phonixia!', 0.88, 1.2);
    if (logout) logout();
    onClose();
    if (onOpenAuthModal) onOpenAuthModal();
  };

  // Helper to extract recorded skill struggles from localStorage or state
  const rawStruggles: Record<string, number> = (activeExplorer as any).strugglingSkills || (() => {
    try {
      const stored = localStorage.getItem(`phonixia_struggles_${activeExplorer.id}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })();

  const struggleList = Object.entries(rawStruggles)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  const isEligibleToReset =
    activeExplorer.isHallOfFameInducted ||
    (activeExplorer.timesStorylineCompleted && activeExplorer.timesStorylineCompleted > 0) ||
    activeExplorer.totalStars >= 750 ||
    (Object.values(activeExplorer.landScores) as { completedGamesCount?: number }[]).every((l) => (l?.completedGamesCount ?? 0) >= 50);

  return (
    <div 
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 8px)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 8px)'
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/95 border-b border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 text-2xl shadow-inner">
              🛖
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 font-display flex items-center gap-2">
                <span>Home Hut · Parent &amp; Educator Hub</span>
              </h2>
              <p className="text-xs text-slate-400">
                Current Account: <b className="text-amber-400">{account.familyName}</b> (@{account.username})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
            <button
              onClick={handleReturnToGame}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Return to Phonixia ✕</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* SKILL MASTERY & STRUGGLE DIAGNOSTICS CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-950 to-indigo-950/50 border-2 border-indigo-400/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-indigo-200 uppercase tracking-wide">
                    Areas Needing Practice ({activeExplorer.name})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Targeted insights on recurring missed questions and recommended practice games
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-400/40 text-indigo-300 font-bold">
                {struggleList.length} Active Target{struggleList.length === 1 ? '' : 's'}
              </span>
            </div>

            {struggleList.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No Recurring Difficulties Detected!</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {activeExplorer.name} is making steady progress without repeated missed questions across current stages.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {struggleList.map(([skill, missCount]) => {
                  const recommendedMinigame = ALL_50_MINIGAMES.find((g) =>
                    g.skillCategory.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(g.targetSoundOrWord.toLowerCase())
                  ) || ALL_50_MINIGAMES[0];

                  return (
                    <div
                      key={skill}
                      className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-black text-rose-300 flex items-center gap-1">
                            <span>⚠️ {skill}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Missed {missCount} times across recent rounds
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono font-bold">
                          Needs Practice
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-base">{recommendedMinigame.themeIcon}</span>
                          <span className="text-amber-300 font-bold truncate">
                            {recommendedMinigame.name} (#{recommendedMinigame.gameNum})
                          </span>
                        </div>
                        <span className="text-[10px] text-cyan-300 font-mono font-bold shrink-0 ml-2">
                          {recommendedMinigame.hub === 'isles-of-play' ? 'Isles of Play' : 'Arcade'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DEDUPLICATED HALL OF FAME BANNER */}
          <div className="rounded-3xl border-2 border-amber-400/70 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 shadow-2xl overflow-hidden transition-all duration-300">
            <div
              onClick={() => {
                setIsHallOfFameExpanded(!isHallOfFameExpanded);
                sounds.playStep();
              }}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-amber-500/10 transition-colors select-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner animate-bounce-gentle">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-amber-300 font-display tracking-wide uppercase">
                      Eternal Flamekeepers
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-400/40">
                      {hallOfFameExplorers.length} Flamekeepers Enshrined
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Permanent Honor Roll. Explorers earn their place upon completing the questline.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-sm">
                <span>{isHallOfFameExpanded ? 'Close Honor Roll' : 'View Classroom Champions'}</span>
                {isHallOfFameExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {isHallOfFameExpanded && (
              <div className="p-4 sm:p-5 pt-1 border-t border-amber-500/30 bg-slate-950/95 space-y-3">
                {hallOfFameExplorers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                    <Trophy className="w-10 h-10 mx-auto text-amber-500/40 animate-pulse" />
                    <p className="font-bold text-slate-200 text-sm">No champions yet!</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto pr-2 space-y-2.5">
                    {hallOfFameExplorers.map((exp, index) => {
                      const loops = exp.timesStorylineCompleted || 0;
                      return (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-amber-500/30 hover:border-amber-400 transition-all shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xs font-black text-amber-300 font-mono">
                              #{index + 1}
                            </div>
                            <div className="relative w-12 h-12 rounded-2xl bg-amber-950/60 border-2 border-amber-400 flex items-center justify-center overflow-hidden shrink-0 shadow">
                              <AvatarRenderer customization={exp.customization} size={42} showPet={false} />
                              <span className="absolute bottom-0 right-0 text-[10px]">👑</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-amber-200">{exp.name}</span>
                                {loops > 0 && (
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center gap-1">
                                    <Award className="w-2.5 h-2.5" />
                                    <span>Cleared x{loops}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-xs text-right">
                            <div className="text-amber-400 font-black flex items-center justify-end gap-1 text-sm">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span>{exp.totalStars}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Explorer Profile Showcase */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border-2 border-amber-400 flex items-center justify-center overflow-hidden">
                <AvatarRenderer customization={activeExplorer.customization} size={54} showPet={true} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-amber-400">Playing As:</span>
                  <span className="text-lg font-black text-slate-100 font-display">{activeExplorer.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Active Explorer
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono mt-1 text-amber-300">
                  <span>★ {activeExplorer.totalStars} Stars</span>
                  <span>🪙 {activeExplorer.coins} Coins</span>
                  <span>🎟️ {activeExplorer.arcadeTokens} Tokens</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEligibleToReset && (
                <button
                  onClick={() => {
                    if (window.confirm(`Restart ${activeExplorer.name}'s story from Level 1? Your spot among the Eternal Flamekeepers is permanent.`)) {
                      resetExplorerProgress(activeExplorer.id);
                      sounds.playFanfare();
                      sounds.speak(`Story restarted for ${activeExplorer.name}! Welcome back to Sound Shallows!`);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Storyline</span>
                </button>
              )}

              {onOpenCharacterCreator && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCharacterCreator();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Palette className="w-4 h-4" />
                  <span>Customize Explorer</span>
                </button>
              )}
            </div>
          </div>

          {/* QUICK PIN CONFIGURATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shadow-inner">
                  🔢
                </div>
                <div>
                  <div className="text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-2">
                    <span>Parent &amp; Teacher Quick PIN</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Configure a 4-digit PIN for instant access to student stats without full account passwords.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono bg-black/70 px-3 py-1.5 rounded-xl border border-amber-500/40 text-slate-300">
                Active PIN: <b className="text-amber-400 font-mono tracking-widest">•••• ({currentPin})</b>
              </div>
            </div>

            <form onSubmit={handleSaveCustomPin} className="flex flex-wrap items-center gap-3 pt-1">
              <input
                type="password"
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
                placeholder="New 4-digit PIN (e.g. 1234)"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-amber-400/60 text-sm font-mono text-center tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-amber-400 w-52"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow transition-all"
              >
                Save Quick PIN
              </button>
              {pinSaveMessage && (
                <span className="text-xs font-bold text-emerald-400 animate-fade-in">
                  ✓ {pinSaveMessage}
                </span>
              )}
            </form>
          </div>

          {/* Switch Kid / Explorer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Switch Explorer ({account.explorers.length} Registered)</span>
              </h3>
              {!isAddingKid && (
                <button
                  onClick={() => setIsAddingKid(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Child Explorer</span>
                </button>
              )}
            </div>

            {isAddingKid && (
              <form onSubmit={handleCreateKid} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="text-xs font-bold text-amber-300">Register New Child Explorer</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Explorer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kam, Maya, Leo"
                      value={newKidName}
                      onChange={(e) => setNewKidName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Starting Realm</label>
                    <select
                      value={newKidAge}
                      onChange={(e) => setNewKidAge(e.target.value as ExplorerProfile['ageTier'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="preschool">Sound Shallows (Letter Sounds &amp; Rhymes)</option>
                      <option value="kindergarten">Builders Guild (Word Building &amp; Blending)</option>
                      <option value="early-elementary">Tricky Trails (Silent E &amp; Phonics Paths)</option>
                      <option value="late-elementary">Whispering Peaks (Vowel Teams &amp; Syllables)</option>
                      <option value="middle-high">Lexicon Empire (Greek/Latin Roots &amp; Rules)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">Explorer Gender &amp; Companion</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewKidGender('boy')}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        newKidGender === 'boy'
                          ? 'bg-blue-950/70 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="text-xs font-black text-amber-200">👦 Boy Explorer</div>
                      <div className="text-[10px] text-blue-300">Kam journeys with you!</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewKidGender('girl')}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        newKidGender === 'girl'
                          ? 'bg-pink-950/70 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="text-xs font-black text-amber-200">👧 Girl Explorer</div>
                      <div className="text-[10px] text-pink-300">Celine journeys with you!</div>
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingKid(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                  >
                    Save Explorer
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {account.explorers.map((exp) => {
                const isActive = exp.id === activeExplorer.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => {
                      if (!isActive) {
                        switchExplorer(exp.id);
                        sounds.speak(`Switched to ${exp.name}! Let's play!`);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                      <AvatarRenderer customization={exp.customization} size={42} showPet={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-100 truncate">{exp.name}</span>
                        {isActive ? (
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                            Playing Now
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold underline">
                            Switch
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-400 font-mono tabular-nums">
                        ★ {exp.totalStars} stars · Lv.{exp.level}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {exp.customization.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Realm Scores */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Synced Land Scores for Explorer {activeExplorer.name}</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400">Total Stars: </span>
                  <b className="text-amber-400 font-mono">{activeExplorer.totalStars}</b>
                </div>
                <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400">Coins: </span>
                  <b className="text-amber-400 font-mono">{activeExplorer.coins}</b>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {PHONIXIA_LANDS.map((land, idx) => {
                const landStats = activeExplorer.landScores[land.id] || { completedGamesCount: 0, stars: 0 };
                const pct = Math.round((landStats.completedGamesCount / 50) * 100);

                return (
                  <div
                    key={land.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">
                          {idx === 0 ? '🐚' : idx === 1 ? '🏗️' : idx === 2 ? '🦊' : idx === 3 ? '🦅' : '🏛️'}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                            <span>{land.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="text-right">
                          <span className="text-slate-400">Completed: </span>
                          <span className="font-bold text-slate-200">{landStats.completedGamesCount}/50 Games</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{landStats.stars} Stars</span>
                        </div>
                        <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-bold">
                          {pct}% Progress
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, pct)}%`,
                          backgroundColor: land.themeColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>

          <button
            onClick={handleReturnToGame}
            className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-black shadow-lg cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Phonixia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
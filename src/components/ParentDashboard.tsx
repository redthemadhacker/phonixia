import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PHONIXIA_LANDS } from '../data/curriculumData';
import { ExplorerProfile } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { Users, UserPlus, Star, Trophy, CheckCircle, BarChart3, BookOpen, Printer, Sparkles, LogOut, ArrowLeft, Palette, Unlock, ChevronDown, ChevronUp, Award } from 'lucide-react';

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
  const { account, activeExplorer, switchExplorer, createExplorer, logout } = useGame();

  const [isAddingKid, setIsAddingKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState<ExplorerProfile['ageTier']>('preschool');
  const [isHallOfFameExpanded, setIsHallOfFameExpanded] = useState(false);

  // An explorer qualifies for the Hall of Fame if all 5 lands are completed (total 250 games)
  const hallOfFameExplorers = account.explorers.filter((exp) => {
    const totalCompleted = Object.values(exp.landScores).reduce(
      (sum, land) => sum + (land.completedGamesCount || 0),
      0
    );
    return totalCompleted >= 250 || exp.totalStars >= 750;
  });

  const handleCreateKid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKidName.trim()) return;
    createExplorer(newKidName.trim(), newKidAge);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header matching game theme */}
        <div className="px-6 py-4 bg-slate-950/95 border-b border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 text-2xl shadow-inner">
              🛖
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 font-display flex items-center gap-2">
                <span>Home Hut · Parent & Educator Hub</span>
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

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* HALL OF FAME EXPANDABLE BANNER */}
          <div className="rounded-2xl border-2 border-yellow-500/60 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 shadow-xl overflow-hidden transition-all">
            <div
              onClick={() => {
                setIsHallOfFameExpanded(!isHallOfFameExpanded);
                sounds.playStep();
              }}
              className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-amber-500/10 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow animate-bounce-gentle">🏆</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-amber-300 font-display tracking-wide uppercase">
                      Phonixia Hall of Fame
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      {hallOfFameExplorers.length} Champion{hallOfFameExplorers.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Grand honor roll for students and explorers who completed all 5 reading realms!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-950/80 px-2.5 py-1 rounded-xl border border-amber-500/40">
                <span>{isHallOfFameExpanded ? 'Hide Roster' : 'View Champions'}</span>
                {isHallOfFameExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* EXPANDABLE SCROLLABLE CLASSROOM ROSTER */}
            {isHallOfFameExpanded && (
              <div className="p-4 pt-1 border-t border-amber-500/30 bg-slate-950/90 space-y-3">
                {hallOfFameExplorers.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                    <Trophy className="w-8 h-8 mx-auto text-amber-500/40" />
                    <p className="font-bold text-slate-300">No Hall of Fame inductees yet!</p>
                    <p className="text-[11px] text-slate-500">
                      Finish all 50 games in every realm with any explorer to induct them here.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto pr-1 space-y-2.5 divide-y divide-slate-800/60">
                    {hallOfFameExplorers.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center text-xs font-black text-amber-400 font-mono">
                            #{index + 1}
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-400 flex items-center justify-center overflow-hidden shrink-0">
                            <AvatarRenderer customization={exp.customization} size={36} showPet={false} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-amber-200">{exp.name}</span>
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                                Grand Phonixian
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Completed 250/250 Reading Games · 5 Realms Mastered
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs text-right">
                          <div className="hidden sm:block">
                            <div className="text-amber-400 font-bold flex items-center justify-end gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{exp.totalStars} Stars</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Lv.{exp.level} Champion
                            </div>
                          </div>
                          <span className="text-xl">🎖️</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Explorer Profile Showcase & Customization */}
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
                <div className="text-xs text-slate-400 mt-0.5">
                  Title: <span className="text-slate-200">{activeExplorer.customization.title}</span> · Companion: <span className="capitalize text-slate-200">{activeExplorer.customization.companionPet.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono mt-1 text-amber-300">
                  <span>★ {activeExplorer.totalStars} Stars</span>
                  <span>🪙 {activeExplorer.coins} Coins</span>
                  <span>🎟️ {activeExplorer.arcadeTokens} Tokens</span>
                </div>
              </div>
            </div>

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

            {/* Add Kid Form */}
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
                      <option value="preschool">Sound Shallows (Letter Sounds & Rhymes)</option>
                      <option value="kindergarten">Builders Guild (Word Building & Blending)</option>
                      <option value="early-elementary">Tricky Trails (Silent E & Phonics Paths)</option>
                      <option value="late-elementary">Whispering Peaks (Vowel Teams & Syllables)</option>
                      <option value="middle-school">Lexicon Empire (Greek/Latin Roots & Rules)</option>
                    </select>
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

            {/* Explorers List */}
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
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
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
                      <div className="text-[10px] text-slate-400">
                        {exp.customization.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Synced 5-Land Scores & Real-Time Phonics Mastery */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Synced Land Scores for Explorer {activeExplorer.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Scores update and sync automatically as games are completed
                </p>
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

            {/* Lands Progress Table */}
            <div className="space-y-3">
              {PHONIXIA_LANDS.map((land, idx) => {
                const landStats = activeExplorer.landScores[land.id];
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
                          <div className="text-[11px] text-slate-400">
                            {land.levels[0]?.skillFocus} through {land.levels[4]?.skillFocus}
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

                    {/* Progress Bar */}
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

        {/* Footer with Return to Phonixia and Log Out */}
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
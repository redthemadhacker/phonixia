import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { PHONIXIA_LANDS } from '../data/curriculumData';
import { 
  X, Users, Palette, BarChart3, Settings, Star, Crown, Award, 
  UserPlus, RefreshCw, LogOut, CheckCircle2, 
  Sparkles, Flame, Scroll, Edit3, Check, Shirt, GraduationCap, Trash2, Camera
} from 'lucide-react';

interface HomeHutModalProps {
  onClose: () => void;
  onOpenCelebration?: () => void;
}

export const HomeHutModal: React.FC<HomeHutModalProps> = ({ onClose, onOpenCelebration }) => {
  const {
    account,
    activeExplorer,
    switchExplorer,
    createExplorer,
    updateExplorerName,
    updateExplorerGender,
    updateAvatarCustomization,
    resetExplorerProgress,
    resetClassroomAndGameData,
    logout
  } = useGame();

  const [activeTab, setActiveTab] = useState<'explorers' | 'customizer' | 'progress' | 'halloffame' | 'settings'>('customizer');
  const [newExplorerName, setNewExplorerName] = useState('');
  const [newExplorerGender, setNewExplorerGender] = useState<'boy' | 'girl'>('boy');
  const [newExplorerTier, setNewExplorerTier] = useState<'preschool' | 'kindergarten' | 'early-elementary' | 'late-elementary' | 'middle-high'>('preschool');
  const [isCreating, setIsCreating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Explorer Name & Customization Draft State
  const [draftName, setDraftName] = useState(activeExplorer.name);
  const [draftGender, setDraftGender] = useState<'boy' | 'girl'>(activeExplorer.gender || 'boy');
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftCustomization, setDraftCustomization] = useState({ 
    ...activeExplorer.customization,
    outfitStyle: activeExplorer.customization.outfitStyle || 'ranger'
  });

  // Customization Palettes
  const SKIN_TONES = ['#ffd1a4', '#fcd5b5', '#d99058', '#b0703c', '#8a4b1e', '#5c3818'];
  
  const OUTFIT_STYLES = [
    { id: 'ranger', label: 'Ranger Suit', icon: '🏹', desc: 'Forest tracker gear' },
    { id: 'scholar', label: 'Scholar Robes', icon: '📜', desc: 'Citadel academic wear' },
    { id: 'wizard', label: 'Wizard Cloak', icon: '🧙‍♂️', desc: 'Enchanted mystic coat' },
    { id: 'knight', label: 'Knight Armor', icon: '🛡️', desc: 'Shining plate cuirass' },
    { id: 'ninja', label: 'Ninja Gi', icon: '🥷', desc: 'Silent stealth shroud' },
    { id: 'adventurer', label: 'Adventurer Vest', icon: '🧭', desc: 'Trail blazer jacket' },
    { id: 'classic', label: 'Classic Tunic', icon: '👕', desc: 'Comfortable explorer tee' }
  ];

  const OUTFIT_COLORS = [
    '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', 
    '#06b6d4', '#eab308', '#64748b', '#1e293b'
  ];

  const HAIR_STYLES = [
    { id: 'curls', label: 'Curls' },
    { id: 'braids', label: 'Braids' },
    { id: 'afro', label: 'Afro' },
    { id: 'short', label: 'Short' },
    { id: 'spiky', label: 'Spiky' },
    { id: 'wavy', label: 'Wavy' },
    { id: 'straight', label: 'Straight' }
  ];

  const HAIR_COLORS = [
    '#1e1b18', '#3d2314', '#5c3818', '#b45309', '#d97706', 
    '#dc2626', '#ec4899', '#8b5cf6', '#3b82f6', '#e0e7ff'
  ];

  const ACCESSORIES = [
    { id: 'none', label: 'None' },
    { id: 'glasses', label: 'Glasses 👓' },
    { id: 'sparkles', label: 'Magic Sparkles ✨' },
    { id: 'crown', label: 'Royal Crown 👑' },
    { id: 'bandana', label: 'Explorer Bandana 🧣' },
    { id: 'headband', label: 'Sport Headband ⚡' }
  ];

  const COMPANIONS = [
    { id: 'baby-dragon', name: 'Baby Dragon', icon: '🐲', desc: 'Kam’s Dragon Companion' },
    { id: 'feather-owl', name: 'Starlight Owl', icon: '🦉', desc: 'Celine’s Owl Companion' },
    { id: 'golden-phonix', name: 'Golden Phoenix', icon: '🦅', desc: 'Legendary Flamekeeper Guide' },
    { id: 'woodland-fox', name: 'Curious Fox', icon: '🦊', desc: 'Clever & Quick' },
    { id: 'sea-turtle', name: 'Wise Turtle', icon: '🐢', desc: 'Patient & Steady' },
    { id: 'bunny', name: 'Brisk Bunny', icon: '🐰', desc: 'Speedy Reader' }
  ];

  const handleGenderToggle = (gender: 'boy' | 'girl') => {
    setDraftGender(gender);
    sounds.playStep();
    if (gender === 'boy') {
      setDraftCustomization(prev => ({
        ...prev,
        companionPet: 'baby-dragon',
        title: 'Adventurer with Kam',
        outfitColor: prev.outfitColor === '#ec4899' ? '#3b82f6' : prev.outfitColor
      }));
    } else {
      setDraftCustomization(prev => ({
        ...prev,
        companionPet: 'feather-owl',
        title: 'Adventurer with Celine',
        outfitColor: prev.outfitColor === '#3b82f6' ? '#ec4899' : prev.outfitColor
      }));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExplorerName.trim()) return;
    createExplorer(newExplorerName.trim(), newExplorerTier, newExplorerGender);
    setNewExplorerName('');
    setIsCreating(false);
    sounds.playFanfare();
    sounds.speak(`Welcome to Phonixia, ${newExplorerName}! Traveling with ${newExplorerGender === 'boy' ? 'Kam' : 'Celine'}!`);
  };

  const handleSaveAll = () => {
    if (draftName.trim() && draftName.trim() !== activeExplorer.name) {
      updateExplorerName(activeExplorer.id, draftName.trim());
    }
    updateExplorerGender(activeExplorer.id, draftGender);
    updateAvatarCustomization(draftCustomization);
    setIsEditingName(false);
    sounds.playSuccess();
    sounds.speak(`Profile updated for ${draftName.trim() || activeExplorer.name}!`);
  };

  const handleTeacherClassroomReset = () => {
    const confirmation = confirm(
      '⚠️ EDUCATOR YEAR-END RESET:\n\nThis will reset student game progress to Level 1 and PERMANENTLY ERASE the entire leaderboard so you can welcome a new class this school year.\n\nAre you sure you want to proceed?'
    );
    if (confirmation) {
      resetClassroomAndGameData();
      sounds.playFanfare();
      setSyncStatus('Classroom and leaderboard have been reset for the new school year!');
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  return (
    <div 
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 8px)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 8px)'
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[820px] bg-slate-900 border-4 border-amber-600/70 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b-2 border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-400/80 flex items-center justify-center text-xl shadow">
              🛖
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-display uppercase tracking-wide">
                  Home Hut
                </h2>
                {account.role === 'teacher' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/60 text-blue-300 text-[10px] font-black uppercase flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Educator</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {account.role === 'teacher' ? 'Classroom Hub' : 'Family Hub'} · {account.familyName}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playStep();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 p-1.5 bg-slate-950/60 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('explorers')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'explorers' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explorers</span>
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'customizer' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'progress' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('halloffame')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'halloffame' 
                ? 'bg-amber-500 text-slate-950 font-black shadow' 
                : activeExplorer.isHallOfFameInducted
                  ? 'text-amber-300 hover:text-amber-200 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Legends</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: EXPLORERS */}
          {activeTab === 'explorers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Active Explorers ({account.explorers.length})
                </span>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow cursor-pointer transition-transform hover:scale-105"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Explorer</span>
                  </button>
                )}
              </div>

              {/* Explorer Creation Form */}
              {isCreating && (
                <form onSubmit={handleCreateSubmit} className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/50 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">New Explorer Profile</span>
                    <button type="button" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white text-xs">
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Explorer Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Liam"
                        value={newExplorerName}
                        onChange={(e) => setNewExplorerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Grade / Reading Level
                      </label>
                      <select
                        value={newExplorerTier}
                        onChange={(e) => setNewExplorerTier(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="preschool">Preschool (Ages 3-4)</option>
                        <option value="kindergarten">Kindergarten (Ages 5-6)</option>
                        <option value="early-elementary">Early Elementary (Ages 6-8)</option>
                        <option value="late-elementary">Late Elementary (Ages 8-11)</option>
                        <option value="middle-high">Middle &amp; High (Ages 11+)</option>
                      </select>
                    </div>
                  </div>

                  {/* Gender Selector with Kam / Celine Auto-Binding */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Gender &amp; Traveling Companion
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewExplorerGender('boy')}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          newExplorerGender === 'boy'
                            ? 'bg-blue-950/70 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                            : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs font-black text-amber-200">👦 Boy Explorer</div>
                        <div className="text-[10px] text-blue-300 font-bold">Kam Travels with You</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewExplorerGender('girl')}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          newExplorerGender === 'girl'
                            ? 'bg-pink-950/70 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] ring-1 ring-amber-400'
                            : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs font-black text-amber-200">👧 Girl Explorer</div>
                        <div className="text-[10px] text-pink-300 font-bold">Celine Travels with You</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer"
                  >
                    Create &amp; Switch Explorer
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {account.explorers.map((exp) => {
                  const isActive = exp.id === activeExplorer.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        switchExplorer(exp.id);
                        setDraftName(exp.name);
                        setDraftGender(exp.gender || 'boy');
                        setDraftCustomization({ 
                          ...exp.customization,
                          outfitStyle: exp.customization.outfitStyle || 'ranger'
                        });
                        sounds.playSuccess();
                        sounds.speak(`Switched to ${exp.name}!`);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/60 flex items-center justify-center overflow-hidden">
                          <AvatarRenderer customization={exp.customization} size={42} showPet={false} />
                          {exp.isHallOfFameInducted && (
                            <span className="absolute bottom-0 right-0 text-xs">👑</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-100">{exp.name}</span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {exp.gender === 'girl' ? '👧 Girl' : '👦 Boy'} · Companion: {exp.gender === 'girl' ? 'Celine' : 'Kam'}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end text-xs font-mono font-bold">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{exp.totalStars}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {Object.values(exp.landScores || {}).reduce((s, l: any) => s + (l.completedGamesCount || 0), 0)}/250 Games
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FULL AVATAR & NAME CUSTOMIZER STUDIO */}
          {activeTab === 'customizer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Left Live Avatar + Companion Preview Card */}
              <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/40 shadow-inner space-y-4">
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-amber-950/80 to-slate-950 border-4 border-amber-400 flex items-center justify-center overflow-visible shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <AvatarRenderer customization={draftCustomization} size={115} showPet={true} />
                </div>
                
                {/* Editable Explorer Name */}
                <div className="w-full text-center space-y-1">
                  {isEditingName ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="px-2.5 py-1 text-sm font-black text-amber-300 bg-slate-900 border border-amber-400 rounded-lg text-center focus:outline-none w-40"
                        autoFocus
                      />
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
                        title="Done"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                      <span className="text-lg font-black text-amber-300 font-display">
                        {draftName || activeExplorer.name}
                      </span>
                      <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400">
                    {draftGender === 'boy' ? '👦 Traveling with Kam' : '👧 Traveling with Celine'}
                  </div>
                </div>

                <button
                  onClick={handleSaveAll}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  Save Profile Changes
                </button>
              </div>

              {/* Right Customization Controls */}
              <div className="md:col-span-2 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                {/* GENDER & COMPANION EDIT IN STUDIO */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Explorer Gender &amp; Companion
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenderToggle('boy')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        draftGender === 'boy'
                          ? 'bg-blue-950/70 border-amber-400 text-amber-300 shadow ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xl">👦</span>
                      <div className="text-left">
                        <div className="leading-tight">Boy Explorer</div>
                        <div className="text-[10px] text-blue-300">Kam as Companion</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenderToggle('girl')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        draftGender === 'girl'
                          ? 'bg-pink-950/70 border-amber-400 text-amber-300 shadow ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xl">👧</span>
                      <div className="text-left">
                        <div className="leading-tight">Girl Explorer</div>
                        <div className="text-[10px] text-pink-300">Celine as Companion</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* THEMED OUTFIT SUITS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-amber-400" />
                    <label className="text-xs font-black text-amber-400 uppercase tracking-wide">
                      Themed Outfit Suit
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OUTFIT_STYLES.map((suit) => (
                      <button
                        key={suit.id}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, outfitStyle: suit.id }))}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          draftCustomization.outfitStyle === suit.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md scale-102 ring-1 ring-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xl">{suit.icon}</span>
                        <div className="text-left">
                          <div className="leading-tight">{suit.label}</div>
                          <div className="text-[9px] text-slate-500 font-normal">{suit.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit Color Palette */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Outfit Accent Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OUTFIT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, outfitColor: color }))}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          draftCustomization.outfitColor === color ? 'border-amber-400 scale-125 shadow-lg ring-2 ring-amber-400/50' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Companion Pets */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Companion Pet
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMPANIONS.map((pet) => (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, companionPet: pet.id }))}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                          draftCustomization.companionPet === pet.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md scale-102 ring-1 ring-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{pet.icon}</span>
                        <div className="text-left">
                          <div className="leading-tight">{pet.name}</div>
                          <div className="text-[9px] text-slate-500 font-normal">{pet.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Hair Style
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {HAIR_STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, hairStyle: style.id }))}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          draftCustomization.hairStyle === style.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Hair Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, hairColor: color }))}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          draftCustomization.hairColor === color ? 'border-amber-400 scale-125 shadow-lg ring-2 ring-amber-400/50' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Skin Tone */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Skin Tone
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, skinTone: color }))}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          draftCustomization.skinTone === color ? 'border-amber-400 scale-125 shadow-lg ring-2 ring-amber-400/50' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                    Accessory
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESSORIES.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setDraftCustomization((p) => ({ ...p, accessory: acc.id }))}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          draftCustomization.accessory === acc.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REALM QUEST PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {activeExplorer.name}'s Realm Quest Map
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Power Stars: <b className="text-amber-400">{activeExplorer.totalStars}</b>
                </span>
              </div>

              <div className="space-y-2.5">
                {PHONIXIA_LANDS.map((land) => {
                  const score = activeExplorer.landScores?.[land.id] || { completedGamesCount: 0, stars: 0, unlocked: false };
                  const percent = Math.min(100, Math.round((score.completedGamesCount / 50) * 100));

                  return (
                    <div key={land.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-slate-100 font-display uppercase tracking-wide">
                            {land.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{land.gradeLevel}</div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono font-bold">
                          <span className="text-amber-400 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {score.stars}
                          </span>
                          <span className="text-slate-300">{score.completedGamesCount}/50</span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: HALL OF FAME & REWATCH CORONATION */}
          {activeTab === 'halloffame' && (
            <div className="space-y-5">
              {activeExplorer.isHallOfFameInducted ? (
                <div className="relative p-6 rounded-3xl bg-gradient-to-b from-amber-950/70 via-slate-950 to-slate-950 border-2 border-amber-400 text-center space-y-4 shadow-2xl overflow-hidden">
                  <div className="absolute top-3 right-3 text-3xl opacity-30 select-none">👑</div>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-300 font-mono text-[11px] font-black uppercase tracking-widest">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>Eternal Flamekeeper · Savior of the Golden Phoenix</span>
                  </div>

                  <div className="relative mx-auto w-24 h-24 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <AvatarRenderer customization={activeExplorer.customization} size={70} showPet={true} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-amber-300 font-display uppercase tracking-wider">
                      {activeExplorer.name}
                    </h3>
                    <p className="text-xs text-amber-200 font-bold">{activeExplorer.customization.title}</p>
                    <p className="text-[11px] text-slate-300 max-w-md mx-auto pt-2 leading-relaxed">
                      Legendary savior of the Golden Phoenix! Conquered all 5 realms, vanquished the Shadow King, and earned your place on the permanent Wall of Fame!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto pt-1 text-center font-mono">
                    <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/30">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Stars</span>
                      <span className="text-xs font-black text-amber-400">{activeExplorer.totalStars}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/30">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Stages Won</span>
                      <span className="text-xs font-black text-teal-300">250 / 250</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/30">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Story Clears</span>
                      <span className="text-xs font-black text-rose-400">{Math.max(1, activeExplorer.timesStorylineCompleted || 1)}x</span>
                    </div>
                  </div>

                  {onOpenCelebration && (
                    <button
                      onClick={onOpenCelebration}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mx-auto cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <Camera className="w-4 h-4 stroke-[2.5]" />
                      <span>Rewatch Coronation &amp; Wall of Fame Ceremony</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-2xl text-slate-500">
                    👑
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-wide">
                      {activeExplorer.name}'s Rescue Quest in Progress
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto pt-1">
                      Conquer all 50 challenge stages across all five realms to defeat the Shadow King, rescue the Golden Phoenix, and unlock your Coronation Aisle &amp; Wall of Fame picture!
                    </p>
                  </div>
                </div>
              )}

              {/* Family Registry */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>Eternal Flamekeepers Inductees</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {account.explorers
                    .filter((e) => e.isHallOfFameInducted)
                    .map((inductee) => (
                      <div
                        key={inductee.id}
                        className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center overflow-hidden">
                            <AvatarRenderer customization={inductee.customization} size={32} showPet={false} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-black text-amber-200">{inductee.name}</span>
                              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Level {inductee.level} · {inductee.totalStars} Stars
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                          Inducted
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & TEACHER CLASSROOM RESET */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {syncStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                  {syncStatus}
                </div>
              )}

              {/* Automatic Cloud Save Status */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-base">
                    ☁️
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                      <span>Automatic Cloud Game Save</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-400/40">
                        ACTIVE &amp; ENCRYPTED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Your progress, stars, and character customization automatically sync across all your devices.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Signed in as: <b className="text-amber-400">@{account.username}</b> ({account.role === 'teacher' ? 'Educator' : 'Parent/Family'})</span>
                  <span className="text-emerald-400 font-bold">● Cloud Connected</span>
                </div>
              </div>

              {/* TEACHER ONLY: CLASSROOM & LEADERBOARD RESET FOR NEW SCHOOL YEAR */}
              {account.role === 'teacher' && (
                <div className="p-4 rounded-2xl bg-slate-950 border-2 border-rose-500/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-rose-400" />
                        <span>Educator Year-End Reset</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 max-w-md">
                        Resets all classroom explorer progress to Stage 1 and <b>completely purges the class leaderboard</b> so you can start a fresh cohort of students every school year.
                      </p>
                    </div>
                    <button
                      onClick={handleTeacherClassroomReset}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset Class &amp; Board</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reset Single Explorer Story Progress */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-rose-400 uppercase tracking-wide">
                    Reset Active Story Progress
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Resets completed lands for {activeExplorer.name} back to Sound Shallows.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Reset storyline progress for ${activeExplorer.name}?`)) {
                      resetExplorerProgress(activeExplorer.id);
                      sounds.playFanfare();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              </div>

              {/* Log Out */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Phonixia Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
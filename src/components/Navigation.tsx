import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { Volume2, VolumeX, Sparkles, UserPlus, Users } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openParentDashboard: () => void;
  openCharacterCreator: () => void;
  openAuthModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  openParentDashboard,
  openCharacterCreator,
  openAuthModal
}) => {
  const {
    account,
    activeExplorer,
    switchExplorer,
    soundEnabled,
    toggleSound
  } = useGame();

  const [explorerDropdownOpen, setExplorerDropdownOpen] = useState(false);

  return (
    <header 
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1.25rem)',
        paddingRight: 'calc(env(safe-area-inset-right, 0px) + 1.25rem)'
      }}
      className="sticky top-0 z-50 flex items-center justify-between pb-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800"
    >
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('world')}
          className="font-display text-xl font-bold tracking-wider text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🔥</span>
          PHONIXIA
        </button>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean unboxed hover states) */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => setCurrentView('world')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            currentView === 'world' ? 'text-amber-400 font-semibold' : 'hover:text-amber-300'
          }`}
        >
          World Map
        </button>
        <button
          onClick={() => setCurrentView('isles-of-play')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            currentView === 'isles-of-play' ? 'text-emerald-400 font-semibold' : 'hover:text-emerald-300'
          }`}
        >
          Isles of Play
        </button>
        <button
          onClick={() => setCurrentView('shellshore-arcade')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            currentView === 'shellshore-arcade' ? 'text-sky-400 font-semibold' : 'hover:text-sky-300'
          }`}
        >
          Shellshore Arcade
        </button>
        <button
          onClick={openCharacterCreator}
          className="cursor-pointer hover:text-purple-300 transition-colors whitespace-nowrap"
        >
          Explorer Studio
        </button>
        <button
          onClick={openParentDashboard}
          className="cursor-pointer hover:text-indigo-300 transition-colors whitespace-nowrap"
        >
          Parent & Teacher Hub
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Active Explorer Switcher & Sound Toggle) */}
      <div className="flex items-center gap-3">
        {/* Audio FX Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          aria-label={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Explorer Switcher Pill / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExplorerDropdownOpen(!explorerDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-amber-500/40 shrink-0">
              <AvatarRenderer customization={activeExplorer.customization} size={28} showPet={false} />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-bold text-slate-100 truncate max-w-[90px]">
                {activeExplorer.name}
              </div>
              <div className="text-[10px] text-amber-400 font-medium font-mono tabular-nums">
                ★ {activeExplorer.totalStars} · Lv.{activeExplorer.level}
              </div>
            </div>
            <span className="text-xs text-slate-400">▾</span>
          </button>

          {/* Switcher Dropdown */}
          {explorerDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50"
              onMouseLeave={() => setExplorerDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Explorers in {account.familyName}</span>
                <span className="text-[11px] text-amber-400 font-medium">Synced</span>
              </div>

              <div className="py-1 max-h-56 overflow-y-auto space-y-1">
                {account.explorers.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      switchExplorer(exp.id);
                      setExplorerDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      exp.id === activeExplorer.id
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                        : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                      <AvatarRenderer customization={exp.customization} size={30} showPet={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center justify-between">
                        <span>{exp.name}</span>
                        {exp.id === activeExplorer.id && (
                          <span className="text-[10px] text-amber-400">Active</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        ★ {exp.totalStars} stars · {exp.customization.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-1 border-t border-slate-800 flex flex-col gap-1">
                <button
                  onClick={() => {
                    openCharacterCreator();
                    setExplorerDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-indigo-300 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Customize {activeExplorer.name}
                </button>
                <button
                  onClick={() => {
                    openParentDashboard();
                    setExplorerDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-300 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add New Explorer Child
                </button>
                <button
                  onClick={() => {
                    openAuthModal();
                    setExplorerDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  Switch Parent Account ({account.username})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
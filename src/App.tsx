import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { ParentDashboard } from './components/ParentDashboard';
import { CharacterCreator } from './components/CharacterCreator';
import { AuthModal } from './components/AuthModal';
import { AvatarRenderer } from './components/AvatarRenderer';
import { LandId, MinigameId } from './types/character';
import { sounds } from './utils/audio';
import { Star, Sparkles, UserPlus, LogIn, Compass, Flame } from 'lucide-react';
import phonixiaMap from '../phonixia.png';

const GameContent: React.FC = () => {
  const {
    account,
    activeExplorer,
    showHallOfFameCelebration,
    dismissHallOfFameCelebration
  } = useGame();

  // Signed-in session check (starts on landing if user clicked logout or has no active session)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('phonixia_is_logged_in_v1'));
  });

  // Navigation states
  const [activeLandId, setActiveLandId] = useState<LandId | null>(null);
  const [activeMinigameHub, setActiveMinigameHub] = useState<MinigameId | null>(null);
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(false);
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sign out handler
  const handleLogoutSession = () => {
    localStorage.removeItem('phonixia_is_logged_in_v1');
    setIsSignedIn(false);
    setIsHomeHutOpen(false);
    setActiveLandId(null);
    setActiveMinigameHub(null);
  };

  const handleEnterGame = () => {
    localStorage.setItem('phonixia_is_logged_in_v1', 'true');
    setIsSignedIn(true);
    sounds.playFanfare();
    sounds.speak('Welcome to Phonixia! Happy reading!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-2 sm:p-4 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* 0. WELCOME / LANDING SCREEN (WHEN NOT SIGNED IN) */}
      {!isSignedIn ? (
        <div className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1500px] mx-auto rounded-3xl overflow-hidden border-4 border-amber-900/80 shadow-2xl bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Background Map Art with Dark Blur Overlay */}
          <img
            src={phonixiaMap}
            alt="Phonixia"
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-radial-gradient from-slate-950/60 via-slate-950/85 to-slate-950" />

          {/* Welcome Card */}
          <div className="relative z-10 max-w-xl mx-auto space-y-6 bg-slate-900/90 border-2 border-amber-500/60 p-6 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
            {/* Crest */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-red-800 via-amber-600 to-red-800 border-2 border-amber-400 text-amber-100 font-display text-xl sm:text-2xl font-black uppercase tracking-widest shadow-xl">
              <Flame className="w-5 h-5 text-amber-300 animate-pulse fill-amber-400" />
              <span>PHONIXIA</span>
              <Flame className="w-5 h-5 text-amber-300 animate-pulse fill-amber-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 font-display tracking-wide">
                Explore the world of Phonixia with Kam and Celine!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Step into magical reading realms, build phonics superpowers, unlock arcade games, and explore the islands.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {/* Create Parent / Teacher Profile */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Parent / Teacher Profile</span>
              </button>

              {/* Login Current Explorer / Family */}
              <button
                onClick={() => {
                  handleEnterGame();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-950/90 hover:bg-slate-800 text-amber-300 border border-amber-500/60 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Login Current Explorer</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Cozy, self-paced phonics adventure for all reading levels</span>
            </div>
          </div>
        </div>
      ) : activeLandId ? (
        /* 1. EXPLORABLE LAND REALM VIEW */
        <LandLevelView
          landId={activeLandId}
          onBackToWorld={() => setActiveLandId(null)}
        />
      ) : activeMinigameHub === 'isles-of-play' ? (
        /* 2. ISLES OF PLAY HUB */
        <IslesOfPlay onBackToWorld={() => setActiveMinigameHub(null)} />
      ) : activeMinigameHub === 'shellshore-arcade' ? (
        /* 3. SHELLSHORE ARCADE HUB */
        <ShellshoreArcade onBackToWorld={() => setActiveMinigameHub(null)} />
      ) : (
        /* 4. MAIN WORLD MAP */
        <WorldCanvas
          onSelectLand={(landId) => setActiveLandId(landId)}
          onSelectMinigame={(minigameId) => setActiveMinigameHub(minigameId)}
          onOpenHomeHut={() => setIsHomeHutOpen(true)}
        />
      )}

      {/* HOME HUT / PARENT & EDUCATOR DASHBOARD */}
      {isHomeHutOpen && (
        <ParentDashboard
          onClose={() => setIsHomeHutOpen(false)}
          onOpenCharacterCreator={() => setIsCharacterCreatorOpen(true)}
          onOpenAuthModal={() => {
            handleLogoutSession();
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* CHARACTER CREATOR MODAL */}
      {isCharacterCreatorOpen && (
        <CharacterCreator
          onClose={() => setIsCharacterCreatorOpen(false)}
        />
      )}

      {/* AUTHENTICATION / ACCOUNT SWITCH MODAL */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => {
            setIsAuthModalOpen(false);
            handleEnterGame();
          }}
        />
      )}

      {/* HALL OF FAME CELEBRATION MODAL */}
      {showHallOfFameCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-amber-950/80 to-slate-900 border-4 border-amber-400 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-scale-up">
            <div className="text-5xl animate-bounce">🏆</div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 font-display tracking-wide uppercase">
                Grand Phonixian Champion!
              </h2>
              <p className="text-sm sm:text-base text-amber-100 font-semibold leading-relaxed">
                Congrats! You explored all the lands of Phonixia and mastered reading and phonics!
              </p>
            </div>

            <div className="mx-auto w-24 h-24 rounded-2xl bg-amber-950/60 border-2 border-amber-400 flex items-center justify-center overflow-hidden shadow-xl">
              <AvatarRenderer customization={activeExplorer.customization} size={72} facing="down" showPet={true} />
            </div>

            <div className="text-xs font-mono text-amber-300 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                750 / 750 Stars
              </span>
              <span>·</span>
              <span>250 / 250 Games Mastered</span>
            </div>

            <button
              onClick={() => {
                sounds.playFanfare();
                sounds.speak(`Inducted ${activeExplorer.name} into the Phonixia Hall of Fame! Outstanding work!`);
                dismissHallOfFameCelebration();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-2xl cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Click Here to Add Player Profile to Hall of Fame</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default App;
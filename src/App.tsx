import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { HomeHutModal } from './components/HomeHutModal';
import { HallOfFameCelebration } from './components/HallOfFameCelebration';
import { AuthGateway } from './components/AuthGateway';
import { LandId, MinigameId } from './types/character';

const GameShell: React.FC = () => {
  const { showHallOfFameCelebration, dismissHallOfFameCelebration } = useGame();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<'world' | 'land' | 'isles' | 'arcade'>('world');
  const [selectedLand, setSelectedLand] = useState<LandId>('sound-shallows');
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(false);
  const [manualCelebrationOpen, setManualCelebrationOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthGateway onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-slate-950 flex flex-col justify-between overflow-hidden select-none fixed inset-0">
      {/* 1. Main Interactive World Map */}
      {currentView === 'world' && (
        <WorldCanvas
          onSelectLand={(landId) => {
            setSelectedLand(landId);
            setCurrentView('land');
          }}
          onSelectMinigame={(minigameId: MinigameId) => {
            if (minigameId === 'isles-of-play') setCurrentView('isles');
            if (minigameId === 'shellshore-arcade') setCurrentView('arcade');
          }}
          onOpenHomeHut={() => setIsHomeHutOpen(true)}
        />
      )}

      {/* 2. Structured Curriculum Realm View */}
      {currentView === 'land' && (
        <LandLevelView
          landId={selectedLand}
          onBackToWorld={() => setCurrentView('world')}
        />
      )}

      {/* 3. Isles of Play Sandbox */}
      {currentView === 'isles' && (
        <IslesOfPlay onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 4. Shellshore Arcade Sandbox */}
      {currentView === 'arcade' && (
        <ShellshoreArcade onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 5. Home Hut Modal */}
      {isHomeHutOpen && (
        <HomeHutModal
          onClose={() => setIsHomeHutOpen(false)}
          onOpenCelebration={() => {
            setIsHomeHutOpen(false);
            setManualCelebrationOpen(true);
          }}
        />
      )}

      {/* 6. Grand Hall of Fame Celebration Modal */}
      {(showHallOfFameCelebration || manualCelebrationOpen) && (
        <HallOfFameCelebration
          onDismiss={() => {
            dismissHallOfFameCelebration();
            setManualCelebrationOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
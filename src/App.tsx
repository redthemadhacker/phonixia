import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { HomeHutModal } from './components/HomeHutModal';
import { HallOfFameCelebration } from './components/HallOfFameCelebration';
import { AuthGateway } from './components/AuthGateway';
import { LandId, MinigameId } from './types/character';

// Fallback screen to display any crash in plain text
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ff6b6b', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>⚠️ Frontend Render Crash:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#222', padding: '1rem', borderRadius: '8px' }}>
            {this.state.error?.stack || this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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

      {currentView === 'land' && (
        <LandLevelView
          landId={selectedLand}
          onBackToWorld={() => setCurrentView('world')}
        />
      )}

      {currentView === 'isles' && (
        <IslesOfPlay onBackToWorld={() => setCurrentView('world')} />
      )}

      {currentView === 'arcade' && (
        <ShellshoreArcade onBackToWorld={() => setCurrentView('world')} />
      )}

      {isHomeHutOpen && (
        <HomeHutModal
          onClose={() => setIsHomeHutOpen(false)}
          onOpenCelebration={() => {
            setIsHomeHutOpen(false);
            setManualCelebrationOpen(true);
          }}
        />
      )}

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
    <ErrorBoundary>
      <GameProvider>
        <GameShell />
      </GameProvider>
    </ErrorBoundary>
  );
}
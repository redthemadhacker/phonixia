import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
import { MarioOverworldMap } from './components/MarioOverworldMap';
import { ActivePlayableStage } from './components/ActivePlayableStage';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { HomeHutModal } from './components/HomeHutModal';
import { HallOfFameCelebration } from './components/HallOfFameCelebration';
import { ParentPinModal } from './components/ParentPinModal';
import { ParentDashboard } from './components/ParentDashboard';
import { AuthGateway } from './components/AuthGateway';
import { LandId, MinigameId } from './types/character';
import { getCompanionGuide } from './context/GameContext';
import { sounds } from './utils/audio';
import { getComprehensiveStageChallenge, StageChallenge } from './data/comprehensiveCurriculum';

// Fallback screen to display any crash in plain text
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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

const LAND_NAMES: Record<LandId, string> = {
  'sound-shallows': 'Sound Shallows',
  'builders-guild': 'Builders Guild',
  'tricky-trails': 'Tricky Trails',
  'whispering-peaks': 'Whispering Peaks',
  'lexicon-empire': 'Lexicon Empire',
};

const GameShell: React.FC = () => {
  const { 
    activeExplorer,
    showHallOfFameCelebration, 
    dismissHallOfFameCelebration,
    updateExplorerScore
  } = useGame();
  
  const companionGuide = getCompanionGuide(activeExplorer);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('phonixia_active_session') === 'true';
  });

  const [currentView, setCurrentView] = useState<'world' | 'land-map' | 'playing-stage' | 'isles' | 'arcade'>('world');
  const [selectedLand, setSelectedLand] = useState<LandId>('sound-shallows');
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const [questionRandomSeed, setQuestionRandomSeed] = useState<number>(0);
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(false);
  const [manualCelebrationOpen, setManualCelebrationOpen] = useState(false);
  const [isParentPinModalOpen, setIsParentPinModalOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);

  // Active Playable Stage state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [realmLives, setRealmLives] = useState(3);
  const [earnedStars, setEarnedStars] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  // Retrieve comprehensive, difficulty-aligned, randomized phonics challenge across all 250 stages
  const activeQuestion = React.useMemo(() => {
    return getComprehensiveStageChallenge(selectedLand, activeStageNumber);
  }, [selectedLand, activeStageNumber, questionRandomSeed]);

  if (!isAuthenticated) {
    return <AuthGateway onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleLaunchStage = (stageNum: number) => {
    setActiveStageNumber(stageNum);
    setQuestionRandomSeed((s) => s + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRoundCompleted(false);
    setRealmLives(3);
    setEarnedStars(0);
    setCurrentView('playing-stage');
  };

  const handleSelectChoice = (choice: string) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    const win = choice.trim().toLowerCase() === activeQuestion.correct.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      setEarnedStars(3);
      setRoundCompleted(true);
      updateExplorerScore(selectedLand, 1, 3);
    } else {
      setRealmLives((l) => Math.max(0, l - 1));
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-slate-950 flex flex-col justify-between overflow-hidden select-none fixed inset-0">
      
      {/* 1. GLOBAL WORLD CANVAS */}
      {currentView === 'world' && (
        <WorldCanvas
          onSelectLand={(landId) => {
            setSelectedLand(landId);
            setCurrentView('land-map');
          }}
          onSelectMinigame={(minigameId: MinigameId) => {
            if (minigameId === 'isles-of-play') setCurrentView('isles');
            if (minigameId === 'shellshore-arcade') setCurrentView('arcade');
          }}
          onOpenHomeHut={() => setIsHomeHutOpen(true)}
        />
      )}

      {/* 2. MAIN REALM EXPLORATION (5 PLACES TO EXPLORE WITHIN EACH REALM) */}
      {currentView === 'land-map' && (
        <LandLevelView
          landId={selectedLand}
          onBackToWorld={() => setCurrentView('world')}
        />
      )}

      {/* 3. ACTIVE GAMEPLAY STAGE */}
      {currentView === 'playing-stage' && (
        <ActivePlayableStage
          landId={selectedLand}
          activeExplorer={activeExplorer}
          companionGuide={companionGuide}
          currentQuestion={activeQuestion}
          activeGameIndex={activeStageNumber}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          realmLives={realmLives}
          earnedStars={earnedStars}
          bossBarrierHp={100}
          roundCompleted={roundCompleted}
          onSelectChoice={handleSelectChoice}
          onFinishRound={() => setCurrentView('land-map')}
          onTryAgain={() => {
            setIsAnswered(false);
            setSelectedAnswer(null);
            sounds.speakPhonicsSlow(activeQuestion.soundCue);
          }}
          onNextLevel={() => {
            const nextStage = Math.min(50, activeStageNumber + 1);
            handleLaunchStage(nextStage);
          }}
          onClose={() => setCurrentView('land-map')}
        />
      )}

      {/* 4. ISLES OF PLAY (25 UNLOCKED PHONICS GAMES) */}
      {currentView === 'isles' && (
        <IslesOfPlay onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 5. SHELLSHORE ARCADE (25 UNLOCKED ARCADE CABINETS) */}
      {currentView === 'arcade' && (
        <ShellshoreArcade onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 6. HOME HUT */}
      {isHomeHutOpen && (
        <HomeHutModal
          onClose={() => setIsHomeHutOpen(false)}
          onOpenCelebration={() => {
            setIsHomeHutOpen(false);
            setManualCelebrationOpen(true);
          }}
          onOpenParentPortal={() => {
            setIsHomeHutOpen(false);
            setIsParentPinModalOpen(true);
          }}
        />
      )}

      {/* 7. WALL OF FAME CORONATION CELEBRATION */}
      {(showHallOfFameCelebration || manualCelebrationOpen) && (
        <HallOfFameCelebration
          isReplay={manualCelebrationOpen}
          onDismiss={() => {
            dismissHallOfFameCelebration();
            setManualCelebrationOpen(false);
          }}
        />
      )}

      {/* 8. PARENT & TEACHER PIN GATE (YOUTUBE KIDS STYLE) */}
      <ParentPinModal
        isOpen={isParentPinModalOpen}
        onClose={() => setIsParentPinModalOpen(false)}
        onSuccess={() => {
          setIsParentPinModalOpen(false);
          setIsParentDashboardOpen(true);
        }}
      />

      {/* 9. PARENT & TEACHER STATS DASHBOARD */}
      {isParentDashboardOpen && (
        <ParentDashboard
          onClose={() => setIsParentDashboardOpen(false)}
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
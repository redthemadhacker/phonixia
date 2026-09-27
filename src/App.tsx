import React, { useState, useEffect, useCallback, useRef, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { LandLevelView } from './components/LandLevelView';
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
import { getComprehensiveStageChallenge } from './data/comprehensiveCurriculum';
import { MinigameDefinition } from './data/minigamesCurriculum';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

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

  // Auto-launch into Home Hut directly on login so player selection happens first
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(true);
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

  // 5-MINUTE INACTIVITY SESSION TIMEOUT
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = useCallback(() => {
    sessionStorage.removeItem('phonixia_active_session');
    setIsAuthenticated(false);
    setCurrentView('world');
    setIsHomeHutOpen(true);
    sounds.playError();
    sounds.speak('Session timed out after 5 minutes of inactivity. Please sign in again.');
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (!isAuthenticated) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // 5 minutes = 300,000 ms
    timeoutRef.current = setTimeout(handleInactivityLogout, 5 * 60 * 1000);
  }, [isAuthenticated, handleInactivityLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [isAuthenticated, resetIdleTimer]);

  const activeQuestion = React.useMemo(() => {
    return getComprehensiveStageChallenge(selectedLand, activeStageNumber);
  }, [selectedLand, activeStageNumber, questionRandomSeed]);

  if (!isAuthenticated) {
    return (
      <AuthGateway 
        onAuthenticated={() => {
          setIsAuthenticated(true);
          setIsHomeHutOpen(true);
        }} 
      />
    );
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

  const handleLaunchMinigamePractice = (minigame: MinigameDefinition) => {
    if (minigame.hub === 'isles-of-play') {
      setCurrentView('isles');
    } else {
      setCurrentView('arcade');
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

      {/* 2. MAIN REALM EXPLORATION */}
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
          onOpenMinigamePractice={handleLaunchMinigamePractice}
        />
      )}

      {/* 4. ISLES OF PLAY */}
      {currentView === 'isles' && (
        <IslesOfPlay onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 5. SHELLSHORE ARCADE */}
      {currentView === 'arcade' && (
        <ShellshoreArcade onBackToWorld={() => setCurrentView('world')} />
      )}

      {/* 6. HOME HUT (PLAYER SELECT MODAL) */}
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

      {/* 7. WALL OF FAME CELEBRATION */}
      {(showHallOfFameCelebration || manualCelebrationOpen) && (
        <HallOfFameCelebration
          isReplay={manualCelebrationOpen}
          onDismiss={() => {
            dismissHallOfFameCelebration();
            setManualCelebrationOpen(false);
          }}
        />
      )}

      {/* 8. PARENT & TEACHER PIN GATE */}
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
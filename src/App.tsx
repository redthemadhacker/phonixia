import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { WorldCanvas } from './components/WorldCanvas';
import { MarioOverworldMap } from './components/MarioOverworldMap';
import { ActivePlayableStage } from './components/ActivePlayableStage';
import { IslesOfPlay } from './components/IslesOfPlay';
import { ShellshoreArcade } from './components/ShellshoreArcade';
import { HomeHutModal } from './components/HomeHutModal';
import { HallOfFameCelebration } from './components/HallOfFameCelebration';
import { AuthGateway } from './components/AuthGateway';
import { LandId, MinigameId } from './types/character';
import { getCompanionGuide } from './context/GameContext';
import { sounds } from './utils/audio';

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

// Generate dynamic phonics question data for any Mario Dot Level 1-50
const getDynamicStageQuestion = (landId: LandId, stageNum: number) => {
  const cvcList = [
    { target: 'FOX', soundCue: 'fff - ah - ksss', inst: 'Listen to the pure sounds: fff - ah - ksss. Spell the word!', correct: 'FOX', dist: ['BOX', 'SIX', 'FIX'] },
    { target: 'BED', soundCue: 'b - eh - d', inst: 'Listen to the pure sounds: b - eh - d. Spell the word!', correct: 'BED', dist: ['BAD', 'BUD', 'BAT'] },
    { target: 'CAT', soundCue: 'k - ah - t', inst: 'Listen to the pure sounds: k - ah - t. Spell the word!', correct: 'CAT', dist: ['COT', 'CUT', 'BAT'] },
    { target: 'DOG', soundCue: 'd - ah - g', inst: 'Listen to the pure sounds: d - ah - g. Spell the word!', correct: 'DOG', dist: ['DIG', 'DUG', 'LOG'] },
    { target: 'SUN', soundCue: 'sss - uh - nnn', inst: 'Listen to the pure sounds: sss - uh - nnn. Spell the word!', correct: 'SUN', dist: ['SIN', 'RUN', 'SIT'] },
    { target: 'PIG', soundCue: 'p - ih - g', inst: 'Listen to the pure sounds: p - ih - g. Spell the word!', correct: 'PIG', dist: ['PUG', 'PEG', 'BIG'] },
    { target: 'CUP', soundCue: 'k - uh - p', inst: 'Listen to the pure sounds: k - uh - p. Spell the word!', correct: 'CUP', dist: ['CAP', 'COP', 'MUG'] }
  ];

  const item = cvcList[(stageNum - 1) % cvcList.length];
  const choices = [item.correct, ...item.dist].sort(() => Math.random() - 0.5);

  return {
    instruction: item.inst,
    targetSound: item.target,
    soundCue: item.soundCue,
    choices,
    correct: item.correct,
    explanation: `${item.soundCue} blends cleanly into ${item.correct}!`
  };
};

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
  const [isHomeHutOpen, setIsHomeHutOpen] = useState(false);
  const [manualCelebrationOpen, setManualCelebrationOpen] = useState(false);

  // Active Playable Stage state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [realmLives, setRealmLives] = useState(3);
  const [earnedStars, setEarnedStars] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const activeQuestion = React.useMemo(() => {
    return getDynamicStageQuestion(selectedLand, activeStageNumber);
  }, [selectedLand, activeStageNumber]);

  if (!isAuthenticated) {
    return <AuthGateway onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleLaunchStage = (stageNum: number) => {
    setActiveStageNumber(stageNum);
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

      {/* 2. COMPACT MARIO OVERWORLD MAP (50 WINDING DOTS) */}
      {currentView === 'land-map' && (
        <MarioOverworldMap
          landId={selectedLand}
          landName={LAND_NAMES[selectedLand]}
          totalStages={50}
          completedStages={activeExplorer.landScores[selectedLand]?.completedGamesCount || 0}
          onLaunchStage={handleLaunchStage}
          onBack={() => setCurrentView('world')}
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
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Animated, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LighthouseGame({ username, email, onScoreUpdate, onBack }) {
  const [charPos, setCharPos] = useState({ x: width * 0.4, y: height * 0.4 });
  const [score, setScore] = useState(0);
  
  const [walkFrame, setWalkFrame] = useState(0);
  const [facingDirection, setFacingDirection] = useState('right');

  // Game States: 'explore', 'listening', 'solved', 'telescope', 'telescope_solved', 'traveling'
  const [gameState, setGameState] = useState('explore');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [telescopeIndex, setTelescopeIndex] = useState(0);
  const [message, setMessage] = useState("Explore the lighthouse grounds! Walk over the beacon or telescope to play mini-games.");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const moveIntervalRef = useRef(null);
  const isHoldingRef = useRef(false);

  // Phonics Question Bank
  const questions = [
    { sound: '/B/ (Buh)', target: 'B', prompt: "Can you find the letter that makes the Buh sound? B-b-b-ball!", choices: ['A', 'B', 'S'] },
    { sound: '/M/ (Mm)', target: 'M', prompt: "Can you find the letter that makes the Mmm sound? M-m-m-monkey!", choices: ['M', 'T', 'P'] },
    { sound: '/S/ (Sss)', target: 'S', prompt: "Can you find the letter that makes the Sss sound? S-s-s-sun!", choices: ['C', 'S', 'F'] }
  ];

  // Telescope Stargazing Question Bank
  const telescopeQuestions = [
    { constellation: 'Big Dipper', prompt: "Look through the telescope! Which star pattern looks like a giant spoon or ladle in the sky?", choices: ['Big Dipper', 'Triangle', 'Square'], target: 'Big Dipper' },
    { constellation: 'North Star', prompt: "Stargazing time! Which bright star helps travelers find their way north?", choices: ['Mars', 'North Star', 'Venus'], target: 'North Star' }
  ];

  const currentQ = questions[currentQuestionIndex];
  const currentTelescopeQ = telescopeQuestions[telescopeIndex];

  const isGirl = /^[A-Za-z]+[aeiy]$/i.test(username) || username.toLowerCase().includes('celine');
  
  const getAvatar = () => {
    if (isGirl) {
      return walkFrame === 1 ? '💃' : '👧🏽';
    } else {
      return walkFrame === 1 ? '🏃🏽‍♂️' : '🚶🏽‍♂️';
    }
  };

  const stopSpeaking = () => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text) => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.3;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const executeStep = (direction) => {
    let step = 18;

    if (direction === 'left') setFacingDirection('left');
    if (direction === 'right') setFacingDirection('right');

    setCharPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      // Top boundary left as is (90), bottom stretched down close to margins (height - 130)
      if (direction === 'up') newY = Math.max(90, prev.y - step);
      if (direction === 'down') newY = Math.min(height - 130, prev.y + step);
      // Left and right stretched almost to page margins
      if (direction === 'left') newX = Math.max(10, prev.x - step);
      if (direction === 'right') newX = Math.min(width - 40, prev.x + step);

      checkProximityTriggers(newX, newY);

      return { x: newX, y: newY };
    });

    setWalkFrame(prev => (prev === 0 ? 1 : 0));
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        if (gameState !== 'explore') return; 
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') executeStep('up');
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') executeStep('down');
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') executeStep('left');
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') executeStep('right');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [gameState]);

  const handleButtonPress = (direction) => {
    if (isHoldingRef.current || gameState !== 'explore') return;
    executeStep(direction);
  };

  const handlePressIn = (direction) => {
    if (gameState !== 'explore') return;
    isHoldingRef.current = false;

    if (direction === 'left') setFacingDirection('left');
    if (direction === 'right') setFacingDirection('right');

    const holdTimeout = setTimeout(() => {
      isHoldingRef.current = true;
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);

      moveIntervalRef.current = setInterval(() => {
        let runStep = 10;
        setCharPos(prev => {
          let newX = prev.x;
          let newY = prev.y;

          if (direction === 'up') newY = Math.max(90, prev.y - runStep);
          if (direction === 'down') newY = Math.min(height - 130, prev.y + runStep);
          if (direction === 'left') newX = Math.max(10, prev.x - runStep);
          if (direction === 'right') newX = Math.min(width - 40, prev.x + runStep);

          checkProximityTriggers(newX, newY);

          return { x: newX, y: newY };
        });

        setWalkFrame(prev => (prev === 0 ? 1 : 0));
      }, 35);
    }, 200);

    moveIntervalRef.current = holdTimeout;
  };

  const handlePressOut = () => {
    if (moveIntervalRef.current) {
      clearTimeout(moveIntervalRef.current);
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    isHoldingRef.current = false;
  };

  // Automatic proximity detection
  const checkProximityTriggers = (x, y) => {
    // 1. Home / Return spot coordinates (Left corner building marker)
    const lighthouseX = width * 0.15;
    const lighthouseY = height * 0.55;
    const distanceHome = Math.hypot(x - lighthouseX, y - lighthouseY);

    if (distanceHome < 60 && gameState !== 'traveling') {
      triggerReturnTravel();
      return;
    }

    // 2. Sound Spotter Beacon coordinates (Middle right)
    const beaconX = width * 0.75;
    const beaconY = height * 0.35;
    const distanceBeacon = Math.hypot(x - beaconX, y - beaconY);

    if (distanceBeacon < 60 && gameState === 'explore') {
      triggerSoundSpotter();
      return;
    }

    // 3. Telescope coordinates (Bottom right corner)
    const telescopeX = width * 0.80;
    const telescopeY = height * 0.75;
    const distanceTelescope = Math.hypot(x - telescopeX, y - telescopeY);

    if (distanceTelescope < 60 && gameState === 'explore') {
      triggerTelescopeGame();
    }
  };

  const triggerReturnTravel = () => {
    if (gameState === 'traveling') return;
    stopSpeaking(); // Instantly stops speech on exit
    setGameState('traveling');
    setMessage("⛵ Packing up gear... Traveling back down the path to Sound Shallows!");

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      if (onBack) {
        onBack();
      }
    });
  };

  const triggerSoundSpotter = () => {
    setGameState('listening');
    setMessage("🔊 Ms. Rachel Sound Challenge: Listen closely to the sound!");
    speakText(currentQ.prompt);
  };

  const triggerTelescopeGame = () => {
    setGameState('telescope');
    setMessage("🔭 Stargazing Challenge: Look through the telescope!");
    speakText(currentTelescopeQ.prompt);
  };

  const handleSelectLetter = (selectedLetter) => {
    if (selectedLetter === currentQ.target) {
      stopSpeaking();
      setMessage("🎉 Yay! You got it right! +20 Stars earned!");
      const newScore = score + 20;
      setScore(newScore);
      setGameState('solved');
      if (onScoreUpdate) onScoreUpdate('lighthouse', 1, newScore);
    } else {
      setMessage("❌ Hmm, not quite! Let's listen again.");
      speakText("Not quite! " + currentQ.prompt);
    }
  };

  const handleSelectTelescopeChoice = (choice) => {
    if (choice === currentTelescopeQ.target) {
      stopSpeaking();
      setMessage("⭐ Incredible Stargazing! +25 Stars earned!");
      const newScore = score + 25;
      setScore(newScore);
      setGameState('telescope_solved');
      if (onScoreUpdate) onScoreUpdate('lighthouse', 1, newScore);
    } else {
      setMessage("❌ Keep looking through the lens!");
      speakText("Not quite right. " + currentTelescopeQ.prompt);
    }
  };

  const handleKeepPlaying = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setGameState('explore');
    setMessage("Awesome job! Keep exploring or walk back home to the left.");
  };

  const handleKeepPlayingTelescope = () => {
    const nextIndex = (telescopeIndex + 1) % telescopeQuestions.length;
    setTelescopeIndex(nextIndex);
    setGameState('explore');
    setMessage("Wonderful stargazing! Check out the beacon or walk home.");
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ImageBackground 
        source={require('./lighthouse.png')} 
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Top HUD Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={triggerReturnTravel}>
            <Text style={styles.backButtonText}>⬅️ Walk Back to Shallows</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>⭐ Stars: {score}</Text>
        </View>

        {/* Narrative Dialogue Box */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerText}>{message}</Text>
        </View>

        {/* Full-Page Interactive World Space */}
        <View style={styles.worldSpace}>
          
          {/* Lighthouse Building marker */}
          <View style={styles.lighthouseBuilding}>
            <Text style={styles.buildingEmoji}>🏛️</Text>
          </View>

          {/* Sound Spotter Beacon marker */}
          <View style={styles.beaconMarker}>
            <Text style={styles.beaconEmoji}>🗼</Text>
          </View>

          {/* Telescope marker (Bottom Right) */}
          <View style={styles.telescopeMarker}>
            <Text style={styles.telescopeEmoji}>🔭</Text>
          </View>

          {/* Phonics Sound Challenge Overlay */}
          {gameState === 'listening' && (
            <View style={styles.challengeOverlay}>
              <TouchableOpacity style={styles.speakerButton} onPress={() => speakText(currentQ.prompt)}>
                <Text style={styles.speakerButtonText}>🔊 Replay Voice</Text>
              </TouchableOpacity>

              <Text style={styles.challengePromptText}>Target Sound: {currentQ.sound}</Text>

              <View style={styles.letterChoicesContainer}>
                {currentQ.choices.map((letter) => (
                  <TouchableOpacity key={letter} style={styles.letterBox} onPress={() => handleSelectLetter(letter)}>
                    <Text style={styles.letterText}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Telescope Stargazing Mini-Game Overlay */}
          {gameState === 'telescope' && (
            <View style={styles.challengeOverlay}>
              <TouchableOpacity style={styles.speakerButton} onPress={() => speakText(currentTelescopeQ.prompt)}>
                <Text style={styles.speakerButtonText}>🔊 Replay Telescope Voice</Text>
              </TouchableOpacity>

              <Text style={styles.challengePromptText}>{currentTelescopeQ.prompt}</Text>

              <View style={styles.letterChoicesContainer}>
                {currentTelescopeQ.choices.map((choice) => (
                  <TouchableOpacity key={choice} style={styles.telescopeChoiceBox} onPress={() => handleSelectTelescopeChoice(choice)}>
                    <Text style={styles.telescopeChoiceText}>{choice}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Post-Challenge Options (Beacon) */}
          {gameState === 'solved' && (
            <View style={styles.challengeOverlay}>
              <Text style={styles.solvedTitle}>Challenge Completed! 🎉</Text>
              <View style={styles.spacerBox} />
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.keepPlayingBtn} onPress={handleKeepPlaying}>
                  <Text style={styles.btnText}>🏃🏽‍♂️ Keep Playing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitGameBtn} onPress={triggerReturnTravel}>
                  <Text style={styles.btnText}>🚪 Exit Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Post-Challenge Options (Telescope) */}
          {gameState === 'telescope_solved' && (
            <View style={styles.challengeOverlay}>
              <Text style={styles.solvedTitle}>Stargazing Completed! ✨</Text>
              <View style={styles.spacerBox} />
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.keepPlayingBtn} onPress={handleKeepPlayingTelescope}>
                  <Text style={styles.btnText}>🏃🏽‍♂️ Keep Playing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitGameBtn} onPress={triggerReturnTravel}>
                  <Text style={styles.btnText}>🚪 Exit Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Movable Character Container */}
          <View style={[styles.characterContainer, { left: charPos.x, top: charPos.y }]}>
            <Text style={styles.charAvatar}>{getAvatar()}</Text>
            <Text style={styles.charNameTag}>{username}</Text>
          </View>
        </View>

        {/* On-Screen Directional Controls */}
        <View style={styles.controlPad}>
          <TouchableOpacity 
            style={styles.ctrlBtn} 
            onPress={() => handleButtonPress('up')}
            onPressIn={() => handlePressIn('up')} 
            onPressOut={handlePressOut}
          >
            <Text style={styles.ctrlText}>⬆️</Text>
          </TouchableOpacity>

          <View style={styles.ctrlRowMiddle}>
            <TouchableOpacity 
              style={styles.ctrlBtn} 
              onPress={() => handleButtonPress('left')}
              onPressIn={() => handlePressIn('left')} 
              onPressOut={handlePressOut}
            >
              <Text style={styles.ctrlText}>⬅️</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.ctrlBtn} 
              onPress={() => handleButtonPress('right')}
              onPressIn={() => handlePressIn('right')} 
              onPressOut={handlePressOut}
            >
              <Text style={styles.ctrlText}>➡️</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.ctrlBtn} 
            onPress={() => handleButtonPress('down')}
            onPressIn={() => handlePressIn('down')} 
            onPressOut={handlePressOut}
          >
            <Text style={styles.ctrlText}>⬇️</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scoreText: {
    color: '#fcd34d',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bannerContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    zIndex: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  worldSpace: {
    flex: 1,
    position: 'relative',
  },
  lighthouseBuilding: {
    position: 'absolute',
    left: '15%',
    top: '55%',
    alignItems: 'center',
    opacity: 0.85,
  },
  buildingEmoji: {
    fontSize: 48,
  },
  beaconMarker: {
    position: 'absolute',
    right: '25%',
    top: '35%',
    alignItems: 'center',
    opacity: 0.85,
  },
  beaconEmoji: {
    fontSize: 44,
  },
  telescopeMarker: {
    position: 'absolute',
    right: '20%',
    top: '75%',
    alignItems: 'center',
    opacity: 0.9,
  },
  telescopeEmoji: {
    fontSize: 44,
  },
  challengeOverlay: {
    position: 'absolute',
    top: '22%',
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#38bdf8',
    zIndex: 25,
    width: '90%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  speakerButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#fef3c7',
  },
  speakerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  challengePromptText: {
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  letterChoicesContainer: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterBox: {
    backgroundColor: '#2563eb',
    width: 75,
    height: 75,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  letterText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  telescopeChoiceBox: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
  },
  telescopeChoiceText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  solvedTitle: {
    color: '#fcd34d',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  spacerBox: {
    height: 15,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  keepPlayingBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  exitGameBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  characterContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  charAvatar: {
    fontSize: 42,
  },
  charNameTag: {
    color: '#fff',
    fontSize: 9,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  controlPad: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  ctrlRowMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
    marginVertical: 4,
  },
  ctrlBtn: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctrlText: {
    fontSize: 18,
  },
});
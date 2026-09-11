import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Modal, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORT YOUR STANDALONE GAMES HERE AS YOU BUILD THEM:
import LighthouseGame from './games/LighthouseGame'; 
// import ShipwreckGame from './games/ShipwreckGame'; // (You will add more here later)

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SoundShallows({ username, email, onScoreUpdate, onBack }) {
  const [gameProgress, setGameProgress] = useState({
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
    game6: 0,
    game7: 0,
    game8: 0,
    game9: 0,
    game10: 0,
  });

  // Controls which game is currently open. If null, you are on the map!
  const [activeGameKey, setActiveGameKey] = useState(null);
  const [travelModalVisible, setTravelModalVisible] = useState(false);
  const [pendingGameKey, setPendingGameKey] = useState(null);
  const [pendingGameName, setPendingGameName] = useState('');

  // 🕹️ Character Movement & Walk Animation Engine
  const [charPos, setCharPos] = useState({ x: SCREEN_WIDTH * 0.4, y: SCREEN_HEIGHT * 0.4 });
  const [walkFrame, setWalkFrame] = useState(0);
  const [facingDirection, setFacingDirection] = useState('right');
  const moveIntervalRef = useRef(null);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    loadLandProgress();
  }, []);

  // 🕹️ Keyboard Listener for Web Movement
  useEffect(() => {
    if (Platform.OS === 'web' && !activeGameKey) {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') executeStep('up');
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') executeStep('down');
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') executeStep('left');
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') executeStep('right');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeGameKey]);

  const isGirlAvatar = /^[A-Za-z]+[aeiy]$/i.test(username) || username.toLowerCase().includes('celine');
  
  const getAvatar = () => {
    if (isGirlAvatar) {
      return walkFrame === 1 ? '💃' : '👧🏽';
    } else {
      return walkFrame === 1 ? '🏃🏽‍♂️' : '🚶🏽‍♂️';
    }
  };

  const executeStep = (direction) => {
    let step = 18;

    if (direction === 'left') setFacingDirection('left');
    if (direction === 'right') setFacingDirection('right');

    setCharPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (direction === 'up') newY = Math.max(10, prev.y - step);
      if (direction === 'down') newY = Math.min(SCREEN_HEIGHT - 90, prev.y + step);
      if (direction === 'left') newX = Math.max(10, prev.x - step);
      if (direction === 'right') newX = Math.min(SCREEN_WIDTH - 30, prev.x + step);

      checkProximity(newX, newY);

      return { x: newX, y: newY };
    });

    setWalkFrame(prev => (prev === 0 ? 1 : 0));
  };

  const handleButtonPress = (direction) => {
    if (isHoldingRef.current) return;
    executeStep(direction);
  };

  const handlePressIn = (direction) => {
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

          if (direction === 'up') newY = Math.max(10, prev.y - runStep);
          if (direction === 'down') newY = Math.min(SCREEN_HEIGHT - 90, prev.y + runStep);
          if (direction === 'left') newX = Math.max(10, prev.x - runStep);
          if (direction === 'right') newX = Math.min(SCREEN_WIDTH - 30, prev.x + runStep);

          checkProximity(newX, newY);

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

  const checkProximity = (x, y) => {
    // Lighthouse Node Proximity Check (top: 15%, left: 12%)
    const lightX = SCREEN_WIDTH * 0.12;
    const lightY = SCREEN_HEIGHT * 0.15;
    const distanceLighthouse = Math.hypot(x - lightX, y - lightY);

    if (distanceLighthouse < 65) {
      setPendingGameKey('game1');
      setPendingGameName('Lighthouse');
      setTravelModalVisible(true);
      return;
    }
  };

  const loadLandProgress = async () => {
    try {
      const cleanParent = email.trim().toLowerCase();
      const cleanExplorer = username.trim();
      let loadedGames = {};
      for (let i = 1; i <= 10; i++) {
        let val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_soundShallows_game${i}`);
        loadedGames[`game${i}`] = val ? parseInt(val, 10) : 0;
      }
      setGameProgress(loadedGames);
    } catch (e) {
      console.error('Failed to load progress', e);
    }
  };

  const handleScoreUpdate = (gameKey, newScore) => {
    setGameProgress(prev => ({ ...prev, [gameKey]: newScore }));
    const gameIndex = gameKey.replace('game', '');
    onScoreUpdate('soundShallows', gameIndex, newScore);
  };

  // --- SEAMLESS ROUTER SWITCHER ---
  if (activeGameKey === 'game1') {
    return (
      <LighthouseGame 
        username={username}
        currentScore={gameProgress.game1}
        onScoreUpdate={(key, score) => handleScoreUpdate('game1', score)}
        onBackToMap={() => setActiveGameKey(null)}
      />
    );
  }

  // Otherwise, render the Main Overworld Map
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('./shallows.png')} style={styles.mapBackground} resizeMode="stretch">
        
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>🗺️ Main World Map</Text>
          </TouchableOpacity>
          <Text style={styles.explorerTag}>🌊 Sound Shallows | {username}</Text>
        </View>

        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>🎮 Walk near the Lighthouse to enter!</Text>
        </View>

        {/* Map Landmark Nodes */}
        <View style={styles.nodesContainer}>
          
          {/* Lighthouse Node */}
          <TouchableOpacity 
            style={[styles.gameNode, { top: '15%', left: '12%' }]} 
            onPress={() => { setPendingGameKey('game1'); setPendingGameName('Lighthouse'); setTravelModalVisible(true); }}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🏮</Text></View>
            <Text style={styles.nodeText}>Lighthouse ({gameProgress.game1})</Text>
          </TouchableOpacity>

          {/* Placeholder for future nodes */}
          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '22%', right: '22%' }]} 
            onPress={() => alert("Shipwreck file coming next! Build it when you're ready.")}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>⚓</Text></View>
            <Text style={styles.nodeText}>Shipwreck ({gameProgress.game5})</Text>
          </TouchableOpacity>

          {/* Movable Character Container */}
          <View style={[styles.characterContainer, { left: charPos.x, top: charPos.y }]}>
            <Text style={styles.charAvatar}>{getAvatar()}</Text>
            <Text style={styles.charNameTag}>{username}</Text>
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

        </View>

        {/* Travel / Enter Game Modal */}
        <Modal animationType="fade" transparent={true} visible={travelModalVisible} onRequestClose={() => setTravelModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🏮 Enter Landmark</Text>
              <Text style={styles.modalSubtitle}>{`Enter ${pendingGameName}?`}</Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ef4444' }]} onPress={() => setTravelModalVisible(false)}>
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]} onPress={() => { setTravelModalVisible(false); setActiveGameKey(pendingGameKey); }}>
                  <Text style={styles.actionButtonText}>Enter!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b090a' },
  mapBackground: { flex: 1, width: '100%', height: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10 },
  backButton: { backgroundColor: '#4361ee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  explorerTag: { color: '#ffd166', fontWeight: 'bold', fontSize: 13 },
  instructionBanner: { position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: 'rgba(11, 9, 10, 0.85)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#3a86ff', zIndex: 10 },
  instructionText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  nodesContainer: { flex: 1, position: 'relative' },
  gameNode: { position: 'absolute', alignItems: 'center' },
  nodeCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3a86ff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  nodeEmoji: { fontSize: 22 },
  nodeText: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  characterContainer: { position: 'absolute', alignItems: 'center', zIndex: 15 },
  charAvatar: { fontSize: 42 },
  charNameTag: { color: '#fff', fontSize: 9, backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 4, borderRadius: 4, overflow: 'hidden' },
  controlPad: { position: 'absolute', bottom: 25, alignSelf: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20, zIndex: 10 },
  ctrlRowMiddle: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginVertical: 4 },
  ctrlBtn: { backgroundColor: 'rgba(255,255,255,0.85)', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  ctrlText: { fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 320, backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 6, textAlign: 'center' },
  modalSubtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 20, textAlign: 'center' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  actionButton: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginHorizontal: 5 },
  actionButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
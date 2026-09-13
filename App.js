import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Modal, useWindowDimensions, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SoundShallows from './SoundShallows'; 

export default function App({ username, email, onScoreUpdate, onSwitchProfile, onLogout }) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const [landScores, setLandScores] = useState({
    soundShallows: 0,
    buildersGuild: 0,
    trickyTrails: 0,
    whisperingPeaks: 0,
    lexiconEmpire: 0,
    islesOfPlay: 0,
    shellshoreArcade: 0,
  });

  const [activeLandKey, setActiveLandKey] = useState(null);
  const [travelModalVisible, setTravelModalVisible] = useState(false);
  const [pendingLandKey, setPendingLandKey] = useState(null);
  const [pendingLandName, setPendingLandName] = useState('');
  
  const [homeModalVisible, setHomeModalVisible] = useState(false);

  // Exit flags to ensure single trigger per passover until you walk away and return
  const [hasExitedShallows, setHasExitedShallows] = useState(true);
  const [hasExitedHome, setHasExitedHome] = useState(true);

  const [charPos, setCharPos] = useState({ x: SCREEN_WIDTH * 0.5 - 20, y: SCREEN_HEIGHT * 0.65 });
  const [walkFrame, setWalkFrame] = useState(0);
  const moveIntervalRef = useRef(null);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    loadAllLandProgress();
  }, [username, email]);

  useEffect(() => {
    if (Platform.OS === 'web' && !activeLandKey && !travelModalVisible && !homeModalVisible) {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') executeStep('up', SCREEN_WIDTH, SCREEN_HEIGHT);
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') executeStep('down', SCREEN_WIDTH, SCREEN_HEIGHT);
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') executeStep('left', SCREEN_WIDTH, SCREEN_HEIGHT);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') executeStep('right', SCREEN_WIDTH, SCREEN_HEIGHT);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeLandKey, SCREEN_WIDTH, SCREEN_HEIGHT, travelModalVisible, homeModalVisible]);

  const isGirlAvatar = /^[A-Za-z]+[aeiy]$/i.test(username || '') || (username || '').toLowerCase().includes('celine');
  const getAvatar = () => isGirlAvatar ? (walkFrame === 1 ? '💃' : '👧🏽') : (walkFrame === 1 ? '🏃🏽‍♂️' : '🚶🏽‍♂️');

  const executeStep = (direction, w, h) => {
    let step = 18;
    setCharPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      if (direction === 'up') newY = Math.max(60, prev.y - step);
      if (direction === 'down') newY = Math.min(h - 140, prev.y + step);
      if (direction === 'left') newX = Math.max(15, prev.x - step);
      if (direction === 'right') newX = Math.min(w - 55, prev.x + step);
      checkProximity(newX, newY, w, h);
      return { x: newX, y: newY };
    });
    setWalkFrame(prev => (prev === 0 ? 1 : 0));
  };

  const handleButtonPress = (direction) => {
    if (isHoldingRef.current) return;
    executeStep(direction, SCREEN_WIDTH, SCREEN_HEIGHT);
  };

  const handlePressIn = (direction) => {
    isHoldingRef.current = false;
    const holdTimeout = setTimeout(() => {
      isHoldingRef.current = true;
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = setInterval(() => {
        let runStep = 10;
        setCharPos(prev => {
          let newX = prev.x;
          let newY = prev.y;
          if (direction === 'up') newY = Math.max(60, prev.y - runStep);
          if (direction === 'down') newY = Math.min(SCREEN_HEIGHT - 140, prev.y + runStep);
          if (direction === 'left') newX = Math.max(15, prev.x - runStep);
          if (direction === 'right') newX = Math.min(SCREEN_WIDTH - 55, prev.x + runStep);
          checkProximity(newX, newY, SCREEN_WIDTH, SCREEN_HEIGHT);
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

  const checkProximity = (x, y, w, h) => {
    // Sound Shallows Node Coordinates (Directly on label, single trigger per passover)
    const shallowsX = w * 0.46;
    const shallowsY = h * 0.38;
    if (Math.hypot(x - shallowsX, y - shallowsY) < 45) {
      if (hasExitedShallows) {
        setPendingLandKey('soundShallows');
        setPendingLandName('Sound Shallows');
        setTravelModalVisible(true);
        setHasExitedShallows(false);
      }
    } else {
      setHasExitedShallows(true);
    }

    // Explorer Home Node Coordinates (Directly on label, single trigger per passover)
    const homeX = w * 0.10;
    const homeY = h * 0.65;
    if (Math.hypot(x - homeX, y - homeY) < 45) {
      if (hasExitedHome) {
        setHomeModalVisible(true);
        setHasExitedHome(false);
      }
    } else {
      setHasExitedHome(true);
    }
  };

  const loadAllLandProgress = async () => {
    try {
      const cleanParent = email ? email.trim().toLowerCase() : 'parent';
      const cleanExplorer = username ? username.trim() : 'explorer';
      
      const ssVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_soundShallows_total`);
      const bgVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_buildersGuild_total`);
      const ttVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_trickyTrails_total`);
      const wpVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_whisperingPeaks_total`);
      const leVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_lexiconEmpire_total`);
      const ipVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_islesOfPlay_total`);
      const saVal = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_shellshoreArcade_total`);

      setLandScores({
        soundShallows: ssVal ? parseInt(ssVal, 10) : 0,
        buildersGuild: bgVal ? parseInt(bgVal, 10) : 0,
        trickyTrails: ttVal ? parseInt(ttVal, 10) : 0,
        whisperingPeaks: wpVal ? parseInt(wpVal, 10) : 0,
        lexiconEmpire: leVal ? parseInt(leVal, 10) : 0,
        islesOfPlay: ipVal ? parseInt(ipVal, 10) : 0,
        shellshoreArcade: saVal ? parseInt(saVal, 10) : 0,
      });
    } catch (e) {
      console.error('Failed to load land progress', e);
    }
  };

  const handleLandScoreUpdate = (landKey, gameIndex, newScore) => {
    setLandScores(prev => ({ ...prev, [landKey]: (prev[landKey] || 0) + newScore }));
    if (onScoreUpdate) onScoreUpdate(landKey, gameIndex, newScore);
  };

  const totalCombinedScore = Object.values(landScores).reduce((a, b) => a + b, 0);

  if (activeLandKey === 'soundShallows') {
    return (
      <SoundShallows 
        username={username || 'Explorer'}
        email={email || ''}
        onScoreUpdate={(land, index, score) => handleLandScoreUpdate(land, index, score)}
        onBack={() => setActiveLandKey(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./phonixia_world_map.png')} 
        style={[styles.mapBackground, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]} 
        resizeMode="stretch"
      >
        <View style={styles.topBar}>
          <Text style={styles.worldTitle}>🗺️ Phonixia World Map</Text>
          <Text style={styles.explorerTag}>Explorer: {username || 'Explorer'}</Text>
        </View>

        <View style={styles.nodesContainer}>
          {/* Explorer Home Node */}
          <TouchableOpacity 
            style={[styles.gameNode, { top: '68%', left: '11%' }]} 
            onPress={() => setHomeModalVisible(true)}
          >
            <View style={[styles.nodeCircle, { backgroundColor: '#f43f5e' }]}><Text style={styles.nodeEmoji}>🏠</Text></View>
            <Text style={styles.nodeText}>Explorer Home</Text>
          </TouchableOpacity>

          {/* Sound Shallows Node */}
          <TouchableOpacity 
            style={[styles.gameNode, { top: '43%', left: '47.5%' }]} 
            onPress={() => { setPendingLandKey('soundShallows'); setPendingLandName('Sound Shallows'); setTravelModalVisible(true); }}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🌊</Text></View>
            <Text style={styles.nodeText}>Sound Shallows</Text>
          </TouchableOpacity>

          <View style={[styles.characterContainer, { left: charPos.x, top: charPos.y }]}>
            <Text style={styles.charAvatar}>{getAvatar()}</Text>
            <Text style={styles.charNameTag}>{username || 'Explorer'}</Text>
          </View>

          <View style={styles.controlPad}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleButtonPress('up')} onPressIn={() => handlePressIn('up')} onPressOut={handlePressOut}>
              <Text style={styles.ctrlText}>⬆️</Text>
            </TouchableOpacity>
            <View style={styles.ctrlRowMiddle}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleButtonPress('left')} onPressIn={() => handlePressIn('left')} onPressOut={handlePressOut}>
                <Text style={styles.ctrlText}>⬅️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleButtonPress('right')} onPressIn={() => handlePressIn('right')} onPressOut={handlePressOut}>
                <Text style={styles.ctrlText}>➡️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => handleButtonPress('down')} onPressIn={() => handlePressIn('down')} onPressOut={handlePressOut}>
              <Text style={styles.ctrlText}>⬇️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionBanner}>
            <Text style={styles.instructionText}>🎮 Use ←(or A), ↑(or W), →(or D), ↓(or S) keys or onscreen buttons to explore! (Hold to run)</Text>
          </View>
        </View>

        {/* Travel Modal */}
        <Modal animationType="fade" transparent={true} visible={travelModalVisible} onRequestClose={() => setTravelModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🌊 Travel to Land</Text>
              <Text style={styles.modalSubtitle}>{`Enter ${pendingLandName}?`}</Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ef4444' }]} onPress={() => setTravelModalVisible(false)}>
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]} onPress={() => { setTravelModalVisible(false); setActiveLandKey(pendingLandKey); }}>
                  <Text style={styles.actionButtonText}>Sail!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Explorer Home Modal */}
        <Modal animationType="slide" transparent={true} visible={homeModalVisible} onRequestClose={() => setHomeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.homeModalContent}>
              
              <View style={styles.homeHeaderRow}>
                <Text style={styles.shieldIcon}>🛡️</Text>
                <Text style={styles.homeTitle}>Explorer Home</Text>
              </View>
              <Text style={styles.homeSubtitle}>Current Explorer & Land Scores</Text>

              <Text style={styles.explorerSparkleName}>✨ Explorer {username || 'Explorer'}</Text>

              {onSwitchProfile && (
                <TouchableOpacity style={styles.switchProfileBtn} onPress={() => { setHomeModalVisible(false); onSwitchProfile(); }}>
                  <Text style={styles.switchProfileText}>👥 Switch / Add Explorer Kid</Text>
                </TouchableOpacity>
              )}

              <View style={styles.combinedScoreCard}>
                <Text style={styles.combinedScoreText}>⭐ Total Combined Score: <Text style={{color: '#facc15'}}>{totalCombinedScore}</Text></Text>
              </View>

              <ScrollView style={styles.landListContainer} showsVerticalScrollIndicator={true}>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>🌊 Sound Shallows</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.soundShallows}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>🏗️ Builders Guild</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.buildersGuild}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>🌲 Tricky Trails</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.trickyTrails}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>⛰️ Whispering Peaks</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.whisperingPeaks}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>📜 Lexicon Empire</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.lexiconEmpire}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>🏝️ Isles of Play</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.islesOfPlay}</Text></Text></View>
                <View style={styles.landScoreRow}><Text style={styles.landRowLabel}>🐚 Shellshore Arcade</Text><Text style={styles.landRowScore}>Score: <Text style={{color: '#facc15'}}>{landScores.shellshoreArcade}</Text></Text></View>
              </ScrollView>

              <View style={styles.homeFooterButtons}>
                {onLogout && (
                  <TouchableOpacity style={styles.logoutParentBtn} onPress={() => { setHomeModalVisible(false); onLogout(); }}>
                    <Text style={styles.actionButtonText}>🚪 Log Out Parent</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.closeHomeBtn} onPress={() => setHomeModalVisible(false)}>
                  <Text style={styles.actionButtonText}>Close Home</Text>
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
  mapBackground: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10 },
  worldTitle: { color: '#38bdf8', fontWeight: 'bold', fontSize: 14 },
  explorerTag: { color: '#ffd166', fontWeight: 'bold', fontSize: 13 },
  instructionBanner: { position: 'absolute', bottom: 5, alignSelf: 'center', backgroundColor: 'rgba(11, 9, 10, 0.85)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#3a86ff', zIndex: 10 },
  instructionText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  nodesContainer: { flex: 1, position: 'relative' },
  gameNode: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -26 }, { translateY: -26 }] },
  nodeCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3a86ff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  nodeEmoji: { fontSize: 24 },
  nodeText: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  characterContainer: { position: 'absolute', alignItems: 'center', zIndex: 15 },
  charAvatar: { fontSize: 42 },
  charNameTag: { color: '#fff', fontSize: 9, backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 4, borderRadius: 4, overflow: 'hidden' },
  controlPad: { position: 'absolute', bottom: 35, alignSelf: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20, zIndex: 10 },
  ctrlRowMiddle: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginVertical: 4 },
  ctrlBtn: { backgroundColor: 'rgba(255,255,255,0.85)', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  ctrlText: { fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 320, backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  homeModalContent: { width: '100%', maxWidth: 420, maxHeight: '85%', backgroundColor: '#0f172a', borderRadius: 24, padding: 22, borderWidth: 2, borderColor: '#334155', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  homeHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  shieldIcon: { fontSize: 22, marginRight: 8 },
  homeTitle: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc' },
  homeSubtitle: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  explorerSparkleName: { fontSize: 18, fontWeight: 'bold', color: '#f43f5e', marginBottom: 14 },
  switchProfileBtn: { width: '100%', backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  switchProfileText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  combinedScoreCard: { width: '100%', backgroundColor: '#1e293b', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  combinedScoreText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 15 },
  landListContainer: { width: '100%', maxHeight: 220, marginBottom: 14 },
  landScoreRow: { width: '100%', backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  landRowLabel: { color: '#f8fafc', fontWeight: 'bold', fontSize: 13 },
  landRowScore: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  homeFooterButtons: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  logoutParentBtn: { flex: 1, backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginRight: 6 },
  closeHomeBtn: { flex: 1, backgroundColor: '#475569', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginLeft: 6 },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
  actionButton: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginHorizontal: 5 },
  actionButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' }
});
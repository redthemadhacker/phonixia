import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORT YOUR STANDALONE GAMES HERE AS YOU BUILD THEM:
import LighthouseGame from './games/LighthouseGame'; 
// import ShipwreckGame from './games/ShipwreckGame'; // (You will add more here later)

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

  useEffect(() => {
    loadLandProgress();
  }, []);

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
  // If a game is active, render that game's file entirely!
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

  // (As you build more games, you'll add 'game2', 'game3' routers right here!)

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

        {/* Map Landmark Nodes */}
        <View style={styles.nodesContainer}>
          
          {/* Lighthouse Node (Triggers LighthouseGame) */}
          <TouchableOpacity 
            style={[styles.gameNode, { top: '15%', left: '12%' }]} 
            onPress={() => setActiveGameKey('game1')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🏮</Text></View>
            <Text style={styles.nodeText}>Lighthouse ({gameProgress.game1})</Text>
          </TouchableOpacity>

          {/* Placeholder for future nodes until you build their files */}
          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '22%', right: '22%' }]} 
            onPress={() => alert("Shipwreck file coming next! Build it when you're ready.")}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>⚓</Text></View>
            <Text style={styles.nodeText}>Shipwreck ({gameProgress.game5})</Text>
          </TouchableOpacity>

        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b090a' },
  mapBackground: { flex: 1, width: '100%', height: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  backButton: { backgroundColor: '#4361ee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  explorerTag: { color: '#ffd166', fontWeight: 'bold', fontSize: 13 },
  nodesContainer: { flex: 1, position: 'relative' },
  gameNode: { position: 'absolute', alignItems: 'center' },
  nodeCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3a86ff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  nodeEmoji: { fontSize: 22 },
  nodeText: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' }
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IslesOfPlay({ username, email, onScoreUpdate, onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameScores, setGameScores] = useState({
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
    game11: 0,
    game12: 0,
    game13: 0,
    game14: 0,
    game15: 0,
    game16: 0,
    game17: 0,
  });

  const cleanParent = email ? email.trim().toLowerCase() : '';
  const cleanExplorer = username ? username.trim() : '';

  useEffect(() => {
    loadIslesProgress();
  }, []);

  const loadIslesProgress = async () => {
    if (!cleanParent || !cleanExplorer) return;
    try {
      let loadedScores = { ...gameScores };
      for (let i = 1; i <= 17; i++) {
        const val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_islesOfPlay_game${i}`);
        if (val) {
          loadedScores[`game${i}`] = parseInt(val, 10);
        }
      }
      setGameScores(loadedScores);
    } catch (e) {
      console.error('Failed to load Isles of Play progress', e);
    }
  };

  const handleWinLevel = async () => {
    if (!selectedGame) return;
    const gameKey = `game${selectedGame.id}`;
    const pointsEarned = 5; 
    const newGameScore = Math.min(125, (gameScores[gameKey] || 0) + pointsEarned);

    const updatedScores = { ...gameScores, [gameKey]: newGameScore };
    setGameScores(updatedScores);

    if (cleanParent && cleanExplorer) {
      try {
        await AsyncStorage.setItem(
          `@phonixia_${cleanParent}_${cleanExplorer}_islesOfPlay_${gameKey}`,
          newGameScore.toString()
        );
      } catch (e) {
        console.error('Failed to save score', e);
      }
    }

    if (onScoreUpdate) {
      onScoreUpdate('islesOfPlay', selectedGame.id, newGameScore);
    }

    if (currentLevel < 25) {
      setCurrentLevel(prev => prev + 1);
      Alert.alert("🎉 Area Cleared!", `Fantastic work, Explorer ${username}! You earned 5 stars and advanced to Level ${currentLevel + 1}! 🏝️✨`);
    } else {
      Alert.alert("👑 Zone Master!", `Incredible! You have conquered all 25 levels of ${selectedGame.title}! 🏝️🏆`);
    }
  };

  // 17 interactive hotspots mapped precisely over isles.png (including the new ski lift in the top right corner)
  const gamesList = [
    { id: 1, title: "Pirate Fort & Watchtower", subtitle: "Defend fortress walls!", emoji: "🏴‍☠️", desc: "Spell secret pirate passwords to secure the watchtower canons!", top: '22%', left: '10%' },
    { id: 2, title: "Carnival & Ferris Wheel", subtitle: "Spin phonics carnival rides!", emoji: "🎡", desc: "Match vowel sounds and letter blends as the carnival rides spin!", top: '28%', left: '33%' },
    { id: 3, title: "Treehouse Canopy Village", subtitle: "Climb leafy branches!", emoji: "🌳", desc: "Navigate suspension bridges and match vocabulary words!", top: '30%', left: '57%' },
    { id: 4, title: "Snowy Mountain Mine", subtitle: "Prospect frosty syllables!", emoji: "🏔️", desc: "Ride the cable car up the snowy peak and mine sparkling gems!", top: '24%', left: '88%' },
    { id: 5, title: "Crystal Coral Kingdom", subtitle: "Dive into the shell palace!", emoji: "🏰", desc: "Explore underwater crystal towers and match deep-sea sounds!", top: '63%', left: '12%' },
    { id: 6, title: "Central Beach Sandcastle", subtitle: "Build towers with spellings!", emoji: "🏖️", desc: "Construct magnificent sandcastle turrets by matching letter blocks!", top: '50%', left: '44%' },
    { id: 7, title: "Active Lava Volcano", subtitle: "Soothe fiery magma flows!", emoji: "🌋", desc: "Type matching rhyming words quickly to cool down the volcano!", top: '53%', left: '80%' },
    { id: 8, title: "Stone Face Grotto", subtitle: "Unlock carved monoliths!", emoji: "🗿", desc: "Solve ancient linguistic riddles echoing from the waterfalls!", top: '78%', left: '33%' },
    { id: 9, title: "Zen Blossom Garden", subtitle: "Match serene koi sounds!", emoji: "🌸", desc: "Listen to the tranquil waterfall and pair consonant blends!", top: '78%', left: '60%' },
    { id: 10, title: "Skull Cave & Treasure", subtitle: "Unearth hidden pirate loot!", emoji: "☠️", desc: "Navigate spooky skull cave tunnels and spell treasure words!", top: '75%', left: '88%' },
    { id: 11, title: "Red Sail Galleon", subtitle: "Sail with sound flags!", emoji: "⛵", desc: "Hoist proper phonetic sails to catch the wind!", top: '45%', left: '5%' },
    { id: 12, title: "Yellow Submarine", subtitle: "Dive deep into trenches!", emoji: "🟡", desc: "Pilot the yellow submarine through coral mazes!", top: '82%', left: '5%' },
    { id: 13, title: "Cargo Coastal Boat", subtitle: "Deliver supplies to ports!", emoji: "🚤", desc: "Match delivery manifests with correct phonetic crates!", top: '44%', left: '34%' },
    { id: 14, title: "Hot Air Balloon", subtitle: "Float across the sky!", emoji: "🎈", desc: "Burn fuel with correct syllable combinations to steer across skies!", top: '6%', left: '76%' },
    { id: 15, title: "Lagoon Center Sailboat", subtitle: "Catch central lagoon breezes!", emoji: "⛵", desc: "Navigate the mid-map waters by sorting vowel sounds correctly!", top: '56%', left: '26%' },
    { id: 16, title: "Eastern Shore Fishing Boat", subtitle: "Reel in vocabulary catches!", emoji: "🛶", desc: "Cast your phonetic fishing lines along the right side column waters!", top: '56%', left: '96%' },
    // Newly added top-right ski lift:
    { id: 17, title: "Snowy Peak Ski Lift", subtitle: "Ride up the frosty mountain cables!", emoji: "🚡", desc: "Match icy vowel blends as you ascend the ski lift to the summit!", top: '15%', left: '94%' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./isles.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlayContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>🗺️ World Map</Text>
            </TouchableOpacity>
            <View style={styles.titleBadge}>
              <Text style={styles.headerTitle}>🏝️ Isles of Play</Text>
            </View>
            <View style={styles.explorerBadge}>
              <Text style={styles.explorerBadgeText}>✨ {username}</Text>
            </View>
          </View>

          {/* Interactive Map Area with Clickable Bubbles */}
          <View style={styles.mapCanvas}>
            {gamesList.map((game) => {
              const scoreKey = `game${game.id}`;
              const currentScoreVal = gameScores[scoreKey] || 0;
              return (
                <TouchableOpacity
                  key={game.id}
                  style={[styles.hotspotBubble, { top: game.top, left: game.left }]}
                  onPress={() => {
                    setSelectedGame(game);
                    setCurrentLevel(Math.floor(currentScoreVal / 5) + 1 > 25 ? 25 : Math.floor(currentScoreVal / 5) + 1);
                  }}
                >
                  <Text style={styles.bubbleEmoji}>{game.emoji}</Text>
                  <View style={styles.bubbleScorePill}>
                    <Text style={styles.bubbleScoreText}>⭐{currentScoreVal}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Active Game Modal */}
          {selectedGame && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={!!selectedGame}
              onRequestClose={() => setSelectedGame(null)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalGameEmoji}>{selectedGame.emoji}</Text>
                  <Text style={styles.modalGameTitle}>{selectedGame.title}</Text>
                  <Text style={styles.modalGameSubtitle}>Level {currentLevel} of 25</Text>
                  
                  <View style={styles.gamePlayArea}>
                    <Text style={styles.gameInstructionText}>{selectedGame.desc}</Text>
                    <View style={styles.interactiveDemoBox}>
                      <Text style={styles.demoPromptText}>🎮 Zone Challenge Active!</Text>
                      <Text style={styles.demoSubText}>Tap below to complete this level challenge and earn +5 points!</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.completeLevelButton} onPress={handleWinLevel}>
                    <Text style={styles.completeLevelButtonText}>✅ Complete Challenge & Win +5 Points</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelectedGame(null)}>
                    <Text style={styles.closeModalButtonText}>Close & Return to Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#03045e' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(3, 4, 94, 0.2)', padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  backButton: { backgroundColor: '#1d3557', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#48cae4' },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  titleBadge: { backgroundColor: 'rgba(13, 27, 42, 0.85)', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#f4a261' },
  headerTitle: { color: '#f4a261', fontSize: 16, fontWeight: 'bold' },
  explorerBadge: { backgroundColor: '#2a9d8f', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  explorerBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  mapCanvas: { flex: 1, position: 'relative', width: '100%', height: '100%' },
  hotspotBubble: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(27, 38, 59, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f4a261',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  bubbleEmoji: { fontSize: 20 },
  bubbleScorePill: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#0d1b2a',
    paddingHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#48cae4',
  },
  bubbleScoreText: { color: '#4ade80', fontSize: 9, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 380, backgroundColor: '#1b263b', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#f4a261' },
  modalGameEmoji: { fontSize: 40, marginBottom: 2 },
  modalGameTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 2 },
  modalGameSubtitle: { fontSize: 12, color: '#f4a261', fontWeight: 'bold', marginBottom: 12 },
  gamePlayArea: { width: '100%', backgroundColor: '#0d1b2a', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#415a77', alignItems: 'center' },
  gameInstructionText: { color: '#cbd5e1', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  interactiveDemoBox: { width: '100%', backgroundColor: '#1d3557', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#48cae4' },
  demoPromptText: { color: '#48cae4', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
  demoSubText: { color: '#94a3b8', fontSize: 11, textAlign: 'center' },
  completeLevelButton: { width: '100%', backgroundColor: '#2a9d8f', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10, elevation: 3 },
  completeLevelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  closeModalButton: { width: '100%', backgroundColor: '#475569', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  closeModalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
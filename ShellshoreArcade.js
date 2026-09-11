import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShellshoreArcade({ username, email, onScoreUpdate, onBack }) {
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
    loadShellshoreProgress();
  }, []);

  const loadShellshoreProgress = async () => {
    if (!cleanParent || !cleanExplorer) return;
    try {
      let loadedScores = { ...gameScores };
      for (let i = 1; i <= 17; i++) {
        const val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_shellshore_game${i}`);
        if (val) {
          loadedScores[`game${i}`] = parseInt(val, 10);
        }
      }
      setGameScores(loadedScores);
    } catch (e) {
      console.error('Failed to load Shellshore Arcade progress', e);
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
          `@phonixia_${cleanParent}_${cleanExplorer}_shellshore_${gameKey}`,
          newGameScore.toString()
        );
      } catch (e) {
        console.error('Failed to save score', e);
      }
    }

    if (onScoreUpdate) {
      onScoreUpdate('shellshore', selectedGame.id, newGameScore);
    }

    if (currentLevel < 25) {
      setCurrentLevel(prev => prev + 1);
      Alert.alert("🎉 Arcade Cleared!", `Amazing job, Explorer ${username}! You earned 5 stars and advanced to Level ${currentLevel + 1}! 🐚✨`);
    } else {
      Alert.alert("👑 Arcade Master!", `Incredible! You have mastered all 25 levels of ${selectedGame.title}! 🐚🏆`);
    }
  };

  // 17 interactive hotspots mapped precisely over shellshore.png matching the image layout
  const gamesList = [
    { id: 1, title: "Pink Octopus Plaza", subtitle: "Play tentacle arcade games!", emoji: "🐙", desc: "Match colorful phonics tentacles to score jackpot tickets!", top: '22%', left: '16%' },
    { id: 2, title: "Ferris Wheel Midway", subtitle: "Spin through vowel prizes!", emoji: "🎡", desc: "Match rotating vowel sounds on the grand carnival ride!", top: '26%', left: '29%' },
    { id: 3, title: "Central Treehouse Hut", subtitle: "Trade tokens for phonics treats!", emoji: "🛖", desc: "Pair phonetic tokens with market stalls to complete requests!", top: '44%', left: '46%' },
    { id: 4, title: "Waterfall & Waterslide", subtitle: "Glide down rapid sound rapids!", emoji: "🌊", desc: "Catch correct letter blends as you slide down the waterpark!", top: '27%', left: '72%' },
    { id: 5, title: "Volcano Target Range", subtitle: "Hit sizzling target bullseyes!", emoji: "🌋", desc: "Spell words correctly to hit the glowing volcano target rings!", top: '33%', left: '91%' },
    { id: 6, title: "Crystal Dome Aquarium", subtitle: "Dive into deep-sea vocabulary!", emoji: "🫧", desc: "Pilot your bubble vessel and collect hidden syllable pearls!", top: '51%', left: '11%' },
    { id: 7, title: "Beach Volleyball Court", subtitle: "Serve up spiked spelling matches!", emoji: "🏐", desc: "Volley the correct letter combination blocks over the net!", top: '53%', left: '77%' },
    { id: 8, title: "Lighthouse Coast Station", subtitle: "Guide ships with sound beams!", emoji: "🏮", desc: "Rotate mirrored lenses to match the right phonics frequency!", top: '52%', left: '97%' },
    { id: 9, title: "Treasure Mine Cave", subtitle: "Unearth sparkling gold loot!", emoji: "🪙", desc: "Navigate the cavern tunnels and spell correct treasure words!", top: '78%', left: '10%' },
    { id: 10, title: "Pirate Target Fortress", subtitle: "Fire phonetic cannon shots!", emoji: "🎯", desc: "Aim your cannons at the correct letter targets to win prizes!", top: '75%', left: '38%' },
    { id: 11, title: "Giant Shell Throne", subtitle: "Sit on the royal pearl shell!", emoji: "🐚", desc: "Solve majestic shell riddles to earn royal arcade bonuses!", top: '76%', left: '65%' },
    { id: 12, title: "Seashell Souvenir Shop", subtitle: "Buy cool arcade prizes!", emoji: "🛍️", desc: "Trade your earned tickets for fun phonics stickers and toys!", top: '77%', left: '91%' },
    { id: 13, title: "Pirate Galleon Ship", subtitle: "Command the arcade flagship!", emoji: "🏴‍☠️", desc: "Hoist correct pirate flags to conquer the high seas!", top: '38%', left: '5%' },
    { id: 14, title: "Hot Air Balloon", subtitle: "Float high above Shellshore!", emoji: "🎈", desc: "Burn fuel with syllable combinations to soar above the arcade!", top: '8%', left: '85%' },
    { id: 15, title: "Mid-Lagoon Sailboat", subtitle: "Sail through central waters!", emoji: "⛵", desc: "Catch the lagoon breeze by solving word matching puzzles!", top: '58%', left: '34%' },
    { id: 16, title: "Eastern Fishing Boat", subtitle: "Reel in big catch bonuses!", emoji: "🛶", desc: "Cast your line along the right coast for hidden word fish!", top: '18%', left: '85%' },
    { id: 17, title: "Summit Ski Lift", subtitle: "Ascend the snowy peak cables!", emoji: "🚡", desc: "Match frosty letter blends while riding up the mountain!", top: '15%', left: '74%' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./shellshore.png')} 
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <View style={styles.overlayContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>🗺️ World Map</Text>
            </TouchableOpacity>
            <View style={styles.titleBadge}>
              <Text style={styles.headerTitle}>🐚 Shellshore Arcade</Text>
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
                      <Text style={styles.demoPromptText}>🎮 Arcade Challenge Active!</Text>
                      <Text style={styles.demoSubText}>Tap below to complete this level challenge and earn +5 points!</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.completeLevelButton} onPress={handleWinLevel}>
                    <Text style={styles.completeLevelButtonText}>✅ Complete Challenge & Win +5 Points</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelectedGame(null)}>
                    <Text style={styles.closeModalButtonText}>Close & Return to Arcade</Text>
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
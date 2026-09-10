import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export default function SoundShallows({ username, email, onScoreUpdate, onBack }) {
  const [gameProgress, setGameProgress] = useState({
    game1: 0, // Lighthouse Phonics Match
    game2: 0, // Docks Cargo Blending
    game3: 0, // Sandbar Bridge Segmentation
    game4: 0, // Crystal Cave Sound Isolation
    game5: 0, // Sunken Shipwreck Treasure Unjumble Spelling
    game6: 0, // Beach Cove Rhythm & Rhyme Tap
  });

  const [activeGameKey, setActiveGameKey] = useState(null);
  const [activeGameTitle, setActiveGameTitle] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  
  // Dynamic puzzle state for unjumble & matching
  const [challenge, setChallenge] = useState({
    promptText: '',
    spokenText: '',
    options: [], // For matching games (array of {label, isCorrect, emoji})
    scrambledLetters: [], // For unjumble game
    selectedLetters: [], // For unjumble game
    targetWord: '',
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadLandProgress();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadLandProgress = async () => {
    try {
      const cleanParent = email.trim().toLowerCase();
      const cleanExplorer = username.trim();
      let loadedGames = {};
      for (let i = 1; i <= 6; i++) {
        let val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_soundShallows_game${i}`);
        loadedGames[`game${i}`] = val ? parseInt(val, 10) : 0;
      }
      setGameProgress(loadedGames);
    } catch (e) {
      console.error('Failed to load Sound Shallows progress', e);
    }
  };

  const saveGameScore = async (gameKey, newScore) => {
    try {
      const cleanParent = email.trim().toLowerCase();
      const cleanExplorer = username.trim();
      await AsyncStorage.setItem(`@phonixia_${cleanParent}_${cleanExplorer}_soundShallows_${gameKey}`, newScore.toString());
      setGameProgress(prev => ({ ...prev, [gameKey]: newScore }));
      const gameIndex = gameKey.replace('game', '');
      onScoreUpdate('soundShallows', gameIndex, newScore);
    } catch (e) {
      console.error('Failed to save game score', e);
    }
  };

  const speakText = (text) => {
    Speech.stop();
    Speech.speak(text, { language: 'en', rate: 0.9 });
  };

  const openGame = (gameKey, title) => {
    setActiveGameKey(gameKey);
    setActiveGameTitle(title);
    const currentPoints = gameProgress[gameKey] || 0;
    const calculatedLevel = Math.min(25, Math.floor(currentPoints / 5) + 1);
    setCurrentLevel(calculatedLevel);
    setGameScore(currentPoints);
    setFeedback('');
    generateKidFriendlyChallenge(gameKey, calculatedLevel);
  };

  // Generates early-reader friendly challenges using audio and visuals
  const generateKidFriendlyChallenge = (gameKey, level) => {
    setFeedback('');
    let newChal = {};

    switch (gameKey) {
      case 'game1': {
        // Lighthouse Phonics Match: Find picture starting with a sound
        const items = [
          { label: 'Sun', emoji: '☀️', sound: 's', correct: true },
          { label: 'Cat', emoji: '🐱', sound: 'c', correct: false },
          { label: 'Dog', emoji: '🐶', sound: 'd', correct: false },
        ];
        // Shuffle options slightly based on level
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        newChal = {
          promptText: "Find the picture that starts with the 'S' sound!",
          spokenText: "Find the picture that starts with the s sound. Sssun!",
          options: shuffled,
        };
        break;
      }
      case 'game2': {
        // Docks Cargo Blending: Listen to blended sound parts
        newChal = {
          promptText: "Listen to the sounds. What word do they make?",
          spokenText: "Listen. C... a... t... What word is it?",
          options: [
            { label: 'Cat', emoji: '🐱', correct: true },
            { label: 'Pig', emoji: '🐷', correct: false },
            { label: 'Bus', emoji: '🚌', correct: false },
          ].sort(() => Math.random() - 0.5),
        };
        break;
      }
      case 'game3': {
        // Sandbar Segmentation: Count sounds/claps in a word
        newChal = {
          promptText: "How many sound beats in 'FISH'? Tap the shell count!",
          spokenText: "How many sounds in fish? F-i-sh. Count them!",
          options: [
            { label: '2 Beats', emoji: '✌️', correct: false },
            { label: '3 Beats (F-I-SH)', emoji: '🐚🐚🐚', correct: true },
            { label: '4 Beats', emoji: '🖐️', correct: false },
          ],
        };
        break;
      }
      case 'game4': {
        // Crystal Cave Sound Isolation: Middle sound
        newChal = {
          promptText: "What middle vowel sound do you hear in P-I-N?",
          spokenText: "What middle sound do you hear in pin? P... i ...n.",
          options: [
            { label: 'Sound A', emoji: '🍎 A', correct: false },
            { label: 'Sound I', emoji: '🧊 I', correct: true },
            { label: 'Sound O', emoji: '🍊 O', correct: false },
          ],
        };
        break;
      }
      case 'game5': {
        // Sunken Shipwreck: Unjumble the letters into treasure chest!
        const wordList = ['CAT', 'DOG', 'SUN', 'HAT', 'PIG', 'CUP'];
        const target = wordList[(level - 1) % wordList.length];
        const scrambled = target.split('').sort(() => Math.random() - 0.5);
        newChal = {
          promptText: `Tap the letters in order to spell: 🪙 ${target}`,
          spokenText: `Spell the word ${target} by tapping the treasure letters!`,
          targetWord: target,
          scrambledLetters: scrambled.map((char, idx) => ({ id: idx, char })),
          selectedLetters: [],
          options: [],
        };
        break;
      }
      case 'game6': {
        // Beach Cove Rhythm & Rhyme: Rhyming tap
        newChal = {
          promptText: "Which word rhymes with 'HAT'?",
          spokenText: "Which word rhymes with hat?",
          options: [
            { label: 'Cat', emoji: '🐱', correct: true },
            { label: 'Dog', emoji: '🐶', correct: false },
            { label: 'Sun', emoji: '☀️', correct: false },
          ].sort(() => Math.random() - 0.5),
        };
        break;
      }
      default:
        newChal = { promptText: 'Tap the correct choice!', spokenText: 'Tap the correct choice', options: [] };
    }

    setChallenge(newChal);
    speakText(newChal.spokenText);
  };

  // Handle standard matching option tap
  const handleOptionSelect = (option) => {
    if (option.correct) {
      handleSuccessfulAnswer();
    } else {
      setFeedback('❌ Try again! Listen closely.');
      speakText('Try again!');
    }
  };

  // Handle unjumble letter tap (Game 5)
  const handleLetterTap = (letterObj) => {
    const updatedSelected = [...challenge.selectedLetters, letterObj];
    const updatedScrambled = challenge.scrambledLetters.filter(l => l.id !== letterObj.id);
    
    setChallenge(prev => ({
      ...prev,
      selectedLetters: updatedSelected,
      scrambledLetters: updatedScrambled,
    }));

    speakText(letterObj.char);

    // Check if word is fully built
    if (updatedSelected.length === challenge.targetWord.length) {
      const spelledWord = updatedSelected.map(l => l.char).join('');
      if (spelledWord === challenge.targetWord) {
        handleSuccessfulAnswer();
      } else {
        setFeedback('❌ Not quite right! Resetting letters...');
        speakText('Not quite right. Let us try again.');
        setTimeout(() => {
          generateKidFriendlyChallenge(activeGameKey, currentLevel);
        }, 1200);
      }
    }
  };

  const handleSuccessfulAnswer = () => {
    setFeedback('🌟 Yay! Awesome job!');
    speakText('Awesome job!');
    const newScore = gameScore + 5;
    setGameScore(newScore);
    saveGameScore(activeGameKey, newScore);

    setTimeout(() => {
      if (currentLevel < 25) {
        const nextLvl = currentLevel + 1;
        setCurrentLevel(nextLvl);
        generateKidFriendlyChallenge(activeGameKey, nextLvl);
      } else {
        Alert.alert("🎉 Zone Mastered!", "You collected all treasures and completed Level 25 in this zone!");
        setActiveGameKey(null);
      }
    }, 1200);
  };

  const getZoneTotal = (gameKey) => gameProgress[gameKey] || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./shallows.png')} 
        style={styles.mapBackground}
        resizeMode="stretch"
      >
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>🗺️ Back to Map</Text>
          </TouchableOpacity>
          <Text style={styles.explorerTag}>🌊 Sound Shallows | {username}</Text>
        </View>

        {/* 6 Landmark Nodes */}
        <View style={styles.nodesContainer}>
          <TouchableOpacity 
            style={[styles.gameNode, { top: '15%', left: '12%' }]} 
            onPress={() => openGame('game1', '🔦 Lighthouse Phonics')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🏮</Text></View>
            <Text style={styles.nodeText}>Lighthouse ({getZoneTotal('game1')})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '35%', left: '26%' }]} 
            onPress={() => openGame('game2', '🏗️ Docks Cargo Blending')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>📦</Text></View>
            <Text style={styles.nodeText}>Docks ({getZoneTotal('game2')})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '38%', left: '48%' }]} 
            onPress={() => openGame('game3', '🌉 Sandbar Segmentation')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🪵</Text></View>
            <Text style={styles.nodeText}>Sandbar ({getZoneTotal('game3')})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '22%', right: '15%' }]} 
            onPress={() => openGame('game4', '💎 Crystal Cave Sounds')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>💎</Text></View>
            <Text style={styles.nodeText}>Crystal Cave ({getZoneTotal('game4')})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '22%', right: '22%' }]} 
            onPress={() => openGame('game5', '⚓ Shipwreck Treasure Unjumble')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🏴‍☠️</Text></View>
            <Text style={styles.nodeText}>Shipwreck ({getZoneTotal('game5')})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '15%', left: '16%' }]} 
            onPress={() => openGame('game6', '🏖️ Beach Cove Rhyme Tap')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🐚</Text></View>
            <Text style={styles.nodeText}>Beach Cove ({getZoneTotal('game6')})</Text>
          </TouchableOpacity>
        </View>

        {/* Gameplay Interactive Modal (Kid Friendly Audio/Visual) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={activeGameKey !== null}
          onRequestClose={() => setActiveGameKey(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>{activeGameTitle}</Text>
              
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Level {currentLevel} / 25 ⭐ Score: {gameScore}</Text>
              </View>

              {/* Speaker Repeat Button for early readers */}
              <TouchableOpacity 
                style={styles.speakerButton} 
                onPress={() => speakText(challenge.spokenText)}
              >
                <Text style={styles.speakerButtonText}>🔊 Tap to Hear Again</Text>
              </TouchableOpacity>

              <Text style={styles.challengePrompt}>{challenge.promptText}</Text>

              {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}

              {/* UNJUMBLE MECHANIC (Game 5) */}
              {activeGameKey === 'game5' ? (
                <View style={styles.unjumbleContainer}>
                  {/* Target slot box */}
                  <View style={styles.targetSlotRow}>
                    {challenge.targetWord.split('').map((_, idx) => (
                      <View key={idx} style={styles.letterSlot}>
                        <Text style={styles.slottedCharText}>
                          {challenge.selectedLetters[idx] ? challenge.selectedLetters[idx].char : '_'}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.subInstruction}>Tap the treasure letters in order:</Text>
                  <View style={styles.optionsRow}>
                    {challenge.scrambledLetters.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.treasureLetterCard} 
                        onPress={() => handleLetterTap(item)}
                      >
                        <Text style={styles.treasureLetterText}>{item.char}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {challenge.selectedLetters.length > 0 && (
                    <TouchableOpacity 
                      style={styles.clearButton} 
                      onPress={() => generateKidFriendlyChallenge('game5', currentLevel)}
                    >
                      <Text style={styles.clearButtonText}>🔄 Reset Letters</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                /* MATCHING & TAPPING OPTIONS (Games 1, 2, 3, 4, 6) */
                <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.optionsScrollContainer}>
                  {challenge.options.map((opt, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.visualOptionCard} 
                      onPress={() => handleOptionSelect(opt)}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                      <Text style={styles.optionLabelText}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity 
                style={styles.quitButton} 
                onPress={() => setActiveGameKey(null)}
              >
                <Text style={styles.quitButtonText}>🚪 Leave Zone / Return to Map</Text>
              </TouchableOpacity>
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  backButton: { backgroundColor: '#4361ee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  explorerTag: { color: '#ffd166', fontWeight: 'bold', fontSize: 13 },
  nodesContainer: { flex: 1, position: 'relative' },
  gameNode: { position: 'absolute', alignItems: 'center' },
  nodeCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3a86ff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  nodeEmoji: { fontSize: 22 },
  nodeText: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: '#1b263b', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#4cc9f0' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 6 },
  levelBadge: { backgroundColor: '#0d1b2a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 10 },
  levelBadgeText: { color: '#ffd166', fontWeight: 'bold', fontSize: 13 },
  speakerButton: { backgroundColor: '#f72585', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
  speakerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  challengePrompt: { fontSize: 16, color: '#e2e8f0', textAlign: 'center', marginBottom: 14, fontWeight: '600', lineHeight: 22 },
  feedbackText: { fontSize: 16, fontWeight: 'bold', color: '#4ade80', marginBottom: 10, textAlign: 'center' },
  optionsScrollContainer: { width: '100%', paddingBottom: 10 },
  visualOptionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3a86ff', padding: 14, borderRadius: 14, marginBottom: 10, width: '100%', borderWidth: 2, borderColor: '#fff' },
  optionEmoji: { fontSize: 32, marginRight: 16 },
  optionLabelText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  unjumbleContainer: { width: '100%', alignItems: 'center', marginBottom: 10 },
  targetSlotRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 14 },
  letterSlot: { width: 50, height: 50, backgroundColor: '#0d1b2a', borderWidth: 2, borderColor: '#4cc9f0', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
  slottedCharText: { color: '#ffd166', fontSize: 24, fontWeight: 'bold' },
  subInstruction: { color: '#94a3b8', fontSize: 13, marginBottom: 10 },
  optionsRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 },
  treasureLetterCard: { width: 52, height: 52, backgroundColor: '#ffd166', borderRadius: 12, justifyContent: 'center', alignItems: 'center', margin: 6, borderWidth: 2, borderColor: '#fff', elevation: 4 },
  treasureLetterText: { color: '#0b090a', fontSize: 24, fontWeight: 'bold' },
  clearButton: { backgroundColor: '#e63946', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginTop: 4 },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  quitButton: { backgroundColor: '#6c757d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 6 },
  quitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
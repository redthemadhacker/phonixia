import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export default function WhisperingPeaks({ username, email, onScoreUpdate, onBack }) {
  const [gameProgress, setGameProgress] = useState({
    game1: 0, // Signpost Phonics Match
    game2: 0, // Crystal Cave Blending
    game3: 0, // Floating Island Sound Beats
    game4: 0, // Rope Bridge Vowel Sounds
    game5: 0, // Snowy Owl Unjumble Spelling
    game6: 0, // Eagle Castle Rhyme Tap
  });

  const [activeGameKey, setActiveGameKey] = useState(null);
  const [activeGameTitle, setActiveGameTitle] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  
  const [challenge, setChallenge] = useState({
    promptText: '',
    spokenText: '',
    options: [],
    scrambledLetters: [],
    selectedLetters: [],
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
        let val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_whisperingPeaks_game${i}`);
        loadedGames[`game${i}`] = val ? parseInt(val, 10) : 0;
      }
      setGameProgress(loadedGames);
    } catch (e) {
      console.error('Failed to load Whispering Peaks progress', e);
    }
  };

  const saveGameScore = async (gameKey, newScore) => {
    try {
      const cleanParent = email.trim().toLowerCase();
      const cleanExplorer = username.trim();
      await AsyncStorage.setItem(`@phonixia_${cleanParent}_${cleanExplorer}_whisperingPeaks_${gameKey}`, newScore.toString());
      setGameProgress(prev => ({ ...prev, [gameKey]: newScore }));
      const gameIndex = gameKey.replace('game', '');
      onScoreUpdate('whisperingPeaks', gameIndex, newScore);
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

  const generateKidFriendlyChallenge = (gameKey, level) => {
    setFeedback('');
    let newChal = {};

    switch (gameKey) {
      case 'game1': {
        const items = [
          { label: 'Snow', emoji: '❄️', sound: 's', correct: true },
          { label: 'Leaf', emoji: '🍃', sound: 'l', correct: false },
          { label: 'Sun', emoji: '☀️', sound: 's', correct: false },
        ].sort(() => Math.random() - 0.5);
        newChal = {
          promptText: "Find the cold word starting with the 'S' sound!",
          spokenText: "Find the word that starts with the s sound. Snow!",
          options: items,
        };
        break;
      }
      case 'game2': {
        newChal = {
          promptText: "Listen to the sounds. What word do they make?",
          spokenText: "Listen. C... a... v... e... What word is it?",
          options: [
            { label: 'Cave', emoji: '🏔️', correct: true },
            { label: 'Boat', emoji: '⛵', correct: false },
            { label: 'Tree', emoji: '🌳', correct: false },
          ].sort(() => Math.random() - 0.5),
        };
        break;
      }
      case 'game3': {
        newChal = {
          promptText: "How many sound beats in 'MOUNTAIN'? Tap the count!",
          spokenText: "How many sound beats in mountain? Moun-tain. Count them!",
          options: [
            { label: '1 Beat', emoji: '1️⃣', correct: false },
            { label: '2 Beats (MOUN-TAIN)', emoji: '⛰️⛰️', correct: true },
            { label: '3 Beats', emoji: '3️⃣', correct: false },
          ],
        };
        break;
      }
      case 'game4': {
        newChal = {
          promptText: "What middle vowel sound do you hear in I-C-E?",
          spokenText: "What middle sound do you hear in ice? I... c... e.",
          options: [
            { label: 'Sound I', emoji: '🧊 I', correct: true },
            { label: 'Sound O', emoji: '🌕 O', correct: false },
            { label: 'Sound A', emoji: '🍎 A', correct: false },
          ].sort(() => Math.random() - 0.5),
        };
        break;
      }
      case 'game5': {
        const wordList = ['COLD', 'SNOW', 'PEAK', 'WIND', 'BIRD', 'ICEE'];
        const target = wordList[(level - 1) % wordList.length];
        const scrambled = target.split('').sort(() => Math.random() - 0.5);
        newChal = {
          promptText: `Tap the letters in order to spell: ❄️ ${target}`,
          spokenText: `Spell the mountain word ${target}!`,
          targetWord: target,
          scrambledLetters: scrambled.map((char, idx) => ({ id: idx, char })),
          selectedLetters: [],
          options: [],
        };
        break;
      }
      case 'game6': {
        newChal = {
          promptText: "Which word rhymes with 'SNOW'?",
          spokenText: "Which word rhymes with snow?",
          options: [
            { label: 'Glow', emoji: '✨', correct: true },
            { label: 'Dog', emoji: '🐶', correct: false },
            { label: 'Pen', emoji: '🖊️', correct: false },
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

  const handleOptionSelect = (option) => {
    if (option.correct) {
      handleSuccessfulAnswer();
    } else {
      setFeedback('❌ Try again! Listen closely.');
      speakText('Try again!');
    }
  };

  const handleLetterTap = (letterObj) => {
    const updatedSelected = [...challenge.selectedLetters, letterObj];
    const updatedScrambled = challenge.scrambledLetters.filter(l => l.id !== letterObj.id);
    
    setChallenge(prev => ({
      ...prev,
      selectedLetters: updatedSelected,
      scrambledLetters: updatedScrambled,
    }));

    speakText(letterObj.char);

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
    setFeedback('🌟 Great peak climbing! Awesome job!');
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
        Alert.alert("🎉 Peak Mastered!", "You finished all 25 levels in this Whispering Peaks zone!");
        setActiveGameKey(null);
      }
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./whisper.png')} 
        style={styles.mapBackground}
        resizeMode="stretch"
      >
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>🗺️ Back to Map</Text>
          </TouchableOpacity>
          <Text style={styles.explorerTag}>⛰️ Whispering Peaks | {username}</Text>
        </View>

        {/* 6 Landmark Nodes */}
        <View style={styles.nodesContainer}>
          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '25%', left: '12%' }]} 
            onPress={() => openGame('game1', '🪧 Signpost Phonics')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🪧</Text></View>
            <Text style={styles.nodeText}>Signpost</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '35%', left: '14%' }]} 
            onPress={() => openGame('game2', '💎 Crystal Cave Blending')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>💎</Text></View>
            <Text style={styles.nodeText}>Crystal Cave</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '28%', left: '46%' }]} 
            onPress={() => openGame('game3', '✨ Floating Island Beats')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🏔️</Text></View>
            <Text style={styles.nodeText}>Floating Peak</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '20%', left: '48%' }]} 
            onPress={() => openGame('game4', '🌉 Rope Bridge Vowels')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🌉</Text></View>
            <Text style={styles.nodeText}>Rope Bridge</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { bottom: '15%', right: '15%' }]} 
            onPress={() => openGame('game5', '🦉 Snowy Owl Unjumble')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🦉</Text></View>
            <Text style={styles.nodeText}>Owl Outpost</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gameNode, { top: '22%', right: '18%' }]} 
            onPress={() => openGame('game6', '🦅 Eagle Castle Rhymes')}
          >
            <View style={styles.nodeCircle}><Text style={styles.nodeEmoji}>🦅</Text></View>
            <Text style={styles.nodeText}>Eagle Castle</Text>
          </TouchableOpacity>
        </View>

        {/* Gameplay Interactive Modal */}
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

              <TouchableOpacity 
                style={styles.speakerButton} 
                onPress={() => speakText(challenge.spokenText)}
              >
                <Text style={styles.speakerButtonText}>🔊 Tap to Hear Again</Text>
              </TouchableOpacity>

              <Text style={styles.challengePrompt}>{challenge.promptText}</Text>

              {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}

              {activeGameKey === 'game5' ? (
                <View style={styles.unjumbleContainer}>
                  <View style={styles.targetSlotRow}>
                    {challenge.targetWord.split('').map((_, idx) => (
                      <View key={idx} style={styles.letterSlot}>
                        <Text style={styles.slottedCharText}>
                          {challenge.selectedLetters[idx] ? challenge.selectedLetters[idx].char : '_'}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.subInstruction}>Tap the snow letters in order:</Text>
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
  explorerTag: { color: '#70d6ff', fontWeight: 'bold', fontSize: 13 },
  nodesContainer: { flex: 1, position: 'relative' },
  gameNode: { position: 'absolute', alignItems: 'center' },
  nodeCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#48cae4', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', elevation: 6 },
  nodeEmoji: { fontSize: 22 },
  nodeText: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: '#1b263b', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#48cae4' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 6 },
  levelBadge: { backgroundColor: '#0d1b2a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 10 },
  levelBadgeText: { color: '#70d6ff', fontWeight: 'bold', fontSize: 13 },
  speakerButton: { backgroundColor: '#f72585', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
  speakerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  challengePrompt: { fontSize: 16, color: '#e2e8f0', textAlign: 'center', marginBottom: 14, fontWeight: '600', lineHeight: 22 },
  feedbackText: { fontSize: 16, fontWeight: 'bold', color: '#4ade80', marginBottom: 10, textAlign: 'center' },
  optionsScrollContainer: { width: '100%', paddingBottom: 10 },
  visualOptionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0077b6', padding: 14, borderRadius: 14, marginBottom: 10, width: '100%', borderWidth: 2, borderColor: '#fff' },
  optionEmoji: { fontSize: 32, marginRight: 16 },
  optionLabelText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  unjumbleContainer: { width: '100%', alignItems: 'center', marginBottom: 10 },
  targetSlotRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 14 },
  letterSlot: { width: 50, height: 50, backgroundColor: '#0d1b2a', borderWidth: 2, borderColor: '#48cae4', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
  slottedCharText: { color: '#70d6ff', fontSize: 24, fontWeight: 'bold' },
  subInstruction: { color: '#94a3b8', fontSize: 13, marginBottom: 10 },
  optionsRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 },
  treasureLetterCard: { width: 52, height: 52, backgroundColor: '#48cae4', borderRadius: 12, justifyContent: 'center', alignItems: 'center', margin: 6, borderWidth: 2, borderColor: '#fff', elevation: 4 },
  treasureLetterText: { color: '#0b090a', fontSize: 24, fontWeight: 'bold' },
  clearButton: { backgroundColor: '#e63946', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginTop: 4 },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  quitButton: { backgroundColor: '#6c757d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 6 },
  quitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
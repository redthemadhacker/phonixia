import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, Modal, Alert, ScrollView, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SoundShallows from './SoundShallows';
import BuildersGuild from './BuildersGuild';
import TrickyTrails from './TrickyTrails';
import WhisperingPeaks from './WhisperingPeaks';
import LexiconEmpire from './LexiconEmpire';
import ShellshoreArcade from './ShellshoreArcade';
import IslesOfPlay from './IslesofPlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [activeParentEmail, setActiveParentEmail] = useState('');
  const [currentExplorer, setCurrentExplorer] = useState('');
  
  // Auth inputs
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formError, setFormError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Explorer management inputs
  const [explorerModalVisible, setExplorerModalVisible] = useState(false);
  const [newExplorerNameInput, setNewExplorerNameInput] = useState('');
  const [selectedGender, setSelectedGender] = useState('boy'); 
  const [selectedAvatar, setSelectedAvatar] = useState('knight'); 

  // Navigation & UI States
  const [currentLand, setCurrentLand] = useState('map');
  const [profileVisible, setProfileVisible] = useState(false);
  const [travelModalVisible, setTravelModalVisible] = useState(false);
  const [pendingDestination, setPendingDestination] = useState({ key: '', name: '' });

  // 🕹️ Character Movement & Walk Animation Engine (Lighthouse Style)
  const [charPos, setCharPos] = useState({ x: SCREEN_WIDTH * 0.4, y: SCREEN_HEIGHT * 0.4 });
  const [walkFrame, setWalkFrame] = useState(0);
  const [facingDirection, setFacingDirection] = useState('right');
  const moveIntervalRef = useRef(null);
  const isHoldingRef = useRef(false);

  const [landProgress, setLandProgress] = useState({
    soundShallows: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    buildersGuild: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    trickyTrails: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    whisperingPeaks: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    lexiconEmpire: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    shellshoreArcade: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
    islesOfPlay: { game1: 0, game2: 0, game3: 0, game4: 0, game5: 0, game6: 0 },
  });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    checkActiveSession();
    loadRememberedEmail();
  }, []);

  // 🕹️ Keyboard Listener for Web Map Movement
  useEffect(() => {
    if (Platform.OS === 'web' && currentLand === 'map' && currentExplorer) {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') executeStep('up');
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') executeStep('down');
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') executeStep('left');
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') executeStep('right');
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentLand, currentExplorer]);

  const isGirlAvatar = /^[A-Za-z]+[aeiy]$/i.test(currentExplorer) || currentExplorer.toLowerCase().includes('celine') || selectedGender === 'girl';
  
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

      checkMapProximity(newX, newY);

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

          checkMapProximity(newX, newY);

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

  const checkMapProximity = (x, y) => {
    // Sound Shallows Proximity Check
    const shallowX = SCREEN_WIDTH * 0.46;
    const shallowY = SCREEN_HEIGHT * 0.38;
    const distanceShallows = Math.hypot(x - shallowX, y - shallowY);

    if (distanceShallows < 60) {
      setPendingDestination({ key: 'soundShallows', name: 'Sound Shallows' });
      setTravelModalVisible(true);
      return;
    }

    // Explorer Home Proximity Check (Bottom Left Node)
    const homeX = SCREEN_WIDTH * 0.065;
    const homeY = SCREEN_HEIGHT * 0.63;
    const distanceHome = Math.hypot(x - homeX, y - homeY);

    if (distanceHome < 60) {
      setProfileVisible(true);
    }
  };

  const checkActiveSession = async () => {
    try {
      const parentEmail = await AsyncStorage.getItem('@phonixia_active_parent');
      const explorer = await AsyncStorage.getItem('@phonixia_active_explorer');
      if (parentEmail && explorer) {
        const cleanParent = parentEmail.trim().toLowerCase();
        const cleanExplorer = explorer.trim();
        setActiveParentEmail(cleanParent);
        setCurrentExplorer(cleanExplorer);
        await loadUserData(cleanParent, cleanExplorer);
      }
    } catch (e) {
      console.error('Failed to load active session', e);
    }
  };

  const loadRememberedEmail = async () => {
    try {
      const remembered = await AsyncStorage.getItem('@phonixia_remembered_email');
      if (remembered) {
        setInputEmail(remembered);
        setRememberMe(true);
      }
    } catch (e) {
      console.error('Failed to load remembered email', e);
    }
  };

  const getExplorerListKey = (parentEmail) => `@phonixia_explorers_${parentEmail.trim().toLowerCase()}`;
  const getExplorerMetaKey = (parentEmail, explorerName) => `@phonixia_meta_${parentEmail.trim().toLowerCase()}_${explorerName.trim()}`;

  const loadUserData = async (parentEmail, explorerName) => {
    if (!parentEmail || !explorerName) return;
    try {
      const cleanParent = parentEmail.trim().toLowerCase();
      const cleanExplorer = explorerName.trim();

      const metaStr = await AsyncStorage.getItem(getExplorerMetaKey(cleanParent, cleanExplorer));
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        if (meta.gender) setSelectedGender(meta.gender);
        if (meta.avatar) setSelectedAvatar(meta.avatar);
      }

      const loadLandGames = async (landKey) => {
        let games = {};
        for (let i = 1; i <= 6; i++) {
          let val = await AsyncStorage.getItem(`@phonixia_${cleanParent}_${cleanExplorer}_${landKey}_game${i}`);
          games[`game${i}`] = val ? parseInt(val, 10) : 0;
        }
        return games;
      };

      const soundShallows = await loadLandGames('soundShallows');
      const buildersGuild = await loadLandGames('buildersGuild');
      const trickyTrails = await loadLandGames('trickyTrails');
      const whisperingPeaks = await loadLandGames('whisperingPeaks');
      const lexiconEmpire = await loadLandGames('lexiconEmpire');
      const shellshoreArcade = await loadLandGames('shellshoreArcade');
      const islesOfPlay = await loadLandGames('islesOfPlay');

      setLandProgress({ soundShallows, buildersGuild, trickyTrails, whisperingPeaks, lexiconEmpire, shellshoreArcade, islesOfPlay });

      let combinedScore = 0;
      [soundShallows, buildersGuild, trickyTrails, whisperingPeaks, lexiconEmpire, shellshoreArcade, islesOfPlay].forEach(landObj => {
        for (let i = 1; i <= 6; i++) combinedScore += (landObj[`game${i}`] || 0);
      });
      setTotalScore(combinedScore);
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  const handleScoreUpdateLive = (landKey, gameIndex, newScore) => {
    setLandProgress(prev => {
      const updatedLand = { ...prev[landKey], [`game${gameIndex}`]: newScore };
      const updatedAllLands = { ...prev, [landKey]: updatedLand };

      let combinedScore = 0;
      Object.keys(updatedAllLands).forEach(lKey => {
        for (let i = 1; i <= 6; i++) combinedScore += (updatedAllLands[lKey][`game${i}`] || 0);
      });
      setTotalScore(combinedScore);
      return updatedAllLands;
    });
  };

  const handleSignUp = async () => {
    setFormError('');
    if (!inputEmail.trim() || !inputPassword.trim()) {
      setFormError("⚠️ Please fill in all fields.");
      return;
    }
    const cleanEmail = inputEmail.trim().toLowerCase();
    try {
      const existingPass = await AsyncStorage.getItem(`@phonixia_pass_${cleanEmail}`);
      if (existingPass) {
        setFormError("⚠️ Account already exists! Please log in.");
        setIsLoginMode(true);
        return;
      }
      await AsyncStorage.setItem(`@phonixia_pass_${cleanEmail}`, inputPassword.trim());
      await AsyncStorage.setItem(getExplorerListKey(cleanEmail), JSON.stringify([]));
      
      if (rememberMe) {
        await AsyncStorage.setItem('@phonixia_remembered_email', cleanEmail);
      } else {
        await AsyncStorage.removeItem('@phonixia_remembered_email');
      }

      await AsyncStorage.setItem('@phonixia_active_parent', cleanEmail);
      setActiveParentEmail(cleanEmail);
      setInputPassword('');
      setFormError('');
    } catch (e) {
      console.error('Sign up failed', e);
    }
  };

  const handleLogin = async () => {
    setFormError('');
    if (!inputEmail.trim() || !inputPassword.trim()) {
      setFormError("⚠️ Please enter email and password.");
      return;
    }
    const cleanEmail = inputEmail.trim().toLowerCase();
    try {
      const savedPassword = await AsyncStorage.getItem(`@phonixia_pass_${cleanEmail}`);
      if (!savedPassword || savedPassword !== inputPassword.trim()) {
        setFormError("⚠️ Invalid email or password.");
        return;
      }
      if (rememberMe) {
        await AsyncStorage.setItem('@phonixia_remembered_email', cleanEmail);
      } else {
        await AsyncStorage.removeItem('@phonixia_remembered_email');
      }

      await AsyncStorage.setItem('@phonixia_active_parent', cleanEmail);
      setActiveParentEmail(cleanEmail);
      setInputPassword('');
      setFormError('');
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const handleAddExplorer = async () => {
    if (!newExplorerNameInput.trim()) {
      Alert.alert("⚠️ Error", "Please enter an explorer name.");
      return;
    }
    const cleanKidName = newExplorerNameInput.trim();
    try {
      const listStr = await AsyncStorage.getItem(getExplorerListKey(activeParentEmail));
      let explorers = listStr ? JSON.parse(listStr) : [];
      if (explorers.includes(cleanKidName)) {
        Alert.alert("⚠️ Warning", "Explorer name already exists!");
        return;
      }
      explorers.push(cleanKidName);
      await AsyncStorage.setItem(getExplorerListKey(activeParentEmail), JSON.stringify(explorers));
      await AsyncStorage.setItem(
        getExplorerMetaKey(activeParentEmail, cleanKidName),
        JSON.stringify({ gender: selectedGender, avatar: selectedAvatar })
      );
      setNewExplorerNameInput('');
      setExplorerModalVisible(false);
      handleSelectExplorer(cleanKidName);
    } catch (e) {
      console.error('Failed to add explorer', e);
    }
  };

  const handleSelectExplorer = async (explorerName) => {
    try {
      const cleanExplorer = explorerName.trim();
      await AsyncStorage.setItem('@phonixia_active_explorer', cleanExplorer);
      setCurrentExplorer(cleanExplorer);
      await loadUserData(activeParentEmail, cleanExplorer);
    } catch (e) {
      console.error('Failed to select explorer', e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@phonixia_active_parent');
      await AsyncStorage.removeItem('@phonixia_active_explorer');
      setActiveParentEmail('');
      setCurrentExplorer('');
      setProfileVisible(false);
      setCurrentLand('map');
      setIsLoginMode(false);
      loadRememberedEmail();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const landComponents = {
    soundShallows: SoundShallows,
    buildersGuild: BuildersGuild,
    trickyTrails: TrickyTrails,
    whisperingPeaks: WhisperingPeaks,
    lexiconEmpire: LexiconEmpire,
    shellshoreArcade: ShellshoreArcade,
    islesOfPlay: IslesOfPlay,
  };

  // --- 1. AUTH SCREEN ---
  if (!activeParentEmail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authContainer}>
          <Text style={styles.authEmoji}>👦👧🗺️</Text>
          <Text style={styles.authTitle}>Phonixia</Text>
          <Text style={styles.authSubtitle}>
            {isLoginMode ? "Log in to your parent account:" : "Create your parent account to begin quest:"}
          </Text>
          {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Parent Email..."
            placeholderTextColor="#8d99ae"
            value={inputEmail}
            onChangeText={setInputEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            {...(Platform.OS === 'web' ? { autoComplete: 'email', name: 'email' } : {})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password..."
            placeholderTextColor="#8d99ae"
            value={inputPassword}
            onChangeText={setInputPassword}
            secureTextEntry={true}
            {...(Platform.OS === 'web' ? { autoComplete: 'current-password', name: 'password' } : {})}
          />

          {/* Remember Me Toggle */}
          <TouchableOpacity 
            style={styles.rememberMeRow} 
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkboxBox, rememberMe && styles.checkboxBoxChecked]}>
              {rememberMe ? <Text style={styles.checkmarkText}>✓</Text> : null}
            </View>
            <Text style={styles.rememberMeLabel}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authButton} onPress={isLoginMode ? handleLogin : handleSignUp}>
            <Text style={styles.authButtonText}>{isLoginMode ? "🔑 Log In" : "⚔️ Join Quest"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchAuthToggle} onPress={() => setIsLoginMode(!isLoginMode)}>
            <Text style={styles.switchAuthText}>
              {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Log In"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- 2. EXPLORER SELECTOR SCREEN ---
  if (!currentExplorer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ExplorerSelectorScreen 
          parentEmail={activeParentEmail}
          onSelectExplorer={handleSelectExplorer}
          onOpenAddModal={() => setExplorerModalVisible(true)}
          onLogout={handleLogout}
          explorerModalVisible={explorerModalVisible}
          setExplorerModalVisible={setExplorerModalVisible}
          newExplorerNameInput={newExplorerNameInput}
          setNewExplorerNameInput={setNewExplorerNameInput}
          handleAddExplorer={handleAddExplorer}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </SafeAreaView>
    );
  }

  // --- 3. LAND ROUTING ---
  if (currentLand !== 'map' && landComponents[currentLand]) {
    const ActiveLandComponent = landComponents[currentLand];
    return (
      <ActiveLandComponent 
        username={currentExplorer} 
        email={activeParentEmail} 
        onScoreUpdate={handleScoreUpdateLive} 
        onBack={async () => { 
          setCurrentLand('map'); 
          await loadUserData(activeParentEmail, currentExplorer);
        }} 
      />
    );
  }

  // --- 4. WORLD MAP WITH LIGHTHOUSE MOVEMENT ENGINE ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('./phonixia_world_map.png')} style={styles.mapBackground} resizeMode="stretch">
        <View style={styles.mapContainer}>
          
          {/* Controls Instruction Banner */}
          <View style={styles.instructionBanner}>
            <Text style={styles.instructionText}>🎮 Use WASD / Arrow Keys or On-Screen Buttons to Move!</Text>
          </View>

          {/* Map Nodes */}
          <TouchableOpacity 
            style={[styles.mapNode, { top: '38%', left: '46%' }]} 
            onPress={() => { setPendingDestination({ key: 'soundShallows', name: 'Sound Shallows' }); setTravelModalVisible(true); }}
          >
            <View style={[styles.nodeIconCircle, styles.activeNodeCircle]}>
              <Text style={styles.nodeEmoji}>🌊</Text>
            </View>
            <Text style={styles.nodeLabel}>Sound Shallows</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '63%', left: '6.5%' }]} 
            onPress={() => setProfileVisible(true)}
          >
            <View style={[styles.nodeIconCircle, styles.profileNodeCircle]}>
              <Text style={styles.nodeEmoji}>🏠</Text>
            </View>
            <Text style={styles.nodeLabel}>Explorer Home</Text>
          </TouchableOpacity>

          {/* Movable Character Container */}
          <View style={[styles.characterContainer, { left: charPos.x, top: charPos.y }]}>
            <Text style={styles.charAvatar}>{getAvatar()}</Text>
            <Text style={styles.charNameTag}>{currentExplorer}</Text>
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

        {/* Travel Confirmation Modal */}
        <Modal animationType="fade" transparent={true} visible={travelModalVisible} onRequestClose={() => setTravelModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>⛵ Portal Travel</Text>
              <Text style={styles.modalSubtitle}>{`Travel to ${pendingDestination.name}?`}</Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.authButton, { flex: 1, marginRight: 8, backgroundColor: '#ef4444' }]} onPress={() => setTravelModalVisible(false)}>
                  <Text style={styles.authButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.authButton, { flex: 1, marginLeft: 8, backgroundColor: '#10b981' }]} onPress={() => { setTravelModalVisible(false); setCurrentLand(pendingDestination.key); }}>
                  <Text style={styles.authButtonText}>Go!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Profile / Home Modal */}
        <Modal animationType="fade" transparent={true} visible={profileVisible} onRequestClose={() => setProfileVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '85%' }]}>
              <Text style={styles.modalTitle}>🛡️ EXPLORER HOME</Text>
              <Text style={styles.modalSubtitle}>Active Explorer: {currentExplorer}</Text>
              
              <ScrollView style={{ width: '100%', marginVertical: 10 }}>
                <View style={styles.scoreCardMain}>
                  <Text style={styles.scoreCardTitle}>⭐ Total Adventure Stars</Text>
                  <Text style={styles.scoreCardValue}>{totalScore}</Text>
                </View>

                <Text style={styles.sectionHeaderTitle}>🗺️ Land Score Breakdown</Text>
                
                {Object.keys(landProgress).map((landKey) => {
                  let landTotal = Object.values(landProgress[landKey]).reduce((a, b) => a + b, 0);
                  let landFriendlyName = landKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <View key={landKey} style={styles.landBreakdownRow}>
                      <Text style={styles.landBreakdownName}>{landFriendlyName}</Text>
                      <Text style={styles.landBreakdownScore}>⭐ {landTotal}</Text>
                    </View>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={[styles.authButton, { backgroundColor: '#f59e0b', marginTop: 10 }]} onPress={() => { setProfileVisible(false); setCurrentExplorer(''); }}>
                <Text style={styles.authButtonText}>👥 Switch Explorer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authButton, { backgroundColor: '#ef4444', marginTop: 5 }]} onPress={handleLogout}>
                <Text style={styles.authButtonText}>🚪 Log Out Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setProfileVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

function ExplorerSelectorScreen({ parentEmail, onSelectExplorer, onOpenAddModal, onLogout, explorerModalVisible, setExplorerModalVisible, newExplorerNameInput, setNewExplorerNameInput, handleAddExplorer, selectedGender, setSelectedGender, selectedAvatar, setSelectedAvatar }) {
  const [explorers, setExplorers] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(`@phonixia_explorers_${parentEmail.trim().toLowerCase()}`).then(list => {
      if (list) setExplorers(JSON.parse(list));
    });
  }, []);

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Who is Exploring?</Text>
      <ScrollView style={{ width: '100%', marginVertical: 15 }}>
        {explorers.map((exp, idx) => (
          <TouchableOpacity key={idx} style={styles.explorerCardButton} onPress={() => onSelectExplorer(exp)}>
            <Text style={styles.explorerCardText}>🛡️ {exp}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.authButton} onPress={onOpenAddModal}>
        <Text style={styles.authButtonText}>➕ Add Explorer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchAuthToggle} onPress={onLogout}>
        <Text style={styles.switchAuthText}>🚪 Log Out Parent</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={explorerModalVisible} onRequestClose={() => setExplorerModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Explorer</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Explorer Name..."
              placeholderTextColor="#8d99ae"
              value={newExplorerNameInput}
              onChangeText={setNewExplorerNameInput}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              <TouchableOpacity 
                style={[styles.authButton, { flex: 1, marginRight: 5, backgroundColor: selectedGender === 'boy' ? '#3b82f6' : '#1e293b' }]}
                onPress={() => setSelectedGender('boy')}
              >
                <Text style={styles.authButtonText}>👦 Boy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authButton, { flex: 1, marginLeft: 5, backgroundColor: selectedGender === 'girl' ? '#ec4899' : '#1e293b' }]}
                onPress={() => setSelectedGender('girl')}
              >
                <Text style={styles.authButtonText}>👧 Girl</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.authButton, { backgroundColor: '#10b981' }]} onPress={handleAddExplorer}>
              <Text style={styles.authButtonText}>Save Explorer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setExplorerModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  authEmoji: { fontSize: 48, marginBottom: 10 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  authSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  errorBanner: { width: '100%', backgroundColor: '#7f1d1d', color: '#fca5a5', padding: 10, borderRadius: 8, marginBottom: 15, textAlign: 'center' },
  textInput: { width: '100%', height: 50, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 15, color: '#f8fafc', marginBottom: 15 },
  rememberMeRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 15 },
  checkboxBox: { width: 22, height: 22, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxBoxChecked: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  checkmarkText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  rememberMeLabel: { color: '#94a3b8', fontSize: 14 },
  authButton: { width: '100%', height: 50, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 10 },
  authButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  switchAuthToggle: { marginTop: 15 },
  switchAuthText: { color: '#94a3b8', fontSize: 14 },
  mapBackground: { flex: 1, width: '100%', height: '100%' },
  mapContainer: { flex: 1, position: 'relative' },
  instructionBanner: { position: 'absolute', top: 15, alignSelf: 'center', backgroundColor: 'rgba(15, 23, 42, 0.85)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#334155', zIndex: 10 },
  instructionText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  mapNode: { position: 'absolute', alignItems: 'center' },
  nodeIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  activeNodeCircle: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  profileNodeCircle: { borderColor: '#f59e0b', backgroundColor: '#78350f' },
  nodeEmoji: { fontSize: 22 },
  nodeLabel: { marginTop: 4, fontSize: 11, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center' },
  characterContainer: { position: 'absolute', alignItems: 'center', zIndex: 15 },
  charAvatar: { fontSize: 42 },
  charNameTag: { color: '#fff', fontSize: 9, backgroundColor: 'rgba(0,0,0,0.85)', paddingHorizontal: 4, borderRadius: 4, overflow: 'hidden' },
  controlPad: { position: 'absolute', bottom: 25, alignSelf: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20, zIndex: 10 },
  ctrlRowMiddle: { flexDirection: 'row', justifyContent: 'space-between', width: 140, marginVertical: 4 },
  ctrlBtn: { backgroundColor: 'rgba(255,255,255,0.85)', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  ctrlText: { fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8, textAlign: 'center' },
  modalSubtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 15, textAlign: 'center' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  closeButton: { width: '100%', paddingVertical: 12, alignItems: 'center', marginTop: 5 },
  closeButtonText: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold' },
  explorerCardButton: { backgroundColor: '#1e293b', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  explorerCardText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  scoreCardMain: { backgroundColor: '#0f172a', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  scoreCardTitle: { fontSize: 13, color: '#94a3b8', fontWeight: 'bold', marginBottom: 5 },
  scoreCardValue: { fontSize: 28, fontWeight: 'bold', color: '#38bdf8' },
  sectionHeaderTitle: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  landBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0f172a', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  landBreakdownName: { fontSize: 14, color: '#f8fafc', fontWeight: '500' },
  landBreakdownScore: { fontSize: 14, color: '#fbbf24', fontWeight: 'bold' },
});
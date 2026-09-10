import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, Modal, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SoundShallows from './SoundShallows';
import BuildersGuild from './BuildersGuild';
import TrickyTrails from './TrickyTrails';
import WhisperingPeaks from './WhisperingPeaks';
import LexiconEmpire from './LexiconEmpire';
import ShellshoreArcade from './ShellshoreArcade';
import IslesOfPlay from './IslesofPlay';

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

  // Navigation & UI States
  const [currentLand, setCurrentLand] = useState('map');
  const [profileVisible, setProfileVisible] = useState(false);

  // Forgot Password States
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [enteredCodeInput, setEnteredCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetError, setResetError] = useState('');
  
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
        if (isLoginMode) {
          setInputEmail(remembered);
        }
        setRememberMe(true);
      }
    } catch (e) {
      console.error('Failed to load remembered email', e);
    }
  };

  const getExplorerListKey = (parentEmail) => `@phonixia_explorers_${parentEmail.trim().toLowerCase()}`;

  const loadUserData = async (parentEmail, explorerName) => {
    if (!parentEmail || !explorerName) return;
    try {
      const cleanParent = parentEmail.trim().toLowerCase();
      const cleanExplorer = explorerName.trim();

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

      setLandProgress({
        soundShallows,
        buildersGuild,
        trickyTrails,
        whisperingPeaks,
        lexiconEmpire,
        shellshoreArcade,
        islesOfPlay,
      });

      let combinedScore = 0;
      [soundShallows, buildersGuild, trickyTrails, whisperingPeaks, lexiconEmpire, shellshoreArcade, islesOfPlay].forEach(landObj => {
        for (let i = 1; i <= 6; i++) {
          combinedScore += (landObj[`game${i}`] || 0);
        }
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
        for (let i = 1; i <= 6; i++) {
          combinedScore += (updatedAllLands[lKey][`game${i}`] || 0);
        }
      });
      setTotalScore(combinedScore);

      return updatedAllLands;
    });
  };

  const checkPasswordValidity = (pass) => {
    const isLongEnough = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pass);

    if (!isLongEnough || !hasUpper || !hasNum || !hasSpecial) {
      return (
        "🔒 Password must meet all security requirements:\n" +
        `${isLongEnough ? "✅" : "❌"} At least 8 characters long\n` +
        `${hasUpper ? "✅" : "❌"} At least one uppercase letter (A-Z)\n` +
        `${hasNum ? "✅" : "❌"} At least one number (0-9)\n` +
        `${hasSpecial ? "✅" : "❌"} At least one special character (!@#$%^&*...)`
      );
    }
    return null;
  };

  const handleSignUp = async () => {
    setFormError('');
    if (!inputEmail.trim() || !inputPassword.trim()) {
      setFormError("⚠️ Please fill in all fields before proceeding.");
      return;
    }

    const cleanEmail = inputEmail.trim().toLowerCase();

    try {
      const existingPass = await AsyncStorage.getItem(`@phonixia_pass_${cleanEmail}`);
      if (existingPass) {
        setFormError("⚠️ An account with this email already exists! Please log in instead.");
        setIsLoginMode(true);
        return;
      }

      const passwordError = checkPasswordValidity(inputPassword);
      if (passwordError) {
        setFormError(passwordError);
        return;
      }

      await AsyncStorage.setItem(`@phonixia_pass_${cleanEmail}`, inputPassword.trim());
      await AsyncStorage.setItem(getExplorerListKey(cleanEmail), JSON.stringify([]));

      setActiveParentEmail(cleanEmail);
      setInputPassword('');
      setFormError('');

      Alert.alert(
        "💌 Welcome Email Sent!",
        `[SIMULATED INBOX MESSAGE]\n\nTo: ${cleanEmail}\nSubject: Welcome to Phonixia!\n\n"Thank you for joining Kam and Celine on their quest! Your parent master account is secure."`
      );

    } catch (e) {
      console.error('Failed to create account', e);
    }
  };

  const handleLogin = async () => {
    setFormError('');
    if (!inputEmail.trim() || !inputPassword.trim()) {
      setFormError("⚠️ Please enter both your email and password.");
      return;
    }
    const cleanEmail = inputEmail.trim().toLowerCase();

    try {
      const savedPassword = await AsyncStorage.getItem(`@phonixia_pass_${cleanEmail}`);
      if (!savedPassword) {
        setFormError("⚠️ Account not found. Please join the quest first!");
        return;
      }

      if (savedPassword !== inputPassword.trim()) {
        setFormError("⚠️ Incorrect password. Please try again or click Forgot Password.");
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
      console.error('Failed to log in', e);
    }
  };

  const handleAddExplorer = async () => {
    setFormError('');
    if (!newExplorerNameInput.trim()) {
      Alert.alert("⚠️ Error", "Please enter an explorer (kid) name.");
      return;
    }

    const cleanKidName = newExplorerNameInput.trim();

    try {
      const listStr = await AsyncStorage.getItem(getExplorerListKey(activeParentEmail));
      let explorers = listStr ? JSON.parse(listStr) : [];

      if (explorers.includes(cleanKidName)) {
        Alert.alert("⚠️ Warning", "An explorer with this name already exists under your account!");
        return;
      }

      explorers.push(cleanKidName);
      await AsyncStorage.setItem(getExplorerListKey(activeParentEmail), JSON.stringify(explorers));

      setNewExplorerNameInput('');
      setExplorerModalVisible(false);

      await handleSelectExplorer(cleanKidName);
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

  const handleSendResetCode = async () => {
    setResetError('');
    if (!resetEmailInput.trim()) {
      setResetError("⚠️ Please enter your registered email address.");
      return;
    }
    const cleanEmail = resetEmailInput.trim().toLowerCase();

    try {
      const savedPassword = await AsyncStorage.getItem(`@phonixia_pass_${cleanEmail}`);
      if (!savedPassword) {
        setResetError("⚠️ No account found with this email address.");
        return;
      }

      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedCode(generatedCode);
      setResetStep(2);
      
      Alert.alert(
        "🔑 Verification Code Generated!",
        `No external email required! Your 4-digit security code for ${cleanEmail} is:\n\n✨ ${generatedCode} ✨\n\nEnter this code below to reset your password.`
      );
    } catch (e) {
      console.error('Failed to process reset request', e);
    }
  };

  const handleVerifyAndResetPassword = async () => {
    setResetError('');
    if (!enteredCodeInput.trim() || !newPasswordInput.trim()) {
      setResetError("⚠️ Please fill in both the code and your new password.");
      return;
    }

    if (enteredCodeInput.trim() !== simulatedCode) {
      setResetError("⚠️ Invalid verification code. Please check your secure code.");
      return;
    }

    const passwordError = checkPasswordValidity(newPasswordInput);
    if (passwordError) {
      setResetError(passwordError);
      return;
    }

    const cleanEmail = resetEmailInput.trim().toLowerCase();

    try {
      await AsyncStorage.setItem(`@phonixia_pass_${cleanEmail}`, newPasswordInput.trim());
      Alert.alert("🎉 Password Reset Successful!", "Your master account is secure with your new password. You can now log in!");
      
      setForgotModalVisible(false);
      setResetStep(1);
      setResetEmailInput('');
      setEnteredCodeInput('');
      setNewPasswordInput('');
      setResetError('');
      setIsLoginMode(true);
    } catch (e) {
      console.error('Failed to update password', e);
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
      setInputPassword('');
      setFormError('');
      setInputEmail('');
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  const isLandUnlocked = (landKey) => {
    return true; // 🔓 UNLOCKED FOR TESTING: All lands open immediately!
  };

  const getLandTotalScore = (landGamesObj) => {
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
      sum += (landGamesObj[`game${i}`] || 0);
    }
    return sum;
  };

  const handleLandPress = (landKey, landName) => {
    if (isLandUnlocked(landKey)) {
      setCurrentLand(landKey);
    } else {
      Alert.alert(
        "🔒 Land Locked!",
        `You have to unlock the land to explore! Complete all 6 games up to Level 25 in the previous region before you can step foot into ${landName}.`
      );
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

  // --- 1. PARENT AUTHENTICATION SCREEN ---
  if (!activeParentEmail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authContainer}>
          <Text style={styles.authEmoji}>👦👧🗺️</Text>
          <Text style={styles.authTitle}>Phonixia</Text>
          <Text style={styles.authSubtitle}>
            {isLoginMode 
              ? "Welcome back! Enter your parent account credentials to access your kids' profiles:" 
              : "Join Explorer Kam and Celine on their quest! Create your parent master account below:"}
          </Text>

          {formError ? <Text style={styles.errorBanner}>{formError}</Text> : null}

          <TextInput
            style={styles.textInput}
            placeholder="Parent Email Address..."
            placeholderTextColor="#8d99ae"
            value={inputEmail}
            onChangeText={setInputEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Password..."
            placeholderTextColor="#8d99ae"
            value={inputPassword}
            onChangeText={setInputPassword}
            secureTextEntry={true}
            maxLength={20}
          />

          {isLoginMode && (
            <TouchableOpacity 
              style={styles.rememberRow} 
              onPress={async () => {
                const nextVal = !rememberMe;
                setRememberMe(nextVal);
                if (!nextVal) {
                  await AsyncStorage.removeItem('@phonixia_remembered_email');
                }
              }}
            >
              <View style={[styles.checkboxBox, rememberMe && styles.checkboxBoxChecked]}>
                {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.authButton} 
            onPress={isLoginMode ? handleLogin : handleSignUp}
          >
            <Text style={styles.authButtonText}>
              {isLoginMode ? "🔑 Log In" : "⚔️ Join Quest (Sign Up)"}
            </Text>
          </TouchableOpacity>

          {isLoginMode && (
            <TouchableOpacity 
              style={styles.forgotToggle} 
              onPress={() => { setForgotModalVisible(true); setResetStep(1); setResetEmailInput(''); setResetError(''); }}
            >
              <Text style={styles.forgotToggleText}>Forgot Password / Change Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.switchAuthToggle} 
            onPress={() => {
              const nextMode = !isLoginMode;
              setIsLoginMode(nextMode);
              setInputPassword('');
              setFormError('');
            }}
          >
            <Text style={styles.switchAuthText}>
              {isLoginMode ? "Need an account? Join Quest (Sign Up)" : "Already have an account? Log In"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={forgotModalVisible}
          onRequestClose={() => setForgotModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🔐 Secure Password Reset</Text>
              {resetError ? <Text style={styles.errorBanner}>{resetError}</Text> : null}
              {resetStep === 1 ? (
                <>
                  <Text style={styles.modalSubtitle}>Enter your parent email address to generate an on-screen verification code.</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your Email Address..."
                    placeholderTextColor="#8d99ae"
                    value={resetEmailInput}
                    onChangeText={setResetEmailInput}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TouchableOpacity style={styles.authButton} onPress={handleSendResetCode}>
                    <Text style={styles.authButtonText}>🔑 Generate Reset Code</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalSubtitle}>Enter the 4-digit code shown in your popup notice and create a secure new password:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="4-Digit Code..."
                    placeholderTextColor="#8d99ae"
                    value={enteredCodeInput}
                    onChangeText={setEnteredCodeInput}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="New Secure Password..."
                    placeholderTextColor="#8d99ae"
                    value={newPasswordInput}
                    onChangeText={setNewPasswordInput}
                    secureTextEntry={true}
                    maxLength={20}
                  />
                  <TouchableOpacity style={styles.authButton} onPress={handleVerifyAndResetPassword}>
                    <Text style={styles.authButtonText}>🔒 Reset & Secure Account</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setForgotModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- 2. SELECT OR CREATE EXPLORER (KID) PROFILE SCREEN ---
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
        />
      </SafeAreaView>
    );
  }

  // --- 3. ACTIVE LAND ROUTING ---
  if (currentLand !== 'map' && landComponents[currentLand]) {
    const ActiveLandComponent = landComponents[currentLand];
    return (
      <ActiveLandComponent 
        username={currentExplorer} 
        email={activeParentEmail} 
        onScoreUpdate={handleScoreUpdateLive} 
        onBack={async () => { 
          setCurrentLand('map'); 
          if (activeParentEmail && currentExplorer) {
            await loadUserData(activeParentEmail, currentExplorer);
          }
        }} 
      />
    );
  }

  // --- 4. WORLD MAP WITH LOCK SYSTEM ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('./phonixia_world_map.png')} 
        style={styles.mapBackground}
        resizeMode="stretch"
      >
        <View style={styles.mapContainer}>
          <TouchableOpacity 
            style={[styles.mapNode, { top: '22%', left: '18%' }]} 
            onPress={() => handleLandPress('buildersGuild', 'Builders Guild')}
          >
            <View style={[styles.nodeIconCircle, !isLandUnlocked('buildersGuild') && styles.lockedNodeCircle]}>
              <Text style={styles.nodeEmoji}>{isLandUnlocked('buildersGuild') ? '🧱' : '🔒'}</Text>
            </View>
            <Text style={styles.nodeLabel}>Builders Guild</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '23%', right: '18%' }]} 
            onPress={() => handleLandPress('whisperingPeaks', 'Whispering Peaks')}
          >
            <View style={[styles.nodeIconCircle, !isLandUnlocked('whisperingPeaks') && styles.lockedNodeCircle]}>
              <Text style={styles.nodeEmoji}>{isLandUnlocked('whisperingPeaks') ? '⛰️' : '🔒'}</Text>
            </View>
            <Text style={styles.nodeLabel}>Whispering Peaks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '38%', left: '46%' }]} 
            onPress={() => handleLandPress('soundShallows', 'Sound Shallows')}
          >
            <View style={[styles.nodeIconCircle, styles.activeNodeCircle]}>
              <Text style={styles.nodeEmoji}>🌊</Text>
            </View>
            <Text style={styles.nodeLabel}>Sound Shallows</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '63%', left: '6.5%' }]} 
            onPress={async () => {
              if (activeParentEmail && currentExplorer) {
                await loadUserData(activeParentEmail, currentExplorer);
              }
              setProfileVisible(true);
            }}
          >
            <View style={[styles.nodeIconCircle, styles.profileNodeCircle]}>
              <Text style={styles.nodeEmoji}>🏠</Text>
            </View>
            <Text style={styles.nodeLabel}>Explorer Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '84%', left: '12%' }]} 
            onPress={() => handleLandPress('shellshoreArcade', 'Shellshore Arcade')}
          >
            <View style={[styles.nodeIconCircle, styles.arcadeNodeCircle]}>
              <Text style={styles.nodeEmoji}>🐚</Text>
            </View>
            <Text style={styles.nodeLabel}>Shellshore Arcade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { top: '49%', left: '15.5%' }]} 
            onPress={() => handleLandPress('islesOfPlay', 'Isles of Play')}
          >
            <View style={[styles.nodeIconCircle, styles.islesNodeCircle]}>
              <Text style={styles.nodeEmoji}>🏝️</Text>
            </View>
            <Text style={styles.nodeLabel}>Isles of Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { bottom: '18%', left: '45%' }]} 
            onPress={() => handleLandPress('trickyTrails', 'Tricky Trails')}
          >
            <View style={[styles.nodeIconCircle, !isLandUnlocked('trickyTrails') && styles.lockedNodeCircle]}>
              <Text style={styles.nodeEmoji}>{isLandUnlocked('trickyTrails') ? '🌲' : '🔒'}</Text>
            </View>
            <Text style={styles.nodeLabel}>Tricky Trails</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.mapNode, { bottom: '26%', right: '18%' }]} 
            onPress={() => handleLandPress('lexiconEmpire', 'Lexicon Empire')}
          >
            <View style={[styles.nodeIconCircle, !isLandUnlocked('lexiconEmpire') && styles.lockedNodeCircle]}>
              <Text style={styles.nodeEmoji}>{isLandUnlocked('lexiconEmpire') ? '🏛️' : '🔒'}</Text>
            </View>
            <Text style={styles.nodeLabel}>Lexicon Empire</Text>
          </TouchableOpacity>
        </View>
            
        <Modal
          animationType="fade"
          transparent={true}
          visible={profileVisible}
          onRequestClose={() => setProfileVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🛡️ Explorer Home</Text>
              <Text style={styles.modalSubtitle}>Current Explorer & Land Scores</Text>

              <ScrollView style={styles.profileScrollBox} showsVerticalScrollIndicator={false}>
                <Text style={styles.profileHeroName}>✨ Explorer {currentExplorer}</Text>
                
                <TouchableOpacity 
                  style={styles.switchExplorerButton} 
                  onPress={() => { setProfileVisible(false); setCurrentExplorer(''); }}
                >
                  <Text style={styles.switchExplorerButtonText}>👥 Switch / Add Explorer Kid</Text>
                </TouchableOpacity>

                <View style={styles.statSummaryCard}>
                  <Text style={styles.summaryText}>⭐ Total Combined Score: <Text style={styles.highlightNum}>{totalScore}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🌊 Sound Shallows</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.soundShallows)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🏝️ Isles of Play</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.islesOfPlay)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🐚 Shellshore Arcade</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.shellshoreArcade)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🧱 Builders Guild</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.buildersGuild)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🌲 Tricky Trails</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.trickyTrails)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>⛰️ Whispering Peaks</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.whisperingPeaks)}</Text></Text>
                </View>

                <View style={styles.landStatBox}>
                  <Text style={styles.landRowHeader}>🏛️ Lexicon Empire</Text>
                  <Text style={styles.scoreRowText}>Score: <Text style={styles.highlightNum}>{getLandTotalScore(landProgress.lexiconEmpire)}</Text></Text>
                </View>
              </ScrollView>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.switchButton} onPress={handleLogout}>
                  <Text style={styles.switchButtonText}>🚪 Log Out Parent</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setProfileVisible(false)}>
                  <Text style={styles.closeButtonText}>Close Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

function ExplorerSelectorScreen({ parentEmail, onSelectExplorer, onOpenAddModal, onLogout, explorerModalVisible, setExplorerModalVisible, newExplorerNameInput, setNewExplorerNameInput, handleAddExplorer }) {
  const [explorers, setExplorers] = useState([]);

  useEffect(() => {
    loadExplorers();
  }, []);

  const loadExplorers = async () => {
    try {
      const listStr = await AsyncStorage.getItem(`@phonixia_explorers_${parentEmail.trim().toLowerCase()}`);
      if (listStr) {
        setExplorers(JSON.parse(listStr));
      }
    } catch (e) {
      console.error('Failed to load explorer list', e);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authEmoji}>👨‍👩‍👧‍👦</Text>
      <Text style={styles.authTitle}>Who is Exploring?</Text>
      <Text style={styles.authSubtitle}>Select an explorer profile or add a new kid profile under your parent account:</Text>

      <ScrollView style={{ width: '100%', maxHeight: 250, marginBottom: 15 }} showsVerticalScrollIndicator={false}>
        {explorers.length === 0 ? (
          <Text style={{ color: '#8d99ae', textAlign: 'center', fontStyle: 'italic', marginVertical: 20 }}>No explorers added yet. Add your first kid profile below!</Text>
        ) : (
          explorers.map((name, index) => (
            <TouchableOpacity key={index} style={styles.explorerCard} onPress={() => onSelectExplorer(name)}>
              <Text style={styles.explorerCardText}>✨ {name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.authButton} onPress={onOpenAddModal}>
        <Text style={styles.authButtonText}>➕ Add New Explorer Kid</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.closeButton, { marginTop: 10 }]} onPress={onLogout}>
        <Text style={styles.closeButtonText}>🚪 Log Out Parent</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={explorerModalVisible}
        onRequestClose={() => setExplorerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👶 Add Explorer Kid</Text>
            <Text style={styles.modalSubtitle}>Enter your child's name or nickname for this profile:</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Explorer Name..."
              placeholderTextColor="#8d99ae"
              value={newExplorerNameInput}
              onChangeText={setNewExplorerNameInput}
            />

            <TouchableOpacity style={styles.authButton} onPress={handleAddExplorer}>
              <Text style={styles.authButtonText}>✨ Save & Start Exploring</Text>
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
  safeArea: { flex: 1, backgroundColor: '#0b090a' },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#1b263b' },
  authEmoji: { fontSize: 48, marginBottom: 10 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
  authSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
  errorBanner: { backgroundColor: '#7f1d1d', color: '#fca5a5', padding: 10, borderRadius: 8, textAlign: 'center', marginBottom: 15, fontSize: 13, width: '100%', fontWeight: 'bold' },
  textInput: { width: '100%', height: 48, backgroundColor: '#0d1b2a', borderWidth: 1, borderColor: '#415a77', borderRadius: 10, paddingHorizontal: 15, color: '#fff', marginBottom: 14, fontSize: 15 },
  authButton: { width: '100%', height: 48, backgroundColor: '#4361ee', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 4, elevation: 3 },
  authButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 12 },
  checkboxBox: { width: 20, height: 20, borderWidth: 2, borderColor: '#415a77', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: '#0d1b2a' },
  checkboxBoxChecked: { backgroundColor: '#4361ee', borderColor: '#4361ee' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  rememberText: { color: '#cbd5e1', fontSize: 14 },
  forgotToggle: { marginTop: 12 },
  forgotToggleText: { color: '#48cae4', fontSize: 14, fontWeight: '600' },
  switchAuthToggle: { marginTop: 16 },
  switchAuthText: { color: '#94a3b8', fontSize: 14, textDecorationLine: 'underline' },
  mapBackground: { flex: 1, width: '100%', height: '100%' },
  mapContainer: { flex: 1, position: 'relative' },
  mapNode: { position: 'absolute', alignItems: 'center' },
  nodeIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1d3557', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff', elevation: 5 },
  lockedNodeCircle: { backgroundColor: '#475569', borderColor: '#94a3b8' },
  activeNodeCircle: { backgroundColor: '#e63946' },
  profileNodeCircle: { backgroundColor: '#2a9d8f' },
  arcadeNodeCircle: { backgroundColor: '#f4a261' },
  islesNodeCircle: { backgroundColor: '#3a86ff' },
  nodeEmoji: { fontSize: 20 },
  nodeLabel: { marginTop: 4, color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 380, backgroundColor: '#1b263b', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#415a77' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 16 },
  profileScrollBox: { width: '100%', maxHeight: 320, marginBottom: 15 },
  profileHeroName: { fontSize: 18, fontWeight: 'bold', color: '#48cae4', textAlign: 'center', marginBottom: 12 },
  switchExplorerButton: { backgroundColor: '#3a86ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'center', marginBottom: 15 },
  switchExplorerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  statSummaryCard: { backgroundColor: '#0d1b2a', padding: 12, borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: '#48cae4' },
  summaryText: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  highlightNum: { color: '#4ade80', fontSize: 16 },
  landStatBox: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  lockedLandBox: { opacity: 0.6 },
  landRowHeader: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  scoreRowText: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5 },
  switchButton: { backgroundColor: '#e63946', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  switchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  closeButton: { backgroundColor: '#475569', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, flex: 1, marginLeft: 8, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  explorerCard: { backgroundColor: '#0d1b2a', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#415a77', alignItems: 'center' },
  explorerCardText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
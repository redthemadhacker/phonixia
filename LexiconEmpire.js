import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function BuildersGuild({ onBack }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>⬅️ Map</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🧱 Builders Guild</Text>
          <Text style={styles.subtitle}>Quest coming soon!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#132A13' },
  scrollContent: { padding: 20, alignItems: 'center', flexGrow: 1 },
  header: { width: '100%', alignItems: 'center', marginBottom: 20 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#1b4332', padding: 8, borderRadius: 12, marginBottom: 10 },
  backButtonText: { color: '#90E0EF', fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: '900', color: '#90E0EF', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#D8F3DC', fontWeight: '600' },
});
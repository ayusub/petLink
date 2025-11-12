import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenProps {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function WelcomeScreen({ fadeAnim, slideAnim, onGetStarted, onLogin }: WelcomeScreenProps) {
  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🐾</Text>
          <Text style={styles.logoText}>PetLink</Text>
          <Text style={styles.tagline}>Find trusted pet care in your community</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onLogin} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logoEmoji: { fontSize: 80, marginBottom: 10 },
  logoText: { fontSize: 56, fontWeight: 'bold', color: 'white' },
  tagline: { fontSize: 18, textAlign: 'center', color: 'white', marginBottom: 50, paddingHorizontal: 20, opacity: 0.9 },
  buttonGroup: { width: '100%', gap: 15 },
  primaryButton: { width: '100%', borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  gradientButton: { padding: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

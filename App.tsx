import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import WelcomeScreen from './screens/WelcomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import MessagesScreen from './screens/MessagesScreen';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  user_type: 'owner' | 'caregiver' | null;
  verified: boolean;
}

interface Message {
  id: string;
  caregiverId: string;
  caregiverName: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const MESSAGES_STORAGE_KEY = '@petlink_messages';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [allCaregivers, setAllCaregivers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [userType, setUserType] = useState<'owner' | 'caregiver'>('owner');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Load messages from storage on mount
  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentScreen]);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const addMessage = (caregiver: any) => {
    const existingMessage = messages.find(m => m.caregiverId === caregiver.id);
    
    if (existingMessage) {
      // Update existing message
      const updated = messages.map(m => 
        m.caregiverId === caregiver.id 
          ? { ...m, lastMessage: "You matched! Start the conversation 💚", timestamp: new Date(), unread: true }
          : m
      );
      setMessages(updated);
      saveMessages(updated);
    } else {
      // Add new message
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        caregiverId: caregiver.id,
        caregiverName: caregiver.profiles?.full_name || 'Caregiver',
        lastMessage: "You matched! Start the conversation 💚",
        timestamp: new Date(),
        unread: true,
      };
      const updated = [newMessage, ...messages];
      setMessages(updated);
      saveMessages(updated);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      
      if (data && data.user_type) {
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadCaregivers = async () => {
    try {
      const { data, error } = await supabase
        .from('caregiver_profiles')
        .select(`
          *,
          profiles (
            id,
            full_name,
            bio,
            verified
          )
        `)
        .limit(20);

      if (error) throw error;
      setAllCaregivers(data || []);
    } catch (error) {
      console.error('Error loading caregivers:', error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          setErrorMessage('This email is already registered. Please log in instead.');
          Alert.alert('Account Exists', 'This email is already registered. Please log in instead.');
          return;
        }
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: fullName,
              phone: phone,
              zip_code: zipCode,
              user_type: userType,
            },
          ]);

        if (profileError) {
          // Check if it's a duplicate key error (user already has profile)
          if (profileError.message.includes('duplicate key')) {
            setErrorMessage('This email is already registered. Please log in instead.');
            Alert.alert('Account Exists', 'This email is already registered. Please log in instead.');
            return;
          }
          throw profileError;
        }

        // Load the user profile
        await loadUserProfile(data.user.id);
        
        // Navigate to dashboard immediately
        setCurrentScreen('dashboard');
        
        // Show success message
        setTimeout(() => {
          Alert.alert('Welcome!', `Account created successfully! Welcome to PetLink, ${fullName}! 🐾`);
        }, 500);
      }
    } catch (error: any) {
      // User-friendly error messages
      let errorMsg = error.message;
      
      if (errorMsg.includes('already registered') || errorMsg.includes('already been registered')) {
        errorMsg = 'This email is already registered. Please log in instead.';
      } else if (errorMsg.includes('Password should be')) {
        errorMsg = 'Password must be at least 6 characters long.';
      } else if (errorMsg.includes('Invalid email')) {
        errorMsg = 'Please enter a valid email address.';
      }
      
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Incorrect email or password. Please try again.');
          Alert.alert('Login Failed', 'Incorrect email or password. Please try again.');
          return;
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please check your email and verify your account before logging in.');
          Alert.alert('Email Not Verified', 'Please check your email and verify your account before logging in.');
          return;
        }
        throw error;
      }

      // Success - auth state listener will handle navigation
    } catch (error: any) {
      // User-friendly error messages
      let errorMsg = error.message;
      
      if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Invalid email or password')) {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else if (errorMsg.includes('Email not confirmed')) {
        errorMsg = 'Please verify your email before logging in.';
      } else if (errorMsg.includes('too many requests')) {
        errorMsg = 'Too many login attempts. Please wait a moment and try again.';
      }
      
      setErrorMessage(errorMsg);
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentScreen('welcome');
  };

  const handleMatch = (caregiver: any) => {
    addMessage(caregiver);
  };

  const handlePass = (caregiver: any) => {
    console.log('Passed on:', caregiver.profiles?.full_name);
  };

  const handleMessagePress = (message: Message) => {
    // Mark as read
    const updated = messages.map(m => 
      m.id === message.id ? { ...m, unread: false } : m
    );
    setMessages(updated);
    saveMessages(updated);
    
    Alert.alert(
      message.caregiverName,
      'Chat feature coming soon! For now, you can see who you matched with.',
      [{ text: 'OK' }]
    );
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        onGetStarted={() => setCurrentScreen('signup')}
        onLogin={() => setCurrentScreen('login')}
      />
    );
  }

  // Sign Up Screen
  if (currentScreen === 'signup') {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientContainer}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('welcome')}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.headerWhite}>Create Account</Text>
            
            <View style={styles.card}>
              <Text style={styles.subheader}>I am a...</Text>
              
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, userType === 'owner' && styles.toggleButtonActive]}
                  onPress={() => setUserType('owner')}
                >
                  <Text style={[styles.toggleButtonText, userType === 'owner' && styles.toggleButtonTextActive]}>
                    Pet Owner
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, userType === 'caregiver' && styles.toggleButtonActive]}
                  onPress={() => setUserType('caregiver')}
                >
                  <Text style={[styles.toggleButtonText, userType === 'caregiver' && styles.toggleButtonTextActive]}>
                    Caregiver
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.modernInput}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrorMessage('');
                }}
              />
              <TextInput
                style={styles.modernInput}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.modernInput}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                style={styles.modernInput}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.modernInput}
                placeholder="Zip Code"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={zipCode}
                onChangeText={setZipCode}
              />

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>❌ {errorMessage}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={loading}>
                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientButton}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Create Account</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Login Screen
  if (currentScreen === 'login') {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <TouchableOpacity
              style={[styles.backButton, { position: 'absolute', top: 20, left: 20 }]}
              onPress={() => setCurrentScreen('welcome')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.logoEmoji}>🐾</Text>
            <Text style={styles.headerWhite}>Welcome Back!</Text>
            
            <View style={styles.card}>
              <TextInput
                style={styles.modernInput}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.modernInput}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage('');
                }}
                autoCapitalize="none"
              />

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>❌ {errorMessage}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.gradientButton}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Log In</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Dashboard Screen
  if (currentScreen === 'dashboard') {
    if (allCaregivers.length === 0) {
      loadCaregivers();
    }

    return (
      <DashboardScreen
        allCaregivers={allCaregivers}
        onMessagesPress={() => setCurrentScreen('messages')}
        onProfilePress={() => setCurrentScreen('profile')}
        onMatch={handleMatch}
        onPass={handlePass}
      />
    );
  }

  // Messages Screen
  if (currentScreen === 'messages') {
    return (
      <MessagesScreen
        messages={messages}
        onBack={() => setCurrentScreen('dashboard')}
        onMessagePress={handleMessagePress}
      />
    );
  }

  // Profile Screen
  if (currentScreen === 'profile') {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileAvatar}>👤</Text>
                <Text style={styles.profileName}>{user?.full_name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                {user?.verified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
              </View>

              <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }]} onPress={handleSignOut}>
                <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Log Out</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  logoEmoji: { fontSize: 80, marginBottom: 10 },
  headerWhite: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: 'white' },
  buttonGroup: { width: '100%', gap: 15 },
  primaryButton: { width: '100%', borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  gradientButton: { padding: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  backButton: { marginBottom: 20 },
  backButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 25, width: '100%' },
  subheader: { fontSize: 18, marginBottom: 15, fontWeight: '600', color: '#333' },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 4,
  },
  toggleButton: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#667eea' },
  toggleButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
  toggleButtonTextActive: { color: 'white' },
  modernInput: {
    backgroundColor: '#f8f9fa',
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 0,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  profileAvatar: { fontSize: 80, marginBottom: 15 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  profileEmail: { fontSize: 16, color: '#666', marginBottom: 10 },
  verifiedBadge: { fontSize: 16, color: '#4ECDC4', fontWeight: 'bold' },
});
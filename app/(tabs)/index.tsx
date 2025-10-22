import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userType, setUserType] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Welcome/Landing Screen
  if (currentScreen === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.logo}>🐾 PetLink</Text>
          <Text style={styles.tagline}>
            Connect with trusted pet care in your community
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('signup')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setCurrentScreen('login')}
            >
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Sign Up Screen
  if (currentScreen === 'signup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Create Your Account</Text>
          <Text style={styles.subheader}>I am a...</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                userType === 'owner' && styles.choiceButtonSelected,
              ]}
              onPress={() => setUserType('owner')}
            >
              <Text style={styles.choiceButtonText}>Pet Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                userType === 'caregiver' && styles.choiceButtonSelected,
              ]}
              onPress={() => setUserType('caregiver')}
            >
              <Text style={styles.choiceButtonText}>Caregiver</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('petProfile')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setCurrentScreen('welcome')}>
            <Text style={styles.linkText}>Back to Welcome</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Login Screen
  if (currentScreen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.header}>Welcome Back!</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('dashboard')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('welcome')}>
            <Text style={styles.linkText}>Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Pet Profile Setup (for owners)
  if (currentScreen === 'petProfile') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Tell Us About Your Pet</Text>
          <TextInput
            style={styles.input}
            placeholder="Pet's Name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Special needs or notes"
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('dashboard')}
          >
            <Text style={styles.buttonText}>Complete Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Dashboard
  if (currentScreen === 'dashboard') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardTitle}>🐾 PetLink</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>What do you need?</Text>
          
          <View style={styles.serviceGrid}>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService('sitting');
                setCurrentScreen('discovery');
              }}
            >
              <Text style={styles.serviceIcon}>🏠</Text>
              <Text style={styles.serviceText}>Pet Sitting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService('walking');
                setCurrentScreen('discovery');
              }}
            >
              <Text style={styles.serviceIcon}>🚶</Text>
              <Text style={styles.serviceText}>Dog Walking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService('grooming');
                setCurrentScreen('discovery');
              }}
            >
              <Text style={styles.serviceIcon}>✂️</Text>
              <Text style={styles.serviceText}>Grooming</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService('playdate');
                setCurrentScreen('discovery');
              }}
            >
              <Text style={styles.serviceIcon}>🎾</Text>
              <Text style={styles.serviceText}>Playdate</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentScreen('messages')}
          >
            <Text style={styles.secondaryButtonText}>📬 My Messages</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Discovery/Search Screen
  if (currentScreen === 'discovery') {
    const mockCaregivers = [
      {
        name: 'Sarah M.',
        rating: '4.8 ⭐',
        distance: '0.8 mi away',
        availability: 'Available Today',
        verified: true,
      },
      {
        name: 'James K.',
        rating: '4.9 ⭐',
        distance: '1.2 mi away',
        availability: 'Available Tomorrow',
        verified: true,
      },
      {
        name: 'Emily R.',
        rating: '4.7 ⭐',
        distance: '1.5 mi away',
        availability: 'Weekends Only',
        verified: false,
      },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>
            {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Nearby Caregivers</Text>

          {mockCaregivers.map((caregiver, index) => (
            <View key={index} style={styles.caregiverCard}>
              <View style={styles.caregiverHeader}>
                <Text style={styles.caregiverName}>
                  {caregiver.name}
                  {caregiver.verified && ' ✓'}
                </Text>
                <Text style={styles.caregiverRating}>{caregiver.rating}</Text>
              </View>
              <Text style={styles.caregiverInfo}>{caregiver.distance}</Text>
              <Text style={styles.caregiverAvailability}>
                {caregiver.availability}
              </Text>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => {
                  setCurrentScreen('caregiverProfile');
                }}
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Caregiver Profile Screen
  if (currentScreen === 'caregiverProfile') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('discovery')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={styles.profileName}>Sarah M. ✓</Text>
            <Text style={styles.profileRating}>4.8 ⭐ (24 reviews)</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>About</Text>
            <Text style={styles.infoText}>
              Experienced pet sitter with 3 years caring for dogs and cats.
              Love outdoor walks and playtime!
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Services Offered</Text>
            <Text style={styles.infoText}>
              • Pet Sitting • Dog Walking • Playdates
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Availability</Text>
            <Text style={styles.infoText}>
              Mon-Fri: 5pm-8pm | Weekends: Flexible
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('booking')}
          >
            <Text style={styles.buttonText}>Request Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentScreen('messages')}
          >
            <Text style={styles.secondaryButtonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Booking Request Screen
  if (currentScreen === 'booking') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('caregiverProfile')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>Book Service</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Booking with Sarah M.</Text>

          <TextInput
            style={styles.input}
            placeholder="Select Date (MM/DD/YYYY)"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Start Time"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Duration (hours)"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Special requests or notes"
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxText}>
              ☐ Request meet-and-greet first
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('bookingConfirm')}
          >
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Booking Confirmation
  if (currentScreen === 'bookingConfirm') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.header}>Request Sent!</Text>
          <Text style={styles.infoText}>
            Sarah M. has been notified of your booking request. You'll receive a
            message when they respond.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('dashboard')}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentScreen('messages')}
          >
            <Text style={styles.secondaryButtonText}>View Messages</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Messages Screen
  if (currentScreen === 'messages') {
    const mockMessages = [
      { from: 'Sarah M.', preview: 'Sounds good! What time works...', time: '2m ago' },
      { from: 'James K.', preview: 'Thanks for the booking!', time: '1h ago' },
      { from: 'Emily R.', preview: 'Is your dog friendly with...', time: '3h ago' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>Messages</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mockMessages.map((msg, index) => (
            <TouchableOpacity
              key={index}
              style={styles.messageCard}
              onPress={() => setCurrentScreen('chat')}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageName}>{msg.from}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
              <Text style={styles.messagePreview}>{msg.preview}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Chat Screen
  if (currentScreen === 'chat') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('messages')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>Sarah M.</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.chatContent}>
          <View style={styles.chatBubbleOther}>
            <Text style={styles.chatText}>
              Hi! I'd love to help with your dog sitting needs.
            </Text>
          </View>
          <View style={styles.chatBubbleMe}>
            <Text style={styles.chatTextMe}>
              Great! Are you available this Friday evening?
            </Text>
          </View>
          <View style={styles.chatBubbleOther}>
            <Text style={styles.chatText}>
              Yes, I'm free after 5pm. Would you like to do a meet-and-greet first?
            </Text>
          </View>
        </ScrollView>

        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Profile Screen
  if (currentScreen === 'profile') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.verifiedBadge}>✓ Verified</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>My Pets</Text>
            <View style={styles.petCard}>
              <Text style={styles.petName}>🐕 Max (Golden Retriever, 3)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setCurrentScreen('welcome')}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  choiceButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  choiceButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  choiceButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    fontSize: 28,
  },
  backButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  caregiverCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caregiverRating: {
    fontSize: 16,
  },
  caregiverInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  caregiverAvailability: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 10,
  },
  viewProfileButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    color: 'white',
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    fontSize: 80,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileRating: {
    fontSize: 16,
    color: '#666',
  },
  verifiedBadge: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxContainer: {
    marginVertical: 15,
  },
  checkboxText: {
    fontSize: 16,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 14,
    color: '#999',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 100,
  },
  chatBubbleOther: {
    backgroundColor: '#E5E5EA',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  chatBubbleMe: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatText: {
    fontSize: 16,
    color: '#000',
  },
  chatTextMe: {
    fontSize: 16,
    color: 'white',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  petCard: {
    backgroundColor: '#F5F5F7',
    padding: 12,
    borderRadius: 10,
  },
  petName: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
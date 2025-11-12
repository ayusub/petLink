import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-deck-swiper';

const SERVICE_FILTERS = [
  { id: 'all', name: 'All', icon: '🐾' },
  { id: 'Pet Sitting', name: 'Sitting', icon: '🏠' },
  { id: 'Dog Walking', name: 'Walking', icon: '🚶' },
  { id: 'Grooming', name: 'Grooming', icon: '✂️' },
  { id: 'Playdates', name: 'Playdate', icon: '🎾' },
];

interface DashboardScreenProps {
  allCaregivers: any[];
  onMessagesPress: () => void;
  onProfilePress: () => void;
  onMatch: (caregiver: any) => void;
  onPass: (caregiver: any) => void;
}

export default function DashboardScreen({
  allCaregivers,
  onMessagesPress,
  onProfilePress,
  onMatch,
  onPass,
}: DashboardScreenProps) {
  const [selectedService, setSelectedService] = useState('all');
  const [filteredCaregivers, setFilteredCaregivers] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (selectedService === 'all') {
      setFilteredCaregivers(allCaregivers);
    } else {
      const filtered = allCaregivers.filter(
        (c) => c.services && c.services.includes(selectedService)
      );
      setFilteredCaregivers(filtered);
    }
    setCardIndex(0);
  }, [selectedService, allCaregivers]);

  const handleSwipedRight = (index: number) => {
    const caregiver = filteredCaregivers[index];
    onMatch(caregiver);
    Alert.alert('Match! 💚', `You matched with ${caregiver?.profiles?.full_name}!`);
  };

  const handleSwipedLeft = (index: number) => {
    const caregiver = filteredCaregivers[index];
    onPass(caregiver);
  };

  const handleSwipedAll = () => {
    Alert.alert('All Done!', 'No more caregivers to show. Check back later!');
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🐾 PetLink</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={onMessagesPress}>
              <Text style={styles.iconButtonText}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
              <Text style={styles.iconButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabsContainer}
          contentContainerStyle={styles.filterTabsContent}
        >
          {SERVICE_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterTab, selectedService === filter.id && styles.filterTabActive]}
              onPress={() => setSelectedService(filter.id)}
            >
              <Text style={styles.filterTabEmoji}>{filter.icon}</Text>
              <Text
                style={[
                  styles.filterTabText,
                  selectedService === filter.id && styles.filterTabTextActive,
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.swiperContainer}>
          {filteredCaregivers.length > 0 ? (
            <Swiper
              ref={swiperRef}
              cards={filteredCaregivers}
              renderCard={(card) => {
                if (!card) return null;
                return (
                  <View style={styles.card}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.cardGradient}>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardName}>
                          {card.profiles?.full_name || 'Anonymous'}
                          {card.profiles?.verified && ' ✓'}
                        </Text>
                        <Text style={styles.cardRating}>
                          ⭐ {card.rating?.toFixed(1)} ({card.total_reviews} reviews)
                        </Text>
                        <Text style={styles.cardBio}>{card.profiles?.bio || 'No bio available'}</Text>
                        <View style={styles.servicesContainer}>
                          {card.services?.slice(0, 3).map((service: string, idx: number) => (
                            <View key={idx} style={styles.serviceTag}>
                              <Text style={styles.serviceTagText}>{service}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                );
              }}
              onSwipedRight={handleSwipedRight}
              onSwipedLeft={handleSwipedLeft}
              onSwipedAll={handleSwipedAll}
              cardIndex={cardIndex}
              onSwiped={(index) => setCardIndex(index + 1)}
              backgroundColor="transparent"
              stackSize={3}
              stackSeparation={15}
              overlayLabels={{
                left: {
                  title: 'PASS',
                  style: {
                    label: {
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 'bold',
                      padding: 10,
                      borderRadius: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: -30,
                    },
                  },
                },
                right: {
                  title: 'MATCH',
                  style: {
                    label: {
                      backgroundColor: '#4ECDC4',
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 'bold',
                      padding: 10,
                      borderRadius: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30,
                    },
                  },
                },
              }}
              animateCardOpacity
              verticalSwipe={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedService === 'all'
                  ? 'Loading caregivers...'
                  : `No caregivers offering ${selectedService} right now`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.passButton} onPress={() => swiperRef.current?.swipeLeft()}>
            <Text style={styles.actionButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.matchButton} onPress={() => swiperRef.current?.swipeRight()}>
            <Text style={styles.actionButtonText}>❤️</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: { fontSize: 24 },
  filterTabsContainer: { maxHeight: 70, marginBottom: 10 },
  filterTabsContent: { paddingHorizontal: 15, gap: 10 },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  filterTabActive: { backgroundColor: '#667eea' },
  filterTabEmoji: { fontSize: 20, marginRight: 8 },
  filterTabText: { fontSize: 16, fontWeight: '600', color: '#666' },
  filterTabTextActive: { color: 'white' },
  swiperContainer: { flex: 1, paddingHorizontal: 10 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 25, width: '100%' },
  cardGradient: { flex: 1, borderRadius: 30, padding: 30, justifyContent: 'flex-end' },
  cardContent: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 20, padding: 20 },
  cardName: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardRating: { fontSize: 16, color: '#666', marginBottom: 12 },
  cardBio: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 15 },
  servicesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceTag: { backgroundColor: '#667eea', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  serviceTagText: { color: 'white', fontSize: 12, fontWeight: '600' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    gap: 30,
  },
  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  matchButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  actionButtonText: { fontSize: 32 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyStateText: { fontSize: 18, color: '#666', textAlign: 'center' },
});

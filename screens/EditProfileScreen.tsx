import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

interface Pet {
  id: string;
  name: string;
  species: string;
  description: string;
}

interface EditProfileScreenProps {
  userId: string;
  currentName: string;
  currentBio: string | null;
  currentPhone: string | null;
  currentZipCode: string | null;
  onBack: () => void;
  onSave: () => void;
}

const SERVICE_OPTIONS = ['Pet Sitting', 'Dog Walking', 'Grooming', 'Playdates', 'Training'];

export default function EditProfileScreen({
  userId,
  currentName,
  currentBio,
  currentPhone,
  currentZipCode,
  onBack,
  onSave,
}: EditProfileScreenProps) {
  const [fullName, setFullName] = useState(currentName);
  const [bio, setBio] = useState(currentBio || '');
  const [phone, setPhone] = useState(currentPhone || '');
  const [zipCode, setZipCode] = useState(currentZipCode || '');
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPet, setSavingPet] = useState(false);

  // New pet form
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState('');
  const [newPetDescription, setNewPetDescription] = useState('');
  const [showAddPet, setShowAddPet] = useState(false);

  useEffect(() => {
    loadPets();
    loadCaregiverServices();
  }, []);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', userId);

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const loadCaregiverServices = async () => {
    try {
      const { data, error } = await supabase
        .from('caregiver_profiles')
        .select('services')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSelectedServices(data?.services || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const addPet = async () => {
    if (!newPetName.trim() || !newPetSpecies.trim()) {
      Alert.alert('Error', 'Please enter pet name and species');
      return;
    }

    setSavingPet(true);
    try {
      const { error } = await supabase.from('pets').insert([
        {
          owner_id: userId,
          name: newPetName.trim(),
          species: newPetSpecies.trim(),
          description: newPetDescription.trim(),
        },
      ]);

      if (error) throw error;

      await loadPets();
      setNewPetName('');
      setNewPetSpecies('');
      setNewPetDescription('');
      setShowAddPet(false);
      Alert.alert('Success', 'Pet added!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSavingPet(false);
    }
  };

  const deletePet = async (petId: string) => {
    Alert.alert('Delete Pet', 'Are you sure you want to remove this pet?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('pets').delete().eq('id', petId);
            if (error) throw error;
            await loadPets();
            Alert.alert('Success', 'Pet removed');
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const saveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          bio: bio.trim() || null,
          phone: phone.trim() || null,
          zip_code: zipCode.trim() || null,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update or create caregiver services if any selected
      if (selectedServices.length > 0) {
        const { error: caregiverError } = await supabase
          .from('caregiver_profiles')
          .upsert({
            id: userId,
            services: selectedServices,
            rating: 5.0,
            total_reviews: 0,
            availability: 'Flexible',
            experience_years: 1,
          });

        if (caregiverError) throw caregiverError;
      }

      Alert.alert('Success', 'Profile updated!');
      onSave();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#999"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="(555) 123-4567"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              placeholder="12345"
              placeholderTextColor="#999"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          {/* Services Offered */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Services I Offer</Text>
            <Text style={styles.sectionSubtitle}>
              Select services you can provide (optional)
            </Text>

            <View style={styles.servicesGrid}>
              {SERVICE_OPTIONS.map((service) => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.serviceChip,
                    selectedServices.includes(service) && styles.serviceChipSelected,
                  ]}
                  onPress={() => toggleService(service)}
                >
                  <Text
                    style={[
                      styles.serviceChipText,
                      selectedServices.includes(service) && styles.serviceChipTextSelected,
                    ]}
                  >
                    {selectedServices.includes(service) ? '✓ ' : ''}
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* My Pets */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Pets</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddPet(!showAddPet)}
              >
                <Text style={styles.addButtonText}>
                  {showAddPet ? '− Cancel' : '+ Add Pet'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add Pet Form */}
            {showAddPet && (
              <View style={styles.addPetForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Pet name *"
                  placeholderTextColor="#999"
                  value={newPetName}
                  onChangeText={setNewPetName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Species (Dog, Cat, etc.) *"
                  placeholderTextColor="#999"
                  value={newPetSpecies}
                  onChangeText={setNewPetSpecies}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description (age, breed, personality...)"
                  placeholderTextColor="#999"
                  value={newPetDescription}
                  onChangeText={setNewPetDescription}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
                <TouchableOpacity
                  style={styles.savePetButton}
                  onPress={addPet}
                  disabled={savingPet}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.savePetButtonGradient}
                  >
                    {savingPet ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.savePetButtonText}>Save Pet</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Pets List */}
            {pets.length === 0 ? (
              <Text style={styles.noPetsText}>No pets added yet</Text>
            ) : (
              pets.map((pet) => (
                <View key={pet.id} style={styles.petCard}>
                  <View style={styles.petIcon}>
                    <Text style={styles.petEmoji}>🐾</Text>
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petSpecies}>{pet.species}</Text>
                    {pet.description ? (
                      <Text style={styles.petDescription}>{pet.description}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.deletePetButton}
                    onPress={() => deletePet(pet.id)}
                  >
                    <Text style={styles.deletePetButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={loading}
          >
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.saveButtonGradient}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: { color: 'white', fontSize: 18, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  sectionSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceChip: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceChipSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  serviceChipText: { fontSize: 14, color: '#666', fontWeight: '600' },
  serviceChipTextSelected: { color: 'white' },
  addButton: {
    backgroundColor: '#667eea',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  addPetForm: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  savePetButton: { borderRadius: 12, overflow: 'hidden', marginTop: 5 },
  savePetButtonGradient: { padding: 12, alignItems: 'center' },
  savePetButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  noPetsText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  petIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  petEmoji: { fontSize: 24 },
  petInfo: { flex: 1 },
  petName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  petSpecies: { fontSize: 14, color: '#667eea', marginBottom: 4 },
  petDescription: { fontSize: 13, color: '#666', lineHeight: 18 },
  deletePetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePetButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  saveButton: { borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  saveButtonGradient: { padding: 18, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
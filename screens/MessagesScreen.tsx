import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  caregiverId: string;
  caregiverName: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

interface MessagesScreenProps {
  messages: Message[];
  onBack: () => void;
  onMessagePress: (message: Message) => void;
}

export default function MessagesScreen({ messages, onBack, onMessagePress }: MessagesScreenProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>💬</Text>
              <Text style={styles.emptyStateText}>No messages yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start swiping to match with caregivers!
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <TouchableOpacity
                key={message.id}
                style={styles.messageCard}
                onPress={() => onMessagePress(message)}
                activeOpacity={0.7}
              >
                <View style={styles.messageAvatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageName}>{message.caregiverName}</Text>
                    <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                  </View>
                  <Text
                    style={[styles.messagePreview, message.unread && styles.messageUnread]}
                    numberOfLines={2}
                  >
                    {message.lastMessage}
                  </Text>
                </View>
                {message.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          )}
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { color: '#667eea', fontSize: 18, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyStateEmoji: { fontSize: 80, marginBottom: 20 },
  emptyStateText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptyStateSubtext: { fontSize: 16, color: '#666', textAlign: 'center' },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 24 },
  messageContent: { flex: 1 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  messageName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  messageTime: { fontSize: 14, color: '#999' },
  messagePreview: { fontSize: 15, color: '#666' },
  messageUnread: { fontWeight: '600', color: '#333' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4facfe',
    marginLeft: 10,
  },
});

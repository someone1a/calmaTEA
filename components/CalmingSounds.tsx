import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause } from 'lucide-react-native';

interface CalmingSoundsProps {
  onClose: () => void;
}

interface Sound {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const sounds: Sound[] = [
  {
    id: 'rain',
    name: 'Rain',
    description: 'Gentle rainfall sounds',
    icon: '🌧️',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Peaceful ocean sounds',
    icon: '🌊',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Birds and nature sounds',
    icon: '🌲',
  },
  {
    id: 'wind',
    name: 'Wind',
    description: 'Gentle wind sounds',
    icon: '💨',
  },
];

export const CalmingSounds: React.FC<CalmingSoundsProps> = ({ onClose }) => {
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const toggleSound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Close calming sounds"
          accessibilityHint="Return to relaxation tools"
        >
          <ChevronLeft size={24} color="#2196F3" />
          <Text style={styles.backButtonText}>Back</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Calming Sounds</Text>
        <Text style={styles.subtitle}>
          Choose a sound to help you relax
        </Text>

        <ScrollView contentContainerStyle={styles.soundsList}>
          {sounds.map((sound) => (
            <AccessibleButton
              key={sound.id}
              style={[
                styles.soundCard,
                playingSound === sound.id && styles.playingCard,
              ]}
              onPress={() => toggleSound(sound.id)}
              accessibilityLabel={`${sound.name} sound`}
              accessibilityHint={`${playingSound === sound.id ? 'Stop' : 'Play'} ${sound.description}`}
            >
              <View style={styles.soundInfo}>
                <Text style={styles.soundIcon}>{sound.icon}</Text>
                <View style={styles.soundText}>
                  <Text style={styles.soundName}>{sound.name}</Text>
                  <Text style={styles.soundDescription}>{sound.description}</Text>
                </View>
              </View>
              
              <View style={styles.playButton}>
                {playingSound === sound.id ? (
                  <Pause size={24} color="#FFFFFF" />
                ) : (
                  <Play size={24} color="#2196F3" />
                )}
              </View>
            </AccessibleButton>
          ))}
        </ScrollView>

        {playingSound && (
          <View style={styles.nowPlaying}>
            <Text style={styles.nowPlayingText}>
              🎵 Now playing: {sounds.find(s => s.id === playingSound)?.name}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  soundsList: {
    gap: 16,
  },
  soundCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playingCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  soundText: {
    flex: 1,
  },
  soundName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  soundDescription: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowPlaying: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  nowPlayingText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
});
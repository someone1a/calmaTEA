import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft } from 'lucide-react-native';

interface EmotionTrackerProps {
  onClose: () => void;
}

interface Emotion {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const emotions: Emotion[] = [
  { id: 'happy', name: 'Happy', icon: '😊', color: '#4CAF50' },
  { id: 'sad', name: 'Sad', icon: '😢', color: '#2196F3' },
  { id: 'angry', name: 'Angry', icon: '😠', color: '#F44336' },
  { id: 'excited', name: 'Excited', icon: '🤩', color: '#FF9800' },
  { id: 'calm', name: 'Calm', icon: '😌', color: '#9C27B0' },
  { id: 'worried', name: 'Worried', icon: '😰', color: '#607D8B' },
  { id: 'tired', name: 'Tired', icon: '😴', color: '#795548' },
  { id: 'confused', name: 'Confused', icon: '🤔', color: '#FFC107' },
];

export const EmotionTracker: React.FC<EmotionTrackerProps> = ({ onClose }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
  };

  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Close emotion tracker"
          accessibilityHint="Return to relaxation tools"
        >
          <ChevronLeft size={24} color="#2196F3" />
          <Text style={styles.backButtonText}>Back</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How Are You Feeling?</Text>
        <Text style={styles.subtitle}>
          Tap on the emotion that best describes how you feel right now
        </Text>

        <ScrollView contentContainerStyle={styles.emotionsGrid}>
          {emotions.map((emotion) => (
            <AccessibleButton
              key={emotion.id}
              style={[
                styles.emotionCard,
                selectedEmotion === emotion.id && styles.selectedCard,
                { borderColor: emotion.color },
              ]}
              onPress={() => handleEmotionSelect(emotion.id)}
              accessibilityLabel={`${emotion.name} emotion`}
              accessibilityHint={`Select ${emotion.name} as your current emotion`}
            >
              <Text style={styles.emotionIcon}>{emotion.icon}</Text>
              <Text style={[styles.emotionName, { color: emotion.color }]}>
                {emotion.name}
              </Text>
            </AccessibleButton>
          ))}
        </ScrollView>

        {selectedEmotionData && (
          <View style={[styles.selectedEmotionCard, { backgroundColor: selectedEmotionData.color + '20' }]}>
            <Text style={styles.selectedEmotionText}>
              You're feeling {selectedEmotionData.name.toLowerCase()} {selectedEmotionData.icon}
            </Text>
            <Text style={styles.encouragementText}>
              {getEncouragementText(selectedEmotionData.id)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const getEncouragementText = (emotionId: string): string => {
  const encouragements = {
    happy: "That's wonderful! Keep enjoying this positive feeling.",
    sad: "It's okay to feel sad. Take your time and be gentle with yourself.",
    angry: "Take some deep breaths. This feeling will pass.",
    excited: "Great energy! Channel this excitement into something positive.",
    calm: "Perfect! This is a great state to be in.",
    worried: "Try some breathing exercises. You've got this!",
    tired: "Rest is important. Take a break if you need one.",
    confused: "It's normal to feel confused sometimes. Take things one step at a time.",
  };
  return encouragements[emotionId] || "Every feeling is valid. You're doing great!";
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
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
    lineHeight: 22,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  emotionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '45%',
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  emotionIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emotionName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedEmotionCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  selectedEmotionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
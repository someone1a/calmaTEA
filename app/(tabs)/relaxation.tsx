import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { BreathingExercise } from '@/components/BreathingExercise';
import { CalmingSounds } from '@/components/CalmingSounds';
import { EmotionTracker } from '@/components/EmotionTracker';
import { CustomTimer } from '@/components/CustomTimer';
import { Wind, Music, Smile, Timer } from 'lucide-react-native';

export default function RelaxationScreen() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    breathingAnimation.start();

    return () => {
      breathingAnimation.stop();
    };
  }, [fadeAnim]);

  const renderSelectedTool = () => {
    switch (selectedTool) {
      case 'breathing':
        return <BreathingExercise onClose={() => setSelectedTool(null)} />;
      case 'sounds':
        return <CalmingSounds onClose={() => setSelectedTool(null)} />;
      case 'emotions':
        return <EmotionTracker onClose={() => setSelectedTool(null)} />;
      case 'timer':
        return <CustomTimer onClose={() => setSelectedTool(null)} />;
      default:
        return null;
    }
  };

  if (selectedTool) {
    return (
      <SafeAreaView style={styles.container}>
        {renderSelectedTool()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Self-Regulation</Text>
          <Text style={styles.headerSubtitle}>
            Take a moment to breathe and relax
          </Text>
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.toolsGrid}>
          <AccessibleButton
            style={[styles.toolCard, styles.breathingCard]}
            onPress={() => setSelectedTool('breathing')}
            accessibilityLabel="Open breathing exercises"
            accessibilityHint="Practice guided breathing exercises to help you relax"
          >
            <Wind size={48} color="#4CAF50" />
            <Text style={styles.toolTitle}>Breathing Exercises</Text>
            <Text style={styles.toolDescription}>
              Guided breathing to help you feel calm
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.soundsCard]}
            onPress={() => setSelectedTool('sounds')}
            accessibilityLabel="Open calming sounds"
            accessibilityHint="Listen to peaceful sounds and music"
          >
            <Music size={48} color="#2196F3" />
            <Text style={styles.toolTitle}>Calming Sounds</Text>
            <Text style={styles.toolDescription}>
              Peaceful sounds to help you relax
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.emotionsCard]}
            onPress={() => setSelectedTool('emotions')}
            accessibilityLabel="Open emotion tracker"
            accessibilityHint="Track and understand your feelings"
          >
            <Smile size={48} color="#FF9800" />
            <Text style={styles.toolTitle}>Emotion Tracker</Text>
            <Text style={styles.toolDescription}>
              How are you feeling today?
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.timerCard]}
            onPress={() => setSelectedTool('timer')}
            accessibilityLabel="Open custom timer"
            accessibilityHint="Set timers for activities or break times"
          >
            <Timer size={48} color="#9C27B0" />
            <Text style={styles.toolTitle}>Custom Timer</Text>
            <Text style={styles.toolDescription}>
              Set timers for activities or breaks
            </Text>
          </AccessibleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#E8F5E8',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#388E3C',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  toolsGrid: {
    gap: 16,
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    minHeight: 140,
  },
  breathingCard: {
    backgroundColor: '#E8F5E8',
  },
  soundsCard: {
    backgroundColor: '#E3F2FD',
  },
  emotionsCard: {
    backgroundColor: '#FFF3E0',
  },
  timerCard: {
    backgroundColor: '#F3E5F5',
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
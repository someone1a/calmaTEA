import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause } from 'lucide-react-native';

interface BreathingExerciseProps {
  onClose: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [colorAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isActive) {
      const breathingCycle = () => {
        // Inhale phase
        setPhase('inhale');
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
        ]).start(() => {
          // Hold phase
          setPhase('hold');
          setTimeout(() => {
            // Exhale phase
            setPhase('exhale');
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 4000,
                useNativeDriver: true,
              }),
              Animated.timing(colorAnim, {
                toValue: 0,
                duration: 4000,
                useNativeDriver: false,
              }),
            ]).start(() => {
              if (isActive) {
                setTimeout(breathingCycle, 1000);
              }
            });
          }, 1000);
        });
      };

      breathingCycle();
    }
  }, [isActive, scaleAnim, colorAnim]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E3F2FD', '#4CAF50'],
  });

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Ready to Begin';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Close breathing exercise"
          accessibilityHint="Return to relaxation tools"
        >
          <ChevronLeft size={24} color="#2196F3" />
          <Text style={styles.backButtonText}>Back</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Breathing Exercise</Text>
        <Text style={styles.subtitle}>
          Follow the circle and breathe along
        </Text>

        <View style={styles.breathingContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: backgroundColor,
              },
            ]}
          >
            <Text style={styles.phaseText}>{getPhaseText()}</Text>
          </Animated.View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {!isActive
              ? 'Press play to start your breathing exercise'
              : 'Focus on your breath and follow the circle'}
          </Text>
        </View>

        <AccessibleButton
          style={styles.playButton}
          onPress={toggleBreathing}
          accessibilityLabel={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
          accessibilityHint={isActive ? 'Pause the guided breathing' : 'Begin the guided breathing exercise'}
        >
          {isActive ? (
            <Pause size={32} color="#FFFFFF" />
          ) : (
            <Play size={32} color="#FFFFFF" />
          )}
          <Text style={styles.playButtonText}>
            {isActive ? 'Pause' : 'Start'}
          </Text>
        </AccessibleButton>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '500',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructions: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
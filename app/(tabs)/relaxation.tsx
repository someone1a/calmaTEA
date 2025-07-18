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
          <Text style={styles.headerTitle}>Autorregulación</Text>
          <Text style={styles.headerSubtitle}>
            Tómate un momento para respirar y relajarte
          </Text>
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.toolsGrid}>
          <AccessibleButton
            style={[styles.toolCard, styles.breathingCard]}
            onPress={() => setSelectedTool('breathing')}
            accessibilityLabel="Abrir ejercicios de respiración"
            accessibilityHint="Practica ejercicios de respiración guiada para ayudarte a relajarte"
          >
            <Wind size={48} color="#4CAF50" />
            <Text style={styles.toolTitle}>Ejercicios de Respiración</Text>
            <Text style={styles.toolDescription}>
              Respiración guiada para ayudarte a sentir calma
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.soundsCard]}
            onPress={() => setSelectedTool('sounds')}
            accessibilityLabel="Abrir sonidos relajantes"
            accessibilityHint="Escucha sonidos y música tranquilizante"
          >
            <Music size={48} color="#2196F3" />
            <Text style={styles.toolTitle}>Sonidos Relajantes</Text>
            <Text style={styles.toolDescription}>
              Sonidos tranquilos para ayudarte a relajar
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.emotionsCard]}
            onPress={() => setSelectedTool('emotions')}
            accessibilityLabel="Abrir rastreador de emociones"
            accessibilityHint="Rastrea y comprende tus sentimientos"
          >
            <Smile size={48} color="#FF9800" />
            <Text style={styles.toolTitle}>Rastreador de Emociones</Text>
            <Text style={styles.toolDescription}>
              ¿Cómo te sientes hoy?
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.timerCard]}
            onPress={() => setSelectedTool('timer')}
            accessibilityLabel="Abrir temporizador personalizado"
            accessibilityHint="Configura temporizadores para actividades o descansos"
          >
            <Timer size={48} color="#9C27B0" />
            <Text style={styles.toolTitle}>Temporizador</Text>
            <Text style={styles.toolDescription}>
              Configura tiempos para actividades o descansos
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
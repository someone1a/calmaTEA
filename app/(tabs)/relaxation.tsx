import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { BreathingExercise } from '@/components/BreathingExercise';
import { CalmingSounds } from '@/components/CalmingSounds';
import { EmotionTracker } from '@/components/EmotionTracker';
import { CustomTimer } from '@/components/CustomTimer';
import { Wind, Music, Smile, Timer } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;
export default function RelaxationScreen() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Configurar la barra de estado para esta pantalla
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }

    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
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
      <StatusBar barStyle="dark-content" backgroundColor="#DFF5E1" translucent={false} />
      
      <View style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Autorregulación</Text>
          <Text style={styles.headerSubtitle}>
            Tómate un momento para respirar y relajarte
          </Text>
        </Animated.View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolsGrid}>
          <AccessibleButton
            style={[styles.toolCard, styles.breathingCard, isTablet && styles.toolCardTablet]}
            onPress={() => setSelectedTool('breathing')}
            accessibilityLabel="Abrir ejercicios de respiración"
            accessibilityHint="Practica ejercicios de respiración guiada para ayudarte a relajarte"
          >
            <View style={styles.cardIconContainer}>
              <Wind size={isTablet ? 72 : 56} color="#4CAF50" />
            </View>
            <Text style={styles.toolTitle}>Ejercicios de Respiración</Text>
            <Text style={styles.toolDescription}>
              Respiración guiada con animaciones relajantes
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.soundsCard, isTablet && styles.toolCardTablet]}
            onPress={() => setSelectedTool('sounds')}
            accessibilityLabel="Abrir sonidos relajantes"
            accessibilityHint="Escucha sonidos y música tranquilizante"
          >
            <View style={styles.cardIconContainer}>
              <Music size={isTablet ? 72 : 56} color="#2196F3" />
            </View>
            <Text style={styles.toolTitle}>Sonidos Relajantes</Text>
            <Text style={styles.toolDescription}>
              Lluvia, olas del mar, pájaros y ruido blanco
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.emotionsCard, isTablet && styles.toolCardTablet]}
            onPress={() => setSelectedTool('emotions')}
            accessibilityLabel="Abrir rastreador de emociones"
            accessibilityHint="Rastrea y comprende tus sentimientos"
          >
            <View style={styles.cardIconContainer}>
              <Smile size={isTablet ? 72 : 56} color="#FF9800" />
            </View>
            <Text style={styles.toolTitle}>¿Cómo te Sientes?</Text>
            <Text style={styles.toolDescription}>
              Registra tus emociones y ve tu progreso
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={[styles.toolCard, styles.timerCard, isTablet && styles.toolCardTablet]}
            onPress={() => setSelectedTool('timer')}
            accessibilityLabel="Abrir temporizador personalizado"
            accessibilityHint="Configura temporizadores para actividades o descansos"
          >
            <View style={styles.cardIconContainer}>
              <Timer size={isTablet ? 72 : 56} color="#9C27B0" />
            </View>
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
    backgroundColor: '#F8FDF9',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: isTablet ? 32 : 24,
    paddingBottom: 20,
    backgroundColor: '#DFF5E1',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 40 : 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: isTablet ? 22 : 18,
    color: '#388E3C',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  scrollContent: {
    padding: isTablet ? 32 : 20,
    paddingTop: 24,
    maxWidth: isLargeScreen ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  toolsGrid: {
    gap: isTablet ? 24 : 20,
    ...(isTablet && {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    padding: isTablet ? 36 : 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    minHeight: isTablet ? 220 : 180,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...(isTablet && {
      width: '48%',
      marginBottom: 16,
    }),
  },
  toolCardTablet: {
    minHeight: 240,
    padding: 40,
  },
  breathingCard: {
    backgroundColor: '#DFF5E1',
    borderColor: '#C8E6C9',
  },
  soundsCard: {
    backgroundColor: '#E5F1FC',
    borderColor: '#BBDEFB',
  },
  emotionsCard: {
    backgroundColor: '#FFF3D6',
    borderColor: '#FFE0B2',
  },
  timerCard: {
    backgroundColor: '#F5E6FA',
    borderColor: '#E1BEE7',
  },
  cardIconContainer: {
    marginBottom: isTablet ? 20 : 16,
    padding: isTablet ? 16 : 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  toolTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: isTablet ? 16 : 12,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: isTablet ? 18 : 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '500',
  },
});
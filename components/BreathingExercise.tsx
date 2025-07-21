import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

// Cálculo de dimensiones responsivas
const circleSize = Math.min(screenWidth, screenHeight) * (isTablet ? 0.4 : 0.6);
const minScale = 0.8;
const maxScale = 1.4;

interface BreathingExerciseProps {
  onClose: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhala' | 'mantén' | 'exhala' | 'pausa'>('inhala');
  const [duration, setDuration] = useState(1); // en minutos
  const [timeLeft, setTimeLeft] = useState(60); // en segundos
  const [scaleAnim] = useState(new Animated.Value(minScale));
  const [colorAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [outerCircleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, []);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const breathingCycle = () => {
        // Fase inhalar por la nariz (4 segundos)
        setPhase('inhala');
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: maxScale,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (!isActive) return;
          
          // Fase retener (7 segundos)
          setPhase('mantén');
          // Animación de pulso suave durante la retención
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1400,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 0,
                duration: 1400,
                useNativeDriver: true,
              }),
            ])
          ).start();
          setTimeout(() => {
            if (!isActive) return;
            // Detener la animación de pulso
            pulseAnim.setValue(1);
            
            // Fase exhalar por la boca (8 segundos)
            setPhase('exhala');
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: minScale,
                duration: 8000,
                useNativeDriver: true,
              }),
              Animated.timing(colorAnim, {
                toValue: 0,
                duration: 8000,
                useNativeDriver: false,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 8000,
                useNativeDriver: true,
              }),
            ]).start(() => {
              if (!isActive) return;
              
              // Pausa breve antes del siguiente ciclo (1 segundo)
              setPhase('pausa');
              setTimeout(() => {
                if (isActive && timeLeft > 0) {
                  breathingCycle();
                }
              }, 3000);
            });
          }, 7000); // 7 segundos de retención
        });
      };

      breathingCycle();
    }
  }, [isActive, scaleAnim, colorAnim, timeLeft]);

  const toggleBreathing = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsActive(!isActive);
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#E8F5E8', '#8BC34A', '#4CAF50'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  const outerCircleScale = outerCircleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1.3],
  });

  const [counter, setCounter] = useState(0);

        const getPhaseText = () => {
          switch (phase) {
            case 'inhala':
              return `Inhala lentamente\npor la nariz\n${Math.min(Math.floor(counter/1000) + 1, 4)} de 4`;
            case 'mantén':
              return `Retén el aire en\ntus pulmones\n${Math.min(Math.floor(counter/1000) + 1, 7)} de 7`;
            case 'exhala':
              return `Exhala suavemente\npor la boca\nhaciendo "shhh"\n${Math.min(Math.floor(counter/1000) + 1, 8)} de 8`;
            case 'pausa':
              return 'Prepárate para el\nsiguiente ciclo';
            default:
              return 'Listo para comenzar\nRespiración 4-7-8';
          }
        };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#DFF5E1" translucent={false} />
      
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Cerrar ejercicios de respiración"
          accessibilityHint="Volver a las herramientas de relajación"
        >
          <ChevronLeft size={24} color="#2E7D32" />
          <Text style={styles.backButtonText}>Volver</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ejercicios de Respiración</Text>

        {!isActive ? (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Configuración del ejercicio</Text>
            <View style={styles.durationSelector}>
              <Text style={styles.durationLabel}>Selecciona la duración:</Text>
              <View style={styles.durationButtons}>
                {[1, 3, 5].map((mins) => (
                  <AccessibleButton
                    key={mins}
                    style={[
                      styles.durationButton,
                      duration === mins && styles.selectedDuration,
                    ]}
                    onPress={() => {
                      setDuration(mins);
                      setIsActive(false);
                    }}
                    accessibilityLabel={`Seleccionar duración de ${mins} minuto${mins > 1 ? 's' : ''}`}
                    disabled={isActive}
                  >
                    <Text style={[
                      styles.durationButtonText,
                      duration === mins && styles.selectedDurationText,
                    ]}>
                      {mins} min
                    </Text>
                  </AccessibleButton>
                ))}
              </View>
            </View>

            <AccessibleButton
              style={styles.playButton}
              onPress={toggleBreathing}
              accessibilityLabel="Iniciar ejercicio de respiración"
              accessibilityHint="Comenzar el ejercicio de respiración guiada"
            >
              <Play size={40} color="#FFFFFF" />
              <Text style={styles.playButtonText}>
                {timeLeft === 0 ? '🔄 Reiniciar' : '▶ Comenzar'}
              </Text>
            </AccessibleButton>

            <View style={styles.instructions}>
              <Text style={[styles.instructionText, styles.instructionTitle]}>
                Técnica de Respiración 4-7-8
              </Text>
              <Text style={styles.instructionText}>
                1. Inhala lentamente por la nariz durante 4 segundos,{'\n'}
                   llenando completamente tus pulmones{'\n'}
                2. Mantén el aire en tus pulmones durante 7 segundos{'\n'}
                3. Exhala muy lentamente por la boca durante 8 segundos,{'\n'}
                   haciendo un suave sonido "shhh" mientras el aire sale{'\n'}
                4. Espera un momento antes del siguiente ciclo
              </Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Sigue el círculo y respira junto con él
            </Text>

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>

            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.outerBreathingCircle,
                  {
                    transform: [
                      { scale: outerCircleScale },
                      { scale: scaleAnim }
                    ],
                    opacity: 0.3,
                    backgroundColor: backgroundColor,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [
                      { scale: scaleAnim },
                      { scale: phase === 'mantén' || phase === 'pausa' ? pulseScale : 1 }
                    ],
                    backgroundColor: backgroundColor,
                  },
                ]}
              >
                <Text style={styles.phaseText}>{getPhaseText()}</Text>
              </Animated.View>
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Concéntrate en tu respiración y sigue el círculo
              </Text>
            </View>

            <AccessibleButton
              style={[styles.playButton, styles.pauseButton]}
              onPress={toggleBreathing}
              accessibilityLabel="Pausar ejercicio de respiración"
              accessibilityHint="Pausar la respiración guiada"
            >
              <Pause size={32} color="#FFFFFF" />
              <Text style={styles.playButtonText}>⏸ Pausar</Text>
            </AccessibleButton>
          </>
        )}
      </View>
    </SafeAreaView>
  );
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDF9',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: 20,
    backgroundColor: '#DFF5E1',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: isTablet ? 32 : 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: isLargeScreen ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: isTablet ? 40 : 32,
  },
  setupContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: isTablet ? 40 : 32,
    backgroundColor: '#F0F9F0',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  setupTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: isTablet ? 32 : 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isTablet ? 22 : 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: isTablet ? 32 : 24,
    fontWeight: '500',
  },
  timerContainer: {
    marginBottom: isTablet ? 40 : 32,
  },
  timerText: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 40 : 32,
    position: 'relative',
  },
  outerBreathingCircle: {
    position: 'absolute',
    width: isTablet ? 320 : 260,
    height: isTablet ? 320 : 260,
    borderRadius: isTablet ? 160 : 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: isTablet ? 280 : 220,
    height: isTablet ? 280 : 220,
    borderRadius: isTablet ? 140 : 110,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  phaseText: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isTablet ? 44 : 32,
  },
  durationSelector: {
    alignItems: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  durationLabel: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: isTablet ? 16 : 12,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  durationButton: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: isTablet ? 28 : 20,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C8E6C9',
  },
  selectedDuration: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  durationButtonText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  instructions: {
    marginBottom: isTablet ? 40 : 32,
    paddingHorizontal: isTablet ? 32 : 20,
  },
  instructionText: {
    fontSize: isTablet ? 18 : 16,
    color: '#666666',
    textAlign: 'left',
    lineHeight: isTablet ? 32 : 28,
    fontWeight: '500',
  },
  instructionTitle: {
    fontSize: isTablet ? 24 : 20,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isTablet ? 48 : 36,
    paddingVertical: isTablet ? 24 : 20,
    borderRadius: 30,
    gap: isTablet ? 16 : 12,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    minWidth: isTablet ? 220 : 180,
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: '#3B8C3F',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 26 : 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
};


import React, { useState, useEffect, useRef } from 'react';
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
  const [phaseCounter, setPhaseCounter] = useState(0); // Contador para cada fase
  const [scaleAnim] = useState(new Animated.Value(minScale));
  const [colorAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [outerCircleAnim] = useState(new Animated.Value(1));
  
  // Referencias para limpiar intervalos
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingCycleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }
    
    return () => {
      // Limpiar intervalos al desmontar
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (breathingCycleRef.current) clearTimeout(breathingCycleRef.current);
    };
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
      startBreathingCycle();
    } else {
      // Limpiar animaciones cuando se pausa
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (breathingCycleRef.current) clearTimeout(breathingCycleRef.current);
      setPhaseCounter(0);
    }
    
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (breathingCycleRef.current) clearTimeout(breathingCycleRef.current);
    };
  }, [isActive]);

  const startBreathingCycle = () => {
    if (!isActive) return;
    
    // Fase inhalar por la nariz (4 segundos)
    setPhase('inhala');
    setPhaseCounter(0);
    
    // Contador para la fase de inhalación
    let inhaleCount = 0;
    phaseTimerRef.current = setInterval(() => {
      inhaleCount++;
      setPhaseCounter(inhaleCount);
      if (inhaleCount >= 4) {
        if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      }
    }, 1000);
    
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
      setPhaseCounter(0);
      
      let holdCount = 0;
      phaseTimerRef.current = setInterval(() => {
        holdCount++;
        setPhaseCounter(holdCount);
        if (holdCount >= 7) {
          if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
        }
      }, 1000);
      
      // Animación de pulso suave durante la retención
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      breathingCycleRef.current = setTimeout(() => {
        if (!isActive) return;
        
        // Detener la animación de pulso
        pulseAnimation.stop();
        pulseAnim.setValue(1);
        
        // Fase exhalar por la boca (8 segundos)
        setPhase('exhala');
        setPhaseCounter(0);
        
        let exhaleCount = 0;
        phaseTimerRef.current = setInterval(() => {
          exhaleCount++;
          setPhaseCounter(exhaleCount);
          if (exhaleCount >= 8) {
            if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
          }
        }, 1000);
        
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
          
          // Pausa breve antes del siguiente ciclo (3 segundos)
          setPhase('pausa');
          setPhaseCounter(0);
          
          breathingCycleRef.current = setTimeout(() => {
            if (isActive && timeLeft > 0) {
              startBreathingCycle();
            }
          }, 3000);
        });
      }, 7000); // 7 segundos de retención
    });
  };

  const toggleBreathing = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setPhase('inhala');
    setPhaseCounter(0);
    scaleAnim.setValue(minScale);
    colorAnim.setValue(0);
    rotateAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#E8F5E8', '#81C784', '#4CAF50'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0.95, 1.05],
    outputRange: [0.95, 1.05],
  });

  const outerCircleScale = outerCircleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1.3],
  });

  const getPhaseText = () => {
    switch (phase) {
      case 'inhala':
        return `Inhala lentamente\npor la nariz\n${phaseCounter} de 4`;
      case 'mantén':
        return `Retén el aire en\ntus pulmones\n${phaseCounter} de 7`;
      case 'exhala':
        return `Exhala suavemente\npor la boca\nhaciendo "shhh"\n${phaseCounter} de 8`;
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

        {!isActive && timeLeft === duration * 60 ? (
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
                      setTimeLeft(mins * 60);
                    }}
                    accessibilityLabel={`Seleccionar duración de ${mins} minuto${mins > 1 ? 's' : ''}`}
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
              <Text style={styles.playButtonText}>▶ Comenzar</Text>
            </AccessibleButton>

            <View style={styles.instructions}>
              <Text style={[styles.instructionText, styles.instructionTitle]}>
                Técnica de Respiración 4-7-8
              </Text>
              <Text style={styles.instructionText}>
                1. Inhala lentamente por la nariz durante 4 segundos{'\n'}
                2. Mantén el aire en tus pulmones durante 7 segundos{'\n'}
                3. Exhala muy lentamente por la boca durante 8 segundos{'\n'}
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
                      { scale: phase === 'mantén' ? pulseScale : 1 }
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

            <View style={styles.controlButtons}>
              <AccessibleButton
                style={[styles.playButton, styles.pauseButton]}
                onPress={toggleBreathing}
                accessibilityLabel={isActive ? "Pausar ejercicio" : "Reanudar ejercicio"}
              >
                {isActive ? (
                  <>
                    <Pause size={32} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>⏸ Pausar</Text>
                  </>
                ) : (
                  <>
                    <Play size={32} color="#FFFFFF" />
                    <Text style={styles.playButtonText}>▶ Continuar</Text>
                  </>
                )}
              </AccessibleButton>

              <AccessibleButton
                style={styles.resetButton}
                onPress={resetExercise}
                accessibilityLabel="Reiniciar ejercicio"
              >
                <Text style={styles.resetButtonText}>🔄 Reiniciar</Text>
              </AccessibleButton>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

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
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isTablet ? 32 : 28,
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
    textAlign: 'center',
    lineHeight: isTablet ? 28 : 24,
    fontWeight: '500',
  },
  instructionTitle: {
    fontSize: isTablet ? 24 : 20,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: 30,
    gap: isTablet ? 12 : 8,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    minWidth: isTablet ? 180 : 140,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#757575',
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: 30,
    minWidth: isTablet ? 140 : 120,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
});
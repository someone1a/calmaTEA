import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
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
  const lottieRef = useRef<LottieView>(null);
  
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
      // Iniciar la animación de Lottie
      lottieRef.current?.play();
    } else {
      // Limpiar animaciones cuando se pausa
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (breathingCycleRef.current) clearTimeout(breathingCycleRef.current);
      setPhaseCounter(0);
      // Pausar la animación de Lottie
      lottieRef.current?.pause();
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

    // Simular el ciclo completo de respiración (4+7+8 = 19 segundos)
    setTimeout(() => {
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
      
      breathingCycleRef.current = setTimeout(() => {
        if (!isActive) return;
        
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
        
        setTimeout(() => {
          if (!isActive) return;
          
          // Pausa breve antes del siguiente ciclo (3 segundos)
          setPhase('pausa');
          setPhaseCounter(0);
          
          breathingCycleRef.current = setTimeout(() => {
            if (isActive && timeLeft > 0) {
              startBreathingCycle();
            }
          }, 3000);
        }, 8000); // 8 segundos de exhalación
      }, 7000); // 7 segundos de retención
    }, 4000); // 4 segundos de inhalación
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
    lottieRef.current?.reset();
  };

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
              <View style={styles.lottieContainer}>
                <LottieView
                  ref={lottieRef}
                  source={{
                    uri: 'https://lottie.host/8ff6e6af-f7da-4c7e-8065-78353b8e6f68/F6wSrtC9yU.lottie'
                  }}
                  style={styles.lottieAnimation}
                  loop={true}
                  autoPlay={false}
                  speed={0.3}
                />
                <Text style={styles.phaseText}>{getPhaseText()}</Text>
              </View>
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
  lottieContainer: {
    width: isTablet ? 280 : 220,
    height: isTablet ? 280 : 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  phaseText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: isTablet ? 32 : 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
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
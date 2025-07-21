import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause, RotateCcw } from 'lucide-react-native';

interface CustomTimerProps {
  onClose: () => void;
}

export const CustomTimer: React.FC<CustomTimerProps> = ({ onClose }) => {
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('00');
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const startTimer = () => {
    if (totalSeconds === 0) {
      const mins = parseInt(minutes) || 0;
      const secs = parseInt(seconds) || 0;
      const total = mins * 60 + secs;
      if (total > 0) {
        setTotalSeconds(total);
        setIsRunning(true);
        setIsFinished(false);
      }
    } else {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setIsFinished(false);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6FA" translucent={false} />
      
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Cerrar temporizador"
          accessibilityHint="Volver a las herramientas de relajación"
        >
          <ChevronLeft size={24} color="#7B1FA2" />
          <Text style={styles.backButtonText}>Volver</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Temporizador</Text>
        <Text style={styles.subtitle}>
          Configura un temporizador para actividades o descansos
        </Text>

        {totalSeconds > 0 ? (
          <View style={styles.runningTimer}>
            <Text style={styles.timerDisplay}>
              {formatTime(totalSeconds)}
            </Text>
            
            {isFinished && (
              <Text style={styles.finishedText}>
                Time's up! 🎉
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.timerSetup}>
            <Text style={styles.setupLabel}>Configura tu temporizador</Text>
            <View style={styles.timeInputs}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeValue}
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Campo de minutos"
                  accessibilityHint="Ingresa el número de minutos"
                />
                <Text style={styles.timeLabel}>min</Text>
              </View>
              
              <Text style={styles.timeSeparator}>:</Text>
              
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeValue}
                  value={seconds}
                  onChangeText={setSeconds}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Campo de segundos"
                  accessibilityHint="Ingresa el número de segundos"
                />
                <Text style={styles.timeLabel}>sec</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.controlButtons}>
          {!isRunning ? (
            <AccessibleButton
              style={styles.startButton}
              onPress={startTimer}
              accessibilityLabel="Iniciar temporizador"
              accessibilityHint="Comenzar la cuenta regresiva"
            >
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Iniciar</Text>
            </AccessibleButton>
          ) : (
            <AccessibleButton
              style={styles.pauseButton}
              onPress={pauseTimer}
              accessibilityLabel="Pausar temporizador"
              accessibilityHint="Pausar la cuenta regresiva"
            >
              <Pause size={24} color="#FFFFFF" />
              <Text style={styles.pauseButtonText}>Pausar</Text>
            </AccessibleButton>
          )}

          {totalSeconds > 0 && (
            <AccessibleButton
              style={styles.resetButton}
              onPress={resetTimer}
              accessibilityLabel="Reiniciar temporizador"
              accessibilityHint="Reiniciar el temporizador para comenzar de nuevo"
            >
              <RotateCcw size={24} color="#757575" />
              <Text style={styles.resetButtonText}>Reiniciar</Text>
            </AccessibleButton>
          )}
        </View>

        <View style={styles.presetButtons}>
          <Text style={styles.presetLabel}>Configuraciones rápidas</Text>
          <View style={styles.presetGrid}>
            {[
              { label: '1 min', mins: 1, secs: 0 },
              { label: '5 min', mins: 5, secs: 0 },
              { label: '10 min', mins: 10, secs: 0 },
              { label: '15 min', mins: 15, secs: 0 },
            ].map((preset) => (
              <AccessibleButton
                key={preset.label}
                style={styles.presetButton}
                onPress={() => {
                  setMinutes(preset.mins.toString());
                  setSeconds(preset.secs.toString().padStart(2, '0'));
                }}
                accessibilityLabel={`Configurar temporizador a ${preset.label}`}
                accessibilityHint={`Configurar rápidamente el temporizador a ${preset.label}`}
              >
                <Text style={styles.presetButtonText}>{preset.label}</Text>
              </AccessibleButton>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: 16,
    backgroundColor: '#F5E6FA',
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
    color: '#7B1FA2',
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
    color: '#7B1FA2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  runningTimer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#7B1FA2',
    textAlign: 'center',
    marginBottom: 16,
  },
  finishedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  timerSetup: {
    alignItems: 'center',
    marginBottom: 32,
  },
  setupLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 24,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeInput: {
    alignItems: 'center',
  },
  timeValue: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#7B1FA2',
    borderRadius: 12,
    padding: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    width: 80,
  },
  timeLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    fontWeight: '500',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7B1FA2',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: '#757575',
    fontSize: 18,
    fontWeight: 'bold',
  },
  presetButtons: {
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  presetButton: {
    backgroundColor: '#F5E6FA',
    borderWidth: 1,
    borderColor: '#7B1FA2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  presetButtonText: {
    color: '#7B1FA2',
    fontSize: 16,
    fontWeight: '600',
  },
});
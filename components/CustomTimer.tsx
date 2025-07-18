import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
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
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Close timer"
          accessibilityHint="Return to relaxation tools"
        >
          <ChevronLeft size={24} color="#2196F3" />
          <Text style={styles.backButtonText}>Back</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Custom Timer</Text>
        <Text style={styles.subtitle}>
          Set a timer for activities or break times
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
            <Text style={styles.setupLabel}>Set your timer</Text>
            <View style={styles.timeInputs}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeValue}
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Minutes input"
                  accessibilityHint="Enter the number of minutes"
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
                  accessibilityLabel="Seconds input"
                  accessibilityHint="Enter the number of seconds"
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
              accessibilityLabel="Start timer"
              accessibilityHint="Begin the countdown timer"
            >
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start</Text>
            </AccessibleButton>
          ) : (
            <AccessibleButton
              style={styles.pauseButton}
              onPress={pauseTimer}
              accessibilityLabel="Pause timer"
              accessibilityHint="Pause the countdown timer"
            >
              <Pause size={24} color="#FFFFFF" />
              <Text style={styles.pauseButtonText}>Pause</Text>
            </AccessibleButton>
          )}

          {totalSeconds > 0 && (
            <AccessibleButton
              style={styles.resetButton}
              onPress={resetTimer}
              accessibilityLabel="Reset timer"
              accessibilityHint="Reset the timer to start over"
            >
              <RotateCcw size={24} color="#757575" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </AccessibleButton>
          )}
        </View>

        <View style={styles.presetButtons}>
          <Text style={styles.presetLabel}>Quick presets</Text>
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
                accessibilityLabel={`Set timer to ${preset.label}`}
                accessibilityHint={`Quickly set the timer to ${preset.label}`}
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
    color: '#9C27B0',
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
    color: '#9C27B0',
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
    borderColor: '#9C27B0',
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
    color: '#9C27B0',
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
    backgroundColor: '#F3E5F5',
    borderWidth: 1,
    borderColor: '#9C27B0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  presetButtonText: {
    color: '#9C27B0',
    fontSize: 16,
    fontWeight: '600',
  },
});
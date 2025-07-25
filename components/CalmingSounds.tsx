import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause, Square, RotateCcw } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface CalmingSoundsProps {
  onClose: () => void;
}

interface Sound {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  audioFile?: string;
}

const sounds: Sound[] = [
  {
    id: 'rain',
    name: 'Lluvia Suave',
    description: 'Sonidos relajantes de lluvia',
    icon: '🌧️',
    color: '#64B5F6',
    audioFile: 'assets/sounds/relaxing/rain.mp3',
  },
  {
    id: 'ocean',
    name: 'Olas del Mar',
    description: 'Sonidos pacíficos del océano',
    icon: '🌊',
    color: '#4FC3F7',
    audioFile: 'assets/sounds/relaxing/ocean.mp3',
  },
  {
    id: 'birds',
    name: 'Pájaros',
    description: 'Cantos de pájaros en la naturaleza',
    icon: '🐦',
    color: '#81C784',
    audioFile: 'assets/sounds/relaxing/birds.mp3',
  },
  {
    id: 'whitenoise',
    name: 'Ruido Blanco',
    description: 'Sonido constante y relajante',
    icon: '📻',
    color: '#A1887F',
    audioFile: 'assets/sounds/relaxing/white-noice.wav',
  },
];

export const CalmingSounds: React.FC<CalmingSoundsProps> = ({ onClose }) => {
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }

    // Configurar audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async (soundId: string) => {
    try {
      // Detener sonido actual si existe
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const selectedSound = sounds.find(s => s.id === soundId);
      if (!selectedSound) return;

      // En una implementación real, cargarías el archivo de audio desde assets
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: `../assets/sounds/relaxing/${selectedSound.audioFile}` }
      // );
      // await newSound.setIsLoopingAsync(isLooping);
      // await newSound.playAsync();
      // setSound(newSound);
      
      setPlayingSound(soundId);
      setIsPlaying(true);
      
      console.log(`🎵 Reproduciendo: ${selectedSound.name} (${selectedSound.audioFile})`);
      console.log(`🔁 Repetición: ${isLooping ? 'Activada' : 'Desactivada'}`);
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    setIsPlaying(false);
    console.log('⏸️ Sonido pausado');
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setPlayingSound(null);
    setIsPlaying(false);
    console.log('⏹️ Sonido detenido');
  };

  const toggleLoop = () => {
    if (sound) {
      sound.setIsLoopingAsync(!isLooping);
    }
    setIsLooping(!isLooping);
    console.log(`🔁 Repetición ${!isLooping ? 'activada' : 'desactivada'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5F1FC" translucent={false} />
      
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Cerrar sonidos relajantes"
          accessibilityHint="Volver a las herramientas de relajación"
        >
          <ChevronLeft size={24} color="#1976D2" />
          <Text style={styles.backButtonText}>Volver</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Sonidos Relajantes</Text>
        <Text style={styles.subtitle}>
          Elige un sonido para ayudarte a relajar
        </Text>

        <ScrollView 
          contentContainerStyle={styles.soundsList}
          showsVerticalScrollIndicator={false}
        >
          {sounds.map((soundItem) => (
            <AccessibleButton
              key={soundItem.id}
              style={[
                styles.soundCard,
                playingSound === soundItem.id && styles.playingCard,
                { borderLeftColor: soundItem.color }
              ]}
              onPress={() => playSound(soundItem.id)}
              accessibilityLabel={`Sonido de ${soundItem.name}`}
              accessibilityHint={`${playingSound === soundItem.id ? 'Detener' : 'Reproducir'} ${soundItem.description}`}
            >
              <View style={styles.soundInfo}>
                <View style={[styles.soundIconContainer, { backgroundColor: soundItem.color + '20' }]}>
                  <Text style={styles.soundIcon}>{soundItem.icon}</Text>
                </View>
                <View style={styles.soundText}>
                  <Text style={styles.soundName}>{soundItem.name}</Text>
                  <Text style={styles.soundDescription}>{soundItem.description}</Text>
                </View>
              </View>
              
              <View style={[styles.playIndicator, { backgroundColor: soundItem.color }]}>
                {playingSound === soundItem.id && isPlaying ? (
                  <Pause size={20} color="#FFFFFF" />
                ) : (
                  <Play size={20} color="#FFFFFF" />
                )}
              </View>
            </AccessibleButton>
          ))}
        </ScrollView>

        {playingSound && (
          <View style={styles.playerControls}>
            <Text style={styles.nowPlayingText}>
              🎵 Reproduciendo: {sounds.find(s => s.id === playingSound)?.name}
            </Text>
            
            <View style={styles.controlButtons}>
              <AccessibleButton
                style={styles.controlButton}
                onPress={isPlaying ? pauseSound : () => playSound(playingSound)}
                accessibilityLabel={isPlaying ? 'Pausar' : 'Reproducir'}
                accessibilityHint={`${isPlaying ? 'Pausar' : 'Reanudar'} la reproducción del sonido actual`}
              >
                {isPlaying ? (
                  <Pause size={24} color="#2196F3" />
                ) : (
                  <Play size={24} color="#2196F3" />
                )}
              </AccessibleButton>

              <AccessibleButton
                style={styles.controlButton}
                onPress={stopSound}
                accessibilityLabel="Detener"
                accessibilityHint="Detener completamente la reproducción del sonido"
              >
                <Square size={24} color="#F44336" />
              </AccessibleButton>

              <AccessibleButton
                style={[styles.controlButton, isLooping && styles.activeControl]}
                onPress={toggleLoop}
                accessibilityLabel={isLooping ? 'Desactivar repetición' : 'Activar repetición'}
                accessibilityHint={`${isLooping ? 'Desactivar' : 'Activar'} la repetición automática del sonido`}
              >
                <RotateCcw size={24} color={isLooping ? '#FFFFFF' : '#9E9E9E'} />
              </AccessibleButton>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FCFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: 20,
    backgroundColor: '#E5F1FC',
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
    color: '#1976D2',
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
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  soundsList: {
    gap: 16,
    paddingBottom: 20,
  },
  soundCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  playingCard: {
    backgroundColor: '#F3F9FF',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  soundIcon: {
    fontSize: 28,
  },
  soundText: {
    flex: 1,
  },
  soundName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  soundDescription: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  playIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerControls: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  nowPlayingText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeControl: {
    backgroundColor: '#4CAF50',
  },
});
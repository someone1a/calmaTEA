import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Play, Pause, Square, RotateCcw, Download } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../utils/supabase';

interface CalmingSoundsProps {
  onClose: () => void;
}

interface Sound {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  url: string;
}

export const CalmingSounds: React.FC<CalmingSoundsProps> = ({ onClose }) => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const configureApp = async () => {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content', true);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      // Listener para acciones de notificaciones
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (response.actionIdentifier === 'STOP_SOUND') {
          stopSound();
        }
      });
    };

    const fetchSounds = async () => {
      try {
        const { data, error } = await supabase
          .from('relax_sounds_list')
          .select('*');

        if (error) throw error;
        if (data) setSounds(data);
      } catch (err) {
        console.error('Error fetching sounds:', err);
      }
    };

    configureApp();
    fetchSounds();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const showNotification = async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: false,
          data: { screen: 'relaxation' },
          categoryIdentifier: 'SOUND_CONTROLS',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  };

  // Registrar categoría con acción para detener sonido
  useEffect(() => {
    Notifications.setNotificationCategoryAsync('SOUND_CONTROLS', [
      {
        identifier: 'STOP_SOUND',
        buttonTitle: 'Detener sonido',
        options: { foreground: false },
      },
    ]);
  }, []);

  const getLocalFilePath = (soundId: string) =>
    `${FileSystem.documentDirectory}${soundId}.mp3`;

  const downloadSound = async (soundId: string, url: string) => {
    try {
      const fileUri = getLocalFilePath(soundId);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        Alert.alert('Descarga', 'El sonido ya está guardado para uso offline.');
        return;
      }

      await FileSystem.downloadAsync(url, fileUri);
      Alert.alert('Descarga completa', 'El sonido se guardó para uso offline.');
    } catch (error) {
      console.error('Error descargando sonido:', error);
    }
  };

  const playSound = async (soundId: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const selectedSound = sounds.find(s => s.id === soundId);
      if (!selectedSound) return;

      // Buscar en almacenamiento local primero
      const localPath = getLocalFilePath(soundId);
      const fileInfo = await FileSystem.getInfoAsync(localPath);

      const source = fileInfo.exists
        ? { uri: localPath }
        : { uri: selectedSound.url };

      const { sound: newSound } = await Audio.Sound.createAsync(source);
      await newSound.setIsLoopingAsync(isLooping);
      await newSound.playAsync();
      setSound(newSound);
      setPlayingSound(soundId);
      setIsPlaying(true);

      await showNotification(
        'Sonido Relajante Activo',
        `Reproduciendo: ${selectedSound.name}${isLooping ? ' (en bucle)' : ''}`
      );
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      await showNotification('Sonido Pausado', 'El sonido relajante ha sido pausado');
    }
    setIsPlaying(false);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      await showNotification('Sonido Detenido', 'El sonido relajante ha sido detenido');
      setSound(null);
    }
    setPlayingSound(null);
    setIsPlaying(false);
  };

  const toggleLoop = async () => {
    if (sound) {
      await sound.setIsLoopingAsync(!isLooping);
      const selectedSound = sounds.find(s => s.id === playingSound);
      if (selectedSound) {
        await showNotification(
          'Modo de Reproducción Cambiado',
          `${selectedSound.name}: Repetición ${!isLooping ? 'activada' : 'desactivada'}`
        );
      }
    }
    setIsLooping(!isLooping);
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
              style={{
                ...styles.soundCard,
                ...(playingSound === soundItem.id ? styles.playingCard : {}),
                borderLeftColor: soundItem.color
              }}
              onPress={() => playSound(soundItem.id)}
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
              
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <AccessibleButton
                  style={[styles.playIndicator, { backgroundColor: soundItem.color }]}
                  onPress={() => playSound(soundItem.id)}
                >
                  {playingSound === soundItem.id && isPlaying ? (
                    <Pause size={20} color="#FFFFFF" />
                  ) : (
                    <Play size={20} color="#FFFFFF" />
                  )}
                </AccessibleButton>

                <AccessibleButton
                  style={[styles.playIndicator, { backgroundColor: '#4CAF50' }]}
                  onPress={() => downloadSound(soundItem.id, soundItem.url)}
                >
                  <Download size={20} color="#FFFFFF" />
                </AccessibleButton>
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
              >
                <Square size={24} color="#F44336" />
              </AccessibleButton>

              <AccessibleButton
                style={{
                  ...styles.controlButton,
                  ...(isLooping ? styles.activeControl : {})
                }}
                onPress={toggleLoop}
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
  container: { flex: 1, backgroundColor: '#F8FCFF' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: 20,
    backgroundColor: '#E5F1FC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  backButtonText: { fontSize: 16, color: '#1976D2', fontWeight: '600', marginLeft: 4 },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1976D2', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#666666', textAlign: 'center', marginBottom: 32, fontWeight: '500' },
  soundsList: { gap: 16, paddingBottom: 20 },
  soundCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  playingCard: { backgroundColor: '#F3F9FF', borderWidth: 2, borderColor: '#2196F3' },
  soundInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  soundIconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  soundIcon: { fontSize: 28 },
  soundText: { flex: 1 },
  soundName: { fontSize: 20, fontWeight: 'bold', color: '#333333', marginBottom: 4 },
  soundDescription: { fontSize: 14, color: '#000000', fontWeight: '500' }, // Negro
  playIndicator: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  playerControls: { backgroundColor: '#E8F5E8', padding: 20, borderRadius: 16, marginTop: 20, alignItems: 'center' },
  nowPlayingText: { fontSize: 16, color: '#2E7D32', fontWeight: '600', marginBottom: 16 },
  controlButtons: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  controlButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  activeControl: { backgroundColor: '#4CAF50' },
});

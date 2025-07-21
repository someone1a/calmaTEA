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
  Dimensions,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, Calendar, Clock } from 'lucide-react-native';
import { useEmotion } from '@/contexts/EmotionContext';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;
interface EmotionTrackerProps {
  onClose: () => void;
}

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const emotions: Emotion[] = [
  { 
    id: 'feliz', 
    name: 'Feliz', 
    emoji: '😊', 
    color: '#4CAF50',
    description: 'Me siento alegre y contento'
  },
  { 
    id: 'neutral', 
    name: 'Neutral', 
    emoji: '😐', 
    color: '#9E9E9E',
    description: 'Me siento normal, ni bien ni mal'
  },
  { 
    id: 'triste', 
    name: 'Triste', 
    emoji: '😢', 
    color: '#2196F3',
    description: 'Me siento triste o melancólico'
  },
  { 
    id: 'enojado', 
    name: 'Enojado', 
    emoji: '😠', 
    color: '#F44336',
    description: 'Me siento molesto o frustrado'
  },
  { 
    id: 'ansioso', 
    name: 'Ansioso', 
    emoji: '😰', 
    color: '#FF9800',
    description: 'Me siento nervioso o preocupado'
  },
];

export const EmotionTracker: React.FC<EmotionTrackerProps> = ({ onClose }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { emotions: emotionHistory, addEmotion } = useEmotion();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, []);

  const handleEmotionSelect = async (emotion: Emotion) => {
    setSelectedEmotion(emotion.id);
    
    try {
      await addEmotion(emotion.name, emotion.emoji);
      
      Alert.alert(
        '¡Emoción Registrada!',
        `Has registrado que te sientes ${emotion.name.toLowerCase()} ${emotion.emoji}`,
        [
          { text: 'Ver Historial', onPress: () => setShowHistory(true) },
          { text: 'Continuar', style: 'default' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar tu emoción. Inténtalo de nuevo.');
    }
  };

  const getTodayEmotions = () => {
    const today = new Date().toLocaleDateString('es-ES');
    return emotionHistory.filter(emotion => emotion.date === today);
  };

  const getRecentEmotions = () => {
    return emotionHistory.slice(0, 10);
  };

  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);
  const todayEmotions = getTodayEmotions();

  if (showHistory) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF3D6" translucent={false} />
        
        <View style={styles.header}>
          <AccessibleButton
            style={styles.backButton}
            onPress={() => setShowHistory(false)}
            accessibilityLabel="Volver al rastreador de emociones"
          >
            <ChevronLeft size={24} color="#F57C00" />
            <Text style={styles.backButtonText}>Volver</Text>
          </AccessibleButton>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Historial de Emociones</Text>
          
          <View style={styles.todaySection}>
            <Text style={styles.sectionTitle}>Hoy ({todayEmotions.length} registros)</Text>
            {todayEmotions.length > 0 ? (
              <View style={styles.emotionsList}>
                {todayEmotions.map((emotion) => (
                  <View key={emotion.id} style={styles.emotionHistoryItem}>
                    <Text style={styles.emotionHistoryEmoji}>{emotion.emoji}</Text>
                    <View style={styles.emotionHistoryText}>
                      <Text style={styles.emotionHistoryName}>{emotion.emotion}</Text>
                      <Text style={styles.emotionHistoryTime}>{emotion.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noEmotionsText}>No has registrado emociones hoy</Text>
            )}
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Registros Recientes</Text>
            <ScrollView style={styles.recentList} showsVerticalScrollIndicator={false}>
              {getRecentEmotions().map((emotion) => (
                <View key={emotion.id} style={styles.emotionHistoryItem}>
                  <Text style={styles.emotionHistoryEmoji}>{emotion.emoji}</Text>
                  <View style={styles.emotionHistoryText}>
                    <Text style={styles.emotionHistoryName}>{emotion.emotion}</Text>
                    <View style={styles.emotionHistoryMeta}>
                      <Calendar size={12} color="#666666" />
                      <Text style={styles.emotionHistoryDate}>{emotion.date}</Text>
                      <Clock size={12} color="#666666" />
                      <Text style={styles.emotionHistoryTime}>{emotion.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF3D6" translucent={false} />
      
      <View style={styles.header}>
        <AccessibleButton
          style={styles.backButton}
          onPress={onClose}
          accessibilityLabel="Cerrar rastreador de emociones"
          accessibilityHint="Volver a las herramientas de relajación"
        >
          <ChevronLeft size={24} color="#F57C00" />
          <Text style={styles.backButtonText}>Volver</Text>
        </AccessibleButton>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>¿Cómo te Sientes Hoy?</Text>
        <Text style={styles.subtitle}>
          Toca la emoción que mejor describe cómo te sientes ahora
        </Text>

        {todayEmotions.length > 0 && (
          <View style={styles.todayPreview}>
            <Text style={styles.todayPreviewText}>
              Hoy has registrado {todayEmotions.length} emoción{todayEmotions.length > 1 ? 'es' : ''}
            </Text>
            <AccessibleButton
              style={styles.historyButton}
              onPress={() => setShowHistory(true)}
              accessibilityLabel="Ver historial completo de emociones"
            >
              <Text style={styles.historyButtonText}>Ver Historial</Text>
            </AccessibleButton>
          </View>
        )}

        <ScrollView 
          contentContainerStyle={styles.emotionsGrid}
          showsVerticalScrollIndicator={false}
        >
          {emotions.map((emotion) => (
            <AccessibleButton
              key={emotion.id}
              style={[
                styles.emotionCard,
                selectedEmotion === emotion.id && styles.selectedCard,
                { borderColor: emotion.color },
              ]}
              onPress={() => handleEmotionSelect(emotion)}
              accessibilityLabel={`Emoción ${emotion.name}`}
              accessibilityHint={`Seleccionar ${emotion.name} como tu emoción actual. ${emotion.description}`}
            >
              <Text style={styles.emotionIcon}>{emotion.emoji}</Text>
              <Text style={[styles.emotionName, { color: emotion.color }]}>
                {emotion.name}
              </Text>
              <Text style={styles.emotionDescription}>
                {emotion.description}
              </Text>
            </AccessibleButton>
          ))}
        </ScrollView>

        {selectedEmotionData && (
          <View style={[styles.selectedEmotionCard, { backgroundColor: selectedEmotionData.color + '20' }]}>
            <Text style={styles.selectedEmotionText}>
              Te sientes {selectedEmotionData.name.toLowerCase()} {selectedEmotionData.emoji}
            </Text>
            <Text style={styles.encouragementText}>
              {getEncouragementText(selectedEmotionData.id)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const getEncouragementText = (emotionId: string): string => {
  const encouragements = {
    feliz: "¡Qué maravilloso! Disfruta de este sentimiento positivo.",
    neutral: "Está bien sentirse así. Cada día es diferente.",
    triste: "Es normal sentirse triste a veces. Tómate tu tiempo y sé amable contigo mismo.",
    enojado: "Respira profundo. Este sentimiento pasará.",
    ansioso: "Prueba algunos ejercicios de respiración. Estás seguro/a aquí.",
  };
  return encouragements[emotionId] || "Todos los sentimientos son válidos. Estás haciendo un gran trabajo.";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF7',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    padding: 20,
    backgroundColor: '#FFF3D6',
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
    color: '#F57C00',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: isTablet ? 32 : 20,
    maxWidth: isLargeScreen ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: 'bold',
    color: '#F57C00',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 20 : 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: isTablet ? 32 : 24,
    fontWeight: '500',
    lineHeight: isTablet ? 28 : 22,
  },
  todayPreview: {
    backgroundColor: '#E8F5E8',
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    marginBottom: isTablet ? 32 : 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayPreviewText: {
    fontSize: isTablet ? 16 : 14,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  historyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  emotionsGrid: {
    gap: isTablet ? 20 : 16,
    ...(isTablet && {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
  },
  emotionCard: {
    backgroundColor: '#FFFFFF',
    padding: isTablet ? 28 : 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    ...(isTablet && {
      width: '48%',
      marginBottom: 16,
    }),
  },
  selectedCard: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  emotionIcon: {
    fontSize: isTablet ? 72 : 56,
    marginBottom: isTablet ? 16 : 12,
  },
  emotionName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isTablet ? 12 : 8,
  },
  emotionDescription: {
    fontSize: isTablet ? 16 : 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedEmotionCard: {
    padding: isTablet ? 28 : 20,
    borderRadius: 16,
    marginTop: isTablet ? 32 : 24,
    alignItems: 'center',
  },
  selectedEmotionText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: isTablet ? 18 : 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: isTablet ? 20 : 16,
  },
  todaySection: {
    marginBottom: isTablet ? 32 : 24,
  },
  recentSection: {
    flex: 1,
  },
  emotionsList: {
    gap: isTablet ? 16 : 12,
  },
  recentList: {
    flex: 1,
  },
  emotionHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    marginBottom: isTablet ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emotionHistoryEmoji: {
    fontSize: isTablet ? 40 : 32,
    marginRight: isTablet ? 20 : 16,
  },
  emotionHistoryText: {
    flex: 1,
  },
  emotionHistoryName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  emotionHistoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emotionHistoryDate: {
    fontSize: isTablet ? 14 : 12,
    color: '#666666',
    marginRight: 8,
  },
  emotionHistoryTime: {
    fontSize: isTablet ? 14 : 12,
    color: '#666666',
  },
  noEmotionsText: {
    fontSize: isTablet ? 18 : 16,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: isTablet ? 28 : 20,
  },
});
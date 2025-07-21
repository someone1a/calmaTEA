import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EmotionEntry {
  id: string;
  emotion: string;
  emoji: string;
  date: string;
  time: string;
  timestamp: number;
}

interface EmotionContextType {
  emotions: EmotionEntry[];
  addEmotion: (emotion: string, emoji: string) => Promise<void>;
  getEmotionsForDate: (date: string) => EmotionEntry[];
  isLoading: boolean;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const emotionsData = await AsyncStorage.getItem('emotion_history');
      if (emotionsData) {
        setEmotions(JSON.parse(emotionsData));
      }
    } catch (error) {
      console.error('Error al cargar el historial de emociones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmotions = async (updatedEmotions: EmotionEntry[]) => {
    try {
      await AsyncStorage.setItem('emotion_history', JSON.stringify(updatedEmotions));
    } catch (error) {
      console.error('Error al guardar el historial de emociones:', error);
    }
  };

  const addEmotion = async (emotion: string, emoji: string) => {
    const now = new Date();
    const newEmotion: EmotionEntry = {
      id: Date.now().toString(),
      emotion,
      emoji,
      date: now.toLocaleDateString('es-ES'),
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    };

    const updatedEmotions = [newEmotion, ...emotions];
    setEmotions(updatedEmotions);
    await saveEmotions(updatedEmotions);
  };

  const getEmotionsForDate = (date: string) => {
    return emotions.filter(emotion => emotion.date === date);
  };

  return (
    <EmotionContext.Provider value={{ emotions, addEmotion, getEmotionsForDate, isLoading }}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error('useEmotion debe ser usado dentro de un EmotionProvider');
  }
  return context;
};
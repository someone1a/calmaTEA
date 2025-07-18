import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CommunicationCard {
  id: string;
  text: string;
  icon: string;
  isCustom?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

interface CommunicationContextType {
  cards: CommunicationCard[];
  addCard: (text: string, icon: string) => Promise<void>;
  updateCard: (card: CommunicationCard) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  isLoading: boolean;
}

const defaultCards: CommunicationCard[] = [
  { id: '1', text: 'Necesito ayuda', icon: '🙋', isCustom: false },
  { id: '2', text: 'Tengo hambre', icon: '🍽️', isCustom: false },
  { id: '3', text: 'Me siento abrumado/a', icon: '😰', isCustom: false },
  { id: '4', text: 'Gracias', icon: '🙏', isCustom: false },
  { id: '5', text: 'Más por favor', icon: '➕', isCustom: false },
  { id: '6', text: 'Estoy cansado/a', icon: '😴', isCustom: false },
  { id: '7', text: 'No entiendo', icon: '🤔', isCustom: false },
  { id: '8', text: 'Me siento bien', icon: '😊', isCustom: false },
];

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CommunicationCard[]>(defaultCards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const cardsData = await AsyncStorage.getItem('communication_cards');
      if (cardsData) {
        const customCards = JSON.parse(cardsData);
        setCards([...defaultCards, ...customCards]);
      }
    } catch (error) {
      console.error('Error al cargar las cartas de comunicación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomCards = async (customCards: CommunicationCard[]) => {
    try {
      await AsyncStorage.setItem('communication_cards', JSON.stringify(customCards));
    } catch (error) {
      console.error('Error al guardar las cartas de comunicación:', error);
    }
  };

  const addCard = async (text: string, icon: string) => {
    const newCard: CommunicationCard = {
      id: Date.now().toString(),
      text,
      icon,
      isCustom: true,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    
    // Save only custom cards
    const customCards = updatedCards.filter(card => card.isCustom);
    await saveCustomCards(customCards);
  };

  const updateCard = async (updatedCard: CommunicationCard) => {
    const updatedCards = cards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    setCards(updatedCards);
    
    // Save only custom cards
    const customCards = updatedCards.filter(card => card.isCustom);
    await saveCustomCards(customCards);
  };

  const deleteCard = async (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    
    // Save only custom cards
    const customCards = updatedCards.filter(card => card.isCustom);
    await saveCustomCards(customCards);
  };

  return (
    <CommunicationContext.Provider value={{ cards, addCard, updateCard, deleteCard, isLoading }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication debe ser usado dentro de un CommunicationProvider');
  }
  return context;
};
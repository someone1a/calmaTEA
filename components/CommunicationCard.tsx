import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { Trash2 } from 'lucide-react-native';

interface CommunicationCardType {
  id: string;
  text: string;
  icon: string;
  isCustom?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

interface CommunicationCardProps {
  card: CommunicationCardType;
  onPress: (card: CommunicationCardType) => void;
  onDelete?: (cardId: string) => void;
}

export const CommunicationCard: React.FC<CommunicationCardProps> = ({ 
  card, 
  onPress, 
  onDelete 
}) => {
  const handlePress = () => {
    onPress(card);
  };

  const handleDelete = () => {
    if (card.isCustom && onDelete) {
      Alert.alert(
        'Eliminar Carta',
        '¿Estás seguro de que quieres eliminar esta carta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(card.id) },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <AccessibleButton
        style={[
          styles.cardButton,
          { backgroundColor: card.backgroundColor || '#FFFFFF' }
        ]}
        onPress={handlePress}
        accessibilityLabel={`Carta de comunicación: ${card.text}`}
        accessibilityHint={`Toca para comunicar: ${card.text}`}
      >
        <Text style={styles.cardIcon}>{card.icon}</Text>
        <Text 
          style={[
            styles.cardText,
            { 
              color: card.textColor || '#333333',
              fontSize: card.fontSize || 18,
            }
          ]}
        >
          {card.text}
        </Text>
      </AccessibleButton>

      {card.isCustom && onDelete && (
        <AccessibleButton
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityLabel="Eliminar carta"
          accessibilityHint={`Eliminar la carta de comunicación: ${card.text}`}
        >
          <Trash2 size={20} color="#F44336" />
        </AccessibleButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  cardButton: {
    borderRadius: 16,
    padding: 24,
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
    borderWidth: 2,
    borderColor: '#9C27B0',
    minHeight: 120,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardText: {
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
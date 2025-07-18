import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { CommunicationCard } from '@/components/CommunicationCard';
import { CommunicationCardModal } from '@/components/CommunicationCardModal';
import { useCommunication } from '@/contexts/CommunicationContext';
import { Plus, X } from 'lucide-react-native';

interface CommunicationCardType {
  id: string;
  text: string;
  icon: string;
  isCustom?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

export default function CommunicationScreen() {
  const { cards, addCard, updateCard, deleteCard } = useCommunication();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CommunicationCardType | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardText, setNewCardText] = useState('');
  const [newCardIcon, setNewCardIcon] = useState('');

  const handleCardPress = (card: CommunicationCardType) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCardSave = (updatedCard: CommunicationCardType) => {
    updateCard(updatedCard);
    setSelectedCard(updatedCard);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  const handleAddCard = () => {
    if (newCardText.trim()) {
      addCard(newCardText.trim(), newCardIcon.trim() || '💬');
      setNewCardText('');
      setNewCardIcon('');
      setShowAddModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cartas de Comunicación</Text>
        <Text style={styles.headerSubtitle}>
          Expresa tus necesidades fácilmente
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <CommunicationCard
              key={card.id}
              card={card}
              onPress={handleCardPress}
              onDelete={deleteCard}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AccessibleButton
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          accessibilityLabel="Agregar nueva carta de comunicación"
          accessibilityHint="Abre el formulario para crear una carta personalizada"
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Agregar Carta</Text>
        </AccessibleButton>
      </View>

      {/* Modal para mostrar carta de comunicación */}
      {selectedCard && (
        <CommunicationCardModal
          card={selectedCard}
          visible={showCardModal}
          onClose={handleCloseCardModal}
          onSave={handleCardSave}
        />
      )}

      {/* Modal para agregar nueva carta */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar Nueva Carta</Text>
            <AccessibleButton
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
              accessibilityLabel="Cerrar formulario de nueva carta"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Texto de la Carta *</Text>
              <TextInput
                style={styles.textInput}
                value={newCardText}
                onChangeText={setNewCardText}
                placeholder="Escribe el texto de la carta"
                accessibilityLabel="Campo de texto de la carta"
                accessibilityHint="Escribe el texto para tu nueva carta de comunicación"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Icono (opcional)</Text>
              <TextInput
                style={styles.textInput}
                value={newCardIcon}
                onChangeText={setNewCardIcon}
                placeholder="Escribe un emoji (ej: 🙋)"
                accessibilityLabel="Campo de icono de la carta"
                accessibilityHint="Escribe un emoji para representar tu carta"
              />
            </View>

            <View style={styles.modalButtons}>
              <AccessibleButton
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
                accessibilityLabel="Cancelar agregar carta"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </AccessibleButton>

              <AccessibleButton
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCard}
                accessibilityLabel="Guardar nueva carta"
                accessibilityHint="Guarda la carta y cierra el formulario"
              >
                <Text style={styles.saveButtonText}>Agregar Carta</Text>
              </AccessibleButton>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#F3E5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7B1FA2',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  cardsGrid: {
    gap: 16,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
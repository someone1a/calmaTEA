import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { X, CreditCard as Edit3, Palette, Save } from 'lucide-react-native';

interface CommunicationCardType {
  id: string;
  text: string;
  icon: string;
  isCustom?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

interface CommunicationCardModalProps {
  card: CommunicationCardType;
  visible: boolean;
  onClose: () => void;
  onSave?: (updatedCard: CommunicationCardType) => void;
  onSpeak?: (text: string) => void;
}

export const CommunicationCardModal: React.FC<CommunicationCardModalProps> = ({
  card,
  visible,
  onClose,
  onSave,
  onSpeak,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<CommunicationCardType>(card);

  // Colores predefinidos para personalización
  const predefinedColors = [
    '#9C27B0', '#2196F3', '#4CAF50', '#FF9800', 
    '#F44336', '#795548', '#607D8B', '#E91E63'
  ];

  // Tamaños de fuente predefinidos
  const fontSizes = [24, 28, 32, 36, 40];

  const handleSpeakCard = () => {
    // Simular Text-to-Speech - en una implementación real usarías expo-speech
    if (onSpeak) {
      onSpeak(editedCard.text);
    } else {
      Alert.alert('Comunicación', editedCard.text, [{ text: 'Entendido' }]);
    }
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(editedCard);
    }
    setIsEditing(false);
    Alert.alert('Éxito', 'Los cambios han sido guardados correctamente');
  };

  const handleColorChange = (color: string) => {
    setEditedCard(prev => ({ ...prev, backgroundColor: color }));
  };

  const handleFontSizeChange = (size: number) => {
    setEditedCard(prev => ({ ...prev, fontSize: size }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Encabezado del modal */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Personalizar Carta' : 'Carta de Comunicación'}
          </Text>
          <View style={styles.headerButtons}>
            {card.isCustom && (
              <AccessibleButton
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
                accessibilityLabel={isEditing ? "Cancelar edición" : "Editar carta"}
                accessibilityHint="Permite personalizar el contenido y apariencia de la carta"
              >
                <Edit3 size={20} color="#2196F3" />
              </AccessibleButton>
            )}
            <AccessibleButton
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Cerrar modal"
              accessibilityHint="Cierra la vista de la carta de comunicación"
            >
              <X size={24} color="#757575" />
            </AccessibleButton>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* Vista previa de la carta */}
          <View style={styles.cardPreviewSection}>
            <Text style={styles.sectionTitle}>Vista Previa</Text>
            <View 
              style={[
                styles.cardPreview,
                { 
                  backgroundColor: editedCard.backgroundColor || '#F3E5F5',
                }
              ]}
            >
              <Text style={styles.cardPreviewIcon}>{editedCard.icon}</Text>
              <Text 
                style={[
                  styles.cardPreviewText,
                  { 
                    color: editedCard.textColor || '#333333',
                    fontSize: editedCard.fontSize || 32,
                  }
                ]}
              >
                {editedCard.text}
              </Text>
            </View>

            {/* Botón principal para usar la carta */}
            <AccessibleButton
              style={styles.speakButton}
              onPress={handleSpeakCard}
              accessibilityLabel={`Comunicar: ${editedCard.text}`}
              accessibilityHint="Reproduce el mensaje de la carta de comunicación"
            >
              <Text style={styles.speakButtonText}>
                💬 Comunicar Mensaje
              </Text>
            </AccessibleButton>
          </View>

          {/* Panel de edición (solo visible cuando se está editando) */}
          {isEditing && (
            <View style={styles.editingPanel}>
              {/* Editar texto */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Texto del Mensaje</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedCard.text}
                  onChangeText={(text) => setEditedCard(prev => ({ ...prev, text }))}
                  placeholder="Escribe tu mensaje aquí"
                  accessibilityLabel="Campo de texto del mensaje"
                  accessibilityHint="Edita el texto que aparecerá en la carta"
                  multiline
                />
              </View>

              {/* Editar icono */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Icono (Emoji)</Text>
                <TextInput
                  style={styles.iconInput}
                  value={editedCard.icon}
                  onChangeText={(icon) => setEditedCard(prev => ({ ...prev, icon }))}
                  placeholder="🙋"
                  accessibilityLabel="Campo de icono"
                  accessibilityHint="Cambia el emoji que representa la carta"
                />
              </View>

              {/* Seleccionar color de fondo */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Color de Fondo</Text>
                <View style={styles.colorPalette}>
                  {predefinedColors.map((color) => (
                    <AccessibleButton
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        editedCard.backgroundColor === color && styles.selectedColor
                      ]}
                      onPress={() => handleColorChange(color)}
                      accessibilityLabel={`Seleccionar color ${color}`}
                      accessibilityHint="Cambia el color de fondo de la carta"
                    />
                  ))}
                </View>
              </View>

              {/* Seleccionar tamaño de fuente */}
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Tamaño de Texto</Text>
                <View style={styles.fontSizeOptions}>
                  {fontSizes.map((size) => (
                    <AccessibleButton
                      key={size}
                      style={[
                        styles.fontSizeOption,
                        editedCard.fontSize === size && styles.selectedFontSize
                      ]}
                      onPress={() => handleFontSizeChange(size)}
                      accessibilityLabel={`Tamaño de fuente ${size}`}
                      accessibilityHint="Cambia el tamaño del texto en la carta"
                    >
                      <Text style={[styles.fontSizeText, { fontSize: size / 2 }]}>
                        Aa
                      </Text>
                    </AccessibleButton>
                  ))}
                </View>
              </View>

              {/* Botón para guardar cambios */}
              <AccessibleButton
                style={styles.saveButton}
                onPress={handleSaveChanges}
                accessibilityLabel="Guardar cambios"
                accessibilityHint="Guarda todas las personalizaciones realizadas"
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </AccessibleButton>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 20,
  },
  cardPreviewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardPreview: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPreviewIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  cardPreviewText: {
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
  },
  speakButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editingPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  iconInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 32,
    color: '#333333',
    textAlign: 'center',
    width: 80,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333333',
    transform: [{ scale: 1.1 }],
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  fontSizeOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFontSize: {
    borderColor: '#9C27B0',
    backgroundColor: '#F3E5F5',
  },
  fontSizeText: {
    fontWeight: 'bold',
    color: '#333333',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
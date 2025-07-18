import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { AccessibleButton } from '@/components/AccessibleButton';
import { PictogramGuide } from '@/components/PictogramGuide';
import { guidesData } from '@/data/guidesData';
import { ChevronLeft } from 'lucide-react-native';

export default function GuidesScreen() {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleGuideSelect = (guide) => {
    setSelectedGuide(guide);
    setShowGuideModal(true);
  };

  const handleCloseGuide = () => {
    setShowGuideModal(false);
    setSelectedGuide(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pictogramas Y guías</Text>
        <Text style={styles.headerSubtitle}>
          Guías paso a paso para actividades diarias
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.guidesGrid}>
          {guidesData.map((guide) => (
            <AccessibleButton
              key={guide.id}
              style={styles.guideCard}
              onPress={() => handleGuideSelect(guide)}
              accessibilityLabel={`Abrir guía: ${guide.title}`}
              accessibilityHint={`Ver instrucciones paso a paso para la guía: ${guide.title.toLowerCase()}`}
            >
              <Text style={styles.guideIcon}>{guide.icon}</Text>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.guideDescription}>{guide.description}</Text>
              <Text style={styles.stepCount}>
                {guide.steps.length} Pasos
              </Text>
            </AccessibleButton>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showGuideModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseGuide}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <AccessibleButton
              style={styles.backButton}
              onPress={handleCloseGuide}
              accessibilityLabel="Cerrar guía"
              accessibilityHint="Volver al listado de guias"
            >
              <ChevronLeft size={24} color="#2196F3" />
              <Text style={styles.backButtonText}>Atras</Text>
            </AccessibleButton>
          </View>
          
          {selectedGuide && (
            <PictogramGuide
              guide={selectedGuide}
              onClose={handleCloseGuide}
            />
          )}
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
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  guidesGrid: {
    gap: 16,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  guideIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  guideDescription: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  stepCount: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
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
});
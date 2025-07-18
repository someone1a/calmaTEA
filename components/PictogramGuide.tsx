import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

interface PictogramGuideProps {
  guide: Guide;
  onClose: () => void;
}

export const PictogramGuide: React.FC<PictogramGuideProps> = ({ guide, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = guide.steps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.progress}>
          Step {currentStep + 1} of {guide.steps.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepCard}>
          <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / guide.steps.length) * 100}%` }
            ]}
          />
        </View>
      </ScrollView>

      <View style={styles.navigationButtons}>
        <AccessibleButton
          style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
          onPress={goToPreviousStep}
          disabled={currentStep === 0}
          accessibilityLabel="Previous step"
          accessibilityHint="Go to the previous step in the guide"
        >
          <ChevronLeft size={24} color={currentStep === 0 ? '#BDBDBD' : '#2196F3'} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledText]}>
            Previous
          </Text>
        </AccessibleButton>

        <AccessibleButton
          style={[styles.navButton, currentStep === guide.steps.length - 1 && styles.disabledButton]}
          onPress={goToNextStep}
          disabled={currentStep === guide.steps.length - 1}
          accessibilityLabel="Next step"
          accessibilityHint="Go to the next step in the guide"
        >
          <Text style={[styles.navButtonText, currentStep === guide.steps.length - 1 && styles.disabledText]}>
            Next
          </Text>
          <ChevronRight size={24} color={currentStep === guide.steps.length - 1 ? '#BDBDBD' : '#2196F3'} />
        </AccessibleButton>
      </View>

      {currentStep === guide.steps.length - 1 && (
        <View style={styles.completionSection}>
          <Text style={styles.completionText}>Great job! You've completed this guide! 🎉</Text>
          <AccessibleButton
            style={styles.finishButton}
            onPress={onClose}
            accessibilityLabel="Finish guide"
            accessibilityHint="Complete the guide and return to the guides list"
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </AccessibleButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  progress: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  stepIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  disabledText: {
    color: '#BDBDBD',
  },
  completionSection: {
    padding: 20,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
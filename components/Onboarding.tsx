import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AccessibleButton } from './AccessibleButton';
import { useUser } from '@/contexts/UserContext';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const { setUser } = useUser();

  const handleComplete = async () => {
    if (name.trim()) {
      await setUser({ name: name.trim() });
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>¡Bienvenido/a! 🌟</Text>
          <Text style={styles.subtitle}>
            Vamos a conocerte mejor
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>¿Cuál es tu nombre?</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Escribe tu nombre"
              accessibilityLabel="Campo de nombre"
              accessibilityHint="Escribe tu nombre para personalizar la aplicación"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleComplete}
            />
          </View>

          <AccessibleButton
            style={styles.continueButton}
            onPress={handleComplete}
            accessibilityLabel="Continuar a la aplicación"
            accessibilityHint="Guardar tu nombre y continuar a la aplicación principal"
            disabled={!name.trim()}
          >
            <Text style={styles.continueButtonText}>¡Empecemos!</Text>
          </AccessibleButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
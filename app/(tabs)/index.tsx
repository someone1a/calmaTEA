import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { AccessibleButton } from '@/components/AccessibleButton';
import { Onboarding } from '@/components/Onboarding';
import { Book, Heart, SquareCheck as CheckSquare, MessageCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !user?.name) {
      setShowOnboarding(true);
    }
  }, [isLoading, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>
            ¡Hola, {user?.name || 'Amigo/a'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            ¿Qué te gustaría hacer hoy?
          </Text>
        </View>

        <View style={styles.menuGrid}>
          <AccessibleButton
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/guides')}
            accessibilityLabel="Abrir sección de Pictogramas y Guías"
            accessibilityHint="Ver guías paso a paso para actividades diarias"
          >
            <Book size={48} color="#2196F3" />
            <Text style={styles.menuButtonText}>Pictogramas y Guías</Text>
            <Text style={styles.menuButtonSubtext}>
              Actividades diarias paso a paso
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/relaxation')}
            accessibilityLabel="Abrir sección de Autorregulación y Relajación"
            accessibilityHint="Acceder a ejercicios de respiración y actividades calmantes"
          >
            <Heart size={48} color="#4CAF50" />
            <Text style={styles.menuButtonText}>Autorregulación</Text>
            <Text style={styles.menuButtonSubtext}>
              Respiración y actividades calmantes
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/tasks')}
            accessibilityLabel="Abrir sección de Tareas Pendientes"
            accessibilityHint="Gestionar tus tareas y actividades diarias"
          >
            <CheckSquare size={48} color="#FF9800" />
            <Text style={styles.menuButtonText}>Tareas Pendientes</Text>
            <Text style={styles.menuButtonSubtext}>
              Seguimiento de actividades diarias
            </Text>
          </AccessibleButton>

          <AccessibleButton
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)/communication')}
            accessibilityLabel="Abrir sección de Cartas de Comunicación"
            accessibilityHint="Usar cartas de comunicación para expresar tus necesidades"
          >
            <MessageCircle size={48} color="#9C27B0" />
            <Text style={styles.menuButtonText}>Comunicación</Text>
            <Text style={styles.menuButtonSubtext}>
              Expresa tus necesidades fácilmente
            </Text>
          </AccessibleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '600',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuGrid: {
    gap: 16,
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    padding: 24,
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
    minHeight: 140,
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    textAlign: 'center',
  },
  menuButtonSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});
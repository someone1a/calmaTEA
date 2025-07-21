import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { UserProvider } from '@/contexts/UserContext';
import { TasksProvider } from '@/contexts/TasksContext';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { EmotionProvider } from '@/contexts/EmotionContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    setStatusBarStyle('dark');
  }, []);

  return (
    <UserProvider>
      <TasksProvider>
        <CommunicationProvider>
          <EmotionProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" backgroundColor="transparent" translucent />
          </EmotionProvider>
        </CommunicationProvider>
      </TasksProvider>
    </UserProvider>
  );
}
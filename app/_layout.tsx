import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/contexts/UserContext';
import { TasksProvider } from '@/contexts/TasksContext';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <UserProvider>
      <TasksProvider>
        <CommunicationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CommunicationProvider>
      </TasksProvider>
    </UserProvider>
  );
}
import { Tabs } from 'expo-router';
import { Chrome as Home, Book, Heart, SquareCheck as CheckSquare, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 2,
          borderTopColor: '#E0E0E0',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guías',
          tabBarIcon: ({ size, color }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="relaxation"
        options={{
          title: 'Relajación',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ size, color }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="communication"
        options={{
          title: 'Comunicación',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
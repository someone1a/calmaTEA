import { Tabs } from 'expo-router';
import { Dimensions } from 'react-native';
import { Chrome as Home, Book, Heart, SquareCheck as CheckSquare, MessageCircle } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#F0F0F0',
          height: isTablet ? 100 : 85,
          paddingBottom: isTablet ? 16 : 12,
          paddingTop: isTablet ? 16 : 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: isTablet ? 15 : 13,
          fontWeight: '700',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Home size={isTablet ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guías',
          tabBarIcon: ({ size, color }) => (
            <Book size={isTablet ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="relaxation"
        options={{
          title: 'Autorregulación',
          tabBarIcon: ({ size, color }) => (
            <Heart size={isTablet ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ size, color }) => (
            <CheckSquare size={isTablet ? size + 4 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="communication"
        options={{
          title: 'Comunicación',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={isTablet ? size + 4 : size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
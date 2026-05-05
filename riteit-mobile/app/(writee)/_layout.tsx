import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';

export default function WriteeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.8)' : 'transparent',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarBackground: () => (
          Platform.OS !== 'web' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : null
        ),
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-order"
        options={{
          title: 'New Order',
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

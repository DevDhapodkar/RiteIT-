import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  delay?: number;
}

export default function GlassCard({ children, style, intensity = 45, delay = 0 }: GlassCardProps) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(700).springify().damping(14)} 
      style={[styles.container, style]}
    >
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.glassBackground} />
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // Richer frost tint
  },
  content: {
    padding: 24,
  },
});

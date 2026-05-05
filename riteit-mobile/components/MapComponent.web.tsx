import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface MapComponentProps {
  style?: ViewStyle;
  writeeLocation: { latitude: number; longitude: number };
  writerLocation: { latitude: number; longitude: number };
}

export default function MapComponent({ style }: MapComponentProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🗺️ Map Interface (Not supported on Web yet)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  }
});

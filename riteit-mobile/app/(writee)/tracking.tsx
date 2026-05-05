import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import MapComponent from '../../components/MapComponent';

export default function Tracking() {
  // Mock coordinates for demonstration
  const writeeLocation = { latitude: 18.5204, longitude: 73.8567 }; // Pune
  const writerLocation = { latitude: 18.5300, longitude: 73.8600 }; 

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Track Delivery</Text>
        
        <GlassCard style={styles.mapCard}>
          <View style={styles.mapContainer}>
            <MapComponent 
              writeeLocation={writeeLocation} 
              writerLocation={writerLocation} 
            />
            <View style={styles.etaOverlay}>
              <Text style={styles.etaText}>ETA: 15 mins</Text>
            </View>
          </View>

          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>Rider: Amit Kumar (Porter)</Text>
            <Text style={styles.riderVehicle}>Vehicle: MH-12-AB-1234</Text>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
    color: '#333',
    letterSpacing: 0.5,
  },
  mapCard: {
    marginBottom: 30,
    padding: 10,
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  etaOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  etaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007AFF',
  },
  riderInfo: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  riderName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
    color: '#333',
  },
  riderVehicle: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  backButton: {
    padding: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: 15,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

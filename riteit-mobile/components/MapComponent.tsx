import React from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet, ViewStyle } from 'react-native';

interface MapComponentProps {
  style?: ViewStyle;
  writeeLocation: { latitude: number; longitude: number };
  writerLocation: { latitude: number; longitude: number };
}

export default function MapComponent({ style, writeeLocation, writerLocation }: MapComponentProps) {
  return (
    <MapView 
      style={[StyleSheet.absoluteFillObject, style]}
      initialRegion={{
        latitude: 18.5250,
        longitude: 73.8580,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
    >
      <Marker 
        coordinate={writeeLocation} 
        title="You" 
        description="Delivery Destination" 
        pinColor="blue"
      />
      <Marker 
        coordinate={writerLocation} 
        title="Porter" 
        description="Arriving soon" 
        pinColor="green"
      />
    </MapView>
  );
}

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function CreateOrder() {
  const { user } = useAuth();
  const [bookType, setBookType] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pages, setPages] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadPDF = () => {
    Alert.alert('Upload PDF', 'Document picker will open here.');
  };

  const handleSubmit = async () => {
    if (!bookType || !instructions || !pages) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an order.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        writeeId: user.uid,
        bookType,
        pages: parseInt(pages),
        instructions,
        status: 'pending',
        writerId: null,
        payout: parseInt(pages) * 20, // Example payout logic (₹20 per page)
        distance: `${(Math.random() * 5 + 1).toFixed(1)} km`, // Mock distance for now
        createdAt: serverTimestamp(),
      });
      
      Alert.alert('Order Created', 'Searching for nearby writers...', [
        { text: 'OK', onPress: () => router.push('/(writee)/home') }
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Could not create order. Please check Firebase config.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>New Assignment</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelIcon}>
            <MaterialIcons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.card}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPDF}>
            <View style={styles.uploadIconContainer}>
              <MaterialIcons name="cloud-upload" size={28} color="#8B5CF6" />
            </View>
            <View>
              <Text style={styles.uploadTitle}>Upload Assignment PDF</Text>
              <Text style={styles.uploadSub}>Tap to browse files</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Book Type</Text>
            <TextInput 
              style={styles.input} 
              value={bookType} 
              onChangeText={setBookType} 
              placeholder="e.g., Practical, Ruled, A4" 
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimated Pages</Text>
            <TextInput 
              style={styles.input} 
              value={pages} 
              onChangeText={setPages} 
              placeholder="e.g., 20" 
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={instructions} 
              onChangeText={setInstructions} 
              placeholder="e.g., Use blue pen, write on one side only." 
              multiline
              numberOfLines={4}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <AnimatedButton 
            colors={['#8B5CF6', '#6D28D9']}
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Find a Writer</Text>
            )}
          </AnimatedButton>
        </GlassCard>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 100,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  cancelIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  card: {
    padding: 24,
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  uploadIconContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
  },
  uploadTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#334155',
  },
  uploadSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    fontFamily: 'Inter_500Medium',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 120,
    paddingTop: 18,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
    minHeight: 56,
  },
  submitText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';

export default function LandingScreen() {
  const { user, role, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role) {
      if (role === 'admin') router.replace('/(admin)/home');
      else if (role === 'writer') router.replace('/(writer)/home');
      else router.replace('/(writee)/home');
    }
  }, [user, role]);

  const handleAuth = async (selectedRole?: 'writer' | 'writee') => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!selectedRole) return;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: selectedRole,
          email: userCredential.user.email,
        });
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AnimatedBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>RiteIT</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Welcome back to RiteIT' : 'Join RiteIT today'}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#8B5CF6" />
          ) : isLogin ? (
            <AnimatedButton colors={['#8B5CF6', '#6D28D9']} onPress={() => handleAuth()}>
              <Text style={styles.buttonText}>Log In</Text>
            </AnimatedButton>
          ) : (
            <View style={{ width: '100%' }}>
              <Text style={styles.roleText}>Register as:</Text>
              <AnimatedButton colors={['#8B5CF6', '#6D28D9']} onPress={() => handleAuth('writee')}>
                <Text style={styles.buttonText}>Student (Need Assignments)</Text>
              </AnimatedButton>
              <AnimatedButton colors={['#10B981', '#059669']} onPress={() => handleAuth('writer')}>
                <Text style={styles.buttonText}>Writer (Earn Money)</Text>
              </AnimatedButton>
            </View>
          )}

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 20 }}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleAuth('admin' as any)} style={{ marginTop: 10 }}>
            <Text style={styles.adminText}>Admin Login</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 48,
    marginBottom: 8,
    color: '#1E293B', // Slate 800
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#64748B', // Slate 500
  },
  input: {
    fontFamily: 'Inter_400Regular',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    color: '#334155', // Slate 700
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  roleText: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'center',
    color: '#475569', // Slate 600
  },
  switchText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#8B5CF6', // Violet 500
    textAlign: 'center',
    marginTop: 12,
  },
  adminText: {
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8', // Slate 400
    textAlign: 'center',
    fontSize: 12,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function WriteeProfile() {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(2500); // Mock balance

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {/* Apple Wallet Style Card */}
        <GlassCard style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>RiteIT Balance</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.balanceText}>₹{walletBalance.toLocaleString('en-IN')}</Text>
          
          <AnimatedButton colors={['#8B5CF6', '#6D28D9']} style={styles.addFundsBtn}>
            <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Add Funds</Text>
          </AnimatedButton>
        </GlassCard>

        {/* Settings Style List */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <MaterialIcons name="email" size={18} color="#64748B" />
            </View>
            <Text style={styles.settingsLabel}>Email</Text>
            <Text style={styles.settingsValue} numberOfLines={1}>{user?.email}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <MaterialIcons name="badge" size={18} color="#64748B" />
            </View>
            <Text style={styles.settingsLabel}>Role</Text>
            <Text style={styles.settingsValue}>Student</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
    paddingBottom: 100,
  },
  headerRow: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 36,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  walletCard: {
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 48,
    color: '#1E293B',
    marginBottom: 24,
    letterSpacing: -1,
  },
  addFundsBtn: {
    minHeight: 52,
    marginBottom: 0,
    flexDirection: 'row',
  },
  btnText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  sectionHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingsGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    marginBottom: 32,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  settingsValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#64748B',
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: 60,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 18,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#EF4444',
    fontSize: 16,
  },
});

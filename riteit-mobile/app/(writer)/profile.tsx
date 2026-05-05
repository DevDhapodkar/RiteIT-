import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function WriterProfile() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(8500); // Mock earnings

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  const handleWithdraw = () => {
    Alert.alert("Withdrawal Requested", "Your funds will be transferred to your bank account within 24 hours.");
  };

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {/* Apple Wallet Style Card for Earnings */}
        <GlassCard style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>Total Earnings</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color="#10B981" />
          </View>
          <Text style={styles.balanceText}>₹{earnings.toLocaleString('en-IN')}</Text>
          
          <AnimatedButton colors={['#10B981', '#059669']} style={styles.withdrawBtn} onPress={handleWithdraw}>
            <MaterialIcons name="account-balance" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Withdraw Funds</Text>
          </AnimatedButton>
        </GlassCard>

        {/* Settings Style List */}
        <Text style={styles.sectionHeader}>ACCOUNT DETAILS</Text>
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
              <MaterialIcons name="verified" size={18} color="#10B981" />
            </View>
            <Text style={styles.settingsLabel}>Role</Text>
            <Text style={styles.settingsValue}>Writer</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <MaterialIcons name="star" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.settingsLabel}>Rating</Text>
            <Text style={styles.settingsValue}>4.9/5.0</Text>
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
  withdrawBtn: {
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

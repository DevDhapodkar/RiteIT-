import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { router } from 'expo-router';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminHome() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
    pending: 0
  });

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let revenue = 0;
      let pending = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.payout) revenue += data.payout;
        if (data.status === 'pending') pending++;
      });
      setMetrics(prev => ({ ...prev, totalOrders: snapshot.size, revenue, pending }));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setMetrics(prev => ({ ...prev, totalUsers: snapshot.size }));
    });

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>OVERVIEW</Text>

        <View style={styles.grid}>
          {/* Revenue Widget */}
          <GlassCard style={[styles.widget, styles.widgetLarge]}>
            <View style={styles.widgetHeader}>
              <MaterialIcons name="payments" size={24} color="#10B981" />
              <Text style={styles.widgetTitle}>Total Revenue</Text>
            </View>
            <Text style={styles.widgetValueLg}>₹{metrics.revenue.toLocaleString('en-IN')}</Text>
          </GlassCard>

          {/* Pending Widget */}
          <GlassCard style={styles.widget}>
            <View style={styles.widgetHeader}>
              <MaterialIcons name="pending-actions" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.widgetValue}>{metrics.pending}</Text>
            <Text style={styles.widgetLabel}>Pending</Text>
          </GlassCard>

          {/* Orders Widget */}
          <GlassCard style={styles.widget}>
            <View style={styles.widgetHeader}>
              <MaterialIcons name="assignment" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.widgetValue}>{metrics.totalOrders}</Text>
            <Text style={styles.widgetLabel}>Orders</Text>
          </GlassCard>

          {/* Users Widget */}
          <GlassCard style={styles.widget}>
            <View style={styles.widgetHeader}>
              <MaterialIcons name="people" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.widgetValue}>{metrics.totalUsers}</Text>
            <Text style={styles.widgetLabel}>Users</Text>
          </GlassCard>
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 36,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  logoutIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  widget: {
    width: '47%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 24,
  },
  widgetLarge: {
    width: '100%',
    padding: 24,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#64748B',
    marginLeft: 8,
  },
  widgetValueLg: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 48,
    color: '#1E293B',
    letterSpacing: -1,
  },
  widgetValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 32,
    color: '#1E293B',
    marginBottom: 4,
  },
  widgetLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#64748B',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData: any[] = [];
      snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#EF4444'; // Red
      case 'writer': return '#10B981'; // Emerald
      case 'writee': return '#8B5CF6'; // Violet
      default: return '#64748B'; // Slate
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.card}>
      <View style={styles.avatarContainer}>
        <MaterialIcons name="person" size={24} color="#64748B" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.emailText} numberOfLines={1}>{item.email || 'No Email'}</Text>
        <Text style={styles.idText}>ID: {item.id.slice(0, 8)}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: `${getRoleColor(item.role)}15` }]}>
        <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
          {item.role?.toUpperCase() || 'UNKNOWN'}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Directory</Text>
          <Text style={styles.subtitle}>Manage platform users</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 36,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  emailText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 4,
  },
  idText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});

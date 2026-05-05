import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import AnimatedButton from '../../components/AnimatedButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function WriterHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'orders'), where('status', 'in', ['pending', 'in_progress']));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: any[] = [];
      let currentActiveId = null;
      
      querySnapshot.forEach((document) => {
        const data = document.data();
        if (data.status === 'in_progress' && data.writerId === user.uid) {
          currentActiveId = document.id;
        }
        
        if (data.status === 'pending' || (data.status === 'in_progress' && data.writerId === user.uid)) {
          ordersData.push({ id: document.id, ...data });
        }
      });
      
      setOrders(ordersData);
      setActiveOrderId(currentActiveId);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptOrder = async (id: string) => {
    if (!user) return;
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status: 'in_progress',
        writerId: user.uid
      });
      Alert.alert('Order Accepted!', 'You have accepted this assignment. Start writing!');
    } catch (error) {
      Alert.alert('Error', 'Could not accept order.');
    }
  };

  const handleShipOrder = async (id: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status: 'shipped'
      });
      Alert.alert('Porter Delivery Triggered', 'A Porter rider has been assigned and is on the way!');
    } catch (error) {
      Alert.alert('Error', 'Could not trigger delivery.');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.bookType}</Text>
        <View style={styles.payoutBadge}>
          <Text style={styles.payoutText}>₹{item.payout}</Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <MaterialIcons name="menu-book" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.pages} Pages</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="location-on" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.distance || '2.4 km'}</Text>
        </View>
      </View>
      
      {activeOrderId === item.id ? (
        <View style={styles.actionRow}>
          <View style={[styles.statusPill, { backgroundColor: '#FEF3C7' }]}>
            <MaterialIcons name="edit" size={14} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: '#D97706' }]}>Writing</Text>
          </View>
          <AnimatedButton 
            style={styles.deliveryButton} 
            colors={['#10B981', '#059669']}
            onPress={() => handleShipOrder(item.id)}
          >
            <Text style={styles.buttonText}>Ship via Porter</Text>
            <MaterialIcons name="local-shipping" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </AnimatedButton>
        </View>
      ) : (
        <AnimatedButton 
          colors={['#8B5CF6', '#6D28D9']} 
          style={{ marginTop: 16, minHeight: 48 }}
          onPress={() => handleAcceptOrder(item.id)}
          disabled={activeOrderId !== null}
        >
          <Text style={styles.buttonText}>Accept Assignment</Text>
        </AnimatedButton>
      )}
    </GlassCard>
  );

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Find nearby assignments</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <MaterialIcons name="radar" size={48} color="#C4B5FD" />
                </View>
                <Text style={styles.emptyTitle}>Scanning Area</Text>
                <Text style={styles.emptySub}>No new assignments nearby right now. We'll notify you when one drops.</Text>
              </View>
            }
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
    paddingBottom: 80,
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
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#334155',
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  payoutBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  payoutText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#10B981',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  deliveryButton: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 44,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 14,
  },
});

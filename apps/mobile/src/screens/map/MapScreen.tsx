import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { apiGet } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';

export function MapScreen({ navigation }: any) {
  const [spots, setSpots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location } = useLocation();

  useEffect(() => {
    loadSpots();
  }, []);

  async function loadSpots() {
    try {
      const data = await apiGet('/api/spots');
      setSpots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={spots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          isLoading ? (
            <Text style={styles.emptyText}>Loading spots...</Text>
          ) : (
            <Text style={styles.emptyText}>No spots found</Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.spotName}>{item.name}</Text>
              <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.badgeText}>{item.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.spotType}>{item.type}</Text>
            {item.description ? (
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            ) : null}
            <View style={styles.meta}>
              <Text style={styles.metaText}>{item.rating ? `${item.rating.toFixed(1)} stars` : 'No rating'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function getDifficultyColor(d: string) {
  switch (d) {
    case 'Beginner': return '#22c55e';
    case 'Intermediate': return '#eab308';
    case 'Pro': return '#ef4444';
    case 'Legendary': return '#a855f7';
    default: return '#6b7280';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  spotName: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  spotType: { color: '#9ca3af', fontSize: 13, marginBottom: 4 },
  description: { color: '#6b7280', fontSize: 13, marginBottom: 8 },
  meta: { flexDirection: 'row', gap: 12 },
  metaText: { color: '#6b7280', fontSize: 12 },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 48, fontSize: 16 },
});

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { apiGet, apiPost } from '../../services/api';

export function FeedScreen() {
  const [clips, setClips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClips();
  }, []);

  async function loadClips() {
    try {
      const data = await apiGet('/api/clips');
      setClips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadClips();
    setRefreshing(false);
  }, []);

  async function handleLike(clipId: string) {
    try {
      await apiPost(`/api/clips/${clipId}/like`);
      setClips((prev) =>
        prev.map((c) =>
          c.id === clipId
            ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Loading...' : 'No clips yet'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userRow}>
              <Image
                source={{ uri: item.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.name}` }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>{item.user?.username}</Text>
                <Text style={styles.spotLabel}>{item.spot?.name}</Text>
              </View>
            </View>

            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            ) : null}

            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleLike(item.id)}
              >
                <Text style={[styles.actionText, item.isLiked && styles.liked]}>
                  {item.isLiked ? '❤️' : '🤍'} {item.likes}
                </Text>
              </TouchableOpacity>
              <Text style={styles.actionText}>💬 {item.comments}</Text>
              <Text style={styles.actionText}>👁 {item.views}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333' },
  username: { color: '#fff', fontSize: 14, fontWeight: '600' },
  spotLabel: { color: '#6b7280', fontSize: 12 },
  thumbnail: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, backgroundColor: '#333' },
  description: { color: '#d1d5db', fontSize: 14, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#9ca3af', fontSize: 13 },
  liked: { color: '#ef4444' },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 48, fontSize: 16 },
});

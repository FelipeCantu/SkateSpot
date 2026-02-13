import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { apiGet } from '../../services/api';

export function BattleListScreen() {
  const [battles, setBattles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    loadBattles();
  }, [tab]);

  async function loadBattles() {
    setIsLoading(true);
    try {
      const data = await apiGet(`/api/battles?status=${tab}`);
      setBattles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['active', 'completed'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={battles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Loading...' : `No ${tab} battles`}
          </Text>
        }
        renderItem={({ item }) => {
          const totalVotes = item.clip1Votes + item.clip2Votes;
          const clip1Pct = totalVotes > 0 ? Math.round((item.clip1Votes / totalVotes) * 100) : 50;
          return (
            <View style={styles.card}>
              <Text style={styles.spotName}>{item.spot?.name}</Text>
              <View style={styles.versus}>
                <View style={styles.clipSide}>
                  <Image
                    source={{ uri: item.clip1?.thumbnail || undefined }}
                    style={styles.clipThumb}
                  />
                  <Text style={styles.clipUser}>{item.clip1?.user?.username}</Text>
                  <Text style={styles.voteCount}>{item.clip1Votes} votes</Text>
                </View>
                <View style={styles.vsCenter}>
                  <Text style={styles.vsText}>VS</Text>
                  {totalVotes > 0 && (
                    <Text style={styles.vsPct}>{clip1Pct}% - {100 - clip1Pct}%</Text>
                  )}
                </View>
                <View style={styles.clipSide}>
                  <Image
                    source={{ uri: item.clip2?.thumbnail || undefined }}
                    style={styles.clipThumb}
                  />
                  <Text style={styles.clipUser}>{item.clip2?.user?.username}</Text>
                  <Text style={styles.voteCount}>{item.clip2Votes} votes</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  activeTab: { backgroundColor: '#ea580c' },
  tabText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#fff' },
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  spotName: { color: '#9ca3af', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  versus: { flexDirection: 'row', alignItems: 'center' },
  clipSide: { flex: 1, alignItems: 'center' },
  clipThumb: { width: '100%', height: 80, borderRadius: 8, backgroundColor: '#333', marginBottom: 8 },
  clipUser: { color: '#fff', fontSize: 13, fontWeight: '500' },
  voteCount: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  vsCenter: { paddingHorizontal: 12, alignItems: 'center' },
  vsText: { color: '#ea580c', fontSize: 16, fontWeight: 'bold' },
  vsPct: { color: '#6b7280', fontSize: 11, marginTop: 4 },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 48, fontSize: 16 },
});

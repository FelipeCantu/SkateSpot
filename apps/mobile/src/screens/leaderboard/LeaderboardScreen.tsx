import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { apiGet } from '../../services/api';

type TabType = 'skaters' | 'spots' | 'crews';

export function LeaderboardScreen() {
  const [tab, setTab] = useState<TabType>('skaters');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setIsLoading(true);
    try {
      let result;
      if (tab === 'skaters') {
        result = await apiGet('/api/leaderboard');
        setData(result.skaters || []);
      } else if (tab === 'spots') {
        result = await apiGet('/api/leaderboard');
        setData(result.spots || []);
      } else {
        result = await apiGet('/api/crews?sort=points');
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['skaters', 'spots', 'crews'] as const).map((t) => (
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
        data={data}
        keyExtractor={(item, i) => item.id || String(i)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Loading...' : 'No data yet'}
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={[styles.rank, index < 3 && styles.topRank]}>
              #{index + 1}
            </Text>
            {tab === 'crews' ? (
              <View style={styles.crewIcon}>
                <Text style={styles.crewInitial}>{item.name?.[0]?.toUpperCase()}</Text>
              </View>
            ) : (
              <Image
                source={{ uri: item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}` }}
                style={styles.avatar}
              />
            )}
            <View style={styles.info}>
              <Text style={styles.name}>
                {tab === 'crews' ? item.name : item.username || item.name}
              </Text>
              <Text style={styles.sub}>
                {tab === 'skaters' && `${item.points} pts - ${item.tier}`}
                {tab === 'spots' && `${item.rating?.toFixed(1) || '0'} stars`}
                {tab === 'crews' && `${item.totalPoints} pts - ${item.memberCount} members`}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#1a1a1a', alignItems: 'center',
  },
  activeTab: { backgroundColor: '#3b82f6' },
  tabText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#fff' },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  rank: { color: '#6b7280', fontSize: 16, fontWeight: '700', width: 36, textAlign: 'center' },
  topRank: { color: '#eab308' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333' },
  crewIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#7c3aed33', alignItems: 'center', justifyContent: 'center',
  },
  crewInitial: { color: '#a78bfa', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 15, fontWeight: '600' },
  sub: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 48, fontSize: 16 },
});

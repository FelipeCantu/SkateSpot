import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { apiGet } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ clips: 0, spots: 0, followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await apiGet('/api/users/me');
      setProfile(data);
      setStats({
        clips: data.clipCount || 0,
        spots: data.spotCount || 0,
        followers: data.followers || 0,
        following: data.following || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  const tierColors: Record<string, string> = {
    rookie: '#9ca3af',
    amateur: '#3b82f6',
    pro: '#8b5cf6',
    legend: '#eab308',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image
          source={{ uri: profile?.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile?.name || user?.name}</Text>
        <Text style={styles.username}>@{profile?.username || user?.username}</Text>
        <View style={[styles.tierBadge, { backgroundColor: tierColors[profile?.tier || 'rookie'] + '33' }]}>
          <Text style={[styles.tierText, { color: tierColors[profile?.tier || 'rookie'] }]}>
            {(profile?.tier || 'rookie').toUpperCase()} - {profile?.points || 0} pts
          </Text>
        </View>
      </View>

      {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

      <View style={styles.statsRow}>
        <StatBox label="Clips" value={stats.clips} />
        <StatBox label="Spots" value={stats.spots} />
        <StatBox label="Followers" value={stats.followers} />
        <StatBox label="Following" value={stats.following} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#333', marginBottom: 12 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  username: { color: '#9ca3af', fontSize: 14, marginTop: 2 },
  tierBadge: {
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  tierText: { fontSize: 12, fontWeight: '600' },
  bio: { color: '#d1d5db', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#1a1a1a',
    borderRadius: 12, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#dc2626', borderRadius: 12, padding: 14,
    alignItems: 'center', marginTop: 16,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

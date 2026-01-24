import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { firestoreService, Ranker } from '../services/FirestoreService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

const LeaderboardScreen = ({ navigation }: any) => {
  const { auth, user } = useSelector((state: RootState) => state);
  const [rankers, setRankers] = useState<Ranker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRank, setUserRank] = useState<number>(0);

  const isDark = user.preferences.theme === 'dark';
  const themeColors = isDark ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA'
  } : {
    background: '#F5F5F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  };

  useEffect(() => {
    fetchRankers();
    if (auth.isAuthenticated && auth.user) {
      fetchUserRank();
    }
  }, [auth.isAuthenticated]);

  const fetchRankers = async () => {
    try {
      setLoading(true);
      const fetchedRankers = await firestoreService.fetchTopRankers(50);
      setRankers(fetchedRankers);
    } catch (error) {
      console.error('Error fetching rankers:', error);
      // Don't show error to user, just keep empty state
      setRankers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    if (!auth.user) return;
    try {
      const rank = await firestoreService.getUserRank(auth.user.uid);
      setUserRank(rank);
    } catch (error) {
      console.error('Error fetching user rank:', error);
      // Don't show error, just keep rank as 0
      setUserRank(0);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRankers();
    if (auth.isAuthenticated && auth.user) {
      await fetchUserRank();
    }
    setRefreshing(false);
  };

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1: return { icon: 'workspace-premium', color: '#FFD700', bg: 'rgba(255, 215, 0, 0.15)' };
      case 2: return { icon: 'emoji-events', color: '#C0C0C0', bg: 'rgba(192, 192, 192, 0.15)' };
      case 3: return { icon: 'military-tech', color: '#CD7F32', bg: 'rgba(205, 127, 50, 0.15)' };
      default: return { icon: 'person', color: '#888', bg: 'rgba(136, 136, 136, 0.1)' };
    }
  };

  const RankerCard = ({ ranker, rank, isCurrentUser = false }: { ranker: Ranker; rank: number; isCurrentUser?: boolean }) => {
    const styles_rank = getRankStyles(rank);

    return (
      <View style={[
        styles.rankerCard, 
        isDark && { backgroundColor: '#1E1E1E' },
        isCurrentUser && { borderColor: Colors.primary, borderWidth: 2 }
      ]}>
        <View style={styles.rankNumber}>
          <Text style={[styles.rankText, { color: styles_rank.color }]}>#{rank}</Text>
        </View>
        
        <View style={[styles.rankIconContainer, { backgroundColor: styles_rank.bg }]}>
          <Icon name={styles_rank.icon} size={24} color={styles_rank.color} />
        </View>
        
        <View style={styles.rankerInfo}>
          <Text style={[styles.rankerName, isDark && { color: '#fff' }]}>
            {ranker.name} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.rankerStats}>
            {ranker.score || 0} Points • {ranker.totalQuizzes || 0} Tests • Avg: {ranker.averageScore || 0}
          </Text>
          <Text style={styles.lastActive}>
            Last active: {ranker.lastActive ? ranker.lastActive.toLocaleDateString() : 'Unknown'}
          </Text>
        </View>

          {rank <= 3 && (
            <View style={styles.crownContainer}>
              <Icon name="emoji-events" size={20} color={styles_rank.color} />
            </View>
          )}
        </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <LinearGradient
        colors={isDark ? ['#1A237E', '#0D47A1'] : Colors.gradients.royal}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Animated.View entering={FadeInDown.duration(1000)} style={styles.headerContent}>
          <Text style={styles.title}>Global Leaderboard</Text>
          <Text style={styles.subtitle}>Top history scholars worldwide</Text>
          {auth.isAuthenticated && userRank > 0 && (
            <Text style={styles.userRankText}>Your Rank: #{userRank}</Text>
          )}
        </Animated.View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
            Loading leaderboard...
          </Text>
        </View>
      ) : (
        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          >
            {rankers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="leaderboard" size={64} color={themeColors.textSecondary} />
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  No rankers yet
                </Text>
                <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
                  Be the first to complete a quiz and claim your spot!
                </Text>
              </View>
            ) : (
              rankers.map((ranker, index) => (
                <RankerCard
                  key={`${ranker.id}-${ranker.score}`}
                  ranker={ranker}
                  rank={index + 1}
                  isCurrentUser={auth.user?.uid === ranker.id}
                />
              ))
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 5,
    textAlign: 'center',
  },
  userRankText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '700',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  rankerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 15,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 4 }
    }),
  },
  rankNumber: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontSize: 18,
    fontWeight: '900',
  },
  rankIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  rankerInfo: {
    flex: 1,
  },
  rankerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  rankerStats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lastActive: {
    fontSize: 12,
    color: '#999',
  },
  crownContainer: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default LeaderboardScreen;
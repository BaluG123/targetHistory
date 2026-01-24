import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { resetTest } from '../store/slices/testSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { firestoreService } from '../services/FirestoreService';

const { width } = Dimensions.get('window');

const TestResultScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { test, user, auth } = useSelector((state: RootState) => state);

  const isDark = user.preferences.theme === 'dark';
  const latestResult = test.testResults[test.testResults.length - 1];

  const scorePercentage = latestResult ? Math.round((latestResult.correctAnswers / latestResult.totalQuestions) * 100) : 0;
  const timeSpentMinutes = latestResult ? Math.floor(latestResult.timeSpent / 60) : 0;
  const timeSpentSeconds = latestResult ? latestResult.timeSpent % 60 : 0;

  useEffect(() => {
    if (!latestResult || !auth.isAuthenticated || !auth.user) return;

    // Submit result to Firestore
    submitResultToFirestore();
  }, []);

  const submitResultToFirestore = async () => {
    if (!latestResult || !auth.user) return;

    try {
      // Submit test result
      const resultWithUserId = { ...latestResult, userId: auth.user.uid };
      await firestoreService.submitQuizResult(auth.user.uid, resultWithUserId as any);

      // Update user ranking data
      await firestoreService.updateUserRanking(auth.user.uid, {
        name: auth.user.displayName || 'Anonymous',
        email: auth.user.email || '',
        photoURL: auth.user.photoURL || undefined,
      });

      console.log('Test result submitted successfully');
    } catch (error) {
      console.error('Error submitting test result:', error);
    }
  };

  const getRank = () => {
    if (scorePercentage >= 95) return { label: 'EXCELLENT', color: '#FFD700', icon: 'auto-awesome' };
    if (scorePercentage >= 80) return { label: 'VERY GOOD', color: '#4CAF50', icon: 'school' };
    if (scorePercentage >= 60) return { label: 'GOOD', color: '#FF9800', icon: 'menu-book' };
    if (scorePercentage >= 40) return { label: 'AVERAGE', color: '#2196F3', icon: 'history-edu' };
    return { label: 'NEEDS IMPROVEMENT', color: '#F44336', icon: 'trending-up' };
  };

  const handleRetakeTest = () => {
    dispatch(resetTest());
    navigation.navigate('TestList');
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  if (!latestResult) return null;

  const rank = getRank();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F7' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1F1F1F', '#121212'] : ['#2C3E50', '#000000']}
          style={styles.header}
        >
          <Animated.View entering={ZoomIn} style={styles.rankBadge}>
            <View style={[styles.rankIconContainer, { borderColor: rank.color }]}>
              <Icon name={rank.icon} size={50} color={rank.color} />
            </View>
            <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label}</Text>
          </Animated.View>

          <Text style={styles.congratText}>Test Completed!</Text>
          <Text style={styles.scoreText}>{scorePercentage}%</Text>
          <Text style={styles.testTitle}>{latestResult.testTitle}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.statVal, isDark && { color: '#fff' }]}>{latestResult.correctAnswers}</Text>
              <Text style={styles.statLab}>CORRECT</Text>
            </View>
            <View style={[styles.statBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Icon name="cancel" size={24} color="#F44336" />
              <Text style={[styles.statVal, isDark && { color: '#fff' }]}>{latestResult.totalQuestions - latestResult.correctAnswers}</Text>
              <Text style={styles.statLab}>WRONG</Text>
            </View>
            <View style={[styles.statBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Icon name="timer" size={24} color="#2196F3" />
              <Text style={[styles.statVal, isDark && { color: '#fff' }]}>{timeSpentMinutes}m {timeSpentSeconds}s</Text>
              <Text style={styles.statLab}>TIME</Text>
            </View>
            <View style={[styles.statBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Icon name="bolt" size={24} color="#FF9800" />
              <Text style={[styles.statVal, isDark && { color: '#fff' }]}>{latestResult.score}</Text>
              <Text style={styles.statLab}>POINTS</Text>
            </View>
          </View>

          <Animated.View entering={FadeInUp.delay(400)} style={[styles.performanceCard, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Text style={[styles.cardTitle, isDark && { color: '#fff' }]}>Performance Analysis</Text>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Accuracy</Text>
              <View style={styles.performanceBarTrack}>
                <View style={[styles.performanceBarFill, { width: `${scorePercentage}%`, backgroundColor: rank.color }]} />
              </View>
              <Text style={[styles.performanceValue, { color: rank.color }]}>{scorePercentage}%</Text>
            </View>
            <Text style={styles.performanceNote}>
              You answered {latestResult.correctAnswers} out of {latestResult.totalQuestions} questions correctly
            </Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleViewLeaderboard}
              style={[styles.secondaryBtn, isDark && { backgroundColor: '#1E1E1E' }]}
            >
              <Icon name="leaderboard" size={20} color="#FF6B35" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>VIEW LEADERBOARD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRetakeTest}
              style={styles.primaryBtn}
            >
              <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.btnGradient}>
                <Text style={styles.btnText}>TAKE ANOTHER TEST</Text>
                <Icon name="refresh" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  rankBadge: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rankIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rankLabel: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  congratText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 10,
  },
  scoreText: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
  },
  testTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  content: {
    padding: 25,
    marginTop: -30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 15,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 4 }
    }),
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
    color: '#1A1A1A',
  },
  statLab: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 2,
  },
  performanceCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 28,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  performanceRow: {
    marginBottom: 15,
  },
  performanceLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  performanceBarTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
  },
  performanceNote: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    gap: 15,
  },
  primaryBtn: {
    height: 65,
    borderRadius: 32.5,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryBtn: {
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  secondaryBtnText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

export default TestResultScreen;
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateStats, addExperience, addAchievement } from '../store/slices/userSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const QuizResultScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);

  const isDark = user.preferences.theme === 'dark';
  const latestResult = quiz.quizResults[quiz.quizResults.length - 1];

  const scorePercentage = latestResult ? Math.round((latestResult.correctAnswers / latestResult.totalQuestions) * 100) : 0;
  const timeSpentMinutes = latestResult ? Math.floor(latestResult.timeSpent / 60) : 0;
  const timeSpentSeconds = latestResult ? latestResult.timeSpent % 60 : 0;

  useEffect(() => {
    if (!latestResult) return;

    // Update user stats
    const newStats = {
      totalQuizzesTaken: user.stats.totalQuizzesTaken + 1,
      averageScore: Math.round(
        (user.stats.averageScore * user.stats.totalQuizzesTaken + scorePercentage) /
        (user.stats.totalQuizzesTaken + 1)
      ),
      bestScore: Math.max(user.stats.bestScore, scorePercentage),
      totalTimeSpent: user.stats.totalTimeSpent + latestResult.timeSpent,
    };

    dispatch(updateStats(newStats));

    // Add experience points
    const experienceGained = latestResult.correctAnswers * 50 + (scorePercentage >= 80 ? 100 : 0);
    dispatch(addExperience(experienceGained));

    // Check for achievements
    if (scorePercentage === 100) dispatch(addAchievement('Perfect Score'));
    if (user.stats.totalQuizzesTaken + 1 === 10) dispatch(addAchievement('Quiz Master'));
  }, [dispatch]);

  const getRank = () => {
    if (scorePercentage >= 95) return { label: 'GRAND MASTER', color: '#FFD700', icon: 'auto-awesome' };
    if (scorePercentage >= 80) return { label: 'SCHOLAR', color: '#C0C0C0', icon: 'school' };
    if (scorePercentage >= 60) return { label: 'NOVICE', color: '#CD7F32', icon: 'menu-book' };
    return { label: 'ASPIRANT', color: '#888', icon: 'history-edu' };
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
          <Animatable.View animation="zoomIn" style={styles.rankBadge}>
            <View style={[styles.rankIconContainer, { borderColor: rank.color }]}>
              <Icon name={rank.icon} size={50} color={rank.color} />
            </View>
            <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label}</Text>
          </Animatable.View>

          <Text style={styles.congratText}>Quiz Conquest Complete</Text>
          <Text style={styles.scoreText}>{scorePercentage}%</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.statVal, isDark && { color: '#fff' }]}>{latestResult.correctAnswers}</Text>
              <Text style={styles.statLab}>CORRECT</Text>
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

          <Animatable.View animation="fadeInUp" delay={400} style={[styles.masteryCard, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Text style={[styles.cardTitle, isDark && { color: '#fff' }]}>Mastery Analysis</Text>
            <View style={styles.masteryRow}>
              <Text style={styles.masteryLabel}>Historical Accuracy</Text>
              <View style={styles.masteryBarTrack}>
                <View style={[styles.masteryBarFill, { width: `${scorePercentage}%`, backgroundColor: rank.color }]} />
              </View>
            </View>
            <Text style={styles.masteryNote}>Difficulty: {latestResult.difficulty.toUpperCase()} • {latestResult.region.toUpperCase()}</Text>
          </Animatable.View>

          <TouchableOpacity
            onPress={() => navigation.navigate('QuizSetup')}
            style={styles.primaryBtn}
          >
            <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.btnGradient}>
              <Text style={styles.btnText}>NEW QUEST</Text>
              <Icon name="refresh" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={[styles.secondaryBtn, isDark && { backgroundColor: '#1E1E1E' }]}
          >
            <Text style={styles.secondaryBtnText}>RETURN TO CITADEL</Text>
          </TouchableOpacity>
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
    fontSize: 20,
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
  content: {
    padding: 25,
    marginTop: -30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 5,
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
  masteryCard: {
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
  masteryRow: {
    marginBottom: 15,
  },
  masteryLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  masteryBarTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  masteryNote: {
    fontSize: 11,
    color: '#999',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  primaryBtn: {
    height: 65,
    borderRadius: 32.5,
    overflow: 'hidden',
    marginBottom: 15,
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
  },
  secondaryBtnText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

export default QuizResultScreen;
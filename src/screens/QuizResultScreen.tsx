import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
  const styles = createStyles(isDark);

  const latestResult = quiz.quizResults[quiz.quizResults.length - 1];
  
  if (!latestResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz results found</Text>
      </View>
    );
  }

  const scorePercentage = Math.round((latestResult.correctAnswers / latestResult.totalQuestions) * 100);
  const timeSpentMinutes = Math.floor(latestResult.timeSpent / 60);
  const timeSpentSeconds = latestResult.timeSpent % 60;

  useEffect(() => {
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
    if (scorePercentage === 100) {
      dispatch(addAchievement('Perfect Score'));
    }
    if (user.stats.totalQuizzesTaken + 1 === 1) {
      dispatch(addAchievement('First Quiz'));
    }
    if (user.stats.totalQuizzesTaken + 1 === 10) {
      dispatch(addAchievement('Quiz Master'));
    }
  }, []);

  const getScoreColor = () => {
    if (scorePercentage >= 80) return '#4CAF50';
    if (scorePercentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getPerformanceMessage = () => {
    if (scorePercentage >= 90) return 'Excellent! You\'re a history expert!';
    if (scorePercentage >= 80) return 'Great job! You know your history well!';
    if (scorePercentage >= 70) return 'Good work! Keep studying to improve!';
    if (scorePercentage >= 60) return 'Not bad! There\'s room for improvement!';
    return 'Keep practicing! You\'ll get better!';
  };

  const getScoreIcon = () => {
    if (scorePercentage >= 90) return 'emoji-events';
    if (scorePercentage >= 80) return 'thumb-up';
    if (scorePercentage >= 60) return 'trending-up';
    return 'school';
  };

  const StatItem = ({ label, value, icon, color }: any) => (
    <View style={styles.statItem}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <Animatable.View animation="bounceIn" delay={500}>
          <Icon name={getScoreIcon()} size={60} color="#fff" />
        </Animatable.View>
        <Animatable.Text animation="fadeInUp" delay={700} style={styles.headerTitle}>
          Quiz Complete!
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={900} style={styles.headerSubtitle}>
          {getPerformanceMessage()}
        </Animatable.Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score Circle */}
        <Animatable.View animation="zoomIn" delay={1000} style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {scorePercentage}%
            </Text>
            <Text style={styles.scoreSubtext}>Score</Text>
          </View>
        </Animatable.View>

        {/* Stats */}
        <Animatable.View animation="fadeInUp" delay={1200} style={styles.statsContainer}>
          <StatItem
            label="Correct"
            value={latestResult.correctAnswers}
            icon="check-circle"
            color="#4CAF50"
          />
          <StatItem
            label="Incorrect"
            value={latestResult.totalQuestions - latestResult.correctAnswers}
            icon="cancel"
            color="#F44336"
          />
          <StatItem
            label="Time"
            value={`${timeSpentMinutes}:${timeSpentSeconds.toString().padStart(2, '0')}`}
            icon="schedule"
            color="#2196F3"
          />
          <StatItem
            label="Points"
            value={latestResult.score}
            icon="star"
            color="#FF9800"
          />
        </Animatable.View>

        {/* Quiz Details */}
        <Animatable.View animation="fadeInUp" delay={1400} style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Quiz Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{latestResult.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Region:</Text>
            <Text style={styles.detailValue}>{latestResult.region}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Questions:</Text>
            <Text style={styles.detailValue}>{latestResult.totalQuestions}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(latestResult.date).toLocaleDateString()}
            </Text>
          </View>
        </Animatable.View>

        {/* Experience Gained */}
        <Animatable.View animation="fadeInUp" delay={1600} style={styles.experienceCard}>
          <Icon name="trending-up" size={24} color="#FF6B35" />
          <Text style={styles.experienceText}>
            +{latestResult.correctAnswers * 50 + (scorePercentage >= 80 ? 100 : 0)} XP Gained!
          </Text>
          {scorePercentage >= 80 && (
            <Text style={styles.bonusText}>Bonus: +100 XP for 80%+ score!</Text>
          )}
        </Animatable.View>

        {/* Recommendations */}
        <Animatable.View animation="fadeInUp" delay={1800} style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          {scorePercentage < 70 && (
            <View style={styles.recommendationItem}>
              <Icon name="school" size={20} color="#FF6B35" />
              <Text style={styles.recommendationText}>
                Review the concepts section to improve your understanding
              </Text>
            </View>
          )}
          <View style={styles.recommendationItem}>
            <Icon name="map" size={20} color="#FF6B35" />
            <Text style={styles.recommendationText}>
              Explore the interactive map to visualize historical events
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <Icon name="timeline" size={20} color="#FF6B35" />
            <Text style={styles.recommendationText}>
              Check out the timeline to understand chronological order
            </Text>
          </View>
        </Animatable.View>

        {/* Action Buttons */}
        <Animatable.View animation="fadeInUp" delay={2000} style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('QuizSetup')}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="refresh" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Take Another Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>View Profile</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#FF6B35',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreSubtext: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    padding: 20,
    borderRadius: 15,
    minWidth: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
  },
  detailsCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    textTransform: 'capitalize',
  },
  experienceCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  experienceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 10,
  },
  bonusText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  recommendationsCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    marginLeft: 12,
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  primaryButton: {
    marginBottom: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 25,
  },
  primaryButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  errorText: {
    fontSize: 18,
    color: isDark ? '#fff' : '#333',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default QuizResultScreen;
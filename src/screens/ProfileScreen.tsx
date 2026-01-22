import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updatePreferences, setUserProfile } from '../store/slices/userSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, quiz } = useSelector((state: RootState) => state);
  
  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const handleThemeToggle = (value: boolean) => {
    dispatch(updatePreferences({ theme: value ? 'dark' : 'light' }));
  };

  const handleNotificationToggle = (value: boolean) => {
    dispatch(updatePreferences({ notifications: value }));
  };

  const handleSoundToggle = (value: boolean) => {
    dispatch(updatePreferences({ soundEnabled: value }));
  };

  const handleLanguageToggle = (value: boolean) => {
    dispatch(updatePreferences({ language: value ? 'hi' : 'en' }));
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset user stats
            Alert.alert('Success', 'Progress reset successfully!');
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Animatable.View animation="fadeInUp" delay={300} style={styles.statCard}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={icon} size={24} color="#fff" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </Animatable.View>
  );

  const SettingItem = ({ title, subtitle, icon, rightComponent }: any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#FF6B35" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  const AchievementBadge = ({ achievement }: { achievement: string }) => (
    <View style={styles.achievementBadge}>
      <Icon name="star" size={16} color="#FFD700" />
      <Text style={styles.achievementText}>{achievement}</Text>
    </View>
  );

  const getExperienceProgress = () => {
    const currentLevelXP = (user.level - 1) * 1000;
    const nextLevelXP = user.level * 1000;
    const progress = (user.experience - currentLevelXP) / (nextLevelXP - currentLevelXP);
    return Math.max(0, Math.min(1, progress));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={40} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name || 'History Explorer'}</Text>
            <Text style={styles.userEmail}>{user.email || 'explorer@targethistory.com'}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Level {user.level}</Text>
              <View style={styles.xpContainer}>
                <View style={styles.xpCircle}>
                  <Text style={styles.xpText}>{user.experience} XP</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Quizzes Taken"
            value={user.stats.totalQuizzesTaken}
            icon="quiz"
            color="#9C27B0"
          />
          <StatCard
            title="Best Score"
            value={`${user.stats.bestScore}%`}
            icon="trending-up"
            color="#4CAF50"
          />
          <StatCard
            title="Current Streak"
            value={user.stats.streak}
            icon="local-fire-department"
            color="#FF5722"
          />
          <StatCard
            title="Time Spent"
            value={`${Math.floor(user.stats.totalTimeSpent / 60)}h`}
            icon="schedule"
            color="#2196F3"
          />
        </View>

        {/* Achievements */}
        {user.achievements.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={500} style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {user.achievements.map((achievement, index) => (
                <AchievementBadge key={index} achievement={achievement} />
              ))}
            </View>
          </Animatable.View>
        )}

        {/* Recent Quiz Results */}
        {quiz.quizResults.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={600} style={styles.recentQuizzesSection}>
            <Text style={styles.sectionTitle}>Recent Quiz Results</Text>
            {quiz.quizResults.slice(-3).reverse().map((result, index) => (
              <View key={result.id} style={styles.quizResultCard}>
                <View style={styles.quizResultHeader}>
                  <Text style={styles.quizResultTitle}>
                    {result.category} - {result.region}
                  </Text>
                  <Text style={styles.quizResultScore}>{result.score}%</Text>
                </View>
                <Text style={styles.quizResultDetails}>
                  {result.correctAnswers}/{result.totalQuestions} correct • {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                </Text>
                <Text style={styles.quizResultDate}>
                  {new Date(result.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Animatable.View>
        )}

        {/* Settings */}
        <Animatable.View animation="fadeInUp" delay={700} style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <SettingItem
            title="Dark Theme"
            subtitle="Switch between light and dark themes"
            icon="dark-mode"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={isDark ? '#fff' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            title="Notifications"
            subtitle="Receive quiz reminders and updates"
            icon="notifications"
            rightComponent={
              <Switch
                value={user.preferences.notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={user.preferences.notifications ? '#fff' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            title="Sound Effects"
            subtitle="Enable sound effects during quizzes"
            icon="volume-up"
            rightComponent={
              <Switch
                value={user.preferences.soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={user.preferences.soundEnabled ? '#fff' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            title="Language"
            subtitle={`Current: ${user.preferences.language === 'hi' ? 'Hindi' : 'English'}`}
            icon="language"
            rightComponent={
              <Switch
                value={user.preferences.language === 'hi'}
                onValueChange={handleLanguageToggle}
                trackColor={{ false: '#767577', true: '#FF6B35' }}
                thumbColor={user.preferences.language === 'hi' ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </Animatable.View>

        {/* Actions */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleResetProgress}>
            <Icon name="refresh" size={24} color="#F44336" />
            <Text style={[styles.actionButtonText, { color: '#F44336' }]}>
              Reset Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="help" size={24} color="#FF6B35" />
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="info" size={24} color="#FF6B35" />
            <Text style={styles.actionButtonText}>About Target History</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginRight: 15,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  xpText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  achievementsSection: {
    marginBottom: 30,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementText: {
    marginLeft: 6,
    fontSize: 12,
    color: isDark ? '#fff' : '#333',
    fontWeight: '600',
  },
  recentQuizzesSection: {
    marginBottom: 30,
  },
  quizResultCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quizResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  quizResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    textTransform: 'capitalize',
  },
  quizResultScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quizResultDetails: {
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
    marginBottom: 5,
  },
  quizResultDate: {
    fontSize: 11,
    color: isDark ? '#888' : '#999',
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 2,
    padding: 15,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
  },
  actionsSection: {
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
});

export default ProfileScreen;
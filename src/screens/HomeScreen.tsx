import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setEvents, setPeriods, setRulers } from '../store/slices/historySlice';
import { setQuestions } from '../store/slices/quizSlice';
import { historicalEvents, historicalPeriods, worldRulers } from '../data/historicalData';
import { quizQuestions } from '../data/quizData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Colors, getThemeColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user, history, quiz } = useSelector((state: RootState) => state);
  const theme = user.preferences.theme;

  useEffect(() => {
    // Initialize data
    dispatch(setEvents(historicalEvents));
    dispatch(setPeriods(historicalPeriods));
    dispatch(setRulers(worldRulers));
    dispatch(setQuestions(quizQuestions));
  }, [dispatch]);

  const isDark = theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);

  const QuickStatsCard = ({ title, value, icon, color, delay }: any) => (
    <Animatable.View animation="fadeInUp" delay={delay} style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
      </View>
    </Animatable.View>
  );

  const FeatureCard = ({ title, description, icon, gradient, onPress, delay }: any) => (
    <Animatable.View animation="fadeInUp" delay={delay}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.featureCardContainer}>
        <LinearGradient
          colors={gradient}
          style={styles.featureCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.featureIconContainer}>
            <Icon name={icon} size={32} color={Colors.white} />
          </View>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" delay={200}>
          <LinearGradient
            colors={Colors.gradients.sunset}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={styles.appTitle}>Target History</Text>
                <Text style={styles.subtitle}>Explore the fascinating world of history</Text>
              </View>
              <View style={styles.headerIcon}>
                <Icon name="history-edu" size={40} color={Colors.white} />
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <QuickStatsCard
            title="Quiz Score"
            value={`${user.stats.averageScore}%`}
            icon="trending-up"
            color={Colors.success}
            delay={400}
          />
          <QuickStatsCard
            title="Level"
            value={user.level}
            icon="star"
            color={Colors.warning}
            delay={500}
          />
          <QuickStatsCard
            title="Streak"
            value={user.stats.streak}
            icon="local-fire-department"
            color={Colors.error}
            delay={600}
          />
        </View>

        {/* Today's Highlight */}
        <Animatable.View animation="fadeInUp" delay={700} style={styles.highlightCard}>
          <LinearGradient
            colors={[themeColors.surface, `${Colors.primary}10`]}
            style={styles.highlightGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.highlightHeader}>
              <Icon name="history" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Today in History</Text>
            </View>
            <View style={styles.highlightContent}>
              <View style={styles.highlightText}>
                <Text style={styles.highlightTitle}>Mauryan Empire Founded</Text>
                <Text style={styles.highlightDate}>321 BCE - This Day</Text>
                <Text style={styles.highlightDescription}>
                  Chandragupta Maurya established the first pan-Indian empire, marking the beginning of a golden age in Indian history.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              title="Interactive Maps"
              description="Explore historical events on beautiful interactive maps"
              icon="map"
              gradient={Colors.gradients.ocean}
              onPress={() => navigation.navigate('Map')}
              delay={800}
            />
            <FeatureCard
              title="Quiz Challenge"
              description="Test your knowledge with engaging quizzes"
              icon="quiz"
              gradient={Colors.gradients.royal}
              onPress={() => navigation.navigate('Quiz')}
              delay={900}
            />
            <FeatureCard
              title="Timeline"
              description="Journey through time with interactive timelines"
              icon="timeline"
              gradient={Colors.gradients.medieval}
              onPress={() => navigation.navigate('Events')}
              delay={1000}
            />
            <FeatureCard
              title="Concepts"
              description="Learn key historical concepts and terms"
              icon="school"
              gradient={Colors.gradients.ancient}
              onPress={() => navigation.navigate('Concepts')}
              delay={1100}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <Animatable.View animation="fadeInUp" delay={1200} style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Icon name="history" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${Colors.quiz.correct}20` }]}>
                <Icon name="quiz" size={16} color={Colors.quiz.correct} />
              </View>
              <Text style={styles.activityText}>Completed Ancient India Quiz - 85%</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${Colors.error}20` }]}>
                <Icon name="favorite" size={16} color={Colors.error} />
              </View>
              <Text style={styles.activityText}>Added Ashoka's Edicts to favorites</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${Colors.secondary}20` }]}>
                <Icon name="map" size={16} color={Colors.secondary} />
              </View>
              <Text style={styles.activityText}>Explored Mauryan Empire locations</Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const createStyles = (isDark: boolean, themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statsCard: {
    flex: 1,
    backgroundColor: themeColors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderLeftWidth: 4,
    elevation: 4,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsText: {
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  statsTitle: {
    fontSize: 12,
    color: themeColors.textSecondary,
    marginTop: 2,
  },
  highlightCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  highlightGradient: {
    padding: 20,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  highlightContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  highlightText: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 5,
  },
  highlightDate: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlightDescription: {
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColors.text,
    marginHorizontal: 20,
    marginBottom: 15,
    marginLeft: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  featureCardContainer: {
    width: (width - 50) / 2,
    margin: 5,
  },
  featureCard: {
    borderRadius: 20,
    padding: 20,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featureIconContainer: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: themeColors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
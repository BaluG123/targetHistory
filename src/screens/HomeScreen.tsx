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
import {
  Trophy,
  Zap,
  BookOpen,
  Map as MapIcon,
  GraduationCap,
  Flame,
  TrendingUp,
  ChevronRight,
  BookMarked,
  Lightbulb,
  ArrowRight,
  History as HistoryIcon
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, getThemeColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const QuickStatsCard = ({ title, value, icon: IconComponent, color, styles }: any) => (
  <View style={[styles.statsCard, { borderLeftColor: color }]}>
    <View style={styles.statsContent}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <IconComponent size={20} color={color} />
      </View>
      <View style={styles.statsText}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
    </View>
  </View>
);

const FeatureCard = ({ title, description, icon: IconComponent, gradient, onPress, delay, styles }: any) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.featureCardContainer}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        style={styles.featureCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.featureIconContainer}>
          <IconComponent size={24} color={Colors.white} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
        <View style={styles.featureAction}>
          <ChevronRight size={14} color={Colors.white} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    dispatch(setEvents(historicalEvents));
    dispatch(setPeriods(historicalPeriods));
    dispatch(setRulers(worldRulers));
    dispatch(setQuestions(quizQuestions));
  }, [dispatch]);

  const isDark = user.preferences.theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(1000).springify()}>
          <LinearGradient
            colors={Colors.gradients.sunset}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.welcomeText}>Welcome back, Aspirant</Text>
                <Text style={styles.appTitle}>Target History</Text>
                <Text style={styles.subtitle}>Master history for your dreams.</Text>
              </View>
              <View style={styles.headerIcon}>
                <GraduationCap size={48} color={Colors.white} />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.statsContainer}>
          <QuickStatsCard
            title="Avg Score"
            value={`${user.stats.averageScore}%`}
            icon={TrendingUp}
            color={Colors.success}
            styles={styles}
          />
          <QuickStatsCard
            title="Level"
            value={user.level}
            icon={Trophy}
            color={Colors.warning}
            styles={styles}
          />
          <QuickStatsCard
            title="Streak"
            value={user.stats.streak}
            icon={Flame}
            color={Colors.error}
            styles={styles}
          />
        </Animated.View>

        {/* Aspirant's Corner */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.aspirantCard}>
          <View style={styles.aspirantHeader}>
            <View style={styles.titleWithIcon}>
              <Lightbulb size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>High-Yield Concept</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Read More</Text>
              <ArrowRight size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.conceptBody}>
            <Text style={styles.conceptTitle}>Battle of Buxar (1764)</Text>
            <Text style={styles.conceptDescription}>
              Key moment that established the English East India Company as the real master of Bengal, Bihar, and Odisha.
            </Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                <Text style={[styles.tagText, { color: '#1976D2' }]}>UPSC Focus</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#F1F8E9' }]}>
                <Text style={[styles.tagText, { color: '#388E3C' }]}>Modern India</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Primary Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Modules</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              title="Daily Quiz"
              description="Fresh questions every day"
              icon={Zap}
              gradient={Colors.gradients.royal}
              onPress={() => navigation.navigate('Quiz', { screen: 'QuizSetup' })}
              delay={500}
              styles={styles}
            />
            <FeatureCard
              title="Atlas & Map"
              description="Geo-political evolution"
              icon={MapIcon}
              gradient={Colors.gradients.ocean}
              onPress={() => navigation.navigate('Explore', { screen: 'Map' })}
              delay={600}
              styles={styles}
            />
            <FeatureCard
              title="Timeline"
              description="Connect the dots"
              icon={HistoryIcon}
              gradient={Colors.gradients.sunset}
              onPress={() => navigation.navigate('Explore')}
              delay={700}
              styles={styles}
            />
            <FeatureCard
              title="Library"
              description="Deep dive into notes"
              icon={BookMarked}
              gradient={['#4568DC', '#B06AB3']}
              onPress={() => navigation.navigate('Explore', { screen: 'Concepts' })}
              delay={800}
              styles={styles}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.activityCard}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#E8F5E9' }]}>
                <TrendingUp size={16} color="#2E7D32" />
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityLabel}>Recent Improvement</Text>
                <Text style={styles.activityValue}>+12% in Modern History</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FFF3E0' }]}>
                <BookOpen size={16} color="#EF6C00" />
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityLabel}>Focus Required</Text>
                <Text style={styles.activityValue}>Vedic Literature concepts</Text>
              </View>
            </View>
          </View>
        </Animated.View>
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 24,
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
    opacity: 0.3,
    transform: [{ rotate: '-15deg' }],
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 8,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginBottom: 28,
  },
  statsCard: {
    flex: 1,
    backgroundColor: themeColors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 6,
    borderLeftWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  statsContent: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statsText: {
    marginTop: 4,
  },
  statsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: themeColors.text,
  },
  statsTitle: {
    fontSize: 12,
    color: themeColors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aspirantCard: {
    marginHorizontal: 24,
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? '#333' : '#f0f0f0',
  },
  aspirantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: themeColors.text,
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  conceptBody: {
    gap: 10,
  },
  conceptTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: themeColors.text,
  },
  conceptDescription: {
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 28,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  featureCardContainer: {
    width: (width - 60) / 2,
    margin: 6,
  },
  featureCard: {
    borderRadius: 24,
    padding: 20,
    height: 156,
    justifyContent: 'space-between',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 12,
  },
  featureDescription: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.85,
    fontWeight: '500',
    marginTop: 4,
  },
  featureAction: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  activityCard: {
    marginHorizontal: 24,
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  activityList: {
    marginTop: 16,
    gap: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextContainer: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 12,
    color: themeColors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activityValue: {
    fontSize: 15,
    fontWeight: '700',
    color: themeColors.text,
    marginTop: 2,
  },
});

export default HomeScreen;
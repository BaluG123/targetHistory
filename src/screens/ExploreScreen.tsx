import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Colors, getThemeColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const ExploreScreen = ({ navigation }: any) => {
  const { history, user } = useSelector((state: RootState) => state);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ancient' | 'medieval' | 'modern'>('all');
  
  const isDark = user.preferences.theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);

  const CategoryCard = ({ title, description, icon, gradient, onPress, delay, comingSoon = false }: any) => (
    <Animatable.View animation="fadeInUp" delay={delay}>
      <TouchableOpacity 
        onPress={comingSoon ? () => {} : onPress} 
        activeOpacity={comingSoon ? 1 : 0.8} 
        style={[styles.categoryCard, comingSoon && styles.comingSoonCard]}
      >
        <LinearGradient
          colors={comingSoon ? ['#95A5A6', '#BDC3C7'] : gradient}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Icon name={icon} size={28} color={Colors.white} />
              {comingSoon && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Soon</Text>
                </View>
              )}
            </View>
            <Text style={styles.categoryTitle}>{title}</Text>
            <Text style={styles.categoryDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const QuickAccessCard = ({ title, subtitle, icon, color, onPress, delay }: any) => (
    <Animatable.View animation="fadeInUp" delay={delay}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.quickAccessCard}>
        <View style={[styles.quickAccessIcon, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <View style={styles.quickAccessContent}>
          <Text style={styles.quickAccessTitle}>{title}</Text>
          <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
        </View>
        <Icon name="arrow-forward-ios" size={16} color={themeColors.textTertiary} />
      </TouchableOpacity>
    </Animatable.View>
  );

  const PeriodFilter = ({ period, label }: { period: 'all' | 'ancient' | 'medieval' | 'modern', label: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(period)}
      style={[
        styles.filterChip,
        selectedCategory === period && styles.activeFilterChip
      ]}
    >
      <Text style={[
        styles.filterChipText,
        selectedCategory === period && styles.activeFilterChipText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredEvents = history.events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" delay={200}>
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Explore History</Text>
                <Text style={styles.headerSubtitle}>Discover the fascinating world of historical events, concepts, and timelines</Text>
              </View>
              <View style={styles.headerIcon}>
                <Icon name="explore" size={40} color={Colors.white} />
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Main Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by Category</Text>
          <View style={styles.categoriesGrid}>
            <CategoryCard
              title="Interactive Maps"
              description="Explore historical events on beautiful interactive maps"
              icon="map"
              gradient={Colors.gradients.ocean}
              onPress={() => navigation.navigate('Map')}
              delay={300}
            />
            <CategoryCard
              title="Timeline"
              description="Journey through time with interactive historical timelines"
              icon="timeline"
              gradient={Colors.gradients.medieval}
              onPress={() => navigation.navigate('Events')}
              delay={400}
            />
            <CategoryCard
              title="Key Concepts"
              description="Learn important historical concepts and terms"
              icon="school"
              gradient={Colors.gradients.ancient}
              onPress={() => navigation.navigate('Concepts')}
              delay={500}
            />
            <CategoryCard
              title="Rulers & Dynasties"
              description="Explore great rulers and their empires"
              icon="account-balance"
              gradient={Colors.gradients.royal}
              onPress={() => navigation.navigate('Timeline')}
              delay={600}
            />
          </View>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.categoriesGrid}>
            <CategoryCard
              title="Video Lectures"
              description="Expert lectures on key historical topics"
              icon="play-circle-filled"
              gradient={Colors.gradients.sunset}
              delay={700}
              comingSoon={true}
            />
            <CategoryCard
              title="Audio Stories"
              description="Listen to captivating historical narratives"
              icon="headset"
              gradient={Colors.gradients.ocean}
              delay={800}
              comingSoon={true}
            />
            <CategoryCard
              title="3D Monuments"
              description="Virtual tours of historical monuments"
              icon="view-in-ar"
              gradient={Colors.gradients.royal}
              delay={900}
              comingSoon={true}
            />
            <CategoryCard
              title="Study Groups"
              description="Join study groups and discuss with peers"
              icon="group"
              gradient={Colors.gradients.ancient}
              delay={1000}
              comingSoon={true}
            />
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <QuickAccessCard
            title="Recent Events"
            subtitle="Continue where you left off"
            icon="history"
            color={Colors.primary}
            onPress={() => navigation.navigate('Events')}
            delay={1100}
          />
          <QuickAccessCard
            title="Bookmarked Content"
            subtitle="Your saved historical content"
            icon="bookmark"
            color={Colors.secondary}
            onPress={() => {}}
            delay={1200}
          />
          <QuickAccessCard
            title="Study Progress"
            subtitle="Track your learning journey"
            icon="trending-up"
            color={Colors.success}
            onPress={() => {}}
            delay={1300}
          />
        </View>

        {/* Historical Events Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historical Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Period Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            <PeriodFilter period="all" label="All Periods" />
            <PeriodFilter period="ancient" label="Ancient" />
            <PeriodFilter period="medieval" label="Medieval" />
            <PeriodFilter period="modern" label="Modern" />
          </ScrollView>

          {/* Events List */}
          <View style={styles.eventsContainer}>
            {filteredEvents.slice(0, 3).map((event, index) => (
              <Animatable.View key={event.id} animation="fadeInUp" delay={1400 + index * 100}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EventDetail', { event })}
                  style={styles.eventCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.eventContent}>
                    <View style={[styles.eventPeriodBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                      <Text style={styles.eventPeriodText}>{event.category}</Text>
                    </View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  </View>
                  <Icon name="arrow-forward-ios" size={16} color={themeColors.textTertiary} />
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>

        {/* Study Tips */}
        <Animatable.View animation="fadeInUp" delay={1700} style={styles.section}>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={[`${Colors.primary}10`, `${Colors.secondary}10`]}
              style={styles.tipGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.tipContent}>
                <Icon name="lightbulb-outline" size={24} color={Colors.primary} />
                <View style={styles.tipText}>
                  <Text style={styles.tipTitle}>Study Tip</Text>
                  <Text style={styles.tipDescription}>
                    Start with ancient history to build a strong foundation, then progress chronologically through medieval and modern periods.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ancient': return Colors.ancient;
    case 'medieval': return Colors.medieval;
    case 'modern': return Colors.modern;
    default: return Colors.primary;
  }
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.text,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  categoryCard: {
    width: (width - 50) / 2,
    margin: 5,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  comingSoonCard: {
    opacity: 0.8,
  },
  categoryGradient: {
    padding: 20,
    height: 140,
    justifyContent: 'center',
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -5,
    right: -15,
    backgroundColor: Colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 16,
  },
  quickAccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  quickAccessContent: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.text,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: themeColors.textSecondary,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: themeColors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: themeColors.textSecondary,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: Colors.white,
    fontWeight: '600',
  },
  eventsContainer: {
    paddingHorizontal: 20,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventContent: {
    flex: 1,
  },
  eventPeriodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  eventPeriodText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: themeColors.textSecondary,
    lineHeight: 18,
  },
  tipCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipGradient: {
    padding: 16,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: themeColors.textSecondary,
    lineHeight: 18,
  },
});

export default ExploreScreen;
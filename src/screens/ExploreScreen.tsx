import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Search,
  Map as MapIcon,
  History as HistoryIcon,
  Palmtree,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Sparkles,
  Zap
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { Colors, getThemeColors } from '../constants/Colors';

const CategoryItem = ({ title, icon: IconComponent, gradient, onPress, index, styles }: any) => (
  <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={styles.categoryCardWrapper}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.categoryCard}>
      <LinearGradient
        colors={gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.categoryIconCircle}>
          <IconComponent size={24} color="#fff" />
        </View>
        <Text style={styles.categoryCardTitle}>{title}</Text>
        <ChevronRight size={16} color="rgba(255,255,255,0.7)" style={styles.categoryChevron} />
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

const ExploreScreen = ({ navigation }: any) => {
  const { history, user } = useSelector((state: RootState) => state);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ancient' | 'medieval' | 'modern'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = user.preferences.theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);

  const filteredEvents = useMemo(() => {
    return history.events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [history.events, selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.headerSection}>
          <LinearGradient
            colors={isDark ? ['#1A1F2E', '#0F1419'] : [Colors.primary, '#E55A2B']}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerLabel}>Discover</Text>
                <Text style={styles.headerTitle}>History Atlas</Text>
              </View>
              <View style={styles.headerBadge}>
                <Sparkles size={16} color={Colors.warning} />
                <Text style={styles.badgeText}>Pro</Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="rgba(255,255,255,0.6)" />
              <TextInput
                placeholder="Search events, rulers, empires..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Modules</Text>
          </View>
          <View style={styles.categoriesGrid}>
            <CategoryItem
              title="Interactive Map"
              icon={MapIcon}
              gradient={Colors.gradients.ocean}
              onPress={() => navigation.navigate('Map')}
              index={0}
              styles={styles}
            />
            <CategoryItem
              title="Timeline View"
              icon={HistoryIcon}
              gradient={Colors.gradients.medieval}
              onPress={() => navigation.navigate('Events')}
              index={1}
              styles={styles}
            />
            <CategoryItem
              title="Civilizations"
              icon={Palmtree}
              gradient={Colors.gradients.ancient}
              onPress={() => navigation.navigate('Concepts')}
              index={2}
              styles={styles}
            />
            <CategoryItem
              title="Master Library"
              icon={BookOpen}
              gradient={Colors.gradients.royal}
              onPress={() => navigation.navigate('Concepts')}
              index={3}
              styles={styles}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(['all', 'ancient', 'medieval', 'modern'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterChip,
                  selectedCategory === cat && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                ]}
              >
                <Text style={[styles.filterText, selectedCategory === cat && { color: '#fff' }]}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events Preview */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Significant Moments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.seeAllText}>EXPLORE ALL</Text>
            </TouchableOpacity>
          </View>

          <View>
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 5).map((event, index) => (
                <Animated.View entering={FadeInUp.delay(400 + index * 100).springify()} key={event.id}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EventDetail', { event })}
                    style={styles.eventCard}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.eventBorder, { backgroundColor: getCategoryColor(event.category) }]} />
                    <View style={styles.eventInfo}>
                      <View style={styles.eventHeaderRow}>
                        <Text style={[styles.eventCat, { color: getCategoryColor(event.category) }]}>
                          {event.category.toUpperCase()}
                        </Text>
                        <Text style={styles.eventDate}>{event.date}</Text>
                      </View>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
                    </View>
                    <ChevronRight size={18} color={themeColors.textTertiary} />
                  </TouchableOpacity>
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Zap size={48} color={themeColors.textTertiary} opacity={0.3} />
                <Text style={styles.emptyText}>No events found matching your search</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Tips */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.tipsCard}>
          <LinearGradient
            colors={isDark ? ['#2D3748', '#1A1F2E'] : ['#FFF8F1', '#FFF0E0']}
            style={styles.tipsGradient}
          >
            <Lightbulb size={24} color={Colors.primary} />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Learning Hack</Text>
              <Text style={styles.tipsDesc}>
                Use the Interactive Map to visualize how borders and empires shifted across centuries. Geography is the stage of history!
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
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
    paddingBottom: 40,
  },
  headerSection: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: themeColors.text,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryCardWrapper: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryGradient: {
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 20,
  },
  categoryChevron: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  filterSection: {
    marginTop: 24,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: themeColors.surface,
    borderWidth: 1.5,
    borderColor: isDark ? '#2D3748' : '#EDF2F7',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: themeColors.textSecondary,
  },
  eventsSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 12,
  },
  eventBorder: {
    width: 4,
    height: '100%',
    borderRadius: 2,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCat: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  eventDate: {
    fontSize: 11,
    color: themeColors.textTertiary,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: themeColors.text,
  },
  eventDesc: {
    fontSize: 13,
    color: themeColors.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: themeColors.textTertiary,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsCard: {
    margin: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? '#2D3748' : '#FFE8D1',
  },
  tipsGradient: {
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  tipsContent: {
    flex: 1,
    gap: 4,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeColors.text,
  },
  tipsDesc: {
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 20,
  },
});

export default ExploreScreen;
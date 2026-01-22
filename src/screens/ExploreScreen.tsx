import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSelectedCategory, setSelectedRegion, setSearchQuery } from '../store/slices/historySlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ExploreScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { history, user } = useSelector((state: RootState) => state);
  const [activeTab, setActiveTab] = useState<'events' | 'rulers' | 'periods'>('events');
  
  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const filteredEvents = history.events.filter(event => {
    const matchesCategory = event.category === history.selectedCategory;
    const matchesRegion = event.region === history.selectedRegion;
    const matchesSearch = event.title.toLowerCase().includes(history.searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(history.searchQuery.toLowerCase());
    return matchesCategory && matchesRegion && matchesSearch;
  });

  const filteredRulers = history.rulers.filter(ruler => {
    const matchesSearch = ruler.name.toLowerCase().includes(history.searchQuery.toLowerCase()) ||
                         ruler.dynasty.toLowerCase().includes(history.searchQuery.toLowerCase());
    return matchesSearch;
  });

  const CategoryButton = ({ category, label }: { category: 'ancient' | 'medieval' | 'modern', label: string }) => (
    <TouchableOpacity
      onPress={() => dispatch(setSelectedCategory(category))}
      style={[
        styles.categoryButton,
        history.selectedCategory === category && styles.activeCategoryButton
      ]}
    >
      <Text style={[
        styles.categoryButtonText,
        history.selectedCategory === category && styles.activeCategoryButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const RegionButton = ({ region, label }: { region: 'world' | 'india', label: string }) => (
    <TouchableOpacity
      onPress={() => dispatch(setSelectedRegion(region))}
      style={[
        styles.regionButton,
        history.selectedRegion === region && styles.activeRegionButton
      ]}
    >
      <Text style={[
        styles.regionButtonText,
        history.selectedRegion === region && styles.activeRegionButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const EventCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetail', { event: item })}
      activeOpacity={0.8}
    >
      <Animatable.View animation="fadeInUp" style={styles.eventCard}>
        <LinearGradient
          colors={isDark ? ['#2C3E50', '#34495E'] : ['#fff', '#f8f9fa']}
          style={styles.eventCardGradient}
        >
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </View>
          <Text style={styles.eventDescription} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.eventFooter}>
            <View style={styles.eventTags}>
              <View style={[styles.tag, { backgroundColor: '#FF6B35' }]}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.tagText}>{item.region}</Text>
              </View>
            </View>
            <Icon name="arrow-forward" size={20} color="#FF6B35" />
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );

  const RulerCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RulerDetail', { ruler: item })}
      activeOpacity={0.8}
    >
      <Animatable.View animation="fadeInUp" style={styles.rulerCard}>
        <View style={styles.rulerInfo}>
          <Text style={styles.rulerName}>{item.name}</Text>
          <Text style={styles.rulerDynasty}>{item.dynasty}</Text>
          <Text style={styles.rulerReign}>
            {item.reignStart} - {item.reignEnd} {item.reignStart < 0 ? 'BCE' : 'CE'}
          </Text>
        </View>
        <Icon name="person" size={40} color="#FF6B35" />
      </Animatable.View>
    </TouchableOpacity>
  );

  const TabButton = ({ tab, label, icon }: { tab: 'events' | 'rulers' | 'periods', label: string, icon: string }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
    >
      <Icon name={icon} size={20} color={activeTab === tab ? '#fff' : '#666'} />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Explore History</Text>
        <Text style={styles.headerSubtitle}>Discover events, rulers, and periods</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events, rulers, dynasties..."
          placeholderTextColor="#666"
          value={history.searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Period:</Text>
          <CategoryButton category="ancient" label="Ancient" />
          <CategoryButton category="medieval" label="Medieval" />
          <CategoryButton category="modern" label="Modern" />
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Region:</Text>
          <RegionButton region="india" label="India" />
          <RegionButton region="world" label="World" />
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton tab="events" label="Events" icon="event" />
        <TabButton tab="rulers" label="Rulers" icon="person" />
        <TabButton tab="periods" label="Periods" icon="timeline" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'events' && (
          <FlatList
            data={filteredEvents}
            renderItem={EventCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
        
        {activeTab === 'rulers' && (
          <FlatList
            data={filteredRulers}
            renderItem={RulerCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {activeTab === 'periods' && (
          <View style={styles.comingSoon}>
            <Icon name="timeline" size={60} color="#FF6B35" />
            <Text style={styles.comingSoonText}>Historical Periods</Text>
            <Text style={styles.comingSoonSubtext}>Coming Soon!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    margin: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    marginRight: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#2C2C2C' : '#e0e0e0',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 12,
    color: isDark ? '#fff' : '#666',
  },
  activeCategoryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  regionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#2C2C2C' : '#e0e0e0',
    marginRight: 8,
  },
  activeRegionButton: {
    backgroundColor: '#2196F3',
  },
  regionButtonText: {
    fontSize: 12,
    color: isDark ? '#fff' : '#666',
  },
  activeRegionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#FF6B35',
  },
  tabButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventCardGradient: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    flex: 1,
    marginRight: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTags: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rulerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rulerInfo: {
    flex: 1,
  },
  rulerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 5,
  },
  rulerDynasty: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 5,
  },
  rulerReign: {
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginTop: 20,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginTop: 10,
  },
});

export default ExploreScreen;
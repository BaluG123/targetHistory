import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const EventsScreen = ({ navigation }: any) => {
  const { history, user } = useSelector((state: RootState) => state);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [filterRegion, setFilterRegion] = useState<'all' | 'india' | 'world'>('all');

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const filteredAndSortedEvents = history.events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = filterRegion === 'all' || event.region === filterRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return a.year - b.year;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const EventCard = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EventDetail', { event: item })}
      activeOpacity={0.8}
    >
      <Animatable.View 
        animation="fadeInUp" 
        delay={index * 100}
        style={styles.eventCard}
      >
        <LinearGradient
          colors={isDark ? ['#1E1E1E', '#2C2C2C'] : ['#fff', '#f8f9fa']}
          style={styles.eventCardGradient}
        >
          <View style={styles.eventHeader}>
            <View style={styles.eventMeta}>
              <Text style={styles.eventDate}>{item.date}</Text>
              <View style={styles.eventTags}>
                <View style={[styles.tag, { backgroundColor: getCategoryColor(item.category) }]}>
                  <Text style={styles.tagText}>{item.category}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: getRegionColor(item.region) }]}>
                  <Text style={styles.tagText}>{item.region}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {/* Toggle favorite */}}
              style={styles.favoriteButton}
            >
              <Icon 
                name={history.favorites.includes(item.id) ? "favorite" : "favorite-border"} 
                size={20} 
                color="#FF6B35" 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={3}>
            {item.description}
          </Text>

          {item.rulers && item.rulers.length > 0 && (
            <View style={styles.rulersContainer}>
              <Icon name="person" size={16} color="#666" />
              <Text style={styles.rulersText}>
                {item.rulers.join(', ')}
              </Text>
            </View>
          )}

          <View style={styles.eventFooter}>
            <View style={styles.significanceContainer}>
              <Icon name="info" size={16} color="#FF6B35" />
              <Text style={styles.significanceText} numberOfLines={2}>
                {item.significance}
              </Text>
            </View>
            <Icon name="arrow-forward" size={20} color="#FF6B35" />
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ancient': return '#4CAF50';
      case 'medieval': return '#FF9800';
      case 'modern': return '#2196F3';
      default: return '#666';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'india': return '#FF6B35';
      case 'world': return '#9C27B0';
      default: return '#666';
    }
  };

  const FilterButton = ({ value, label, isActive, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
    >
      <Text style={[styles.filterButtonText, isActive && styles.activeFilterButtonText]}>
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
        <Text style={styles.headerTitle}>Historical Events</Text>
        <Text style={styles.headerSubtitle}>
          {filteredAndSortedEvents.length} events found
        </Text>
      </LinearGradient>

      {/* Search and Filters */}
      <View style={styles.controlsContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Region:</Text>
            <FilterButton
              value="all"
              label="All"
              isActive={filterRegion === 'all'}
              onPress={() => setFilterRegion('all')}
            />
            <FilterButton
              value="india"
              label="India"
              isActive={filterRegion === 'india'}
              onPress={() => setFilterRegion('india')}
            />
            <FilterButton
              value="world"
              label="World"
              isActive={filterRegion === 'world'}
              onPress={() => setFilterRegion('world')}
            />
          </View>

          <View style={styles.sortContainer}>
            <TouchableOpacity
              onPress={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
              style={styles.sortButton}
            >
              <Icon 
                name={sortBy === 'date' ? 'sort' : 'sort-by-alpha'} 
                size={20} 
                color="#FF6B35" 
              />
              <Text style={styles.sortText}>
                {sortBy === 'date' ? 'Date' : 'Name'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Events List */}
      <FlatList
        data={filteredAndSortedEvents}
        renderItem={({ item, index }) => <EventCard item={item} index={index} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="event-note" size={60} color="#666" />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      />

      {/* Timeline Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Timeline')}
        style={styles.timelineButton}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={styles.timelineButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Icon name="timeline" size={24} color="#fff" />
          <Text style={styles.timelineButtonText}>View Timeline</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  controlsContainer: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
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
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    marginRight: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: isDark ? '#2C2C2C' : '#e0e0e0',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 12,
    color: isDark ? '#fff' : '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sortContainer: {
    marginLeft: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sortText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    marginBottom: 15,
  },
  eventMeta: {
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
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
  favoriteButton: {
    padding: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  rulersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rulersText: {
    marginLeft: 8,
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
    fontStyle: 'italic',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  significanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
  },
  significanceText: {
    marginLeft: 8,
    fontSize: 12,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 16,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  timelineButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timelineButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  timelineButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EventsScreen;
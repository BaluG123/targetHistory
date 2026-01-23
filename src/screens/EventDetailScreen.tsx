import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/slices/historySlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const InfoCard = ({ title, content, icon, styles }: any) => (
  <Animated.View entering={FadeInUp} style={styles.infoCard}>
    <View style={styles.infoHeader}>
      <Icon name={icon} size={24} color="#FF6B35" />
      <Text style={styles.infoTitle}>{title}</Text>
    </View>
    <Text style={styles.infoContent}>{content}</Text>
  </Animated.View>
);

const EventDetailScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const { history, user } = useSelector((state: RootState) => state);
  const { event } = route.params;

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const isFavorite = history.favorites.includes(event.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(event.id));
  };

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

  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    }
    return `${year} CE`;
  };

  // No need for a second InfoCard definition inside the component, 
  // but if it's there, let's update or remove it. 
  // It seems there was a duplicate InfoCard at line 65.

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Icon
              name={isFavorite ? "favorite" : "favorite-border"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>{event.date}</Text>

          <View style={styles.eventTags}>
            <View style={[styles.tag, { backgroundColor: getCategoryColor(event.category) }]}>
              <Text style={styles.tagText}>{event.category}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: getRegionColor(event.region) }]}>
              <Text style={styles.tagText}>{event.region}</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Description */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Overview</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </Animated.View>

        {/* Historical Significance */}
        {event.significance && (
          <InfoCard
            title="Historical Significance"
            content={event.significance}
            icon="info"
            styles={styles}
          />
        )}

        {/* Key Figures */}
        {event.rulers && event.rulers.length > 0 && (
          <Animated.View entering={FadeInUp.delay(700)} style={styles.rulersCard}>
            <View style={styles.infoHeader}>
              <Icon name="person" size={24} color="#FF6B35" />
              <Text style={styles.infoTitle}>Key Figures</Text>
            </View>
            {event.rulers.map((ruler: string, _index: number) => (
              <View key={_index} style={styles.rulerItem}>
                <Icon name="account-circle" size={20} color="#666" />
                <Text style={styles.rulerName}>{ruler}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Timeline Context */}
        <Animated.View entering={FadeInUp.delay(900)} style={styles.timelineCard}>
          <View style={styles.infoHeader}>
            <Icon name="timeline" size={24} color="#FF6B35" />
            <Text style={styles.infoTitle}>Timeline Context</Text>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineYear}>{formatYear(event.year)}</Text>
              <Text style={styles.timelineEvent}>{event.title}</Text>
            </View>
          </View>

          {/* Add related events from the same period */}
          {history.events
            .filter(e =>
              e.id !== event.id &&
              e.category === event.category &&
              e.region === event.region &&
              Math.abs(e.year - event.year) <= 100
            )
            .slice(0, 3)
            .map((relatedEvent, index) => (
              <View key={relatedEvent.id} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#ccc' }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>{formatYear(relatedEvent.year)}</Text>
                  <Text style={styles.relatedEvent}>{relatedEvent.title}</Text>
                </View>
              </View>
            ))
          }
        </Animated.View>

        {/* Location */}
        {event.latitude && event.longitude && (
          <Animated.View entering={FadeInUp.delay(1100)} style={styles.locationCard}>
            <View style={styles.infoHeader}>
              <Icon name="place" size={24} color="#FF6B35" />
              <Text style={styles.infoTitle}>Location</Text>
            </View>
            <Text style={styles.locationNameText}>
              {event.locationName || 'Historical Site'}
            </Text>
            <Text style={styles.coordinatesText}>
              {event.latitude.toFixed(4)}°, {event.longitude.toFixed(4)}°
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Map')}
              style={styles.viewMapButton}
            >
              <Icon name="map" size={20} color="#FF6B35" />
              <Text style={styles.viewMapText}>View on Map</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Related Concepts */}
        <Animated.View entering={FadeInUp.delay(1300)} style={styles.conceptsCard}>
          <View style={styles.infoHeader}>
            <Icon name="school" size={24} color="#FF6B35" />
            <Text style={styles.infoTitle}>Related Concepts</Text>
          </View>

          <View style={styles.conceptsList}>
            {event.category === 'ancient' && (
              <>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Ancient Civilizations</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Early Kingdoms</Text>
                </TouchableOpacity>
              </>
            )}
            {event.category === 'medieval' && (
              <>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Medieval Dynasties</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Trade Routes</Text>
                </TouchableOpacity>
              </>
            )}
            {event.category === 'modern' && (
              <>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Colonial Period</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.conceptChip}>
                  <Text style={styles.conceptText}>Independence Movement</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(1500)} style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Quiz')}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9C27B0', '#673AB7']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="quiz" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Take Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Timeline')}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF5722', '#FF7043']}
              style={styles.actionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="timeline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>View Timeline</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 30,
  },
  eventDate: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  eventTags: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  descriptionCard: {
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
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginLeft: 10,
  },
  infoContent: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 22,
  },
  rulersCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rulerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rulerName: {
    marginLeft: 10,
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
  },
  timelineCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    marginTop: 4,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineEvent: {
    fontSize: 14,
    color: isDark ? '#fff' : '#333',
    fontWeight: '600',
  },
  relatedEvent: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
  },
  locationCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginBottom: 15,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewMapText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  conceptsCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  conceptsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conceptChip: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  conceptText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EventDetailScreen;
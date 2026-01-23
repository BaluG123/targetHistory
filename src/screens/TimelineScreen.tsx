import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const TimelineScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state);

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Timeline</Text>
        <Text style={styles.headerSubtitle}>Journey through history</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp} style={styles.comingSoonContainer}>
          <Icon name="timeline" size={80} color="#FF6B35" />
          <Text style={styles.comingSoonTitle}>Interactive Timeline</Text>
          <Text style={styles.comingSoonSubtitle}>Coming Soon!</Text>
          <Text style={styles.comingSoonDescription}>
            We're working on an amazing interactive timeline that will let you:
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="touch-app" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Navigate through different time periods</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="zoom-in" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Zoom in and out of historical eras</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="filter-list" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Filter events by category and region</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="compare" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Compare parallel events across regions</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="play-arrow" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Animated progression through time</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Events')}
            style={styles.exploreButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.exploreButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="explore" size={20} color="#fff" />
              <Text style={styles.exploreButtonText}>Explore Events Instead</Text>
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
  backButton: {
    marginBottom: 20,
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
  content: {
    flex: 1,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontSize: 18,
    color: '#FF6B35',
    marginTop: 10,
    fontWeight: '600',
  },
  comingSoonDescription: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 24,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    flex: 1,
  },
  exploreButton: {
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TimelineScreen;
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
import * as Animatable from 'react-native-animatable';

const formatReign = (start: number, end: number) => {
  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };
  return `${formatYear(start)} - ${formatYear(end)}`;
};

const getReignDuration = (start: number, end: number) => {
  return Math.abs(end - start);
};

const RulerDetailScreen = ({ route, navigation }: any) => {
  const { user } = useSelector((state: RootState) => state);
  const { ruler } = route.params;

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

        <Animatable.View animation="fadeInDown" delay={300} style={styles.rulerInfo}>
          <Icon name="account-circle" size={60} color="#fff" />
          <Text style={styles.rulerName}>{ruler.name}</Text>
          <Text style={styles.rulerDynasty}>{ruler.dynasty}</Text>
          <Text style={styles.rulerReign}>{formatReign(ruler.reignStart, ruler.reignEnd)}</Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reign Summary */}
        <Animatable.View animation="fadeInUp" delay={500} style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Reign Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{getReignDuration(ruler.reignStart, ruler.reignEnd)} years</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dynasty:</Text>
            <Text style={styles.summaryValue}>{ruler.dynasty}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Region:</Text>
            <Text style={styles.summaryValue}>{ruler.region}</Text>
          </View>
        </Animatable.View>

        {/* Achievements */}
        <Animatable.View animation="fadeInUp" delay={700} style={styles.achievementsCard}>
          <View style={styles.cardHeader}>
            <Icon name="star" size={24} color="#FF6B35" />
            <Text style={styles.cardTitle}>Major Achievements</Text>
          </View>
          {ruler.achievements.map((achievement: string, index: number) => (
            <View key={index} style={styles.achievementItem}>
              <Icon name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </Animatable.View>

        {/* Coming Soon Features */}
        <Animatable.View animation="fadeInUp" delay={900} style={styles.comingSoonCard}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <View style={styles.featureItem}>
            <Icon name="timeline" size={20} color="#666" />
            <Text style={styles.featureText}>Detailed Timeline</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="map" size={20} color="#666" />
            <Text style={styles.featureText}>Territory Maps</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="people" size={20} color="#666" />
            <Text style={styles.featureText}>Family Tree</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="book" size={20} color="#666" />
            <Text style={styles.featureText}>Historical Sources</Text>
          </View>
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 5,
  },
  rulerInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  rulerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  rulerDynasty: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  rulerReign: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
  },
  achievementsCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  achievementText: {
    marginLeft: 12,
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    flex: 1,
    lineHeight: 20,
  },
  comingSoonCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 14,
    color: isDark ? '#888' : '#999',
  },
});

export default RulerDetailScreen;
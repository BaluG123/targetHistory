import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    StatusBar.setHidden(true);
    
    // Navigate to main app after 2 seconds
    const timer = setTimeout(() => {
      StatusBar.setHidden(false);
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  const particleIcons = ['schedule', 'public', 'account_balance', 'library_books', 'explore', 'star'];
  const particlePositions = [
    { top: height * 0.2, left: width * 0.15 },
    { top: height * 0.25, right: width * 0.2 },
    { top: height * 0.35, left: width * 0.1 },
    { top: height * 0.4, right: width * 0.15 },
    { top: height * 0.55, left: width * 0.2 },
    { top: height * 0.6, right: width * 0.25 },
  ];

  return (
    <LinearGradient
      colors={Colors.gradients.sunset}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar hidden />
      
      {/* Background Particles */}
      {particleIcons.map((iconName, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          delay={800 + index * 100}
          duration={800}
          style={[
            styles.particle,
            particlePositions[index],
          ]}
        >
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            delay={index * 200}
          >
            <Icon
              name={iconName}
              size={24}
              color="rgba(255, 255, 255, 0.3)"
            />
          </Animatable.View>
        </Animatable.View>
      ))}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Container */}
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          delay={200}
          style={styles.logoContainer}
        >
          <View style={styles.logoBackground}>
            <Animatable.View
              animation="rotate"
              iterationCount="infinite"
              duration={3000}
              style={styles.iconContainer}
            >
              <Icon name="account_balance" size={60} color={Colors.white} />
            </Animatable.View>
          </View>
        </Animatable.View>

        {/* Title */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={600}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Target History</Text>
          <Animatable.View
            animation="slideInLeft"
            duration={600}
            delay={1000}
            style={styles.titleUnderline}
          />
        </Animatable.View>

        {/* Subtitle */}
        <Animatable.View
          animation="fadeIn"
          duration={800}
          delay={1200}
          style={styles.subtitleContainer}
        >
          <Text style={styles.subtitle}>Journey Through Time</Text>
          <Animatable.Text
            animation="fadeIn"
            delay={1400}
            style={styles.tagline}
          >
            Discover • Learn • Explore
          </Animatable.Text>
        </Animatable.View>
      </View>

      {/* Bottom Decoration */}
      <Animatable.View
        animation="fadeInUp"
        delay={1600}
        style={styles.bottomDecoration}
      >
        <View style={styles.decorationLine} />
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          duration={1500}
        >
          <Icon name="history" size={20} color="rgba(255, 255, 255, 0.7)" />
        </Animatable.View>
        <View style={styles.decorationLine} />
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: Colors.white,
    marginTop: 8,
    borderRadius: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 2,
  },
  particle: {
    position: 'absolute',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorationLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 15,
  },
});

export default SplashScreen;
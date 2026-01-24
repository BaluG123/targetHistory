import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Colors, getThemeColors } from '../constants/Colors';
import { configureGoogleSignIn } from '../config/firebase';
import SplashScreen from '../screens/SplashScreen';

// Screens
import TestListScreen from '../screens/tests/TestListScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizSetupScreen from '../screens/QuizSetupScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import TestScreen from '../screens/TestScreen';
import TestResultScreen from '../screens/TestResultScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import RulerDetailScreen from '../screens/RulerDetailScreen';
import TimelineScreen from '../screens/TimelineScreen';
import MapScreen from '../screens/MapScreen';
import ConceptsScreen from '../screens/ConceptsScreen';
import EventsScreen from '../screens/EventsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const QuizStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="QuizSetup" component={QuizSetupScreen} />
    <Stack.Screen name="Quiz" component={QuizScreen} />
    <Stack.Screen name="QuizResult" component={QuizResultScreen} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExploreMain" component={ExploreScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="RulerDetail" component={RulerDetailScreen} />
    <Stack.Screen name="Timeline" component={TimelineScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Concepts" component={ConceptsScreen} />
    <Stack.Screen name="Events" component={EventsScreen} />
  </Stack.Navigator>
);

const TestsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TestList" component={TestListScreen} />
    <Stack.Screen name="Test" component={TestScreen} />
    <Stack.Screen name="TestResult" component={TestResultScreen} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const theme = useSelector((state: RootState) => state.user.preferences.theme);
  const isDark = theme === 'dark';
  const themeColors = getThemeColors(isDark);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: string;
    let iconSize = focused ? size + 2 : size;

    switch (routeName) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Explore':
        iconName = 'explore';
        break;
      case 'Quiz':
        iconName = 'quiz';
        break;
      case 'Tests':
        iconName = 'assignment';
        break;
      case 'Profile':
        iconName = 'person';
        break;
      default:
        iconName = 'help';
    }

    return (
      <Icon
        name={iconName}
        size={iconSize}
        color={focused ? Colors.primary : color}
        style={{
          textShadowColor: focused ? 'rgba(255, 107, 53, 0.3)' : 'transparent',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      />
    );
  };

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: Colors.primary,
          background: themeColors.background,
          card: themeColors.surface,
          text: themeColors.text,
          border: themeColors.border,
          notification: Colors.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) =>
            getTabBarIcon(route.name, focused, color, size),
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: themeColors.textTertiary,
          tabBarStyle: {
            backgroundColor: themeColors.surface,
            borderTopColor: themeColors.border,
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 8,
            shadowColor: themeColors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreStack}
          options={{
            tabBarLabel: 'Explore',
          }}
        />
        <Tab.Screen
          name="Quiz"
          component={QuizStack}
          options={{
            tabBarLabel: 'Quiz',
          }}
        />
        <Tab.Screen
          name="Tests"
          component={TestsStack}
          options={{
            tabBarLabel: 'Tests',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
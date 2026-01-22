// Enhanced Color Palette for Target History App
export const Colors = {
  // Primary Brand Colors
  primary: '#FF6B35',        // Vibrant Orange - Main brand color
  primaryDark: '#E55A2B',    // Darker orange for pressed states
  primaryLight: '#FF8A5C',   // Lighter orange for highlights
  
  // Secondary Colors
  secondary: '#4A90E2',      // Professional Blue
  secondaryDark: '#357ABD',  // Darker blue
  secondaryLight: '#6BA3E8', // Lighter blue
  
  // Accent Colors for Categories
  ancient: '#2ECC71',        // Fresh Green for Ancient period
  medieval: '#F39C12',       // Golden Orange for Medieval period
  modern: '#3498DB',         // Bright Blue for Modern period
  
  // Success & Status Colors
  success: '#27AE60',        // Success green
  warning: '#F1C40F',        // Warning yellow
  error: '#E74C3C',          // Error red
  info: '#3498DB',           // Info blue
  
  // Neutral Colors - Light Theme
  light: {
    background: '#FAFBFC',     // Very light gray background
    surface: '#FFFFFF',        // Pure white for cards
    surfaceSecondary: '#F8F9FA', // Light gray for secondary surfaces
    text: '#2C3E50',           // Dark blue-gray for primary text
    textSecondary: '#7F8C8D',  // Medium gray for secondary text
    textTertiary: '#BDC3C7',   // Light gray for tertiary text
    border: '#E9ECEF',         // Light border color
    shadow: '#000000',         // Shadow color
    overlay: 'rgba(0,0,0,0.5)', // Modal overlay
  },
  
  // Neutral Colors - Dark Theme
  dark: {
    background: '#0F1419',     // Very dark blue-black
    surface: '#1A1F2E',        // Dark blue-gray for cards
    surfaceSecondary: '#252A3A', // Slightly lighter for secondary surfaces
    text: '#FFFFFF',           // Pure white for primary text
    textSecondary: '#B8BCC8',  // Light gray for secondary text
    textTertiary: '#6C7293',   // Medium gray for tertiary text
    border: '#2D3748',         // Dark border color
    shadow: '#000000',         // Shadow color
    overlay: 'rgba(0,0,0,0.7)', // Modal overlay
  },
  
  // Gradient Colors
  gradients: {
    primary: ['#FF6B35', '#FF8A5C'],
    secondary: ['#4A90E2', '#6BA3E8'],
    ancient: ['#2ECC71', '#58D68D'],
    medieval: ['#F39C12', '#F8C471'],
    modern: ['#3498DB', '#5DADE2'],
    sunset: ['#FF6B35', '#F39C12'],
    ocean: ['#3498DB', '#2ECC71'],
    royal: ['#8E44AD', '#3498DB'],
  },
  
  // Interactive Colors
  interactive: {
    hover: 'rgba(255, 107, 53, 0.1)',
    pressed: 'rgba(255, 107, 53, 0.2)',
    focus: 'rgba(255, 107, 53, 0.3)',
    disabled: '#BDC3C7',
  },
  
  // Quiz Colors
  quiz: {
    correct: '#27AE60',
    incorrect: '#E74C3C',
    selected: '#FF6B35',
    unselected: '#ECF0F1',
    easy: '#2ECC71',
    medium: '#F39C12',
    hard: '#E74C3C',
  },
  
  // Map Colors
  map: {
    ancient: '#2ECC71',
    medieval: '#F39C12',
    modern: '#3498DB',
    india: '#FF6B35',
    world: '#9B59B6',
  },
  
  // Achievement Colors
  achievements: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  },
  
  // Transparent Colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

// Helper function to get category color
export const getCategoryColor = (category: 'ancient' | 'medieval' | 'modern') => {
  switch (category) {
    case 'ancient':
      return Colors.ancient;
    case 'medieval':
      return Colors.medieval;
    case 'modern':
      return Colors.modern;
    default:
      return Colors.primary;
  }
};

// Helper function to get region color
export const getRegionColor = (region: 'india' | 'world') => {
  switch (region) {
    case 'india':
      return Colors.map.india;
    case 'world':
      return Colors.map.world;
    default:
      return Colors.primary;
  }
};
# Target History - World Class History Learning App

A comprehensive, world-class history learning application built with React Native, featuring interactive maps, engaging quizzes, and extensive historical content covering both Indian and World history.

## 🌟 Features

### 📚 Comprehensive Content
- **Ancient History**: From Indus Valley Civilization to Gupta Empire
- **Medieval History**: Delhi Sultanate, Mughal Empire, and more
- **Modern History**: Colonial period to Independence and beyond
- **World History**: Ancient civilizations, empires, and modern events
- **Historical Concepts**: AD/BC system, dynasties, feudalism, trade routes, and more

### 🗺️ Interactive Maps
- **Leaflet Integration**: Beautiful, interactive maps showing historical events
- **Event Locations**: Precise geographical locations of historical events
- **Time-based Filtering**: View events by historical periods
- **Detailed Popups**: Rich information about each historical location

### 🧠 Smart Quiz System
- **Adaptive Difficulty**: Easy, Medium, and Hard questions
- **Category Filtering**: Ancient, Medieval, Modern periods
- **Region Focus**: Indian History vs World History
- **Detailed Explanations**: Learn from every question
- **Progress Tracking**: Monitor your learning journey
- **Achievements System**: Unlock badges and rewards

### 📱 Modern UI/UX
- **Dark/Light Theme**: Comfortable viewing in any environment
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Responsive Design**: Optimized for all screen sizes
- **Intuitive Navigation**: Easy-to-use bottom tab navigation

### 🎯 Learning Features
- **Favorites System**: Save important events for quick access
- **Search Functionality**: Find specific events, rulers, or concepts
- **Timeline View**: Chronological understanding of events
- **Ruler Profiles**: Detailed information about historical figures
- **Concept Explanations**: Clear explanations of historical terms

## 🏗️ Technical Architecture

### Frontend
- **React Native 0.83.1**: Latest stable version
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **React Navigation 6**: Navigation system
- **React Native Vector Icons**: Beautiful iconography
- **React Native Animatable**: Smooth animations
- **React Native Linear Gradient**: Beautiful gradients

### Maps & Visualization
- **React Native WebView**: For Leaflet map integration
- **Leaflet**: Interactive mapping library
- **Custom Markers**: Historical event markers with categories

### UI Components
- **React Native Paper**: Material Design components
- **React Native Progress**: Progress indicators
- **React Native Modal**: Modal dialogs
- **Custom Components**: Tailored for historical content

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── data/               # Historical data and quiz questions
│   ├── historicalData.ts
│   └── quizData.ts
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── ConceptsScreen.tsx
│   ├── EventsScreen.tsx
│   ├── MapScreen.tsx
│   ├── QuizScreen.tsx
│   ├── QuizSetupScreen.tsx
│   ├── QuizResultScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── EventDetailScreen.tsx
│   ├── RulerDetailScreen.tsx
│   └── TimelineScreen.tsx
└── store/             # Redux store configuration
    ├── index.ts
    └── slices/
        ├── historySlice.ts
        ├── quizSlice.ts
        └── userSlice.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TargetHistory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run the app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## 📊 Data Structure

### Historical Events
```typescript
interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  year: number;
  category: 'ancient' | 'medieval' | 'modern';
  region: 'world' | 'india';
  latitude?: number;
  longitude?: number;
  rulers?: string[];
  significance: string;
}
```

### Quiz Questions
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'ancient' | 'medieval' | 'modern';
  region: 'world' | 'india';
  points: number;
}
```

## 🎨 Design System

### Colors
- **Primary**: #FF6B35 (Orange)
- **Secondary**: #F7931E (Light Orange)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Amber)
- **Error**: #F44336 (Red)
- **Info**: #2196F3 (Blue)

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: Light, 12px

## 🔄 State Management

The app uses Redux Toolkit for state management with three main slices:

1. **History Slice**: Manages historical events, periods, and rulers
2. **Quiz Slice**: Handles quiz state, questions, and results
3. **User Slice**: User profile, preferences, and statistics

## 🗺️ Map Integration

The app uses Leaflet maps through React Native WebView for:
- Displaying historical events on an interactive map
- Custom markers for different historical periods
- Popup information for each event
- Filtering by time periods and regions

## 📱 Responsive Design

- Optimized for both phones and tablets
- Dark and light theme support
- Smooth animations and transitions
- Accessibility features

## 🔮 Future Enhancements

- **API Integration**: Connect to external historical databases
- **Offline Mode**: Download content for offline learning
- **Social Features**: Share achievements and compete with friends
- **Advanced Analytics**: Detailed learning progress tracking
- **Voice Narration**: Audio descriptions of historical events
- **AR Features**: Augmented reality historical experiences
- **Multi-language Support**: Support for multiple Indian languages

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Historical data sourced from various educational institutions
- Map tiles provided by OpenStreetMap
- Icons by Material Design Icons
- Special thanks to the React Native community

---

**Target History** - Making history learning engaging, interactive, and accessible for students preparing for government exams and history enthusiasts worldwide.
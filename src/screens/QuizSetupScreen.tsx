import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setQuizSettings, startQuiz } from '../store/slices/quizSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const QuizSetupScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedRegion, setSelectedRegion] = useState<'world' | 'india'>('india');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10); // minutes

  const isDark = user.preferences.theme === 'dark';

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Beginner friendly history questions.', color: '#4CAF50', icon: 'mood' },
    { value: 'medium', label: 'Medium', description: 'A balanced challenge for learners.', color: '#FF9800', icon: 'psychology' },
    { value: 'hard', label: 'Hard', description: 'Tough questions for experts.', color: '#F44336', icon: 'workspace-premium' },
  ];

  const regionOptions = [
    { value: 'india', label: 'Indian History', description: 'Deep dive into the sub-continent.', icon: 'flag', gradient: ['#FF9933', '#FFFFFF', '#138808'] },
    { value: 'world', label: 'World History', description: 'Global events and civilizations.', icon: 'public', gradient: ['#4FACFE', '#00F2FE'] },
  ];

  const questionCountOptions = [5, 10, 15, 20];
  const timeLimitOptions = [5, 10, 15, 20];

  const handleStartQuiz = () => {
    const filteredQuestions = quiz.questions.filter(q =>
      q.difficulty === selectedDifficulty &&
      q.region === selectedRegion
    );

    if (filteredQuestions.length === 0) {
      Alert.alert('No Questions', 'No questions found for this selection. Try changing difficulty or region.');
      return;
    }

    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const finalCount = Math.min(questionCount, shuffled.length);

    dispatch(setQuizSettings({
      difficulty: selectedDifficulty,
      category: 'mixed',
      region: selectedRegion,
    }));

    dispatch(startQuiz({
      questions: shuffled.slice(0, finalCount),
      timeLimit: timeLimit * 60,
      mode: 'classic',
    }));

    navigation.navigate('Quiz');
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartQuiz();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderDifficultyStep = () => (
    <Animated.View entering={FadeInRight.duration(400)} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, isDark && { color: '#fff' }]}>Pick your Challenge</Text>
      <Text style={styles.stepSubtitle}>How deep is your historical knowledge?</Text>

      {difficultyOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => setSelectedDifficulty(opt.value as any)}
          style={[
            styles.diffCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#fff' },
            selectedDifficulty === opt.value && { borderColor: opt.color, borderWidth: 2 }
          ]}
          activeOpacity={0.9}
        >
          <View style={[styles.diffIconContainer, { backgroundColor: opt.color }]}>
            <Icon name={opt.icon} size={30} color="#fff" />
          </View>
          <View style={styles.diffTextContainer}>
            <Text style={[styles.diffLabel, isDark && { color: '#fff' }, selectedDifficulty === opt.value && { color: opt.color }]}>{opt.label}</Text>
            <Text style={styles.diffDesc}>{opt.description}</Text>
          </View>
          {selectedDifficulty === opt.value && (
            <Icon name="check-circle" size={24} color={opt.color} />
          )}
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderGeographyStep = () => (
    <Animated.View entering={FadeInRight.duration(400)} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, isDark && { color: '#fff' }]}>Global or Local?</Text>
      <Text style={styles.stepSubtitle}>Select the arena of your trivia quest.</Text>

      <View style={styles.geoGrid}>
        {regionOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setSelectedRegion(opt.value as any)}
            style={styles.geoCardWrapper}
            activeOpacity={0.9}
          >
            <Animated.View
              style={[
                styles.geoCard,
                selectedRegion === opt.value && styles.selectedGeoCard
              ]}
            >
              <LinearGradient
                colors={opt.gradient as any}
                style={styles.geoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name={opt.icon} size={40} color={selectedRegion === opt.value ? '#fff' : 'rgba(255,255,255,0.7)'} />
                <Text style={styles.geoLabel}>{opt.label}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.infoBox}>
        <Icon name="info" size={20} color="#FF6B35" />
        <Text style={styles.infoText}>Questions will be a mix of Ancient, Medieval, and Modern periods.</Text>
      </View>
    </Animated.View>
  );

  const renderParameterStep = () => (
    <Animated.View entering={FadeInRight.duration(400)} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, isDark && { color: '#fff' }]}>Set the Stakes</Text>
      <Text style={styles.stepSubtitle}>Adjust the volume and the clock.</Text>

      <View style={styles.paramSection}>
        <Text style={[styles.paramLabel, isDark && { color: '#fff' }]}>Question Count</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {questionCountOptions.map(count => (
            <TouchableOpacity
              key={count}
              onPress={() => setQuestionCount(count)}
              style={[
                styles.chip,
                { backgroundColor: isDark ? '#1E1E1E' : '#fff', borderColor: isDark ? '#333' : '#eee' },
                questionCount === count && styles.selectedChip
              ]}
            >
              <Text style={[styles.chipText, isDark && { color: '#fff' }, questionCount === count && styles.selectedChipText]}>{count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.paramSection}>
        <Text style={[styles.paramLabel, isDark && { color: '#fff' }]}>Time Limit (Minutes)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {timeLimitOptions.map(time => (
            <TouchableOpacity
              key={time}
              onPress={() => setTimeLimit(time)}
              style={[
                styles.chip,
                { backgroundColor: isDark ? '#1E1E1E' : '#fff', borderColor: isDark ? '#333' : '#eee' },
                timeLimit === time && styles.selectedChip
              ]}
            >
              <Text style={[styles.chipText, isDark && { color: '#fff' }, timeLimit === time && styles.selectedChipText]}>{time}m</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.summaryBox, { backgroundColor: isDark ? '#1E1E1E' : '#eee' }]}>
        <View style={styles.summaryItem}>
          <Icon name="history" size={20} color={isDark ? '#888' : '#666'} />
          <Text style={[styles.summaryText, isDark && { color: '#888' }]}>{selectedDifficulty.toUpperCase()} • {selectedRegion === 'india' ? 'INDIA' : 'WORLD'} • MIXED</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <LinearGradient
        colors={isDark ? ['#1A1A1A', '#121212'] : ['#FF6B35', '#F7931E']}
        style={styles.topBar}
      >
        <TouchableOpacity onPress={prevStep} style={styles.iconButton}>
          <Icon name={currentStep === 0 ? "close" : "arrow-back"} size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentStep === i && styles.activeDot,
                currentStep > i && styles.completedDot
              ]}
            />
          ))}
        </View>

        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.mainContent}>
        {currentStep === 0 && renderDifficultyStep()}
        {currentStep === 1 && renderGeographyStep()}
        {currentStep === 2 && renderParameterStep()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={nextStep}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B35', '#F7931E']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {currentStep === 2 ? "START QUIZ" : "CONTINUE"}
            </Text>
            <Icon name={currentStep === 2 ? "bolt" : "arrow-forward"} size={22} color="#fff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#fff',
  },
  completedDot: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  diffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 4 }
    }),
  },
  diffIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  diffTextContainer: {
    flex: 1,
  },
  diffLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  diffDesc: {
    fontSize: 13,
    color: '#888',
  },
  geoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  geoCardWrapper: {
    width: '48%',
    aspectRatio: 1,
  },
  geoCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedGeoCard: {
    borderColor: '#FF6B35',
  },
  geoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  geoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
  },
  infoText: {
    fontSize: 13,
    color: '#FF6B35',
    marginLeft: 10,
    flex: 1,
    fontWeight: '600',
  },
  paramSection: {
    marginBottom: 30,
  },
  paramLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
  },
  chipContainer: {
    paddingBottom: 10,
  },
  chip: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  chipText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedChipText: {
    color: '#fff',
  },
  summaryBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 1,
  },
  footer: {
    padding: 25,
    backgroundColor: 'transparent',
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    height: 60,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default QuizSetupScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setQuizSettings, startQuiz } from '../store/slices/quizSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const QuizSetupScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedCategory, setSelectedCategory] = useState<'ancient' | 'medieval' | 'modern'>('ancient');
  const [selectedRegion, setSelectedRegion] = useState<'world' | 'india'>('india');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10); // minutes

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: '10 points per question', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', description: '20 points per question', color: '#FF9800' },
    { value: 'hard', label: 'Hard', description: '30 points per question', color: '#F44336' },
  ];

  const categoryOptions = [
    { value: 'ancient', label: 'Ancient', description: 'Before 550 CE', icon: 'account-balance' },
    { value: 'medieval', label: 'Medieval', description: '550 - 1707 CE', icon: 'castle' },
    { value: 'modern', label: 'Modern', description: '1707 CE onwards', icon: 'business' },
  ];

  const regionOptions = [
    { value: 'india', label: 'Indian History', description: 'Focus on Indian subcontinent', icon: 'flag' },
    { value: 'world', label: 'World History', description: 'Global historical events', icon: 'public' },
  ];

  const questionCountOptions = [5, 10, 15, 20];
  const timeLimitOptions = [5, 10, 15, 20]; // minutes

  const startQuizHandler = () => {
    // Filter questions based on selected criteria
    const filteredQuestions = quiz.questions.filter(q => 
      q.difficulty === selectedDifficulty &&
      q.category === selectedCategory &&
      q.region === selectedRegion
    );

    if (filteredQuestions.length < questionCount) {
      Alert.alert(
        'Not Enough Questions',
        `Only ${filteredQuestions.length} questions available for the selected criteria. Please adjust your selection.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Shuffle and select questions
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, questionCount);

    dispatch(setQuizSettings({
      difficulty: selectedDifficulty,
      category: selectedCategory,
      region: selectedRegion,
    }));

    dispatch(startQuiz({
      questions: selectedQuestions,
      timeLimit: timeLimit * 60, // convert to seconds
    }));

    navigation.navigate('Quiz');
  };

  const OptionCard = ({ option, isSelected, onPress, type }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animatable.View
        animation={isSelected ? "pulse" : undefined}
        style={[
          styles.optionCard,
          isSelected && styles.selectedOptionCard,
          { borderColor: isSelected ? option.color || '#FF6B35' : 'transparent' }
        ]}
      >
        <View style={styles.optionHeader}>
          {option.icon && <Icon name={option.icon} size={24} color={isSelected ? '#FF6B35' : '#666'} />}
          <Text style={[styles.optionTitle, isSelected && styles.selectedOptionTitle]}>
            {option.label}
          </Text>
          {isSelected && <Icon name="check-circle" size={20} color="#FF6B35" />}
        </View>
        <Text style={[styles.optionDescription, isSelected && styles.selectedOptionDescription]}>
          {option.description}
        </Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  const NumberSelector = ({ options, selected, onSelect, label }: any) => (
    <View style={styles.numberSelectorContainer}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.numberOptions}>
        {options.map((option: number) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.numberOption,
              selected === option && styles.selectedNumberOption
            ]}
          >
            <Text style={[
              styles.numberOptionText,
              selected === option && styles.selectedNumberOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Quiz Setup</Text>
        <Text style={styles.headerSubtitle}>Customize your quiz experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Difficulty Selection */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          {difficultyOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedDifficulty === option.value}
              onPress={() => setSelectedDifficulty(option.value as any)}
              type="difficulty"
            />
          ))}
        </Animatable.View>

        {/* Category Selection */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <Text style={styles.sectionTitle}>Historical Period</Text>
          {categoryOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedCategory === option.value}
              onPress={() => setSelectedCategory(option.value as any)}
              type="category"
            />
          ))}
        </Animatable.View>

        {/* Region Selection */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Text style={styles.sectionTitle}>Region Focus</Text>
          {regionOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedRegion === option.value}
              onPress={() => setSelectedRegion(option.value as any)}
              type="region"
            />
          ))}
        </Animatable.View>

        {/* Question Count */}
        <Animatable.View animation="fadeInUp" delay={800}>
          <NumberSelector
            options={questionCountOptions}
            selected={questionCount}
            onSelect={setQuestionCount}
            label="Number of Questions"
          />
        </Animatable.View>

        {/* Time Limit */}
        <Animatable.View animation="fadeInUp" delay={1000}>
          <NumberSelector
            options={timeLimitOptions}
            selected={timeLimit}
            onSelect={setTimeLimit}
            label="Time Limit (minutes)"
          />
        </Animatable.View>

        {/* Quiz Summary */}
        <Animatable.View animation="fadeInUp" delay={1200} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Quiz Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Difficulty:</Text>
            <Text style={styles.summaryValue}>{selectedDifficulty}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Period:</Text>
            <Text style={styles.summaryValue}>{selectedCategory}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Region:</Text>
            <Text style={styles.summaryValue}>{selectedRegion}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Questions:</Text>
            <Text style={styles.summaryValue}>{questionCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{timeLimit} minutes</Text>
          </View>
        </Animatable.View>

        {/* Start Quiz Button */}
        <Animatable.View animation="fadeInUp" delay={1400} style={styles.startButtonContainer}>
          <TouchableOpacity onPress={startQuizHandler} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.startButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="play-arrow" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: 10,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
    marginTop: 20,
  },
  optionCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedOptionCard: {
    borderColor: '#FF6B35',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    flex: 1,
    marginLeft: 10,
  },
  selectedOptionTitle: {
    color: '#FF6B35',
  },
  optionDescription: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginLeft: 34,
  },
  selectedOptionDescription: {
    color: isDark ? '#fff' : '#333',
  },
  numberSelectorContainer: {
    marginBottom: 20,
  },
  numberOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberOption: {
    flex: 1,
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedNumberOption: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35',
  },
  numberOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
  },
  selectedNumberOptionText: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 15,
    textAlign: 'center',
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
    textTransform: 'capitalize',
  },
  startButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default QuizSetupScreen;
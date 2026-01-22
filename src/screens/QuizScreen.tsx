import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { answerQuestion, nextQuestion, endQuiz, updateTimer } from '../store/slices/quizSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeRemaining);

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const currentQuestion = quiz.currentQuiz[quiz.currentQuestionIndex];
  const progress = (quiz.currentQuestionIndex + 1) / quiz.currentQuiz.length;
  const isLastQuestion = quiz.currentQuestionIndex === quiz.currentQuiz.length - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        dispatch(updateTimer(prev - 1));
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    Alert.alert(
      'Time\'s Up!',
      'Your quiz time has expired.',
      [
        {
          text: 'View Results',
          onPress: () => {
            dispatch(endQuiz());
            navigation.navigate('QuizResult');
          }
        }
      ]
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    dispatch(answerQuestion(answerIndex));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      dispatch(endQuiz());
      navigation.navigate('QuizResult');
    } else {
      dispatch(nextQuestion());
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleQuitQuiz = () => {
    Alert.alert(
      'Quit Quiz',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => navigation.navigate('QuizSetup')
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index ? styles.selectedOption : styles.option;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOption;
    } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return styles.incorrectOption;
    }
    return styles.option;
  };

  const getOptionTextStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index ? styles.selectedOptionText : styles.optionText;
    }
    
    if (index === currentQuestion.correctAnswer) {
      return styles.correctOptionText;
    } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return styles.incorrectOptionText;
    }
    return styles.optionText;
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleQuitQuiz} style={styles.quitButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.questionCounter}>
            Question {quiz.currentQuestionIndex + 1} of {quiz.currentQuiz.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Question */}
      <Animatable.View animation="fadeInUp" style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(currentQuestion.difficulty) }]}>
              <Text style={styles.difficultyText}>{currentQuestion.difficulty}</Text>
            </View>
            <Text style={styles.pointsText}>{currentQuestion.points} pts</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
      </Animatable.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={index * 100}
          >
            <TouchableOpacity
              onPress={() => handleAnswerSelect(index)}
              style={getOptionStyle(index)}
              disabled={showExplanation}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionNumber}>
                  <Text style={styles.optionNumberText}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={getOptionTextStyle(index)}>{option}</Text>
                {showExplanation && index === currentQuestion.correctAnswer && (
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                )}
                {showExplanation && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                  <Icon name="cancel" size={24} color="#F44336" />
                )}
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <Animatable.View animation="fadeInUp" style={styles.explanationContainer}>
          <View style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <Icon 
                name={selectedAnswer === currentQuestion.correctAnswer ? "check-circle" : "info"} 
                size={24} 
                color={selectedAnswer === currentQuestion.correctAnswer ? "#4CAF50" : "#FF6B35"} 
              />
              <Text style={styles.explanationTitle}>
                {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Explanation"}
              </Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        </Animatable.View>
      )}

      {/* Next Button */}
      {showExplanation && (
        <Animatable.View animation="fadeInUp" style={styles.nextButtonContainer}>
          <TouchableOpacity onPress={handleNextQuestion} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.nextButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </Text>
              <Icon name={isLastQuestion ? "flag" : "arrow-forward"} size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'hard': return '#F44336';
    default: return '#666';
  }
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quitButton: {
    padding: 5,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  questionCounter: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  questionContainer: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#fff' : '#333',
    lineHeight: 26,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderColor: '#FF6B35',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  optionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#F44336',
    fontWeight: '600',
  },
  explanationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  explanationCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginLeft: 10,
  },
  explanationText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 20,
  },
  nextButtonContainer: {
    padding: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  errorText: {
    fontSize: 18,
    color: isDark ? '#fff' : '#333',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default QuizScreen;
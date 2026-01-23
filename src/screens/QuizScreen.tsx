import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { answerQuestion, nextQuestion, previousQuestion, endQuiz, updateTimer } from '../store/slices/quizSlice';
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Flag,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInUp,
  FadeInRight,
  FadeInLeft,
  Layout,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  interpolate
} from 'react-native-reanimated';
import { Colors, getThemeColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeRemaining);

  const isDark = user.preferences.theme === 'dark';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(isDark, themeColors);
  const timerProgress = useSharedValue(quiz.timeRemaining / 60);

  const isStudyMode = quiz.quizMode === 'study';
  const currentQuestion = quiz.currentQuiz[quiz.currentQuestionIndex];
  const progress = (quiz.currentQuestionIndex + 1) / quiz.currentQuiz.length;
  const isLastQuestion = quiz.currentQuestionIndex === quiz.currentQuiz.length - 1;
  const isFirstQuestion = quiz.currentQuestionIndex === 0;

  useEffect(() => {
    if (isStudyMode) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        dispatch(updateTimer(prev - 1));
        timerProgress.value = withTiming((prev - 1) / 60, { duration: 1000 });
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStudyMode]);

  const handleTimeUp = () => {
    Alert.alert(
      'Time\'s Up!',
      'Your quiz time has expired.',
      [{ text: 'View Results', onPress: () => finishQuiz() }]
    );
  };

  const finishQuiz = () => {
    dispatch(endQuiz());
    navigation.navigate('QuizResult');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    dispatch(answerQuestion(answerIndex));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      dispatch(nextQuestion());
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    dispatch(previousQuestion());
    // In study mode, we can show what the user selected if we wanted, 
    // but for now let's just reset or keep it simple.
    setSelectedAnswer(quiz.userAnswers[quiz.currentQuestionIndex - 1] ?? null);
    setShowExplanation(quiz.userAnswers[quiz.currentQuestionIndex - 1] !== undefined);
  };

  const handleQuitQuiz = () => {
    Alert.alert(
      'Quit Quiz',
      'Are you sure you want to quit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.navigate('QuizSetup') }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available</Text>
      </View>
    );
  }

  const Option = ({ option, index }: { option: string, index: number }) => {
    const isCorrect = index === currentQuestion.correctAnswer;
    const isSelected = index === selectedAnswer;
    const isIncorrectSelection = isSelected && !isCorrect;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));

    let borderColor = 'transparent';
    let backgroundColor = themeColors.surface;

    if (showExplanation) {
      if (isCorrect) {
        borderColor = Colors.quiz.correct;
        backgroundColor = isDark ? '#1B2E1E' : '#E8F5E9';
      } else if (isIncorrectSelection) {
        borderColor = Colors.quiz.incorrect;
        backgroundColor = isDark ? '#3E1F1F' : '#FFEBEE';
      }
    } else if (isSelected) {
      borderColor = Colors.primary;
    }

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={[animatedStyle, styles.optionWrapper]}
      >
        <TouchableOpacity
          onPressIn={() => { if (!showExplanation) scale.value = withSpring(0.98); }}
          onPressOut={() => { if (!showExplanation) scale.value = withSpring(1); }}
          onPress={() => handleAnswerSelect(index)}
          style={[styles.option, { borderColor, backgroundColor }]}
          disabled={showExplanation}
          activeOpacity={0.9}
        >
          <View style={styles.optionContent}>
            <View style={[styles.optionIndex, {
              backgroundColor: isSelected || (showExplanation && isCorrect) ? Colors.primary : isDark ? '#2D3748' : '#F0F2F5'
            }]}>
              <Text style={[styles.optionIndexText, {
                color: isSelected || (showExplanation && isCorrect) ? '#fff' : themeColors.textSecondary
              }]}>
                {String.fromCharCode(65 + index)}
              </Text>
            </View>
            <Text style={[styles.optionText, {
              color: (showExplanation && isCorrect) ? (isDark ? '#81C784' : '#2E7D32') :
                (showExplanation && isIncorrectSelection) ? (isDark ? '#E57373' : '#C62828') :
                  themeColors.text
            }]}>
              {option}
            </Text>
            {showExplanation && (
              isCorrect ? <CheckCircle2 size={20} color={isDark ? '#81C784' : Colors.quiz.correct} /> :
                isIncorrectSelection ? <XCircle size={20} color={isDark ? '#E57373' : Colors.quiz.incorrect} /> : null
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dynamic Header */}
      <View style={styles.topSection}>
        <LinearGradient
          colors={isDark ? ['#1A1F2E', '#0F1419'] : [Colors.primary, '#E55A2B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleQuitQuiz} style={styles.iconBtn}>
              <X size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.timerWrapper}>
              <Timer size={18} color="#fff" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>

            <View style={styles.scoreBadge}>
              <Award size={16} color={Colors.warning} />
              <Text style={styles.scoreText}>{quiz.score}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Question {quiz.currentQuestionIndex + 1}/{quiz.currentQuiz.length}</Text>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}% Complete</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressIndicator, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        </LinearGradient>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        layout={Layout.springify()}
      >
        {/* Question Card */}
        <Animated.View
          entering={FadeInUp.springify()}
          key={`q-${quiz.currentQuestionIndex}`}
          style={styles.questionCard}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.difficultyTag, { backgroundColor: `${getDifficultyColor(currentQuestion.difficulty)}20` }]}>
              <Zap size={12} color={getDifficultyColor(currentQuestion.difficulty)} />
              <Text style={[styles.difficultyLabel, { color: getDifficultyColor(currentQuestion.difficulty) }]}>
                {currentQuestion.difficulty.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.ptsLabel}>+{currentQuestion.points} pts</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </Animated.View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {currentQuestion.options.map((opt, idx) => <Option key={`${quiz.currentQuestionIndex}-${idx}`} option={opt} index={idx} />)}
        </View>

        {/* Explanation Card */}
        {showExplanation && (
          <Animated.View entering={BounceIn} style={styles.explanationCard}>
            <LinearGradient
              colors={isDark ? ['#2D3748', '#1A1F2E'] : ['#F8F9FA', '#EDF2F7']}
              style={styles.explanationContent}
            >
              <View style={styles.explanationHeader}>
                <Info size={18} color={Colors.primary} />
                <Text style={styles.explanationTitle}>Detailed Explanation</Text>
              </View>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </Animated.ScrollView>

      {/* Floating Action Button */}
      {(showExplanation || isStudyMode) && (
        <Animated.View entering={FadeInUp} style={styles.footer}>
          <View style={styles.footerActions}>
            {isStudyMode && (
              <TouchableOpacity
                onPress={handlePreviousQuestion}
                style={[styles.backBtn, isFirstQuestion && { opacity: 0.5 }]}
                disabled={isFirstQuestion}
              >
                <ChevronLeft size={20} color={themeColors.text} />
                <Text style={styles.backBtnText}>Previous</Text>
              </TouchableOpacity>
            )}

            {(showExplanation || isStudyMode) && (
              <TouchableOpacity onPress={handleNextQuestion} style={styles.nextBtn}>
                <LinearGradient
                  colors={Colors.gradients.sunset}
                  style={styles.nextBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nextBtnText}>
                    {isLastQuestion ? 'Finish Attempt' : 'Continue'}
                  </Text>
                  <ArrowRight size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'hard': return '#F44336';
    default: return '#718096';
  }
};

const createStyles = (isDark: boolean, themeColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  topSection: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  scoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  progressSection: {
    gap: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  questionCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#2D3748' : '#F0F2F5',
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  difficultyLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ptsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '800',
    color: themeColors.text,
    lineHeight: 28,
  },
  optionsList: {
    gap: 12,
  },
  optionWrapper: {
    width: '100%',
  },
  option: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIndex: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  explanationCard: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? '#2D3748' : '#EDF2F7',
  },
  explanationContent: {
    padding: 20,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: themeColors.text,
  },
  explanationText: {
    fontSize: 14,
    color: themeColors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: themeColors.background,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2D3748' : '#EDF2F7',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: isDark ? '#2D3748' : '#F0F2F5',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: themeColors.text,
  },
  nextBtn: {
    flex: 1,
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  errorText: {
    fontSize: 18,
    color: themeColors.text,
    textAlign: 'center',
    marginTop: 100,
    fontWeight: '700',
  },
});

export default QuizScreen;
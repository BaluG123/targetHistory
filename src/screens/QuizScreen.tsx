import React, { useState, useEffect } from 'react';
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
import { answerQuestion, nextQuestion, endQuiz, updateTimer } from '../store/slices/quizSlice';
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Zap,
  Trophy
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Layout,
  FadeInUp,
  FadeInDown,
  BounceIn,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { quiz, user } = useSelector((state: RootState) => state);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeRemaining);

  const isDark = user.preferences.theme === 'dark';
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
  }, [dispatch]);

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
    setTimeout(() => setShowExplanation(true), 300);
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

  const getBackgroundGradient = () => {
    if (!currentQuestion) return isDark ? ['#1A1F2E', '#0F1419'] : ['#F8F9FA', '#E2E8F0'];
    switch (currentQuestion.category) {
      case 'ancient': return isDark ? ['#141E14', '#0A0F0A'] : ['#E8F5E9', '#C8E6C9'];
      case 'medieval': return isDark ? ['#1E1A14', '#140F0A'] : ['#FFF3E0', '#FFE0B2'];
      case 'modern': return isDark ? ['#141A1E', '#0A0F14'] : ['#E3F2FD', '#BBDEFB'];
      default: return isDark ? ['#1A1F2E', '#0F1419'] : ['#F8F9FA', '#E2E8F0'];
    }
  };

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={getBackgroundGradient() as any} style={styles.fullBg} />

      {/* HUD Header */}
      <View style={styles.hudHeader}>
        <View style={styles.hudTop}>
          <TouchableOpacity onPress={handleQuitQuiz} style={styles.hudIconBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.hudTimer}>
            <Timer size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.hudTimerText}>{formatTime(timeLeft)}</Text>
          </View>

          <View style={styles.hudScore}>
            <Trophy size={16} color="#FFD700" style={{ marginRight: 6 }} />
            <Text style={styles.hudScoreText}>{quiz.score}</Text>
          </View>
        </View>

        <View style={styles.hudProgress}>
          <View style={styles.hudProgressLabel}>
            <Text style={styles.hudProgressText}>QUES {quiz.currentQuestionIndex + 1}/{quiz.currentQuiz.length}</Text>
            <Text style={styles.hudProgressText}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.hudProgressBarTrack}>
            <Animated.View style={[styles.hudProgressBar, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={[styles.questionCard, isDark && { backgroundColor: '#1E1E1E' }]}>
          <View style={styles.qHeader}>
            <View style={styles.qMeta}>
              <Zap size={14} color="#FF6B35" />
              <Text style={styles.qDiff}>{currentQuestion.difficulty.toUpperCase()}</Text>
              <Text style={[styles.qPoints, isDark && { color: '#888' }]}>+{currentQuestion.points} PTS</Text>
            </View>
            <Text style={styles.qCategory}>{currentQuestion.category.toUpperCase()}</Text>
          </View>
          <Text style={[styles.questionText, isDark && { color: '#fff' }]}>{currentQuestion.question}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const isWrong = isSelected && !isCorrect;

            let cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
            let borderColor = isDark ? '#333' : '#EEE';

            if (showExplanation) {
              if (isCorrect) {
                cardBg = isDark ? '#1B2E1E' : '#E8F5E9';
                borderColor = '#4CAF50';
              } else if (isWrong) {
                cardBg = isDark ? '#3E1F1F' : '#FFEBEE';
                borderColor = '#F44336';
              }
            } else if (isSelected) {
              borderColor = '#FF6B35';
              cardBg = isDark ? '#2C201A' : '#FFF5F2';
            }

            return (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(index * 100).duration(400)}
              >
                <TouchableOpacity
                  onPress={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  activeOpacity={0.8}
                  style={[styles.optionCard, { backgroundColor: cardBg, borderColor }]}
                >
                  <View style={[styles.optionIndex, { backgroundColor: isSelected ? '#FF6B35' : (isDark ? '#333' : '#F0F0F0') }]}>
                    <Text style={[styles.optionIndexText, { color: isSelected ? '#fff' : (isDark ? '#fff' : '#666') }]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, { color: isDark ? '#fff' : '#333' }]}>{option}</Text>
                  {showExplanation && isCorrect && <CheckCircle2 size={20} color="#4CAF50" />}
                  {showExplanation && isWrong && <XCircle size={20} color="#F44336" />}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {showExplanation && (
          <Animated.View entering={BounceIn.duration(600)} style={styles.exBox}>
            <View style={styles.exHeader}>
              <Info size={16} color="#FF6B35" />
              <Text style={styles.exTitle}>Insight</Text>
            </View>
            <Text style={styles.exText}>{currentQuestion.explanation}</Text>
          </Animated.View>
        )}
      </ScrollView>

      {showExplanation && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleNextQuestion} style={styles.nextBtn}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              style={styles.nextBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextBtnText}>{isLastQuestion ? 'FINISH' : 'NEXT'}</Text>
              <ArrowRight size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullBg: {
    ...StyleSheet.absoluteFillObject,
  },
  hudHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 25,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  hudIconBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
  },
  hudTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,53,0.4)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  hudTimerText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  hudScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  hudScoreText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  hudProgress: {
    marginTop: 5,
  },
  hudProgressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hudProgressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  hudProgressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  hudProgressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 24,
    borderRadius: 28,
    marginBottom: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 24 },
      android: { elevation: 10 }
    }),
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  qMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qDiff: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF6B35',
  },
  qPoints: {
    fontSize: 12,
    fontWeight: '900',
    color: '#666',
  },
  qCategory: {
    fontSize: 11,
    fontWeight: '900',
    color: '#999',
    letterSpacing: 1.2,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 }
    }),
  },
  optionIndex: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  optionIndexText: {
    fontWeight: '900',
    fontSize: 18,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  exBox: {
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  exTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  exText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 45 : 30,
    backgroundColor: 'transparent',
  },
  nextBtn: {
    borderRadius: 30,
    overflow: 'hidden',
    height: 65,
    ...Platform.select({
      ios: { shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
      android: { elevation: 12 }
    }),
  },
  nextBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
});

export default QuizScreen;
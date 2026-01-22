import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuizQuestion {
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

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  region: string;
  date: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuiz: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: number[];
  score: number;
  isQuizActive: boolean;
  quizResults: QuizResult[];
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  selectedCategory: 'ancient' | 'medieval' | 'modern';
  selectedRegion: 'world' | 'india';
  timeRemaining: number;
  totalTime: number;
}

const initialState: QuizState = {
  questions: [],
  currentQuiz: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,
  isQuizActive: false,
  quizResults: [],
  selectedDifficulty: 'easy',
  selectedCategory: 'ancient',
  selectedRegion: 'india',
  timeRemaining: 0,
  totalTime: 0,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuizQuestion[]>) => {
      state.questions = action.payload;
    },
    startQuiz: (state, action: PayloadAction<{ questions: QuizQuestion[]; timeLimit: number }>) => {
      state.currentQuiz = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.score = 0;
      state.isQuizActive = true;
      state.timeRemaining = action.payload.timeLimit;
      state.totalTime = action.payload.timeLimit;
    },
    answerQuestion: (state, action: PayloadAction<number>) => {
      state.userAnswers[state.currentQuestionIndex] = action.payload;
      const currentQuestion = state.currentQuiz[state.currentQuestionIndex];
      if (action.payload === currentQuestion.correctAnswer) {
        state.score += currentQuestion.points;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.currentQuiz.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    endQuiz: (state) => {
      state.isQuizActive = false;
      const result: QuizResult = {
        id: Date.now().toString(),
        score: state.score,
        totalQuestions: state.currentQuiz.length,
        correctAnswers: state.userAnswers.filter((answer, index) => 
          answer === state.currentQuiz[index].correctAnswer
        ).length,
        timeSpent: state.totalTime - state.timeRemaining,
        category: state.selectedCategory,
        region: state.selectedRegion,
        date: new Date().toISOString(),
      };
      state.quizResults.push(result);
    },
    setQuizSettings: (state, action: PayloadAction<{
      difficulty: 'easy' | 'medium' | 'hard';
      category: 'ancient' | 'medieval' | 'modern';
      region: 'world' | 'india';
    }>) => {
      state.selectedDifficulty = action.payload.difficulty;
      state.selectedCategory = action.payload.category;
      state.selectedRegion = action.payload.region;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
  },
});

export const {
  setQuestions,
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  endQuiz,
  setQuizSettings,
  updateTimer,
} = quizSlice.actions;

export default quizSlice.reducer;
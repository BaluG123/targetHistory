import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'ancient' | 'medieval' | 'modern' | 'mixed';
  region: 'world' | 'india';
  points: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
  userId: string;
}

interface TestState {
  currentTest: TestQuestion[];
  currentTestId: string;
  currentTestTitle: string;
  currentQuestionIndex: number;
  userAnswers: number[];
  score: number;
  isTestActive: boolean;
  testResults: TestResult[];
  timeRemaining: number;
  totalTime: number;
  startTime: number;
}

const initialState: TestState = {
  currentTest: [],
  currentTestId: '',
  currentTestTitle: '',
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,
  isTestActive: false,
  testResults: [],
  timeRemaining: 0,
  totalTime: 0,
  startTime: 0,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    startTest: (state, action: PayloadAction<{
      testId: string;
      testTitle: string;
      questions: TestQuestion[];
      timeLimit: number;
    }>) => {
      state.currentTest = action.payload.questions;
      state.currentTestId = action.payload.testId;
      state.currentTestTitle = action.payload.testTitle;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.score = 0;
      state.isTestActive = true;
      state.timeRemaining = action.payload.timeLimit;
      state.totalTime = action.payload.timeLimit;
      state.startTime = Date.now();
    },
    answerTestQuestion: (state, action: PayloadAction<number>) => {
      state.userAnswers[state.currentQuestionIndex] = action.payload;
      const currentQuestion = state.currentTest[state.currentQuestionIndex];
      if (action.payload === currentQuestion.correctAnswer) {
        state.score += currentQuestion.points;
      }
    },
    nextTestQuestion: (state) => {
      if (state.currentQuestionIndex < state.currentTest.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousTestQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    endTest: (state) => {
      state.isTestActive = false;
      const timeSpent = Math.floor((Date.now() - state.startTime) / 1000);
      const result: TestResult = {
        id: Date.now().toString(),
        testId: state.currentTestId,
        testTitle: state.currentTestTitle,
        score: state.score,
        totalQuestions: state.currentTest.length,
        correctAnswers: state.userAnswers.filter((answer, index) =>
          answer === state.currentTest[index].correctAnswer
        ).length,
        timeSpent,
        date: new Date().toISOString(),
        userId: '', // Will be set when submitting to Firestore
      };
      state.testResults.push(result);
    },
    updateTestTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    resetTest: (state) => {
      state.currentTest = [];
      state.currentTestId = '';
      state.currentTestTitle = '';
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.score = 0;
      state.isTestActive = false;
      state.timeRemaining = 0;
      state.totalTime = 0;
      state.startTime = 0;
    },
  },
});

export const {
  startTest,
  answerTestQuestion,
  nextTestQuestion,
  previousTestQuestion,
  endTest,
  updateTestTimer,
  resetTest,
} = testSlice.actions;

export default testSlice.reducer;
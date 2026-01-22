import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slices/historySlice';
import quizReducer from './slices/quizSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    history: historyReducer,
    quiz: quizReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
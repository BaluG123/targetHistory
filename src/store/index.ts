import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slices/historySlice';
import quizReducer from './slices/quizSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    history: historyReducer,
    quiz: quizReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStats {
  totalQuizzesTaken: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  favoriteCategory: string;
  streak: number;
  lastQuizDate: string;
}

interface UserState {
  name: string;
  email: string;
  avatar?: string;
  stats: UserStats;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    soundEnabled: boolean;
    language: 'en' | 'hi';
  };
  achievements: string[];
  level: number;
  experience: number;
}

const initialState: UserState = {
  name: '',
  email: '',
  stats: {
    totalQuizzesTaken: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    favoriteCategory: 'ancient',
    streak: 0,
    lastQuizDate: '',
  },
  preferences: {
    theme: 'light',
    notifications: true,
    soundEnabled: true,
    language: 'en',
  },
  achievements: [],
  level: 1,
  experience: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<{ name: string; email: string; avatar?: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      if (action.payload.avatar) {
        state.avatar = action.payload.avatar;
      }
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    },
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      // Level up every 1000 XP
      const newLevel = Math.floor(state.experience / 1000) + 1;
      if (newLevel > state.level) {
        state.level = newLevel;
      }
    },
  },
});

export const {
  setUserProfile,
  updateStats,
  updatePreferences,
  addAchievement,
  addExperience,
} = userSlice.actions;

export default userSlice.reducer;
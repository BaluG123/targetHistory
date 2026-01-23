import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  year: number;
  category: 'ancient' | 'medieval' | 'modern';
  region: 'world' | 'india';
  latitude?: number;
  longitude?: number;
  rulers?: string[];
  significance: string;
  locationName?: string;
  imageUrl?: string;
}

export interface HistoricalPeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  keyEvents: string[];
  rulers: Ruler[];
}

export interface Ruler {
  id: string;
  name: string;
  dynasty: string;
  reignStart: number;
  reignEnd: number;
  achievements: string[];
  region: string;
  imageUrl?: string;
}

interface HistoryState {
  events: HistoricalEvent[];
  periods: HistoricalPeriod[];
  rulers: Ruler[];
  selectedCategory: 'ancient' | 'medieval' | 'modern';
  selectedRegion: 'world' | 'india';
  searchQuery: string;
  favorites: string[];
}

const initialState: HistoryState = {
  events: [],
  periods: [],
  rulers: [],
  selectedCategory: 'ancient',
  selectedRegion: 'india',
  searchQuery: '',
  favorites: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<HistoricalEvent[]>) => {
      state.events = action.payload;
    },
    setPeriods: (state, action: PayloadAction<HistoricalPeriod[]>) => {
      state.periods = action.payload;
    },
    setRulers: (state, action: PayloadAction<Ruler[]>) => {
      state.rulers = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<'ancient' | 'medieval' | 'modern'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedRegion: (state, action: PayloadAction<'world' | 'india'>) => {
      state.selectedRegion = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      if (state.favorites.includes(eventId)) {
        state.favorites = state.favorites.filter(id => id !== eventId);
      } else {
        state.favorites.push(eventId);
      }
    },
  },
});

export const {
  setEvents,
  setPeriods,
  setRulers,
  setSelectedCategory,
  setSelectedRegion,
  setSearchQuery,
  toggleFavorite,
} = historySlice.actions;

export default historySlice.reducer;
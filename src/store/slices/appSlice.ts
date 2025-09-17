import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  loading: boolean;
  error: string | null;
  offlineMode: boolean;
  theme: 'light' | 'dark';
  currency: string;
}

const initialState: AppState = {
  loading: false,
  error: null,
  offlineMode: false,
  theme: 'light',
  currency: 'USD',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setOfflineMode, 
  setTheme, 
  setCurrency, 
  clearError 
} = appSlice.actions;
export default appSlice.reducer;
